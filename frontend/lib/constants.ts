// Contract addresses (Sepolia)
export const CONTRACT_ADDRESSES = {
  KARMA_VAULT: (process.env.NEXT_PUBLIC_VAULT_ADDRESS || '0xBF956a6FBEA391E7223189Fc714893BD7AA1224B') as `0x${string}`,
  YIELD_ROUTER: (process.env.NEXT_PUBLIC_ROUTER_ADDRESS || '0x1F778a23bf953B00796D1702e7fDF89Bb763522b') as `0x${string}`,
  IMPACT_HOOK: (process.env.NEXT_PUBLIC_HOOK_ADDRESS || '0x8a9FFac4C195F78a0B42166cE967842601D144A1') as `0x${string}`,
  AAVE_ADAPTER: (process.env.NEXT_PUBLIC_AAVE_ADAPTER_ADDRESS || '0x213d6D22f6125Ef756e67DD19632cE4528ff805E') as `0x${string}`,
  MORPHO_ADAPTER: (process.env.NEXT_PUBLIC_MORPHO_ADAPTER_ADDRESS || '0x469895CF68045bB8bf9A1F28fEF795388B7CF095') as `0x${string}`,
  SPARK_ADAPTER: (process.env.NEXT_PUBLIC_SPARK_ADAPTER_ADDRESS || '0xa64D2Ba04F316d89d2276645045cdCe263Cf0b79') as `0x${string}`,
  YEARN_ADAPTER: (process.env.NEXT_PUBLIC_YEARN_ADAPTER_ADDRESS || '0xce2c4277AC4B3a250c04945a1f4464A61F57284E') as `0x${string}`,
  USDC: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8' as `0x${string}`, // Sepolia USDC
} as const;

// Public goods recipients
export const PUBLIC_GOODS_RECIPIENTS = [
  {
    name: 'Gitcoin',
    address: '0x7d655c57f71464B6f83811C55D84009Cd9f5221C',
    description: 'Supporting open source development',
    allocation: 50,
  },
  {
    name: 'Protocol Guild',
    address: '0xF29ff96AaEa6C9A1f2518514c55E2D4f4E8b4E2B',
    description: 'Supporting Ethereum core developers',
    allocation: 50,
  },
] as const;

// Adapter configurations
export const ADAPTERS = [
  {
    name: 'Aave v3',
    address: CONTRACT_ADDRESSES.AAVE_ADAPTER,
    allocation: 40,
    apy: 3.5,
    color: '#B6509E',
  },
  {
    name: 'Morpho v2',
    address: CONTRACT_ADDRESSES.MORPHO_ADAPTER,
    allocation: 25,
    apy: 4.2,
    color: '#6E45E2',
  },
  {
    name: 'Spark Protocol',
    address: CONTRACT_ADDRESSES.SPARK_ADAPTER,
    allocation: 20,
    apy: 3.8,
    color: '#00C2A8',
  },
  {
    name: 'Yearn v3 (Kalani)',
    address: CONTRACT_ADDRESSES.YEARN_ADAPTER,
    allocation: 15,
    apy: 4.0,
    color: '#FF6B6B',
  },
] as const;

// ERC20 ABI (for USDC approval)
export const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
] as const;

// Vault ABI
export const VAULT_ABI = [
  'function deposit(uint256 assets, address receiver) returns (uint256 shares)',
  'function withdraw(uint256 assets, address receiver, address owner) returns (uint256 shares)',
  'function redeem(uint256 shares, address receiver, address owner) returns (uint256 assets)',
  'function mint(uint256 shares, address receiver) returns (uint256 assets)',
  'function totalAssets() view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function convertToShares(uint256 assets) view returns (uint256)',
  'function convertToAssets(uint256 shares) view returns (uint256)',
  'function asset() view returns (address)',
  'function harvest() returns (uint256)',
  'function harvestAndDonate() returns (uint256 totalYield, uint256 donatedAmount)',
  'function getAdapterCount() view returns (uint256)',
  'function getAdapter(uint256 index) view returns (address adapter, uint256 allocation, bool active)',
  'event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)',
  'event Withdraw(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)',
  'event YieldHarvested(uint256 totalYield, uint256 timestamp)',
  'event HarvestAndDonate(uint256 totalYield, uint256 donatedAmount, uint256 userShare)',
] as const;

// Router ABI
export const ROUTER_ABI = [
  'function routeYield(uint256 amount)',
  'function executeDonation() returns (uint256 donatedAmount)',
  'function donationRatio() view returns (uint256)',
  'function userShareRatio() view returns (uint256)',
  'function recipientCount() view returns (uint256)',
  'function recipients(uint256 index) view returns (address)',
  'function recipientAllocations(uint256 index) view returns (uint256)',
  'function totalYieldRouted() view returns (uint256)',
  'function totalDonated() view returns (uint256)',
  'function totalUserShare() view returns (uint256)',
  'event YieldRouted(uint256 totalYield, uint256 userShare, uint256 donationAmount)',
  'event DonationExecuted(uint256 amount, address recipient, uint256 timestamp)',
] as const;

// Hook ABI
export const HOOK_ABI = [
  'function executeDonation(uint256 amount, address[] recipients, uint256[] allocations)',
  'function totalDonated() view returns (uint256)',
  'function donationCount() view returns (uint256)',
  'function asset() view returns (address)',
  'event ImpactDonation(uint256 amount, address recipient, uint256 timestamp)',
] as const;
