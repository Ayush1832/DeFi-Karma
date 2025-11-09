# Deployment Guide

## Prerequisites

1. Node.js 18+ and npm
2. Ethereum testnet RPC URL (Sepolia or Holesky)
3. Private key with testnet ETH for deployment
4. Etherscan API key for contract verification

## Smart Contract Deployment

### 1. Setup Environment

```bash
cd contracts
npm install
cp .env.example .env
# Edit .env with your private key and RPC URLs
```

### 2. Update Deployment Script

Edit `scripts/deploy.ts` with actual testnet addresses:
- USDC token address
- Aave pool and aToken addresses
- Morpho vault and market addresses
- Spark pool and vault addresses
- Uniswap router address
- Public goods recipient addresses

### 3. Deploy Contracts

```bash
# Deploy to Sepolia
npm run deploy:sepolia

# Or deploy to Holesky
npm run deploy:holesky
```

### 4. Verify Deployment

After deployment, verify contracts on Etherscan:

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## Frontend Deployment

### 1. Setup Environment

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with contract addresses
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build

```bash
npm run build
```

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Subgraph Deployment

### 1. Setup

```bash
cd subgraph
npm install
```

### 2. Generate ABIs

Copy contract ABIs to `subgraph/abis/` directory.

### 3. Update Configuration

Edit `subgraph.yaml` with deployed contract addresses.

### 4. Generate Code

```bash
npm run codegen
```

### 5. Build

```bash
npm run build
```

### 6. Deploy

```bash
# Authenticate with The Graph
graph auth --studio <your-access-token>

# Deploy to The Graph Studio
npm run deploy
```

## Automation Setup

### Gelato Network

1. Create account on Gelato Network
2. Create automated task for `harvestAndDonate()` function
3. Set trigger conditions (time-based or threshold-based)
4. Fund task with ETH for gas

### Chainlink Keepers

1. Register upkeep on Chainlink Keepers
2. Configure trigger conditions
3. Fund upkeep with LINK tokens

## Verification Checklist

- [ ] Contracts deployed and verified on Etherscan
- [ ] Frontend deployed and accessible
- [ ] Subgraph deployed and syncing
- [ ] Automation configured and running
- [ ] All environment variables set correctly
- [ ] Test transactions successful
- [ ] Documentation updated with deployment addresses

## Post-Deployment

1. Update README with deployment addresses
2. Update frontend environment variables
3. Update subgraph configuration
4. Test all functionality on testnet
5. Monitor contract events and transactions
6. Set up monitoring and alerts

