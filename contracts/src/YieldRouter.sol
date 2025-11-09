// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IYieldRouter} from "./interfaces/IYieldRouter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IImpactHook} from "./hooks/IImpactHook.sol";

/**
 * @title YieldRouter
 * @notice Routes harvested yield between users and public goods donations
 * @dev Implements configurable allocation policy (e.g., 80% users, 20% donations)
 */
contract YieldRouter is IYieldRouter, ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Configuration
    IERC20 public immutable asset;
    IImpactHook public impactHook;
    uint256 private _donationRatio; // Basis points (2000 = 20%)
    uint256 private _userShareRatio; // Basis points (8000 = 80%)
    uint256 public constant MAX_RATIO = 10000; // 100%

    // State
    uint256 public totalYieldRouted;
    uint256 public totalDonated;
    uint256 public totalUserShare;

    // Public goods recipients
    address[] public recipients;
    uint256[] public recipientAllocations; // Basis points per recipient

    // Events
    event YieldRouted(uint256 totalYield, uint256 userShare, uint256 donationAmount);
    event DonationExecuted(uint256 amount, address recipient, uint256 timestamp);
    event DonationRatioUpdated(uint256 oldRatio, uint256 newRatio);
    event RecipientAdded(address recipient, uint256 allocation);
    event RecipientRemoved(address recipient);
    event ImpactHookUpdated(address oldHook, address newHook);

    /**
     * @notice Constructor
     * @param _asset Underlying asset token
     * @param _impactHook Address of ImpactHook contract
     * @param initialDonationRatio Donation ratio in basis points (default: 2000 = 20%)
     */
    constructor(
        address _asset,
        address _impactHook,
        uint256 initialDonationRatio
    ) Ownable(msg.sender) {
        require(_asset != address(0), "Invalid asset");
        require(_impactHook != address(0), "Invalid hook");
        require(initialDonationRatio <= MAX_RATIO, "Invalid donation ratio");

        asset = IERC20(_asset);
        impactHook = IImpactHook(_impactHook);
        _donationRatio = initialDonationRatio;
        _userShareRatio = MAX_RATIO - initialDonationRatio;
    }

    /**
     * @notice Routes yield according to allocation policy
     * @param amount Total yield amount to route
     */
    function routeYield(uint256 amount) external override nonReentrant {
        require(amount > 0, "Invalid amount");
        require(asset.balanceOf(address(this)) >= amount, "Insufficient balance");

        // Calculate allocations
        uint256 donationAmount = (amount * _donationRatio) / MAX_RATIO;
        uint256 userShareAmount = amount - donationAmount;

        // Update state
        totalYieldRouted += amount;
        totalDonated += donationAmount;
        totalUserShare += userShareAmount;

        // Transfer user share back to vault (caller) - this increases vault assets
        // The caller (vault) receives the user share to increase share value
        if (userShareAmount > 0) {
            asset.safeTransfer(msg.sender, userShareAmount);
        }

        // Donation amount remains in router for executeDonation()
        emit YieldRouted(amount, userShareAmount, donationAmount);
    }

    /**
     * @notice Executes donation to public goods via ImpactHook
     * @return donatedAmount Amount actually donated
     */
    function executeDonation() external override nonReentrant returns (uint256 donatedAmount) {
        // For simplicity, donate all pending donations from router balance
        donatedAmount = asset.balanceOf(address(this));

        if (donatedAmount > 0 && recipients.length > 0) {
            // Approve hook to spend assets (OpenZeppelin v5 uses forceApprove)
            asset.forceApprove(address(impactHook), donatedAmount);

            // Execute donation through hook
            impactHook.executeDonation(donatedAmount, recipients, recipientAllocations);

            emit DonationExecuted(donatedAmount, address(impactHook), block.timestamp);
        }

        return donatedAmount;
    }

    /**
     * @notice Returns the donation ratio
     * @return Donation ratio in basis points
     */
    function donationRatio() external view override returns (uint256) {
        return _donationRatio;
    }

    /**
     * @notice Returns the user share ratio
     * @return User share ratio in basis points
     */
    function userShareRatio() external view override returns (uint256) {
        return _userShareRatio;
    }

    /**
     * @notice Updates donation ratio
     * @param newDonationRatio New donation ratio in basis points
     */
    function setDonationRatio(uint256 newDonationRatio) external onlyOwner {
        require(newDonationRatio <= MAX_RATIO, "Invalid ratio");
        uint256 oldRatio = _donationRatio;
        _donationRatio = newDonationRatio;
        _userShareRatio = MAX_RATIO - newDonationRatio;

        emit DonationRatioUpdated(oldRatio, _donationRatio);
    }

    /**
     * @notice Adds a public goods recipient
     * @param recipient Address of the recipient
     * @param allocation Allocation in basis points (must sum to 100% across all recipients)
     */
    function addRecipient(address recipient, uint256 allocation) external onlyOwner {
        require(recipient != address(0), "Invalid recipient");
        require(allocation > 0 && allocation <= MAX_RATIO, "Invalid allocation");

        recipients.push(recipient);
        recipientAllocations.push(allocation);

        emit RecipientAdded(recipient, allocation);
    }

    /**
     * @notice Removes a recipient
     * @param index Index of the recipient to remove
     */
    function removeRecipient(uint256 index) external onlyOwner {
        require(index < recipients.length, "Invalid index");

        address recipient = recipients[index];
        recipients[index] = recipients[recipients.length - 1];
        recipients.pop();
        recipientAllocations[index] = recipientAllocations[recipientAllocations.length - 1];
        recipientAllocations.pop();

        emit RecipientRemoved(recipient);
    }

    /**
     * @notice Updates ImpactHook address
     * @param _impactHook New ImpactHook address
     */
    function setImpactHook(address _impactHook) external onlyOwner {
        require(_impactHook != address(0), "Invalid hook");
        address oldHook = address(impactHook);
        impactHook = IImpactHook(_impactHook);

        emit ImpactHookUpdated(oldHook, _impactHook);
    }

    /**
     * @notice Returns number of recipients
     * @return Number of recipients
     */
    function recipientCount() external view returns (uint256) {
        return recipients.length;
    }

    /**
     * @notice Returns number of recipients (alias for recipientCount)
     * @return Number of recipients
     */
    function getRecipientCount() external view returns (uint256) {
        return recipients.length;
    }

    /**
     * @notice Returns recipient info at index
     * @param index Index of the recipient
     * @return recipient Address of the recipient
     * @return allocation Allocation in basis points
     */
    function getRecipient(uint256 index) external view returns (address recipient, uint256 allocation) {
        require(index < recipients.length, "Invalid index");
        return (recipients[index], recipientAllocations[index]);
    }

    /**
     * @notice Emergency withdrawal (admin only)
     * @param token Token to withdraw
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }
}

