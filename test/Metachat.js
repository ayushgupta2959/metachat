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
  const CHANNEL_ID = 1;
  const CHANNEL_NAME = "general";
  const CHANNEL_COST = tokens(1);

  beforeEach(async () => {
    // Setup accounts
    [deployer, user] = await ethers.getSigners();

    // Deploy contract
    const Metachat = await ethers.getContractFactory("Metachat");
    metachat = await Metachat.deploy(NAME, SYMBOL);

    // Create a channel
    const transaction = await metachat
      .connect(deployer)
      .createChannel(CHANNEL_NAME, CHANNEL_COST);
    await transaction.wait();
  });

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

  describe("Creating Channels", () => {
    it("Returns total channels", async () => {
      const result = await metachat.totalChannels();
      expect(result).to.be.equal(1);
    });

    it("Returns channel attributes", async () => {
      const channel = await metachat.getChannel(CHANNEL_ID);
      expect(channel.id).to.be.equal(CHANNEL_ID);
      expect(channel.name).to.be.equal(CHANNEL_NAME);
      expect(channel.cost).to.be.equal(CHANNEL_COST);
    });
  });

  describe("Joining Channels", () => {
    beforeEach(async () => {
      const transaction = await metachat
        .connect(user)
        .mint(CHANNEL_ID, { value: CHANNEL_COST });
      await transaction.wait();
    });

    it("Joins the user", async () => {
      const result = await metachat.hasJoined(CHANNEL_ID, user.address);
      expect(result).to.be.equal(true);
    });

    it("Not joined channel", async () => {
      const result = await metachat.hasJoined(CHANNEL_ID, deployer.address);
      expect(result).to.be.equal(false);
    });

    it("Increases total supply", async () => {
      const result = await metachat.totalSupply();
      expect(result).to.be.equal(CHANNEL_ID);
    });

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(metachat.address);
      expect(result).to.be.equal(CHANNEL_COST);
    });
  });

  describe("Withdrawing", () => {
    let balanceBefore;

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      let transaction = await metachat
        .connect(user)
        .mint(CHANNEL_ID, { value: CHANNEL_COST });
      await transaction.wait();

      transaction = await metachat.connect(deployer).withdraw();
      await transaction.wait();
    });

    it("Updates the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(metachat.address);
      expect(result).to.equal(0);
    });
  });
});
