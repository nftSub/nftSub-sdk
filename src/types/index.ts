import { 
  type Address, 
  type Hash, 
  type PublicClient, 
  type WalletClient,
  type Chain
} from 'viem';

// Core SDK Types
export interface SDKConfig {
  chain: 'sepolia' | 'mainnet' | 'polygon' | 'base' | string;
  walletClient?: WalletClient;
  publicClient?: PublicClient;
  privateKey?: string;
  rpc?: string;
  readOnly?: boolean;
}

// Subscription Types
export interface SubscriptionStatus {
  isActive: boolean;
  expiresAt: bigint;
  renewalCount: bigint;
  lastRenewal: bigint;
  merchantId: bigint;
}

export interface SubscribeParams {
  merchantId: bigint;
  paymentToken: Address | 'ETH';
  autoApprove?: boolean;
}

export interface SubscribeResult {
  hash: Hash;
  approvalHash?: Hash;
}

// Merchant Types
export interface Merchant {
  id: bigint;
  owner: Address;
  payoutAddress: Address;
  subscriptionPeriod: bigint;
  gracePeriod: bigint;
  isActive: boolean;
}

export interface MerchantRegistrationParams {
  payoutAddress: Address;
  subscriptionPeriod: bigint;
  gracePeriod: bigint;
}

export interface MerchantPriceParams {
  merchantId: bigint;
  token: Address | 'ETH';
  price: bigint;
}

// Token Types
export interface Token {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  isNative?: boolean;
}

export interface TokenBalance {
  token: Token;
  balance: bigint;
  formattedBalance: string;
}

// Event Types
export type EventCallback<T = any> = (data: T) => void | Promise<void>;

export interface EventListeners {
  onPaymentReceived?: EventCallback<PaymentEvent>;
  onSubscriptionMinted?: EventCallback<SubscriptionMintedEvent>;
  onSubscriptionRenewed?: EventCallback<SubscriptionRenewedEvent>;
  onSubscriptionExpired?: EventCallback<SubscriptionExpiredEvent>;
  onMerchantRegistered?: EventCallback<MerchantRegisteredEvent>;
  onMerchantWithdrawal?: EventCallback<MerchantWithdrawalEvent>;
}

export interface PaymentEvent {
  subscriber: Address;
  merchantId: bigint;
  paymentToken: Address;
  amount: bigint;
  platformFee: bigint;
  subscriptionPeriod: bigint;
  blockNumber: bigint;
  transactionHash: Hash;
}

export interface SubscriptionMintedEvent {
  subscriber: Address;
  merchantId: bigint;
  expiresAt: bigint;
  blockNumber: bigint;
  transactionHash: Hash;
}

export interface SubscriptionRenewedEvent {
  subscriber: Address;
  merchantId: bigint;
  newExpiresAt: bigint;
  renewalCount: bigint;
  blockNumber: bigint;
  transactionHash: Hash;
}

export interface SubscriptionExpiredEvent {
  subscriber: Address;
  merchantId: bigint;
  blockNumber: bigint;
  transactionHash: Hash;
}

export interface MerchantRegisteredEvent {
  merchantId: bigint;
  owner: Address;
  payoutAddress: Address;
  blockNumber: bigint;
  transactionHash: Hash;
}

export interface MerchantWithdrawalEvent {
  merchantId: bigint;
  token: Address;
  amount: bigint;
  payoutAddress: Address;
  blockNumber: bigint;
  transactionHash: Hash;
}

// Analytics Types
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
}

// NFT Types
export interface NFTMetadata {
  tokenId: bigint;
  merchantId: bigint;
  subscriber: Address;
  expiresAt: bigint;
  renewalCount: bigint;
  uri: string;
}

// Error Types
export enum SDKErrorCode {
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  APPROVAL_NEEDED = 'APPROVAL_NEEDED',
  SUBSCRIPTION_EXISTS = 'SUBSCRIPTION_EXISTS',
  MERCHANT_NOT_FOUND = 'MERCHANT_NOT_FOUND',
  INVALID_CHAIN = 'INVALID_CHAIN',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

export class SDKError extends Error {
  constructor(
    public code: SDKErrorCode,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SDKError';
  }
}