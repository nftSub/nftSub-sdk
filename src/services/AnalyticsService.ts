import {
  type Address,
  type PublicClient,
  formatEther
} from 'viem';
import { subscriptionManagerABI, subscriptionNFTABI } from '@/config/abis';
import { CONTRACT_ADDRESSES } from '@/config/contracts';

export interface PlatformMetrics {
  totalMerchants: number;
  activeMerchants: number;
  totalSubscribers: number;
  activeSubscriptions: number;
  totalVolume: bigint;
  totalPlatformFees: bigint;
  averageSubscriptionPrice: bigint;
  totalRenewals: number;
}

export interface MerchantAnalytics {
  merchantId: bigint;
  totalRevenue: bigint;
  totalSubscribers: number;
  activeSubscribers: number;
  averageSubscriptionValue: bigint;
  churnRate: number;
  renewalRate: number;
  topPaymentTokens: Array<{
    token: Address;
    volume: bigint;
    transactions: number;
  }>;
  revenueOverTime: Array<{
    timestamp: bigint;
    amount: bigint;
  }>;
}

export interface UserAnalytics {
  totalSpent: bigint;
  activeSubscriptions: number;
  totalSubscriptions: number;
  averageSpend: bigint;
  subscriptionHistory: Array<{
    merchantId: bigint;
    startDate: bigint;
    expiresAt: bigint;
    amount: bigint;
    renewalCount: number;
  }>;
}

export interface TimeSeriesData {
  timestamp: bigint;
  value: number | bigint;
  label?: string;
}

/**
 * Service for platform analytics and metrics
 * Provides comprehensive analytics for platform, merchants, and users
 */
export class AnalyticsService {
  constructor(private publicClient: PublicClient) {}

