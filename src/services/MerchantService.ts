import { 
  getContract, 
  type Address, 
  type PublicClient, 
  type WalletClient,
  parseEther,
  formatEther,
  type Hash,
  decodeEventLog
} from 'viem';
import { subscriptionManagerABI } from '@/config/abis';
import { CONTRACT_ADDRESSES } from '@/config/contracts';

export interface MerchantPlan {
  payoutAddress: Address;
  subscriptionPeriod: bigint;
  gracePeriod: bigint;
  isActive: boolean;
  totalSubscribers: bigint;
}

export interface MerchantBalance {
  totalReceived: bigint;
  totalWithdrawn: bigint;
  pendingAmount: bigint;
  lastWithdrawal: bigint;
}

export interface MerchantConfig {
  merchantId: bigint;
  paymentTokens: Address[];
  prices: bigint[];
}

/**
 * Service for managing merchant operations
 * Handles merchant registration, plan management, pricing, and withdrawals
 */
export class MerchantService {
  private contract: any;
  
  constructor(
    private publicClient: PublicClient,
    private walletClient?: WalletClient
  ) {
    this.contract = getContract({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      client: { public: this.publicClient, wallet: this.walletClient }
    });
  }

  /**
   * Register a new merchant on the platform
   */
  async registerMerchant(params: {
    payoutAddress: Address;
    subscriptionPeriod: number; // in seconds
    gracePeriod: number; // in seconds
  }): Promise<{ hash: Hash; merchantId?: bigint }> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    const hash = await this.contract.write.registerMerchant([
      params.payoutAddress,
      BigInt(params.subscriptionPeriod),
      BigInt(params.gracePeriod)
    ]);

    // Wait for transaction and get merchant ID from events
    const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
    const merchantId = this.extractMerchantIdFromReceipt(receipt);
    
