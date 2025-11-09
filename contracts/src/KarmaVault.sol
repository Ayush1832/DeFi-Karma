// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {IAdapter} from "./interfaces/IAdapter.sol";
import {IYieldRouter} from "./interfaces/IYieldRouter.sol";

/**
 * @title KarmaVault
 * @notice ERC-4626 compatible vault that aggregates yield from multiple DeFi protocols
 * @dev Manages deposits, withdrawals, yield tracking, and strategy allocation
 */
contract KarmaVault is ERC4626, ReentrancyGuard, Ownable, Pausable {
    using SafeERC20 for IERC20;

    // Adapter configuration
    struct AdapterConfig {
        IAdapter adapter;
        uint256 allocation; // Basis points (10000 = 100%)
        bool active;
    }

    // State variables
    IYieldRouter public yieldRouter;
    AdapterConfig[] public adapters;
    uint256 public constant MAX_ALLOCATION = 10000; // 100% in basis points
    uint256 public constant MAX_ADAPTERS = 10;

    // Events
    event AdapterAdded(address indexed adapter, uint256 allocation);
    event AdapterRemoved(address indexed adapter);
    event AdapterAllocationUpdated(address indexed adapter, uint256 oldAllocation, uint256 newAllocation);
    event YieldHarvested(uint256 totalYield, uint256 timestamp);
    event YieldRouterUpdated(address indexed oldRouter, address indexed newRouter);
    event HarvestAndDonate(uint256 totalYield, uint256 donatedAmount, uint256 userShare);

    /**
     * @notice Constructor
     * @param asset The underlying asset token (e.g., USDC)
     * @param name Vault token name
     * @param symbol Vault token symbol
     * @param _yieldRouter Address of the YieldRouter contract
     */
    constructor(
        IERC20 asset,
        string memory name,
        string memory symbol,
        address _yieldRouter
    ) ERC4626(asset) ERC20(name, symbol) Ownable(msg.sender) {
        require(address(_yieldRouter) != address(0), "Invalid yield router");
        yieldRouter = IYieldRouter(_yieldRouter);
    }

    /**
     * @notice Deposits assets into the vault and allocates to adapters
     * @param assets Amount of assets to deposit
     * @param receiver Address to receive vault shares
     * @return shares Amount of vault shares minted
     */
    function deposit(uint256 assets, address receiver)
        public
        override
        nonReentrant
        whenNotPaused
        returns (uint256 shares)
    {
        require(assets > 0, "Invalid amount");
        require(adapters.length > 0, "No adapters configured");

        // Transfer assets from user
        IERC20(asset()).safeTransferFrom(msg.sender, address(this), assets);

        // Mint shares to receiver
        shares = convertToShares(assets);
        _mint(receiver, shares);

        // Allocate assets to adapters
        _allocateToAdapters(assets);

        emit Deposit(msg.sender, receiver, assets, shares);

        return shares;
    }

    /**
     * @notice Withdraws assets from the vault
     * @param assets Amount of assets to withdraw
     * @param receiver Address to receive assets
     * @param owner Address that owns the shares
     * @return shares Amount of shares burned
     */
    function withdraw(uint256 assets, address receiver, address owner)
        public
        override
        nonReentrant
        whenNotPaused
        returns (uint256 shares)
    {
        require(assets > 0, "Invalid amount");

        shares = convertToShares(assets);
        if (msg.sender != owner) {
            _spendAllowance(owner, msg.sender, shares);
        }

        // Withdraw from adapters proportionally
        _withdrawFromAdapters(assets);

        // Burn shares
        _burn(owner, shares);

        // Transfer assets to receiver
        IERC20(asset()).safeTransfer(receiver, assets);

        emit Withdraw(msg.sender, receiver, owner, assets, shares);

        return shares;
    }

    /**
     * @notice Redeems shares for assets
     * @param shares Amount of shares to redeem
     * @param receiver Address to receive assets
     * @param owner Address that owns the shares
     * @return assets Amount of assets received
     */
    function redeem(uint256 shares, address receiver, address owner)
        public
        override
        nonReentrant
        whenNotPaused
        returns (uint256 assets)
    {
        require(shares > 0, "Invalid shares");

        assets = convertToAssets(shares);
        if (msg.sender != owner) {
            _spendAllowance(owner, msg.sender, shares);
        }

        // Withdraw from adapters proportionally
        _withdrawFromAdapters(assets);

        // Burn shares
        _burn(owner, shares);

        // Transfer assets to receiver
        IERC20(asset()).safeTransfer(receiver, assets);

        emit Withdraw(msg.sender, receiver, owner, assets, shares);

        return assets;
    }

    /**
     * @notice Calculates total assets managed by the vault
     * @return Total assets across all adapters
     */
    function totalAssets() public view override returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < adapters.length; i++) {
            if (adapters[i].active) {
                total += adapters[i].adapter.totalAssets();
            }
        }
        return total;
    }

    /**
     * @notice Harvests yield from all adapters and routes to YieldRouter
     * @return totalYield Total yield harvested
     */
    function harvest() external nonReentrant whenNotPaused returns (uint256 totalYield) {
        totalYield = 0;

        // Harvest from each adapter
        for (uint256 i = 0; i < adapters.length; i++) {
            if (adapters[i].active) {
                uint256 yield = adapters[i].adapter.harvest();
                totalYield += yield;
            }
        }

        if (totalYield > 0) {
            // Transfer yield to router
            IERC20(asset()).safeTransfer(address(yieldRouter), totalYield);

            // Route yield (router handles donation allocation)
            yieldRouter.routeYield(totalYield);

            emit YieldHarvested(totalYield, block.timestamp);
        }

        return totalYield;
    }

    /**
     * @notice Harvests yield and triggers donation in one transaction
     * @return totalYield Total yield harvested
     * @return donatedAmount Amount donated to public goods
     */
    function harvestAndDonate() external nonReentrant whenNotPaused returns (uint256 totalYield, uint256 donatedAmount) {
        totalYield = harvest();
        
        if (totalYield > 0) {
            // Router handles the donation execution
            donatedAmount = yieldRouter.executeDonation();
            uint256 userShare = totalYield - donatedAmount;

            emit HarvestAndDonate(totalYield, donatedAmount, userShare);
        }

        return (totalYield, donatedAmount);
    }

    /**
     * @notice Adds a new adapter
     * @param adapter Address of the adapter contract
     * @param allocation Allocation in basis points (10000 = 100%)
     */
    function addAdapter(IAdapter adapter, uint256 allocation) external onlyOwner {
        require(address(adapter) != address(0), "Invalid adapter");
        require(allocation > 0 && allocation <= MAX_ALLOCATION, "Invalid allocation");
        require(adapters.length < MAX_ADAPTERS, "Max adapters reached");

        // Validate total allocation doesn't exceed 100%
        uint256 currentTotal = _getTotalAllocation();
        require(currentTotal + allocation <= MAX_ALLOCATION, "Allocation exceeds 100%");

        adapters.push(AdapterConfig({
            adapter: adapter,
            allocation: allocation,
            active: true
        }));

        emit AdapterAdded(address(adapter), allocation);
    }

    /**
     * @notice Removes an adapter
     * @param index Index of the adapter to remove
     */
    function removeAdapter(uint256 index) external onlyOwner {
        require(index < adapters.length, "Invalid index");

        address adapterAddress = address(adapters[index].adapter);
        adapters[index].active = false;

        emit AdapterRemoved(adapterAddress);
    }

    /**
     * @notice Updates adapter allocation
     * @param index Index of the adapter
     * @param newAllocation New allocation in basis points
     */
    function updateAdapterAllocation(uint256 index, uint256 newAllocation) external onlyOwner {
        require(index < adapters.length, "Invalid index");
        require(newAllocation > 0 && newAllocation <= MAX_ALLOCATION, "Invalid allocation");

        AdapterConfig storage config = adapters[index];
        uint256 oldAllocation = config.allocation;

        // Validate total allocation
        uint256 currentTotal = _getTotalAllocation();
        require(currentTotal - oldAllocation + newAllocation <= MAX_ALLOCATION, "Allocation exceeds 100%");

        config.allocation = newAllocation;

        emit AdapterAllocationUpdated(address(config.adapter), oldAllocation, newAllocation);
    }

    /**
     * @notice Updates the yield router address
     * @param newRouter Address of the new yield router
     */
    function setYieldRouter(address newRouter) external onlyOwner {
        require(newRouter != address(0), "Invalid router");
        address oldRouter = address(yieldRouter);
        yieldRouter = IYieldRouter(newRouter);

        emit YieldRouterUpdated(oldRouter, newRouter);
    }

    /**
     * @notice Pauses the vault
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpauses the vault
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Returns the number of adapters
     * @return Number of adapters
     */
    function getAdapterCount() external view returns (uint256) {
        return adapters.length;
    }

    /**
     * @notice Returns adapter info at index
     * @param index Index of the adapter
     * @return adapter Address of the adapter
     * @return allocation Allocation in basis points
     * @return active Whether the adapter is active
     */
    function getAdapter(uint256 index) external view returns (address adapter, uint256 allocation, bool active) {
        require(index < adapters.length, "Invalid index");
        AdapterConfig memory config = adapters[index];
        return (address(config.adapter), config.allocation, config.active);
    }

    // Internal functions

    /**
     * @notice Allocates assets to adapters based on their allocation percentages
     * @param totalAmount Total amount to allocate
     */
    function _allocateToAdapters(uint256 totalAmount) internal {
        for (uint256 i = 0; i < adapters.length; i++) {
            if (adapters[i].active) {
                uint256 adapterAmount = (totalAmount * adapters[i].allocation) / MAX_ALLOCATION;
                if (adapterAmount > 0) {
                    IERC20(asset()).safeApprove(address(adapters[i].adapter), adapterAmount);
                    adapters[i].adapter.deposit(adapterAmount);
                }
            }
        }
    }

    /**
     * @notice Withdraws assets from adapters proportionally
     * @param totalAmount Total amount to withdraw
     */
    function _withdrawFromAdapters(uint256 totalAmount) internal {
        uint256 totalAssets_ = totalAssets();
        if (totalAssets_ == 0) return;

        for (uint256 i = 0; i < adapters.length; i++) {
            if (adapters[i].active) {
                uint256 adapterAssets = adapters[i].adapter.totalAssets();
                uint256 adapterAmount = (totalAmount * adapterAssets) / totalAssets_;

                if (adapterAmount > 0 && adapterAmount <= adapterAssets) {
                    adapters[i].adapter.withdraw(adapterAmount);
                }
            }
        }
    }

    /**
     * @notice Gets the total allocation across all adapters
     * @return Total allocation in basis points
     */
    function _getTotalAllocation() internal view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < adapters.length; i++) {
            if (adapters[i].active) {
                total += adapters[i].allocation;
            }
        }
        return total;
    }
}
