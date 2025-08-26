import { create } from "@web3-storage/w3up-client";

export const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

let client;
async function getClient() {
  if (!client) {
    client = await create();
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
