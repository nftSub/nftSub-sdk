import { type Address } from 'viem';

export interface ChainConfig {
  chainId: number;
  name: string;
  rpc: string;
  explorer: string;
  contracts: {
    subscriptionManager: Address;
    subscriptionNFT: Address;
    testToken?: Address;
  };
  reactive?: {
    chainId: number;
    rpc: string;
    contract: Address;
  };
}

export const CHAIN_CONFIGS: Record<string, ChainConfig> = {
  // Mainnet Chains
  base: {
    chainId: 8453,
    name: 'Base',
    rpc: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    contracts: {
      subscriptionManager: '0x99ad42b29a7a99Ee4552cf6dc36dc4d44d8b0A2c',
      subscriptionNFT: '0x6D4b8BC4613dDCB98450a97b297294BacBd2DDD8'
    },
    reactive: {
      chainId: 1729,
      rpc: 'https://mainnet-rpc.rnk.dev/',
      contract: '0x99ad42b29a7a99Ee4552cf6dc36dc4d44d8b0A2c'
    }
  },
  bsc: {
    chainId: 56,
    name: 'BSC',
    rpc: 'https://bsc-dataseed1.binance.org',
    explorer: 'https://bscscan.com',
    contracts: {
      subscriptionManager: '0x99ad42b29a7a99Ee4552cf6dc36dc4d44d8b0A2c',
      subscriptionNFT: '0x6D4b8BC4613dDCB98450a97b297294BacBd2DDD8'
    },
    reactive: {
      chainId: 1729,
      rpc: 'https://mainnet-rpc.rnk.dev/',
      contract: '0x99ad42b29a7a99Ee4552cf6dc36dc4d44d8b0A2c'
    }
  },
  avalanche: {
    chainId: 43114,
    name: 'Avalanche C-Chain',
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
    explorer: 'https://snowtrace.io',
    contracts: {
      subscriptionManager: '0x99ad42b29a7a99Ee4552cf6dc36dc4d44d8b0A2c',
      subscriptionNFT: '0x6D4b8BC4613dDCB98450a97b297294BacBd2DDD8'
    },
    reactive: {
      chainId: 1729,
      rpc: 'https://mainnet-rpc.rnk.dev/',
      contract: '0x99ad42b29a7a99Ee4552cf6dc36dc4d44d8b0A2c'
    }
  },
  sonic: {
    chainId: 146,
    name: 'Sonic',
    rpc: 'https://rpc.soniclabs.com',
    explorer: 'https://sonicscan.org',
    contracts: {
      subscriptionManager: '0x99ad42b29a7a99Ee4552cf6dc36dc4d44d8b0A2c',
      subscriptionNFT: '0x6D4b8BC4613dDCB98450a97b297294BacBd2DDD8'
    },
    reactive: {
      chainId: 1729,
      rpc: 'https://mainnet-rpc.rnk.dev/',
      contract: '0x99ad42b29a7a99Ee4552cf6dc36dc4d44d8b0A2c'
    }
  },
  reactive: {
    chainId: 1729,
    name: 'Reactive Network',
    rpc: 'https://mainnet-rpc.rnk.dev/',
    explorer: 'https://reactscan.net',
    contracts: {
      subscriptionManager: '0x99ad42b29a7a99Ee4552cf6dc36dc4d44d8b0A2c',
      subscriptionNFT: '0x99ad42b29a7a99Ee4552cf6dc36dc4d44d8b0A2c'
    }
  },
  // Testnet
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia',
    rpc: 'https://sepolia.gateway.tenderly.co',
    explorer: 'https://sepolia.etherscan.io',
    contracts: {
      subscriptionManager: '0x82b069578ae3dA9ea740D24934334208b83E530E',
      subscriptionNFT: '0x404cb817FA393D3689D1405DB0B76a20eDE72d43',
      testToken: '0x10586EBF2Ce1F3e851a8F15659cBa15b03Eb8B8A'
    },
    reactive: {
      chainId: 12553,
      rpc: 'https://lasna-rpc.rnk.dev/',
      contract: '0xa55B7A74D05b5D5C48E431e44Fea83a1047A7582'
    }
  }
};

export function getChainConfig(chain: string): ChainConfig {
  const config = CHAIN_CONFIGS[chain];
  if (!config) {
    throw new Error(`Unsupported chain: ${chain}. Supported chains: ${Object.keys(CHAIN_CONFIGS).join(', ')}`);
  }
  return config;
}

export function getExplorerUrl(chain: string, hash: string): string {
  const config = getChainConfig(chain);
  return `${config.explorer}/tx/${hash}`;
}

export function getAddressExplorerUrl(chain: string, address: string): string {
  const config = getChainConfig(chain);
  return `${config.explorer}/address/${address}`;
}