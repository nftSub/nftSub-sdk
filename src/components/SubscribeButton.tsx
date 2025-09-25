import React, { useState } from 'react';
import { type Address } from 'viem';
import { useSubscription } from '../hooks/useSubscription';
import { type SubscriptionSDK } from '../core/SubscriptionSDK';

export interface SubscribeButtonProps {
  sdk: SubscriptionSDK | null;
  merchantId: bigint;
  paymentToken?: Address | 'ETH';
  className?: string;
  children?: React.ReactNode;
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
}

export function SubscribeButton({
  sdk,
  merchantId,
  paymentToken = 'ETH',
  className = '',
  children,
  onSuccess,
  onError
}: SubscribeButtonProps) {
  const { isActive, isLoading, subscribe } = useSubscription(
    sdk,
    merchantId,
    sdk?.getAddress()
  );
  
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    if (isActive || !sdk) return;
    
    setIsProcessing(true);
    
    try {
      const hash = await subscribe(paymentToken);
      
      if (hash) {
        onSuccess?.(hash);
      }
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsProcessing(false);
    }
  };

  const buttonText = () => {
    if (isProcessing || isLoading) return 'Processing...';
    if (isActive) return 'Active Subscription';
    if (!sdk?.isConnected()) return 'Connect Wallet';
    return children || 'Subscribe';
  };

  const isDisabled = 
    isActive || 
    isProcessing || 
    isLoading || 
    !sdk?.isConnected();

  return (
    <button
      onClick={handleSubscribe}
      disabled={isDisabled}
      className={`
        subscription-button
        ${isActive ? 'subscription-button--active' : ''}
        ${isProcessing || isLoading ? 'subscription-button--loading' : ''}
        ${!sdk?.isConnected() ? 'subscription-button--disconnected' : ''}
        ${className}
      `.trim()}
      style={{
        padding: '12px 24px',
        borderRadius: '8px',
        fontWeight: 600,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.6 : 1,
        transition: 'all 0.2s ease',
        background: isActive ? '#10b981' : '#3b82f6',
        color: 'white',
        border: 'none'
      }}
    >
      {buttonText()}
    </button>
  );
}