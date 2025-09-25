import { vi } from 'vitest'
import type { SubscriptionSDK } from '../../src'

export const createMockSdk = (overrides: Partial<SubscriptionSDK> = {}): SubscriptionSDK => {
  const mockSdk = {
    isConnected: vi.fn().mockReturnValue(true),
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn(),
    getAddress: vi.fn().mockReturnValue('0x1234567890123456789012345678901234567890'),
    getChain: vi.fn().mockReturnValue({ id: 11155111, name: 'Sepolia' }),
    subscribe: vi.fn().mockResolvedValue('0xhash'),
    checkAccess: vi.fn().mockResolvedValue(false),
    waitForTransaction: vi.fn().mockResolvedValue(undefined),
    on: vi.fn(),
    off: vi.fn(),
    merchants: {
      registerMerchant: vi.fn().mockResolvedValue({ hash: '0xhash', merchantId: 1n }),
      updateMerchantPlan: vi.fn().mockResolvedValue('0xhash'),
      setMerchantPrice: vi.fn().mockResolvedValue('0xhash'),
      getMerchantPlan: vi.fn().mockResolvedValue({
        payoutAddress: '0x1234567890123456789012345678901234567890',
        subscriptionPeriod: 2592000n,
        gracePeriod: 604800n,
        isActive: true,
        totalSubscribers: 100n
      }),
      getMerchantBalance: vi.fn().mockResolvedValue(1000000000000000000n),
      withdrawMerchantBalance: vi.fn().mockResolvedValue('0xhash'),
      getMerchantPrice: vi.fn().mockResolvedValue(100000000000000000n),
      isMerchant: vi.fn().mockResolvedValue(true),
      getMerchantCount: vi.fn().mockResolvedValue(10n)
    },
    subscriptions: {
      subscribe: vi.fn().mockResolvedValue('0xhash'),
      getSubscriptionStatus: vi.fn().mockResolvedValue({
        isActive: false,
        expiryTime: 0n,
        tokenId: 0n
      }),
      getSubscriptionPrice: vi.fn().mockResolvedValue(100000000000000000n),
      checkUserAccess: vi.fn().mockResolvedValue(false),
      getUserActiveSubscriptions: vi.fn().mockResolvedValue([]),
      getTokenMetadata: vi.fn().mockResolvedValue({
        name: 'Subscription',
        description: 'Active subscription',
        image: 'https://example.com/image.png',
        attributes: []
      })
    },
    analytics: {
      getMerchantStatistics: vi.fn().mockResolvedValue({
        totalRevenue: 10000000000000000000n,
        totalSubscribers: 100n,
        activeSubscriptions: 85n,
        churnRate: 15
      }),
      getPlatformStatistics: vi.fn().mockResolvedValue({
        totalVolume: 100000000000000000000n,
        totalMerchants: 10n,
        totalSubscriptions: 1000n,
        activeSubscriptions: 850n
      }),
      getSubscriptionHistory: vi.fn().mockResolvedValue([]),
      getMerchantRevenue: vi.fn().mockResolvedValue(10000000000000000000n),
      getTopMerchants: vi.fn().mockResolvedValue([]),
      getTotalSubscriptions: vi.fn().mockResolvedValue(1000n)
    },
    ...overrides
  } as SubscriptionSDK

  return mockSdk
}