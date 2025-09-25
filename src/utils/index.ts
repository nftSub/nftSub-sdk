import { type Address, type Hash, formatEther, parseEther } from 'viem';
import { SDKError, SDKErrorCode } from '../types';

export function validateAddress(address: string): Address {
  if (!address.startsWith('0x') || address.length !== 42) {
    throw new SDKError(
      SDKErrorCode.INVALID_CHAIN,
      `Invalid address format: ${address}`
    );
  }
  return address as Address;
}

export function formatSubscriptionPeriod(seconds: bigint): string {
  const days = seconds / 86400n;
  if (days >= 30n) {
    const months = days / 30n;
    return `${months} month${months > 1n ? 's' : ''}`;
  }
  if (days >= 7n) {
    const weeks = days / 7n;
    return `${weeks} week${weeks > 1n ? 's' : ''}`;
  }
  return `${days} day${days > 1n ? 's' : ''}`;
}

export function calculateExpiryDate(periodInSeconds: bigint): Date {
  const now = BigInt(Math.floor(Date.now() / 1000));
  const expiryTimestamp = now + periodInSeconds;
  return new Date(Number(expiryTimestamp) * 1000);
}

export function isExpired(expiryTimestamp: bigint): boolean {
  const now = BigInt(Math.floor(Date.now() / 1000));
  return expiryTimestamp <= now;
}

export function formatTokenAmount(amount: bigint, decimals: number = 18): string {
  const divisor = 10n ** BigInt(decimals);
  const whole = amount / divisor;
  const fraction = amount % divisor;
  
  if (fraction === 0n) {
    return whole.toString();
  }
  
  const fractionStr = fraction.toString().padStart(decimals, '0');
  const trimmed = fractionStr.replace(/0+$/, '');
  
  return `${whole}.${trimmed}`;
}

export function parseTokenAmount(amount: string, decimals: number = 18): bigint {
  const parts = amount.split('.');
  const whole = BigInt(parts[0] || '0');
  const fraction = parts[1] || '';
  
  const fractionPadded = fraction.padEnd(decimals, '0').slice(0, decimals);
  const fractionBigInt = BigInt(fractionPadded);
  
  return whole * (10n ** BigInt(decimals)) + fractionBigInt;
}

export function shortenAddress(address: Address): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getTransactionUrl(hash: Hash, chainId: number): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
    137: 'https://polygonscan.com',
    8453: 'https://basescan.org'
  };
  
  const explorer = explorers[chainId];
  if (!explorer) {
    return hash;
  }
  
  return `${explorer}/tx/${hash}`;
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    onRetry?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> {
  const { retries = 3, delay = 1000, onRetry } = options;
  
  let lastError: Error;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i < retries - 1) {
        onRetry?.(lastError, i + 1);
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError!;
}

export function createBatchProcessor<T, R>(
  batchSize: number = 10,
  processor: (items: T[]) => Promise<R[]>
) {
  return async function processBatch(items: T[]): Promise<R[]> {
    const results: R[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await processor(batch);
      results.push(...batchResults);
    }
    
    return results;
  };
}

export class EventAggregator {
  private events: Map<string, any[]> = new Map();
  private flushTimeout: NodeJS.Timeout | null = null;
  private flushInterval: number;
  private onFlush: (events: Map<string, any[]>) => void;
  
  constructor(
    flushInterval: number = 1000,
    onFlush: (events: Map<string, any[]>) => void
  ) {
    this.flushInterval = flushInterval;
    this.onFlush = onFlush;
  }
  
  add(eventType: string, data: any) {
    if (!this.events.has(eventType)) {
      this.events.set(eventType, []);
    }
    
    this.events.get(eventType)!.push(data);
    
    if (!this.flushTimeout) {
      this.flushTimeout = setTimeout(() => this.flush(), this.flushInterval);
    }
  }
  
  flush() {
    if (this.events.size > 0) {
      this.onFlush(new Map(this.events));
      this.events.clear();
    }
    
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }
  }
  
  destroy() {
    this.flush();
  }
}