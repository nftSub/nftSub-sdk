import {
  getContract,
  type Address,
  type PublicClient,
  type WalletClient,
  type Hash,
  parseEther,
  formatEther,
  zeroAddress
} from 'viem';
import { subscriptionManagerABI, subscriptionNFTABI } from '@/config/abis';
import { CONTRACT_ADDRESSES, MERCHANT_ID } from '@/config/contracts';

export interface SubscriptionStatus {
  isActive: boolean;
  expiresAt: bigint;
  renewalCount: bigint;
  lastRenewal: bigint;
  merchantId: bigint;
}

export interface PaymentOption {
  token: Address;
  price: bigint;
  symbol: string;
  decimals: number;
}

export interface SubscriptionPlan {
  merchantId: bigint;
  period: bigint;
  gracePeriod: bigint;
  paymentOptions: PaymentOption[];
}

/**
 * Service for managing user subscriptions
 * Handles subscription purchases, renewals, status checks, and subscription management
 */
export class SubscriptionService {
  private managerContract: any;
  private nftContract: any;

  constructor(
    private publicClient: PublicClient,
    private walletClient?: WalletClient
  ) {
    this.managerContract = getContract({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      client: { public: this.publicClient, wallet: this.walletClient }
    });

    this.nftContract = getContract({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      client: { public: this.publicClient, wallet: this.walletClient }
    });
  }

  /**
   * Subscribe to a merchant plan
   */
  async subscribe(params: {
    merchantId: bigint;
    paymentToken: Address;
    value?: bigint; // For ETH payments
  }): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');

    const isETH = params.paymentToken === zeroAddress;
    
