// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockYieldProtocol
 * @notice Simple mock yield protocol for testing adapters on testnet
 * @dev Simulates yield generation for Morpho, Spark, Yearn when not on testnet
 *      This is a simplified ERC20-based mock, not a full ERC-4626 vault
 */
contract MockYieldProtocol is ERC20, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable asset;
    uint256 public constant ANNUAL_YIELD_BPS = 500; // 5% APY
    uint256 public constant SECONDS_PER_YEAR = 365 days;
    uint256 public lastUpdateTime;
    uint256 public yieldRate; // Yield per second
    uint256 public totalAssetsDeposited;

    event YieldGenerated(uint256 amount, uint256 timestamp);
    event AssetsDeposited(uint256 amount, address depositor);
    event AssetsWithdrawn(uint256 amount, address withdrawer);

    constructor(
        address asset_,
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) Ownable(msg.sender) {
        asset = IERC20(asset_);
        lastUpdateTime = block.timestamp;
        // Calculate yield per second: 5% APY
        yieldRate = (ANNUAL_YIELD_BPS * 1e18) / SECONDS_PER_YEAR / 10000;
    }

    /**
     * @notice Deposit assets and receive shares (1:1 initially)
     */
    function deposit(uint256 assets, address receiver) external returns (uint256 shares) {
        require(assets > 0, "Invalid amount");
        
        _updateYield();
        
        asset.safeTransferFrom(msg.sender, address(this), assets);
        totalAssetsDeposited += assets;
        
        // Calculate shares (1:1 initially, but increases with yield)
        if (totalSupply() == 0 || totalAssetsDeposited == 0) {
            shares = assets;
        } else {
            shares = (assets * totalSupply()) / totalAssetsDeposited;
        }
        
        _mint(receiver, shares);
        emit AssetsDeposited(assets, receiver);
        return shares;
    }

    /**
     * @notice Withdraw assets by burning shares
     */
    function withdraw(uint256 assets, address receiver, address owner) external returns (uint256 shares) {
        require(assets > 0, "Invalid amount");
        
        _updateYield();
        
        // Calculate shares needed
        if (totalSupply() == 0) {
            shares = assets;
        } else {
            shares = (assets * totalSupply()) / totalAssetsDeposited;
        }
        
        if (msg.sender != owner) {
            _spendAllowance(owner, msg.sender, shares);
        }
        
        _burn(owner, shares);
        totalAssetsDeposited -= assets;
        
        asset.safeTransfer(receiver, assets);
        emit AssetsWithdrawn(assets, receiver);
        return shares;
    }

    /**
     * @notice Mint shares for assets
     */
    function mint(uint256 shares, address receiver) external returns (uint256 assets) {
        require(shares > 0, "Invalid shares");
        
        _updateYield();
        
        // Calculate assets needed
        if (totalSupply() == 0) {
            assets = shares;
        } else {
            assets = (shares * totalAssetsDeposited) / totalSupply();
        }
        
        asset.safeTransferFrom(msg.sender, address(this), assets);
        totalAssetsDeposited += assets;
        
        _mint(receiver, shares);
        return assets;
    }

    /**
     * @notice Redeem shares for assets
     */
    function redeem(uint256 shares, address receiver, address owner) external returns (uint256 assets) {
        require(shares > 0, "Invalid shares");
        
        _updateYield();
        
        // Calculate assets to return
        if (totalSupply() == 0) {
            assets = shares;
        } else {
            assets = (shares * totalAssetsDeposited) / totalSupply();
        }
        
        if (msg.sender != owner) {
            _spendAllowance(owner, msg.sender, shares);
        }
        
        _burn(owner, shares);
        totalAssetsDeposited -= assets;
        
        asset.safeTransfer(receiver, assets);
        return assets;
    }

    /**
     * @notice Total assets including accrued yield
     */
    function totalAssets() external view returns (uint256) {
        uint256 timeElapsed = block.timestamp - lastUpdateTime;
        
        if (timeElapsed > 0 && totalAssetsDeposited > 0) {
            uint256 accruedYield = (totalAssetsDeposited * yieldRate * timeElapsed) / 1e18;
            return totalAssetsDeposited + accruedYield;
        }
        return totalAssetsDeposited;
    }

    /**
     * @notice Convert assets to shares
     */
    function convertToShares(uint256 assets) external view returns (uint256) {
        uint256 currentAssets = this.totalAssets();
        if (currentAssets == 0 || totalSupply() == 0) {
            return assets;
        }
        return (assets * totalSupply()) / currentAssets;
    }

    /**
     * @notice Convert shares to assets
     */
    function convertToAssets(uint256 shares) external view returns (uint256) {
        uint256 currentAssets = this.totalAssets();
        if (totalSupply() == 0) {
            return shares;
        }
        return (shares * currentAssets) / totalSupply();
    }

    /**
     * @notice Update yield based on time elapsed
     */
    function _updateYield() internal {
        uint256 timeElapsed = block.timestamp - lastUpdateTime;
        if (timeElapsed > 0 && totalAssetsDeposited > 0) {
            uint256 yield = (totalAssetsDeposited * yieldRate * timeElapsed) / 1e18;
            if (yield > 0) {
                totalAssetsDeposited += yield;
                lastUpdateTime = block.timestamp;
                emit YieldGenerated(yield, block.timestamp);
            }
        } else if (timeElapsed > 0) {
            lastUpdateTime = block.timestamp;
        }
    }

    /**
     * @notice Manually trigger yield update
     */
    function updateYield() external {
        _updateYield();
    }

    /**
     * @notice Set yield rate (owner only, for testing)
     */
    function setYieldRate(uint256 newYieldRate) external onlyOwner {
        _updateYield();
        yieldRate = newYieldRate;
    }
}
