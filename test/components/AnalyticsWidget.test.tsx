import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AnalyticsWidget } from '../../src/components/AnalyticsWidget'
import { createMockSdk } from '../utils/mockSdk'
import * as merchantHook from '../../src/hooks/useMerchant'

// Mock hooks
vi.mock('../../src/hooks/useMerchant')

describe('AnalyticsWidget', () => {
  const mockSdk = createMockSdk()
  const merchantId = 1n

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default merchant hook mock
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

    // Mock analytics methods
    mockSdk.analytics.getMerchantStatistics.mockResolvedValue({
      totalRevenue: 10000000000000000000n,
      totalSubscribers: 100n,
      activeSubscriptions: 85n,
      churnRate: 15
    })

    mockSdk.analytics.getPlatformStatistics.mockResolvedValue({
      totalVolume: 100000000000000000000n,
      totalMerchants: 10n,
      totalSubscriptions: 1000n,
      activeSubscriptions: 850n
    })
  })

  describe('Merchant Variant', () => {
    it('renders merchant analytics correctly', async () => {
      render(
        <AnalyticsWidget 
          sdk={mockSdk} 
          merchantId={merchantId}
          variant="merchant"
        />
      )
      
      await waitFor(() => {
        expect(screen.getByText('Merchant Analytics')).toBeInTheDocument()
        expect(screen.getByText(`Merchant #${merchantId.toString()}`)).toBeInTheDocument()
        expect(screen.getByText('Total Revenue')).toBeInTheDocument()
        expect(screen.getByText('Active Subscribers')).toBeInTheDocument()
      })
    })

    it('displays merchant statistics', async () => {
      render(
        <AnalyticsWidget 
          sdk={mockSdk} 
          merchantId={merchantId}
          variant="merchant"
        />
      )
      
      await waitFor(() => {
        expect(screen.getByText('85')).toBeInTheDocument() // Active subscriptions
        expect(screen.getByText('100')).toBeInTheDocument() // Total subscribers
      })
    })
  })

  describe('Platform Variant', () => {
    it('renders platform analytics correctly', async () => {
      render(
        <AnalyticsWidget 
          sdk={mockSdk}
          variant="platform"
        />
      )
      
      await waitFor(() => {
        expect(screen.getByText('Platform Analytics')).toBeInTheDocument()
        expect(screen.getByText('Overall platform metrics')).toBeInTheDocument()
        expect(screen.getByText('Total Volume')).toBeInTheDocument()
        expect(screen.getByText('Total Merchants')).toBeInTheDocument()
      })
    })

    it('displays platform statistics', async () => {
      render(
        <AnalyticsWidget 
          sdk={mockSdk}
          variant="platform"
        />
      )
      
      await waitFor(() => {
        expect(screen.getByText('10')).toBeInTheDocument() // Total merchants
        expect(screen.getByText('1000')).toBeInTheDocument() // Total subscriptions
      })
    })
  })

  describe('Time Range Selection', () => {
    it('renders time range buttons', () => {
      render(<AnalyticsWidget sdk={mockSdk} />)
      
      expect(screen.getByRole('button', { name: '7 Days' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '30 Days' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '90 Days' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '1 Year' })).toBeInTheDocument()
    })

    it('highlights selected time range', () => {
      render(
        <AnalyticsWidget 
          sdk={mockSdk}
          timeRange="7d"
        />
      )
      
      const button = screen.getByRole('button', { name: '7 Days' })
      expect(button).toHaveClass('bg-white', 'shadow-sm')
    })

    it('calls onTimeRangeChange when time range is selected', () => {
      const onTimeRangeChange = vi.fn()
      
      render(
        <AnalyticsWidget 
          sdk={mockSdk}
          onTimeRangeChange={onTimeRangeChange}
        />
      )
      
      fireEvent.click(screen.getByRole('button', { name: '90 Days' }))
      expect(onTimeRangeChange).toHaveBeenCalledWith('90d')
    })
  })

  describe('Loading and Error States', () => {
    it('shows loading state', () => {
      ;(merchantHook.useMerchant as any).mockReturnValue({
        merchant: null,
        balance: null,
        isLoading: true,
        error: null,
        refresh: vi.fn()
      })

      render(<AnalyticsWidget sdk={mockSdk} merchantId={merchantId} />)
      
      // Should show loading skeletons
      const card = screen.getByRole('article')
      expect(card).toBeInTheDocument()
    })

    it('shows error state with retry button', () => {
      const error = new Error('Failed to fetch analytics')
      ;(merchantHook.useMerchant as any).mockReturnValue({
        merchant: null,
        balance: null,
        isLoading: false,
        error,
        refresh: vi.fn()
      })

      render(<AnalyticsWidget sdk={mockSdk} merchantId={merchantId} />)
      
      expect(screen.getByText('Failed to load analytics')).toBeInTheDocument()
      expect(screen.getByText(error.message)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })

    it('retries loading when retry button is clicked', async () => {
      const mockRefresh = vi.fn()
      const error = new Error('Network error')
      
      ;(merchantHook.useMerchant as any).mockReturnValue({
        merchant: null,
        balance: null,
        isLoading: false,
        error,
        refresh: mockRefresh
      })

      render(<AnalyticsWidget sdk={mockSdk} merchantId={merchantId} />)
      
      const retryButton = screen.getByRole('button', { name: /retry/i })
      fireEvent.click(retryButton)
      
      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled()
      })
    })
  })

  describe('Refresh Functionality', () => {
    it('renders refresh button', () => {
      render(<AnalyticsWidget sdk={mockSdk} />)
      
      const refreshButtons = screen.getAllByRole('button')
      const refreshButton = refreshButtons.find(btn => 
        btn.querySelector('[class*="RefreshCw"]')
      )
      expect(refreshButton).toBeInTheDocument()
    })

    it('refreshes data when refresh button is clicked', async () => {
      const mockRefresh = vi.fn()
      ;(merchantHook.useMerchant as any).mockReturnValue({
        merchant: {
          isActive: true,
          totalSubscribers: 100n
        },
        balance: 1000000000000000000n,
        isLoading: false,
        error: null,
        refresh: mockRefresh
      })

      render(<AnalyticsWidget sdk={mockSdk} merchantId={merchantId} />)
      
      const refreshButtons = screen.getAllByRole('button')
      const refreshButton = refreshButtons.find(btn => 
        btn.querySelector('[class*="RefreshCw"]')
      )
      
      fireEvent.click(refreshButton!)
      
      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled()
        expect(mockSdk.analytics.getMerchantStatistics).toHaveBeenCalled()
      })
    })
  })

  it('handles null SDK gracefully', () => {
    render(<AnalyticsWidget sdk={null} />)
    
    // Should render but with loading state
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('auto-determines variant based on merchantId', () => {
    render(
      <AnalyticsWidget 
        sdk={mockSdk}
        merchantId={merchantId}
      />
    )
    
    expect(screen.getByText('Merchant Analytics')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <AnalyticsWidget 
        sdk={mockSdk}
        className="custom-analytics-class"
      />
    )
    
    const wrapper = document.querySelector('.custom-analytics-class')
    expect(wrapper).toBeInTheDocument()
  })
})