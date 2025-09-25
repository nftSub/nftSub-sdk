import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SubscribeButton } from '../../src/components/SubscribeButton'
import { createMockSdk } from '../utils/mockSdk'
import * as hooks from '../../src/hooks/useSubscription'

// Mock the useSubscription hook
vi.mock('../../src/hooks/useSubscription', () => ({
  useSubscription: vi.fn()
}))

describe('SubscribeButton', () => {
  const mockSubscribe = vi.fn()
  const mockSdk = createMockSdk()
  const merchantId = 1n

  beforeEach(() => {
    vi.clearAllMocks()
    ;(hooks.useSubscription as any).mockReturnValue({
      isActive: false,
      isLoading: false,
      subscribe: mockSubscribe
    })
  })

  it('renders with default text when not connected', () => {
    const disconnectedSdk = createMockSdk({
      isConnected: vi.fn().mockReturnValue(false)
    })

    render(<SubscribeButton sdk={disconnectedSdk} merchantId={merchantId} />)
    
    expect(screen.getByRole('button')).toHaveTextContent('Connect Wallet')
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renders with custom children', () => {
    render(
      <SubscribeButton sdk={mockSdk} merchantId={merchantId}>
        Get Premium Access
      </SubscribeButton>
    )
    
    expect(screen.getByRole('button')).toHaveTextContent('Get Premium Access')
  })

  it('shows processing state when subscribing', async () => {
    mockSubscribe.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('0xhash'), 100)))

    render(<SubscribeButton sdk={mockSdk} merchantId={merchantId} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('Processing...')
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  it('shows active subscription state', () => {
    ;(hooks.useSubscription as any).mockReturnValue({
      isActive: true,
      isLoading: false,
      subscribe: mockSubscribe
    })

    render(<SubscribeButton sdk={mockSdk} merchantId={merchantId} />)
    
    expect(screen.getByRole('button')).toHaveTextContent('Active Subscription')
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls onSuccess callback when subscription succeeds', async () => {
    const onSuccess = vi.fn()
    mockSubscribe.mockResolvedValue('0xhash123')

    render(
      <SubscribeButton 
        sdk={mockSdk} 
        merchantId={merchantId}
        onSuccess={onSuccess}
      />
    )
    
    fireEvent.click(screen.getByRole('button'))
    
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith('0xhash123')
    })
  })

  it('calls onError callback when subscription fails', async () => {
    const onError = vi.fn()
    const error = new Error('Transaction failed')
    mockSubscribe.mockRejectedValue(error)

    render(
      <SubscribeButton 
        sdk={mockSdk} 
        merchantId={merchantId}
        onError={onError}
      />
    )
    
    fireEvent.click(screen.getByRole('button'))
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(error)
    })
  })

  it('applies custom className', () => {
    render(
      <SubscribeButton 
        sdk={mockSdk} 
        merchantId={merchantId}
        className="custom-class"
      />
    )
    
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('does not call subscribe when sdk is null', () => {
    render(<SubscribeButton sdk={null} merchantId={merchantId} />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(mockSubscribe).not.toHaveBeenCalled()
  })
})