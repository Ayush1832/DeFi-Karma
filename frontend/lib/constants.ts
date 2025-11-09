// Contract addresses (update these after deployment)
export const CONTRACT_ADDRESSES = {
  KARMA_VAULT: process.env.NEXT_PUBLIC_VAULT_ADDRESS || '0x0000000000000000000000000000000000000000',
  YIELD_ROUTER: process.env.NEXT_PUBLIC_ROUTER_ADDRESS || '0x0000000000000000000000000000000000000000',
  IMPACT_HOOK: process.env.NEXT_PUBLIC_HOOK_ADDRESS || '0x0000000000000000000000000000000000000000',
} as const;

// Public goods recipients
export const PUBLIC_GOODS_RECIPIENTS = [
  {
    name: 'Gitcoin',
    address: '0x7d655c57f71464B6f83811C55D84009Cd9f5221C',
    description: 'Supporting open source development',
    logo: '/gitcoin.png',
  },
  {
    name: 'Protocol Guild',
    address: '0xF29Ff96aaEa6C9A1f2518514c55E2D4f4E8b4E2B',
    description: 'Supporting Ethereum core developers',
    logo: '/protocol-guild.png',
  },
] as const;

// Adapter configurations
export const ADAPTERS = [
  {
    name: 'Aave v3',
    allocation: 50,
    apy: 3.5,
    color: '#B6509E',
  },
  {
    name: 'Morpho v2',
    allocation: 30,
    apy: 4.2,
    color: '#6E45E2',
  },
  {
    name: 'Spark Protocol',
    allocation: 20,
    apy: 3.8,
    color: '#00C2A8',
  },
] as const;

// ABI exports (simplified - in production, use actual ABI files)
export const VAULT_ABI = [
  'function deposit(uint256 assets, address receiver) returns (uint256 shares)',
  'function withdraw(uint256 assets, address receiver, address owner) returns (uint256 shares)',
  'function redeem(uint256 shares, address receiver, address owner) returns (uint256 assets)',
  'function totalAssets() view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function convertToShares(uint256 assets) view returns (uint256)',
  'function convertToAssets(uint256 shares) view returns (uint256)',
  'function harvest() returns (uint256)',
  'function harvestAndDonate() returns (uint256 totalYield, uint256 donatedAmount)',
  'event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)',
  'event Withdraw(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)',
] as const;

