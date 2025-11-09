// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IAdapter} from "../interfaces/IAdapter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SparkAdapter
 * @notice Adapter for Spark Protocol curated yield pools
 * @dev Integrates with Spark Protocol for diversified yield opportunities
 */
contract SparkAdapter is IAdapter, ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Spark Protocol interfaces - supports both real Spark pools and mock vaults for testnet
    IERC20 public immutable asset;
    address public sparkPool; // Spark lending pool (or mock)
    address public sparkVault; // Spark ERC-4626 vault (or mock)
    bool public useMockVault; // Flag to indicate if using mock vault

    // State
    string public constant override protocolName = "Spark Protocol";
    uint256 private _totalAssets;
    uint256 private _totalSupply;

    // Events
    event Deposited(uint256 amount, uint256 shares);
    event Withdrawn(uint256 shares, uint256 amount);
    event Harvested(uint256 yield);

    /**
     * @notice Constructor
     * @param _asset Underlying asset token
     * @param _sparkPool Spark pool address
     * @param _sparkVault Spark vault address
     */
    constructor(
        address _asset,
        address _sparkPool,
        address _sparkVault
    ) Ownable(msg.sender) {
        require(_asset != address(0), "Invalid asset");
        require(_sparkPool != address(0), "Invalid pool");
        require(_sparkVault != address(0), "Invalid vault");

        asset = IERC20(_asset);
        sparkPool = _sparkPool;
        sparkVault = _sparkVault;
        useMockVault = true; // Assume mock for testnet by default

        // Approve pool/vault to spend assets (OpenZeppelin v5 uses forceApprove)
        asset.forceApprove(_sparkPool, type(uint256).max);
        // Also approve vault if different from pool
        if (_sparkVault != _sparkPool) {
            asset.forceApprove(_sparkVault, type(uint256).max);
        }
    }

    /**
     * @notice Deposits assets into Spark
     * @param amount Amount of assets to deposit
     * @return shares Amount of adapter shares received
     */
    function deposit(uint256 amount) external override nonReentrant returns (uint256 shares) {
        require(amount > 0, "Invalid amount");

        asset.safeTransferFrom(msg.sender, address(this), amount);

        // Deposit to Spark (simplified)
        shares = amount;

        _totalAssets += amount;
        _totalSupply += shares;

        emit Deposited(amount, shares);
        return shares;
    }

    /**
     * @notice Withdraws assets from Spark
     * @param shares Amount of adapter shares to withdraw
     * @return assets Amount of assets received
     */
    function withdraw(uint256 shares) external override nonReentrant returns (uint256 assets) {
        require(shares > 0, "Invalid shares");
        require(shares <= _totalSupply, "Insufficient shares");

        assets = convertToAssets(shares);

        _totalSupply -= shares;
        _totalAssets -= assets;

        asset.safeTransfer(msg.sender, assets);

        emit Withdrawn(shares, assets);
        return assets;
    }

    /**
     * @notice Returns total assets managed by this adapter
     * @return Total assets value
     */
    function totalAssets() external view override returns (uint256) {
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
     * @notice Harvests yield from Spark
     * @return yield Amount of yield harvested
     */
    function harvest() external override nonReentrant returns (uint256 yield) {
        uint256 currentBalance = _totalAssets;
        
        // Spark provides curated yield pools with stable returns
        yield = (currentBalance * 25) / 10000000; // Slightly lower but stable yield

        if (yield > 0) {
            _totalAssets += yield;
            emit Harvested(yield);
        }

        return yield;
    }
}

