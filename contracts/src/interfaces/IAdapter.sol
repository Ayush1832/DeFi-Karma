// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IAdapter
 * @notice Interface for yield-generating protocol adapters
 */
interface IAdapter {
    /**
     * @notice Deposits assets into the adapter's underlying protocol
     * @param amount Amount of assets to deposit
     * @return shares Amount of adapter shares received
     */
    function deposit(uint256 amount) external returns (uint256 shares);

    /**
     * @notice Withdraws assets from the adapter's underlying protocol
     * @param shares Amount of adapter shares to withdraw
     * @return assets Amount of assets received
     */
    function withdraw(uint256 shares) external returns (uint256 assets);

    /**
     * @notice Returns the total assets managed by this adapter
     * @return Total assets value
     */
    function totalAssets() external view returns (uint256);

    /**
     * @notice Returns the total supply of adapter shares
     * @return Total shares
     */
    function totalSupply() external view returns (uint256);

    /**
     * @notice Converts shares to assets
     * @param shares Amount of shares
     * @return assets Equivalent amount of assets
     */
    function convertToAssets(uint256 shares) external view returns (uint256);

    /**
     * @notice Converts assets to shares
     * @param assets Amount of assets
     * @return shares Equivalent amount of shares
     */
    function convertToShares(uint256 assets) external view returns (uint256);

    /**
     * @notice Harvests yield from the underlying protocol
     * @return yield Amount of yield harvested
     */
    function harvest() external returns (uint256 yield);

    /**
     * @notice Returns the protocol name
     * @return Protocol name
     */
    function protocolName() external pure returns (string memory);
}

