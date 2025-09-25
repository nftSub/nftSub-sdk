import {
  type Address,
  type PublicClient,
  type WalletClient,
  type Hash,
  parseEther
} from 'viem';
import { subscriptionReactiveABI, subscriptionNFTABI } from '@/config/abis';
import { CONTRACT_ADDRESSES } from '@/config/contracts';

export interface ReactiveSubscription {
  id: bigint;
  config: SubscriptionConfig;
  active: boolean;
}

export interface SubscriptionConfig {
  subscriber: Address;
  paymentToken: Address;
  duration: bigint;
}

export interface TrackedExpiration {
  user: Address;
  merchantId: bigint;
  expiresAt: bigint;
}

export interface ReactiveEvent {
  blockNumber: bigint;
  timestamp: bigint;
  eventType: 'PaymentProcessed' | 'SubscriptionExpired' | 'CronTriggered';
  data: any;
}

/**
 * Service for Reactive Network operations
 * Handles cross-chain event monitoring, subscription automation, and CRON jobs
 */
export class ReactiveNetworkService {
  private readonly REACTIVE_RPC = 'https://lasna-rpc.rnk.dev/';
  private readonly L1_CHAIN_ID = 11155111; // Sepolia
  
  constructor(
    private publicClient: PublicClient,
    private walletClient?: WalletClient,
    private reactiveProvider?: PublicClient
  ) {}

  /**
   * Subscribe to payment events from L1
   */
  async subscribeToPaymentEvents(params: {
    chainId?: bigint;
    contractAddress?: Address;
  }): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    const contract = this.getContract();
    
    const chainId = params.chainId || BigInt(this.L1_CHAIN_ID);
    const contractAddress = params.contractAddress || CONTRACT_ADDRESSES.sepolia.subscriptionManager;
    
