import { useState, useEffect, useCallback } from 'react';
import { type Address, type Hash } from 'viem';
import { type SubscriptionSDK, type SubscriptionStatus } from '../';

export function useSubscription(
  sdk: SubscriptionSDK | null,
  merchantId: bigint,
  userAddress?: Address
) {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Check subscription status
  const checkStatus = useCallback(async () => {
    if (!sdk) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const address = userAddress || sdk.getAddress();
      if (!address) throw new Error('No address available');
      
      const active = await sdk.checkAccess(merchantId, address);
      setIsActive(active);
      
      // Get full status if active
      if (active) {
        const fullStatus = await sdk.subscriptions.getSubscriptionStatus(
          address,
          merchantId
        );
        setStatus(fullStatus);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [sdk, merchantId, userAddress]);

  // Subscribe function
  const subscribe = useCallback(
    async (paymentToken: Address | 'ETH' = 'ETH'): Promise<Hash | undefined> => {
      if (!sdk) {
        setError(new Error('SDK not initialized'));
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const hash = await sdk.subscribe(merchantId, paymentToken);
        
        // Wait for transaction
        await sdk.waitForTransaction(hash);
        
        // Refresh status
        await checkStatus();
        
        return hash;
      } catch (err) {
        setError(err as Error);
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [sdk, merchantId, checkStatus]
  );

  // Auto-check status on mount and when dependencies change
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // Set up event monitoring for subscription changes
  useEffect(() => {
    if (!sdk || !userAddress) return;
    
    const listener = (event: any) => {
      if (
        event.subscriber === userAddress &&
        event.merchantId === merchantId
      ) {
        checkStatus();
      }
    };

    sdk.on('subscription:minted', listener);
    
    return () => {
      sdk.off('subscription:minted', listener);
    };
  }, [sdk, userAddress, merchantId, checkStatus]);

  return {
    isActive,
    status,
    isLoading,
    error,
    subscribe,
    checkStatus
  };
}