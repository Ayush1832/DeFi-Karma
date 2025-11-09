import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import {
  KarmaVault,
  YieldRouter,
  ImpactHook,
  AaveAdapter,
  MorphoAdapter,
  SparkAdapter,
  ERC20Mock,
} from "../typechain-types";

describe("KarmaVault", function () {
  let vault: KarmaVault;
  let router: YieldRouter;
  let hook: ImpactHook;
  let aaveAdapter: AaveAdapter;
  let morphoAdapter: MorphoAdapter;
  let sparkAdapter: SparkAdapter;
  let asset: ERC20Mock;
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;
  let recipient1: HardhatEthersSigner;
  let recipient2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user, recipient1, recipient2] = await ethers.getSigners();

    // Deploy mock ERC20 token
    const ERC20MockFactory = await ethers.getContractFactory("ERC20Mock");
    asset = await ERC20MockFactory.deploy();
    await asset.waitForDeployment();
    
    // Set decimals to 6 for USDC-like behavior
    await asset.setDecimals(6);

    // Deploy ImpactHook
    const ImpactHookFactory = await ethers.getContractFactory("ImpactHook");
    hook = await ImpactHookFactory.deploy(
      await asset.getAddress(),
      "0x1234567890123456789012345678901234567890", // Mock router
      "0x4567890123456789012345678901234567890123"  // Mock WETH
    );
    await hook.waitForDeployment();

    // Deploy YieldRouter
    const YieldRouterFactory = await ethers.getContractFactory("YieldRouter");
    router = await YieldRouterFactory.deploy(
      await asset.getAddress(),
      await hook.getAddress(),
      2000 // 20% donation
    );
    await router.waitForDeployment();

    // Add recipients
    await router.addRecipient(await recipient1.getAddress(), 5000);
    await router.addRecipient(await recipient2.getAddress(), 5000);

    // Deploy KarmaVault
    const KarmaVaultFactory = await ethers.getContractFactory("KarmaVault");
    vault = await KarmaVaultFactory.deploy(
      await asset.getAddress(),
      "DeFi Karma Vault",
      "DKV",
      await router.getAddress()
    );
    await vault.waitForDeployment();

    // Deploy adapters
    const AaveAdapterFactory = await ethers.getContractFactory("AaveAdapter");
    aaveAdapter = await AaveAdapterFactory.deploy(
      await asset.getAddress(),
      "0xA123456789012345678901234567890123456789", // Mock aToken
      "0xA212345678901234567890123456789012345678"  // Mock pool
    );
    await aaveAdapter.waitForDeployment();

    const MorphoAdapterFactory = await ethers.getContractFactory("MorphoAdapter");
    morphoAdapter = await MorphoAdapterFactory.deploy(
      await asset.getAddress(),
      "0xA312345678901234567890123456789012345678", // Mock vault
      "0xA412345678901234567890123456789012345678"  // Mock market
    );
    await morphoAdapter.waitForDeployment();

    const SparkAdapterFactory = await ethers.getContractFactory("SparkAdapter");
    sparkAdapter = await SparkAdapterFactory.deploy(
      await asset.getAddress(),
      "0xA512345678901234567890123456789012345678", // Mock pool
      "0xA612345678901234567890123456789012345678"  // Mock vault
    );
    await sparkAdapter.waitForDeployment();

    // Add adapters to vault
    await vault.addAdapter(await aaveAdapter.getAddress(), 5000);  // 50%
    await vault.addAdapter(await morphoAdapter.getAddress(), 3000); // 30%
    await vault.addAdapter(await sparkAdapter.getAddress(), 2000);  // 20%

    // Setup user with tokens
    const userBalance = ethers.parseUnits("1000000", 6); // 1M USDC (6 decimals)
    await asset.mint(await user.getAddress(), userBalance);
  });

  describe("Deployment", function () {
    it("Should deploy with correct parameters", async function () {
      expect(await vault.name()).to.equal("DeFi Karma Vault");
      expect(await vault.symbol()).to.equal("DKV");
      expect(await vault.yieldRouter()).to.equal(await router.getAddress());
    });

    it("Should have adapters configured", async function () {
      const adapterCount = await vault.getAdapterCount();
      expect(adapterCount).to.equal(3);
    });
  });

  describe("Deposit", function () {
    it("Should allow users to deposit assets", async function () {
      const depositAmount = ethers.parseUnits("10000", 6); // 10k USDC
      await asset.connect(user).approve(await vault.getAddress(), depositAmount);
      
      const tx = await vault.connect(user).deposit(depositAmount, await user.getAddress());
      await tx.wait();

      const userShares = await vault.balanceOf(await user.getAddress());
      expect(userShares).to.be.gt(0);
      
      const totalAssets = await vault.totalAssets();
      expect(totalAssets).to.equal(depositAmount);
    });

    it("Should reject zero amount deposits", async function () {
      await expect(
        vault.connect(user).deposit(0, await user.getAddress())
      ).to.be.revertedWith("Invalid amount");
    });
  });

  describe("Withdraw", function () {
    it("Should allow users to withdraw assets", async function () {
      const depositAmount = ethers.parseUnits("10000", 6);
      await asset.connect(user).approve(await vault.getAddress(), depositAmount);
      await vault.connect(user).deposit(depositAmount, await user.getAddress());
      
      const initialShares = await vault.balanceOf(await user.getAddress());
      const withdrawAmount = depositAmount / 2n;
      
      await vault.connect(user).withdraw(withdrawAmount, await user.getAddress(), await user.getAddress());
      
      const finalShares = await vault.balanceOf(await user.getAddress());
      expect(finalShares).to.be.lt(initialShares);
    });
  });

  describe("Harvest", function () {
    it("Should harvest yield from adapters", async function () {
      const depositAmount = ethers.parseUnits("100000", 6); // 100k USDC
      await asset.connect(user).approve(await vault.getAddress(), depositAmount);
      await vault.connect(user).deposit(depositAmount, await user.getAddress());

      const tx = await vault.harvest();
      await tx.wait();

      const totalYieldRouted = await router.totalYieldRouted();
      expect(totalYieldRouted).to.be.gt(0);
    });

    it("Should harvest and donate in one transaction", async function () {
      const depositAmount = ethers.parseUnits("100000", 6);
      await asset.connect(user).approve(await vault.getAddress(), depositAmount);
      await vault.connect(user).deposit(depositAmount, await user.getAddress());

      const tx = await vault.harvestAndDonate();
      const receipt = await tx.wait();

      // Check events
      const harvestEvent = receipt?.logs.find(
        (log: any) => log.eventName === "HarvestAndDonate"
      );
      expect(harvestEvent).to.not.be.undefined;
    });
  });

  describe("Adapter Allocation", function () {
    it("Should allocate funds to adapters correctly", async function () {
      const depositAmount = ethers.parseUnits("10000", 6);
      await asset.connect(user).approve(await vault.getAddress(), depositAmount);
      await vault.connect(user).deposit(depositAmount, await user.getAddress());

      // Check adapter balances (approximately 50%, 30%, 20%)
      const aaveAssets = await aaveAdapter.totalAssets();
      const morphoAssets = await morphoAdapter.totalAssets();
      const sparkAssets = await sparkAdapter.totalAssets();

      // Allow for small rounding differences
      expect(aaveAssets).to.be.closeTo(depositAmount * 50n / 100n, depositAmount * 1n / 100n);
      expect(morphoAssets).to.be.closeTo(depositAmount * 30n / 100n, depositAmount * 1n / 100n);
      expect(sparkAssets).to.be.closeTo(depositAmount * 20n / 100n, depositAmount * 1n / 100n);
    });
  });

  describe("Pause", function () {
    it("Should allow owner to pause the vault", async function () {
      await vault.pause();
      expect(await vault.paused()).to.be.true;
    });

    it("Should prevent deposits when paused", async function () {
      await vault.pause();
      const depositAmount = ethers.parseUnits("1000", 6);
      await asset.connect(user).approve(await vault.getAddress(), depositAmount);

      await expect(
        vault.connect(user).deposit(depositAmount, await user.getAddress())
      ).to.be.revertedWithCustomError(vault, "EnforcedPause");
    });

    it("Should allow owner to unpause the vault", async function () {
      await vault.pause();
      await vault.unpause();
      expect(await vault.paused()).to.be.false;
    });
  });

  describe("Access Control", function () {
    it("Should only allow owner to add adapters", async function () {
      const AdapterFactory = await ethers.getContractFactory("AaveAdapter");
      const newAdapter = await AdapterFactory.deploy(
        await asset.getAddress(),
        "0x123",
        "0x456"
      );
      await newAdapter.waitForDeployment();

      await expect(
        vault.connect(user).addAdapter(await newAdapter.getAddress(), 1000)
      ).to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
    });

    it("Should only allow owner to pause", async function () {
      await expect(
        vault.connect(user).pause()
      ).to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
    });
  });
});

