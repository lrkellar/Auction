import { create } from "@web3-storage/w3up-client";

export const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

// DID for the pre-authorized w3up space.
const SPACE_DID = "did:key:z6Mkq1yHd8MpsaDVGyTbKGnm39wMYHxkeuwP1HMHA7qdarJQ";

let client;
async function getClient() {
  if (!client) {
    client = await create();
    // Select the provided space so uploads have a current context.
    await client.setCurrentSpace(SPACE_DID);
  }
  return client;
}

export const saveContent = async (file) => {
  try {
    console.debug("Uploading files to IPFS with w3up...");
    const c = await getClient();
    const cid = await c.uploadFile(file);
    console.debug("Stored files with cid:", cid.toString());
    return cid.toString();
  } catch (error) {
    console.error("w3up upload failed", error);
    throw error;
  }
};
