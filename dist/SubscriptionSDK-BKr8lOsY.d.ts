import * as viem from 'viem';
import { PublicClient, WalletClient, Address, Hash, Log } from 'viem';
import EventEmitter from 'events';

interface MerchantPlan {
    payoutAddress: Address;
    subscriptionPeriod: bigint;
    gracePeriod: bigint;
    isActive: boolean;
    totalSubscribers: bigint;
}
/**
 * Service for managing merchant operations
 * Handles merchant registration, plan management, pricing, and withdrawals
 */
declare class MerchantService {
    private publicClient;
    private walletClient?;
    private contract;
    constructor(publicClient: PublicClient, walletClient?: WalletClient | undefined);
    /**
     * Register a new merchant on the platform
     */
    registerMerchant(params: {
        payoutAddress: Address;
        subscriptionPeriod: number;
        gracePeriod: number;
    }): Promise<{
        hash: Hash;
        merchantId?: bigint;
    }>;
    /**
     * Update existing merchant plan configuration
     */
    updateMerchantPlan(params: {
        merchantId: bigint;
        payoutAddress: Address;
        subscriptionPeriod: number;
        isActive: boolean;
    }): Promise<Hash>;
    /**
     * Set pricing for a specific payment token
     */
    setMerchantPrice(params: {
        merchantId: bigint;
        paymentToken: Address;
        price: string;
        decimals?: number;
    }): Promise<Hash>;
    /**
     * Set multiple token prices at once
     */
    setBulkPrices(params: {
        merchantId: bigint;
        tokens: Array<{
            address: Address;
            price: string;
            decimals?: number;
        }>;
    }): Promise<Hash[]>;
    /**
     * Get merchant plan details
     */
    getMerchantPlan(merchantId: bigint): Promise<MerchantPlan>;
    /**
     * Get merchant balance for a specific token
     */
    getMerchantBalance(merchantId: bigint, token: Address): Promise<bigint>;
    /**
     * Get all balances for a merchant across multiple tokens
     */
    getAllMerchantBalances(merchantId: bigint, tokens: Address[]): Promise<Map<Address, bigint>>;
    /**
     * Withdraw merchant balance for a specific token
     */
    withdrawMerchantBalance(params: {
        merchantId: bigint;
        token: Address;
    }): Promise<Hash>;
    /**
     * Withdraw all available balances for a merchant
     */
    withdrawAllBalances(merchantId: bigint, tokens: Address[]): Promise<Hash[]>;
    /**
     * Get merchant price for a specific token
     */
    getMerchantPrice(merchantId: bigint, token: Address): Promise<bigint>;
    /**
     * Check if a merchant accepts a specific token
     */
    isMerchantTokenAccepted(merchantId: bigint, token: Address): Promise<boolean>;
    /**
     * Get all accepted tokens and their prices for a merchant
     */
    getMerchantTokenPrices(merchantId: bigint, possibleTokens: Address[]): Promise<Map<Address, bigint>>;
    /**
     * Listen to merchant registration events
     */
    watchMerchantRegistrations(callback: (merchantId: bigint, owner: Address, payoutAddress: Address) => void): viem.WatchContractEventReturnType;
    /**
     * Listen to merchant withdrawal events
     */
    watchMerchantWithdrawals(merchantId?: bigint, callback?: (data: {
        merchantId: bigint;
        token: Address;
        amount: bigint;
        payoutAddress: Address;
    }) => void): viem.WatchContractEventReturnType;
    /**
     * Get historical merchant events
     */
    getMerchantHistory(merchantId: bigint): Promise<{
        registrations: viem.GetContractEventsReturnType<readonly [{
            readonly type: "constructor";
            readonly inputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "getMerchantBalance";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "getMerchantPlan";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "tuple";
                readonly internalType: "struct ISubscriptionTypes.MerchantPlan";
                readonly components: readonly [{
                    readonly name: "payoutAddress";
                    readonly type: "address";
                    readonly internalType: "address";
                }, {
                    readonly name: "subscriptionPeriod";
                    readonly type: "uint64";
                    readonly internalType: "uint64";
                }, {
                    readonly name: "gracePeriod";
                    readonly type: "uint64";
                    readonly internalType: "uint64";
                }, {
                    readonly name: "isActive";
                    readonly type: "bool";
                    readonly internalType: "bool";
                }, {
                    readonly name: "totalSubscribers";
                    readonly type: "uint256";
                    readonly internalType: "uint256";
                }];
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "getMerchantPrice";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "isMerchantTokenAccepted";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "bool";
                readonly internalType: "bool";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "owner";
            readonly inputs: readonly [];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "platformFeeBps";
            readonly inputs: readonly [];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "uint16";
                readonly internalType: "uint16";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "registerMerchant";
            readonly inputs: readonly [{
                readonly name: "payoutAddress";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "subscriptionPeriod";
                readonly type: "uint64";
                readonly internalType: "uint64";
            }, {
                readonly name: "gracePeriod";
                readonly type: "uint64";
                readonly internalType: "uint64";
            }];
            readonly outputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "renounceOwnership";
            readonly inputs: readonly [];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "setMerchantPrice";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "paymentToken";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "price";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "setPlatformFee";
            readonly inputs: readonly [{
                readonly name: "_feeBps";
                readonly type: "uint16";
                readonly internalType: "uint16";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "setSubscriptionNFT";
            readonly inputs: readonly [{
                readonly name: "_nft";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "subscribe";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "paymentToken";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "payable";
        }, {
            readonly type: "function";
            readonly name: "subscriptionNFT";
            readonly inputs: readonly [];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "transferOwnership";
            readonly inputs: readonly [{
                readonly name: "newOwner";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "updateMerchantPlan";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "payoutAddress";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "subscriptionPeriod";
                readonly type: "uint64";
                readonly internalType: "uint64";
            }, {
                readonly name: "isActive";
                readonly type: "bool";
                readonly internalType: "bool";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "withdrawMerchantBalance";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "withdrawPlatformFees";
            readonly inputs: readonly [{
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "to";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "event";
            readonly name: "MerchantRegistered";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly indexed: true;
                readonly internalType: "uint256";
            }, {
                readonly name: "owner";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "payoutAddress";
                readonly type: "address";
                readonly indexed: false;
                readonly internalType: "address";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "MerchantWithdrawal";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly indexed: true;
                readonly internalType: "uint256";
            }, {
                readonly name: "token";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "amount";
                readonly type: "uint256";
                readonly indexed: false;
                readonly internalType: "uint256";
            }, {
                readonly name: "to";
                readonly type: "address";
                readonly indexed: false;
                readonly internalType: "address";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "OwnershipTransferred";
            readonly inputs: readonly [{
                readonly name: "previousOwner";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "newOwner";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "PaymentReceived";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly indexed: true;
                readonly internalType: "uint256";
            }, {
                readonly name: "paymentToken";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "amount";
                readonly type: "uint256";
                readonly indexed: false;
                readonly internalType: "uint256";
            }, {
                readonly name: "platformFee";
                readonly type: "uint256";
                readonly indexed: false;
                readonly internalType: "uint256";
            }, {
                readonly name: "period";
                readonly type: "uint64";
                readonly indexed: false;
                readonly internalType: "uint64";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "PlatformFeeWithdrawal";
            readonly inputs: readonly [{
                readonly name: "token";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "amount";
                readonly type: "uint256";
                readonly indexed: false;
                readonly internalType: "uint256";
            }, {
                readonly name: "to";
                readonly type: "address";
                readonly indexed: false;
                readonly internalType: "address";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "error";
            readonly name: "OwnableInvalidOwner";
            readonly inputs: readonly [{
                readonly name: "owner";
                readonly type: "address";
                readonly internalType: "address";
            }];
        }, {
            readonly type: "error";
            readonly name: "OwnableUnauthorizedAccount";
            readonly inputs: readonly [{
                readonly name: "account";
                readonly type: "address";
                readonly internalType: "address";
            }];
        }, {
            readonly type: "error";
            readonly name: "ReentrancyGuardReentrantCall";
            readonly inputs: readonly [];
        }, {
            readonly type: "error";
            readonly name: "SafeERC20FailedOperation";
            readonly inputs: readonly [{
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }];
        }], "MerchantRegistered", undefined, "earliest", undefined>;
        withdrawals: viem.GetContractEventsReturnType<readonly [{
            readonly type: "constructor";
            readonly inputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "getMerchantBalance";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "getMerchantPlan";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "tuple";
                readonly internalType: "struct ISubscriptionTypes.MerchantPlan";
                readonly components: readonly [{
                    readonly name: "payoutAddress";
                    readonly type: "address";
                    readonly internalType: "address";
                }, {
                    readonly name: "subscriptionPeriod";
                    readonly type: "uint64";
                    readonly internalType: "uint64";
                }, {
                    readonly name: "gracePeriod";
                    readonly type: "uint64";
                    readonly internalType: "uint64";
                }, {
                    readonly name: "isActive";
                    readonly type: "bool";
                    readonly internalType: "bool";
                }, {
                    readonly name: "totalSubscribers";
                    readonly type: "uint256";
                    readonly internalType: "uint256";
                }];
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "getMerchantPrice";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "isMerchantTokenAccepted";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "bool";
                readonly internalType: "bool";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "owner";
            readonly inputs: readonly [];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "platformFeeBps";
            readonly inputs: readonly [];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "uint16";
                readonly internalType: "uint16";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "registerMerchant";
            readonly inputs: readonly [{
                readonly name: "payoutAddress";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "subscriptionPeriod";
                readonly type: "uint64";
                readonly internalType: "uint64";
            }, {
                readonly name: "gracePeriod";
                readonly type: "uint64";
                readonly internalType: "uint64";
            }];
            readonly outputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "renounceOwnership";
            readonly inputs: readonly [];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "setMerchantPrice";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "paymentToken";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "price";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "setPlatformFee";
            readonly inputs: readonly [{
                readonly name: "_feeBps";
                readonly type: "uint16";
                readonly internalType: "uint16";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "setSubscriptionNFT";
            readonly inputs: readonly [{
                readonly name: "_nft";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "subscribe";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "paymentToken";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "payable";
        }, {
            readonly type: "function";
            readonly name: "subscriptionNFT";
            readonly inputs: readonly [];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "transferOwnership";
            readonly inputs: readonly [{
                readonly name: "newOwner";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "updateMerchantPlan";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "payoutAddress";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "subscriptionPeriod";
                readonly type: "uint64";
                readonly internalType: "uint64";
            }, {
                readonly name: "isActive";
                readonly type: "bool";
                readonly internalType: "bool";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "withdrawMerchantBalance";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "withdrawPlatformFees";
            readonly inputs: readonly [{
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "to";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "event";
            readonly name: "MerchantRegistered";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly indexed: true;
                readonly internalType: "uint256";
            }, {
                readonly name: "owner";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "payoutAddress";
                readonly type: "address";
                readonly indexed: false;
                readonly internalType: "address";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "MerchantWithdrawal";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly indexed: true;
                readonly internalType: "uint256";
            }, {
                readonly name: "token";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "amount";
                readonly type: "uint256";
                readonly indexed: false;
                readonly internalType: "uint256";
            }, {
                readonly name: "to";
                readonly type: "address";
                readonly indexed: false;
                readonly internalType: "address";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "OwnershipTransferred";
            readonly inputs: readonly [{
                readonly name: "previousOwner";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "newOwner";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "PaymentReceived";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly indexed: true;
                readonly internalType: "uint256";
            }, {
                readonly name: "paymentToken";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "amount";
                readonly type: "uint256";
                readonly indexed: false;
                readonly internalType: "uint256";
            }, {
                readonly name: "platformFee";
                readonly type: "uint256";
                readonly indexed: false;
                readonly internalType: "uint256";
            }, {
                readonly name: "period";
                readonly type: "uint64";
                readonly indexed: false;
                readonly internalType: "uint64";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "PlatformFeeWithdrawal";
            readonly inputs: readonly [{
                readonly name: "token";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "amount";
                readonly type: "uint256";
                readonly indexed: false;
                readonly internalType: "uint256";
            }, {
                readonly name: "to";
                readonly type: "address";
                readonly indexed: false;
                readonly internalType: "address";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "error";
            readonly name: "OwnableInvalidOwner";
            readonly inputs: readonly [{
                readonly name: "owner";
                readonly type: "address";
                readonly internalType: "address";
            }];
        }, {
            readonly type: "error";
            readonly name: "OwnableUnauthorizedAccount";
            readonly inputs: readonly [{
                readonly name: "account";
                readonly type: "address";
                readonly internalType: "address";
            }];
        }, {
            readonly type: "error";
            readonly name: "ReentrancyGuardReentrantCall";
            readonly inputs: readonly [];
        }, {
            readonly type: "error";
            readonly name: "SafeERC20FailedOperation";
            readonly inputs: readonly [{
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }];
        }], "MerchantWithdrawal", undefined, "earliest", undefined>;
    }>;
    /**
     * Extract merchant ID from transaction receipt
     */
    private extractMerchantIdFromReceipt;
    /**
     * Format price for display
     */
    formatPrice(price: bigint, decimals?: number): string;
    /**
     * Calculate estimated revenue
     */
    calculateEstimatedRevenue(params: {
        price: bigint;
        subscribers: number;
        platformFeeBps: number;
    }): bigint;
    /**
     * Check if an address is a registered merchant
     */
    isMerchant(address: Address): Promise<boolean>;
    /**
     * Get total number of merchants registered
     */
    getMerchantCount(): Promise<bigint>;
}

interface SubscriptionStatus$1 {
    isActive: boolean;
    expiresAt: bigint;
    renewalCount: bigint;
    lastRenewal: bigint;
    merchantId: bigint;
}
interface PaymentOption {
    token: Address;
    price: bigint;
    symbol: string;
    decimals: number;
}
/**
 * Service for managing user subscriptions
 * Handles subscription purchases, renewals, status checks, and subscription management
 */
declare class SubscriptionService {
    private publicClient;
    private walletClient?;
    private managerContract;
    private nftContract;
    constructor(publicClient: PublicClient, walletClient?: WalletClient | undefined);
    /**
     * Subscribe to a merchant plan
     */
    subscribe(params: {
        merchantId: bigint;
        paymentToken: Address;
        value?: bigint;
    }): Promise<Hash>;
    /**
     * Subscribe with automatic token approval
     */
    subscribeWithApproval(params: {
        merchantId: bigint;
        paymentToken: Address;
        tokenContract: any;
    }): Promise<{
        approvalHash?: Hash;
        subscriptionHash: Hash;
    }>;
    /**
     * Get subscription status for a user
     */
    getSubscriptionStatus(user: Address, merchantId: bigint): Promise<SubscriptionStatus$1>;
    /**
     * Check if subscription is active
     */
    isSubscriptionActive(user: Address, merchantId: bigint): Promise<boolean>;
    /**
     * Get all user subscriptions
     */
    getUserSubscriptions(user: Address): Promise<bigint[]>;
    /**
     * Get detailed information for all user subscriptions
     */
    getAllUserSubscriptionDetails(user: Address): Promise<SubscriptionStatus$1[]>;
    /**
     * Get subscription price for a merchant and token
     */
    getSubscriptionPrice(merchantId: bigint, paymentToken: Address): Promise<bigint>;
    /**
     * Get all payment options for a merchant
     */
    getPaymentOptions(merchantId: bigint, supportedTokens: Array<{
        address: Address;
        symbol: string;
        decimals: number;
    }>): Promise<PaymentOption[]>;
    /**
     * Calculate time remaining for subscription
     */
    getTimeRemaining(expiresAt: bigint): {
        days: number;
        hours: number;
        minutes: number;
        isExpired: boolean;
    };
    /**
     * Get subscription plan details
     */
    getSubscriptionPlan(merchantId: bigint): Promise<{
        period: bigint;
        gracePeriod: bigint;
        isActive: boolean;
    }>;
    /**
     * Estimate renewal date
     */
    estimateRenewalDate(currentExpiry: bigint, period: bigint): Date;
    /**
     * Watch for payment events
     */
    watchPaymentEvents(params: {
        subscriber?: Address;
        merchantId?: bigint;
        callback: (event: {
            subscriber: Address;
            merchantId: bigint;
            paymentToken: Address;
            amount: bigint;
            platformFee: bigint;
            subscriptionPeriod: bigint;
        }) => void;
    }): viem.WatchContractEventReturnType;
    /**
     * Watch for subscription minting events
     */
    watchSubscriptionMinted(params: {
        subscriber?: Address;
        merchantId?: bigint;
        callback: (event: {
            subscriber: Address;
            merchantId: bigint;
            expiresAt: bigint;
        }) => void;
    }): viem.WatchContractEventReturnType;
    /**
     * Watch for subscription renewal events
     */
    watchSubscriptionRenewed(params: {
        subscriber?: Address;
        merchantId?: bigint;
        callback: (event: {
            subscriber: Address;
            merchantId: bigint;
            newExpiresAt: bigint;
            renewalCount: bigint;
        }) => void;
    }): viem.WatchContractEventReturnType;
    /**
     * Get subscription history for a user
     */
    getSubscriptionHistory(user: Address, merchantId?: bigint): Promise<{
        minted: viem.GetContractEventsReturnType<readonly [{
            readonly type: "constructor";
            readonly inputs: readonly [{
                readonly name: "uri";
                readonly type: "string";
                readonly internalType: "string";
            }, {
                readonly name: "_manager";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "_callbackSender";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "receive";
            readonly stateMutability: "payable";
        }, {
            readonly type: "function";
            readonly name: "DEFAULT_ADMIN_ROLE";
            readonly inputs: readonly [];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "MANAGER_ROLE";
            readonly inputs: readonly [];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "REACTIVE_ROLE";
            readonly inputs: readonly [];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "balanceOf";
            readonly inputs: readonly [{
                readonly name: "account";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "id";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "balanceOfBatch";
            readonly inputs: readonly [{
                readonly name: "accounts";
                readonly type: "address[]";
                readonly internalType: "address[]";
            }, {
                readonly name: "ids";
                readonly type: "uint256[]";
                readonly internalType: "uint256[]";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "uint256[]";
                readonly internalType: "uint256[]";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "burnExpired";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "coverDebt";
            readonly inputs: readonly [];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "getRemainingTime";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "getRoleAdmin";
            readonly inputs: readonly [{
                readonly name: "role";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "getSubscriptionStatus";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "tuple";
                readonly internalType: "struct ISubscriptionTypes.SubscriptionStatus";
                readonly components: readonly [{
                    readonly name: "expiresAt";
                    readonly type: "uint64";
                    readonly internalType: "uint64";
                }, {
                    readonly name: "startedAt";
                    readonly type: "uint64";
                    readonly internalType: "uint64";
                }, {
                    readonly name: "renewalCount";
                    readonly type: "uint32";
                    readonly internalType: "uint32";
                }, {
                    readonly name: "lastPaymentAmount";
                    readonly type: "uint128";
                    readonly internalType: "uint128";
                }, {
                    readonly name: "paymentToken";
                    readonly type: "address";
                    readonly internalType: "address";
                }, {
                    readonly name: "autoRenew";
                    readonly type: "bool";
                    readonly internalType: "bool";
                }];
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "grantRole";
            readonly inputs: readonly [{
                readonly name: "role";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }, {
                readonly name: "account";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "hasRole";
            readonly inputs: readonly [{
                readonly name: "role";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }, {
                readonly name: "account";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "bool";
                readonly internalType: "bool";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "isApprovedForAll";
            readonly inputs: readonly [{
                readonly name: "account";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "operator";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "bool";
                readonly internalType: "bool";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "isInGracePeriod";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "bool";
                readonly internalType: "bool";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "isSubscriptionActive";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "bool";
                readonly internalType: "bool";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "mintOrRenew";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "additionalPeriod";
                readonly type: "uint64";
                readonly internalType: "uint64";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "onPaymentProcessed";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "expiresAt";
                readonly type: "uint64";
                readonly internalType: "uint64";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "pay";
            readonly inputs: readonly [];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly stateMutability: "payable";
        }, {
            readonly type: "function";
            readonly name: "pay";
            readonly inputs: readonly [{
                readonly name: "amount";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "processBatchExpiry";
            readonly inputs: readonly [{
                readonly name: "users";
                readonly type: "address[]";
                readonly internalType: "address[]";
            }, {
                readonly name: "merchantIds";
                readonly type: "uint256[]";
                readonly internalType: "uint256[]";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "reactiveContract";
            readonly inputs: readonly [];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "renounceRole";
            readonly inputs: readonly [{
                readonly name: "role";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }, {
                readonly name: "callerConfirmation";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "revokeRole";
            readonly inputs: readonly [{
                readonly name: "role";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }, {
                readonly name: "account";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "safeBatchTransferFrom";
            readonly inputs: readonly [{
                readonly name: "from";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "to";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "ids";
                readonly type: "uint256[]";
                readonly internalType: "uint256[]";
            }, {
                readonly name: "values";
                readonly type: "uint256[]";
                readonly internalType: "uint256[]";
            }, {
                readonly name: "data";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "safeTransferFrom";
            readonly inputs: readonly [{
                readonly name: "from";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "to";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "id";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "value";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "data";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "setApprovalForAll";
            readonly inputs: readonly [{
                readonly name: "operator";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "approved";
                readonly type: "bool";
                readonly internalType: "bool";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "setMerchantGracePeriod";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "gracePeriod";
                readonly type: "uint64";
                readonly internalType: "uint64";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "setReactiveContract";
            readonly inputs: readonly [{
                readonly name: "_reactive";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "subscriptionManager";
            readonly inputs: readonly [];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "supportsInterface";
            readonly inputs: readonly [{
                readonly name: "interfaceId";
                readonly type: "bytes4";
                readonly internalType: "bytes4";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "bool";
                readonly internalType: "bool";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "uri";
            readonly inputs: readonly [{
                readonly name: "";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "string";
                readonly internalType: "string";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "event";
            readonly name: "ApprovalForAll";
            readonly inputs: readonly [{
                readonly name: "account";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "operator";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "approved";
                readonly type: "bool";
                readonly indexed: false;
                readonly internalType: "bool";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "RoleAdminChanged";
            readonly inputs: readonly [{
                readonly name: "role";
                readonly type: "bytes32";
                readonly indexed: true;
                readonly internalType: "bytes32";
            }, {
                readonly name: "previousAdminRole";
                readonly type: "bytes32";
                readonly indexed: true;
                readonly internalType: "bytes32";
            }, {
                readonly name: "newAdminRole";
                readonly type: "bytes32";
                readonly indexed: true;
                readonly internalType: "bytes32";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "RoleGranted";
            readonly inputs: readonly [{
                readonly name: "role";
                readonly type: "bytes32";
                readonly indexed: true;
                readonly internalType: "bytes32";
            }, {
                readonly name: "account";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "sender";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "RoleRevoked";
            readonly inputs: readonly [{
                readonly name: "role";
                readonly type: "bytes32";
                readonly indexed: true;
                readonly internalType: "bytes32";
            }, {
                readonly name: "account";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "sender";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "SubscriptionBurned";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly indexed: true;
                readonly internalType: "uint256";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "SubscriptionExpired";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly indexed: true;
                readonly internalType: "uint256";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "SubscriptionMinted";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly indexed: true;
                readonly internalType: "uint256";
            }, {
                readonly name: "expiresAt";
                readonly type: "uint64";
                readonly indexed: false;
                readonly internalType: "uint64";
            }, {
                readonly name: "renewalCount";
                readonly type: "uint32";
                readonly indexed: false;
                readonly internalType: "uint32";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "SubscriptionRenewed";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly indexed: true;
                readonly internalType: "uint256";
            }, {
                readonly name: "newExpiresAt";
                readonly type: "uint64";
                readonly indexed: false;
                readonly internalType: "uint64";
            }, {
                readonly name: "renewalCount";
                readonly type: "uint32";
                readonly indexed: false;
                readonly internalType: "uint32";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "TransferBatch";
            readonly inputs: readonly [{
                readonly name: "operator";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "from";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "to";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "ids";
                readonly type: "uint256[]";
                readonly indexed: false;
                readonly internalType: "uint256[]";
            }, {
                readonly name: "values";
                readonly type: "uint256[]";
                readonly indexed: false;
                readonly internalType: "uint256[]";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "TransferSingle";
            readonly inputs: readonly [{
                readonly name: "operator";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "from";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "to";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "id";
                readonly type: "uint256";
                readonly indexed: false;
                readonly internalType: "uint256";
            }, {
                readonly name: "value";
                readonly type: "uint256";
                readonly indexed: false;
                readonly internalType: "uint256";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "URI";
            readonly inputs: readonly [{
                readonly name: "value";
                readonly type: "string";
                readonly indexed: false;
                readonly internalType: "string";
            }, {
                readonly name: "id";
                readonly type: "uint256";
                readonly indexed: true;
                readonly internalType: "uint256";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "error";
            readonly name: "AccessControlBadConfirmation";
            readonly inputs: readonly [];
        }, {
            readonly type: "error";
            readonly name: "AccessControlUnauthorizedAccount";
            readonly inputs: readonly [{
                readonly name: "account";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "neededRole";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }];
        }, {
            readonly type: "error";
            readonly name: "ERC1155InsufficientBalance";
            readonly inputs: readonly [{
                readonly name: "sender";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "balance";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "needed";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "tokenId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
        }, {
            readonly type: "error";
            readonly name: "ERC1155InvalidApprover";
            readonly inputs: readonly [{
                readonly name: "approver";
                readonly type: "address";
                readonly internalType: "address";
            }];
        }, {
            readonly type: "error";
            readonly name: "ERC1155InvalidArrayLength";
            readonly inputs: readonly [{
                readonly name: "idsLength";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "valuesLength";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
        }, {
            readonly type: "error";
            readonly name: "ERC1155InvalidOperator";
            readonly inputs: readonly [{
                readonly name: "operator";
                readonly type: "address";
                readonly internalType: "address";
            }];
        }, {
            readonly type: "error";
            readonly name: "ERC1155InvalidReceiver";
            readonly inputs: readonly [{
                readonly name: "receiver";
                readonly type: "address";
                readonly internalType: "address";
            }];
        }, {
            readonly type: "error";
            readonly name: "ERC1155InvalidSender";
            readonly inputs: readonly [{
                readonly name: "sender";
                readonly type: "address";
                readonly internalType: "address";
            }];
        }, {
            readonly type: "error";
            readonly name: "ERC1155MissingApprovalForAll";
            readonly inputs: readonly [{
                readonly name: "operator";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "owner";
                readonly type: "address";
                readonly internalType: "address";
            }];
        }, {
            readonly type: "error";
            readonly name: "ReentrancyGuardReentrantCall";
            readonly inputs: readonly [];
        }], any, undefined, "earliest", undefined>;
        renewed: viem.GetContractEventsReturnType<readonly [{
            readonly type: "constructor";
            readonly inputs: readonly [{
                readonly name: "uri";
                readonly type: "string";
                readonly internalType: "string";
            }, {
                readonly name: "_manager";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "_callbackSender";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "receive";
            readonly stateMutability: "payable";
        }, {
            readonly type: "function";
            readonly name: "DEFAULT_ADMIN_ROLE";
            readonly inputs: readonly [];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "MANAGER_ROLE";
            readonly inputs: readonly [];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "REACTIVE_ROLE";
            readonly inputs: readonly [];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "balanceOf";
            readonly inputs: readonly [{
                readonly name: "account";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "id";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "balanceOfBatch";
            readonly inputs: readonly [{
                readonly name: "accounts";
                readonly type: "address[]";
                readonly internalType: "address[]";
            }, {
                readonly name: "ids";
                readonly type: "uint256[]";
                readonly internalType: "uint256[]";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "uint256[]";
                readonly internalType: "uint256[]";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "burnExpired";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "coverDebt";
            readonly inputs: readonly [];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "getRemainingTime";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "getRoleAdmin";
            readonly inputs: readonly [{
                readonly name: "role";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "getSubscriptionStatus";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "tuple";
                readonly internalType: "struct ISubscriptionTypes.SubscriptionStatus";
                readonly components: readonly [{
                    readonly name: "expiresAt";
                    readonly type: "uint64";
                    readonly internalType: "uint64";
                }, {
                    readonly name: "startedAt";
                    readonly type: "uint64";
                    readonly internalType: "uint64";
                }, {
                    readonly name: "renewalCount";
                    readonly type: "uint32";
                    readonly internalType: "uint32";
                }, {
                    readonly name: "lastPaymentAmount";
                    readonly type: "uint128";
                    readonly internalType: "uint128";
                }, {
                    readonly name: "paymentToken";
                    readonly type: "address";
                    readonly internalType: "address";
                }, {
                    readonly name: "autoRenew";
                    readonly type: "bool";
                    readonly internalType: "bool";
                }];
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "grantRole";
            readonly inputs: readonly [{
                readonly name: "role";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }, {
                readonly name: "account";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "hasRole";
            readonly inputs: readonly [{
                readonly name: "role";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }, {
                readonly name: "account";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "bool";
                readonly internalType: "bool";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "isApprovedForAll";
            readonly inputs: readonly [{
                readonly name: "account";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "operator";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "bool";
                readonly internalType: "bool";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "isInGracePeriod";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "bool";
                readonly internalType: "bool";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "isSubscriptionActive";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "bool";
                readonly internalType: "bool";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "mintOrRenew";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "additionalPeriod";
                readonly type: "uint64";
                readonly internalType: "uint64";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "onPaymentProcessed";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "expiresAt";
                readonly type: "uint64";
                readonly internalType: "uint64";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "pay";
            readonly inputs: readonly [];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly stateMutability: "payable";
        }, {
            readonly type: "function";
            readonly name: "pay";
            readonly inputs: readonly [{
                readonly name: "amount";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "processBatchExpiry";
            readonly inputs: readonly [{
                readonly name: "users";
                readonly type: "address[]";
                readonly internalType: "address[]";
            }, {
                readonly name: "merchantIds";
                readonly type: "uint256[]";
                readonly internalType: "uint256[]";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "reactiveContract";
            readonly inputs: readonly [];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "renounceRole";
            readonly inputs: readonly [{
                readonly name: "role";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }, {
                readonly name: "callerConfirmation";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "revokeRole";
            readonly inputs: readonly [{
                readonly name: "role";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }, {
                readonly name: "account";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "safeBatchTransferFrom";
            readonly inputs: readonly [{
                readonly name: "from";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "to";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "ids";
                readonly type: "uint256[]";
                readonly internalType: "uint256[]";
            }, {
                readonly name: "values";
                readonly type: "uint256[]";
                readonly internalType: "uint256[]";
            }, {
                readonly name: "data";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "safeTransferFrom";
            readonly inputs: readonly [{
                readonly name: "from";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "to";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "id";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "value";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "data";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "setApprovalForAll";
            readonly inputs: readonly [{
                readonly name: "operator";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "approved";
                readonly type: "bool";
                readonly internalType: "bool";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "setMerchantGracePeriod";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "gracePeriod";
                readonly type: "uint64";
                readonly internalType: "uint64";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "setReactiveContract";
            readonly inputs: readonly [{
                readonly name: "_reactive";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "subscriptionManager";
            readonly inputs: readonly [];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "supportsInterface";
            readonly inputs: readonly [{
                readonly name: "interfaceId";
                readonly type: "bytes4";
                readonly internalType: "bytes4";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "bool";
                readonly internalType: "bool";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "uri";
            readonly inputs: readonly [{
                readonly name: "";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "string";
                readonly internalType: "string";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "event";
            readonly name: "ApprovalForAll";
            readonly inputs: readonly [{
                readonly name: "account";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "operator";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "approved";
                readonly type: "bool";
                readonly indexed: false;
                readonly internalType: "bool";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "RoleAdminChanged";
            readonly inputs: readonly [{
                readonly name: "role";
                readonly type: "bytes32";
                readonly indexed: true;
                readonly internalType: "bytes32";
            }, {
                readonly name: "previousAdminRole";
                readonly type: "bytes32";
                readonly indexed: true;
                readonly internalType: "bytes32";
            }, {
                readonly name: "newAdminRole";
                readonly type: "bytes32";
                readonly indexed: true;
                readonly internalType: "bytes32";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "RoleGranted";
            readonly inputs: readonly [{
                readonly name: "role";
                readonly type: "bytes32";
                readonly indexed: true;
                readonly internalType: "bytes32";
            }, {
                readonly name: "account";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "sender";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "RoleRevoked";
            readonly inputs: readonly [{
                readonly name: "role";
                readonly type: "bytes32";
                readonly indexed: true;
                readonly internalType: "bytes32";
            }, {
                readonly name: "account";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "sender";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "SubscriptionBurned";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly indexed: true;
                readonly internalType: "uint256";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "SubscriptionExpired";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly indexed: true;
                readonly internalType: "uint256";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "SubscriptionMinted";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly indexed: true;
                readonly internalType: "uint256";
            }, {
                readonly name: "expiresAt";
                readonly type: "uint64";
                readonly indexed: false;
                readonly internalType: "uint64";
            }, {
                readonly name: "renewalCount";
                readonly type: "uint32";
                readonly indexed: false;
                readonly internalType: "uint32";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "SubscriptionRenewed";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly indexed: true;
                readonly internalType: "uint256";
            }, {
                readonly name: "newExpiresAt";
                readonly type: "uint64";
                readonly indexed: false;
                readonly internalType: "uint64";
            }, {
                readonly name: "renewalCount";
                readonly type: "uint32";
                readonly indexed: false;
                readonly internalType: "uint32";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "TransferBatch";
            readonly inputs: readonly [{
                readonly name: "operator";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "from";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "to";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "ids";
                readonly type: "uint256[]";
                readonly indexed: false;
                readonly internalType: "uint256[]";
            }, {
                readonly name: "values";
                readonly type: "uint256[]";
                readonly indexed: false;
                readonly internalType: "uint256[]";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "TransferSingle";
            readonly inputs: readonly [{
                readonly name: "operator";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "from";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "to";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "id";
                readonly type: "uint256";
                readonly indexed: false;
                readonly internalType: "uint256";
            }, {
                readonly name: "value";
                readonly type: "uint256";
                readonly indexed: false;
                readonly internalType: "uint256";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "URI";
            readonly inputs: readonly [{
                readonly name: "value";
                readonly type: "string";
                readonly indexed: false;
                readonly internalType: "string";
            }, {
                readonly name: "id";
                readonly type: "uint256";
                readonly indexed: true;
                readonly internalType: "uint256";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "error";
            readonly name: "AccessControlBadConfirmation";
            readonly inputs: readonly [];
        }, {
            readonly type: "error";
            readonly name: "AccessControlUnauthorizedAccount";
            readonly inputs: readonly [{
                readonly name: "account";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "neededRole";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }];
        }, {
            readonly type: "error";
            readonly name: "ERC1155InsufficientBalance";
            readonly inputs: readonly [{
                readonly name: "sender";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "balance";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "needed";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "tokenId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
        }, {
            readonly type: "error";
            readonly name: "ERC1155InvalidApprover";
            readonly inputs: readonly [{
                readonly name: "approver";
                readonly type: "address";
                readonly internalType: "address";
            }];
        }, {
            readonly type: "error";
            readonly name: "ERC1155InvalidArrayLength";
            readonly inputs: readonly [{
                readonly name: "idsLength";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "valuesLength";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
        }, {
            readonly type: "error";
            readonly name: "ERC1155InvalidOperator";
            readonly inputs: readonly [{
                readonly name: "operator";
                readonly type: "address";
                readonly internalType: "address";
            }];
        }, {
            readonly type: "error";
            readonly name: "ERC1155InvalidReceiver";
            readonly inputs: readonly [{
                readonly name: "receiver";
                readonly type: "address";
                readonly internalType: "address";
            }];
        }, {
            readonly type: "error";
            readonly name: "ERC1155InvalidSender";
            readonly inputs: readonly [{
                readonly name: "sender";
                readonly type: "address";
                readonly internalType: "address";
            }];
        }, {
            readonly type: "error";
            readonly name: "ERC1155MissingApprovalForAll";
            readonly inputs: readonly [{
                readonly name: "operator";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "owner";
                readonly type: "address";
                readonly internalType: "address";
            }];
        }, {
            readonly type: "error";
            readonly name: "ReentrancyGuardReentrantCall";
            readonly inputs: readonly [];
        }], any, undefined, "earliest", undefined>;
        payments: viem.GetContractEventsReturnType<readonly [{
            readonly type: "constructor";
            readonly inputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "getMerchantBalance";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "getMerchantPlan";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "tuple";
                readonly internalType: "struct ISubscriptionTypes.MerchantPlan";
                readonly components: readonly [{
                    readonly name: "payoutAddress";
                    readonly type: "address";
                    readonly internalType: "address";
                }, {
                    readonly name: "subscriptionPeriod";
                    readonly type: "uint64";
                    readonly internalType: "uint64";
                }, {
                    readonly name: "gracePeriod";
                    readonly type: "uint64";
                    readonly internalType: "uint64";
                }, {
                    readonly name: "isActive";
                    readonly type: "bool";
                    readonly internalType: "bool";
                }, {
                    readonly name: "totalSubscribers";
                    readonly type: "uint256";
                    readonly internalType: "uint256";
                }];
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "getMerchantPrice";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "isMerchantTokenAccepted";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "bool";
                readonly internalType: "bool";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "owner";
            readonly inputs: readonly [];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "platformFeeBps";
            readonly inputs: readonly [];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "uint16";
                readonly internalType: "uint16";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "registerMerchant";
            readonly inputs: readonly [{
                readonly name: "payoutAddress";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "subscriptionPeriod";
                readonly type: "uint64";
                readonly internalType: "uint64";
            }, {
                readonly name: "gracePeriod";
                readonly type: "uint64";
                readonly internalType: "uint64";
            }];
            readonly outputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "renounceOwnership";
            readonly inputs: readonly [];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "setMerchantPrice";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "paymentToken";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "price";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "setPlatformFee";
            readonly inputs: readonly [{
                readonly name: "_feeBps";
                readonly type: "uint16";
                readonly internalType: "uint16";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "setSubscriptionNFT";
            readonly inputs: readonly [{
                readonly name: "_nft";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "subscribe";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "paymentToken";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "payable";
        }, {
            readonly type: "function";
            readonly name: "subscriptionNFT";
            readonly inputs: readonly [];
            readonly outputs: readonly [{
                readonly name: "";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly stateMutability: "view";
        }, {
            readonly type: "function";
            readonly name: "transferOwnership";
            readonly inputs: readonly [{
                readonly name: "newOwner";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "updateMerchantPlan";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "payoutAddress";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "subscriptionPeriod";
                readonly type: "uint64";
                readonly internalType: "uint64";
            }, {
                readonly name: "isActive";
                readonly type: "bool";
                readonly internalType: "bool";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "withdrawMerchantBalance";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "function";
            readonly name: "withdrawPlatformFees";
            readonly inputs: readonly [{
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "to";
                readonly type: "address";
                readonly internalType: "address";
            }];
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
        }, {
            readonly type: "event";
            readonly name: "MerchantRegistered";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly indexed: true;
                readonly internalType: "uint256";
            }, {
                readonly name: "owner";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "payoutAddress";
                readonly type: "address";
                readonly indexed: false;
                readonly internalType: "address";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "MerchantWithdrawal";
            readonly inputs: readonly [{
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly indexed: true;
                readonly internalType: "uint256";
            }, {
                readonly name: "token";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "amount";
                readonly type: "uint256";
                readonly indexed: false;
                readonly internalType: "uint256";
            }, {
                readonly name: "to";
                readonly type: "address";
                readonly indexed: false;
                readonly internalType: "address";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "OwnershipTransferred";
            readonly inputs: readonly [{
                readonly name: "previousOwner";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "newOwner";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "PaymentReceived";
            readonly inputs: readonly [{
                readonly name: "user";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "merchantId";
                readonly type: "uint256";
                readonly indexed: true;
                readonly internalType: "uint256";
            }, {
                readonly name: "paymentToken";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "amount";
                readonly type: "uint256";
                readonly indexed: false;
                readonly internalType: "uint256";
            }, {
                readonly name: "platformFee";
                readonly type: "uint256";
                readonly indexed: false;
                readonly internalType: "uint256";
            }, {
                readonly name: "period";
                readonly type: "uint64";
                readonly indexed: false;
                readonly internalType: "uint64";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "event";
            readonly name: "PlatformFeeWithdrawal";
            readonly inputs: readonly [{
                readonly name: "token";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            }, {
                readonly name: "amount";
                readonly type: "uint256";
                readonly indexed: false;
                readonly internalType: "uint256";
            }, {
                readonly name: "to";
                readonly type: "address";
                readonly indexed: false;
                readonly internalType: "address";
            }];
            readonly anonymous: false;
        }, {
            readonly type: "error";
            readonly name: "OwnableInvalidOwner";
            readonly inputs: readonly [{
                readonly name: "owner";
                readonly type: "address";
                readonly internalType: "address";
            }];
        }, {
            readonly type: "error";
            readonly name: "OwnableUnauthorizedAccount";
            readonly inputs: readonly [{
                readonly name: "account";
                readonly type: "address";
                readonly internalType: "address";
            }];
        }, {
            readonly type: "error";
            readonly name: "ReentrancyGuardReentrantCall";
            readonly inputs: readonly [];
        }, {
            readonly type: "error";
            readonly name: "SafeERC20FailedOperation";
            readonly inputs: readonly [{
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }];
        }], any, undefined, "earliest", undefined>;
    }>;
    /**
     * Calculate total spent by user
     */
    calculateTotalSpent(user: Address, merchantId?: bigint): Promise<bigint>;
    /**
     * Check if user needs to renew soon
     */
    needsRenewalSoon(user: Address, merchantId: bigint, thresholdDays?: number): Promise<boolean>;
    /**
     * Get NFT balance for a user and merchant
     */
    getNFTBalance(user: Address, merchantId: bigint): Promise<bigint>;
    /**
     * Get NFT URI for a subscription
     */
    getNFTUri(tokenId: bigint): Promise<string>;
    /**
     * Format subscription period for display
     */
    formatPeriod(seconds: bigint): string;
    /**
     * Format price for display
     */
    formatPrice(price: bigint, decimals?: number): string;
}

interface TokenInfo {
    address: Address;
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: bigint;
}
interface TokenBalance$1 {
    address: Address;
    symbol: string;
    decimals: number;
    balance: bigint;
    formattedBalance: string;
}
/**
 * Service for managing ERC20 tokens and test token minting
 * Handles token operations, approvals, minting for testing, and balance management
 */
declare class TokenService {
    private publicClient;
    private walletClient?;
    private tokenContracts;
    constructor(publicClient: PublicClient, walletClient?: WalletClient | undefined);
    /**
     * Get or create token contract instance
     */
    private getTokenContract;
    /**
     * Get token information
     */
    getTokenInfo(tokenAddress: Address): Promise<TokenInfo>;
    /**
     * Get token balance for an address
     */
    getBalance(tokenAddress: Address, userAddress: Address): Promise<bigint>;
    /**
     * Get multiple token balances
     */
    getBalances(tokens: Array<{
        address: Address;
        symbol: string;
        decimals: number;
    }>, userAddress: Address): Promise<TokenBalance$1[]>;
    /**
     * Approve token spending
     */
    approve(params: {
        tokenAddress: Address;
        spender: Address;
        amount: bigint;
    }): Promise<Hash>;
    /**
     * Check token allowance
     */
    getAllowance(params: {
        tokenAddress: Address;
        owner: Address;
        spender: Address;
    }): Promise<bigint>;
    /**
     * Approve if needed
     */
    approveIfNeeded(params: {
        tokenAddress: Address;
        spender: Address;
        amount: bigint;
    }): Promise<{
        needed: boolean;
        hash?: Hash;
    }>;
    /**
     * Mint test tokens (only for MockERC20)
     */
    mintTestTokens(params: {
        tokenAddress: Address;
        to: Address;
        amount: string;
    }): Promise<Hash>;
    /**
     * Burn tokens
     */
    burnTokens(params: {
        tokenAddress: Address;
        amount: string;
    }): Promise<Hash>;
    /**
     * Transfer tokens
     */
    transfer(params: {
        tokenAddress: Address;
        to: Address;
        amount: string;
    }): Promise<Hash>;
    /**
     * Get faucet tokens for testing
     */
    getFaucetTokens(userAddress: Address): Promise<{
        tokenAddress: Address;
        amount: bigint;
        hash: Hash;
    }>;
    /**
     * Watch token transfers
     */
    watchTransfers(params: {
        tokenAddress: Address;
        from?: Address;
        to?: Address;
        callback: (event: {
            from: Address;
            to: Address;
            value: bigint;
        }) => void;
    }): viem.WatchContractEventReturnType;
    /**
     * Watch approvals
     */
    watchApprovals(params: {
        tokenAddress: Address;
        owner?: Address;
        spender?: Address;
        callback: (event: {
            owner: Address;
            spender: Address;
            value: bigint;
        }) => void;
    }): viem.WatchContractEventReturnType;
    /**
     * Get supported tokens for the platform
     */
    getSupportedTokens(): Array<{
        address: Address;
        name: string;
        symbol: string;
        decimals: number;
        isNative: boolean;
    }>;
    /**
     * Format token amount for display
     */
    formatTokenAmount(amount: bigint, decimals: number, precision?: number): string;
    /**
     * Parse token amount from user input
     */
    parseTokenAmount(amount: string, decimals: number): bigint;
    /**
     * Estimate gas for token operations
     */
    estimateGas(params: {
        operation: 'approve' | 'transfer' | 'mint';
        tokenAddress: Address;
        to?: Address;
        amount?: bigint;
    }): Promise<bigint>;
    /**
     * Check if address has sufficient balance
     */
    hasSufficientBalance(params: {
        tokenAddress: Address;
        userAddress: Address;
        requiredAmount: bigint;
    }): Promise<boolean>;
}

interface NFTMetadata$1 {
    tokenId: bigint;
    merchantId: bigint;
    subscriber: Address;
    expiresAt: bigint;
    renewalCount: bigint;
    uri: string;
}
interface NFTBalance {
    merchantId: bigint;
    balance: bigint;
    isActive: boolean;
}
/**
 * Service for NFT operations
 * Handles ERC1155 subscription NFTs, metadata, transfers, and balance management
 */
declare class NFTService {
    private publicClient;
    private walletClient?;
    constructor(publicClient: PublicClient, walletClient?: WalletClient | undefined);
    /**
     * Get NFT balance for a user and merchant
     */
    getBalance(user: Address, merchantId: bigint): Promise<bigint>;
    /**
     * Get NFT balances for a user with specific merchant IDs
     */
    getBalancesForMerchants(user: Address, merchantIds: bigint[]): Promise<NFTBalance[]>;
    /**
     * Get NFT metadata URI
     */
    getTokenURI(tokenId: bigint): Promise<string>;
    /**
     * Get full NFT metadata including on-chain data
     */
    getFullMetadata(user: Address, merchantId: bigint): Promise<NFTMetadata$1>;
    /**
     * Check if NFT transfer is allowed
     */
    isTransferAllowed(from: Address, to: Address, merchantId: bigint): Promise<boolean>;
    /**
     * Transfer NFT (subscription)
     */
    safeTransferFrom(params: {
        from: Address;
        to: Address;
        merchantId: bigint;
        amount?: bigint;
        data?: `0x${string}`;
    }): Promise<Hash>;
    /**
     * Batch transfer multiple NFTs
     */
    safeBatchTransferFrom(params: {
        from: Address;
        to: Address;
        merchantIds: bigint[];
        amounts?: bigint[];
        data?: `0x${string}`;
    }): Promise<Hash>;
    /**
     * Set approval for all NFTs
     */
    setApprovalForAll(operator: Address, approved: boolean): Promise<Hash>;
    /**
     * Check if operator is approved for all
     */
    isApprovedForAll(owner: Address, operator: Address): Promise<boolean>;
    /**
     * Burn expired subscription NFT
     */
    burnExpiredSubscription(params: {
        subscriber: Address;
        merchantId: bigint;
    }): Promise<Hash>;
    /**
     * Get total supply for a token ID
     */
    getTotalSupply(merchantId: bigint): Promise<bigint>;
    /**
     * Get all token holders for a merchant
     */
    getTokenHolders(merchantId: bigint): Promise<Address[]>;
    /**
     * Check if subscription is active
     */
    isSubscriptionActive(user: Address, merchantId: bigint): Promise<boolean>;
    /**
     * Get subscription expiry timestamp
     */
    getSubscriptionExpiry(user: Address, merchantId: bigint): Promise<bigint>;
    /**
     * Watch transfer events
     */
    watchTransferEvents(params: {
        from?: Address;
        to?: Address;
        merchantId?: bigint;
        callback: (event: {
            operator: Address;
            from: Address;
            to: Address;
            id: bigint;
            value: bigint;
        }) => void;
    }): viem.WatchContractEventReturnType;
    /**
     * Watch batch transfer events
     */
    watchBatchTransferEvents(params: {
        from?: Address;
        to?: Address;
        callback: (event: {
            operator: Address;
            from: Address;
            to: Address;
            ids: bigint[];
            values: bigint[];
        }) => void;
    }): viem.WatchContractEventReturnType;
    /**
     * Watch approval events
     */
    watchApprovalEvents(params: {
        owner?: Address;
        operator?: Address;
        callback: (event: {
            account: Address;
            operator: Address;
            approved: boolean;
        }) => void;
    }): viem.WatchContractEventReturnType;
    /**
     * Generate NFT image/metadata (placeholder)
     */
    generateNFTMetadata(params: {
        merchantId: bigint;
        merchantName: string;
        expiresAt: bigint;
        renewalCount: bigint;
        tier?: string;
    }): any;
    /**
     * Get contract instance
     */
    private getContract;
    /**
     * Check if NFT features are supported
     */
    supportsInterface(interfaceId: string): Promise<boolean>;
}

type EventCallback$1<T = any> = (event: T, log: Log) => void;
/**
 * Service for monitoring blockchain events
 * Handles real-time event subscriptions, historical queries, and event aggregation
 */
declare class EventMonitoringService {
    private publicClient;
    private unsubscribers;
    private eventCache;
    constructor(publicClient: PublicClient);
    /**
     * Monitor payment events in real-time
     */
    monitorPaymentEvents(params: {
        subscriber?: Address;
        merchantId?: bigint;
        onEvent: EventCallback$1<{
            subscriber: Address;
            merchantId: bigint;
            paymentToken: Address;
            amount: bigint;
            platformFee: bigint;
            subscriptionPeriod: bigint;
            transactionHash: Hash;
            blockNumber: bigint;
        }>;
    }): string;
    /**
     * Monitor subscription lifecycle events
     */
    monitorSubscriptionLifecycle(params: {
        subscriber?: Address;
        merchantId?: bigint;
        onMinted?: EventCallback$1<{
            subscriber: Address;
            merchantId: bigint;
            expiresAt: bigint;
            blockNumber: bigint;
            transactionHash: Hash;
        }>;
        onRenewed?: EventCallback$1<{
            subscriber: Address;
            merchantId: bigint;
            newExpiresAt: bigint;
            renewalCount: bigint;
            blockNumber: bigint;
            transactionHash: Hash;
        }>;
        onExpired?: EventCallback$1<{
            subscriber: Address;
            merchantId: bigint;
        }>;
        onBurned?: EventCallback$1<{
            subscriber: Address;
            merchantId: bigint;
        }>;
    }): string;
    /**
     * Monitor merchant events
     */
    monitorMerchantEvents(params: {
        merchantId?: bigint;
        onRegistered?: EventCallback$1<{
            merchantId: bigint;
            owner: Address;
            payoutAddress: Address;
            blockNumber: bigint;
            transactionHash: Hash;
        }>;
        onWithdrawal?: EventCallback$1<{
            merchantId: bigint;
            token: Address;
            amount: bigint;
            payoutAddress: Address;
            blockNumber: bigint;
            transactionHash: Hash;
        }>;
    }): string;
    /**
     * Get historical events
     */
    getHistoricalEvents(params: {
        contractAddress: Address;
        eventName: string;
        fromBlock?: bigint;
        toBlock?: bigint;
        args?: Record<string, any>;
    }): Promise<any[]>;
    /**
     * Get aggregated statistics from events
     */
    getEventStatistics(params: {
        startBlock?: bigint;
        endBlock?: bigint;
    }): Promise<{
        totalPayments: number;
        totalVolume: bigint;
        uniqueSubscribers: number;
        totalMerchants: number;
        totalRenewals: number;
    }>;
    /**
     * Monitor multiple events with a single subscription
     */
    monitorMultipleEvents(configs: Array<{
        address: Address;
        events: Array<{
            name: string;
            callback: EventCallback$1;
        }>;
    }>): string;
    /**
     * Stop monitoring events
     */
    stopMonitoring(monitorId: string): boolean;
    /**
     * Stop all monitoring
     */
    stopAllMonitoring(): void;
    /**
     * Get cached events
     */
    getCachedEvents(key: string): any[];
    /**
     * Cache events for later retrieval
     */
    cacheEvents(key: string, events: any[]): void;
    /**
     * Clear event cache
     */
    clearCache(key?: string): void;
    /**
     * Watch for specific transaction
     */
    waitForTransaction(txHash: Hash): Promise<{
        status: 'success' | 'reverted';
        events: any[];
    }>;
    /**
     * Create event filter for custom monitoring
     */
    createEventFilter(params: {
        address: Address;
        eventSignature: string;
        args?: any[];
    }): {
        address: `0x${string}`;
        topics: any[];
    };
}

interface PlatformMetrics$1 {
    totalMerchants: number;
    activeMerchants: number;
    totalSubscribers: number;
    activeSubscriptions: number;
    totalVolume: bigint;
    totalPlatformFees: bigint;
    averageSubscriptionPrice: bigint;
    totalRenewals: number;
}
interface MerchantAnalytics$1 {
    merchantId: bigint;
    totalRevenue: bigint;
    totalSubscribers: number;
    activeSubscribers: number;
    averageSubscriptionValue: bigint;
    churnRate: number;
    renewalRate: number;
    topPaymentTokens: Array<{
        token: Address;
        volume: bigint;
        transactions: number;
    }>;
    revenueOverTime: Array<{
        timestamp: bigint;
        amount: bigint;
    }>;
}
interface UserAnalytics {
    totalSpent: bigint;
    activeSubscriptions: number;
    totalSubscriptions: number;
    averageSpend: bigint;
    subscriptionHistory: Array<{
        merchantId: bigint;
        startDate: bigint;
        expiresAt: bigint;
        amount: bigint;
        renewalCount: number;
    }>;
}
interface TimeSeriesData {
    timestamp: bigint;
    value: number | bigint;
    label?: string;
}
/**
 * Service for platform analytics and metrics
 * Provides comprehensive analytics for platform, merchants, and users
 */
declare class AnalyticsService {
    private publicClient;
    constructor(publicClient: PublicClient);
    /**
     * Get overall platform metrics
     */
    getPlatformMetrics(params?: {
        fromBlock?: bigint;
        toBlock?: bigint;
    }): Promise<PlatformMetrics$1>;
    /**
     * Get analytics for a specific merchant
     */
    getMerchantAnalytics(merchantId: bigint, params?: {
        fromBlock?: bigint;
        toBlock?: bigint;
    }): Promise<MerchantAnalytics$1>;
    /**
     * Get analytics for a specific user
     */
    getUserAnalytics(userAddress: Address, params?: {
        fromBlock?: bigint;
        toBlock?: bigint;
    }): Promise<UserAnalytics>;
    /**
     * Get revenue trends over time
     */
    getRevenueTrends(params: {
        merchantId?: bigint;
        interval: 'daily' | 'weekly' | 'monthly';
        fromBlock?: bigint;
        toBlock?: bigint;
    }): Promise<TimeSeriesData[]>;
    /**
     * Get subscription growth metrics
     */
    getSubscriptionGrowth(params: {
        merchantId?: bigint;
        interval: 'daily' | 'weekly' | 'monthly';
        fromBlock?: bigint;
        toBlock?: bigint;
    }): Promise<TimeSeriesData[]>;
    /**
     * Get token distribution analytics
     */
    getTokenDistribution(params?: {
        merchantId?: bigint;
        fromBlock?: bigint;
        toBlock?: bigint;
    }): Promise<Array<{
        token: Address;
        symbol: string;
        volume: bigint;
        transactions: number;
        percentage: number;
    }>>;
    /**
     * Calculate platform conversion rate
     */
    getConversionMetrics(): Promise<{
        visitorToSubscriber: number;
        trialToPayment: number;
        renewalRate: number;
    }>;
    private getActiveSubscriptionCount;
    private getActiveMerchantSubscribers;
    private calculateChurnRate;
    private getWeekNumber;
    /**
     * Format analytics data for display
     */
    formatMetrics(metrics: PlatformMetrics$1): any;
    /**
     * Get total number of subscriptions (simplified version for tests)
     */
    getTotalSubscriptions(): Promise<bigint>;
    /**
     * Get merchant statistics (simplified version for tests)
     */
    getMerchantStatistics(merchantId: bigint): Promise<{
        totalRevenue: bigint;
        activeSubscriptions: bigint;
        totalSubscribers: bigint;
    }>;
    /**
     * Get platform statistics (simplified version for tests)
     */
    getPlatformStatistics(): Promise<{
        totalMerchants: bigint;
        totalSubscriptions: bigint;
        totalVolume: bigint;
    }>;
}

/**
 * Service for admin and owner operations
 * Handles platform configuration, fee management, role management, and emergency functions
 */
declare class AdminService {
    private publicClient;
    private walletClient?;
    private managerContract;
    private nftContract;
    constructor(publicClient: PublicClient, walletClient?: WalletClient | undefined);
    /**
     * Check if address is contract owner
     */
    isOwner(address: Address): Promise<boolean>;
    /**
     * Check if address has specific role
     */
    hasRole(role: string, address: Address): Promise<boolean>;
    /**
     * Set platform fee (owner only)
     */
    setPlatformFee(feeBps: number): Promise<Hash>;
    /**
     * Get current platform fee
     */
    getPlatformFee(): Promise<number>;
    /**
     * Set subscription NFT contract address (one-time setup)
     */
    setSubscriptionNFT(nftAddress: Address): Promise<Hash>;
    /**
     * Set reactive contract address on NFT
     */
    setReactiveContract(reactiveAddress: Address): Promise<Hash>;
    /**
     * Grant role to address
     */
    grantRole(role: string, address: Address): Promise<Hash>;
    /**
     * Revoke role from address
     */
    revokeRole(role: string, address: Address): Promise<Hash>;
    /**
     * Withdraw platform fees
     */
    withdrawPlatformFees(params: {
        token: Address;
        to: Address;
    }): Promise<Hash>;
    /**
     * Get platform fee balance for a token
     */
    getPlatformFeeBalance(token: Address): Promise<bigint>;
    /**
     * Transfer ownership of manager contract
     */
    transferOwnership(newOwner: Address): Promise<Hash>;
    /**
     * Renounce ownership (irreversible!)
     */
    renounceOwnership(): Promise<Hash>;
    /**
     * Pause NFT transfers (emergency)
     */
    pauseNFT(): Promise<Hash>;
    /**
     * Unpause NFT transfers
     */
    unpauseNFT(): Promise<Hash>;
    /**
     * Check if NFT is paused
     */
    isNFTPaused(): Promise<boolean>;
    /**
     * Update base URI for NFT metadata
     */
    setBaseURI(uri: string): Promise<Hash>;
    /**
     * Get contract configuration
     */
    getContractConfig(): Promise<{
        manager: {
            owner: Address;
            platformFeeBps: number;
            subscriptionNFT: Address;
        };
        nft: {
            baseURI: string;
            paused: boolean;
            reactiveContract: Address;
        };
    }>;
    /**
     * Get platform statistics
     */
    getPlatformStats(): Promise<{
        totalMerchants: number;
        totalSubscriptions: number;
        platformRevenue: Map<Address, bigint>;
    }>;
    /**
     * Emergency withdrawal (if contract has stuck funds)
     */
    emergencyWithdraw(params: {
        contract: 'manager' | 'nft';
        token: Address;
        to: Address;
        amount: bigint;
    }): Promise<Hash>;
    /**
     * Batch operations for efficiency
     */
    batchGrantRoles(params: Array<{
        role: string;
        address: Address;
    }>): Promise<Hash[]>;
    /**
     * Monitor admin events
     */
    watchAdminEvents(callback: (event: any) => void): () => void;
    /**
     * Get role hash for a role name
     */
    private getRoleHash;
    /**
     * Validate admin permissions before operation
     */
    validateAdminPermissions(address: Address): Promise<{
        isOwner: boolean;
        isManager: boolean;
        isPauser: boolean;
    }>;
}

interface ReactiveEvent {
    blockNumber: bigint;
    timestamp: bigint;
    eventType: 'PaymentProcessed' | 'SubscriptionExpired' | 'CronTriggered';
    data: any;
}
/**
 * Service for Reactive Network operations
 * Handles cross-chain event monitoring, subscription automation, and CRON jobs
 */
declare class ReactiveNetworkService {
    private publicClient;
    private walletClient?;
    private reactiveProvider?;
    private readonly REACTIVE_RPC;
    private readonly L1_CHAIN_ID;
    constructor(publicClient: PublicClient, walletClient?: WalletClient | undefined, reactiveProvider?: PublicClient | undefined);
    /**
     * Subscribe to payment events from L1
     */
    subscribeToPaymentEvents(params: {
        chainId?: bigint;
        contractAddress?: Address;
    }): Promise<Hash>;
    /**
     * Subscribe to CRON job for expiry checks
     */
    subscribeToCronJob(params: {
        interval: bigint;
    }): Promise<Hash>;
    /**
     * Get tracked subscription expirations
     * Note: The reactive contract tracks expirations but doesn't expose subscription lists
     * This method gets expiring subscriptions within a time range
     */
    getExpiringSubscriptions(beforeTimestamp?: bigint, limit?: bigint): Promise<{
        users: Address[];
        merchantIds: bigint[];
    }>;
    /**
     * Get tracked expiration for a specific user and merchant
     */
    getTrackedExpiration(user: Address, merchantId: bigint): Promise<bigint>;
    /**
     * Get debt amount from reactive contract
     */
    getDebt(): Promise<bigint>;
    /**
     * Pause reactive contract
     */
    pauseContract(): Promise<Hash>;
    /**
     * Resume reactive contract
     */
    resumeContract(): Promise<Hash>;
    /**
     * Check if reactive contract has REACTIVE_ROLE on NFT contract
     */
    hasReactiveRole(): Promise<boolean>;
    /**
     * Get REACT token balance
     */
    getReactBalance(address: Address): Promise<bigint>;
    /**
     * Fund reactive contract with REACT tokens
     */
    fundReactiveContract(amount: string): Promise<Hash>;
    /**
     * Get reactive contract configuration
     * Note: The reactive contract doesn't expose these values directly
     * These would typically be stored in the contract's config or retrieved from events
     */
    getReactiveConfig(): Promise<{
        subscriptionManager: Address;
        subscriptionNFT: Address;
        targetChainId: bigint;
        paymentEventSubscriptionId?: bigint;
        cronSubscriptionId?: bigint;
    }>;
    /**
     * Monitor reactive events
     */
    watchReactiveEvents(params: {
        onPaymentProcessed?: (event: {
            subscriber: Address;
            merchantId: bigint;
            amount: bigint;
            token: Address;
        }) => void;
        onSubscriptionExpired?: (event: {
            subscriber: Address;
            merchantId: bigint;
        }) => void;
        onCronTriggered?: (event: {
            timestamp: bigint;
            processedCount: number;
        }) => void;
    }): () => void;
    /**
     * Get reactive event history
     */
    getEventHistory(params?: {
        fromBlock?: bigint;
        toBlock?: bigint;
        eventType?: 'PaymentProcessed' | 'SubscriptionExpired' | 'CronTriggered';
    }): Promise<ReactiveEvent[]>;
    /**
     * Estimate gas for reactive operations
     */
    estimateReactiveGas(operation: 'subscribe' | 'cancel' | 'process'): Promise<bigint>;
    /**
     * Get reactive network status
     */
    getNetworkStatus(): Promise<{
        chainId: number;
        blockNumber: bigint;
        gasPrice: bigint;
        isConnected: boolean;
    }>;
    /**
     * Setup initial reactive subscriptions
     */
    setupInitialSubscriptions(): Promise<{
        paymentSubscription?: Hash;
        cronSubscription?: Hash;
    }>;
    /**
     * Get contract instance
     */
    private getContract;
    /**
     * Calculate subscription costs
     */
    calculateSubscriptionCost(params: {
        duration: 'hour' | 'day' | 'week' | 'month';
        eventType: 'payment' | 'cron';
    }): bigint;
}

interface SDKConfig {
    chain: 'sepolia' | 'mainnet' | 'polygon' | 'base' | string;
    walletClient?: WalletClient;
    publicClient?: PublicClient;
    privateKey?: string;
    rpc?: string;
    readOnly?: boolean;
}
interface SubscriptionStatus {
    isActive: boolean;
    expiresAt: bigint;
    renewalCount: bigint;
    lastRenewal: bigint;
    merchantId: bigint;
}
interface SubscribeParams {
    merchantId: bigint;
    paymentToken: Address | 'ETH';
    autoApprove?: boolean;
}
interface SubscribeResult {
    hash: Hash;
    approvalHash?: Hash;
}
interface Merchant {
    id: bigint;
    owner: Address;
    payoutAddress: Address;
    subscriptionPeriod: bigint;
    gracePeriod: bigint;
    isActive: boolean;
}
interface MerchantRegistrationParams {
    payoutAddress: Address;
    subscriptionPeriod: bigint;
    gracePeriod: bigint;
}
interface MerchantPriceParams {
    merchantId: bigint;
    token: Address | 'ETH';
    price: bigint;
}
interface Token {
    address: Address;
    symbol: string;
    name: string;
    decimals: number;
    isNative?: boolean;
}
interface TokenBalance {
    token: Token;
    balance: bigint;
    formattedBalance: string;
}
type EventCallback<T = any> = (data: T) => void | Promise<void>;
interface EventListeners {
    onPaymentReceived?: EventCallback<PaymentEvent>;
    onSubscriptionMinted?: EventCallback<SubscriptionMintedEvent>;
    onSubscriptionRenewed?: EventCallback<SubscriptionRenewedEvent>;
    onSubscriptionExpired?: EventCallback<SubscriptionExpiredEvent>;
    onMerchantRegistered?: EventCallback<MerchantRegisteredEvent>;
    onMerchantWithdrawal?: EventCallback<MerchantWithdrawalEvent>;
}
interface PaymentEvent {
    subscriber: Address;
    merchantId: bigint;
    paymentToken: Address;
    amount: bigint;
    platformFee: bigint;
    subscriptionPeriod: bigint;
    blockNumber: bigint;
    transactionHash: Hash;
}
interface SubscriptionMintedEvent {
    subscriber: Address;
    merchantId: bigint;
    expiresAt: bigint;
    blockNumber: bigint;
    transactionHash: Hash;
}
interface SubscriptionRenewedEvent {
    subscriber: Address;
    merchantId: bigint;
    newExpiresAt: bigint;
    renewalCount: bigint;
    blockNumber: bigint;
    transactionHash: Hash;
}
interface SubscriptionExpiredEvent {
    subscriber: Address;
    merchantId: bigint;
    blockNumber: bigint;
    transactionHash: Hash;
}
interface MerchantRegisteredEvent {
    merchantId: bigint;
    owner: Address;
    payoutAddress: Address;
    blockNumber: bigint;
    transactionHash: Hash;
}
interface MerchantWithdrawalEvent {
    merchantId: bigint;
    token: Address;
    amount: bigint;
    payoutAddress: Address;
    blockNumber: bigint;
    transactionHash: Hash;
}
interface PlatformMetrics {
    totalMerchants: number;
    activeMerchants: number;
    totalSubscribers: number;
    activeSubscriptions: number;
    totalVolume: bigint;
    totalPlatformFees: bigint;
    averageSubscriptionPrice: bigint;
    totalRenewals: number;
}
interface MerchantAnalytics {
    merchantId: bigint;
    totalRevenue: bigint;
    totalSubscribers: number;
    activeSubscribers: number;
    averageSubscriptionValue: bigint;
    churnRate: number;
    renewalRate: number;
}
interface NFTMetadata {
    tokenId: bigint;
    merchantId: bigint;
    subscriber: Address;
    expiresAt: bigint;
    renewalCount: bigint;
    uri: string;
}
declare enum SDKErrorCode {
    WALLET_NOT_CONNECTED = "WALLET_NOT_CONNECTED",
    INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE",
    APPROVAL_NEEDED = "APPROVAL_NEEDED",
    SUBSCRIPTION_EXISTS = "SUBSCRIPTION_EXISTS",
    MERCHANT_NOT_FOUND = "MERCHANT_NOT_FOUND",
    INVALID_CHAIN = "INVALID_CHAIN",
    TRANSACTION_FAILED = "TRANSACTION_FAILED",
    NETWORK_ERROR = "NETWORK_ERROR"
}
declare class SDKError extends Error {
    code: SDKErrorCode;
    details?: any | undefined;
    constructor(code: SDKErrorCode, message: string, details?: any | undefined);
}

interface ChainConfig {
    chainId: number;
    name: string;
    rpc: string;
    explorer: string;
    contracts: {
        subscriptionManager: Address;
        subscriptionNFT: Address;
        testToken?: Address;
    };
    reactive?: {
        chainId: number;
        rpc: string;
        contract: Address;
    };
}
declare const CHAIN_CONFIGS: Record<string, ChainConfig>;
declare function getChainConfig(chain: string): ChainConfig;
declare function getExplorerUrl(chain: string, hash: string): string;
declare function getAddressExplorerUrl(chain: string, address: string): string;

/**
 * Main SDK class for subscription NFT platform
 * Wraps all services and provides simplified API for developers
 */
declare class SubscriptionSDK extends EventEmitter {
    publicClient: PublicClient;
    walletClient?: WalletClient;
    chainConfig: ChainConfig;
    merchants: MerchantService;
    subscriptions: SubscriptionService;
    tokens: TokenService;
    nfts: NFTService;
    events: EventMonitoringService;
    analytics: AnalyticsService;
    admin: AdminService;
    reactive: ReactiveNetworkService;
    private eventListeners;
    constructor(config: SDKConfig);
    /**
     * Initialize public client for reading blockchain data
     */
    private initPublicClient;
    /**
     * Initialize wallet client for transactions
     */
    private initWalletClient;
    /**
     * Subscribe to a merchant (simplified)
     */
    subscribe(merchantId: bigint, paymentToken?: Address | 'ETH'): Promise<Hash>;
    /**
     * Check if user has active subscription
     */
    checkAccess(merchantId: bigint, userAddress?: Address): Promise<boolean>;
    /**
     * Get merchant balance
     */
    getMerchantBalance(merchantId: bigint, token?: Address | 'ETH'): Promise<bigint>;
    /**
     * Withdraw merchant earnings
     */
    withdrawMerchantBalance(merchantId: bigint, token?: Address | 'ETH'): Promise<Hash>;
    /**
     * Start monitoring events with callbacks
     */
    startEventMonitoring(listeners: EventListeners): void;
    /**
     * Stop all event monitoring
     */
    stopEventMonitoring(): void;
    /**
     * Get connected wallet address
     */
    getAddress(): Address | undefined;
    /**
     * Check if wallet is connected
     */
    isConnected(): boolean;
    /**
     * Get chain ID
     */
    getChainId(): number;
    /**
     * Get contract addresses
     */
    getContracts(): {
        subscriptionManager: Address;
        subscriptionNFT: Address;
        testToken?: Address;
    };
    /**
     * Wait for transaction confirmation
     */
    waitForTransaction(hash: Hash): Promise<viem.TransactionReceipt>;
    /**
     * Format token amount for display
     */
    formatAmount(amount: bigint, decimals?: number): string;
    /**
     * Parse token amount from string
     */
    parseAmount(amount: string, decimals?: number): bigint;
}

export { AnalyticsService as A, SDKError as B, CHAIN_CONFIGS as C, EventMonitoringService as E, MerchantService as M, NFTService as N, type PaymentEvent as P, ReactiveNetworkService as R, SubscriptionSDK as S, TokenService as T, getExplorerUrl as a, getAddressExplorerUrl as b, type MerchantPlan as c, SubscriptionService as d, AdminService as e, type SDKConfig as f, getChainConfig as g, type SubscriptionStatus as h, type SubscribeParams as i, type SubscribeResult as j, type Merchant as k, type MerchantRegistrationParams as l, type MerchantPriceParams as m, type Token as n, type TokenBalance as o, type EventCallback as p, type EventListeners as q, type SubscriptionMintedEvent as r, type SubscriptionRenewedEvent as s, type SubscriptionExpiredEvent as t, type MerchantRegisteredEvent as u, type MerchantWithdrawalEvent as v, type PlatformMetrics as w, type MerchantAnalytics as x, type NFTMetadata as y, SDKErrorCode as z };
