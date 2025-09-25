import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Clock, CreditCard, Shield, X } from 'lucide-react'
import { type Address } from 'viem'
import { type SubscriptionSDK } from '../core/SubscriptionSDK'
import { useSubscription } from '../hooks/useSubscription'
import { useMerchant } from '../hooks/useMerchant'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { LoadingSpinner, LoadingDots } from './ui/loading'
import { cn, formatCurrency, getTimeRemaining } from '../lib/utils'

export interface SubscriptionModalProps {
  sdk: SubscriptionSDK | null
  merchantId: bigint
  paymentToken?: Address | 'ETH'
  isOpen: boolean
  onClose: () => void
  onSuccess?: (hash: string) => void
  onError?: (error: Error) => void
  className?: string
}

type Step = 'connect' | 'select' | 'confirm' | 'processing' | 'success' | 'error'

export function SubscriptionModal({
  sdk,
  merchantId,
  paymentToken = 'ETH',
  isOpen,
  onClose,
  onSuccess,
  onError,
  className
}: SubscriptionModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('connect')
  const [selectedToken, setSelectedToken] = useState<Address | 'ETH'>(paymentToken)
  const [txHash, setTxHash] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [price, setPrice] = useState<bigint>(0n)
  const [analytics, setAnalytics] = useState<any>(null)

  const { isActive, isLoading, subscribe } = useSubscription(sdk, merchantId, sdk?.getAddress())
  const { merchant, balance, isLoading: merchantLoading } = useMerchant(sdk, merchantId)

  // Fetch real price and analytics data
  useEffect(() => {
    if (sdk && merchantId) {
      // Get subscription price
      sdk.subscriptions.getSubscriptionPrice(merchantId, '0x0000000000000000000000000000000000000000' as Address)
        .then(setPrice)
        .catch(console.error)
      
      // Get merchant analytics
      sdk.analytics.getMerchantStatistics(merchantId)
        .then(setAnalytics)
        .catch(console.error)
    }
  }, [sdk, merchantId])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('connect')
      setError('')
      setTxHash('')
    }
  }, [isOpen])

  // Auto-advance steps
  useEffect(() => {
    if (isActive && currentStep === 'connect') {
      setCurrentStep('select')
    }
  }, [isActive, currentStep])

  const handleSubscribe = async () => {
    if (!sdk || !merchant) return

    setCurrentStep('processing')
    setError('')

    try {
      const hash = await subscribe(selectedToken)
      if (hash) {
        setTxHash(hash)
        setCurrentStep('success')
        onSuccess?.(hash)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Subscription failed'
      setError(errorMessage)
      setCurrentStep('error')
      onError?.(err as Error)
    }
  }

  const steps = [
    { id: 'connect', title: 'Connect Wallet', icon: Shield },
    { id: 'select', title: 'Select Plan', icon: CreditCard },
    { id: 'confirm', title: 'Confirm', icon: CheckCircle },
    { id: 'processing', title: 'Processing', icon: Clock },
  ]

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep)
  }

  const isStepCompleted = (stepId: string) => {
    const stepIndex = steps.findIndex(step => step.id === stepId)
    const currentIndex = getCurrentStepIndex()
    return stepIndex < currentIndex || (stepId === 'processing' && currentStep === 'success')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className={cn(
            "relative w-full max-w-md bg-white rounded-2xl shadow-2xl",
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Subscribe to Merchant #{merchantId.toString()}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = isStepCompleted(step.id)
                const isCurrent = step.id === currentStep
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                        isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : isCurrent
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "bg-gray-100 border-gray-300 text-gray-400"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <span className="mt-2 text-xs font-medium text-gray-600">
                      {step.title}
                    </span>
                  </div>
                )
              })}
            </div>
            <Progress value={(getCurrentStepIndex() / (steps.length - 1)) * 100} />
          </div>

          {/* Content */}
          <div className="p-6">
            {currentStep === 'connect' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-gray-600 mb-6">
                  Connect your wallet to start your subscription
                </p>
                {!sdk?.isConnected() ? (
                  <Button className="w-full" disabled>
                    <LoadingDots />
                    Connecting...
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => setCurrentStep('select')}>
                    Wallet Connected ✓
                  </Button>
                )}
              </motion.div>
            )}

            {currentStep === 'select' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold">Choose Your Plan</h3>
                
                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Merchant #{merchantId.toString()}</CardTitle>
                      <Badge variant="active">{analytics?.activeSubscriptions?.toString() || '0'} Active</Badge>
                    </div>
                    <CardDescription>{merchant?.isActive ? 'Active Subscription Service' : 'Subscription Service'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Price</span>
                        <span className="text-lg font-semibold">
                          {price > 0n ? formatCurrency(price, 'ETH') : 'Loading...'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Duration</span>
                        <span className="text-sm">
                          {getTimeRemaining(merchant?.subscriptionPeriod || 2592000n)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Payment Token</span>
                        <Badge variant="outline">{selectedToken}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  className="w-full" 
                  onClick={() => setCurrentStep('confirm')}
                  variant="subscription"
                >
                  Continue to Payment
                </Button>
              </motion.div>
            )}

            {currentStep === 'confirm' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold">Confirm Subscription</h3>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Merchant</span>
                        <span className="font-medium">Merchant #{merchantId.toString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price</span>
                        <span className="font-medium">
                          {price > 0n ? formatCurrency(price, 'ETH') : 'Loading...'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Payment Token</span>
                        <span className="font-medium">{selectedToken}</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>{price > 0n ? formatCurrency(price, 'ETH') : '0 ETH'}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => setCurrentStep('select')}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={handleSubscribe}
                    variant="subscription"
                  >
                    Confirm & Subscribe
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === 'processing' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <LoadingSpinner size="lg" className="mx-auto mb-4 text-blue-500" />
                <h3 className="text-lg font-semibold mb-2">Processing Subscription</h3>
                <p className="text-gray-600">
                  Please wait while we process your subscription...
                </p>
              </motion.div>
            )}

            {currentStep === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Subscription Successful!</h3>
                <p className="text-gray-600 mb-4">
                  Your subscription has been activated successfully.
                </p>
                {txHash && (
                  <p className="text-xs text-gray-500 mb-4">
                    Transaction: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                  </p>
                )}
                <Button className="w-full" onClick={onClose}>
                  Close
                </Button>
              </motion.div>
            )}

            {currentStep === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Subscription Failed</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => setCurrentStep('confirm')}
                  >
                    Try Again
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
