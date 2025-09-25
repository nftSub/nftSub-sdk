import {
  type Address,
  type PublicClient,
  type Log,
  type Hash,
  parseAbiItem,
  decodeEventLog
} from 'viem';
import { subscriptionManagerABI, subscriptionNFTABI } from '@/config/abis';
import { CONTRACT_ADDRESSES } from '@/config/contracts';

export type EventCallback<T = any> = (event: T, log: Log) => void;

export interface MonitorConfig {
  fromBlock?: bigint | 'latest' | 'earliest' | 'pending' | 'safe' | 'finalized';
  pollInterval?: number;
  batchSize?: number;
}

export interface EventFilter {
  address?: Address;
  eventName?: string;
  args?: Record<string, any>;
}

/**
 * Service for monitoring blockchain events
 * Handles real-time event subscriptions, historical queries, and event aggregation
 */
export class EventMonitoringService {
  private unsubscribers: Map<string, () => void> = new Map();
  private eventCache: Map<string, any[]> = new Map();
  
  constructor(private publicClient: PublicClient) {}

  /**
   * Monitor payment events in real-time
   */
  monitorPaymentEvents(params: {
    subscriber?: Address;
    merchantId?: bigint;
    onEvent: EventCallback<{
      subscriber: Address;
      merchantId: bigint;
      paymentToken: Address;
      amount: bigint;
      platformFee: bigint;
      subscriptionPeriod: bigint;
      transactionHash: Hash;
      blockNumber: bigint;
    }>;
  }): string {
    const id = `payment-${Date.now()}`;
    
    const unwatch = this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      eventName: 'PaymentReceived' as any,
      args: {
        user: params.subscriber,
        merchantId: params.merchantId
      } as any,
      onLogs: (logs) => {
        logs.forEach((log) => {
          const args = log.args as any;
          params.onEvent({
            subscriber: args.user,
            merchantId: args.merchantId,
            paymentToken: args.paymentToken,
            amount: args.amount,
            platformFee: args.platformFee,
            subscriptionPeriod: args.subscriptionPeriod,
            transactionHash: log.transactionHash!,
            blockNumber: log.blockNumber!
          }, log);
        });
      }
    });

    this.unsubscribers.set(id, unwatch);
    return id;
  }

  /**
   * Monitor subscription lifecycle events
   */
  monitorSubscriptionLifecycle(params: {
    subscriber?: Address;
    merchantId?: bigint;
    onMinted?: EventCallback<{
      subscriber: Address;
      merchantId: bigint;
      expiresAt: bigint;
      blockNumber: bigint;
      transactionHash: Hash;
    }>;
    onRenewed?: EventCallback<{
      subscriber: Address;
      merchantId: bigint;
      newExpiresAt: bigint;
      renewalCount: bigint;
      blockNumber: bigint;
      transactionHash: Hash;
    }>;
    onExpired?: EventCallback<{
      subscriber: Address;
      merchantId: bigint;
    }>;
    onBurned?: EventCallback<{
      subscriber: Address;
      merchantId: bigint;
    }>;
  }): string {
    const id = `lifecycle-${Date.now()}`;
    const unwatchers: (() => void)[] = [];

    // Monitor minting events
    if (params.onMinted) {
      const unwatch = this.publicClient.watchContractEvent({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
        abi: subscriptionNFTABI,
        eventName: 'SubscriptionMinted' as any,
        args: { user: params.subscriber, merchantId: params.merchantId } as any,
        onLogs: (logs) => {
          logs.forEach((log) => {
            const args = log.args as any;
            params.onMinted!({
              subscriber: args.user,
              merchantId: args.merchantId,
              expiresAt: args.expiresAt,
              blockNumber: log.blockNumber!,
              transactionHash: log.transactionHash!
            }, log);
          });
        }
      });
      unwatchers.push(unwatch);
    }

    // Monitor renewal events
    if (params.onRenewed) {
      const unwatch = this.publicClient.watchContractEvent({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
        abi: subscriptionNFTABI,
        eventName: 'SubscriptionRenewed' as any,
        args: { user: params.subscriber, merchantId: params.merchantId } as any,
        onLogs: (logs) => {
          logs.forEach((log) => {
            const args = log.args as any;
            params.onRenewed!({
              subscriber: args.user,
              merchantId: args.merchantId,
              newExpiresAt: args.newExpiresAt,
              renewalCount: args.renewalCount,
              blockNumber: log.blockNumber!,
              transactionHash: log.transactionHash!
            }, log);
          });
        }
      });
      unwatchers.push(unwatch);
    }

    // Combined unsubscriber
    const unsubscribe = () => {
      unwatchers.forEach(unwatch => unwatch());
    };

    this.unsubscribers.set(id, unsubscribe);
    return id;
  }

  /**
   * Monitor merchant events
   */
  monitorMerchantEvents(params: {
    merchantId?: bigint;
    onRegistered?: EventCallback<{
      merchantId: bigint;
      owner: Address;
      payoutAddress: Address;
      blockNumber: bigint;
      transactionHash: Hash;
    }>;
    onWithdrawal?: EventCallback<{
      merchantId: bigint;
      token: Address;
      amount: bigint;
      payoutAddress: Address;
      blockNumber: bigint;
      transactionHash: Hash;
    }>;
  }): string {
    const id = `merchant-${Date.now()}`;
    const unwatchers: (() => void)[] = [];

    if (params.onRegistered) {
      const unwatch = this.publicClient.watchContractEvent({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
        abi: subscriptionManagerABI,
        eventName: 'MerchantRegistered' as any,
        args: params.merchantId ? { merchantId: params.merchantId } : undefined,
        onLogs: (logs) => {
          logs.forEach((log) => {
            const args = log.args as any;
            params.onRegistered!({
              merchantId: args.merchantId,
              owner: args.owner,
              payoutAddress: args.payoutAddress,
              blockNumber: log.blockNumber!,
              transactionHash: log.transactionHash!
            }, log);
          });
        }
      });
      unwatchers.push(unwatch);
    }

    if (params.onWithdrawal) {
      const unwatch = this.publicClient.watchContractEvent({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
        abi: subscriptionManagerABI,
        eventName: 'MerchantWithdrawal' as any,
        args: params.merchantId ? { merchantId: params.merchantId } : undefined,
        onLogs: (logs) => {
          logs.forEach((log) => {
            const args = log.args as any;
            params.onWithdrawal!({
              merchantId: args.merchantId,
              token: args.token,
              amount: args.amount,
              payoutAddress: args.payoutAddress,
              blockNumber: log.blockNumber!,
              transactionHash: log.transactionHash!
            }, log);
          });
        }
      });
      unwatchers.push(unwatch);
    }

    const unsubscribe = () => {
      unwatchers.forEach(unwatch => unwatch());
    };

    this.unsubscribers.set(id, unsubscribe);
    return id;
  }

  /**
   * Get historical events
   */
  async getHistoricalEvents(params: {
    contractAddress: Address;
    eventName: string;
    fromBlock?: bigint;
    toBlock?: bigint;
    args?: Record<string, any>;
  }): Promise<any[]> {
    const abi = params.contractAddress === CONTRACT_ADDRESSES.sepolia.subscriptionManager
      ? subscriptionManagerABI
      : subscriptionNFTABI;

    const events = await this.publicClient.getContractEvents({
      address: params.contractAddress,
      abi,
      eventName: params.eventName as any,
      fromBlock: params.fromBlock || 'earliest',
      toBlock: params.toBlock || 'latest',
      args: params.args
    });

    return events.map(event => ({
      ...event.args,
      txHash: event.transactionHash,
      blockNumber: event.blockNumber,
      logIndex: event.logIndex
    }));
  }

  /**
   * Get aggregated statistics from events
   */
  async getEventStatistics(params: {
    startBlock?: bigint;
    endBlock?: bigint;
  }): Promise<{
    totalPayments: number;
    totalVolume: bigint;
    uniqueSubscribers: number;
    totalMerchants: number;
    totalRenewals: number;
  }> {
    // Get payment events
    const paymentEvents = await this.getHistoricalEvents({
      contractAddress: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      eventName: 'PaymentReceived' as any,
      fromBlock: params.startBlock,
      toBlock: params.endBlock
    });

    // Get merchant registration events
    const merchantEvents = await this.getHistoricalEvents({
      contractAddress: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      eventName: 'MerchantRegistered' as any,
      fromBlock: params.startBlock,
      toBlock: params.endBlock
    });

    // Get renewal events
    const renewalEvents = await this.getHistoricalEvents({
      contractAddress: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      eventName: 'SubscriptionRenewed' as any,
      fromBlock: params.startBlock,
      toBlock: params.endBlock
    });

    // Calculate statistics
    const uniqueSubscribers = new Set(paymentEvents.map(e => e.user)).size;
    const totalVolume = paymentEvents.reduce((sum, e) => sum + BigInt(e.amount), 0n);

    return {
      totalPayments: paymentEvents.length,
      totalVolume,
      uniqueSubscribers,
      totalMerchants: merchantEvents.length,
      totalRenewals: renewalEvents.length
    };
  }

  /**
   * Monitor multiple events with a single subscription
   */
  monitorMultipleEvents(configs: Array<{
    address: Address;
    events: Array<{
      name: string;
      callback: EventCallback;
    }>;
  }>): string {
    const id = `multi-${Date.now()}`;
    const unwatchers: (() => void)[] = [];

    for (const config of configs) {
      for (const event of config.events) {
        const abi = config.address === CONTRACT_ADDRESSES.sepolia.subscriptionManager
          ? subscriptionManagerABI
          : subscriptionNFTABI;

        const unwatch = this.publicClient.watchContractEvent({
          address: config.address,
          abi,
          eventName: event.name as any,
          onLogs: (logs) => {
            logs.forEach((log) => {
              event.callback(log.args, log);
            });
          }
        });
        unwatchers.push(unwatch);
      }
    }

    const unsubscribe = () => {
      unwatchers.forEach(unwatch => unwatch());
    };

    this.unsubscribers.set(id, unsubscribe);
    return id;
  }

  /**
   * Stop monitoring events
   */
  stopMonitoring(monitorId: string): boolean {
    const unsubscribe = this.unsubscribers.get(monitorId);
    if (unsubscribe) {
      unsubscribe();
      this.unsubscribers.delete(monitorId);
      return true;
    }
    return false;
  }

  /**
   * Stop all monitoring
   */
  stopAllMonitoring(): void {
    this.unsubscribers.forEach(unsubscribe => unsubscribe());
    this.unsubscribers.clear();
    this.eventCache.clear();
  }

  /**
   * Get cached events
   */
  getCachedEvents(key: string): any[] {
    return this.eventCache.get(key) || [];
  }

  /**
   * Cache events for later retrieval
   */
  cacheEvents(key: string, events: any[]): void {
    const existing = this.eventCache.get(key) || [];
    this.eventCache.set(key, [...existing, ...events]);
  }

  /**
   * Clear event cache
   */
  clearCache(key?: string): void {
    if (key) {
      this.eventCache.delete(key);
    } else {
      this.eventCache.clear();
    }
  }

  /**
   * Watch for specific transaction
   */
  async waitForTransaction(txHash: Hash): Promise<{
    status: 'success' | 'reverted';
    events: any[];
  }> {
    const receipt = await this.publicClient.waitForTransactionReceipt({
      hash: txHash
    });

    const events = receipt.logs.map(log => {
      try {
        // Try to decode with manager ABI
        const decoded = decodeEventLog({
          abi: subscriptionManagerABI,
          data: log.data,
          topics: log.topics
        });
        return decoded;
      } catch {
        try {
          // Try to decode with NFT ABI
          const decoded = decodeEventLog({
            abi: subscriptionNFTABI,
            data: log.data,
            topics: log.topics
          });
          return decoded;
        } catch {
          return null;
        }
      }
    }).filter(Boolean);

    return {
      status: receipt.status === 'success' ? 'success' : 'reverted',
      events
    };
  }

  /**
   * Create event filter for custom monitoring
   */
  createEventFilter(params: {
    address: Address;
    eventSignature: string;
    args?: any[];
  }) {
    return {
      address: params.address,
      topics: [
        parseAbiItem(params.eventSignature),
        ...(params.args || [])
      ]
    };
  }
}