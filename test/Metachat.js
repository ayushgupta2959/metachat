const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Metachat", function () {
  let deployer, user;
  let metachat;

  const NAME = "Metachat";
  const SYMBOL = "MCH";

  beforeEach(async () => {
    // Setup accounts
    [deployer, user] = await ethers.getSigners()

    // Deploy contract
    const Metachat = await ethers.getContractFactory("Metachat")
    metachat = await Metachat.deploy(NAME, SYMBOL)
  })

  describe("Deployment", function () {
    it("Sets the name", async () => {
      const result = await metachat.name();
      expect(result).to.equal(NAME);
    });

    it("Sets the symbol", async () => {
      const result = await metachat.symbol();
      expect(result).to.equal(SYMBOL);
    });

    it("Sets the owner", async () => {
      const result = await metachat.owner();
      expect(result).to.equal(deployer.address);
    });
  });
});
