import {
  type Address,
  type PublicClient,
  type WalletClient,
  type Hash
} from 'viem';
import { subscriptionNFTABI } from '@/config/abis';
import { CONTRACT_ADDRESSES } from '@/config/contracts';

export interface NFTMetadata {
  tokenId: bigint;
  merchantId: bigint;
  subscriber: Address;
  expiresAt: bigint;
  renewalCount: bigint;
  uri: string;
}

export interface NFTBalance {
  merchantId: bigint;
  balance: bigint;
  isActive: boolean;
}

/**
 * Service for NFT operations
 * Handles ERC1155 subscription NFTs, metadata, transfers, and balance management
 */
export class NFTService {
  constructor(
    private publicClient: PublicClient,
    private walletClient?: WalletClient
  ) {}

  /**
   * Get NFT balance for a user and merchant
   */
  async getBalance(user: Address, merchantId: bigint): Promise<bigint> {
    const contract = this.getContract();
    return await contract.read.balanceOf(user, merchantId);
  }

  /**
   * Get NFT balances for a user with specific merchant IDs
   */
  async getBalancesForMerchants(user: Address, merchantIds: bigint[]): Promise<NFTBalance[]> {
    const contract = this.getContract();
    const balances: NFTBalance[] = [];
    
    for (const merchantId of merchantIds) {
      const balance = await contract.read.balanceOf(user, merchantId);
      const isActive = await contract.read.isSubscriptionActive(user, merchantId);
      
      balances.push({
        merchantId,
        balance,
        isActive
      });
    }
    
    return balances;
  }

  /**
   * Get NFT metadata URI
   */
  async getTokenURI(tokenId: bigint): Promise<string> {
    const contract = this.getContract();
    return await contract.read.uri(tokenId);
  }

  /**
   * Get full NFT metadata including on-chain data
   */
  async getFullMetadata(user: Address, merchantId: bigint): Promise<NFTMetadata> {
    const contract = this.getContract();
    
    const [status, uri] = await Promise.all([
      contract.read.getSubscriptionStatus(user, merchantId),
      contract.read.uri(merchantId)
    ]);
    
    return {
      tokenId: merchantId,
      merchantId,
      subscriber: user,
      expiresAt: status.expiresAt,
      renewalCount: BigInt(status.renewalCount),
      uri
    };
  }

  /**
   * Check if NFT transfer is allowed
   */
  async isTransferAllowed(
    from: Address,
    to: Address,
    merchantId: bigint
  ): Promise<boolean> {
    try {
      const contract = this.getContract();
      
      // Note: paused function doesn't exist in this contract's ABI
      // Skipping pause check
      
      // Check if subscription is active
      const isActive = await contract.read.isSubscriptionActive(from, merchantId);
      return isActive;
    } catch {
      return false;
    }
  }

