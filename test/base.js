const { expect } = require("chai");
const { ethers } = require("hardhat");

function getCreate2Address(
  factoryAddress,
  [tokenA, tokenB],
  bytecode
) {
  const [token0, token1] = tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA]
  const create2Inputs = [
    '0xff',
    factoryAddress,
    keccak256(solidityPack(['address', 'address'], [token0, token1])),
    keccak256(bytecode)
  ]
  const sanitizedInputs = `0x${create2Inputs.map(i => i.slice(2)).join('')}`
  return getAddress(`0x${keccak256(sanitizedInputs).slice(-40)}`)
}

describe("core", function () {

  let token;
  let wftm;
  let usdc;
  let mim;
  let dai;
  let factory;
  let router;
  let pair;
  let pair2;
  let pair3;
  let owner;

  let owner2;
  let owner3;

  it("deploy base coins", async function () {
    [owner, owner2, owner3] = await ethers.getSigners(3);
    token = await ethers.getContractFactory("Token");
    wftm = await token.deploy('WFTM', 'WFTM', 18, owner.address);
    usdc = await token.deploy('USDC', 'USDC', 6, owner.address);
    mim = await token.deploy('MIM', 'MIM', 18, owner.address);
    dai = await token.deploy('DAI', 'DAI', 18, owner.address);

    await wftm.mint(owner.address, ethers.BigNumber.from("1000000000000000000000000000000"));
    await wftm.mint(owner2.address, ethers.BigNumber.from("1000000000000000000000000000000"));
    await wftm.mint(owner3.address, ethers.BigNumber.from("1000000000000000000000000000000"));

    await usdc.mint(owner.address, ethers.BigNumber.from("1000000000000000000"));
    await usdc.mint(owner2.address, ethers.BigNumber.from("1000000000000000000"));
    await usdc.mint(owner3.address, ethers.BigNumber.from("1000000000000000000"));

    await mim.mint(owner.address, ethers.BigNumber.from("1000000000000000000000000000000"));
    await mim.mint(owner2.address, ethers.BigNumber.from("1000000000000000000000000000000"));
    await mim.mint(owner3.address, ethers.BigNumber.from("1000000000000000000000000000000"));

    await dai.mint(owner.address, ethers.BigNumber.from("1000000000000000000000000000000"));
    await dai.mint(owner2.address, ethers.BigNumber.from("1000000000000000000000000000000"));
    await dai.mint(owner3.address, ethers.BigNumber.from("1000000000000000000000000000000"));

    await wftm.deployed();
    await usdc.deployed();
    await mim.deployed();
    await dai.deployed();
  });

  it("confirm wftm deployment", async function () {
    expect(await wftm.name()).to.equal("WFTM");
  });

  it("confirm usdc deployment", async function () {
    expect(await usdc.name()).to.equal("USDC");
  });

  it("confirm mim deployment", async function () {
    expect(await mim.name()).to.equal("MIM");
  });

  it("confirm dai deployment", async function () {
    expect(await dai.name()).to.equal("DAI");
  });

  it("deploy UniswapV2Factory and test pair length", async function () {
    const BaseV1Factory = await ethers.getContractFactory("UniswapV2Factory");
    factory = await BaseV1Factory.deploy(owner.address);
    await factory.deployed();

    expect(await factory.allPairsLength()).to.equal(0);
  });

  it("deploy UniswapV2Router02 and test factory address", async function () {
    const BaseV1Router = await ethers.getContractFactory("UniswapV2Router02");
    router = await BaseV1Router.deploy(factory.address, wftm.address);
    await router.deployed();

    expect(await router.factory()).to.equal(factory.address);
  });

  it("create pair via BaseV1Factory owner", async function () {
    await factory.createPair(mim.address, dai.address);
  });

  it("confirm pair for mim-dai", async function () {
    const BaseV1Pair = await ethers.getContractFactory("UniswapV2Pair");
    const address1 = await factory.getPair(mim.address, dai.address);
    pair1 = await BaseV1Pair.attach(address1);
  });

  it("BaseV1Router01 addLiquidity", async function () {

    const mim_100000000 = ethers.BigNumber.from("100000000000000000000000000");
    const dai_100000000 = ethers.BigNumber.from("100000000000000000000000000");

    await dai.approve(router.address, dai_100000000);
    await mim.approve(router.address, mim_100000000);
    console.log(router.address)
    // await router.addLiquidity(mim.address, dai.address, mim_100000000, dai_100000000, mim_100000000, dai_100000000, owner.address, Date.now());
    // console.log("LPair3 (Mim-Dai) balance of: " + await pair1.balanceOf(owner.address));
    // console.log("MIM balance owner: " +  await mim.balanceOf(owner.address));
    // console.log("DAI balance owner: " + await dai.balanceOf(owner.address));
  });

});