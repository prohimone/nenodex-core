const { ethers } = require("hardhat");

async function main() {
[owner, address1] = await ethers.getSigners(2);

const Factory = await ethers.getContractFactory("UniswapV2Factory");
const factory = await Factory.deploy(owner.address);
console.log("UniswapV2Factory address: " + factory.address);



}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
