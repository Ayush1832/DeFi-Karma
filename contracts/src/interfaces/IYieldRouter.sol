// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IYieldRouter
 * @notice Interface for yield routing and donation execution
 */
interface IYieldRouter {
    /**
     * @notice Routes yield according to allocation policy
     * @param amount Total yield amount to route
     */
    function routeYield(uint256 amount) external;

    /**
     * @notice Executes donation to public goods
     * @return donatedAmount Amount actually donated
     */
    function executeDonation() external returns (uint256 donatedAmount);

    /**
     * @notice Returns the donation ratio (basis points)
     * @return Donation ratio (10000 = 100%)
     */
    function donationRatio() external view returns (uint256);

    /**
     * @notice Returns the user share ratio (basis points)
     * @return User share ratio (10000 = 100%)
     */
    function userShareRatio() external view returns (uint256);
}

