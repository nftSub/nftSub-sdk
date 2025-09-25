import React from 'react'
import { motion } from 'framer-motion'
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from 'lucide-react'
import { type Address } from 'viem'
import { type SubscriptionSDK } from '../core/SubscriptionSDK'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { cn, formatAddress } from '../lib/utils'

export interface WalletConnectProps {
  sdk: SubscriptionSDK | null
  onConnect?: () => void
  onDisconnect?: () => void
  variant?: 'default' | 'minimal' | 'detailed'
  className?: string
}

export function WalletConnect({
  sdk,
  onConnect,
  onDisconnect,
  variant = 'default',
  className
}: WalletConnectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const address = sdk?.getAddress()
  const isConnected = sdk?.isConnected()

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDisconnect = () => {
    onDisconnect?.()
    setIsOpen(false)
  }

  if (variant === 'minimal') {
    return (
      <div className={cn("relative", className)}>
        {isConnected ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2"
          >
            <Wallet className="h-4 w-4" />
            <span>{formatAddress(address!)}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={onConnect}
            size="sm"
            className="flex items-center space-x-2"
          >
            <Wallet className="h-4 w-4" />
            <span>Connect Wallet</span>
          </Button>
        )}

        {isOpen && isConnected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-64 z-50"
          >
            <Card className="shadow-lg border-0">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {address?.slice(2, 4).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {formatAddress(address!, 6)}
                      </p>
                      <Badge variant="active" className="text-xs">
                        Connected
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyAddress}
                      className="flex-1"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDisconnect}
                      className="flex-1"
                    >
                      <LogOut className="h-3 w-3 mr-1" />
                      Disconnect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-6">
          {isConnected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-lg">
                      {address?.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">Wallet Connected</h3>
                    <p className="text-sm text-gray-600">
                      {formatAddress(address!, 8)}
                    </p>
                  </div>
                </div>
                <Badge variant="active">Connected</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={handleCopyAddress}
                  className="flex items-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>{copied ? 'Copied!' : 'Copy Address'}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDisconnect}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Disconnect</span>
                </Button>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Network</span>
                  <span className="font-medium">Ethereum</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">Chain ID</span>
                  <span className="font-medium">{sdk?.getChainId()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Wallet className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Connect Your Wallet</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Connect your wallet to start using subscriptions
                </p>
              </div>
              <Button
                onClick={onConnect}
                className="w-full"
                size="lg"
              >
                <Wallet className="h-5 w-5 mr-2" />
                Connect Wallet
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <div className={cn("relative", className)}>
      {isConnected ? (
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2"
        >
          <Wallet className="h-4 w-4" />
          <span>{formatAddress(address!)}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          onClick={onConnect}
          className="flex items-center space-x-2"
        >
          <Wallet className="h-4 w-4" />
          <span>Connect Wallet</span>
        </Button>
      )}

      {isOpen && isConnected && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full right-0 mt-2 w-72 z-50"
        >
          <Card className="shadow-lg border-0">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {address?.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {formatAddress(address!, 8)}
                    </p>
                    <Badge variant="active" className="text-xs">
                      Connected
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyAddress}
                    className="w-full justify-start"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy Address'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Network</span>
                    <span className="font-medium">Ethereum</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
