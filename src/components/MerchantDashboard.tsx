import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  Settings, 
  BarChart3,
  RefreshCw,
  Plus,
  Eye,
  Edit,
  AlertCircle
} from 'lucide-react'
import { type Address } from 'viem'
import { type SubscriptionSDK } from '../core/SubscriptionSDK'
import { useMerchant } from '../hooks/useMerchant'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { LoadingSkeleton, LoadingSpinner } from './ui/loading'
import { cn, formatCurrency, formatAddress } from '../lib/utils'

export interface MerchantDashboardProps {
  sdk: SubscriptionSDK | null
  merchantId: bigint
  onEditMerchant?: () => void
  onViewAnalytics?: () => void
  onAddSubscription?: () => void
  className?: string
}

export function MerchantDashboard({
  sdk,
  merchantId,
  onEditMerchant,
  onViewAnalytics,
  onAddSubscription,
  className
}: MerchantDashboardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [analytics, setAnalytics] = useState<any>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [price, setPrice] = useState<bigint>(0n)
  const { merchant, balance, isLoading, error, refresh } = useMerchant(sdk, merchantId)

  // Fetch real analytics and price data
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

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refresh()
      // Refresh analytics too
      if (sdk) {
        const stats = await sdk.analytics.getMerchantStatistics(merchantId)
        setAnalytics(stats)
      }
    } catch (err) {
      console.error('Failed to refresh:', err)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Calculate change percentages (mock for now since we don't have historical data)
  const calculateChange = (current: bigint, previous?: bigint) => {
    if (!previous || previous === 0n) return { value: '0%', type: 'neutral' as const }
    const change = ((Number(current) - Number(previous)) / Number(previous)) * 100
    return {
      value: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
      type: change >= 0 ? 'positive' as const : 'negative' as const
    }
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: analytics?.totalRevenue ? formatCurrency(analytics.totalRevenue, 'ETH') : '0 ETH',
      change: calculateChange(analytics?.totalRevenue || 0n).value,
      changeType: calculateChange(analytics?.totalRevenue || 0n).type,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Subscribers',
      value: analytics?.activeSubscriptions?.toString() || merchant?.totalSubscribers?.toString() || '0',
      change: calculateChange(analytics?.activeSubscriptions || 0n).value,
      changeType: calculateChange(analytics?.activeSubscriptions || 0n).type,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Merchant Balance',
      value: balance ? formatCurrency(balance, 'ETH') : '0 ETH',
      change: calculateChange(balance || 0n).value,
      changeType: calculateChange(balance || 0n).type,
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Subscription Period',
      value: merchant?.subscriptionPeriod ? `${Number(merchant.subscriptionPeriod) / 86400} days` : '30 days',
      change: '0%',
      changeType: 'neutral' as const,
      icon: Clock,
      color: 'text-orange-600'
    }
  ]

  if (isLoading || analyticsLoading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <LoadingSkeleton lines={1} className="h-6 w-48" />
              <LoadingSkeleton lines={1} className="h-4 w-32 mt-2" />
            </div>
            <LoadingSpinner />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <LoadingSkeleton key={i} lines={3} />
            ))}
          </div>
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
            <span>Failed to load merchant dashboard</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">{error.message}</p>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("space-y-6", className)}
    >
      {/* Header */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Merchant Dashboard</CardTitle>
              <CardDescription>
                Merchant #{merchantId.toString()} • {merchant?.isActive ? 'Active' : 'Inactive'}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              </Button>
              {onEditMerchant && (
                <Button variant="outline" size="icon" onClick={onEditMerchant}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onViewAnalytics && (
                <Button variant="outline" size="icon" onClick={onViewAnalytics}>
                  <BarChart3 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-2 rounded-lg bg-opacity-10", `bg-${stat.color.split('-')[1]}-100`)}>
                      <stat.icon className={cn("h-6 w-6", stat.color)} />
                    </div>
                    {stat.changeType !== 'neutral' && (
                      <Badge 
                        variant={stat.changeType === 'positive' ? 'active' : 'destructive'}
                        className="text-xs"
                      >
                        {stat.change}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {balance && balance > 0n && (
              <Button variant="outline" size="sm">
                <DollarSign className="h-4 w-4 mr-2" />
                Withdraw Balance
              </Button>
            )}
            {onAddSubscription && (
              <Button variant="outline" size="sm" onClick={onAddSubscription}>
                <Plus className="h-4 w-4 mr-2" />
                Add Subscription Plan
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure Pricing
            </Button>
            {onViewAnalytics && (
              <Button variant="outline" size="sm" onClick={onViewAnalytics}>
                <Eye className="h-4 w-4 mr-2" />
                View Detailed Analytics
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Merchant Details */}
      <Card>
        <CardHeader>
          <CardTitle>Merchant Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Payout Address</p>
              <p className="font-mono text-sm">{merchant?.payoutAddress ? formatAddress(merchant.payoutAddress) : 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Price</p>
              <p className="font-semibold">{price > 0n ? formatCurrency(price, 'ETH') : 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Grace Period</p>
              <p className="font-semibold">{merchant?.gracePeriod ? `${Number(merchant.gracePeriod) / 86400} days` : '7 days'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Subscribers</p>
              <p className="font-semibold">{analytics?.totalSubscribers?.toString() || merchant?.totalSubscribers?.toString() || '0'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}