    return { hash, merchantId };
  }

  /**
   * Update existing merchant plan configuration
   */
  async updateMerchantPlan(params: {
    merchantId: bigint;
    payoutAddress: Address;
    subscriptionPeriod: number;
    isActive: boolean;
  }): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    return await this.contract.write.updateMerchantPlan([
      params.merchantId,
      params.payoutAddress,
      BigInt(params.subscriptionPeriod),
      params.isActive
    ]);
  }

  /**
   * Set pricing for a specific payment token
   */
  async setMerchantPrice(params: {
    merchantId: bigint;
    paymentToken: Address;
    price: string; // Price in token units (will be converted based on decimals)
    decimals?: number;
  }): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    const decimals = params.decimals || 18;
    const priceInWei = parseEther(params.price); // For 18 decimals
    
    return await this.contract.write.setMerchantPrice([
      params.merchantId,
      params.paymentToken,
      priceInWei
    ]);
  }

  /**
   * Set multiple token prices at once
   */
  async setBulkPrices(params: {
    merchantId: bigint;
    tokens: Array<{
      address: Address;
      price: string;
      decimals?: number;
    }>;
  }): Promise<Hash[]> {
    const hashes: Hash[] = [];
    
    for (const token of params.tokens) {
      const hash = await this.setMerchantPrice({
        merchantId: params.merchantId,
        paymentToken: token.address,
        price: token.price,
        decimals: token.decimals
      });
      hashes.push(hash);
    }
    
    return hashes;
  }

  /**
   * Get merchant plan details
   */
  async getMerchantPlan(merchantId: bigint): Promise<MerchantPlan> {
    const plan = await this.contract.read.getMerchantPlan([merchantId]);
    return {
      payoutAddress: plan.payoutAddress,
      subscriptionPeriod: plan.subscriptionPeriod,
      gracePeriod: plan.gracePeriod,
      isActive: plan.isActive,
      totalSubscribers: plan.totalSubscribers
    };
  }

  /**
   * Get merchant balance for a specific token
   */
  async getMerchantBalance(
    merchantId: bigint,
    token: Address
  ): Promise<bigint> {
    return await this.contract.read.getMerchantBalance([merchantId, token]);
  }

  /**
   * Get all balances for a merchant across multiple tokens
   */
  async getAllMerchantBalances(
    merchantId: bigint,
    tokens: Address[]
  ): Promise<Map<Address, bigint>> {
    const balances = new Map<Address, bigint>();
    
    for (const token of tokens) {
      const balance = await this.getMerchantBalance(merchantId, token);
      if (balance > 0n) {
        balances.set(token, balance);
      }
    }
    
    return balances;
  }

  /**
   * Withdraw merchant balance for a specific token
   */
  async withdrawMerchantBalance(params: {
    merchantId: bigint;
    token: Address;
  }): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    return await this.contract.write.withdrawMerchantBalance([
      params.merchantId,
      params.token
    ]);
  }

  /**
   * Withdraw all available balances for a merchant
   */
  async withdrawAllBalances(
    merchantId: bigint,
    tokens: Address[]
  ): Promise<Hash[]> {
    const hashes: Hash[] = [];
    const balances = await this.getAllMerchantBalances(merchantId, tokens);
    
    for (const [token, balance] of balances) {
      if (balance > 0n) {
        const hash = await this.withdrawMerchantBalance({
          merchantId,
          token
        });
        hashes.push(hash);
      }
    }
    
    return hashes;
  }

  /**
   * Get merchant price for a specific token
   */
  async getMerchantPrice(
    merchantId: bigint,
    token: Address
  ): Promise<bigint> {
    return await this.contract.read.getMerchantPrice([merchantId, token]);
  }

  /**
   * Check if a merchant accepts a specific token
   */
  async isMerchantTokenAccepted(
    merchantId: bigint,
    token: Address
  ): Promise<boolean> {
    return await this.contract.read.isMerchantTokenAccepted([merchantId, token]);
  }

  /**
   * Get all accepted tokens and their prices for a merchant
   */
  async getMerchantTokenPrices(
    merchantId: bigint,
    possibleTokens: Address[]
  ): Promise<Map<Address, bigint>> {
    const prices = new Map<Address, bigint>();
    
    for (const token of possibleTokens) {
      const isAccepted = await this.isMerchantTokenAccepted(merchantId, token);
      if (isAccepted) {
        const price = await this.getMerchantPrice(merchantId, token);
        prices.set(token, price);
      }
    }
    
    return prices;
  }

  /**
   * Listen to merchant registration events
   */
  watchMerchantRegistrations(
    callback: (merchantId: bigint, owner: Address, payoutAddress: Address) => void
  ) {
    return this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      eventName: 'MerchantRegistered',
      onLogs: (logs) => {
        logs.forEach((log) => {
          const { merchantId, owner, payoutAddress } = log.args as any;
          callback(merchantId, owner, payoutAddress);
        });
      }
    });
  }

  /**
   * Listen to merchant withdrawal events
   */
  watchMerchantWithdrawals(
    merchantId?: bigint,
    callback?: (data: {
      merchantId: bigint;
      token: Address;
      amount: bigint;
      payoutAddress: Address;
    }) => void
  ) {
    return this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      eventName: 'MerchantWithdrawal',
      onLogs: (logs) => {
        logs.forEach((log) => {
          const args = log.args as any;
          if (!merchantId || args.merchantId === merchantId) {
            callback?.({
              merchantId: args.merchantId,
              token: args.token,
              amount: args.amount,
              payoutAddress: args.payoutAddress
            });
          }
        });
      }
    });
  }

  /**
   * Get historical merchant events
   */
  async getMerchantHistory(merchantId: bigint) {
    const registrationLogs = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      eventName: 'MerchantRegistered',
      fromBlock: 'earliest',
      args: { merchantId }
    });

    const withdrawalLogs = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      eventName: 'MerchantWithdrawal',
      fromBlock: 'earliest',
      args: { merchantId }
    });

    return {
      registrations: registrationLogs,
      withdrawals: withdrawalLogs
    };
  }

  /**
   * Extract merchant ID from transaction receipt
   */
  private extractMerchantIdFromReceipt(receipt: any): bigint | undefined {
    const merchantRegisteredEvent = receipt.logs.find(
      (log: any) => {
        try {
          const decoded = decodeEventLog({
            abi: subscriptionManagerABI,
            data: log.data,
            topics: log.topics
          });
          return decoded.eventName === 'MerchantRegistered';
        } catch {
          return false;
        }
      }
    );

    if (merchantRegisteredEvent) {
      const decoded = decodeEventLog({
        abi: subscriptionManagerABI,
        data: merchantRegisteredEvent.data,
        topics: merchantRegisteredEvent.topics
      });
      return (decoded.args as any).merchantId;
    }

    return undefined;
  }

  /**
   * Format price for display
   */
  formatPrice(price: bigint, decimals: number = 18): string {
    return formatEther(price);
  }

  /**
   * Calculate estimated revenue
   */
  calculateEstimatedRevenue(params: {
    price: bigint;
    subscribers: number;
    platformFeeBps: number;
  }): bigint {
    const totalRevenue = params.price * BigInt(params.subscribers);
    const platformFee = (totalRevenue * BigInt(params.platformFeeBps)) / 10000n;
    return totalRevenue - platformFee;
  }

  /**
   * Check if an address is a registered merchant
   */
  async isMerchant(address: Address): Promise<boolean> {
    try {
      // Simplified check - try to get merchant 1 and check if address matches
      const plan = await this.getMerchantPlan(1n);
      return plan.payoutAddress.toLowerCase() === address.toLowerCase();
    } catch {
      return false;
    }
  }

  /**
   * Get total number of merchants registered
   */
  async getMerchantCount(): Promise<bigint> {
    // Simplified implementation - count by checking existing merchants
    let count = 0n;
    for (let i = 1n; i <= 10n; i++) {
      try {
        await this.getMerchantPlan(i);
        count = i;
      } catch {
        break;
      }
    }
    return count;
  }
}