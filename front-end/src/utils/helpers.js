import { ethers } from "ethers";

export const defaultProfileImg =
  "https://thumbs.dreamstime.com/b/profile-icon-black-background-graphic-web-design-modern-simple-vector-sign-internet-concept-trendy-symbol-profile-138113075.jpg";

export function getAmountInWei(amount) {
  try {
    return ethers.parseEther(amount.toString());
  } catch (error) {
    console.error("getAmountInWei error", error);
    throw error;
  }
}

export function getAmountFromWei(amount) {
  try {
    return Number(ethers.formatUnits(amount.toString(), "ether"));
  } catch (error) {
    console.error("getAmountFromWei error", error);
    return 0;
  }
}
