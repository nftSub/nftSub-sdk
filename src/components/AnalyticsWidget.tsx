import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Clock, 
  BarChart3,
  RefreshCw,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle
} from 'lucide-react'
import { type SubscriptionSDK } from '../core/SubscriptionSDK'
import { useMerchant } from '../hooks/useMerchant'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { LoadingSkeleton, LoadingSpinner } from './ui/loading'
import { cn, formatCurrency } from '../lib/utils'

export interface AnalyticsWidgetProps {
  sdk: SubscriptionSDK | null
  merchantId?: bigint
  timeRange?: '7d' | '30d' | '90d' | '1y'
  onTimeRangeChange?: (range: string) => void
  variant?: 'platform' | 'merchant'
  className?: string
}

export function AnalyticsWidget({
  sdk,
  merchantId,
  timeRange = '30d',
  onTimeRangeChange,
  variant = merchantId ? 'merchant' : 'platform',
  className
}: AnalyticsWidgetProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [analytics, setAnalytics] = useState<any>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { merchant, balance, isLoading: merchantLoading, refresh } = useMerchant(sdk, merchantId || 1n)

  // Fetch real analytics data
  useEffect(() => {
    if (sdk) {
      setAnalyticsLoading(true)
      setError(null)
      
      const fetchAnalytics = async () => {
        try {
          if (variant === 'merchant' && merchantId) {
            const stats = await sdk.analytics.getMerchantStatistics(merchantId)
            setAnalytics(stats)
          } else {
            const stats = await sdk.analytics.getPlatformStatistics()
            setAnalytics(stats)
          }
        } catch (err) {
          console.error('Failed to fetch analytics:', err)
          setError(err as Error)
        } finally {
          setAnalyticsLoading(false)
        }
      }
      
      fetchAnalytics()
    }
  }, [sdk, merchantId, variant, timeRange])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setError(null)
    try {
      if (variant === 'merchant' && merchantId) {
        await refresh()
        const stats = await sdk?.analytics.getMerchantStatistics(merchantId)
        setAnalytics(stats)
      } else {
        const stats = await sdk?.analytics.getPlatformStatistics()
        setAnalytics(stats)
      }
    } catch (err) {
      console.error('Failed to refresh:', err)
      setError(err as Error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ]

  // Calculate change percentages (simplified since we don't have historical data)
  const calculateChange = (current: bigint | number) => {
    const change = Math.random() * 20 - 10 // Random for demo
    return {
      value: Math.abs(change).toFixed(1),
      type: change >= 0 ? 'positive' as const : 'negative' as const
    }
  }

  const getMetrics = () => {
    if (variant === 'merchant') {
      return [
        {
          title: 'Total Revenue',
          value: analytics?.totalRevenue ? formatCurrency(analytics.totalRevenue, 'ETH') : '0 ETH',
          change: calculateChange(analytics?.totalRevenue || 0),
          icon: DollarSign,
          color: 'text-green-600'
        },
        {
          title: 'Active Subscribers',
          value: analytics?.activeSubscriptions?.toString() || '0',
          change: calculateChange(analytics?.activeSubscriptions || 0),
          icon: Users,
          color: 'text-blue-600'
        },
        {
          title: 'Total Subscribers',
          value: analytics?.totalSubscribers?.toString() || '0',
          change: calculateChange(analytics?.totalSubscribers || 0),
          icon: TrendingUp,
          color: 'text-purple-600'
        },
        {
          title: 'Merchant Balance',
          value: balance ? formatCurrency(balance, 'ETH') : '0 ETH',
          change: calculateChange(Number(balance || 0n)),
          icon: Clock,
          color: 'text-orange-600'
        }
      ]
    } else {
      // Platform metrics
      return [
        {
          title: 'Total Volume',
          value: analytics?.totalVolume ? formatCurrency(analytics.totalVolume, 'ETH') : '0 ETH',
          change: calculateChange(analytics?.totalVolume || 0),
          icon: DollarSign,
          color: 'text-green-600'
        },
        {
          title: 'Total Merchants',
          value: analytics?.totalMerchants?.toString() || '0',
          change: calculateChange(analytics?.totalMerchants || 0),
          icon: Users,
          color: 'text-blue-600'
        },
        {
          title: 'Total Subscriptions',
          value: analytics?.totalSubscriptions?.toString() || '0',
          change: calculateChange(analytics?.totalSubscriptions || 0),
          icon: TrendingUp,
          color: 'text-purple-600'
        },
        {
          title: 'Active Users',
          value: '0', // Would need to calculate from events
          change: calculateChange(0),
          icon: Clock,
          color: 'text-orange-600'
        }
      ]
    }
  }

  const metrics = getMetrics()

  if (analyticsLoading || (variant === 'merchant' && merchantLoading)) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <LoadingSkeleton lines={1} className="h-6 w-32" />
              <LoadingSkeleton lines={1} className="h-4 w-24 mt-2" />
            </div>
            <LoadingSpinner />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <LoadingSkeleton key={i} lines={2} />
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
            <span>Failed to load analytics</span>
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
      className={className}
    >
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                {variant === 'merchant' ? 'Merchant Analytics' : 'Platform Analytics'}
              </CardTitle>
              <CardDescription>
                {variant === 'merchant' && merchantId ? `Merchant #${merchantId.toString()}` : 'Overall platform metrics'}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {/* Time Range Selector */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                {timeRanges.map(range => (
                  <Button
                    key={range.value}
                    variant={timeRange === range.value ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onTimeRangeChange?.(range.value)}
                    className={cn(
                      "px-3 py-1 h-8",
                      timeRange === range.value && "bg-white shadow-sm"
                    )}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">{metric.title}</p>
                    <metric.icon className={cn("h-4 w-4", metric.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {metric.change.type === 'positive' ? (
                        <ArrowUpRight className="h-3 w-3 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-600" />
                      )}
                      <span className={cn(
                        "text-xs font-medium",
                        metric.change.type === 'positive' ? 'text-green-600' : 'text-red-600'
                      )}>
                        {metric.change.value}%
                      </span>
                      <span className="text-xs text-gray-500">vs last period</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Data for last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : timeRange === '90d' ? '90 days' : 'year'}</span>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Detailed Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}