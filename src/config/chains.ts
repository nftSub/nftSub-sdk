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