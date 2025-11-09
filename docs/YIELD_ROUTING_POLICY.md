# Yield Routing Policy - DeFi Karma

## Overview

DeFi Karma implements a programmatic yield allocation strategy that automatically routes a portion of generated yield to public goods while maintaining user returns. This document describes the policy, mechanism, and implementation.

## Policy Description

### Allocation Ratio

- **User Share**: 80% of harvested yield
- **Donation Share**: 20% of harvested yield

This ratio is configurable by the contract owner and can be adjusted based on governance decisions.

### Yield Sources

Yield is aggregated from multiple DeFi protocols:
1. **Aave v3**: Stable lending yield (50% allocation)
2. **Morpho v2**: Optimized lending yield (30% allocation)
3. **Spark Protocol**: Curated yield pools (20% allocation)

### Routing Mechanism

1. **Harvest Phase**: 
   - Yield is harvested from all adapters
   - Total yield is calculated and transferred to YieldRouter

2. **Allocation Phase**:
   - YieldRouter calculates user share (80%) and donation share (20%)
   - User share is kept in router for distribution (increases vault share value)
   - Donation share is sent to ImpactHook

3. **Donation Phase**:
   - ImpactHook receives donation amount
   - Funds are distributed to public goods recipients:
     - 50% to Gitcoin
     - 50% to Protocol Guild

## Implementation

### YieldRouter Contract

```solidity
function routeYield(uint256 amount) external {
    // Calculate allocations
    uint256 donationAmount = (amount * donationRatio) / MAX_RATIO; // 20%
    uint256 userShareAmount = amount - donationAmount; // 80%
    
    // Update state
    totalYieldRouted += amount;
    totalDonated += donationAmount;
    totalUserShare += userShareAmount;
    
    // Execute donation
    impactHook.executeDonation(donationAmount, recipients, allocations);
}
```

### Key Features

1. **Transparency**: All allocations are on-chain and verifiable
2. **Automatic**: No manual intervention required
3. **Configurable**: Donation ratio can be adjusted
4. **Multi-Recipient**: Supports multiple public goods recipients
5. **Proportional**: Donations distributed proportionally

## Safety Checks

1. **Input Validation**: All amounts validated before processing
2. **Access Control**: Only authorized contracts can route yield
3. **Reentrancy Protection**: All functions protected with ReentrancyGuard
4. **Slippage Protection**: Donation swaps have max slippage limits
5. **Emergency Pause**: Vault can be paused in emergency

## Public Goods Recipients

### Gitcoin (50%)
- **Address**: `0x7d655c57f71464B6f83811C55D84009Cd9f5221C`
- **Purpose**: Supporting open source development
- **Impact**: Funds critical open source projects

### Protocol Guild (50%)
- **Address**: `0xF29Ff96aaEa6C9A1f2518514c55E2D4f4E8b4E2B`
- **Purpose**: Supporting Ethereum core developers
- **Impact**: Funds Ethereum protocol development

## Yield Flow Diagram

```
User Deposits → KarmaVault → Adapters (Aave, Morpho, Spark)
                                              ↓
                                    Yield Generation
                                              ↓
                                    Harvest Function
                                              ↓
                                    YieldRouter
                                    /          \
                           80% User Share   20% Donation
                                   ↓              ↓
                          Vault Assets    ImpactHook
                                              ↓
                                    Public Goods
                                    /          \
                              50% Gitcoin  50% Protocol Guild
```

## Configuration

### Current Configuration

- **Donation Ratio**: 20% (2000 basis points)
- **User Share Ratio**: 80% (8000 basis points)
- **Recipients**: 2 (Gitcoin, Protocol Guild)
- **Recipient Allocations**: 50% each (5000 basis points)

### Updating Configuration

The donation ratio and recipients can be updated by the contract owner:

```solidity
// Update donation ratio
function setDonationRatio(uint256 newRatio) external onlyOwner;

// Add recipient
function addRecipient(address recipient, uint256 allocation) external onlyOwner;

// Remove recipient
function removeRecipient(uint256 index) external onlyOwner;
```

## Transparency & Verification

All yield routing is transparent and verifiable:

1. **On-Chain Events**: All allocations emit events
2. **Etherscan**: All transactions visible on block explorer
3. **Subgraph**: Events indexed for analytics
4. **Frontend**: Real-time tracking of donations

## Impact Metrics

Track the impact of yield donations:

- **Total Yield Routed**: Total amount of yield processed
- **Total Donated**: Total amount donated to public goods
- **Total User Share**: Total amount returned to users
- **Donation Count**: Number of donation transactions
- **Recipient Breakdown**: Donations per recipient

## Future Enhancements

1. **Governance**: DAO voting on donation ratio
2. **Dynamic Allocation**: Adjust ratios based on yield performance
3. **More Recipients**: Add more public goods recipients
4. **Impact Tracking**: Track impact of donations
5. **User Preferences**: Allow users to choose recipients

## Conclusion

DeFi Karma's yield routing policy demonstrates how DeFi can be used to sustainably fund public goods while maintaining competitive returns for users. The policy is transparent, automatic, and configurable, making it a model for yield-donating strategies in the DeFi ecosystem.

