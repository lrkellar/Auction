
      // Addresses and chain ID are now environment-driven for deployment.
      // Configure these in `front-end/.env` or your hosting provider's env settings.
      // CRA exposes only variables prefixed with REACT_APP_.
      export const marketContractAddress = process.env.REACT_APP_MARKET_ADDRESS || "0x2772f74eA0912C7090e5FCbC4F4b533ffb34A5fa"
      export const nftContractAddress = process.env.REACT_APP_NFT_ADDRESS || "0x074e2ECD85AD545EE8B76637a4eB73ADc3ea13B6"
      export const artistsContractAddress = process.env.REACT_APP_ARTISTS_ADDRESS || "0x9562913e6A6e1E32832B75dDeaeeaeb2e03dD787"
      export const networkDeployedTo = process.env.REACT_APP_CHAIN_ID || "1337"
      export const mockDAIAddress = process.env.REACT_APP_MOCK_DAI_ADDRESS || "0xf3AE9B4ABD2B5f1B65C23047cd8209C16c080feE"
