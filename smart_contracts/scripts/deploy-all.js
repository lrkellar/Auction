import hre from "hardhat";
import fs from "fs";
import fse from "fs-extra";
import { verify } from "../utils/verify.js";
import {
  getAmountInWei,
  developmentChains,
  deployContract,
} from "../utils/helpers.js";
import { debugLog } from "../utils/debug.js";

async function main() {
  const deployNetwork = hre.network.name;
  const mintCost = getAmountInWei(10); // 10 matic
  debugLog("Mint cost set", mintCost);

  // Deploy AART Artists contract
  const artistsContract = await deployContract("AARTArtists", []);
  debugLog("Artists contract deployed", artistsContract.target);

  // Deploy AART NFT Collection contract
  const nftContract = await deployContract("AARTCollection", [
    artistsContract.target,
    mintCost,
  ]);
  debugLog("NFT contract deployed", nftContract.target);

  // unpause NFT contract
  await nftContract.pause(2);

  // Deploy AART market contract
  const marketContract = await deployContract("AARTMarket", [
    nftContract.target,
  ]);
  debugLog("Market contract deployed", marketContract.target);

  console.log("AART Artists contract deployed at: ", artistsContract.target);
  console.log("AART NFT contract deployed at: ", nftContract.target);
  console.log("AART market ontract deployed at: ", marketContract.target);
  console.log("Network deployed to : ", deployNetwork);

  /* transfer contracts addresses & ABIs to the front-end */
  if (fs.existsSync("../front-end/src")) {
    fs.rmSync("../src/artifacts", { recursive: true, force: true });
    fse.copySync("./artifacts/contracts", "../front-end/src/artifacts");
    fs.writeFileSync(
      "../front-end/src/utils/contracts-config.js",
      `
      export const marketContractAddress = "${marketContract.target}"
      export const nftContractAddress = "${nftContract.target}"
      export const artistsContractAddress = "${artistsContract.target}"
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
    const args = [nftContract.target];
    await verify(marketContract.target, args);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    debugLog("Deployment failed", error);
    console.error(error);
    process.exit(1);
  });
