import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

// Testnet addresses (update these for your deployment)
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // Sepolia USDC
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // Sepolia WETH

// Protocol addresses (update these with actual testnet addresses)
const AAVE_POOL = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2"; // Aave v3 Pool
const AAVE_ATOKEN = "0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c"; // aUSDC

const MORPHO_VAULT = ethers.ZeroAddress; // Update with Morpho v2 vault
const MORPHO_MARKET = ethers.ZeroAddress; // Update with Morpho market

const SPARK_POOL = ethers.ZeroAddress; // Update with Spark pool
const SPARK_VAULT = ethers.ZeroAddress; // Update with Spark vault

const YEARN_STRATEGY = ethers.ZeroAddress; // Update with Yearn v3 strategy
const YEARN_VAULT = ethers.ZeroAddress; // Update with Yearn vault

const UNISWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // Uniswap V3 Router

// Public goods recipients
const RECIPIENTS = [
  "0x7d655c57f71464B6f83811C55D84009Cd9f5221C", // Gitcoin
  "0xF29Ff96aaEa6C9A1f2518514c55E2D4f4E8b4E2B", // Protocol Guild
];

const ALLOCATIONS = [5000, 5000]; // 50% each

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy ImpactHook
  console.log("\nDeploying ImpactHook...");
  const ImpactHook = await ethers.getContractFactory("ImpactHook");
  const impactHook = await ImpactHook.deploy(USDC, UNISWAP_ROUTER, WETH);
  await impactHook.waitForDeployment();
  const impactHookAddress = await impactHook.getAddress();
  console.log("ImpactHook deployed at:", impactHookAddress);

  // Deploy YieldRouter
  console.log("\nDeploying YieldRouter...");
  const YieldRouter = await ethers.getContractFactory("YieldRouter");
  const yieldRouter = await YieldRouter.deploy(USDC, impactHookAddress, 2000); // 20% donation ratio
  await yieldRouter.waitForDeployment();
  const yieldRouterAddress = await yieldRouter.getAddress();
  console.log("YieldRouter deployed at:", yieldRouterAddress);

  // Add recipients to router
  console.log("\nAdding recipients to router...");
  for (let i = 0; i < RECIPIENTS.length; i++) {
    const tx = await yieldRouter.addRecipient(RECIPIENTS[i], ALLOCATIONS[i]);
    await tx.wait();
    console.log(`Added recipient ${i + 1}: ${RECIPIENTS[i]} with ${ALLOCATIONS[i]} bps allocation`);
  }

  // Deploy KarmaVault
  console.log("\nDeploying KarmaVault...");
  const KarmaVault = await ethers.getContractFactory("KarmaVault");
  const vault = await KarmaVault.deploy(
    USDC,
    "DeFi Karma Vault",
    "DKV",
    yieldRouterAddress
  );
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("KarmaVault deployed at:", vaultAddress);

  // Deploy Adapters
  console.log("\nDeploying AaveAdapter...");
  const AaveAdapter = await ethers.getContractFactory("AaveAdapter");
  const aaveAdapter = await AaveAdapter.deploy(USDC, AAVE_ATOKEN, AAVE_POOL);
  await aaveAdapter.waitForDeployment();
  const aaveAdapterAddress = await aaveAdapter.getAddress();
  console.log("AaveAdapter deployed at:", aaveAdapterAddress);

  console.log("\nDeploying MorphoAdapter...");
  const MorphoAdapter = await ethers.getContractFactory("MorphoAdapter");
  const morphoAdapter = await MorphoAdapter.deploy(USDC, MORPHO_VAULT, MORPHO_MARKET);
  await morphoAdapter.waitForDeployment();
  const morphoAdapterAddress = await morphoAdapter.getAddress();
  console.log("MorphoAdapter deployed at:", morphoAdapterAddress);

  console.log("\nDeploying SparkAdapter...");
  const SparkAdapter = await ethers.getContractFactory("SparkAdapter");
  const sparkAdapter = await SparkAdapter.deploy(USDC, SPARK_POOL, SPARK_VAULT);
  await sparkAdapter.waitForDeployment();
  const sparkAdapterAddress = await sparkAdapter.getAddress();
  console.log("SparkAdapter deployed at:", sparkAdapterAddress);

  // Add adapters to vault with allocations
  console.log("\nConfiguring vault adapters...");
  let tx = await vault.addAdapter(aaveAdapterAddress, 5000); // 50% Aave
  await tx.wait();
  console.log("Added AaveAdapter with 50% allocation");

  tx = await vault.addAdapter(morphoAdapterAddress, 3000); // 30% Morpho
  await tx.wait();
  console.log("Added MorphoAdapter with 30% allocation");

  tx = await vault.addAdapter(sparkAdapterAddress, 2000); // 20% Spark
  await tx.wait();
  console.log("Added SparkAdapter with 20% allocation");

  console.log("\n=== Deployment Summary ===");
  console.log("KarmaVault:", vaultAddress);
  console.log("YieldRouter:", yieldRouterAddress);
  console.log("ImpactHook:", impactHookAddress);
  console.log("AaveAdapter:", aaveAdapterAddress);
  console.log("MorphoAdapter:", morphoAdapterAddress);
  console.log("SparkAdapter:", sparkAdapterAddress);
  console.log("========================\n");

  // Save deployment addresses to a file
  const deploymentInfo = {
    network: await ethers.provider.getNetwork(),
    deployer: deployer.address,
    contracts: {
      KarmaVault: vaultAddress,
      YieldRouter: yieldRouterAddress,
      ImpactHook: impactHookAddress,
      AaveAdapter: aaveAdapterAddress,
      MorphoAdapter: morphoAdapterAddress,
      SparkAdapter: sparkAdapterAddress,
    },
    timestamp: new Date().toISOString(),
  };

  console.log("Deployment info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