  /**
   * Get overall platform metrics
   */
  async getPlatformMetrics(params?: {
    fromBlock?: bigint;
    toBlock?: bigint;
  }): Promise<PlatformMetrics> {
    const fromBlock = params?.fromBlock || 'earliest';
    const toBlock = params?.toBlock || 'latest';

    // Fetch all relevant events
    const [
      merchantRegistrations,
      payments,
      renewals
    ] = await Promise.all([
      this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
        abi: subscriptionManagerABI,
        eventName: 'MerchantRegistered',
        fromBlock,
        toBlock
      }),
      this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
        abi: subscriptionManagerABI,
        eventName: 'PaymentReceived',
        fromBlock,
        toBlock
      }),
      this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
        abi: subscriptionNFTABI,
        eventName: 'SubscriptionRenewed',
        fromBlock,
        toBlock
      })
    ]);

    // Calculate metrics
    const uniqueSubscribers = new Set(payments.map(p => (p.args as any).subscriber));
    const activeMerchantIds = new Set(payments.map(p => (p.args as any).merchantId));
    
    const totalVolume = payments.reduce((sum, p) => 
      sum + BigInt((p.args as any).amount), 0n
    );
    
    const totalPlatformFees = payments.reduce((sum, p) => 
      sum + BigInt((p.args as any).platformFee), 0n
    );

    const averageSubscriptionPrice = payments.length > 0
      ? totalVolume / BigInt(payments.length)
      : 0n;

    return {
      totalMerchants: merchantRegistrations.length,
      activeMerchants: activeMerchantIds.size,
      totalSubscribers: uniqueSubscribers.size,
      activeSubscriptions: await this.getActiveSubscriptionCount(),
      totalVolume,
      totalPlatformFees,
      averageSubscriptionPrice,
      totalRenewals: renewals.length
    };
  }

  /**
   * Get analytics for a specific merchant
   */
  async getMerchantAnalytics(
    merchantId: bigint,
    params?: {
      fromBlock?: bigint;
      toBlock?: bigint;
    }
  ): Promise<MerchantAnalytics> {
    const fromBlock = params?.fromBlock || 'earliest';
    const toBlock = params?.toBlock || 'latest';

    // Fetch merchant-specific events
    const [payments, subscriptions, renewals] = await Promise.all([
      this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
        abi: subscriptionManagerABI,
        eventName: 'PaymentReceived',
        args: { merchantId },
        fromBlock,
        toBlock
      }),
      this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
        abi: subscriptionNFTABI,
        eventName: 'SubscriptionMinted',
        args: { merchantId },
        fromBlock,
        toBlock
      }),
      this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
        abi: subscriptionNFTABI,
        eventName: 'SubscriptionRenewed',
        args: { merchantId },
        fromBlock,
        toBlock
      })
    ]);

    // Calculate revenue
    const totalRevenue = payments.reduce((sum, p) => {
      const args = p.args as any;
      return sum + BigInt(args.amount) - BigInt(args.platformFee);
    }, 0n);

    // Get unique subscribers
    const uniqueSubscribers = new Set(payments.map(p => (p.args as any).subscriber));
    
    // Calculate token volumes
    const tokenVolumes = new Map<Address, { volume: bigint; transactions: number }>();
    payments.forEach(p => {
      const args = p.args as any;
      const token = args.paymentToken;
      const current = tokenVolumes.get(token) || { volume: 0n, transactions: 0 };
      tokenVolumes.set(token, {
        volume: current.volume + BigInt(args.amount),
        transactions: current.transactions + 1
      });
    });

    // Sort tokens by volume
    const topPaymentTokens = Array.from(tokenVolumes.entries())
      .map(([token, data]) => ({ token, ...data }))
      .sort((a, b) => Number(b.volume - a.volume));

    // Revenue over time
    const revenueOverTime = payments.map(p => ({
      timestamp: p.blockNumber || 0n,
      amount: BigInt((p.args as any).amount) - BigInt((p.args as any).platformFee)
    }));

    // Calculate rates
    const churnRate = await this.calculateChurnRate(merchantId, uniqueSubscribers.size);
    const renewalRate = subscriptions.length > 0
      ? (renewals.length / subscriptions.length) * 100
      : 0;

    return {
      merchantId,
      totalRevenue,
      totalSubscribers: uniqueSubscribers.size,
      activeSubscribers: await this.getActiveMerchantSubscribers(merchantId),
      averageSubscriptionValue: payments.length > 0
        ? totalRevenue / BigInt(payments.length)
        : 0n,
      churnRate,
      renewalRate,
      topPaymentTokens,
      revenueOverTime
    };
  }

  /**
   * Get analytics for a specific user
   */
  async getUserAnalytics(
    userAddress: Address,
    params?: {
      fromBlock?: bigint;
      toBlock?: bigint;
    }
  ): Promise<UserAnalytics> {
    const fromBlock = params?.fromBlock || 'earliest';
    const toBlock = params?.toBlock || 'latest';

    // Fetch user-specific events
    const [payments, subscriptions, renewals] = await Promise.all([
      this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
        abi: subscriptionManagerABI,
        eventName: 'PaymentReceived',
        args: { user: userAddress },
        fromBlock,
        toBlock
      }),
      this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
        abi: subscriptionNFTABI,
        eventName: 'SubscriptionMinted',
        args: { user: userAddress },
        fromBlock,
        toBlock
      }),
      this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
        abi: subscriptionNFTABI,
        eventName: 'SubscriptionRenewed',
        args: { user: userAddress },
        fromBlock,
        toBlock
      })
    ]);

    // Calculate total spent
    const totalSpent = payments.reduce((sum, p) => 
      sum + BigInt((p.args as any).amount), 0n
    );

    // Build subscription history
    const subscriptionMap = new Map<string, any>();
    
    // Add initial subscriptions
    subscriptions.forEach(s => {
      const args = s.args as any;
      const key = `${args.merchantId}`;
      subscriptionMap.set(key, {
        merchantId: args.merchantId,
        startDate: s.blockNumber || 0n,
        expiresAt: args.expiresAt,
        amount: 0n,
        renewalCount: 0
      });
    });

    // Add renewals
    renewals.forEach(r => {
      const args = r.args as any;
      const key = `${args.merchantId}`;
      const existing = subscriptionMap.get(key);
      if (existing) {
        existing.expiresAt = args.newExpiresAt;
        existing.renewalCount = Number(args.renewalCount);
      }
    });

    // Add payment amounts
    payments.forEach(p => {
      const args = p.args as any;
      const key = `${args.merchantId}`;
      const existing = subscriptionMap.get(key);
      if (existing) {
        existing.amount = existing.amount + BigInt(args.amount);
      }
    });

    const subscriptionHistory = Array.from(subscriptionMap.values());

    // Count active subscriptions
    const now = BigInt(Math.floor(Date.now() / 1000));
    const activeSubscriptions = subscriptionHistory.filter(s => 
      s.expiresAt > now
    ).length;

    return {
      totalSpent,
      activeSubscriptions,
      totalSubscriptions: subscriptionHistory.length,
      averageSpend: subscriptionHistory.length > 0
        ? totalSpent / BigInt(subscriptionHistory.length)
        : 0n,
      subscriptionHistory
    };
  }

  /**
   * Get revenue trends over time
   */
  async getRevenueTrends(params: {
    merchantId?: bigint;
    interval: 'daily' | 'weekly' | 'monthly';
    fromBlock?: bigint;
    toBlock?: bigint;
  }): Promise<TimeSeriesData[]> {
    const payments = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      eventName: 'PaymentReceived',
      args: params.merchantId ? { merchantId: params.merchantId } : undefined,
      fromBlock: params.fromBlock || 'earliest',
      toBlock: params.toBlock || 'latest'
    });

    // Group by interval
    const grouped = new Map<string, bigint>();
    
    for (const payment of payments) {
      const block = await this.publicClient.getBlock({ 
        blockNumber: payment.blockNumber! 
      });
      const timestamp = block.timestamp;
      const date = new Date(Number(timestamp) * 1000);
      
      let key: string;
      switch (params.interval) {
        case 'daily':
          key = date.toISOString().split('T')[0];
          break;
        case 'weekly':
          const week = this.getWeekNumber(date);
          key = `${date.getFullYear()}-W${week}`;
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          break;
      }
      
      const args = payment.args as any;
      const current = grouped.get(key) || 0n;
      grouped.set(key, current + BigInt(args.amount));
    }

    return Array.from(grouped.entries()).map(([label, value]) => ({
      timestamp: BigInt(Date.parse(label) / 1000),
      value,
      label
    })).sort((a, b) => Number(a.timestamp - b.timestamp));
  }

  /**
   * Get subscription growth metrics
   */
  async getSubscriptionGrowth(params: {
    merchantId?: bigint;
    interval: 'daily' | 'weekly' | 'monthly';
    fromBlock?: bigint;
    toBlock?: bigint;
  }): Promise<TimeSeriesData[]> {
    const subscriptions = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: 'SubscriptionMinted',
      args: params.merchantId ? { merchantId: params.merchantId } : undefined,
      fromBlock: params.fromBlock || 'earliest',
      toBlock: params.toBlock || 'latest'
    });

    // Group by interval
    const grouped = new Map<string, number>();
    
    for (const subscription of subscriptions) {
      const block = await this.publicClient.getBlock({ 
        blockNumber: subscription.blockNumber! 
      });
      const timestamp = block.timestamp;
      const date = new Date(Number(timestamp) * 1000);
      
      let key: string;
      switch (params.interval) {
        case 'daily':
          key = date.toISOString().split('T')[0];
          break;
        case 'weekly':
          const week = this.getWeekNumber(date);
          key = `${date.getFullYear()}-W${week}`;
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          break;
      }
      
      const current = grouped.get(key) || 0;
      grouped.set(key, current + 1);
    }

    // Calculate cumulative growth
    let cumulative = 0;
    const result: TimeSeriesData[] = [];
    
    Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([label, count]) => {
        cumulative += count;
        result.push({
          timestamp: BigInt(Date.parse(label) / 1000),
          value: cumulative,
          label
        });
      });

    return result;
  }

  /**
   * Get token distribution analytics
   */
  async getTokenDistribution(params?: {
    merchantId?: bigint;
    fromBlock?: bigint;
    toBlock?: bigint;
  }): Promise<Array<{
    token: Address;
    symbol: string;
    volume: bigint;
    transactions: number;
    percentage: number;
  }>> {
    const payments = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      eventName: 'PaymentReceived',
      args: params?.merchantId ? { merchantId: params.merchantId } : undefined,
      fromBlock: params?.fromBlock || 'earliest',
      toBlock: params?.toBlock || 'latest'
    });

    const tokenStats = new Map<Address, { volume: bigint; transactions: number }>();
    let totalVolume = 0n;

    payments.forEach(p => {
      const args = p.args as any;
      const token = args.paymentToken;
      const current = tokenStats.get(token) || { volume: 0n, transactions: 0 };
      tokenStats.set(token, {
        volume: current.volume + BigInt(args.amount),
        transactions: current.transactions + 1
      });
      totalVolume += BigInt(args.amount);
    });

    return Array.from(tokenStats.entries()).map(([token, stats]) => ({
      token,
      symbol: token === '0x0000000000000000000000000000000000000000' ? 'ETH' : 'SUBTEST',
      volume: stats.volume,
      transactions: stats.transactions,
      percentage: totalVolume > 0n 
        ? Number((stats.volume * 10000n) / totalVolume) / 100
        : 0
    })).sort((a, b) => Number(b.volume - a.volume));
  }

  /**
   * Calculate platform conversion rate
   */
  async getConversionMetrics(): Promise<{
    visitorToSubscriber: number;
    trialToPayment: number;
    renewalRate: number;
  }> {
    // This would require additional tracking mechanisms
    // Placeholder implementation
    return {
      visitorToSubscriber: 0,
      trialToPayment: 0,
      renewalRate: 0
    };
  }

  // Helper methods

  private async getActiveSubscriptionCount(): Promise<number> {
    // This would require iterating through all NFT holders
    // and checking expiration dates
    return 0;
  }

  private async getActiveMerchantSubscribers(merchantId: bigint): Promise<number> {
    // This would require checking all merchant subscriptions
    return 0;
  }

  private async calculateChurnRate(
    merchantId: bigint, 
    totalSubscribers: number
  ): Promise<number> {
    // Calculate based on expired vs active subscriptions
    return 0;
  }

  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  /**
   * Format analytics data for display
   */
  formatMetrics(metrics: PlatformMetrics): any {
    return {
      ...metrics,
      totalVolume: formatEther(metrics.totalVolume),
      totalPlatformFees: formatEther(metrics.totalPlatformFees),
      averageSubscriptionPrice: formatEther(metrics.averageSubscriptionPrice)
    };
  }

  /**
   * Get total number of subscriptions (simplified version for tests)
   */
  async getTotalSubscriptions(): Promise<bigint> {
    try {
      const subscriptions = await this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
        abi: subscriptionNFTABI,
        eventName: 'SubscriptionMinted',
        fromBlock: 'earliest',
        toBlock: 'latest'
      });
      return BigInt(subscriptions.length);
    } catch {
      return 0n;
    }
  }

  /**
   * Get merchant statistics (simplified version for tests)
   */
  async getMerchantStatistics(merchantId: bigint): Promise<{
    totalRevenue: bigint;
    activeSubscriptions: bigint;
    totalSubscribers: bigint;
  }> {
    try {
      const payments = await this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
        abi: subscriptionManagerABI,
        eventName: 'PaymentReceived',
        args: { merchantId },
        fromBlock: 'earliest',
        toBlock: 'latest'
      });

      const totalRevenue = payments.reduce((sum, p) => {
        const args = p.args as any;
        return sum + BigInt(args.amount) - BigInt(args.platformFee || 0n);
      }, 0n);

      const uniqueSubscribers = new Set(payments.map(p => (p.args as any).user));

      return {
        totalRevenue,
        activeSubscriptions: BigInt(uniqueSubscribers.size), // Simplified
        totalSubscribers: BigInt(uniqueSubscribers.size)
      };
    } catch {
      return {
        totalRevenue: 0n,
        activeSubscriptions: 0n,
        totalSubscribers: 0n
      };
    }
  }

  /**
   * Get platform statistics (simplified version for tests)
   */
  async getPlatformStatistics(): Promise<{
    totalMerchants: bigint;
    totalSubscriptions: bigint;
    totalVolume: bigint;
  }> {
    try {
      const [merchantRegistrations, subscriptions, payments] = await Promise.all([
        this.publicClient.getContractEvents({
          address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
          abi: subscriptionManagerABI,
          eventName: 'MerchantRegistered',
          fromBlock: 'earliest',
          toBlock: 'latest'
        }),
        this.publicClient.getContractEvents({
          address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
          abi: subscriptionNFTABI,
          eventName: 'SubscriptionMinted',
          fromBlock: 'earliest',
          toBlock: 'latest'
        }),
        this.publicClient.getContractEvents({
          address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
          abi: subscriptionManagerABI,
          eventName: 'PaymentReceived',
          fromBlock: 'earliest',
          toBlock: 'latest'
        })
      ]);

      const totalVolume = payments.reduce((sum, p) => 
        sum + BigInt((p.args as any).amount), 0n
      );

      return {
        totalMerchants: BigInt(merchantRegistrations.length),
        totalSubscriptions: BigInt(subscriptions.length),
        totalVolume
      };
    } catch {
      return {
        totalMerchants: 0n,
        totalSubscriptions: 0n,
        totalVolume: 0n
      };
    }
  }
}