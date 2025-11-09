# DeFi Karma Smart Contracts

This directory contains all smart contracts for the DeFi Karma protocol.

## Structure

- `src/` - Main contract source files
  - `KarmaVault.sol` - Core ERC-4626 vault
  - `adapters/` - Protocol adapters
    - `AaveAdapter.sol`
    - `MorphoAdapter.sol`
    - `SparkAdapter.sol`
    - `KalaniStrategy.sol`
  - `YieldRouter.sol` - Yield allocation and donation routing
  - `hooks/` - Uniswap v4 hooks
    - `ImpactHook.sol`
- `test/` - Hardhat tests
- `scripts/` - Deployment scripts

## Setup

1. Install dependencies:
```bash
npm install
```

2. Compile contracts:
```bash
npm run compile
```

3. Run tests:
```bash
npm test
```

4. Run tests with coverage:
```bash
npm run test:coverage
```

## Deployment

### Local Network

```bash
npx hardhat node
```

In another terminal:
```bash
npm run deploy:sepolia
```

### Testnet Deployment

1. Create `.env` file with:
```env
PRIVATE_KEY=your-private-key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-key
ETHERSCAN_API_KEY=your-etherscan-api-key
```

2. Deploy to Sepolia:
```bash
npm run deploy:sepolia
```

3. Deploy to Holesky:
```bash
npm run deploy:holesky
```

## Verification

After deployment, verify contracts on Etherscan:

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## Testing

Tests are written using Hardhat, Chai, and Mocha. Run all tests:

```bash
npm test
```

Run specific test file:
```bash
npx hardhat test test/KarmaVault.test.ts
```

Run tests with gas reporting:
```bash
REPORT_GAS=true npm test
```

## Contracts

### KarmaVault
Core ERC-4626 vault that manages deposits, withdrawals, and yield aggregation.

### YieldRouter
Routes harvested yield between users (80%) and donations (20%).

### ImpactHook
Executes donations to public goods recipients via Uniswap.

### Adapters
- AaveAdapter: Aave v3 integration
- MorphoAdapter: Morpho v2 integration
- SparkAdapter: Spark Protocol integration
- KalaniStrategy: Yearn v3 integration

## Security

- Reentrancy guards on all external functions
- Access control for admin functions
- Safe math operations (OpenZeppelin)
- Comprehensive test coverage
- Emergency pause functionality

## License

MIT
