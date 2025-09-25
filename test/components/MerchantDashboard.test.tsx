import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MerchantDashboard } from '../../src/components/MerchantDashboard'
import { createMockSdk } from '../utils/mockSdk'
import * as merchantHook from '../../src/hooks/useMerchant'

// Mock hooks
vi.mock('../../src/hooks/useMerchant')

describe('MerchantDashboard', () => {
  const mockSdk = createMockSdk()
  const merchantId = 1n
  const mockRefresh = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default merchant hook mock
    ;(merchantHook.useMerchant as any).mockReturnValue({
      merchant: {
        payoutAddress: '0x1234567890123456789012345678901234567890',
        subscriptionPeriod: 2592000n, // 30 days
        gracePeriod: 604800n, // 7 days
        isActive: true,
        totalSubscribers: 100n
      },
      balance: 5000000000000000000n, // 5 ETH
      isLoading: false,
      error: null,
      refresh: mockRefresh
    })

    // Mock SDK methods
    mockSdk.subscriptions.getSubscriptionPrice.mockResolvedValue(100000000000000000n) // 0.1 ETH
    mockSdk.analytics.getMerchantStatistics.mockResolvedValue({
      totalRevenue: 10000000000000000000n, // 10 ETH
      totalSubscribers: 100n,
      activeSubscriptions: 85n,
      churnRate: 15
    })
  })

  describe('Rendering', () => {
    it('renders merchant dashboard with header', async () => {
      render(<MerchantDashboard sdk={mockSdk} merchantId={merchantId} />)
      
      await waitFor(() => {
        expect(screen.getByText('Merchant Dashboard')).toBeInTheDocument()
        expect(screen.getByText(`Merchant #${merchantId.toString()}`)).toBeInTheDocument()
      })
    })

    it('displays merchant status badge', async () => {
      render(<MerchantDashboard sdk={mockSdk} merchantId={merchantId} />)
      
      await waitFor(() => {
        expect(screen.getByText(/Active/)).toBeInTheDocument()
      })
    })

    it('renders all stat cards', async () => {
      render(<MerchantDashboard sdk={mockSdk} merchantId={merchantId} />)
      
      await waitFor(() => {
        expect(screen.getByText('Total Revenue')).toBeInTheDocument()
        expect(screen.getByText('Active Subscribers')).toBeInTheDocument()
        expect(screen.getByText('Merchant Balance')).toBeInTheDocument()
        expect(screen.getByText('Subscription Period')).toBeInTheDocument()
      })
    })

    it('displays correct statistics values', async () => {
      render(<MerchantDashboard sdk={mockSdk} merchantId={merchantId} />)
      
      await waitFor(() => {
        expect(screen.getByText('10 ETH')).toBeInTheDocument() // Total revenue
        expect(screen.getByText('85')).toBeInTheDocument() // Active subscribers
        expect(screen.getByText('5 ETH')).toBeInTheDocument() // Balance
        expect(screen.getByText('30 days')).toBeInTheDocument() // Period
      })
    })
  })

  describe('Loading State', () => {
    it('shows loading skeleton when data is loading', () => {
      ;(merchantHook.useMerchant as any).mockReturnValue({
        merchant: null,
        balance: null,
        isLoading: true,
        error: null,
        refresh: mockRefresh
      })

      render(<MerchantDashboard sdk={mockSdk} merchantId={merchantId} />)
      
      // Should show loading skeleton
      const card = screen.getByRole('article')
      expect(card).toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('displays error message when loading fails', () => {
      const error = new Error('Failed to load merchant data')
      ;(merchantHook.useMerchant as any).mockReturnValue({
        merchant: null,
        balance: null,
        isLoading: false,
        error,
        refresh: mockRefresh
      })

      render(<MerchantDashboard sdk={mockSdk} merchantId={merchantId} />)
      
      expect(screen.getByText('Failed to load merchant dashboard')).toBeInTheDocument()
      expect(screen.getByText(error.message)).toBeInTheDocument()
    })

    it('shows retry button on error', () => {
      const error = new Error('Network error')
      ;(merchantHook.useMerchant as any).mockReturnValue({
        merchant: null,
        balance: null,
        isLoading: false,
        error,
        refresh: mockRefresh
      })

      render(<MerchantDashboard sdk={mockSdk} merchantId={merchantId} />)
      
      const retryButton = screen.getByRole('button', { name: /retry/i })
      expect(retryButton).toBeInTheDocument()
    })

    it('calls refresh when retry button is clicked', async () => {
      const error = new Error('Failed to fetch')
      ;(merchantHook.useMerchant as any).mockReturnValue({
        merchant: null,
        balance: null,
        isLoading: false,
        error,
        refresh: mockRefresh
      })

      render(<MerchantDashboard sdk={mockSdk} merchantId={merchantId} />)
      
      const retryButton = screen.getByRole('button', { name: /retry/i })
      fireEvent.click(retryButton)
      
      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled()
      })
    })
  })

  describe('Quick Actions', () => {
    it('renders quick actions section', async () => {
      render(<MerchantDashboard sdk={mockSdk} merchantId={merchantId} />)
      
      await waitFor(() => {
        expect(screen.getByText('Quick Actions')).toBeInTheDocument()
      })
    })

    it('shows withdraw balance button when balance > 0', async () => {
      render(<MerchantDashboard sdk={mockSdk} merchantId={merchantId} />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /withdraw balance/i })).toBeInTheDocument()
      })
    })

    it('hides withdraw button when balance is 0', async () => {
      ;(merchantHook.useMerchant as any).mockReturnValue({
        merchant: {
          payoutAddress: '0x123',
          subscriptionPeriod: 2592000n,
          gracePeriod: 604800n,
          isActive: true,
          totalSubscribers: 100n
        },
        balance: 0n,
        isLoading: false,
        error: null,
        refresh: mockRefresh
      })

      render(<MerchantDashboard sdk={mockSdk} merchantId={merchantId} />)
      
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /withdraw balance/i })).not.toBeInTheDocument()
      })
    })

    it('calls onAddSubscription when add button is clicked', async () => {
      const onAddSubscription = vi.fn()
      
      render(
        <MerchantDashboard 
          sdk={mockSdk} 
          merchantId={merchantId}
          onAddSubscription={onAddSubscription}
        />
      )
      
      await waitFor(() => {
        const button = screen.getByRole('button', { name: /add subscription plan/i })
        fireEvent.click(button)
        expect(onAddSubscription).toHaveBeenCalled()
      })
    })

    it('calls onViewAnalytics when analytics button is clicked', async () => {
      const onViewAnalytics = vi.fn()
      
      render(
        <MerchantDashboard 
          sdk={mockSdk} 
          merchantId={merchantId}
          onViewAnalytics={onViewAnalytics}
        />
      )
      
      await waitFor(() => {
        const button = screen.getByRole('button', { name: /view detailed analytics/i })
        fireEvent.click(button)
        expect(onViewAnalytics).toHaveBeenCalled()
      })
    })
  })

  describe('Merchant Details', () => {
    it('displays merchant details section', async () => {
      render(<MerchantDashboard sdk={mockSdk} merchantId={merchantId} />)
      
      await waitFor(() => {
        expect(screen.getByText('Merchant Details')).toBeInTheDocument()
      })
    })

    it('shows payout address', async () => {
      render(<MerchantDashboard sdk={mockSdk} merchantId={merchantId} />)
      
      await waitFor(() => {
        expect(screen.getByText('Payout Address')).toBeInTheDocument()
        // Address is formatted, so check for partial match
        expect(screen.getByText(/0x1234...7890/)).toBeInTheDocument()
      })
    })

    it('displays current price', async () => {
      render(<MerchantDashboard sdk={mockSdk} merchantId={merchantId} />)
      
      await waitFor(() => {
        expect(screen.getByText('Current Price')).toBeInTheDocument()
        expect(screen.getByText('0.1 ETH')).toBeInTheDocument()
      })
    })

    it('shows grace period in days', async () => {
      render(<MerchantDashboard sdk={mockSdk} merchantId={merchantId} />)
      
      await waitFor(() => {
        expect(screen.getByText('Grace Period')).toBeInTheDocument()
        expect(screen.getByText('7 days')).toBeInTheDocument()
      })
    })

    it('displays total subscribers count', async () => {
      render(<MerchantDashboard sdk={mockSdk} merchantId={merchantId} />)
      
      await waitFor(() => {
        expect(screen.getByText('Total Subscribers')).toBeInTheDocument()
        expect(screen.getByText('100')).toBeInTheDocument()
      })
    })
  })

  describe('Refresh Functionality', () => {
    it('renders refresh button', async () => {
      render(<MerchantDashboard sdk={mockSdk} merchantId={merchantId} />)
      
      await waitFor(() => {
        const refreshButtons = screen.getAllByRole('button')
        const refreshButton = refreshButtons.find(btn => 
          btn.querySelector('[class*="RefreshCw"]')
        )
        expect(refreshButton).toBeInTheDocument()
      })
    })

    it('calls refresh and updates analytics when refresh is clicked', async () => {
      render(<MerchantDashboard sdk={mockSdk} merchantId={merchantId} />)
      
      await waitFor(() => {
        const refreshButtons = screen.getAllByRole('button')
        const refreshButton = refreshButtons.find(btn => 
          btn.querySelector('[class*="RefreshCw"]')
        )
        
        fireEvent.click(refreshButton!)
      })
      
      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled()
        expect(mockSdk.analytics.getMerchantStatistics).toHaveBeenCalledTimes(2) // Initial + refresh
      })
    })

    it('disables refresh button while refreshing', async () => {
      mockRefresh.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      render(<MerchantDashboard sdk={mockSdk} merchantId={merchantId} />)
      
      await waitFor(() => {
        const refreshButtons = screen.getAllByRole('button')
        const refreshButton = refreshButtons.find(btn => 
          btn.querySelector('[class*="RefreshCw"]')
        )
        
        fireEvent.click(refreshButton!)
        expect(refreshButton).toBeDisabled()
      })
    })
  })

  describe('Header Actions', () => {
    it('renders edit button when onEditMerchant is provided', async () => {
      const onEditMerchant = vi.fn()
      
      render(
        <MerchantDashboard 
          sdk={mockSdk} 
          merchantId={merchantId}
          onEditMerchant={onEditMerchant}
        />
      )
      
      await waitFor(() => {
        const editButtons = screen.getAllByRole('button')
        const editButton = editButtons.find(btn => 
          btn.querySelector('[class*="Edit"]')
        )
        expect(editButton).toBeInTheDocument()
      })
    })

    it('calls onEditMerchant when edit button is clicked', async () => {
      const onEditMerchant = vi.fn()
      
      render(
        <MerchantDashboard 
          sdk={mockSdk} 
          merchantId={merchantId}
          onEditMerchant={onEditMerchant}
        />
      )
      
      await waitFor(() => {
        const editButtons = screen.getAllByRole('button')
        const editButton = editButtons.find(btn => 
          btn.querySelector('[class*="Edit"]')
        )
        
        fireEvent.click(editButton!)
        expect(onEditMerchant).toHaveBeenCalled()
      })
    })

    it('renders analytics button in header when onViewAnalytics is provided', async () => {
      const onViewAnalytics = vi.fn()
      
      render(
        <MerchantDashboard 
          sdk={mockSdk} 
          merchantId={merchantId}
          onViewAnalytics={onViewAnalytics}
        />
      )
      
      await waitFor(() => {
        const analyticsButtons = screen.getAllByRole('button')
        const analyticsButton = analyticsButtons.find(btn => 
          btn.querySelector('[class*="BarChart3"]')
        )
        expect(analyticsButton).toBeInTheDocument()
      })
    })
  })

  it('handles null SDK gracefully', async () => {
    render(<MerchantDashboard sdk={null} merchantId={merchantId} />)
    
    // Should still render but with limited functionality
    await waitFor(() => {
      expect(screen.getByText('Merchant Dashboard')).toBeInTheDocument()
    })
  })

  it('applies custom className', async () => {
    render(
      <MerchantDashboard 
        sdk={mockSdk} 
        merchantId={merchantId}
        className="custom-dashboard-class"
      />
    )
    
    await waitFor(() => {
      const wrapper = document.querySelector('.custom-dashboard-class')
      expect(wrapper).toBeInTheDocument()
    })
  })

  it('shows inactive status when merchant is not active', async () => {
    ;(merchantHook.useMerchant as any).mockReturnValue({
      merchant: {
        payoutAddress: '0x123',
        subscriptionPeriod: 2592000n,
        gracePeriod: 604800n,
        isActive: false,
        totalSubscribers: 0n
      },
      balance: 0n,
      isLoading: false,
      error: null,
      refresh: mockRefresh
    })

    render(<MerchantDashboard sdk={mockSdk} merchantId={merchantId} />)
    
    await waitFor(() => {
      expect(screen.getByText(/Inactive/)).toBeInTheDocument()
    })
  })
})