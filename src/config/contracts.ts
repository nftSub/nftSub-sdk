export const CONTRACT_ADDRESSES = {
  // Mainnet Chains - All use same addresses due to CREATE2 deployment
  base: {
    subscriptionManager: '0x99ad42b29a7a99Ee4552cf6dc36dc4d44d8b0A2c' as const,
    subscriptionNFT: '0x6D4b8BC4613dDCB98450a97b297294BacBd2DDD8' as const,
  },
  bsc: {
    subscriptionManager: '0x99ad42b29a7a99Ee4552cf6dc36dc4d44d8b0A2c' as const,
    subscriptionNFT: '0x6D4b8BC4613dDCB98450a97b297294BacBd2DDD8' as const,
  },
  avalanche: {
    subscriptionManager: '0x99ad42b29a7a99Ee4552cf6dc36dc4d44d8b0A2c' as const,
    subscriptionNFT: '0x6D4b8BC4613dDCB98450a97b297294BacBd2DDD8' as const,
  },
  sonic: {
    subscriptionManager: '0x99ad42b29a7a99Ee4552cf6dc36dc4d44d8b0A2c' as const,
    subscriptionNFT: '0x6D4b8BC4613dDCB98450a97b297294BacBd2DDD8' as const,
  },
  // Testnet
  sepolia: {
    subscriptionManager: '0x82b069578ae3dA9ea740D24934334208b83E530E' as const,
    subscriptionNFT: '0x404cb817FA393D3689D1405DB0B76a20eDE72d43' as const,
    testToken: '0x10586EBF2Ce1F3e851a8F15659cBa15b03Eb8B8A' as const,
  },
  reactive: {
    subscriptionReactive: '0xa55B7A74D05b5D5C48E431e44Fea83a1047A7582' as const,
  },
} as const;

export const CHAIN_IDS = {
  // Mainnet
  base: 8453,
  bsc: 56,
  avalanche: 43114,
  sonic: 146,
  reactive_mainnet: 1597,
  // Testnet
  sepolia: 11155111,
  reactive: 5318008,
} as const;

export const MERCHANT_ID = 1; // Default merchant ID for testing