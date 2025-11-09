// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IAdapter} from "../interfaces/IAdapter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AaveAdapter
 * @notice Adapter for Aave v3 lending protocol
 * @dev Integrates with Aave v3 aToken vaults (ERC-4626 compatible)
 */
contract AaveAdapter is IAdapter, ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Aave v3 interfaces (simplified for hackathon)
    // In production, use official Aave interfaces
    IERC20 public immutable asset;
    IERC20 public aToken; // Aave aToken (ERC-4626 vault)
    address public lendingPool;

    // State
    string public constant override protocolName = "Aave v3";
    uint256 private _totalAssets;
    uint256 private _totalSupply;

    // Events
    event Deposited(uint256 amount, uint256 shares);
    event Withdrawn(uint256 shares, uint256 amount);
    event Harvested(uint256 yield);

    /**
     * @notice Constructor
     * @param _asset Underlying asset token (e.g., USDC)
     * @param _aToken Aave aToken address (ERC-4626 vault)
     * @param _lendingPool Aave lending pool address
     */
    constructor(
        address _asset,
        address _aToken,
        address _lendingPool
    ) Ownable(msg.sender) {
        require(_asset != address(0), "Invalid asset");
        require(_aToken != address(0), "Invalid aToken");
        require(_lendingPool != address(0), "Invalid lending pool");

        asset = IERC20(_asset);
        aToken = IERC20(_aToken);
        lendingPool = _lendingPool;

        // Approve lending pool to spend assets (OpenZeppelin v5 uses forceApprove)
        asset.forceApprove(_lendingPool, type(uint256).max);
    }

    /**
     * @notice Deposits assets into Aave
     * @param amount Amount of assets to deposit
     * @return shares Amount of adapter shares received
     */
    function deposit(uint256 amount) external override nonReentrant returns (uint256 shares) {
        require(amount > 0, "Invalid amount");

        // Transfer assets from caller
        asset.safeTransferFrom(msg.sender, address(this), amount);

        // Deposit to Aave (simplified - in production use proper Aave interface)
        // For hackathon: simulate by minting shares 1:1
        // In production: use aToken.deposit(amount, address(this))
        shares = amount; // Simplified: 1:1 shares for now

        // Update state
        _totalAssets += amount;
        _totalSupply += shares;

        // In production, approve aToken for vault deposit
        // asset.safeApprove(address(aTokenVault), amount);
        // aTokenVault.deposit(amount, address(this));

        emit Deposited(amount, shares);
        return shares;
    }

    /**
     * @notice Withdraws assets from Aave
     * @param shares Amount of adapter shares to withdraw
     * @return assets Amount of assets received
     */
    function withdraw(uint256 shares) external override nonReentrant returns (uint256 assets) {
        require(shares > 0, "Invalid shares");
        require(shares <= _totalSupply, "Insufficient shares");

        // Calculate assets to withdraw
        assets = convertToAssets(shares);

        // Update state
        _totalSupply -= shares;
        _totalAssets -= assets;

        // Withdraw from Aave (simplified)
        // In production: use aToken.withdraw(assets, msg.sender, address(this))

        // Transfer assets to caller
        asset.safeTransfer(msg.sender, assets);

        emit Withdrawn(shares, assets);
        return assets;
    }

    /**
     * @notice Returns total assets managed by this adapter
     * @return Total assets value
     */
    function totalAssets() external view override returns (uint256) {
        // In production: return aToken.balanceOf(address(this)) * exchangeRate
        return _totalAssets;
    }

    /**
     * @notice Returns total supply of adapter shares
     * @return Total shares
     */
    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    /**
     * @notice Converts shares to assets
     * @param shares Amount of shares
     * @return assets Equivalent amount of assets
     */
    function convertToAssets(uint256 shares) public view override returns (uint256) {
        if (_totalSupply == 0) return shares;
        return (shares * _totalAssets) / _totalSupply;
    }

    /**
     * @notice Converts assets to shares
     * @param assets Amount of assets
     * @return shares Equivalent amount of shares
     */
    function convertToShares(uint256 assets) public view override returns (uint256) {
        if (_totalAssets == 0) return assets;
        return (assets * _totalSupply) / _totalAssets;
    }

    /**
     * @notice Harvests yield from Aave
     * @return yield Amount of yield harvested
     */
    function harvest() external override nonReentrant returns (uint256 yield) {
        // In production: check aToken balance vs expected, harvest difference
        // For hackathon: simulate small yield generation
        uint256 currentBalance = _totalAssets;
        
        // Simulate yield (1% APY = ~0.0027% daily)
        // In production: yield = aToken.balanceOf(address(this)) - expectedBalance
        yield = (currentBalance * 27) / 10000000; // ~0.00027% daily yield simulation

        if (yield > 0) {
            _totalAssets += yield;
            emit Harvested(yield);
        }

        return yield;
    }

    /**
     * @notice Updates aToken address (admin only)
     * @param _aToken New aToken address
     */
    function setAToken(address _aToken) external onlyOwner {
        require(_aToken != address(0), "Invalid aToken");
        aToken = IERC20(_aToken);
    }

    /**
     * @notice Updates lending pool address (admin only)
     * @param _lendingPool New lending pool address
     */
    function setLendingPool(address _lendingPool) external onlyOwner {
        require(_lendingPool != address(0), "Invalid lending pool");
        lendingPool = _lendingPool;
        asset.forceApprove(_lendingPool, type(uint256).max);
    }
}

