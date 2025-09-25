import { S as SubscriptionSDK } from './SubscriptionSDK-BKr8lOsY.js';
export { e as AdminService, A as AnalyticsService, C as CHAIN_CONFIGS, p as EventCallback, q as EventListeners, E as EventMonitoringService, k as Merchant, x as MerchantAnalytics, c as MerchantPlan, m as MerchantPriceParams, u as MerchantRegisteredEvent, l as MerchantRegistrationParams, M as MerchantService, v as MerchantWithdrawalEvent, y as NFTMetadata, N as NFTService, P as PaymentEvent, w as PlatformMetrics, R as ReactiveNetworkService, f as SDKConfig, B as SDKError, z as SDKErrorCode, i as SubscribeParams, j as SubscribeResult, t as SubscriptionExpiredEvent, r as SubscriptionMintedEvent, s as SubscriptionRenewedEvent, d as SubscriptionService, h as SubscriptionStatus, n as Token, o as TokenBalance, T as TokenService, b as getAddressExplorerUrl, g as getChainConfig, a as getExplorerUrl } from './SubscriptionSDK-BKr8lOsY.js';
import { Address, Hash } from 'viem';
export { Address, Hash, PublicClient, WalletClient } from 'viem';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React from 'react';
import React__default from 'react';
import * as class_variance_authority_dist_types from 'class-variance-authority/dist/types';
import { VariantProps } from 'class-variance-authority';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import 'events';

declare function validateAddress(address: string): Address;
declare function formatSubscriptionPeriod(seconds: bigint): string;
declare function calculateExpiryDate(periodInSeconds: bigint): Date;
declare function isExpired(expiryTimestamp: bigint): boolean;
declare function formatTokenAmount(amount: bigint, decimals?: number): string;
declare function parseTokenAmount(amount: string, decimals?: number): bigint;
declare function shortenAddress(address: Address): string;
declare function getTransactionUrl(hash: Hash, chainId: number): string;
declare function retry<T>(fn: () => Promise<T>, options?: {
    retries?: number;
    delay?: number;
    onRetry?: (error: Error, attempt: number) => void;
}): Promise<T>;
declare function createBatchProcessor<T, R>(batchSize: number | undefined, processor: (items: T[]) => Promise<R[]>): (items: T[]) => Promise<R[]>;
declare class EventAggregator {
    private events;
    private flushTimeout;
    private flushInterval;
    private onFlush;
    constructor(flushInterval: number | undefined, onFlush: (events: Map<string, any[]>) => void);
    add(eventType: string, data: any): void;
    flush(): void;
    destroy(): void;
}

interface SubscribeButtonProps {
    sdk: SubscriptionSDK | null;
    merchantId: bigint;
    paymentToken?: Address | 'ETH';
    className?: string;
    children?: React__default.ReactNode;
    onSuccess?: (hash: string) => void;
    onError?: (error: Error) => void;
}
declare function SubscribeButton({ sdk, merchantId, paymentToken, className, children, onSuccess, onError }: SubscribeButtonProps): react_jsx_runtime.JSX.Element;

interface SubscriptionModalProps {
    sdk: SubscriptionSDK | null;
    merchantId: bigint;
    paymentToken?: Address | 'ETH';
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (hash: string) => void;
    onError?: (error: Error) => void;
    className?: string;
}
declare function SubscriptionModal({ sdk, merchantId, paymentToken, isOpen, onClose, onSuccess, onError, className }: SubscriptionModalProps): react_jsx_runtime.JSX.Element | null;

interface SubscriptionCardProps {
    sdk: SubscriptionSDK | null;
    merchantId: bigint;
    variant?: 'default' | 'detailed' | 'compact';
    showPricing?: boolean;
    showStatus?: boolean;
    showActions?: boolean;
    onSubscribe?: () => void;
    onViewDetails?: () => void;
    className?: string;
}
declare function SubscriptionCard({ sdk, merchantId, variant, showPricing, showStatus, showActions, onSubscribe, onViewDetails, className }: SubscriptionCardProps): react_jsx_runtime.JSX.Element;

interface MerchantDashboardProps {
    sdk: SubscriptionSDK | null;
    merchantId: bigint;
    onEditMerchant?: () => void;
    onViewAnalytics?: () => void;
    onAddSubscription?: () => void;
    className?: string;
}
declare function MerchantDashboard({ sdk, merchantId, onEditMerchant, onViewAnalytics, onAddSubscription, className }: MerchantDashboardProps): react_jsx_runtime.JSX.Element;

