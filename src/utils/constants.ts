import contractInterface from '../utils/contract-abi.json'

// Constants
export const TWITTER_HANDLE = "wrecsx";
export const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
// Add the domain you will be minting
export const TLD = ".regen";

export const CONTRACT_ADDRESS = '0xa8d592ecC2f2974668f27D9e0124D4c404A7Fd89'
export const OPENSEA_ADDRESS = `https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}`

export const APP_NAME = "Regen Domain Service"

export const contractConfig = {
  addressOrName: CONTRACT_ADDRESS,
  contractInterface: contractInterface.abi,
}