  /**
   * Transfer NFT (subscription)
   */
  async safeTransferFrom(params: {
    from: Address;
    to: Address;
    merchantId: bigint;
    amount?: bigint;
    data?: `0x${string}`;
  }): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    const contract = this.getContract();
    return await contract.write.safeTransferFrom(
      params.from,
      params.to,
      params.merchantId,
      params.amount || 1n,
      params.data || '0x'
    );
  }

  /**
   * Batch transfer multiple NFTs
   */
  async safeBatchTransferFrom(params: {
    from: Address;
    to: Address;
    merchantIds: bigint[];
    amounts?: bigint[];
    data?: `0x${string}`;
  }): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    const contract = this.getContract();
    const amounts = params.amounts || params.merchantIds.map(() => 1n);
    
    return await contract.write.safeBatchTransferFrom(
      params.from,
      params.to,
      params.merchantIds,
      amounts,
      params.data || '0x'
    );
  }

  /**
   * Set approval for all NFTs
   */
  async setApprovalForAll(operator: Address, approved: boolean): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    const contract = this.getContract();
    return await contract.write.setApprovalForAll(operator, approved);
  }

  /**
   * Check if operator is approved for all
   */
  async isApprovedForAll(owner: Address, operator: Address): Promise<boolean> {
    const contract = this.getContract();
    return await contract.read.isApprovedForAll(owner, operator);
  }

  /**
   * Burn expired subscription NFT
   */
  async burnExpiredSubscription(params: {
    subscriber: Address;
    merchantId: bigint;
  }): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    const contract = this.getContract();
    
    // Check if expired
    const status = await contract.read.getSubscriptionStatus(
      params.subscriber,
      params.merchantId
    );
    
    const now = BigInt(Math.floor(Date.now() / 1000));
    if (status.expiresAt > now) {
      throw new Error('Subscription is not expired');
    }
    
    return await contract.write.burnExpired(
      params.subscriber,
      params.merchantId
    );
  }

  /**
   * Get total supply for a token ID
   */
  async getTotalSupply(merchantId: bigint): Promise<bigint> {
    const contract = this.getContract();
    
    // Would need to track this via events or add view function
    // For now, get from events
    const mintEvents = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: 'SubscriptionMinted' as any,
      args: { merchantId } as any,
      fromBlock: 'earliest'
    });
    
    const burnEvents = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: 'SubscriptionBurned' as any,
      args: { merchantId } as any,
      fromBlock: 'earliest'
    });
    
    return BigInt(mintEvents.length - burnEvents.length);
  }

  /**
   * Get all token holders for a merchant
   */
  async getTokenHolders(merchantId: bigint): Promise<Address[]> {
    const mintEvents = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: 'SubscriptionMinted' as any,
      args: { merchantId } as any,
      fromBlock: 'earliest'
    });
    
    const holders = new Set<Address>();
    for (const event of mintEvents) {
      const args = event.args as any;
      holders.add(args.subscriber);
    }
    
    // Filter out expired subscriptions
    const activeHolders: Address[] = [];
    for (const holder of holders) {
      const isActive = await this.isSubscriptionActive(holder, merchantId);
      if (isActive) {
        activeHolders.push(holder);
      }
    }
    
    return activeHolders;
  }

  /**
   * Check if subscription is active
   */
  async isSubscriptionActive(user: Address, merchantId: bigint): Promise<boolean> {
    const contract = this.getContract();
    return await contract.read.isSubscriptionActive(user, merchantId);
  }

  /**
   * Get subscription expiry timestamp
   */
  async getSubscriptionExpiry(user: Address, merchantId: bigint): Promise<bigint> {
    const contract = this.getContract();
    const status = await contract.read.getSubscriptionStatus(user, merchantId);
    return status.expiresAt;
  }

  /**
   * Watch transfer events
   */
  watchTransferEvents(params: {
    from?: Address;
    to?: Address;
    merchantId?: bigint;
    callback: (event: {
      operator: Address;
      from: Address;
      to: Address;
      id: bigint;
      value: bigint;
    }) => void;
  }) {
    return this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: 'TransferSingle' as any,
      onLogs: (logs) => {
        logs.forEach((log) => {
          const args = log.args as any;
          
          // Filter by params if provided
          if (params.from && args.from !== params.from) return;
          if (params.to && args.to !== params.to) return;
          if (params.merchantId && args.id !== params.merchantId) return;
          
          params.callback({
            operator: args.operator,
            from: args.from,
            to: args.to,
            id: args.id,
            value: args.value
          });
        });
      }
    });
  }

  /**
   * Watch batch transfer events
   */
  watchBatchTransferEvents(params: {
    from?: Address;
    to?: Address;
    callback: (event: {
      operator: Address;
      from: Address;
      to: Address;
      ids: bigint[];
      values: bigint[];
    }) => void;
  }) {
    return this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: 'TransferBatch' as any,
      onLogs: (logs) => {
        logs.forEach((log) => {
          const args = log.args as any;
          
          if (params.from && args.from !== params.from) return;
          if (params.to && args.to !== params.to) return;
          
          params.callback({
            operator: args.operator,
            from: args.from,
            to: args.to,
            ids: args.ids,
            values: args.values
          });
        });
      }
    });
  }

  /**
   * Watch approval events
   */
  watchApprovalEvents(params: {
    owner?: Address;
    operator?: Address;
    callback: (event: {
      account: Address;
      operator: Address;
      approved: boolean;
    }) => void;
  }) {
    return this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: 'ApprovalForAll' as any,
      onLogs: (logs) => {
        logs.forEach((log) => {
          const args = log.args as any;
          
          if (params.owner && args.account !== params.owner) return;
          if (params.operator && args.operator !== params.operator) return;
          
          params.callback({
            account: args.account,
            operator: args.operator,
            approved: args.approved
          });
        });
      }
    });
  }

  /**
   * Generate NFT image/metadata (placeholder)
   */
  generateNFTMetadata(params: {
    merchantId: bigint;
    merchantName: string;
    expiresAt: bigint;
    renewalCount: bigint;
    tier?: string;
  }): any {
    const expiryDate = new Date(Number(params.expiresAt) * 1000);
    const isActive = params.expiresAt > BigInt(Math.floor(Date.now() / 1000));
    
    return {
      name: `${params.merchantName} Subscription`,
      description: `Active subscription to ${params.merchantName}`,
      image: `https://placeholder.com/nft/${params.merchantId}`,
      attributes: [
        {
          trait_type: 'Status',
          value: isActive ? 'Active' : 'Expired'
        },
        {
          trait_type: 'Expires At',
          value: expiryDate.toISOString()
        },
        {
          trait_type: 'Renewal Count',
          value: Number(params.renewalCount)
        },
        {
          trait_type: 'Tier',
          value: params.tier || 'Standard'
        }
      ]
    };
  }

  /**
   * Get contract instance
   */
  private getContract() {
    return {
      read: {
        balanceOf: (account: Address, id: bigint) => 
          this.publicClient.readContract({
            address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
            abi: subscriptionNFTABI,
            functionName: 'balanceOf',
            args: [account, id]
          }),
        getSubscriptionStatus: (user: Address, merchantId: bigint) =>
          this.publicClient.readContract({
            address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
            abi: subscriptionNFTABI,
            functionName: 'getSubscriptionStatus',
            args: [user, merchantId]
          }),
        isSubscriptionActive: (user: Address, merchantId: bigint) =>
          this.publicClient.readContract({
            address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
            abi: subscriptionNFTABI,
            functionName: 'isSubscriptionActive',
            args: [user, merchantId]
          }),
        uri: (id: bigint) =>
          this.publicClient.readContract({
            address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
            abi: subscriptionNFTABI,
            functionName: 'uri',
            args: [id]
          }),
        isApprovedForAll: (account: Address, operator: Address) =>
          this.publicClient.readContract({
            address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
            abi: subscriptionNFTABI,
            functionName: 'isApprovedForAll',
            args: [account, operator]
          })
      },
      write: {
        safeTransferFrom: (
          from: Address,
          to: Address,
          id: bigint,
          value: bigint,
          data: `0x${string}`
        ) =>
          this.walletClient!.writeContract({
            address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
            abi: subscriptionNFTABI,
            functionName: 'safeTransferFrom',
            args: [from, to, id, value, data],
            account: this.walletClient!.account!,
            chain: undefined
          }),
        safeBatchTransferFrom: (
          from: Address,
          to: Address,
          ids: bigint[],
          values: bigint[],
          data: `0x${string}`
        ) =>
          this.walletClient!.writeContract({
            address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
            abi: subscriptionNFTABI,
            functionName: 'safeBatchTransferFrom',
            args: [from, to, ids, values, data],
            account: this.walletClient!.account!,
            chain: undefined
          }),
        setApprovalForAll: (operator: Address, approved: boolean) =>
          this.walletClient!.writeContract({
            address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
            abi: subscriptionNFTABI,
            functionName: 'setApprovalForAll',
            args: [operator, approved],
            account: this.walletClient!.account!,
            chain: undefined
          }),
        burnExpired: (subscriber: Address, merchantId: bigint) =>
          this.walletClient!.writeContract({
            address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
            abi: subscriptionNFTABI,
            functionName: 'burnExpired',
            args: [subscriber, merchantId],
            account: this.walletClient!.account!,
            chain: undefined
          })
      }
    };
  }

  /**
   * Check if NFT features are supported
   */
  async supportsInterface(interfaceId: string): Promise<boolean> {
    const contract = this.getContract();
    
    const INTERFACES = {
      ERC165: '0x01ffc9a7',
      ERC1155: '0xd9b67a26',
      ERC1155MetadataURI: '0x0e89341c'
    };
    
    try {
      const supported = await this.publicClient.readContract({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
        abi: subscriptionNFTABI,
        functionName: 'supportsInterface',
        args: [interfaceId as `0x${string}`]
      });
      return supported as boolean;
    } catch {
      return false;
    }
  }
}