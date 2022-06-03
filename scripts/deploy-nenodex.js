const { ethers } = require("hardhat");

async function main() {
[owner, address1] = await ethers.getSigners(2);

const Factory = await ethers.getContractFactory("NenodexV1Factory");
const factory = await Factory.deploy(owner.address);
console.log("NenodexV1Factory address: " + factory.address);
await factory.setFeeTo(owner.address);


const token = await ethers.getContractFactory("Token");
wftm = await token.deploy('WFTM', 'WFTM', 6, owner.address);
usdc = await token.deploy('USDC', 'USDC', 6, owner.address);
mim = await token.deploy('MIM', 'MIM', 18, owner.address);
dai = await token.deploy('DAI', 'DAI', 18, owner.address);
console.log("wftm address: " + wftm.address);
console.log("usdc address: " + usdc.address);
console.log("dai address: " + dai.address);
console.log("mim address: " + mim.address)
await wftm.mint(owner.address, ethers.BigNumber.from("1000000000000000000"));
await usdc.mint(owner.address, ethers.BigNumber.from("1000000000000000000"));
await mim.mint(owner.address, ethers.BigNumber.from("1000000000000000000000000000000"));
await dai.mint(owner.address, ethers.BigNumber.from("1000000000000000000000000000000"));
// const mim_100000000 = ethers.BigNumber.from("100000000000000000000000000");
// const dai_100000000 = ethers.BigNumber.from("100000000000000000000000000");

console.log(await factory.allPairsLength())
await factory.createPair(mim.address, dai.address)
console.log(await factory.allPairsLength())

}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
