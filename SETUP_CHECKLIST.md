# 🏆 Octant DeFi Hackathon 2025 - Complete Setup Checklist

## 🎯 Hackathon Overview

- **Submission Window**: October 30 - November 9, 2025
- **Mandatory Check-ins**: November 4, 6, 7, 8 (2pm-4pm UTC) on Discord
- **Goal**: Build DeFi strategies for Octant v2 vaults
- **Network**: **Sepolia Testnet** (recommended for all protocols)

## 🌐 Network Selection: **Sepolia Testnet**

**Why Sepolia?**
- ✅ Standard Ethereum testnet (replaced Goerli)
- ✅ All major protocols deployed (Aave, Morpho, Spark, Uniswap)
- ✅ Better faucet availability
- ✅ Octant v2 compatible
- ✅ All required protocols have Sepolia deployments

## 🚀 Phase 1: Initial Setup (Days 1-2)

### 1.1 Environment Setup

- [ ] **Install Node.js 18+** (if not already installed)
- [ ] **Install Git** (if not already installed)
- [ ] **Create GitHub Repository** (if not done)
- [ ] **Set up development environment**

### 1.2 Get Testnet ETH & Tokens

- [ ] **Get Sepolia ETH** from faucets:
  - [Sepolia Faucet](https://sepoliafaucet.com/)
  - [Alchemy Faucet](https://sepoliafaucet.com/)
  - [Infura Faucet](https://www.infura.io/faucet/sepolia)
- [ ] **Get Sepolia USDC** (if needed for testing)
- [ ] **Fund deployment wallet** with at least 0.5 ETH

### 1.3 Get API Keys

- [ ] **Infura/Alchemy RPC URL**:
  - Sign up at [Infura](https://infura.io/) or [Alchemy](https://www.alchemy.com/)
  - Create Sepolia project
  - Get RPC URL
- [ ] **Etherscan API Key**:
  - Sign up at [Etherscan](https://etherscan.io/register)
  - Get API key from [API Keys page](https://etherscan.io/myapikey)
- [ ] **WalletConnect Project ID**:
  - Create project at [WalletConnect Cloud](https://cloud.walletconnect.com/)
  - Get Project ID

## 🔧 Phase 2: Contract Development & Testing (Days 2-4)

### 2.1 Install Dependencies

```bash
# Install contract dependencies
cd contracts
npm install

# Verify installation
npm run compile
```

### 2.2 Get Protocol Addresses (Sepolia Testnet)

Update `contracts/scripts/deploy.ts` with these Sepolia addresses:

#### **Aave v3 Sepolia Addresses:**
- [ ] **USDC**: `0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8` (Sepolia USDC)
- [ ] **Aave Pool**: `0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951`
- [ ] **aUSDC (ATokenVault)**: Check [Aave Vaults](https://github.com/aave/Aave-Vault) for latest
- [ ] **WETH**: `0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14`

#### **Morpho v2 Sepolia Addresses:**
- [ ] Check [Morpho Vaults V2](https://github.com/morpho-org/vault-v2) for Sepolia deployments
- [ ] **Morpho Market**: Update from Morpho docs
- [ ] **Morpho Vault**: Update from Morpho docs

#### **Spark Protocol Sepolia Addresses:**
- [ ] Check [Spark Documentation](https://docs.spark.fi/) for Sepolia addresses
- [ ] **Spark Pool**: Update from Spark docs
- [ ] **Spark Vault**: Update from Spark docs

#### **Kalani/Yearn v3:**
- [ ] Check [Kalani Documentation](https://kalani.yearn.fi/) for testnet addresses
- [ ] **Yearn Strategy**: Update from Kalani docs
- [ ] **Yearn Vault**: Update from Kalani docs

#### **Uniswap v4 Hooks:**
- [ ] **Uniswap V3 Router** (Sepolia): `0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008`
- [ ] **Uniswap V4**: Check [Uniswap v4 Hooks](https://uniswap.notion.site/octant-defi-hackathon) for testnet
- [ ] **WETH**: `0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14`

#### **Public Goods Recipients:**
- [ ] **Gitcoin**: `0x7d655c57f71464B6f83811C55D84009Cd9f5221C`
- [ ] **Protocol Guild**: `0xF29Ff96aaEa6C9A1f2518514c55E2D4f4E8b4E2B`
- [ ] **Octant** (optional): Check Octant docs for address

### 2.3 Configure Environment Variables

Create `contracts/.env`:
```env
# Private key (NEVER commit this!)
PRIVATE_KEY=your-private-key-without-0x-prefix

# RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-infura-key
# OR
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-alchemy-key

# Etherscan API Key
ETHERSCAN_API_KEY=your-etherscan-api-key

# Optional: Holesky (if needed)
HOLESKY_RPC_URL=https://holesky.infura.io/v3/your-key
```

### 2.4 Enhance Contract Integrations

- [ ] **AaveAdapter**: Integrate with actual Aave v3 ATokenVault
  - [ ] Use proper Aave interfaces
  - [ ] Implement health factor checks
  - [ ] Add liquidity safety checks
  - [ ] Document interfaces and accounting

- [ ] **MorphoAdapter**: Integrate with Morpho v2 Vaults
  - [ ] Use ERC-4626 semantics correctly
  - [ ] Implement safe adapter wiring
  - [ ] Add comprehensive tests
  - [ ] Create runbook

- [ ] **SparkAdapter**: Integrate with Spark curated yield
  - [ ] Use Spark's curated pools
  - [ ] Document integration
  - [ ] Add tests
  - [ ] Explain yield sources

- [ ] **KalaniStrategy**: Integrate Yearn v3 Tokenized Strategy
  - [ ] Implement proper Tokenized Strategy
  - [ ] Add config files
  - [ ] Create deployment script
  - [ ] Add comprehensive tests

- [ ] **ImpactHook**: Enhance Uniswap v4 Hook
  - [ ] Implement proper Uniswap v4 hook logic
  - [ ] Add hook tests
  - [ ] Document hook functionality
  - [ ] Show functional evidence

### 2.5 Write Comprehensive Tests

- [ ] **Unit Tests**: Test each contract individually
- [ ] **Integration Tests**: Test contract interactions
- [ ] **Adapter Tests**: Test each adapter thoroughly
- [ ] **Yield Routing Tests**: Test yield donation flow
- [ ] **Security Tests**: Test reentrancy, access control, etc.
- [ ] **Edge Case Tests**: Test boundary conditions

Run tests:
```bash
cd contracts
npm test
npm run test:coverage
```

## 🚀 Phase 3: Deployment (Days 4-5)

### 3.1 Deploy Contracts to Sepolia

```bash
cd contracts

# Compile first
npm run compile

# Deploy to Sepolia
npm run deploy:sepolia
```

### 3.2 Verify Contracts on Etherscan

After deployment, verify each contract:

```bash
# Verify KarmaVault
npx hardhat verify --network sepolia <VAULT_ADDRESS> <CONSTRUCTOR_ARGS>

# Verify YieldRouter
npx hardhat verify --network sepolia <ROUTER_ADDRESS> <CONSTRUCTOR_ARGS>

# Verify ImpactHook
npx hardhat verify --network sepolia <HOOK_ADDRESS> <CONSTRUCTOR_ARGS>

# Verify Adapters (repeat for each)
npx hardhat verify --network sepolia <ADAPTER_ADDRESS> <CONSTRUCTOR_ARGS>
```

### 3.3 Document Deployment Addresses

Create `DEPLOYMENT.md` with:
- [ ] All contract addresses
- [ ] Deployment transaction hashes
- [ ] Constructor arguments
- [ ] Deployment network (Sepolia)
- [ ] Deployment timestamp

### 3.4 Test Deployed Contracts

- [ ] Test deposit on Sepolia
- [ ] Test withdrawal on Sepolia
- [ ] Test harvest function
- [ ] Test donation execution
- [ ] Verify events are emitted
- [ ] Check Etherscan for transactions

## 📊 Phase 4: Subgraph & Analytics (Days 5-6)

### 4.1 Set Up The Graph Subgraph

- [ ] **Create subgraph project** on [The Graph Studio](https://thegraph.com/studio/)
- [ ] **Export contract ABIs** from `contracts/artifacts/`
- [ ] **Update `subgraph/subgraph.yaml`** with deployed addresses
- [ ] **Update `subgraph/schema.graphql`** if needed
- [ ] **Generate code**: `npm run codegen`
- [ ] **Build subgraph**: `npm run build`
- [ ] **Deploy subgraph**: `npm run deploy`

### 4.2 Verify Subgraph Indexing

- [ ] Check subgraph is syncing
- [ ] Verify events are being indexed
- [ ] Test GraphQL queries
- [ ] Update frontend with subgraph URL

## 🎨 Phase 5: Frontend Development (Days 6-7)

### 5.1 Frontend Setup

```bash
cd frontend
npm install
```

### 5.2 Configure Frontend

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_VAULT_ADDRESS=0x... # From deployment
NEXT_PUBLIC_ROUTER_ADDRESS=0x... # From deployment
NEXT_PUBLIC_HOOK_ADDRESS=0x... # From deployment
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
NEXT_PUBLIC_SUBGRAPH_URL=https://api.thegraph.com/subgraphs/name/your-username/defi-karma
NEXT_PUBLIC_CHAIN_ID=11155111 # Sepolia chain ID
```

### 5.3 Update Frontend with Contract Addresses

- [ ] Update `frontend/lib/constants.ts` with deployed addresses
- [ ] Update ABIs in `frontend/lib/abis/`
- [ ] Test wallet connection
- [ ] Test deposit/withdraw flows
- [ ] Test harvest function
- [ ] Verify charts display data

### 5.4 Deploy Frontend

```bash
cd frontend
npm run build

# Deploy to Vercel
vercel --prod
```

## 📝 Phase 6: Documentation & Tutorial (Days 7-8)

### 6.1 Create Comprehensive Documentation

- [ ] **README.md**: Update with deployment addresses
- [ ] **ARCHITECTURE.md**: Detailed architecture explanation
- [ ] **DEPLOYMENT.md**: Step-by-step deployment guide
- [ ] **CONTRACTS.md**: Contract documentation
- [ ] **INTEGRATION.md**: Protocol integration guides
- [ ] **YIELD_ROUTING_POLICY.md**: Yield donation policy explanation

### 6.2 Create Tutorial (for $1,500 track)

- [ ] **Written Tutorial**: Step-by-step guide on building Octant v2 vault
  - [ ] Architecture explanation
  - [ ] Code examples
  - [ ] Integration guide
  - [ ] Deployment instructions
- [ ] **OR Video Tutorial**: 10-15 minute walkthrough
  - [ ] Record screen
  - [ ] Explain architecture
  - [ ] Show code examples
  - [ ] Demonstrate deployment
  - [ ] Upload to YouTube

### 6.3 Create Track-Specific Documentation

For each track, create:
- [ ] **Yield Donating Strategy**: Policy description document
- [ ] **Public Goods**: Impact metrics and mechanism explanation
- [ ] **Kalani**: Tokenized Strategy guide and configs
- [ ] **Aave v3**: Interface documentation and safety checks
- [ ] **Uniswap v4 Hooks**: Hook implementation guide
- [ ] **Morpho v2**: Adapter wiring guide and runbook
- [ ] **Spark**: Integration documentation

## 🎬 Phase 7: Demo & Submission (Days 8-9)

### 7.1 Create Demo Video

- [ ] **Record demo** (5-10 minutes):
  - [ ] Show project overview
  - [ ] Demonstrate deposit flow
  - [ ] Show yield generation
  - [ ] Demonstrate donation execution
  - [ ] Show analytics dashboard
  - [ ] Explain public goods impact
- [ ] **Edit video**: Add titles, transitions
- [ ] **Upload to YouTube**: Make it public
- [ ] **Add to README**: Link to video

### 7.2 Prepare Submission

For each track, prepare:
- [ ] **Contract addresses** (deployed on Sepolia)
- [ ] **GitHub repository** (public, well-documented)
- [ ] **Documentation** (comprehensive)
- [ ] **Test results** (all tests passing)
- [ ] **Demo video** (YouTube link)
- [ ] **Deployment instructions** (clear and detailed)
- [ ] **Integration guides** (for each protocol)

### 7.3 Final Checklist

- [ ] All contracts deployed and verified on Sepolia
- [ ] All tests passing
- [ ] Frontend deployed and accessible
- [ ] Subgraph deployed and syncing
- [ ] Documentation complete
- [ ] Tutorial created (written or video)
- [ ] Demo video recorded and uploaded
- [ ] GitHub repository updated
- [ ] All track requirements met
- [ ] Submission form completed

## 🔄 Phase 8: Check-ins (November 4, 6, 7, 8)

### Mandatory Discord Check-ins (2pm-4pm UTC)

- [ ] **November 4**: Initial progress check-in
- [ ] **November 6**: Mid-development check-in
- [ ] **November 7**: Pre-submission check-in
- [ ] **November 8**: Final check-in before submission

Prepare for each check-in:
- [ ] Show progress
- [ ] Ask questions if stuck
- [ ] Get feedback from judges
- [ ] Update based on feedback

## 📋 Quick Reference: Sepolia Testnet Info

- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_KEY
- **Block Explorer**: https://sepolia.etherscan.io/
- **Faucet**: https://sepoliafaucet.com/

## 🆘 Troubleshooting

### Common Issues:

1. **Out of Gas**: Increase gas limit in deployment script
2. **Contract Verification Fails**: Check constructor arguments
3. **RPC Errors**: Try different RPC provider
4. **Test Failures**: Run tests locally first
5. **Subgraph Not Syncing**: Check event signatures match

### Get Help:

- [ ] Join Octant Discord
- [ ] Check Octant documentation
- [ ] Review protocol documentation
- [ ] Ask in hackathon Discord channel

## ✅ Final Submission Checklist

- [ ] All contracts deployed on Sepolia
- [ ] All contracts verified on Etherscan
- [ ] All tests passing with good coverage
- [ ] Frontend deployed and working
- [ ] Subgraph deployed and syncing
- [ ] Documentation complete and clear
- [ ] Tutorial created (written or video)
- [ ] Demo video recorded and uploaded
- [ ] GitHub repository public and well-documented
- [ ] All track requirements documented
- [ ] Submission form completed before November 9 deadline

## 🎯 Track-Specific Requirements

See `HACKATHON_TRACKS.md` for detailed track requirements and targeting strategy.

## 📞 Important Links

- [Octant v2 Documentation](https://docs.v2.octant.build/)
- [Hackathon Manual](https://octantapp.notion.site/octant-defi-hackathon-2025-hacker-manual)
- [Aave Vaults](https://github.com/aave/Aave-Vault)
- [Morpho Vaults V2](https://github.com/morpho-org/vault-v2)
- [Spark Documentation](https://docs.spark.fi/)
- [Kalani/Yearn v3](https://kalani.yearn.fi/)
- [Uniswap v4 Hooks](https://uniswap.notion.site/octant-defi-hackathon)

---

**Good luck! You've got this! 🚀**
