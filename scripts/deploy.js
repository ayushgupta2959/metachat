const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

async function main() {

  const [deployer] = await ethers.getSigners();
  const NAME = "Metachat";
  const SYMBOL = "MCH";

  const Metachat = await ethers.getContractFactory("Metachat");
  const metachat = await Metachat.deploy(NAME, SYMBOL);
  await metachat.deployed();

  console.log(`Deployed Metachat Contract at: ${metachat.address}\n`);

  const CHANNEL_NAMES = ["general", "intro", "jobs"];
  const COSTS = [tokens(1), tokens(0), tokens(0.25)];

  for (var i = 0; i < 3; i++) {
    const transaction = await metachat
      .connect(deployer)
      .createChannel(CHANNEL_NAMES[i], COSTS[i]);
    await transaction.wait();

    console.log(`Created text channel #${CHANNEL_NAMES[i]}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
