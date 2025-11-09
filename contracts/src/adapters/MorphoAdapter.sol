// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IAdapter} from "../interfaces/IAdapter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MorphoAdapter
 * @notice Adapter for Morpho v2 yield optimization protocol
 * @dev Integrates with Morpho v2 vaults for optimized lending yields
 */
contract MorphoAdapter is IAdapter, ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Morpho v2 interfaces
    IERC20 public immutable asset;
    address public morphoVault; // Morpho ERC-4626 vault
    address public morphoMarket;

    // State
    string public constant override protocolName = "Morpho v2";
    uint256 private _totalAssets;
    uint256 private _totalSupply;
    uint256 public yieldMultiplier = 110; // 110% of base yield (10% optimization)

    // Events
    event Deposited(uint256 amount, uint256 shares);
    event Withdrawn(uint256 shares, uint256 amount);
    event Harvested(uint256 yield);
    event YieldMultiplierUpdated(uint256 oldMultiplier, uint256 newMultiplier);

    /**
     * @notice Constructor
     * @param _asset Underlying asset token
     * @param _morphoVault Morpho vault address
     * @param _morphoMarket Morpho market address
     */
    constructor(
        address _asset,
        address _morphoVault,
        address _morphoMarket
    ) Ownable(msg.sender) {
        require(_asset != address(0), "Invalid asset");
        require(_morphoVault != address(0), "Invalid vault");
        require(_morphoMarket != address(0), "Invalid market");

        asset = IERC20(_asset);
        morphoVault = _morphoVault;
        morphoMarket = _morphoMarket;

        // Approve vault to spend assets
        asset.safeApprove(_morphoVault, type(uint256).max);
    }

    /**
     * @notice Deposits assets into Morpho
     * @param amount Amount of assets to deposit
     * @return shares Amount of adapter shares received
     */
    function deposit(uint256 amount) external override nonReentrant returns (uint256 shares) {
        require(amount > 0, "Invalid amount");

        // Transfer assets from caller
        asset.safeTransferFrom(msg.sender, address(this), amount);

        // Deposit to Morpho (simplified for hackathon)
        // In production: use Morpho vault deposit
        shares = amount; // 1:1 for simplicity

        // Update state
        _totalAssets += amount;
        _totalSupply += shares;

        emit Deposited(amount, shares);
        return shares;
    }

    /**
     * @notice Withdraws assets from Morpho
     * @param shares Amount of adapter shares to withdraw
     * @return assets Amount of assets received
     */
    function withdraw(uint256 shares) external override nonReentrant returns (uint256 assets) {
        require(shares > 0, "Invalid shares");
        require(shares <= _totalSupply, "Insufficient shares");

        assets = convertToAssets(shares);

        // Update state
        _totalSupply -= shares;
        _totalAssets -= assets;

        // Withdraw from Morpho (simplified)
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
     * @notice Harvests yield from Morpho (with optimization bonus)
     * @return yield Amount of yield harvested
     */
    function harvest() external override nonReentrant returns (uint256 yield) {
        uint256 currentBalance = _totalAssets;
        
        // Morpho typically provides slightly higher yield due to optimization
        // Simulate yield with multiplier applied
        uint256 baseYield = (currentBalance * 30) / 10000000; // Base yield
        yield = (baseYield * yieldMultiplier) / 100; // Apply multiplier

        if (yield > 0) {
            _totalAssets += yield;
            emit Harvested(yield);
        }

        return yield;
    }

    /**
     * @notice Updates yield multiplier (admin only)
     * @param _multiplier New multiplier (100 = 100%, 110 = 110%)
     */
    function setYieldMultiplier(uint256 _multiplier) external onlyOwner {
        require(_multiplier >= 100 && _multiplier <= 150, "Invalid multiplier");
        uint256 oldMultiplier = yieldMultiplier;
        yieldMultiplier = _multiplier;
        emit YieldMultiplierUpdated(oldMultiplier, _multiplier);
    }
}

