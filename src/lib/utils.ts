import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string, length = 4): string {
  if (!address) return ""
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`
}

export function formatTokenAmount(amount: bigint, decimals: number = 18, displayDecimals: number = 4): string {
  const divisor = BigInt(10 ** decimals)
  const quotient = amount / divisor
  const remainder = amount % divisor
  
  if (remainder === 0n) {
    return quotient.toString()
  }
  
  const remainderStr = remainder.toString().padStart(decimals, '0')
  const decimalPart = remainderStr.slice(0, displayDecimals).replace(/0+$/, '')
  
  if (decimalPart === '') {
    return quotient.toString()
  }
  
  return `${quotient}.${decimalPart}`
}

export function formatCurrency(amount: bigint, token: string = "ETH", decimals: number = 18): string {
  const formatted = formatTokenAmount(amount, decimals)
  return `${formatted} ${token}`
}

export function getTimeRemaining(timestamp: bigint): string {
  const now = BigInt(Math.floor(Date.now() / 1000))
  const remaining = Number(timestamp - now)
  
  if (remaining <= 0) return "Expired"
  
  const days = Math.floor(remaining / 86400)
  const hours = Math.floor((remaining % 86400) / 3600)
  const minutes = Math.floor((remaining % 3600) / 60)
  
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'expired':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'pending':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'processing':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}
