import hre from "hardhat";
import fs from "fs";
import fse from "fs-extra";
import { getAmountInWei, deployContract } from "../utils/helpers.js";
import { debugLog } from "../utils/debug.js";

async function main() {
  const deployNetwork = hre.network.name;
  const mintCost = getAmountInWei(10); // 10 matic
  debugLog("Mint cost set", mintCost);

  // Deploy DAI ERC20 mock
  const mockDAI = await deployContract("ERC20Mock", [18]);
  debugLog("Mock DAI deployed", mockDAI.target);

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

  // add mock DAI to market supported tokens
  await marketContract.addSupportedToken(mockDAI.target);

  console.log("AART Artists contract deployed at:\n", artistsContract.target);
  console.log("AART NFT contract deployed at:\n", nftContract.target);
  console.log("AART market ontract deployed at:\n", marketContract.target);
  console.log("Network deployed to :\n", deployNetwork);

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
      export const networkDeployedTo = "${hre.network.config.chainId}"
      export const mockDAIAddress = "${mockDAI.target}"`
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    debugLog("Deployment failed", error);
    console.error(error);
    process.exit(1);
  });
