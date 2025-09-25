import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SubscriptionModal } from '../../src/components/SubscriptionModal'
import { createMockSdk } from '../utils/mockSdk'
import * as subscriptionHook from '../../src/hooks/useSubscription'
import * as merchantHook from '../../src/hooks/useMerchant'

// Mock hooks
vi.mock('../../src/hooks/useSubscription')
vi.mock('../../src/hooks/useMerchant')

describe('SubscriptionModal', () => {
  const mockSdk = createMockSdk()
  const merchantId = 1n
  const mockSubscribe = vi.fn()
  const onClose = vi.fn()
  const onSuccess = vi.fn()
  const onError = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default hook mocks
    ;(subscriptionHook.useSubscription as any).mockReturnValue({
      status: null,
      isActive: false,
      isLoading: false,
      error: null,
      subscribe: mockSubscribe
    })
    
    ;(merchantHook.useMerchant as any).mockReturnValue({
      merchant: {
        payoutAddress: '0x1234567890123456789012345678901234567890',
        subscriptionPeriod: 2592000n, // 30 days
        gracePeriod: 604800n, // 7 days
        isActive: true,
        totalSubscribers: 100n
      },
      balance: 1000000000000000000n, // 1 ETH
      isLoading: false,
      error: null,
      refresh: vi.fn()
    })

    // Mock SDK methods
    mockSdk.subscriptions.getSubscriptionPrice.mockResolvedValue(100000000000000000n) // 0.1 ETH
    mockSdk.analytics.getMerchantStatistics.mockResolvedValue({
      totalRevenue: 10000000000000000000n, // 10 ETH
      totalSubscribers: 100n,
      activeSubscriptions: 85n,
      churnRate: 15
    })
    mockSdk.isConnected.mockReturnValue(true)
    mockSdk.getAddress.mockReturnValue('0x1234567890123456789012345678901234567890')
  })

  describe('Modal Visibility', () => {
    it('renders nothing when isOpen is false', () => {
      const { container } = render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={false}
          onClose={onClose}
        />
      )
      
      expect(container.firstChild).toBeNull()
    })

    it('renders modal when isOpen is true', () => {
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={true}
          onClose={onClose}
        />
      )
      
      expect(screen.getByText(/Subscribe to Merchant/)).toBeInTheDocument()
    })
  })

  describe('Modal Header', () => {
    it('displays merchant ID in header', () => {
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={true}
          onClose={onClose}
        />
      )
      
      expect(screen.getByText(`Subscribe to Merchant #${merchantId.toString()}`)).toBeInTheDocument()
    })

    it('renders close button', () => {
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={true}
          onClose={onClose}
        />
      )
      
      const closeButtons = screen.getAllByRole('button')
      const closeButton = closeButtons.find(btn => 
        btn.querySelector('[class*="X"]') || btn.querySelector('svg')
      )
      expect(closeButton).toBeInTheDocument()
    })

    it('calls onClose when close button is clicked', () => {
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={true}
          onClose={onClose}
        />
      )
      
      const closeButtons = screen.getAllByRole('button')
      const closeButton = closeButtons.find(btn => 
        btn.querySelector('[class*="X"]') || btn.querySelector('svg')
      )
      
      fireEvent.click(closeButton!)
      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('Progress Steps', () => {
    it('displays all progress steps', () => {
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={true}
          onClose={onClose}
        />
      )
      
      expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
      expect(screen.getByText('Select Plan')).toBeInTheDocument()
      expect(screen.getByText('Confirm')).toBeInTheDocument()
      expect(screen.getByText('Processing')).toBeInTheDocument()
    })

    it('shows connect step initially', () => {
      mockSdk.isConnected.mockReturnValue(false)
      
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={true}
          onClose={onClose}
        />
      )
      
      expect(screen.getByText('Connect Your Wallet')).toBeInTheDocument()
    })

    it('auto-advances to select step when wallet is connected', () => {
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={true}
          onClose={onClose}
        />
      )
      
      const button = screen.getByRole('button', { name: /Wallet Connected/i })
      fireEvent.click(button)
      
      expect(screen.getByText('Choose Your Plan')).toBeInTheDocument()
    })
  })

  describe('Select Plan Step', () => {
    beforeEach(() => {
      mockSdk.isConnected.mockReturnValue(true)
    })

    it('displays plan details', async () => {
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={true}
          onClose={onClose}
        />
      )
      
      // Click to advance to select step
      const connectButton = screen.getByRole('button', { name: /Wallet Connected/i })
      fireEvent.click(connectButton)
      
      await waitFor(() => {
        expect(screen.getByText('Choose Your Plan')).toBeInTheDocument()
        expect(screen.getByText(`Merchant #${merchantId.toString()}`)).toBeInTheDocument()
        expect(screen.getByText('0.1 ETH')).toBeInTheDocument() // Price
      })
    })

    it('shows active subscriber count', async () => {
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={true}
          onClose={onClose}
        />
      )
      
      const connectButton = screen.getByRole('button', { name: /Wallet Connected/i })
      fireEvent.click(connectButton)
      
      await waitFor(() => {
        expect(screen.getByText('85 Active')).toBeInTheDocument()
      })
    })

    it('displays payment token', async () => {
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          paymentToken="ETH"
          isOpen={true}
          onClose={onClose}
        />
      )
      
      const connectButton = screen.getByRole('button', { name: /Wallet Connected/i })
      fireEvent.click(connectButton)
      
      await waitFor(() => {
        expect(screen.getByText('ETH')).toBeInTheDocument()
      })
    })

    it('advances to confirm step when continue is clicked', async () => {
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={true}
          onClose={onClose}
        />
      )
      
      const connectButton = screen.getByRole('button', { name: /Wallet Connected/i })
      fireEvent.click(connectButton)
      
      await waitFor(() => {
        const continueButton = screen.getByRole('button', { name: /Continue to Payment/i })
        fireEvent.click(continueButton)
      })
      
      expect(screen.getByText('Confirm Subscription')).toBeInTheDocument()
    })
  })

  describe('Confirm Step', () => {
    const navigateToConfirm = async () => {
      const connectButton = screen.getByRole('button', { name: /Wallet Connected/i })
      fireEvent.click(connectButton)
      
      await waitFor(() => {
        const continueButton = screen.getByRole('button', { name: /Continue to Payment/i })
        fireEvent.click(continueButton)
      })
    }

    it('displays subscription summary', async () => {
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={true}
          onClose={onClose}
        />
      )
      
      await navigateToConfirm()
      
      expect(screen.getByText('Confirm Subscription')).toBeInTheDocument()
      expect(screen.getByText(`Merchant #${merchantId.toString()}`)).toBeInTheDocument()
      expect(screen.getByText('Total')).toBeInTheDocument()
    })

    it('can go back to select step', async () => {
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={true}
          onClose={onClose}
        />
      )
      
      await navigateToConfirm()
      
      const backButton = screen.getByRole('button', { name: /Back/i })
      fireEvent.click(backButton)
      
      expect(screen.getByText('Choose Your Plan')).toBeInTheDocument()
    })

    it('calls subscribe when confirm is clicked', async () => {
      mockSubscribe.mockResolvedValue('0xhash123')
      
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={true}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      )
      
      await navigateToConfirm()
      
      const confirmButton = screen.getByRole('button', { name: /Confirm & Subscribe/i })
      fireEvent.click(confirmButton)
      
      await waitFor(() => {
        expect(mockSubscribe).toHaveBeenCalledWith('ETH')
      })
    })
  })

  describe('Processing Step', () => {
    it('shows processing state during subscription', async () => {
      mockSubscribe.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('0xhash'), 100)))
      
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={true}
          onClose={onClose}
        />
      )
      
      // Navigate to confirm
      const connectButton = screen.getByRole('button', { name: /Wallet Connected/i })
      fireEvent.click(connectButton)
      
      await waitFor(() => {
        const continueButton = screen.getByRole('button', { name: /Continue to Payment/i })
        fireEvent.click(continueButton)
      })
      
      const confirmButton = screen.getByRole('button', { name: /Confirm & Subscribe/i })
      fireEvent.click(confirmButton)
      
      await waitFor(() => {
        expect(screen.getByText('Processing Subscription')).toBeInTheDocument()
      })
    })
  })

  describe('Success State', () => {
    it('shows success message after subscription', async () => {
      mockSubscribe.mockResolvedValue('0xhash123')
      
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={true}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      )
      
      // Navigate to confirm
      const connectButton = screen.getByRole('button', { name: /Wallet Connected/i })
      fireEvent.click(connectButton)
      
      await waitFor(() => {
        const continueButton = screen.getByRole('button', { name: /Continue to Payment/i })
        fireEvent.click(continueButton)
      })
      
      const confirmButton = screen.getByRole('button', { name: /Confirm & Subscribe/i })
      fireEvent.click(confirmButton)
      
      await waitFor(() => {
        expect(screen.getByText('Subscription Successful!')).toBeInTheDocument()
      })
    })

    it('displays transaction hash', async () => {
      const txHash = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
      mockSubscribe.mockResolvedValue(txHash)
      
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={true}
          onClose={onClose}
        />
      )
      
      // Navigate and subscribe
      const connectButton = screen.getByRole('button', { name: /Wallet Connected/i })
      fireEvent.click(connectButton)
      
      await waitFor(() => {
        const continueButton = screen.getByRole('button', { name: /Continue to Payment/i })
        fireEvent.click(continueButton)
      })
      
      const confirmButton = screen.getByRole('button', { name: /Confirm & Subscribe/i })
      fireEvent.click(confirmButton)
      
      await waitFor(() => {
        expect(screen.getByText(/0xabcdef12.*34567890/)).toBeInTheDocument()
      })
    })

    it('calls onSuccess callback', async () => {
      const txHash = '0xhash123'
      mockSubscribe.mockResolvedValue(txHash)
      
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={true}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      )
      
      // Navigate and subscribe
      const connectButton = screen.getByRole('button', { name: /Wallet Connected/i })
      fireEvent.click(connectButton)
      
      await waitFor(() => {
        const continueButton = screen.getByRole('button', { name: /Continue to Payment/i })
        fireEvent.click(continueButton)
      })
      
      const confirmButton = screen.getByRole('button', { name: /Confirm & Subscribe/i })
      fireEvent.click(confirmButton)
      
      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith(txHash)
      })
    })
  })

  describe('Error State', () => {
    it('shows error message when subscription fails', async () => {
      const error = new Error('Transaction rejected')
      mockSubscribe.mockRejectedValue(error)
      
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={true}
          onClose={onClose}
          onError={onError}
        />
      )
      
      // Navigate to confirm
      const connectButton = screen.getByRole('button', { name: /Wallet Connected/i })
      fireEvent.click(connectButton)
      
      await waitFor(() => {
        const continueButton = screen.getByRole('button', { name: /Continue to Payment/i })
        fireEvent.click(continueButton)
      })
      
      const confirmButton = screen.getByRole('button', { name: /Confirm & Subscribe/i })
      fireEvent.click(confirmButton)
      
      await waitFor(() => {
        expect(screen.getByText('Subscription Failed')).toBeInTheDocument()
        expect(screen.getByText(error.message)).toBeInTheDocument()
      })
    })

    it('calls onError callback', async () => {
      const error = new Error('Network error')
      mockSubscribe.mockRejectedValue(error)
      
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={true}
          onClose={onClose}
          onError={onError}
        />
      )
      
      // Navigate and try to subscribe
      const connectButton = screen.getByRole('button', { name: /Wallet Connected/i })
      fireEvent.click(connectButton)
      
      await waitFor(() => {
        const continueButton = screen.getByRole('button', { name: /Continue to Payment/i })
        fireEvent.click(continueButton)
      })
      
      const confirmButton = screen.getByRole('button', { name: /Confirm & Subscribe/i })
      fireEvent.click(confirmButton)
      
      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error)
      })
    })

    it('allows retry from error state', async () => {
      const error = new Error('First attempt failed')
      mockSubscribe.mockRejectedValueOnce(error).mockResolvedValue('0xhash')
      
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={true}
          onClose={onClose}
        />
      )
      
      // Navigate and fail first attempt
      const connectButton = screen.getByRole('button', { name: /Wallet Connected/i })
      fireEvent.click(connectButton)
      
      await waitFor(() => {
        const continueButton = screen.getByRole('button', { name: /Continue to Payment/i })
        fireEvent.click(continueButton)
      })
      
      const confirmButton = screen.getByRole('button', { name: /Confirm & Subscribe/i })
      fireEvent.click(confirmButton)
      
      await waitFor(() => {
        expect(screen.getByText('Subscription Failed')).toBeInTheDocument()
      })
      
      // Retry
      const retryButton = screen.getByRole('button', { name: /Try Again/i })
      fireEvent.click(retryButton)
      
      expect(screen.getByText('Confirm Subscription')).toBeInTheDocument()
    })
  })

  describe('Backdrop', () => {
    it('calls onClose when backdrop is clicked', () => {
      render(
        <SubscriptionModal
          sdk={mockSdk}
          merchantId={merchantId}
          isOpen={true}
          onClose={onClose}
        />
      )
      
      const backdrop = document.querySelector('.bg-black\\/50')
      if (backdrop) {
        fireEvent.click(backdrop)
        expect(onClose).toHaveBeenCalled()
      }
    })
  })

  it('handles null SDK gracefully', () => {
    render(
      <SubscriptionModal
        sdk={null}
        merchantId={merchantId}
        isOpen={true}
        onClose={onClose}
      />
    )
    
    // Should still render the modal structure
    expect(screen.getByText(/Subscribe to Merchant/)).toBeInTheDocument()
  })

  it('resets state when modal reopens', () => {
    const { rerender } = render(
      <SubscriptionModal
        sdk={mockSdk}
        merchantId={merchantId}
        isOpen={false}
        onClose={onClose}
      />
    )
    
    // Open modal
    rerender(
      <SubscriptionModal
        sdk={mockSdk}
        merchantId={merchantId}
        isOpen={true}
        onClose={onClose}
      />
    )
    
    // Should start at connect step
    expect(screen.getByText('Connect Your Wallet')).toBeInTheDocument()
  })
})