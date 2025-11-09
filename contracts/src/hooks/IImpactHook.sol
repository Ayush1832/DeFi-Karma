// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IImpactHook
 * @notice Interface for Uniswap v4 Impact Hook (simplified for hackathon)
 * @dev In production, this would integrate with Uniswap v4 hooks
 */
interface IImpactHook {
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
    ) external;

    /**
     * @notice Returns the total amount donated
     * @return Total donated amount
     */
    function totalDonated() external view returns (uint256);

    /**
     * @notice Returns donation count
     * @return Number of donations executed
     */
    function donationCount() external view returns (uint256);
}

