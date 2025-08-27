const hre = require("hardhat");
const fs = require("fs");
const fse = require("fs-extra");
const { getAmountInWei, deployContract } = require("../utils/helpers");
const { debugLog } = require("../utils/debug");

async function main() {
  const deployNetwork = hre.network.name;
  const mintCost = getAmountInWei(10); // 10 matic
  debugLog("Mint cost set", mintCost);

  // Deploy DAI ERC20 mock
  const mockDAI = await deployContract("ERC20Mock", [18]);
  debugLog("Mock DAI deployed", mockDAI.address);

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

  // add mock DAI to market supported tokens
  await marketContract.addSupportedToken(mockDAI.address);

  console.log("AART Artists contract deployed at:\n", artistsContract.address);
  console.log("AART NFT contract deployed at:\n", nftContract.address);
  console.log("AART market ontract deployed at:\n", marketContract.address);
  console.log("Network deployed to :\n", deployNetwork);

  /* transfer contracts addresses & ABIs to the front-end */
  if (fs.existsSync("../front-end/src")) {
    fs.rmSync("../src/artifacts", { recursive: true, force: true });
    fse.copySync("./artifacts/contracts", "../front-end/src/artifacts");
    fs.writeFileSync(
      "../front-end/src/utils/contracts-config.js",
      `
      export const marketContractAddress = "${marketContract.address}"
      export const nftContractAddress = "${nftContract.address}"
      export const artistsContractAddress = "${artistsContract.address}"
      export const networkDeployedTo = "${hre.network.config.chainId}"
      export const mockDAIAddress = "${mockDAI.address}"`
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

