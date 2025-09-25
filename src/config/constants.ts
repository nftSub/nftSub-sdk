import { type Address } from 'viem';
import { keccak256, toHex } from 'viem';

// Contract role hashes - computed using keccak256
export const ROLE_HASHES = {
  DEFAULT_ADMIN: '0x0000000000000000000000000000000000000000000000000000000000000000',
  MANAGER: keccak256(toHex('MANAGER_ROLE')),
  REACTIVE: keccak256(toHex('REACTIVE_ROLE')),
  PAUSER: keccak256(toHex('PAUSER_ROLE'))
} as const;

// Zero address constant
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as Address;

// ETH placeholder address for native token operations
export const ETH_ADDRESS = ZERO_ADDRESS;

// Default gas limits
export const GAS_LIMITS = {
  SUBSCRIBE: 300000n,
  WITHDRAW: 150000n,
  REGISTER_MERCHANT: 200000n,
  SET_PRICE: 100000n,
  GRANT_ROLE: 100000n,
  REVOKE_ROLE: 100000n
} as const;

// Default durations (in seconds)
export const DURATIONS = {
  DEFAULT_SUBSCRIPTION_PERIOD: 2592000, // 30 days
  DEFAULT_GRACE_PERIOD: 604800, // 7 days
  MIN_SUBSCRIPTION_PERIOD: 3600, // 1 hour
  MAX_SUBSCRIPTION_PERIOD: 31536000 // 365 days
} as const;

// Platform fee constants
export const PLATFORM_FEE = {
  DEFAULT_BPS: 500, // 5%
  MAX_BPS: 10000 // 100% (for calculations)
} as const;

// Event monitoring intervals
export const MONITORING = {
  POLL_INTERVAL: 2000, // 2 seconds
  MAX_BLOCK_RANGE: 5000, // Maximum blocks to query at once
  CONFIRMATION_BLOCKS: 2 // Blocks to wait for confirmation
} as const;

// Reactive Network specific
export const REACTIVE_NETWORK = {
  CHAIN_ID: 10672,
  RPC_URL: 'https://lasna-rpc.rnk.dev/',
  EXPLORER_URL: 'https://reactive-explorer.rnk.dev/',
  NATIVE_SYMBOL: 'REACT',
  SUBSCRIPTION_FEE: '0.001' // in REACT tokens
} as const;

// Sepolia testnet
export const SEPOLIA = {
  CHAIN_ID: 11155111,
  RPC_URL: 'https://ethereum-sepolia-public.nodies.app',
  EXPLORER_URL: 'https://sepolia.etherscan.io/',
  NATIVE_SYMBOL: 'ETH'
} as const;

// Error messages
export const ERRORS = {
  NOT_CONNECTED: 'SDK not connected. Please connect wallet first.',
  INVALID_CHAIN: 'Invalid chain. Please switch to a supported network.',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this operation.',
  MERCHANT_NOT_FOUND: 'Merchant not found.',
  SUBSCRIPTION_EXPIRED: 'Subscription has expired.',
  INVALID_TOKEN: 'Token not accepted by merchant.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  NO_WALLET: 'No wallet client provided.',
  INVALID_ADDRESS: 'Invalid address format.',
  PRICE_NOT_SET: 'Price not set for this token.'
} as const;

// Success messages
export const SUCCESS = {
  SUBSCRIPTION_CREATED: 'Successfully subscribed!',
  SUBSCRIPTION_RENEWED: 'Subscription renewed successfully.',
  MERCHANT_REGISTERED: 'Merchant registered successfully.',
  WITHDRAWAL_COMPLETE: 'Withdrawal completed successfully.',
  PRICE_UPDATED: 'Price updated successfully.',
  ROLE_GRANTED: 'Role granted successfully.',
  ROLE_REVOKED: 'Role revoked successfully.'
} as const;