interface WalletConnectProps {
    sdk: SubscriptionSDK | null;
    onConnect?: () => void;
    onDisconnect?: () => void;
    variant?: 'default' | 'minimal' | 'detailed';
    className?: string;
}
declare function WalletConnect({ sdk, onConnect, onDisconnect, variant, className }: WalletConnectProps): react_jsx_runtime.JSX.Element;

interface AnalyticsWidgetProps {
    sdk: SubscriptionSDK | null;
    merchantId?: bigint;
    timeRange?: '7d' | '30d' | '90d' | '1y';
    onTimeRangeChange?: (range: string) => void;
    variant?: 'platform' | 'merchant';
    className?: string;
}
declare function AnalyticsWidget({ sdk, merchantId, timeRange, onTimeRangeChange, variant, className }: AnalyticsWidgetProps): react_jsx_runtime.JSX.Element;

declare const buttonVariants: (props?: ({
    variant?: "link" | "success" | "default" | "destructive" | "outline" | "secondary" | "ghost" | "warning" | "subscription" | null | undefined;
    size?: "default" | "sm" | "lg" | "xl" | "icon" | null | undefined;
} & class_variance_authority_dist_types.ClassProp) | undefined) => string;
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
}
declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;

declare const Card: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
declare const CardHeader: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
declare const CardTitle: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLHeadingElement> & React.RefAttributes<HTMLParagraphElement>>;
declare const CardDescription: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & React.RefAttributes<HTMLParagraphElement>>;
declare const CardContent: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
declare const CardFooter: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;

declare const badgeVariants: (props?: ({
    variant?: "pending" | "success" | "default" | "active" | "expired" | "processing" | "destructive" | "outline" | "secondary" | "warning" | null | undefined;
} & class_variance_authority_dist_types.ClassProp) | undefined) => string;
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
}
declare function Badge({ className, variant, ...props }: BadgeProps): react_jsx_runtime.JSX.Element;

declare const Dialog: React.FC<DialogPrimitive.DialogProps>;
declare const DialogTrigger: React.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const DialogContent: React.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const DialogHeader: {
    ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const DialogTitle: React.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogTitleProps & React.RefAttributes<HTMLHeadingElement>, "ref"> & React.RefAttributes<HTMLHeadingElement>>;
declare const DialogDescription: React.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogDescriptionProps & React.RefAttributes<HTMLParagraphElement>, "ref"> & React.RefAttributes<HTMLParagraphElement>>;

declare const Progress: React.ForwardRefExoticComponent<Omit<ProgressPrimitive.ProgressProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;

declare const Avatar: React.ForwardRefExoticComponent<Omit<AvatarPrimitive.AvatarProps & React.RefAttributes<HTMLSpanElement>, "ref"> & React.RefAttributes<HTMLSpanElement>>;
declare const AvatarImage: React.ForwardRefExoticComponent<Omit<AvatarPrimitive.AvatarImageProps & React.RefAttributes<HTMLImageElement>, "ref"> & React.RefAttributes<HTMLImageElement>>;
declare const AvatarFallback: React.ForwardRefExoticComponent<Omit<AvatarPrimitive.AvatarFallbackProps & React.RefAttributes<HTMLSpanElement>, "ref"> & React.RefAttributes<HTMLSpanElement>>;

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}
declare function LoadingSpinner({ size, className }: LoadingSpinnerProps): react_jsx_runtime.JSX.Element;
interface LoadingDotsProps {
    className?: string;
}
declare function LoadingDots({ className }: LoadingDotsProps): react_jsx_runtime.JSX.Element;
interface LoadingPulseProps {
    className?: string;
}
declare function LoadingPulse({ className }: LoadingPulseProps): react_jsx_runtime.JSX.Element;
interface LoadingSkeletonProps {
    className?: string;
    lines?: number;
}
declare function LoadingSkeleton({ className, lines }: LoadingSkeletonProps): react_jsx_runtime.JSX.Element;

export { AnalyticsWidget, type AnalyticsWidgetProps, Avatar, AvatarFallback, AvatarImage, Badge, type BadgeProps, Button, type ButtonProps, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, EventAggregator, LoadingDots, LoadingPulse, LoadingSkeleton, LoadingSpinner, MerchantDashboard, type MerchantDashboardProps, Progress, SubscribeButton, type SubscribeButtonProps, SubscriptionCard, type SubscriptionCardProps, SubscriptionModal, type SubscriptionModalProps, SubscriptionSDK, WalletConnect, type WalletConnectProps, calculateExpiryDate, createBatchProcessor, formatSubscriptionPeriod, formatTokenAmount, getTransactionUrl, isExpired, parseTokenAmount, retry, shortenAddress, validateAddress };
