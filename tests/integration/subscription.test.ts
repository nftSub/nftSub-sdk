import { describe, it, expect, beforeAll } from 'vitest';
import { SubscriptionSDK } from '@/core/SubscriptionSDK';
import { parseEther, zeroAddress } from 'viem';

// Test with the provided private key for merchant operations
const PRIVATE_KEY = '0xdfe9a1d1c29b40417ee15201f33240236c1750f4ce60fe32ba809a673ab24f99';

describe('Subscription Integration Tests', () => {
  let sdk: SubscriptionSDK;
  let merchantAddress: `0x${string}`;

  beforeAll(() => {
    sdk = new SubscriptionSDK({
      chain: 'sepolia',
      privateKey: PRIVATE_KEY as `0x${string}`
    });
    
    merchantAddress = sdk.getAddress()!;
    console.log('Testing with address:', merchantAddress);
  });

  describe('Merchant Operations', () => {
    it('should check if address is a merchant', async () => {
      const isMerchant = await sdk.merchants.isMerchant(merchantAddress);
      console.log('Is merchant:', isMerchant);
      expect(typeof isMerchant).toBe('boolean');
    });

    it('should get merchant count', async () => {
      const count = await sdk.merchants.getMerchantCount();
      console.log('Total merchants:', count);
      expect(count).toBeGreaterThanOrEqual(0n);
    });

    it('should get merchant plans', async () => {
      const count = await sdk.merchants.getMerchantCount();
      if (count > 0n) {
        // Get the first merchant plan
        const plan = await sdk.merchants.getMerchantPlan(1n);
        console.log('Merchant plan:', plan);
        expect(plan).toBeDefined();
        expect(plan.owner).toBeDefined();
      }
    });
  });

  describe('Subscription Reading', () => {
    it('should check subscription status', async () => {
      const isActive = await sdk.checkAccess(1n, merchantAddress);
      console.log('Has active subscription:', isActive);
      expect(typeof isActive).toBe('boolean');
    });

    it('should get subscription price', async () => {
      const price = await sdk.subscriptions.getSubscriptionPrice(1n, zeroAddress);
      console.log('Subscription price in ETH:', price);
      expect(price).toBeGreaterThanOrEqual(0n);
    });

    it('should get subscription status details', async () => {
      const status = await sdk.subscriptions.getSubscriptionStatus(merchantAddress, 1n);
      console.log('Subscription status:', status);
      expect(status).toBeDefined();
      expect(status.expiresAt).toBeDefined();
    });
  });

  describe('NFT Operations', () => {
    it('should check NFT balance', async () => {
      const balance = await sdk.nfts.getBalance(merchantAddress, 1n);
      console.log('NFT balance for merchant 1:', balance);
      expect(balance).toBeGreaterThanOrEqual(0n);
    });

    it('should check if subscription is active', async () => {
      const isActive = await sdk.nfts.isSubscriptionActive(merchantAddress, 1n);
      console.log('NFT subscription active:', isActive);
      expect(typeof isActive).toBe('boolean');
    });

    it('should support ERC1155 interface', async () => {
      const supportsERC1155 = await sdk.nfts.supportsInterface('0xd9b67a26');
      console.log('Supports ERC1155:', supportsERC1155);
      expect(supportsERC1155).toBe(true);
    });
  });

  describe('Token Operations', () => {
    it('should get supported tokens', () => {
      const tokens = sdk.tokens.getSupportedTokens();
      console.log('Supported tokens:', tokens);
      expect(tokens).toHaveLength(2); // ETH and SUBTEST
      expect(tokens[0].symbol).toBe('ETH');
    });

    it('should check ETH balance', async () => {
      const balance = await sdk.tokens.getBalance(zeroAddress, merchantAddress);
      console.log('ETH balance:', sdk.formatAmount(balance, 18));
      expect(balance).toBeGreaterThanOrEqual(0n);
    });

    it('should format and parse amounts', () => {
      const amount = parseEther('1.5');
      const formatted = sdk.tokens.formatTokenAmount(amount, 18);
      console.log('Formatted 1.5 ETH:', formatted);
      expect(formatted).toBe('1.5');
      
      const parsed = sdk.tokens.parseTokenAmount('2.5', 18);
      expect(parsed).toBe(parseEther('2.5'));
    });
  });

  describe('Analytics', () => {
    it('should get total subscriptions', async () => {
      const total = await sdk.analytics.getTotalSubscriptions();
      console.log('Total subscriptions:', total);
      expect(total).toBeGreaterThanOrEqual(0n);
    });

    it('should get merchant statistics', async () => {
      const stats = await sdk.analytics.getMerchantStatistics(1n);
      console.log('Merchant 1 statistics:', stats);
      expect(stats).toBeDefined();
      expect(stats.totalRevenue).toBeGreaterThanOrEqual(0n);
      expect(stats.activeSubscriptions).toBeGreaterThanOrEqual(0n);
    });

    it('should get platform statistics', async () => {
      const stats = await sdk.analytics.getPlatformStatistics();
      console.log('Platform statistics:', stats);
      expect(stats).toBeDefined();
      expect(stats.totalMerchants).toBeGreaterThanOrEqual(0n);
      expect(stats.totalSubscriptions).toBeGreaterThanOrEqual(0n);
    });
  });

  describe('Reactive Network', () => {
    it('should check if reactive contract has role', async () => {
      const hasRole = await sdk.reactive.hasReactiveRole();
      console.log('Reactive contract has REACTIVE_ROLE:', hasRole);
      expect(typeof hasRole).toBe('boolean');
    });

    it('should get reactive configuration', async () => {
      const config = await sdk.reactive.getReactiveConfig();
      console.log('Reactive config:', config);
      expect(config.subscriptionManager).toBeDefined();
      expect(config.subscriptionNFT).toBeDefined();
      expect(config.targetChainId).toBe(11155111n); // Sepolia
    });

    it('should calculate subscription costs', () => {
      const costPerHour = sdk.reactive.calculateSubscriptionCost({
        duration: 'hour',
        eventType: 'payment'
      });
      console.log('Cost per hour for payment events:', costPerHour);
      expect(costPerHour).toBeGreaterThan(0n);
      
      const costPerMonth = sdk.reactive.calculateSubscriptionCost({
        duration: 'month',
        eventType: 'cron'
      });
      console.log('Cost per month for CRON:', costPerMonth);
      expect(costPerMonth).toBeGreaterThan(costPerHour);
    });
  });
});