import { useState, useEffect, useRef } from 'react';
import { SubscriptionSDK } from '../core/SubscriptionSDK';
import { type SDKConfig } from '../types';

export function useSubscriptionSDK(config: SDKConfig) {
  const [sdk, setSdk] = useState<SubscriptionSDK | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const sdkRef = useRef<SubscriptionSDK | null>(null);

  useEffect(() => {
    const initSDK = async () => {
      try {
        setError(null);
        
        // Create SDK instance
        const instance = new SubscriptionSDK(config);
        sdkRef.current = instance;
        setSdk(instance);
        setIsInitialized(true);
      } catch (err) {
        setError(err as Error);
        setIsInitialized(false);
      }
    };

    initSDK();

    // Cleanup
    return () => {
      if (sdkRef.current) {
        sdkRef.current.stopEventMonitoring();
        sdkRef.current = null;
      }
    };
  }, [config.chain, config.rpc, config.privateKey]);

  return {
    sdk,
    isInitialized,
    error,
    isConnected: sdk?.isConnected() ?? false,
    address: sdk?.getAddress()
  };
}