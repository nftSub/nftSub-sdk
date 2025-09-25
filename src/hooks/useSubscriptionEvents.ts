import { useEffect, useState } from 'react';
import { type SubscriptionSDK, type EventListeners } from '../';

export function useSubscriptionEvents(
  sdk: SubscriptionSDK | null,
  listeners: EventListeners
) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!sdk) return;
    
    // Start monitoring
    sdk.startEventMonitoring({
      ...listeners,
      // Wrap callbacks to collect events
      onPaymentReceived: listeners.onPaymentReceived
        ? (event) => {
            setEvents(prev => [...prev, { type: 'payment', data: event, timestamp: Date.now() }]);
            listeners.onPaymentReceived!(event);
          }
        : undefined,
      onSubscriptionMinted: listeners.onSubscriptionMinted
        ? (event) => {
            setEvents(prev => [...prev, { type: 'minted', data: event, timestamp: Date.now() }]);
            listeners.onSubscriptionMinted!(event);
          }
        : undefined,
      onSubscriptionRenewed: listeners.onSubscriptionRenewed
        ? (event) => {
            setEvents(prev => [...prev, { type: 'renewed', data: event, timestamp: Date.now() }]);
            listeners.onSubscriptionRenewed!(event);
          }
        : undefined,
      onMerchantRegistered: listeners.onMerchantRegistered
        ? (event) => {
            setEvents(prev => [...prev, { type: 'merchant:registered', data: event, timestamp: Date.now() }]);
            listeners.onMerchantRegistered!(event);
          }
        : undefined,
      onMerchantWithdrawal: listeners.onMerchantWithdrawal
        ? (event) => {
            setEvents(prev => [...prev, { type: 'merchant:withdrawal', data: event, timestamp: Date.now() }]);
            listeners.onMerchantWithdrawal!(event);
          }
        : undefined
    });
    
    setIsMonitoring(true);
    
    // Cleanup
    return () => {
      sdk.stopEventMonitoring();
      setIsMonitoring(false);
    };
  }, [sdk]);

  const clearEvents = () => setEvents([]);

  return {
    isMonitoring,
    events,
    clearEvents
  };
}