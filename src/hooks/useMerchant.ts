import { useState, useEffect, useCallback } from 'react';
import { type Address, type Hash } from 'viem';
import { type SubscriptionSDK, type MerchantPlan } from '../';

export function useMerchant(
  sdk: SubscriptionSDK | null,
  merchantId: bigint
) {
  const [merchant, setMerchant] = useState<MerchantPlan | null>(null);
  const [balance, setBalance] = useState<bigint>(0n);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch merchant details
  const fetchMerchantDetails = useCallback(async () => {
    if (!sdk) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const details = await sdk.merchants.getMerchantPlan(merchantId);
      setMerchant(details);
      
      // Get balance in ETH
      const bal = await sdk.getMerchantBalance(merchantId, 'ETH');
      setBalance(bal);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [sdk, merchantId]);

  // Withdraw balance
  const withdraw = useCallback(
    async (token: Address | 'ETH' = 'ETH'): Promise<Hash | undefined> => {
      if (!sdk) {
        setError(new Error('SDK not initialized'));
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const hash = await sdk.withdrawMerchantBalance(merchantId, token);
        
        // Wait for transaction
        await sdk.waitForTransaction(hash);
        
        // Refresh details
        await fetchMerchantDetails();
        
        return hash;
      } catch (err) {
        setError(err as Error);
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [sdk, merchantId, fetchMerchantDetails]
  );

  // Set price for a token
  const setPrice = useCallback(
    async (token: Address | 'ETH', price: string): Promise<Hash | undefined> => {
      if (!sdk) {
        setError(new Error('SDK not initialized'));
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const tokenAddress = token === 'ETH' ? 
          '0x0000000000000000000000000000000000000000' as Address : 
          token;
          
        const hash = await sdk.merchants.setMerchantPrice({
          merchantId,
          paymentToken: tokenAddress,
          price
        });
        
        await sdk.waitForTransaction(hash);
        
        return hash;
      } catch (err) {
        setError(err as Error);
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [sdk, merchantId]
  );

  // Auto-fetch on mount
  useEffect(() => {
    fetchMerchantDetails();
  }, [fetchMerchantDetails]);

  // Monitor withdrawal events
  useEffect(() => {
    if (!sdk || !merchant) return;
    
    const listener = (event: any) => {
      if (event.merchantId === merchantId) {
        fetchMerchantDetails();
      }
    };

    sdk.on('merchant:withdrawal', listener);
    
    return () => {
      sdk.off('merchant:withdrawal', listener);
    };
  }, [sdk, merchant, merchantId, fetchMerchantDetails]);

  return {
    merchant,
    balance,
    isLoading,
    error,
    withdraw,
    setPrice,
    refresh: fetchMerchantDetails
  };
}