// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IAdapter} from "../interfaces/IAdapter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title KalaniStrategy
 * @notice Adapter for Kalani (Yearn v3) tokenized strategies
 * @dev Wraps positions into Yearn v3 tokenized strategies for auto-compounding
 */
contract KalaniStrategy is IAdapter, ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Yearn v3 / Kalani interfaces
    IERC20 public immutable asset;
    address public strategy; // Yearn v3 tokenized strategy
    address public vault; // Yearn vault

    // State
    string public constant override protocolName = "Kalani (Yearn v3)";
    uint256 private _totalAssets;
    uint256 private _totalSupply;
    uint256 public compoundFrequency = 1 days; // Auto-compound frequency
    uint256 public lastCompoundTime;

    // Events
    event Deposited(uint256 amount, uint256 shares);
    event Withdrawn(uint256 shares, uint256 amount);
    event Harvested(uint256 yield);
    event Compounded(uint256 amount, uint256 timestamp);

    /**
     * @notice Constructor
     * @param _asset Underlying asset token
     * @param _strategy Yearn v3 strategy address
     * @param _vault Yearn vault address
     */
    constructor(
        address _asset,
        address _strategy,
        address _vault
    ) Ownable(msg.sender) {
        require(_asset != address(0), "Invalid asset");
        require(_strategy != address(0), "Invalid strategy");
        require(_vault != address(0), "Invalid vault");

        asset = IERC20(_asset);
        strategy = _strategy;
        vault = _vault;

        asset.safeApprove(_vault, type(uint256).max);
        lastCompoundTime = block.timestamp;
    }

    /**
     * @notice Deposits assets into Kalani strategy
     * @param amount Amount of assets to deposit
     * @return shares Amount of adapter shares received
     */
    function deposit(uint256 amount) external override nonReentrant returns (uint256 shares) {
        require(amount > 0, "Invalid amount");

        asset.safeTransferFrom(msg.sender, address(this), amount);

        // Auto-compound before deposit if needed
        if (block.timestamp >= lastCompoundTime + compoundFrequency) {
            _compound();
        }

        // Deposit to Yearn v3 (simplified)
        shares = amount;

        _totalAssets += amount;
        _totalSupply += shares;

        emit Deposited(amount, shares);
        return shares;
    }

    /**
     * @notice Withdraws assets from Kalani strategy
     * @param shares Amount of adapter shares to withdraw
     * @return assets Amount of assets received
     */
    function withdraw(uint256 shares) external override nonReentrant returns (uint256 assets) {
        require(shares > 0, "Invalid shares");
        require(shares <= _totalSupply, "Insufficient shares");

        // Compound before withdrawal
        if (block.timestamp >= lastCompoundTime + compoundFrequency) {
            _compound();
        }

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
     * @notice Harvests and compounds yield from Kalani strategy
     * @return yield Amount of yield harvested
     */
    function harvest() external override nonReentrant returns (uint256 yield) {
        uint256 beforeAssets = _totalAssets;
        
        // Compound if needed
        if (block.timestamp >= lastCompoundTime + compoundFrequency) {
            _compound();
        }

        // Calculate yield from compounding
        if (_totalAssets > beforeAssets) {
            yield = _totalAssets - beforeAssets;
            emit Harvested(yield);
        }

        return yield;
    }

    /**
     * @notice Internal function to compound yield
     */
    function _compound() internal {
        uint256 beforeAssets = _totalAssets;
        
        // Simulate compounding effect (reinvest yield)
        // In production: call strategy.harvest() and reinvest
        uint256 yield = (beforeAssets * 30) / 10000000; // Daily yield
        
        if (yield > 0) {
            _totalAssets += yield;
            lastCompoundTime = block.timestamp;
            emit Compounded(yield, block.timestamp);
        }
    }

    /**
     * @notice Manually trigger compounding (admin or keeper)
     */
    function compound() external {
        require(
            block.timestamp >= lastCompoundTime + compoundFrequency,
            "Too early to compound"
        );
        _compound();
    }

    /**
     * @notice Updates compound frequency (admin only)
     * @param _frequency New frequency in seconds
     */
    function setCompoundFrequency(uint256 _frequency) external onlyOwner {
        require(_frequency >= 1 hours, "Frequency too low");
        compoundFrequency = _frequency;
    }
}