    return await contract.write.subscribeToPaymentEvents(chainId, contractAddress);
  }

  /**
   * Subscribe to CRON job for expiry checks
   */
  async subscribeToCronJob(params: {
    interval: bigint; // in seconds
  }): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    const contract = this.getContract();
    
    return await contract.write.subscribeToCron(params.interval);
  }

  /**
   * Get tracked subscription expirations
   * Note: The reactive contract tracks expirations but doesn't expose subscription lists
   * This method gets expiring subscriptions within a time range
   */
  async getExpiringSubscriptions(beforeTimestamp?: bigint, limit: bigint = 100n): Promise<{
    users: Address[];
    merchantIds: bigint[];
  }> {
    try {
      const contract = this.getContract();
      const timestamp = beforeTimestamp || BigInt(Math.floor(Date.now() / 1000) + 86400); // Default: next 24 hours
      
      const [users, merchantIds] = await contract.read.getExpiringSubscriptions(timestamp, limit);
      
      return {
        users: users as Address[],
        merchantIds: merchantIds as bigint[]
      };
    } catch (error) {
      console.log('Error fetching expiring subscriptions:', error);
      return { users: [], merchantIds: [] };
    }
  }

  /**
   * Get tracked expiration for a specific user and merchant
   */
  async getTrackedExpiration(user: Address, merchantId: bigint): Promise<bigint> {
    try {
      const contract = this.getContract();
      return await contract.read.getTrackedExpiration(user, merchantId);
    } catch (error) {
      console.log('Error fetching tracked expiration:', error);
      return 0n;
    }
  }

  /**
   * Get debt amount from reactive contract
   */
  async getDebt(): Promise<bigint> {
    try {
      const contract = this.getContract();
      return await contract.read.getDebt();
    } catch (error) {
      console.log('Error fetching debt:', error);
      return 0n;
    }
  }

  /**
   * Pause reactive contract
   */
  async pauseContract(): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    const contract = this.getContract();
    return await contract.write.pause();
  }

  /**
   * Resume reactive contract
   */
  async resumeContract(): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    const contract = this.getContract();
    return await contract.write.resume();
  }

  /**
   * Check if reactive contract has REACTIVE_ROLE on NFT contract
   */
  async hasReactiveRole(): Promise<boolean> {
    // Check role on the NFT contract using the NFT ABI
    const REACTIVE_ROLE = '0x6c32362347342e2fb3c7c64c0c4fe5a21823981ee87c54bb16cfffc87c68c502';
    
    return await this.publicClient.readContract({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      functionName: 'hasRole',
      args: [REACTIVE_ROLE, CONTRACT_ADDRESSES.reactive.subscriptionReactive] as readonly [`0x${string}`, Address]
    }) as boolean;
  }

  /**
   * Get REACT token balance
   */
  async getReactBalance(address: Address): Promise<bigint> {
    if (!this.reactiveProvider) {
      throw new Error('Reactive provider not configured');
    }
    
    return await this.reactiveProvider.getBalance({ address });
  }

  /**
   * Fund reactive contract with REACT tokens
   */
  async fundReactiveContract(amount: string): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    // Send REACT tokens to the reactive contract
    return await this.walletClient.sendTransaction({
      account: this.walletClient.account!,
      to: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
      value: parseEther(amount),
      chain: this.walletClient.chain
    });
  }

  /**
   * Get reactive contract configuration
   * Note: The reactive contract doesn't expose these values directly
   * These would typically be stored in the contract's config or retrieved from events
   */
  async getReactiveConfig(): Promise<{
    subscriptionManager: Address;
    subscriptionNFT: Address;
    targetChainId: bigint;
    paymentEventSubscriptionId?: bigint;
    cronSubscriptionId?: bigint;
  }> {
    // Since the reactive contract doesn't expose these values directly,
    // we return the known contract addresses from our configuration
    return {
      subscriptionManager: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      subscriptionNFT: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      targetChainId: BigInt(this.L1_CHAIN_ID), // Sepolia chain ID
      paymentEventSubscriptionId: undefined, // Would need to track from events
      cronSubscriptionId: undefined // Would need to track from events
    };
  }

  /**
   * Monitor reactive events
   */
  watchReactiveEvents(params: {
    onPaymentProcessed?: (event: {
      subscriber: Address;
      merchantId: bigint;
      amount: bigint;
      token: Address;
    }) => void;
    onSubscriptionExpired?: (event: {
      subscriber: Address;
      merchantId: bigint;
    }) => void;
    onCronTriggered?: (event: {
      timestamp: bigint;
      processedCount: number;
    }) => void;
  }) {
    if (!this.reactiveProvider) {
      throw new Error('Reactive provider not configured');
    }
    
    const unwatchers: (() => void)[] = [];
    
    // Watch payment processed events
    if (params.onPaymentProcessed) {
      const unwatch = this.reactiveProvider.watchContractEvent({
        address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
        abi: subscriptionReactiveABI,
        eventName: 'PaymentProcessed' as any,
        onLogs: (logs) => {
          logs.forEach((log) => {
            const args = log.args as any;
            params.onPaymentProcessed!({
              subscriber: args.subscriber,
              merchantId: args.merchantId,
              amount: args.amount,
              token: args.token
            });
          });
        }
      });
      unwatchers.push(unwatch);
    }
    
    // Watch subscription expired events
    if (params.onSubscriptionExpired) {
      const unwatch = this.reactiveProvider.watchContractEvent({
        address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
        abi: subscriptionReactiveABI,
        eventName: 'SubscriptionExpired' as any,
        onLogs: (logs) => {
          logs.forEach((log) => {
            const args = log.args as any;
            params.onSubscriptionExpired!({
              subscriber: args.subscriber,
              merchantId: args.merchantId
            });
          });
        }
      });
      unwatchers.push(unwatch);
    }
    
    // Watch CRON triggered events
    if (params.onCronTriggered) {
      const unwatch = this.reactiveProvider.watchContractEvent({
        address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
        abi: subscriptionReactiveABI,
        eventName: 'CronTriggered' as any,
        onLogs: (logs) => {
          logs.forEach((log) => {
            const args = log.args as any;
            params.onCronTriggered!({
              timestamp: args.timestamp,
              processedCount: args.processedCount
            });
          });
        }
      });
      unwatchers.push(unwatch);
    }
    
    // Return unsubscribe function
    return () => {
      unwatchers.forEach(unwatch => unwatch());
    };
  }

  /**
   * Get reactive event history
   */
  async getEventHistory(params?: {
    fromBlock?: bigint;
    toBlock?: bigint;
    eventType?: 'PaymentProcessed' | 'SubscriptionExpired' | 'CronTriggered';
  }): Promise<ReactiveEvent[]> {
    if (!this.reactiveProvider) {
      throw new Error('Reactive provider not configured');
    }
    
    const events: ReactiveEvent[] = [];
    const eventNames = params?.eventType 
      ? [params.eventType]
      : ['PaymentProcessed', 'SubscriptionExpired', 'CronTriggered'];
    
    for (const eventName of eventNames) {
      const logs = await this.reactiveProvider.getContractEvents({
        address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
        abi: subscriptionReactiveABI,
        eventName: eventName as any,
        fromBlock: params?.fromBlock || 'earliest',
        toBlock: params?.toBlock || 'latest'
      });
      
      for (const log of logs) {
        const block = await this.reactiveProvider.getBlock({
          blockNumber: log.blockNumber!
        });
        
        events.push({
          blockNumber: log.blockNumber!,
          timestamp: block.timestamp,
          eventType: eventName as any,
          data: log.args
        });
      }
    }
    
    return events.sort((a, b) => Number(a.blockNumber - b.blockNumber));
  }

  /**
   * Estimate gas for reactive operations
   */
  async estimateReactiveGas(operation: 'subscribe' | 'cancel' | 'process'): Promise<bigint> {
    // Reactive Network gas estimates (in REACT tokens)
    const estimates = {
      subscribe: parseEther('0.01'),
      cancel: parseEther('0.005'),
      process: parseEther('0.02')
    };
    
    return estimates[operation];
  }

  /**
   * Get reactive network status
   */
  async getNetworkStatus(): Promise<{
    chainId: number;
    blockNumber: bigint;
    gasPrice: bigint;
    isConnected: boolean;
  }> {
    if (!this.reactiveProvider) {
      return {
        chainId: 0,
        blockNumber: 0n,
        gasPrice: 0n,
        isConnected: false
      };
    }
    
    try {
      const [chainId, block, gasPrice] = await Promise.all([
        this.reactiveProvider.getChainId(),
        this.reactiveProvider.getBlockNumber(),
        this.reactiveProvider.getGasPrice()
      ]);
      
      return {
        chainId,
        blockNumber: block,
        gasPrice,
        isConnected: true
      };
    } catch {
      return {
        chainId: 0,
        blockNumber: 0n,
        gasPrice: 0n,
        isConnected: false
      };
    }
  }

  /**
   * Setup initial reactive subscriptions
   */
  async setupInitialSubscriptions(): Promise<{
    paymentSubscription?: Hash;
    cronSubscription?: Hash;
  }> {
    const results: any = {};
    
    try {
      // Subscribe to payment events
      results.paymentSubscription = await this.subscribeToPaymentEvents({});
      
      // Subscribe to CRON for expiry checks (every hour)
      results.cronSubscription = await this.subscribeToCronJob({
        interval: 3600n // 1 hour
      });
    } catch (error) {
      console.error('Error setting up subscriptions:', error);
    }
    
    return results;
  }

  /**
   * Get contract instance
   */
  private getContract() {
    const provider = this.reactiveProvider || this.publicClient;
    
    return {
      read: {
        getDebt: () =>
          provider.readContract({
            address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
            abi: subscriptionReactiveABI,
            functionName: 'getDebt'
          }),
        getTrackedExpiration: (user: Address, merchantId: bigint) =>
          provider.readContract({
            address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
            abi: subscriptionReactiveABI,
            functionName: 'getTrackedExpiration',
            args: [user, merchantId]
          }),
        getExpiringSubscriptions: (beforeTimestamp: bigint, limit: bigint) =>
          provider.readContract({
            address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
            abi: subscriptionReactiveABI,
            functionName: 'getExpiringSubscriptions',
            args: [beforeTimestamp, limit]
          })
      },
      write: {
        subscribeToPaymentEvents: (chainId: bigint, contractAddress: Address) =>
          this.walletClient!.writeContract({
            address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
            abi: subscriptionReactiveABI,
            functionName: 'subscribeToPaymentEvents',
            args: [chainId, contractAddress],
            account: this.walletClient!.account!,
            chain: undefined
          }),
        subscribeToCron: (interval: bigint) =>
          this.walletClient!.writeContract({
            address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
            abi: subscriptionReactiveABI,
            functionName: 'subscribeToCron',
            args: [interval],
            account: this.walletClient!.account!,
            chain: undefined
          }),
        pause: () =>
          this.walletClient!.writeContract({
            address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
            abi: subscriptionReactiveABI,
            functionName: 'pause',
            account: this.walletClient!.account!,
            chain: undefined
          }),
        resume: () =>
          this.walletClient!.writeContract({
            address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
            abi: subscriptionReactiveABI,
            functionName: 'resume',
            account: this.walletClient!.account!,
            chain: undefined
          }),
        updateSubscriptionState: (user: Address, merchantId: bigint, expiresAt: bigint) =>
          this.walletClient!.writeContract({
            address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
            abi: subscriptionReactiveABI,
            functionName: 'updateSubscriptionState',
            args: [user, merchantId, expiresAt],
            account: this.walletClient!.account!,
            chain: undefined
          }),
        depositForOperations: (value: bigint) =>
          this.walletClient!.writeContract({
            address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
            abi: subscriptionReactiveABI,
            functionName: 'depositForOperations',
            value,
            account: this.walletClient!.account!,
            chain: undefined
          }),
        coverDebt: () =>
          this.walletClient!.writeContract({
            address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
            abi: subscriptionReactiveABI,
            functionName: 'coverDebt',
            account: this.walletClient!.account!,
            chain: undefined
          }),
        emergencyWithdraw: () =>
          this.walletClient!.writeContract({
            address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
            abi: subscriptionReactiveABI,
            functionName: 'emergencyWithdraw',
            account: this.walletClient!.account!,
            chain: undefined
          })
      }
    };
  }

  /**
   * Calculate subscription costs
   */
  calculateSubscriptionCost(params: {
    duration: 'hour' | 'day' | 'week' | 'month';
    eventType: 'payment' | 'cron';
  }): bigint {
    // Base costs in REACT
    const baseCosts = {
      payment: parseEther('0.01'),
      cron: parseEther('0.05')
    };
    
    // Duration multipliers
    const multipliers = {
      hour: 1,
      day: 20,
      week: 100,
      month: 300
    };
    
    const baseCost = baseCosts[params.eventType];
    const multiplier = multipliers[params.duration];
    
    return (baseCost * BigInt(multiplier)) / 100n;
  }
}