import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { type Address } from 'viem'
import { type SubscriptionSDK } from '../core/SubscriptionSDK'
import { 
  SubscriptionModal, 
  SubscriptionCard, 
  MerchantDashboard, 
  WalletConnect, 
  AnalyticsWidget,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from './index'

export interface SubscriptionExampleProps {
  sdk: SubscriptionSDK | null
  merchantId: bigint
  className?: string
}

export function SubscriptionExample({
  sdk,
  merchantId,
  className
}: SubscriptionExampleProps) {
  const [activeTab, setActiveTab] = useState<'subscribe' | 'dashboard' | 'analytics'>('subscribe')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const tabs = [
    { id: 'subscribe', label: 'Subscribe', description: 'Browse and subscribe to merchants' },
    { id: 'dashboard', label: 'Dashboard', description: 'Manage your merchant account' },
    { id: 'analytics', label: 'Analytics', description: 'View performance metrics' }
  ]

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Subscription Platform</h1>
            <p className="text-gray-600 mt-2">
              Professional subscription management with beautiful components
            </p>
          </div>
          <WalletConnect sdk={sdk} variant="detailed" />
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'subscribe' && (
          <div className="space-y-8">
            {/* Subscription Cards */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Subscriptions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SubscriptionCard
                  sdk={sdk}
                  merchantId={merchantId}
                  variant="default"
                  onSubscribe={() => setIsModalOpen(true)}
                />
                <SubscriptionCard
                  sdk={sdk}
                  merchantId={merchantId}
                  variant="detailed"
                  onSubscribe={() => setIsModalOpen(true)}
                />
                <SubscriptionCard
                  sdk={sdk}
                  merchantId={merchantId}
                  variant="compact"
                  onSubscribe={() => setIsModalOpen(true)}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Use these components to integrate subscriptions into your app
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Modal Subscription</h3>
                    <p className="text-sm text-gray-600">
                      Full-featured modal with step-by-step subscription flow
                    </p>
                    <Button onClick={() => setIsModalOpen(true)}>
                      Open Subscription Modal
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold">Inline Components</h3>
                    <p className="text-sm text-gray-600">
                      Embed subscription cards directly in your content
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Default Card
                      </Button>
                      <Button variant="outline" size="sm">
                        Detailed Card
                      </Button>
                      <Button variant="outline" size="sm">
                        Compact Card
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <MerchantDashboard
            sdk={sdk}
            merchantId={merchantId}
            onEditMerchant={() => console.log('Edit merchant')}
            onViewAnalytics={() => setActiveTab('analytics')}
            onAddSubscription={() => console.log('Add subscription')}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsWidget
            sdk={sdk}
            merchantId={merchantId}
            timeRange="30d"
            onTimeRangeChange={(range) => console.log('Time range changed:', range)}
          />
        )}
      </motion.div>

      {/* Subscription Modal */}
      <SubscriptionModal
        sdk={sdk}
        merchantId={merchantId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(hash) => {
          console.log('Subscription successful:', hash)
          setIsModalOpen(false)
        }}
        onError={(error) => {
          console.error('Subscription failed:', error)
        }}
      />
    </div>
  )
}
