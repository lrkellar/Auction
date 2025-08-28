export const IPFS_GATEWAY = "https://storacha.link/ipfs/";

// DID for the pre-authorized Storacha space.
const SPACE_DID = "did:key:z6Mkq1yHd8MpsaDVGyTbKGnm39wMYHxkeuwP1HMHA7qdarJQ";

let client;
async function getClient() {
  if (!client) {
    const { create } = await import("@storacha/client");
    client = await create();
    // Select the provided space so uploads have a current context.
    await client.setCurrentSpace(SPACE_DID);
  }
  return client;
}

export const saveContent = async (file) => {
  try {
    console.debug("Uploading files to IPFS with Storacha...");
    const c = await getClient();
    const cid = await c.uploadFile(file);
    console.debug("Stored files with cid:", cid.toString());
    return cid.toString();
  } catch (error) {
    console.error("Storacha upload failed", error);
    throw error;
  }
};
