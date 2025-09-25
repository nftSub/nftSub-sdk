import { f as SDKConfig, S as SubscriptionSDK, h as SubscriptionStatus, c as MerchantPlan, q as EventListeners } from '../SubscriptionSDK-BKr8lOsY.mjs';
import { Address, Hash } from 'viem';
import 'events';

declare function useSubscriptionSDK(config: SDKConfig): {
    sdk: SubscriptionSDK | null;
    isInitialized: boolean;
    error: Error | null;
    isConnected: boolean;
    address: `0x${string}` | undefined;
};

declare function useSubscription(sdk: SubscriptionSDK | null, merchantId: bigint, userAddress?: Address): {
    isActive: boolean;
    status: SubscriptionStatus | null;
    isLoading: boolean;
    error: Error | null;
    subscribe: (paymentToken?: Address | "ETH") => Promise<Hash | undefined>;
    checkStatus: () => Promise<void>;
};

declare function useMerchant(sdk: SubscriptionSDK | null, merchantId: bigint): {
    merchant: MerchantPlan | null;
    balance: bigint;
    isLoading: boolean;
    error: Error | null;
    withdraw: (token?: Address | "ETH") => Promise<Hash | undefined>;
    setPrice: (token: Address | "ETH", price: string) => Promise<Hash | undefined>;
    refresh: () => Promise<void>;
};

declare function useSubscriptionEvents(sdk: SubscriptionSDK | null, listeners: EventListeners): {
    isMonitoring: boolean;
    events: any[];
    clearEvents: () => void;
};

export { useMerchant, useSubscription, useSubscriptionEvents, useSubscriptionSDK };
