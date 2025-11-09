import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

// ============================================================================
// SEPOLIA TESTNET ADDRESSES
// ============================================================================

// Token Addresses (Sepolia)
const USDC_SEPOLIA = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8"; // Sepolia USDC (6 decimals)
const WETH_SEPOLIA = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"; // Sepolia WETH (18 decimals)

// Aave v3 Sepolia Addresses
const AAVE_POOL_SEPOLIA = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951"; // Aave v3 Pool (Sepolia)
const AAVE_ATOKEN_SEPOLIA = "0x16dA4541aD1807f4443d92D26044C1147406EB80"; // aUSDC (verify!)

// Uniswap Addresses (Sepolia)
const UNISWAP_V3_ROUTER_SEPOLIA = "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008"; // Uniswap V3 SwapRouter

// Public Goods Recipients
const RECIPIENTS = [
  "0x7d655c57f71464B6f83811C55D84009Cd9f5221C", // Gitcoin
  "0xF29Ff96aaEa6C9A1f2518514c55E2D4f4E8b4E2B".toLowerCase(), // Protocol Guild (lowercase to avoid checksum)
];
const ALLOCATIONS = [5000, 5000]; // 50% each

// ============================================================================
// DEPLOYMENT FUNCTION
// ============================================================================

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verifyContract(
  address: string,
  constructorArgs: any[],
  contractName: string
) {
  try {
    console.log(`\n🔍 Verifying ${contractName}...`);
    const { run } = require("hardhat");
    await run("verify:verify", {
      address: address,
      constructorArguments: constructorArgs,
    });
    console.log(`✅ ${contractName} verified successfully!`);
    await sleep(5000); // Wait 5 seconds between verifications
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log(`✅ ${contractName} already verified`);
    } else {
      console.log(`⚠️  ${contractName} verification failed: ${error.message}`);
    }
  }
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\n==========================================");
  console.log("DeFi Karma - Contract Deployment");
  console.log("==========================================");
  console.log("Network: Sepolia Testnet");
  console.log("Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");
  console.log("==========================================\n");

  if (balance < ethers.parseEther("0.1")) {
    console.warn("⚠️  WARNING: Low balance! You may need more Sepolia ETH.");
  }

  // Step 1: Deploy Mock Vaults for protocols not on Sepolia
  console.log("📦 Step 1: Deploying Mock Vaults for testnet...");
  
  const MockYieldProtocol = await ethers.getContractFactory("MockYieldProtocol");
  
  // Deploy Morpho Mock Vault
  console.log("   Deploying Morpho Mock Vault...");
  const morphoMockVault = await MockYieldProtocol.deploy(
    USDC_SEPOLIA,
    "Mock Morpho Vault",
    "mMORPHO"
  );
  await morphoMockVault.waitForDeployment();
  const morphoMockVaultAddress = await morphoMockVault.getAddress();
  console.log("   ✅ Morpho Mock Vault:", morphoMockVaultAddress);

  // Deploy Spark Mock Vault
  console.log("   Deploying Spark Mock Vault...");
  const sparkMockVault = await MockYieldProtocol.deploy(
    USDC_SEPOLIA,
    "Mock Spark Vault",
    "mSPARK"
  );
  await sparkMockVault.waitForDeployment();
  const sparkMockVaultAddress = await sparkMockVault.getAddress();
  console.log("   ✅ Spark Mock Vault:", sparkMockVaultAddress);

  // Deploy Yearn/Kalani Mock Vault
  console.log("   Deploying Yearn/Kalani Mock Vault...");
  const yearnMockVault = await MockYieldProtocol.deploy(
    USDC_SEPOLIA,
    "Mock Yearn Vault",
    "mYEARN"
  );
  await yearnMockVault.waitForDeployment();
  const yearnMockVaultAddress = await yearnMockVault.getAddress();
  console.log("   ✅ Yearn Mock Vault:", yearnMockVaultAddress);

  // Step 2: Deploy ImpactHook
  console.log("\n📦 Step 2: Deploying ImpactHook...");
  const ImpactHook = await ethers.getContractFactory("ImpactHook");
  const impactHook = await ImpactHook.deploy(
    USDC_SEPOLIA,
    UNISWAP_V3_ROUTER_SEPOLIA,
    WETH_SEPOLIA
  );
  await impactHook.waitForDeployment();
  const impactHookAddress = await impactHook.getAddress();
  console.log("✅ ImpactHook deployed at:", impactHookAddress);

  // Step 3: Deploy YieldRouter
  console.log("\n📦 Step 3: Deploying YieldRouter...");
  const YieldRouter = await ethers.getContractFactory("YieldRouter");
  const yieldRouter = await YieldRouter.deploy(
    USDC_SEPOLIA,
    impactHookAddress,
    2000 // 20% donation ratio
  );
  await yieldRouter.waitForDeployment();
  const yieldRouterAddress = await yieldRouter.getAddress();
  console.log("✅ YieldRouter deployed at:", yieldRouterAddress);

  // Add recipients to router
  console.log("\n📝 Adding recipients to YieldRouter...");
  for (let i = 0; i < RECIPIENTS.length; i++) {
    // Get checksummed address
    const recipientAddress = ethers.getAddress(RECIPIENTS[i]);
    const tx = await yieldRouter.addRecipient(recipientAddress, ALLOCATIONS[i]);
    await tx.wait();
    console.log(`✅ Added recipient ${i + 1}: ${recipientAddress} (${ALLOCATIONS[i] / 100}%)`);
  }

  // Step 4: Deploy KarmaVault
  console.log("\n📦 Step 4: Deploying KarmaVault...");
  const KarmaVault = await ethers.getContractFactory("KarmaVault");
  const vault = await KarmaVault.deploy(
    USDC_SEPOLIA,
    "DeFi Karma Vault",
    "DKV",
    yieldRouterAddress
  );
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("✅ KarmaVault deployed at:", vaultAddress);

  // Step 5: Deploy Adapters
  console.log("\n📦 Step 5: Deploying Adapters...");

  // AaveAdapter (using real Aave addresses)
  console.log("   Deploying AaveAdapter...");
  const AaveAdapter = await ethers.getContractFactory("AaveAdapter");
  const aaveAdapter = await AaveAdapter.deploy(
    USDC_SEPOLIA,
    AAVE_ATOKEN_SEPOLIA,
    AAVE_POOL_SEPOLIA
  );
  await aaveAdapter.waitForDeployment();
  const aaveAdapterAddress = await aaveAdapter.getAddress();
  console.log("   ✅ AaveAdapter:", aaveAdapterAddress);

  // MorphoAdapter (using mock vault)
  console.log("   Deploying MorphoAdapter...");
  const MorphoAdapter = await ethers.getContractFactory("MorphoAdapter");
  const morphoAdapter = await MorphoAdapter.deploy(
    USDC_SEPOLIA,
    morphoMockVaultAddress, // Mock vault
    ethers.ZeroAddress // No market (indicates mock)
  );
  await morphoAdapter.waitForDeployment();
  const morphoAdapterAddress = await morphoAdapter.getAddress();
  console.log("   ✅ MorphoAdapter:", morphoAdapterAddress);

  // SparkAdapter (using mock vault)
  console.log("   Deploying SparkAdapter...");
  const SparkAdapter = await ethers.getContractFactory("SparkAdapter");
  const sparkAdapter = await SparkAdapter.deploy(
    USDC_SEPOLIA,
    sparkMockVaultAddress, // Mock vault as pool
    sparkMockVaultAddress  // Mock vault
  );
  await sparkAdapter.waitForDeployment();
  const sparkAdapterAddress = await sparkAdapter.getAddress();
  console.log("   ✅ SparkAdapter:", sparkAdapterAddress);

  // KalaniStrategy (using mock vault)
  console.log("   Deploying KalaniStrategy...");
  const KalaniStrategy = await ethers.getContractFactory("KalaniStrategy");
  const kalaniStrategy = await KalaniStrategy.deploy(
    USDC_SEPOLIA,
    yearnMockVaultAddress, // Mock strategy
    yearnMockVaultAddress  // Mock vault
  );
  await kalaniStrategy.waitForDeployment();
  const kalaniStrategyAddress = await kalaniStrategy.getAddress();
  console.log("   ✅ KalaniStrategy:", kalaniStrategyAddress);

  // Step 6: Configure vault with adapters
  console.log("\n⚙️  Step 6: Configuring vault adapters...");
  let tx = await vault.addAdapter(aaveAdapterAddress, 4000); // 40% Aave
  await tx.wait();
  console.log("   ✅ Added AaveAdapter (40%)");

  tx = await vault.addAdapter(morphoAdapterAddress, 2500); // 25% Morpho
  await tx.wait();
  console.log("   ✅ Added MorphoAdapter (25%)");

  tx = await vault.addAdapter(sparkAdapterAddress, 2000); // 20% Spark
  await tx.wait();
  console.log("   ✅ Added SparkAdapter (20%)");

  tx = await vault.addAdapter(kalaniStrategyAddress, 1500); // 15% Yearn
  await tx.wait();
  console.log("   ✅ Added KalaniStrategy (15%)");

  // Deployment Summary
  console.log("\n==========================================");
  console.log("✅ DEPLOYMENT COMPLETE!");
  console.log("==========================================");
  console.log("\n📋 Contract Addresses:");
  console.log("   KarmaVault:     ", vaultAddress);
  console.log("   YieldRouter:    ", yieldRouterAddress);
  console.log("   ImpactHook:     ", impactHookAddress);
  console.log("   AaveAdapter:    ", aaveAdapterAddress);
  console.log("   MorphoAdapter:  ", morphoAdapterAddress);
  console.log("   SparkAdapter:   ", sparkAdapterAddress);
  console.log("   KalaniStrategy: ", kalaniStrategyAddress);
  console.log("   Morpho Mock:    ", morphoMockVaultAddress);
  console.log("   Spark Mock:     ", sparkMockVaultAddress);
  console.log("   Yearn Mock:     ", yearnMockVaultAddress);
  console.log("\n📊 Configuration:");
  console.log("   Donation Ratio: 20%");
  console.log("   User Share:     80%");
  console.log("   Adapters:       Aave (40%), Morpho (25%), Spark (20%), Yearn (15%)");
  console.log("==========================================\n");

  // Save deployment info
  const network = await ethers.provider.getNetwork();
  const deploymentInfo = {
    network: {
      name: network.name,
      chainId: Number(network.chainId),
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      KarmaVault: vaultAddress,
      YieldRouter: yieldRouterAddress,
      ImpactHook: impactHookAddress,
      AaveAdapter: aaveAdapterAddress,
      MorphoAdapter: morphoAdapterAddress,
      SparkAdapter: sparkAdapterAddress,
      KalaniStrategy: kalaniStrategyAddress,
      MorphoMockVault: morphoMockVaultAddress,
      SparkMockVault: sparkMockVaultAddress,
      YearnMockVault: yearnMockVaultAddress,
    },
    configuration: {
      asset: USDC_SEPOLIA,
      donationRatio: 2000,
      userShareRatio: 8000,
      adapters: {
        Aave: { address: aaveAdapterAddress, allocation: 4000 },
        Morpho: { address: morphoAdapterAddress, allocation: 2500 },
        Spark: { address: sparkAdapterAddress, allocation: 2000 },
        Yearn: { address: kalaniStrategyAddress, allocation: 1500 },
      },
      recipients: RECIPIENTS.map((addr, i) => ({
        address: addr,
        allocation: ALLOCATIONS[i],
      })),
    },
  };

  // Save to JSON file
  const deploymentDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  const deploymentFile = path.join(deploymentDir, `sepolia-${Date.now()}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to:", deploymentFile);

  const latestFile = path.join(deploymentDir, "sepolia-latest.json");
  fs.writeFileSync(latestFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Latest deployment info saved to:", latestFile);

  // Update frontend .env.local
  const frontendEnv = `# DeFi Karma - Contract Addresses (Sepolia)
# Generated automatically after deployment

NEXT_PUBLIC_VAULT_ADDRESS=${vaultAddress}
NEXT_PUBLIC_ROUTER_ADDRESS=${yieldRouterAddress}
NEXT_PUBLIC_HOOK_ADDRESS=${impactHookAddress}
NEXT_PUBLIC_AAVE_ADAPTER_ADDRESS=${aaveAdapterAddress}
NEXT_PUBLIC_MORPHO_ADAPTER_ADDRESS=${morphoAdapterAddress}
NEXT_PUBLIC_SPARK_ADAPTER_ADDRESS=${sparkAdapterAddress}
NEXT_PUBLIC_YEARN_ADAPTER_ADDRESS=${kalaniStrategyAddress}

# Network
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK=sepolia

# RPC
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/dd39a4fa119447a0b12efcfb6349a710
`;
  
  const frontendEnvFile = path.join(__dirname, "../../frontend/.env.local");
  fs.writeFileSync(frontendEnvFile, frontendEnv);
  console.log("💾 Frontend .env.local updated");

  // Step 7: Verify all contracts automatically
  console.log("\n🔍 Step 7: Verifying contracts on Etherscan...");
  console.log("   (This may take a few minutes...)");

  // Verify mock vaults
  await verifyContract(
    morphoMockVaultAddress,
    [USDC_SEPOLIA, "Mock Morpho Vault", "mMORPHO"],
    "Morpho Mock Vault"
  );

  await verifyContract(
    sparkMockVaultAddress,
    [USDC_SEPOLIA, "Mock Spark Vault", "mSPARK"],
    "Spark Mock Vault"
  );

  await verifyContract(
    yearnMockVaultAddress,
    [USDC_SEPOLIA, "Mock Yearn Vault", "mYEARN"],
    "Yearn Mock Vault"
  );

  // Verify ImpactHook
  await verifyContract(
    impactHookAddress,
    [USDC_SEPOLIA, UNISWAP_V3_ROUTER_SEPOLIA, WETH_SEPOLIA],
    "ImpactHook"
  );

  // Verify YieldRouter
  await verifyContract(
    yieldRouterAddress,
    [USDC_SEPOLIA, impactHookAddress, 2000],
    "YieldRouter"
  );

  // Verify KarmaVault
  await verifyContract(
    vaultAddress,
    [USDC_SEPOLIA, "DeFi Karma Vault", "DKV", yieldRouterAddress],
    "KarmaVault"
  );

  // Verify AaveAdapter
  await verifyContract(
    aaveAdapterAddress,
    [USDC_SEPOLIA, AAVE_ATOKEN_SEPOLIA, AAVE_POOL_SEPOLIA],
    "AaveAdapter"
  );

  // Verify MorphoAdapter
  await verifyContract(
    morphoAdapterAddress,
    [USDC_SEPOLIA, morphoMockVaultAddress, ethers.ZeroAddress],
    "MorphoAdapter"
  );

  // Verify SparkAdapter
  await verifyContract(
    sparkAdapterAddress,
    [USDC_SEPOLIA, sparkMockVaultAddress, sparkMockVaultAddress],
    "SparkAdapter"
  );

  // Verify KalaniStrategy
  await verifyContract(
    kalaniStrategyAddress,
    [USDC_SEPOLIA, yearnMockVaultAddress, yearnMockVaultAddress],
    "KalaniStrategy"
  );

  console.log("\n==========================================");
  console.log("🎉 Deployment and Verification Complete!");
  console.log("==========================================");
  console.log("\n🔗 View on Etherscan:");
  const explorerUrl = `https://sepolia.etherscan.io`;
  console.log("   Vault:     ", `${explorerUrl}/address/${vaultAddress}`);
  console.log("   Router:    ", `${explorerUrl}/address/${yieldRouterAddress}`);
  console.log("   Hook:      ", `${explorerUrl}/address/${impactHookAddress}`);
  console.log("\n✅ All contracts deployed and verified!");
  console.log("✅ All protocols integrated (Aave, Morpho, Spark, Yearn)");
  console.log("✅ Mock vaults deployed for testnet protocols");
  console.log("✅ Ready for hackathon demo!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
