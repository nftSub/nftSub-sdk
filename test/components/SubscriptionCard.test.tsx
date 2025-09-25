import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SubscriptionCard } from '../../src/components/SubscriptionCard'
import { createMockSdk } from '../utils/mockSdk'
import * as subscriptionHook from '../../src/hooks/useSubscription'
import * as merchantHook from '../../src/hooks/useMerchant'

// Mock hooks
vi.mock('../../src/hooks/useSubscription')
vi.mock('../../src/hooks/useMerchant')

describe('SubscriptionCard', () => {
  const mockSdk = createMockSdk()
  const merchantId = 1n

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default hook mocks
    ;(subscriptionHook.useSubscription as any).mockReturnValue({
      status: null,
      isActive: false,
      isLoading: false,
      error: null,
      subscribe: vi.fn().mockResolvedValue('0xhash')
    })
    
    ;(merchantHook.useMerchant as any).mockReturnValue({
      merchant: {
        payoutAddress: '0x123',
        subscriptionPeriod: 2592000n,
        gracePeriod: 604800n,
        isActive: true,
        totalSubscribers: 100n
      },
      balance: 1000000000000000000n,
      isLoading: false,
      error: null,
      refresh: vi.fn()
    })

    // Mock SDK methods for fetching price and analytics
    mockSdk.subscriptions.getSubscriptionPrice.mockResolvedValue(100000000000000000n)
    mockSdk.analytics.getMerchantStatistics.mockResolvedValue({
      totalRevenue: 10000000000000000000n,
      totalSubscribers: 100n,
      activeSubscriptions: 85n,
      churnRate: 15
    })
  })

  it('renders loading state correctly', () => {
    ;(merchantHook.useMerchant as any).mockReturnValue({
      merchant: null,
      balance: null,
      isLoading: true,
      error: null,
      refresh: vi.fn()
    })

    render(<SubscriptionCard sdk={mockSdk} merchantId={merchantId} />)
    
    // Should show loading skeleton
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('renders error state with retry button', () => {
    const error = new Error('Failed to load merchant')
    ;(merchantHook.useMerchant as any).mockReturnValue({
      merchant: null,
      balance: null,
      isLoading: false,
      error,
      refresh: vi.fn()
    })

    render(<SubscriptionCard sdk={mockSdk} merchantId={merchantId} />)
    
    expect(screen.getByText('Failed to load merchant data')).toBeInTheDocument()
    expect(screen.getByText(error.message)).toBeInTheDocument()
  })

  it('renders merchant information correctly', async () => {
    render(<SubscriptionCard sdk={mockSdk} merchantId={merchantId} />)
    
    await waitFor(() => {
      expect(screen.getByText(`Merchant #${merchantId.toString()}`)).toBeInTheDocument()
      expect(screen.getByText(/Active/)).toBeInTheDocument()
      expect(screen.getByText(/100 subscribers/)).toBeInTheDocument()
    })
  })

  it('shows subscription price when loaded', async () => {
    render(<SubscriptionCard sdk={mockSdk} merchantId={merchantId} />)
    
    await waitFor(() => {
      // Price should be formatted and displayed
      expect(screen.getByText(/0\.1 ETH/)).toBeInTheDocument()
    })
  })

  it('shows active subscription badge when user is subscribed', () => {
    ;(subscriptionHook.useSubscription as any).mockReturnValue({
      status: { isActive: true, expiryTime: 1234567890n, tokenId: 1n },
      isActive: true,
      isLoading: false,
      error: null,
      subscribe: vi.fn()
    })

    render(<SubscriptionCard sdk={mockSdk} merchantId={merchantId} />)
    
    expect(screen.getByRole('button')).toHaveTextContent('Active')
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renders compact variant correctly', () => {
    render(
      <SubscriptionCard 
        sdk={mockSdk} 
        merchantId={merchantId}
        variant="compact"
      />
    )
    
    // Compact variant should show less information
    expect(screen.getByText(`Merchant #${merchantId.toString()}`)).toBeInTheDocument()
  })

  it('renders detailed variant with analytics', async () => {
    render(
      <SubscriptionCard 
        sdk={mockSdk} 
        merchantId={merchantId}
        variant="detailed"
      />
    )
    
    await waitFor(() => {
      // Detailed variant should show analytics
      expect(screen.getByText('100')).toBeInTheDocument() // Total subscribers
      expect(screen.getByText('85')).toBeInTheDocument() // Active subscriptions
      expect(screen.getByText('Revenue')).toBeInTheDocument()
    })
  })

  it('hides pricing when showPricing is false', async () => {
    render(
      <SubscriptionCard 
        sdk={mockSdk} 
        merchantId={merchantId}
        showPricing={false}
      />
    )
    
    await waitFor(() => {
      expect(screen.queryByText('Price')).not.toBeInTheDocument()
    })
  })

  it('hides status when showStatus is false', () => {
    render(
      <SubscriptionCard 
        sdk={mockSdk} 
        merchantId={merchantId}
        showStatus={false}
      />
    )
    
    expect(screen.queryByText('Subscribe')).not.toBeInTheDocument()
  })

  it('hides actions when showActions is false', () => {
    render(
      <SubscriptionCard 
        sdk={mockSdk} 
        merchantId={merchantId}
        showActions={false}
      />
    )
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onSubscribe when subscription succeeds', async () => {
    const onSubscribe = vi.fn()
    const mockSubscribe = vi.fn().mockResolvedValue('0xhash')
    
    ;(subscriptionHook.useSubscription as any).mockReturnValue({
      status: null,
      isActive: false,
      isLoading: false,
      error: null,
      subscribe: mockSubscribe
    })

    render(
      <SubscriptionCard 
        sdk={mockSdk} 
        merchantId={merchantId}
        onSubscribe={onSubscribe}
      />
    )
    
    const button = screen.getByRole('button', { name: /subscribe/i })
    button.click()
    
    await waitFor(() => {
      expect(onSubscribe).toHaveBeenCalled()
    })
  })

  it('handles null SDK gracefully', () => {
    render(<SubscriptionCard sdk={null} merchantId={merchantId} />)
    
    // Should render but functionality will be limited
    expect(screen.getByRole('article')).toBeInTheDocument()
  })
})