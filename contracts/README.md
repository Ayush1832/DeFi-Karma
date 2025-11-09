# DeFi Karma - Smart Contracts

DeFi yield orchestration protocol that aggregates yield from multiple DeFi protocols (Aave v3, Morpho v2, Spark, Kalani/Yearn v3) into an ERC-4626 compatible vault and programmatically donates a share of the yield to public goods.

## Overview

This project implements a complete DeFi yield aggregation system with:
- **KarmaVault**: ERC-4626 vault that aggregates yield from multiple protocols
- **YieldRouter**: Routes harvested yield between users and public goods
- **ImpactHook**: Executes donations to public goods recipients
- **Adapters**: Protocol-specific adapters for Aave, Morpho, Spark, and Yearn
- **Mock Vaults**: Testnet mock vaults for protocols not deployed on Sepolia

## Contracts

### Core Contracts
- `KarmaVault.sol` - Main ERC-4626 vault
- `YieldRouter.sol` - Yield routing and donation logic
- `ImpactHook.sol` - Public goods donation execution

### Adapters
- `AaveAdapter.sol` - Aave v3 integration
- `MorphoAdapter.sol` - Morpho v2 integration (uses mock vault on testnet)
- `SparkAdapter.sol` - Spark Protocol integration (uses mock vault on testnet)
- `KalaniStrategy.sol` - Yearn v3/Kalani integration (uses mock vault on testnet)

### Mocks
- `MockYieldProtocol.sol` - Mock ERC-4626 vault for testnet protocols

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_key
ETHERSCAN_API_KEY=your_etherscan_key
```

3. Compile contracts:
```bash
npm run compile
```

## Deployment

Deploy to Sepolia:
```bash
npm run deploy:sepolia
```

This will:
- Deploy mock vaults for Morpho, Spark, and Yearn
- Deploy all core contracts
- Deploy all adapters
- Configure the vault with adapters
- Automatically verify all contracts on Etherscan
- Update frontend `.env.local` with addresses

## Testing

Run tests:
```bash
npm test
```

## Network Support

- **Sepolia Testnet**: Fully supported with mock vaults for protocols not on testnet
- **Mainnet**: Ready for deployment (update addresses in deploy script)

## Protocol Integration

### Aave v3
- Uses real Aave v3 pool addresses on Sepolia
- Integrates with aUSDC tokens

### Morpho v2
- Uses mock vault on testnet (real Morpho not on Sepolia)
- Adapter supports both real and mock vaults

### Spark Protocol
- Uses mock vault on testnet (real Spark not on Sepolia)
- Adapter supports both real and mock vaults

### Yearn v3 / Kalani
- Uses mock vault on testnet (real Yearn v3 not on Sepolia)
- Adapter supports both real and mock vaults

## Architecture

```
User Deposits
    ↓
KarmaVault (ERC-4626)
    ↓
Adapters (Aave, Morpho, Spark, Yearn)
    ↓
Yield Generation
    ↓
YieldRouter
    ↓
80% Users | 20% Public Goods
    ↓
ImpactHook → Donations
```

## License

MIT
