# Smart Contracts Documentation

## Contract Overview

### KarmaVault

**Purpose**: Core ERC-4626 vault that aggregates yield from multiple DeFi protocols.

**Key Functions**:
- `deposit(uint256 assets, address receiver)`: Deposit assets and receive shares
- `withdraw(uint256 assets, address receiver, address owner)`: Withdraw assets
- `redeem(uint256 shares, address receiver, address owner)`: Redeem shares for assets
- `harvest()`: Harvest yield from all adapters
- `harvestAndDonate()`: Harvest yield and execute donation
- `addAdapter(IAdapter adapter, uint256 allocation)`: Add new adapter
- `updateAdapterAllocation(uint256 index, uint256 newAllocation)`: Update adapter allocation
- `pause()` / `unpause()`: Emergency pause functionality

**Events**:
- `Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)`
- `Withdraw(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)`
- `YieldHarvested(uint256 totalYield, uint256 timestamp)`
- `HarvestAndDonate(uint256 totalYield, uint256 donatedAmount, uint256 userShare)`

### Adapters

All adapters implement the `IAdapter` interface:

**IAdapter Interface**:
- `deposit(uint256 amount) returns (uint256 shares)`
- `withdraw(uint256 shares) returns (uint256 assets)`
- `totalAssets() returns (uint256)`
- `totalSupply() returns (uint256)`
- `convertToAssets(uint256 shares) returns (uint256)`
- `convertToShares(uint256 assets) returns (uint256)`
- `harvest() returns (uint256 yield)`
- `protocolName() returns (string memory)`

#### AaveAdapter

Integrates with Aave v3 for stable lending yield.

#### MorphoAdapter

Integrates with Morpho v2 for optimized yield through intelligent liquidity allocation.

#### SparkAdapter

Integrates with Spark Protocol for diversified yield opportunities.

#### KalaniStrategy

Integrates with Yearn v3 tokenized strategies for auto-compounding.

### YieldRouter

**Purpose**: Routes harvested yield between users and donations.

**Key Functions**:
- `routeYield(uint256 amount)`: Route yield according to allocation policy
- `executeDonation() returns (uint256 donatedAmount)`: Execute donation to public goods
- `setDonationRatio(uint256 _donationRatio)`: Update donation ratio
- `addRecipient(address recipient, uint256 allocation)`: Add public goods recipient
- `removeRecipient(uint256 index)`: Remove recipient

**Configuration**:
- Default donation ratio: 20% (2000 basis points)
- Default user share: 80% (8000 basis points)

### ImpactHook

**Purpose**: Executes on-chain donations to public goods recipients.

**Key Functions**:
- `executeDonation(uint256 amount, address[] memory recipients, uint256[] memory allocations)`: Execute donation
- `setSwapRouter(address _swapRouter)`: Update swap router address

**Note**: For hackathon, this is a simplified implementation. In production, integrate with Uniswap v4 hooks.

## Security Features

1. **ReentrancyGuard**: All external functions protected
2. **Access Control**: Admin functions restricted to owner
3. **Input Validation**: All inputs validated
4. **Safe Math**: Using OpenZeppelin's SafeERC20
5. **Pausable**: Emergency pause functionality
6. **Protocol Whitelisting**: Only approved adapters can be added

## Testing

Run tests with:
```bash
cd contracts
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Test coverage includes:
- Deposit and withdrawal flows
- Yield harvesting
- Donation execution
- Adapter allocation
- Emergency pause
- Access control
- Reentrancy protection

## Gas Optimization

- Uses storage efficiently
- Minimizes external calls
- Batches operations where possible
- Uses events for off-chain indexing

## Upgradeability

Currently, contracts are not upgradeable. For production, consider:
- Proxy pattern (UUPS or Transparent)
- Governance for upgrades
- Timelock for critical changes

