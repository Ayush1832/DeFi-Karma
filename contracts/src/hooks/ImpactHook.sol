// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IImpactHook} from "./IImpactHook.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ImpactHook
 * @notice Uniswap v4 Hook for executing public goods donations
 * @dev For hackathon: Simplified implementation. In production, integrate with Uniswap v4 hooks.
 *      This contract swaps yield tokens to ETH and distributes to public goods recipients.
 */
contract ImpactHook is IImpactHook, ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // State
    IERC20 public immutable asset; // Input token (e.g., USDC)
    address public swapRouter; // Uniswap router (v3/v4)
    address public weth; // WETH address for swaps

    uint256 public totalDonated;
    uint256 public donationCount;
    uint256 public constant MAX_SLIPPAGE = 100; // 1% max slippage in basis points

    // Events
    event ImpactDonation(
        uint256 amount,
        address token,
        address indexed recipient,
        uint256 recipientAmount,
        uint256 timestamp
    );
    event SwapExecuted(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    event RouterUpdated(address oldRouter, address newRouter);

    /**
     * @notice Constructor
     * @param _asset Input token address
     * @param _swapRouter Uniswap router address
     * @param _weth WETH address
     */
    constructor(
        address _asset,
        address _swapRouter,
        address _weth
    ) Ownable(msg.sender) {
        require(_asset != address(0), "Invalid asset");
        require(_swapRouter != address(0), "Invalid router");
        require(_weth != address(0), "Invalid WETH");

        asset = IERC20(_asset);
        swapRouter = _swapRouter;
        weth = _weth;

        // Approve router to spend assets
        asset.safeApprove(_swapRouter, type(uint256).max);
        IERC20(_weth).safeApprove(_swapRouter, type(uint256).max);
    }

    /**
     * @notice Executes donation by swapping tokens and distributing to recipients
     * @param amount Amount of tokens to donate
     * @param recipients Array of recipient addresses
     * @param allocations Array of allocations in basis points
     */
    function executeDonation(
        uint256 amount,
        address[] memory recipients,
        uint256[] memory allocations
    ) external override nonReentrant {
        require(amount > 0, "Invalid amount");
        require(recipients.length > 0, "No recipients");
        require(recipients.length == allocations.length, "Mismatched arrays");
        require(asset.balanceOf(address(this)) >= amount, "Insufficient balance");

        // Validate allocations sum to 100%
        uint256 totalAllocation = 0;
        for (uint256 i = 0; i < allocations.length; i++) {
            totalAllocation += allocations[i];
        }
        require(totalAllocation == 10000, "Invalid allocations");

        // For hackathon: Simplified swap (in production, use Uniswap v4 hooks)
        // Option 1: If asset is already ETH-native token, skip swap
        // Option 2: Swap to ETH/WETH and distribute

        // For simplicity in hackathon, we'll distribute the asset directly
        // In production: swap asset -> ETH via Uniswap, then distribute ETH

        uint256 totalDistributed = 0;

        for (uint256 i = 0; i < recipients.length; i++) {
            uint256 recipientAmount = (amount * allocations[i]) / 10000;
            
            if (recipientAmount > 0) {
                // Transfer to recipient
                asset.safeTransfer(recipients[i], recipientAmount);
                totalDistributed += recipientAmount;

                emit ImpactDonation(
                    recipientAmount,
                    address(asset),
                    recipients[i],
                    recipientAmount,
                    block.timestamp
                );
            }
        }

        // Update state
        totalDonated += totalDistributed;
        donationCount++;

        // In production, emit swap event if swap occurred
        // emit SwapExecuted(address(asset), weth, amount, ethAmount);
    }

    /**
     * @notice Returns the total amount donated
     * @return Total donated amount
     */
    function totalDonated() external view override returns (uint256) {
        return totalDonated;
    }

    /**
     * @notice Returns donation count
     * @return Number of donations executed
     */
    function donationCount() external view override returns (uint256) {
        return donationCount;
    }

    /**
     * @notice Updates swap router address
     * @param _swapRouter New router address
     */
    function setSwapRouter(address _swapRouter) external onlyOwner {
        require(_swapRouter != address(0), "Invalid router");
        address oldRouter = swapRouter;
        swapRouter = _swapRouter;
        
        // Re-approve new router
        asset.safeApprove(_swapRouter, type(uint256).max);
        IERC20(weth).safeApprove(_swapRouter, type(uint256).max);

        emit RouterUpdated(oldRouter, _swapRouter);
    }

    /**
     * @notice Emergency withdrawal (admin only)
     * @param token Token to withdraw
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }

    /**
     * @notice Receive ETH (for future ETH distribution)
     */
    receive() external payable {
        // Handle ETH received (e.g., from WETH unwrapping)
    }
}