    if (isETH) {
      // ETH payment
      const price = await this.getSubscriptionPrice(params.merchantId, params.paymentToken);
      return await this.managerContract.write.subscribe(
        [params.merchantId, params.paymentToken],
        { value: price }
      );
    } else {
      // ERC20 payment - need approval first
      return await this.managerContract.write.subscribe([
        params.merchantId,
        params.paymentToken
      ]);
    }
  }

  /**
   * Subscribe with automatic token approval
   */
  async subscribeWithApproval(params: {
    merchantId: bigint;
    paymentToken: Address;
    tokenContract: any; // ERC20 contract instance
  }): Promise<{ approvalHash?: Hash; subscriptionHash: Hash }> {
    if (!this.walletClient) throw new Error('Wallet not connected');

    const price = await this.getSubscriptionPrice(params.merchantId, params.paymentToken);
    
    // Check current allowance
    const allowance = await params.tokenContract.read.allowance([
      this.walletClient.account?.address,
      CONTRACT_ADDRESSES.sepolia.subscriptionManager
    ]);

    let approvalHash: Hash | undefined;
    
    // Approve if needed
    if (allowance < price) {
      approvalHash = await params.tokenContract.write.approve([
        CONTRACT_ADDRESSES.sepolia.subscriptionManager,
        price
      ]);
      
      // Wait for approval confirmation
      await this.publicClient.waitForTransactionReceipt({ hash: approvalHash! });
    }

    // Subscribe
    const subscriptionHash = await this.subscribe({
      merchantId: params.merchantId,
      paymentToken: params.paymentToken
    });

    return { approvalHash, subscriptionHash };
  }

  /**
   * Get subscription status for a user
   */
  async getSubscriptionStatus(
    user: Address,
    merchantId: bigint
  ): Promise<SubscriptionStatus> {
    const status = await this.nftContract.read.getSubscriptionStatus([user, merchantId]);
    
    return {
      isActive: status.isActive,
      expiresAt: status.expiresAt,
      renewalCount: status.renewalCount,
      lastRenewal: status.lastRenewal,
      merchantId: status.merchantId
    };
  }

  /**
   * Check if subscription is active
   */
  async isSubscriptionActive(
    user: Address,
    merchantId: bigint
  ): Promise<boolean> {
    return await this.nftContract.read.isSubscriptionActive([user, merchantId]);
  }

  /**
   * Get all user subscriptions
   */
  async getUserSubscriptions(user: Address): Promise<bigint[]> {
    return await this.nftContract.read.getUserSubscriptions([user]);
  }

  /**
   * Get detailed information for all user subscriptions
   */
  async getAllUserSubscriptionDetails(user: Address): Promise<SubscriptionStatus[]> {
    const merchantIds = await this.getUserSubscriptions(user);
    const statuses: SubscriptionStatus[] = [];

    for (const merchantId of merchantIds) {
      const status = await this.getSubscriptionStatus(user, merchantId);
      statuses.push(status);
    }

    return statuses;
  }

  /**
   * Get subscription price for a merchant and token
   */
  async getSubscriptionPrice(
    merchantId: bigint,
    paymentToken: Address
  ): Promise<bigint> {
    return await this.managerContract.read.getMerchantPrice([merchantId, paymentToken]);
  }

  /**
   * Get all payment options for a merchant
   */
  async getPaymentOptions(
    merchantId: bigint,
    supportedTokens: Array<{ address: Address; symbol: string; decimals: number }>
  ): Promise<PaymentOption[]> {
    const options: PaymentOption[] = [];

    for (const token of supportedTokens) {
      const isAccepted = await this.managerContract.read.isMerchantTokenAccepted([
        merchantId,
        token.address
      ]);

      if (isAccepted) {
        const price = await this.getSubscriptionPrice(merchantId, token.address);
        options.push({
          token: token.address,
          price,
          symbol: token.symbol,
          decimals: token.decimals
        });
      }
    }

    return options;
  }

  /**
   * Calculate time remaining for subscription
   */
  getTimeRemaining(expiresAt: bigint): {
    days: number;
    hours: number;
    minutes: number;
    isExpired: boolean;
  } {
    const now = BigInt(Math.floor(Date.now() / 1000));
    const remaining = Number(expiresAt - now);

    if (remaining <= 0) {
      return { days: 0, hours: 0, minutes: 0, isExpired: true };
    }

    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);

    return { days, hours, minutes, isExpired: false };
  }

  /**
   * Get subscription plan details
   */
  async getSubscriptionPlan(merchantId: bigint): Promise<{
    period: bigint;
    gracePeriod: bigint;
    isActive: boolean;
  }> {
    const plan = await this.managerContract.read.getMerchantPlan([merchantId]);
    
    return {
      period: plan.subscriptionPeriod,
      gracePeriod: plan.gracePeriod,
      isActive: plan.isActive
    };
  }

  /**
   * Estimate renewal date
   */
  estimateRenewalDate(currentExpiry: bigint, period: bigint): Date {
    const now = BigInt(Math.floor(Date.now() / 1000));
    const newExpiry = currentExpiry > now ? currentExpiry + period : now + period;
    return new Date(Number(newExpiry) * 1000);
  }

  /**
   * Watch for payment events
   */
  watchPaymentEvents(params: {
    subscriber?: Address;
    merchantId?: bigint;
    callback: (event: {
      subscriber: Address;
      merchantId: bigint;
      paymentToken: Address;
      amount: bigint;
      platformFee: bigint;
      subscriptionPeriod: bigint;
    }) => void;
  }) {
    return this.publicClient.watchContractEvent({
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
          params.callback({
            subscriber: args.user,
            merchantId: args.merchantId,
            paymentToken: args.paymentToken,
            amount: args.amount,
            platformFee: args.platformFee,
            subscriptionPeriod: args.subscriptionPeriod
          });
        });
      }
    });
  }

  /**
   * Watch for subscription minting events
   */
  watchSubscriptionMinted(params: {
    subscriber?: Address;
    merchantId?: bigint;
    callback: (event: {
      subscriber: Address;
      merchantId: bigint;
      expiresAt: bigint;
    }) => void;
  }) {
    return this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: 'SubscriptionMinted' as any,
      args: {
        user: params.subscriber,
        merchantId: params.merchantId
      } as any,
      onLogs: (logs) => {
        logs.forEach((log) => {
          const args = log.args as any;
          params.callback({
            subscriber: args.user,
            merchantId: args.merchantId,
            expiresAt: args.expiresAt
          });
        });
      }
    });
  }

  /**
   * Watch for subscription renewal events
   */
  watchSubscriptionRenewed(params: {
    subscriber?: Address;
    merchantId?: bigint;
    callback: (event: {
      subscriber: Address;
      merchantId: bigint;
      newExpiresAt: bigint;
      renewalCount: bigint;
    }) => void;
  }) {
    return this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: 'SubscriptionRenewed' as any,
      args: {
        user: params.subscriber,
        merchantId: params.merchantId
      } as any,
      onLogs: (logs) => {
        logs.forEach((log) => {
          const args = log.args as any;
          params.callback({
            subscriber: args.user,
            merchantId: args.merchantId,
            newExpiresAt: args.newExpiresAt,
            renewalCount: args.renewalCount
          });
        });
      }
    });
  }

  /**
   * Get subscription history for a user
   */
  async getSubscriptionHistory(user: Address, merchantId?: bigint) {
    const mintedLogs = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: 'SubscriptionMinted' as any,
      fromBlock: 'earliest',
      args: { user, merchantId } as any
    });

    const renewedLogs = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: 'SubscriptionRenewed' as any,
      fromBlock: 'earliest',
      args: { user, merchantId } as any
    });

    const paymentLogs = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      eventName: 'PaymentReceived' as any,
      fromBlock: 'earliest',
      args: { user, merchantId } as any
    });

    return {
      minted: mintedLogs,
      renewed: renewedLogs,
      payments: paymentLogs
    };
  }

  /**
   * Calculate total spent by user
   */
  async calculateTotalSpent(user: Address, merchantId?: bigint): Promise<bigint> {
    const { payments } = await this.getSubscriptionHistory(user, merchantId);
    
    return payments.reduce((total, payment) => {
      return total + (payment.args as any).amount;
    }, 0n);
  }

  /**
   * Check if user needs to renew soon
   */
  async needsRenewalSoon(
    user: Address,
    merchantId: bigint,
    thresholdDays: number = 7
  ): Promise<boolean> {
    const status = await this.getSubscriptionStatus(user, merchantId);
    
    if (!status.isActive) return false;
    
    const timeRemaining = this.getTimeRemaining(status.expiresAt);
    return timeRemaining.days <= thresholdDays && !timeRemaining.isExpired;
  }

  /**
   * Get NFT balance for a user and merchant
   */
  async getNFTBalance(user: Address, merchantId: bigint): Promise<bigint> {
    return await this.nftContract.read.balanceOf([user, merchantId]);
  }

  /**
   * Get NFT URI for a subscription
   */
  async getNFTUri(tokenId: bigint): Promise<string> {
    return await this.nftContract.read.uri([tokenId]);
  }

  /**
   * Format subscription period for display
   */
  formatPeriod(seconds: bigint): string {
    const days = Number(seconds) / 86400;
    
    if (days >= 365) {
      return `${Math.floor(days / 365)} year${days >= 730 ? 's' : ''}`;
    } else if (days >= 30) {
      return `${Math.floor(days / 30)} month${days >= 60 ? 's' : ''}`;
    } else if (days >= 7) {
      return `${Math.floor(days / 7)} week${days >= 14 ? 's' : ''}`;
    } else {
      return `${days} day${days > 1 ? 's' : ''}`;
    }
  }

  /**
   * Format price for display
   */
  formatPrice(price: bigint, decimals: number = 18): string {
    if (decimals === 18) {
      return formatEther(price);
    }
    // Handle other decimals
    return (Number(price) / Math.pow(10, decimals)).toFixed(6);
  }
}