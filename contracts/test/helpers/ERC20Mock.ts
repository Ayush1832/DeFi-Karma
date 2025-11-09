import { ethers } from "hardhat";

export async function deployERC20Mock() {
  const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
  const mock = await ERC20Mock.deploy();
  await mock.waitForDeployment();
  return mock;
}

