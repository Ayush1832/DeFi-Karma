# Sepolia Testnet Addresses

## Network Information

- **Network Name**: Sepolia
- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_KEY
- **Block Explorer**: https://sepolia.etherscan.io/
- **Faucet**: https://sepoliafaucet.com/

## Token Addresses

### USDC (Sepolia)
- **Address**: `0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8`
- **Decimals**: 6
- **Symbol**: USDC
- **Source**: [Circle](https://developers.circle.com/stablecoins/docs/usdc-on-testnet)

### WETH (Sepolia)
- **Address**: `0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14`
- **Decimals**: 18
- **Symbol**: WETH
- **Source**: [WETH9](https://github.com/gnosis/canonical-weth)

## Aave v3 Addresses (Sepolia)

### Pool Addresses
- **Pool**: `0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951`
- **PoolDataProvider**: Check [Aave Docs](https://docs.aave.com/developers/deployed-contracts/v3-testnet-addresses)

### ATokenVault Addresses
- **aUSDC Vault**: Check [Aave Vaults GitHub](https://github.com/aave/Aave-Vault) for latest
- **AToken**: Check Aave documentation for latest addresses

### Important Notes:
- Aave v3 addresses may change - always verify with [Aave Documentation](https://docs.aave.com/developers/deployed-contracts/v3-testnet-addresses)
- ATokenVault addresses are ERC-4626 compatible
- Use Aave's official interfaces from their GitHub

## Morpho v2 Addresses (Sepolia)

### Vault Addresses
- Check [Morpho Vaults V2 GitHub](https://github.com/morpho-org/vault-v2) for latest deployments
- **Market**: Check Morpho documentation
- **Vault**: Check Morpho documentation

### Important Notes:
- Morpho v2 uses ERC-4626 semantics
- Vaults are deployed per market
- Verify addresses with Morpho team or documentation

## Spark Protocol Addresses (Sepolia)

### Pool Addresses
- Check [Spark Documentation](https://docs.spark.fi/) for Sepolia deployments
- **Pool**: Update from Spark docs
- **Vault**: Update from Spark docs

### Important Notes:
- Spark uses Aave v3 infrastructure
- Check Spark documentation for latest addresses
- Verify with Spark team if needed

## Kalani/Yearn v3 Addresses (Sepolia)

### Strategy Addresses
- Check [Kalani Documentation](https://kalani.yearn.fi/) for testnet addresses
- **Strategy**: Update from Kalani docs
- **Vault**: Update from Kalani docs

### Important Notes:
- Yearn v3 uses Tokenized Strategy pattern
- Check Kalani GitHub for example strategies
- Verify addresses with Yearn team

## Uniswap Addresses (Sepolia)

### Uniswap V3
- **SwapRouter**: `0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008`
- **Factory**: Check [Uniswap V3 Deployments](https://docs.uniswap.org/contracts/v3/reference/deployments)

### Uniswap V4
- Check [Uniswap v4 Hooks Documentation](https://uniswap.notion.site/octant-defi-hackathon) for testnet
- **PoolManager**: Update from Uniswap v4 docs
- **Hook**: Custom hook deployment

### Important Notes:
- Uniswap v4 is in testnet - verify addresses
- Hooks need to be deployed separately
- Check Uniswap documentation for latest

## Public Goods Recipients

### Gitcoin
- **Address**: `0x7d655c57f71464B6f83811C55D84009Cd9f5221C`
- **Purpose**: Supporting open source development
- **Network**: Ethereum Mainnet (use mainnet address for donations)

### Protocol Guild
- **Address**: `0xF29Ff96aaEa6C9A1f2518514c55E2D4f4E8b4E2B`
- **Purpose**: Supporting Ethereum core developers
- **Network**: Ethereum Mainnet (use mainnet address for donations)

### Important Notes:
- For testnet, you can use test addresses
- For mainnet deployment, use actual recipient addresses
- Verify addresses before deploying

## Octant v2 Addresses (Sepolia)

### Funding Vault
- Check [Octant v2 Documentation](https://docs.v2.octant.build/) for testnet addresses
- **Vault**: Update from Octant docs
- **Router**: Update from Octant docs

### Important Notes:
- Octant v2 uses ERC-4626
- Verify addresses with Octant team
- Check Octant documentation for latest

## How to Verify Addresses

1. **Check Official Documentation**: Always verify with protocol documentation
2. **Check Block Explorer**: Verify contract exists on Sepolia
3. **Check GitHub**: Look for deployment addresses in protocol repos
4. **Ask in Discord**: Join protocol Discord and ask for testnet addresses
5. **Test Interactions**: Test contract interactions before deploying

## Updating This Document

When you find correct addresses:
1. Update this document
2. Update `contracts/scripts/deploy.ts`
3. Update deployment documentation
4. Verify addresses work in tests

## Resources

- [Sepolia Block Explorer](https://sepolia.etherscan.io/)
- [Aave v3 Testnet Addresses](https://docs.aave.com/developers/deployed-contracts/v3-testnet-addresses)
- [Morpho Vaults V2](https://github.com/morpho-org/vault-v2)
- [Spark Documentation](https://docs.spark.fi/)
- [Kalani/Yearn v3](https://kalani.yearn.fi/)
- [Uniswap v4 Hooks](https://uniswap.notion.site/octant-defi-hackathon)
- [Octant v2 Documentation](https://docs.v2.octant.build/)

---

**Note**: Addresses may change. Always verify with official documentation before deploying.

