# 🚀 Hackathon Quick Start Guide

## ⏰ Timeline Overview

- **Submission Window**: October 30 - November 9, 2025
- **Mandatory Check-ins**: November 4, 6, 7, 8 (2pm-4pm UTC)
- **Network**: **Sepolia Testnet**

## 🎯 Your Next Steps (In Order)

### Day 1: Setup & Research

1. **Get Testnet Resources**:
   ```bash
   # Get Sepolia ETH from faucets
   # - https://sepoliafaucet.com/
   # - https://www.infura.io/faucet/sepolia
   # - https://sepoliafaucet.com/ (Alchemy)
   ```

2. **Get API Keys**:
   - [Infura](https://infura.io/) or [Alchemy](https://www.alchemy.com/) RPC URL
   - [Etherscan](https://etherscan.io/) API key
   - [WalletConnect](https://cloud.walletconnect.com/) Project ID

3. **Research Protocol Addresses**:
   - Check each protocol's documentation for Sepolia addresses
   - See `docs/SEPOLIA_ADDRESSES.md` for starting points
   - Verify addresses on Sepolia block explorer

### Day 2-3: Contract Development

1. **Install Dependencies**:
   ```bash
   cd contracts
   npm install
   ```

2. **Update Protocol Addresses**:
   - Edit `contracts/scripts/deploy.ts`
   - Add Sepolia addresses for:
     - Aave v3
     - Morpho v2
     - Spark
     - Kalani/Yearn v3
     - Uniswap

3. **Enhance Integrations**:
   - Improve AaveAdapter with actual Aave interfaces
   - Enhance MorphoAdapter with proper ERC-4626 semantics
   - Implement SparkAdapter with curated yield
   - Complete KalaniStrategy with Tokenized Strategy
   - Enhance ImpactHook with Uniswap v4 hook logic

4. **Write Tests**:
   ```bash
   npm test
   npm run test:coverage
   ```

### Day 4-5: Deployment

1. **Configure Environment**:
   ```bash
   # Create contracts/.env
   PRIVATE_KEY=your-key
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-key
   ETHERSCAN_API_KEY=your-key
   ```

2. **Deploy Contracts**:
   ```bash
   npm run compile
   npm run deploy:sepolia
   ```

3. **Verify Contracts**:
   ```bash
   npx hardhat verify --network sepolia <ADDRESS> <ARGS>
   ```

4. **Test Deployed Contracts**:
   - Test deposit on Sepolia
   - Test withdrawal
   - Test harvest
   - Test donation

### Day 6: Subgraph & Frontend

1. **Deploy Subgraph**:
   ```bash
   cd subgraph
   npm install
   npm run codegen
   npm run build
   npm run deploy
   ```

2. **Deploy Frontend**:
   ```bash
   cd frontend
   npm install
   # Update .env.local with contract addresses
   npm run build
   vercel --prod
   ```

### Day 7-8: Documentation & Tutorial

1. **Create Documentation**:
   - Update README with deployment addresses
   - Create yield routing policy document
   - Document each protocol integration
   - Create runbooks for each adapter

2. **Create Tutorial**:
   - Write step-by-step guide OR
   - Record video tutorial (10-15 min)
   - Upload to YouTube
   - Link in README

### Day 9: Demo & Submission

1. **Record Demo Video**:
   - Show project overview
   - Demonstrate features
   - Show public goods impact
   - Upload to YouTube

2. **Prepare Submission**:
   - GitHub repository (public)
   - Contract addresses (Sepolia)
   - Documentation (complete)
   - Test results (all passing)
   - Demo video (YouTube link)
   - Tutorial (written or video)

3. **Submit Before Deadline**: November 9, 2025

## 📋 Essential Checklist

### Must Have:
- [ ] Contracts deployed on Sepolia
- [ ] Contracts verified on Etherscan
- [ ] All tests passing
- [ ] Frontend deployed
- [ ] Subgraph deployed
- [ ] Documentation complete
- [ ] Demo video recorded
- [ ] GitHub repository public

### Track-Specific:
- [ ] Yield routing policy documented
- [ ] Protocol integrations documented
- [ ] Safety checks documented
- [ ] Runbooks created
- [ ] Tutorial created
- [ ] Hook implementation verified

## 🔗 Key Resources

- [Octant v2 Docs](https://docs.v2.octant.build/)
- [Hackathon Manual](https://octantapp.notion.site/octant-defi-hackathon-2025-hacker-manual)
- [Aave Vaults](https://github.com/aave/Aave-Vault)
- [Morpho Vaults V2](https://github.com/morpho-org/vault-v2)
- [Spark Docs](https://docs.spark.fi/)
- [Kalani/Yearn v3](https://kalani.yearn.fi/)
- [Uniswap v4 Hooks](https://uniswap.notion.site/octant-defi-hackathon)

## 🆘 Get Help

- Join Octant Discord
- Check protocol documentation
- Ask in hackathon Discord channel
- Review example projects

## ✅ Success Criteria

Your project should:
1. ✅ Deploy successfully on Sepolia
2. ✅ Pass all tests
3. ✅ Demonstrate all features
4. ✅ Document everything clearly
5. ✅ Show public goods impact
6. ✅ Meet track requirements

---

**Remember**: Quality over quantity. Focus on making each integration solid and well-documented!

Good luck! 🚀

