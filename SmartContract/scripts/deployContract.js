
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  [deployer,user1,user2] = await ethers.getSigners();
  const ContractFact = await hre.ethers.getContractFactory("StreaX_Contract",deployer);
  const StreaxContract = await ContractFact.deploy();
  await StreaxContract.deployed();
  console.log("Contract Deployed Succesfully!!!!!!");

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
