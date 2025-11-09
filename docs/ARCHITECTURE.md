# Architecture Documentation

## Overview

DeFi Karma is a fully on-chain DeFi yield orchestration protocol that aggregates yield from multiple protocols and automatically donates a portion to public goods.

## System Components

### 1. Smart Contracts Layer

#### KarmaVault (ERC-4626)
- Core vault implementing ERC-4626 standard
- Manages user deposits and withdrawals
- Allocates funds across multiple adapters
- Tracks total assets and shares
- Harvests yield from adapters

#### Adapters
- **AaveAdapter**: Integrates with Aave v3 for stable lending yield
- **MorphoAdapter**: Integrates with Morpho v2 for optimized yield
- **SparkAdapter**: Integrates with Spark Protocol for diversification
- **KalaniStrategy**: Integrates with Yearn v3 for auto-compounding

#### YieldRouter
- Routes harvested yield between users and donations
- Configurable allocation policy (default: 80% users, 20% donations)
- Manages public goods recipients

#### ImpactHook
- Executes donations to public goods recipients
- Swaps tokens via Uniswap (simplified for hackathon)
- Distributes funds according to allocation percentages

### 2. Frontend Layer

#### Next.js Application
- **Landing Page**: Project introduction and statistics
- **Dashboard**: User portfolio, charts, and actions
- **Vault Management**: Adapter configuration
- **Public Goods**: Recipient information
- **Documentation**: User guides and architecture

#### Technology Stack
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Wagmi + Viem for Ethereum interaction
- RainbowKit for wallet connection
- Recharts for data visualization

### 3. Data Indexing Layer

#### The Graph Subgraph
- Indexes on-chain events
- Tracks deposits, withdrawals, harvests, and donations
- Provides GraphQL API for frontend queries

### 4. Automation Layer

#### Gelato / Chainlink Keepers
- Automated yield harvesting
- Periodic donation execution
- Threshold-based triggers

## Data Flow

### Deposit Flow
1. User deposits USDC into KarmaVault
2. Vault mints ERC-4626 shares to user
3. Vault allocates assets to adapters based on configured ratios
4. Adapters deposit into underlying protocols

### Yield Generation
1. Adapters earn yield from underlying protocols
2. Yield accumulates over time
3. Keeper triggers harvest() function
4. Vault collects yield from all adapters

### Donation Flow
1. Harvested yield is sent to YieldRouter
2. Router splits yield: 80% to users, 20% to donations
3. Donation portion sent to ImpactHook
4. Hook distributes to public goods recipients

## Security Considerations

1. **Reentrancy Protection**: All external functions use ReentrancyGuard
2. **Access Control**: Admin functions restricted to owner
3. **Input Validation**: All inputs validated before processing
4. **Safe Math**: Using OpenZeppelin's SafeERC20 for transfers
5. **Emergency Pause**: Vault can be paused in emergency situations

## Future Enhancements

1. Governance DAO for allocation decisions
2. NFT impact badges for contributors
3. AI-powered yield allocation optimization
4. Cross-chain expansion
5. Public goods marketplace

