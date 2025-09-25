import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, CreditCard, ExternalLink, TrendingUp, Users, AlertCircle } from 'lucide-react'
import { type Address } from 'viem'
import { type SubscriptionSDK } from '../core/SubscriptionSDK'
import { useSubscription } from '../hooks/useSubscription'
import { useMerchant } from '../hooks/useMerchant'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { LoadingSkeleton } from './ui/loading'
import { cn, formatCurrency, getTimeRemaining, formatAddress } from '../lib/utils'

export interface SubscriptionCardProps {
  sdk: SubscriptionSDK | null
  merchantId: bigint
  variant?: 'default' | 'detailed' | 'compact'
  showPricing?: boolean
  showStatus?: boolean
  showActions?: boolean
  onSubscribe?: () => void
  onViewDetails?: () => void
  className?: string
}

export function SubscriptionCard({
  sdk,
  merchantId,
  variant = 'default',
  showPricing = true,
  showStatus = true,
  showActions = true,
  onSubscribe,
  onViewDetails,
  className
}: SubscriptionCardProps) {
  const { status, isActive, isLoading, error: subError, subscribe } = useSubscription(sdk, merchantId, sdk?.getAddress())
  const { merchant, balance, isLoading: merchantLoading, error: merchantError } = useMerchant(sdk, merchantId)
  const [price, setPrice] = useState<bigint>(0n)
  const [analytics, setAnalytics] = useState<any>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  // Fetch real price and analytics data
  useEffect(() => {
    if (sdk && merchantId) {
      // Get subscription price
      sdk.subscriptions.getSubscriptionPrice(merchantId, '0x0000000000000000000000000000000000000000' as Address)
        .then(setPrice)
        .catch(console.error)
      
      // Get merchant analytics
      setAnalyticsLoading(true)
      sdk.analytics.getMerchantStatistics(merchantId)
        .then(setAnalytics)
        .catch(console.error)
        .finally(() => setAnalyticsLoading(false))
    }
  }, [sdk, merchantId])

  const error = subError || merchantError

  const handleSubscribe = async () => {
    if (!sdk || isLoading) return
    try {
      const hash = await subscribe('ETH')
      if (hash) {
        onSubscribe?.()
      }
    } catch (err) {
      console.error('Subscription failed:', err)
    }
  }

  if (merchantLoading || analyticsLoading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader>
          <LoadingSkeleton lines={2} />
        </CardHeader>
        <CardContent>
          <LoadingSkeleton lines={3} />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={cn("overflow-hidden border-red-200", className)}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>Failed to load merchant data</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">{error.message}</p>
        </CardContent>
      </Card>
    )
  }

  const getStatusInfo = () => {
    if (isLoading) {
      return { status: 'loading', label: 'Loading...', variant: 'processing' as const }
    }
    if (isActive) {
      return { status: 'active', label: 'Active', variant: 'active' as const }
    }
    return { status: 'inactive', label: 'Subscribe', variant: 'default' as const }
  }

  const statusInfo = getStatusInfo()

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn("group", className)}
      >
        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>M{merchantId.toString()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-sm">Merchant #{merchantId.toString()}</h3>
                    {showPricing && price > 0n && (
                      <p className="text-xs text-gray-600">
                        {formatCurrency(price, 'ETH')} / {getTimeRemaining(merchant?.subscriptionPeriod || 2592000n)}
                      </p>
                    )}
                  </div>
                </div>
              <div className="flex items-center space-x-2">
                {showStatus && (
                  <Badge variant={statusInfo.variant} className="text-xs">
                    {statusInfo.label}
                  </Badge>
                )}
                {showActions && !isActive && (
                  <Button
                    size="sm"
                    onClick={handleSubscribe}
                    disabled={!sdk?.isConnected() || isLoading}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Subscribe
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (variant === 'detailed') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn("group", className)}
      >
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">M{merchantId.toString()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">Merchant #{merchantId.toString()}</CardTitle>
                  <CardDescription className="text-sm mt-1">
                    {merchant?.isActive ? 'Active Subscription Service' : 'Subscription Service'}
                  </CardDescription>
                </div>
              </div>
              {showStatus && (
                <Badge variant={statusInfo.variant} className="text-sm px-3 py-1">
                  {statusInfo.label}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {analytics?.totalSubscribers?.toString() || merchant?.totalSubscribers?.toString() || '0'}
                </div>
                <div className="text-xs text-gray-600 flex items-center justify-center">
                  <Users className="h-3 w-3 mr-1" />
                  Subscribers
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {analytics?.totalRevenue ? formatCurrency(analytics.totalRevenue, 'ETH') : '0'}
                </div>
                <div className="text-xs text-gray-600 flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Revenue
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {analytics?.activeSubscriptions?.toString() || '0'}
                </div>
                <div className="text-xs text-gray-600">Active</div>
              </div>
            </div>

            {/* Pricing */}
            {showPricing && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Subscription Price</span>
                  <span className="text-lg font-bold text-gray-900">
                    {price > 0n ? formatCurrency(price, 'ETH') : 'Loading...'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Duration</span>
                  <span>{getTimeRemaining(merchant?.subscriptionPeriod || 2592000n)}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            {showActions && (
              <div className="flex space-x-3">
                {isActive ? (
                  <Button className="flex-1" disabled>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Active Subscription
                  </Button>
                ) : (
                  <Button
                    className="flex-1"
                    onClick={handleSubscribe}
                    disabled={!sdk?.isConnected() || isLoading}
                    variant="subscription"
                  >
                    {isLoading ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Subscribe Now
                      </>
                    )}
                  </Button>
                )}
                {onViewDetails && (
                  <Button variant="outline" onClick={onViewDetails}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Default variant
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn("group", className)}
    >
      <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-200">
        <CardHeader>
          <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>M{merchantId.toString()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">Merchant #{merchantId.toString()}</CardTitle>
                  <CardDescription className="text-sm">
                    {merchant?.isActive ? 'Active' : 'Inactive'} • {merchant?.totalSubscribers?.toString() || '0'} subscribers
                  </CardDescription>
                </div>
              </div>
            {showStatus && (
              <Badge variant={statusInfo.variant}>
                {statusInfo.label}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {showPricing && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Price</span>
                <span className="text-lg font-semibold">
                  {price > 0n ? formatCurrency(price, 'ETH') : 'Loading...'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Duration</span>
                <span>{getTimeRemaining(merchant?.subscriptionPeriod || 2592000n)}</span>
              </div>
            </div>
          )}

          {showActions && (
            <div className="flex space-x-2">
              {isActive ? (
                <Button className="flex-1" disabled>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Active
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  onClick={handleSubscribe}
                  disabled={!sdk?.isConnected() || isLoading}
                  variant="subscription"
                >
                  {isLoading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </Button>
              )}
              {onViewDetails && (
                <Button variant="outline" size="icon" onClick={onViewDetails}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
