const { ethers } = require("hardhat");

async function main() {
[owner, address1] = await ethers.getSigners(2);

const Factory = await ethers.getContractFactory("UniswapV2Factory");
const factory = await Factory.deploy(owner.address);
console.log("UniswapV2Factory address: " + factory.address);
await factory.setFeeTo(owner.address);

const Token0 = await ethers.getContractFactory("ERC20");
const token0 = await Token0.deploy(1000000);
console.log("Token0 address: " + token0.address);
console.log("Token0 balance: " + await token0.balanceOf(owner.address));
const Token1 = await ethers.getContractFactory("ERC20");
const token1 = await Token1.deploy(1000000);
console.log("Token1 address: " + token1.address);
console.log("Token1 balance: " + await token1.balanceOf(owner.address));

console.log(await factory.createPair(token0.address, token1.address)) ;
console.log("t0t1Pair address: "+ await factory.getPair(token0.address, token1.address));
// console.log(await factory.feeTo())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
