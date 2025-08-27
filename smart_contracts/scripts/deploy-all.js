const hre = require("hardhat");
const fs = require("fs");
const { verify } = require("../utils/verify");
const {
  getAmountInWei,
  developmentChains,
  deployContract,
} = require("../utils/helpers");
const { debugLog } = require("../utils/debug");

async function main() {
  const deployNetwork = hre.network.name;
  const mintCost = getAmountInWei(10); // 10 matic
  debugLog("Mint cost set", mintCost);

  // Deploy AART Artists contract
  const artistsContract = await deployContract("AARTArtists", []);
  debugLog("Artists contract deployed", artistsContract.address);

  // Deploy AART NFT Collection contract
  const nftContract = await deployContract("AARTCollection", [
    artistsContract.address,
    mintCost,
  ]);
  debugLog("NFT contract deployed", nftContract.address);

  // unpause NFT contract
  await nftContract.pause(2);

  // Deploy AART market contract
  const marketContract = await deployContract("AARTMarket", [
    nftContract.address,
  ]);
  debugLog("Market contract deployed", marketContract.address);

  console.log("AART Artists contract deployed at: ", artistsContract.address);
  console.log("AART NFT contract deployed at: ", nftContract.address);
  console.log("AART market ontract deployed at: ", marketContract.address);
  console.log("Network deployed to : ", deployNetwork);

  /* transfer contracts addresses & ABIs to the front-end */
  if (fs.existsSync("../front-end/src")) {
    fs.rmSync("../src/artifacts", { recursive: true, force: true });
    fs.cpSync("./artifacts/contracts", "../front-end/src/artifacts", {
      recursive: true,
    });
    fs.writeFileSync(
      "../front-end/src/utils/contracts-config.js",
      `
      export const marketContractAddress = "${marketContract.address}"
      export const nftContractAddress = "${nftContract.address}"
      export const artistsContractAddress = "${artistsContract.address}"
      export const networkDeployedTo = "${hre.network.config.chainId}"`
    );
  }

  // contract verification on polygonscan
  if (
    !developmentChains.includes(deployNetwork) &&
    hre.config.etherscan.apiKey[deployNetwork]
  ) {
    console.log("waiting for 6 blocks verification ...");
    await marketContract.deployTransaction.wait(6);

    // args represent contract constructor arguments
    const args = [nftContract.address];
    await verify(marketContract.address, args);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    debugLog("Deployment failed", error);
    console.error(error);
    process.exit(1);
  });

