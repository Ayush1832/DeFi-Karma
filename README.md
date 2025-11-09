# 🌍 DeFi Karma – A Yield-Orchestrated Public Goods Engine

DeFi Karma is a fully on-chain DeFi yield orchestration protocol built on **Octant v2**. It aggregates yield from multiple DeFi protocols (Aave v3, Morpho v2, Spark, Kalani) into an ERC-4626-compatible vault and automatically donates a portion of yield to public goods.

## 🎯 Project Overview

**DeFi Karma** demonstrates how idle capital can be used to:
- ✅ Earn optimized yield from multiple DeFi protocols
- ✅ Automatically fund Ethereum ecosystem growth
- ✅ Maintain transparency through on-chain accounting

> "Every yield matters — for you and for the ecosystem."

## 🏗️ Architecture

```
User Wallet (MetaMask)
   │
   ▼
Frontend (Next.js + Wagmi + Viem)
   │  RPC Calls / GraphQL Queries
   ▼
Smart Contracts (on Ethereum Sepolia / Holesky)
   ├── KarmaVault (ERC-4626)
   │     ├── AaveAdapter
   │     ├── MorphoAdapter
   │     ├── SparkAdapter
   │     └── KalaniStrategy
   │
   ├── YieldRouter (allocation + donation policy)
   └── Uniswap v4 ImpactHook (swap & distribute yield)
   │
   ▼
On-chain Public Goods Recipients
   ▲
   │
Indexing Layer (The Graph Subgraph)
   │
   ▼
Frontend Analytics & Charts
```

## 📁 Project Structure

```
DeFi-Karma/
├── contracts/          # Smart contracts (Foundry)
│   ├── src/
│   │   ├── KarmaVault.sol
│   │   ├── adapters/
│   │   ├── hooks/
│   │   └── interfaces/
│   ├── test/
│   └── script/
├── frontend/           # Next.js frontend
│   ├── app/
│   ├── components/
│   └── lib/
├── subgraph/           # The Graph subgraph
│   ├── schema.graphql
│   └── subgraph.yaml
└── docs/               # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- Sepolia testnet ETH (for deployment)

### Network: Sepolia Testnet

This project is designed for **Sepolia testnet** deployment, which is the standard Ethereum testnet for hackathons and development.

### Smart Contracts Setup

1. Install dependencies:
```bash
cd contracts
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

4. Deploy to testnet:
```bash
# Create .env file with PRIVATE_KEY and RPC_URL
npm run deploy:sepolia
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create `.env.local`:
```env
NEXT_PUBLIC_VAULT_ADDRESS=0x...
NEXT_PUBLIC_ROUTER_ADDRESS=0x...
NEXT_PUBLIC_HOOK_ADDRESS=0x...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
```

3. Run development server:
```bash
npm run dev
```

### Subgraph Setup

1. Install The Graph CLI:
```bash
npm install -g @graphprotocol/graph-cli
```

2. Generate code:
```bash
cd subgraph
npm install
npm run codegen
```

3. Build and deploy:
```bash
npm run build
npm run deploy
```

## 🧩 Components

### Smart Contracts

- **KarmaVault**: Core ERC-4626 vault managing deposits, withdrawals, and adapter allocation
- **AaveAdapter**: Integration with Aave v3 for stable yield
- **MorphoAdapter**: Integration with Morpho v2 for optimized yield
- **SparkAdapter**: Integration with Spark Protocol for diversification
- **KalaniStrategy**: Yearn v3 tokenized strategy for auto-compounding
- **YieldRouter**: Routes yield between users (80%) and donations (20%)
- **ImpactHook**: Executes donations to public goods recipients

### Frontend

- **Landing Page**: Project introduction and statistics
- **Dashboard**: User portfolio, yield charts, and donation tracking
- **Vault Management**: Adapter allocation and configuration
- **Public Goods**: List of recipients and donation history
- **Documentation**: Architecture and usage guides

## 🔒 Security

- Reentrancy guards on all external functions
- Access control for admin functions
- Protocol whitelisting for safe adapters
- Safe math and checked transfers (OpenZeppelin)
- Emergency pause functionality
- Comprehensive unit and integration tests

## 📊 Features

- ✅ Multi-protocol yield aggregation
- ✅ Automatic yield donation to public goods
- ✅ ERC-4626 standard compliance
- ✅ Fully on-chain and transparent
- ✅ Real-time analytics via The Graph
- ✅ Modern, responsive UI

## 🧪 Testing

Run tests with Hardhat:
```bash
cd contracts
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 📝 Documentation

- [Architecture Overview](docs/architecture.md)
- [Smart Contract Documentation](docs/contracts.md)
- [Frontend Guide](docs/frontend.md)
- [Deployment Guide](docs/deployment.md)

## 🤝 Contributing

This project was built for the Octant Hackathon 2025. Contributions are welcome!

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Octant v2 Documentation](https://docs.v2.octant.build)
- [ERC-4626 Specification](https://eips.ethereum.org/EIPS/eip-4626)
- [Project Repository](https://github.com/your-repo/defi-karma)

## 👥 Team

Built with ❤️ for the Octant Hackathon 2025

---

**Note**: This project is for hackathon purposes. For production use, additional security audits and testing are required.

