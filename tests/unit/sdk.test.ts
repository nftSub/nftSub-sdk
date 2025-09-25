import { describe, it, expect, beforeEach } from 'vitest';
import { SubscriptionSDK } from '@/core/SubscriptionSDK';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';

describe('SubscriptionSDK', () => {
  let sdk: SubscriptionSDK;

  beforeEach(() => {
    sdk = new SubscriptionSDK({
      chain: 'sepolia',
      readOnly: true
    });
  });

  describe('Initialization', () => {
    it('should initialize with read-only mode', () => {
      expect(sdk).toBeDefined();
      expect(sdk.isConnected()).toBe(false);
      expect(sdk.publicClient).toBeDefined();
    });

    it('should have correct chain configuration', () => {
      expect(sdk.getChainId()).toBe(11155111);
      const contracts = sdk.getContracts();
      expect(contracts.subscriptionManager).toBeDefined();
      expect(contracts.subscriptionNFT).toBeDefined();
    });

    it('should initialize all services', () => {
      expect(sdk.merchants).toBeDefined();
      expect(sdk.subscriptions).toBeDefined();
      expect(sdk.tokens).toBeDefined();
      expect(sdk.nfts).toBeDefined();
      expect(sdk.events).toBeDefined();
      expect(sdk.analytics).toBeDefined();
      expect(sdk.admin).toBeDefined();
      expect(sdk.reactive).toBeDefined();
    });
  });

  describe('Utility Methods', () => {
    it('should format token amounts correctly', () => {
      const amount = 1000000000000000000n; // 1 token with 18 decimals
      const formatted = sdk.formatAmount(amount, 18);
      expect(formatted).toBe('1');
    });

    it('should parse token amounts correctly', () => {
      const parsed = sdk.parseAmount('1.5', 18);
      expect(parsed).toBe(1500000000000000000n);
    });
  });

  describe('Read-Only Operations', () => {
    it('should throw error when trying to subscribe without wallet', async () => {
      await expect(sdk.subscribe(1n)).rejects.toThrow('Wallet not connected');
    });

    it('should throw error when trying to withdraw without wallet', async () => {
      await expect(sdk.withdrawMerchantBalance(1n)).rejects.toThrow('Wallet not connected');
    });
  });
});