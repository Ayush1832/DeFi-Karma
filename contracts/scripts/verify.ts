import { run } from "hardhat/config";

/**
 * Helper script to verify contracts on Etherscan
 * Usage: npx hardhat run scripts/verify.ts --network sepolia
 */

async function main() {
  // Update these addresses after deployment
  const contracts = {
    KarmaVault: {
      address: "0x...", // Update with deployed address
      args: [
        "0x...", // USDC address
        "DeFi Karma Vault",
        "DKV",
        "0x...", // YieldRouter address
      ],
    },
    YieldRouter: {
      address: "0x...", // Update with deployed address
      args: [
        "0x...", // USDC address
        "0x...", // ImpactHook address
        2000, // Donation ratio
      ],
    },
    ImpactHook: {
      address: "0x...", // Update with deployed address
      args: [
        "0x...", // USDC address
        "0x...", // Uniswap router
        "0x...", // WETH address
      ],
    },
  };

  console.log("Update the contract addresses in this file and run:");
  console.log("npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

