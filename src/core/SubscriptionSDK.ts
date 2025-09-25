import {
  createPublicClient,
  createWalletClient,
  http,
  type PublicClient,
  type WalletClient,
  type Hash,
  type Address,
  zeroAddress,
  custom
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import EventEmitter from 'events';

// Import our services
import { MerchantService } from '@/services/MerchantService';
import { SubscriptionService } from '@/services/SubscriptionService';
import { TokenService } from '@/services/TokenService';
import { NFTService } from '@/services/NFTService';
import { EventMonitoringService } from '@/services/EventMonitoringService';
import { AnalyticsService } from '@/services/AnalyticsService';
import { AdminService } from '@/services/AdminService';
import { ReactiveNetworkService } from '@/services/ReactiveNetworkService';

// Import SDK types and config
import { 
  type SDKConfig,
  type SubscribeParams,
  type SubscribeResult,
  type EventListeners,
  SDKError,
  SDKErrorCode
} from '../types';
import { getChainConfig, type ChainConfig } from '../config/chains';

/**
 * Main SDK class for subscription NFT platform
 * Wraps all services and provides simplified API for developers
 */
export class SubscriptionSDK extends EventEmitter {
  // Core clients
  public publicClient: PublicClient;
  public walletClient?: WalletClient;
  
  // Chain configuration
  public chainConfig: ChainConfig;
  
  // Services
  public merchants: MerchantService;
  public subscriptions: SubscriptionService;
  public tokens: TokenService;
  public nfts: NFTService;
  public events: EventMonitoringService;
  public analytics: AnalyticsService;
  public admin: AdminService;
  public reactive: ReactiveNetworkService;
  
  // Event monitoring
  private eventListeners: Map<string, string> = new Map();
  
  constructor(config: SDKConfig) {
    super();
    
    // Get chain configuration
    this.chainConfig = getChainConfig(config.chain);
    
    // Initialize clients
    this.publicClient = this.initPublicClient(config);
    this.walletClient = this.initWalletClient(config);
    
    // Initialize services
    this.merchants = new MerchantService(this.publicClient, this.walletClient);
    this.subscriptions = new SubscriptionService(this.publicClient, this.walletClient);
    this.tokens = new TokenService(this.publicClient, this.walletClient);
    this.nfts = new NFTService(this.publicClient, this.walletClient);
    this.events = new EventMonitoringService(this.publicClient);
    this.analytics = new AnalyticsService(this.publicClient);
    this.admin = new AdminService(this.publicClient, this.walletClient);
    
    // Initialize reactive service if configured
    if (this.chainConfig.reactive) {
      const reactivePublicClient = createPublicClient({
        transport: http(this.chainConfig.reactive.rpc)
      });
      this.reactive = new ReactiveNetworkService(
        this.publicClient, 
        this.walletClient,
        reactivePublicClient
      );
    } else {
      this.reactive = new ReactiveNetworkService(
        this.publicClient,
        this.walletClient
      );
    }
  }
  
  /**
   * Initialize public client for reading blockchain data
   */
  private initPublicClient(config: SDKConfig): PublicClient {
    // Use provided client if available
    if (config.publicClient) {
      return config.publicClient;
    }
    
    // Create new public client
    const rpc = config.rpc || this.chainConfig.rpc;
    return createPublicClient({
      transport: http(rpc)
    });
  }
  
  /**
   * Initialize wallet client for transactions
   */
  private initWalletClient(config: SDKConfig): WalletClient | undefined {
    // Use provided wallet client
    if (config.walletClient) {
      return config.walletClient;
    }
    
    // Create from private key
    if (config.privateKey) {
      const account = privateKeyToAccount(config.privateKey as `0x${string}`);
      const rpc = config.rpc || this.chainConfig.rpc;
      
      return createWalletClient({
        account,
        transport: http(rpc)
      });
    }
    
    // Read-only mode
    if (config.readOnly) {
      return undefined;
    }
    
    // Check for browser wallet
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      return createWalletClient({
        transport: custom((window as any).ethereum)
      });
    }
    
    return undefined;
  }
  
  // ============ Quick Actions ============
  
  /**
   * Subscribe to a merchant (simplified)
   */
  async subscribe(
    merchantId: bigint,
    paymentToken: Address | 'ETH' = 'ETH'
  ): Promise<Hash> {
    if (!this.walletClient) {
      throw new SDKError(
        SDKErrorCode.WALLET_NOT_CONNECTED,
        'Wallet not connected. Initialize SDK with wallet client or private key.'
      );
    }
    
    const tokenAddress = paymentToken === 'ETH' ? zeroAddress : paymentToken;
    
    // Handle approval if needed
    if (tokenAddress !== zeroAddress) {
      const approvalResult = await this.tokens.approveIfNeeded({
        tokenAddress,
        spender: this.chainConfig.contracts.subscriptionManager,
        amount: await this.subscriptions.getSubscriptionPrice(merchantId, tokenAddress)
      });
      
      if (approvalResult.needed && approvalResult.hash) {
        // Wait for approval
        await this.publicClient.waitForTransactionReceipt({
          hash: approvalResult.hash
        });
      }
    }
    
    // Subscribe
    return await this.subscriptions.subscribe({
      merchantId,
      paymentToken: tokenAddress
    });
  }
  
  /**
   * Check if user has active subscription
   */
  async checkAccess(merchantId: bigint, userAddress?: Address): Promise<boolean> {
    const address = userAddress || this.walletClient?.account?.address;
    if (!address) {
      throw new SDKError(
        SDKErrorCode.WALLET_NOT_CONNECTED,
        'No address provided and wallet not connected'
      );
    }
    
    return await this.subscriptions.isSubscriptionActive(address, merchantId);
  }
  
  /**
   * Get merchant balance
   */
  async getMerchantBalance(
    merchantId: bigint, 
    token: Address | 'ETH' = 'ETH'
  ): Promise<bigint> {
    const tokenAddress = token === 'ETH' ? zeroAddress : token;
    return await this.merchants.getMerchantBalance(merchantId, tokenAddress);
  }
  
  /**
   * Withdraw merchant earnings
   */
  async withdrawMerchantBalance(
    merchantId: bigint,
    token: Address | 'ETH' = 'ETH'
  ): Promise<Hash> {
    if (!this.walletClient) {
      throw new SDKError(
        SDKErrorCode.WALLET_NOT_CONNECTED,
        'Wallet not connected'
      );
    }
    
    const tokenAddress = token === 'ETH' ? zeroAddress : token;
    return await this.merchants.withdrawMerchantBalance({
      merchantId,
      token: tokenAddress
    });
  }
  
  // ============ Event Monitoring ============
  
  /**
   * Start monitoring events with callbacks
   */
  startEventMonitoring(listeners: EventListeners): void {
    // Payment events
    if (listeners.onPaymentReceived) {
      const id = this.events.monitorPaymentEvents({
        onEvent: (event, log) => {
          listeners.onPaymentReceived!(event);
          this.emit('payment:received', event);
        }
      });
      this.eventListeners.set('payment', id);
    }
    
    // Subscription lifecycle
    if (listeners.onSubscriptionMinted || listeners.onSubscriptionRenewed) {
      const id = this.events.monitorSubscriptionLifecycle({
        onMinted: listeners.onSubscriptionMinted ? 
          (event, log) => {
            listeners.onSubscriptionMinted!(event);
            this.emit('subscription:minted', event);
          } : undefined,
        onRenewed: listeners.onSubscriptionRenewed ?
          (event, log) => {
            listeners.onSubscriptionRenewed!(event);
            this.emit('subscription:renewed', event);
          } : undefined
      });
      this.eventListeners.set('lifecycle', id);
    }
    
    // Merchant events
    if (listeners.onMerchantRegistered || listeners.onMerchantWithdrawal) {
      const id = this.events.monitorMerchantEvents({
        onRegistered: listeners.onMerchantRegistered ?
          (event, log) => {
            listeners.onMerchantRegistered!(event);
            this.emit('merchant:registered', event);
          } : undefined,
        onWithdrawal: listeners.onMerchantWithdrawal ?
          (event, log) => {
            listeners.onMerchantWithdrawal!(event);
            this.emit('merchant:withdrawal', event);
          } : undefined
      });
      this.eventListeners.set('merchant', id);
    }
  }
  
  /**
   * Stop all event monitoring
   */
  stopEventMonitoring(): void {
    this.eventListeners.forEach(monitorId => {
      this.events.stopMonitoring(monitorId);
    });
    this.eventListeners.clear();
    this.removeAllListeners();
  }
  
  // ============ Utility Methods ============
  
  /**
   * Get connected wallet address
   */
  getAddress(): Address | undefined {
    return this.walletClient?.account?.address;
  }
  
  /**
   * Check if wallet is connected
   */
  isConnected(): boolean {
    return !!this.walletClient;
  }
  
  /**
   * Get chain ID
   */
  getChainId(): number {
    return this.chainConfig.chainId;
  }
  
  /**
   * Get contract addresses
   */
  getContracts() {
    return this.chainConfig.contracts;
  }
  
  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(hash: Hash) {
    return await this.publicClient.waitForTransactionReceipt({ hash });
  }
  
  /**
   * Format token amount for display
   */
  formatAmount(amount: bigint, decimals: number = 18): string {
    return this.tokens.formatTokenAmount(amount, decimals);
  }
  
  /**
   * Parse token amount from string
   */
  parseAmount(amount: string, decimals: number = 18): bigint {
    return this.tokens.parseTokenAmount(amount, decimals);
  }
}