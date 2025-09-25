# Subscription NFT SDK - Component Library

A beautiful, professional component library for subscription management with React, TypeScript, and Framer Motion animations.

## 🚀 Quick Start

```tsx
import { 
  SubscriptionModal, 
  SubscriptionCard, 
  MerchantDashboard, 
  WalletConnect,
  AnalyticsWidget 
} from '@your-org/subscription-nft-sdk'

function App() {
  return (
    <div>
      <WalletConnect sdk={sdk} variant="detailed" />
      <SubscriptionCard 
        sdk={sdk} 
        merchantId={BigInt(1)} 
        variant="detailed" 
      />
    </div>
  )
}
```

## 📦 Components

### Modal Components

#### `SubscriptionModal`
A full-featured modal with step-by-step subscription flow.

```tsx
<SubscriptionModal
  sdk={sdk}
  merchantId={BigInt(1)}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSuccess={(hash) => console.log('Success:', hash)}
  onError={(error) => console.error('Error:', error)}
/>
```

**Features:**
- ✅ Step-by-step subscription flow
- ✅ Wallet connection integration
- ✅ Payment token selection
- ✅ Beautiful animations with Framer Motion
- ✅ Loading states and error handling
- ✅ Progress indicators

### Card Components

#### `SubscriptionCard`
Display subscription information in various formats.

```tsx
// Default variant
<SubscriptionCard 
  sdk={sdk} 
  merchantId={BigInt(1)} 
  onSubscribe={() => setModalOpen(true)}
/>

// Detailed variant with stats
<SubscriptionCard 
  sdk={sdk} 
  merchantId={BigInt(1)} 
  variant="detailed"
  showPricing={true}
  showStatus={true}
  showActions={true}
/>

// Compact variant for lists
<SubscriptionCard 
  sdk={sdk} 
  merchantId={BigInt(1)} 
  variant="compact"
/>
```

**Variants:**
- `default` - Standard card with basic info
- `detailed` - Full card with stats and analytics
- `compact` - Minimal card for lists

### Dashboard Components

#### `MerchantDashboard`
Complete merchant management interface.

```tsx
<MerchantDashboard
  sdk={sdk}
  merchantId={BigInt(1)}
  onEditMerchant={() => console.log('Edit merchant')}
  onViewAnalytics={() => setView('analytics')}
  onAddSubscription={() => console.log('Add subscription')}
/>
```

**Features:**
- 📊 Revenue and subscriber statistics
- 📈 Performance metrics
- 🔄 Real-time data refresh
- ⚙️ Quick action buttons
- 📱 Responsive design

### Wallet Components

#### `WalletConnect`
Wallet connection with multiple display variants.

```tsx
// Default variant
<WalletConnect 
  sdk={sdk} 
  onConnect={handleConnect}
  onDisconnect={handleDisconnect}
/>

// Minimal variant for headers
<WalletConnect 
  sdk={sdk} 
  variant="minimal"
  onConnect={handleConnect}
/>

// Detailed variant for settings
<WalletConnect 
  sdk={sdk} 
  variant="detailed"
  onConnect={handleConnect}
/>
```

**Variants:**
- `default` - Standard wallet button with dropdown
- `minimal` - Compact button for headers
- `detailed` - Full card with network info

### Analytics Components

#### `AnalyticsWidget`
Comprehensive analytics dashboard.

```tsx
<AnalyticsWidget
  sdk={sdk}
  merchantId={BigInt(1)}
  timeRange="30d"
  onTimeRangeChange={(range) => setTimeRange(range)}
/>
```

**Features:**
- 📊 Revenue and subscriber trends
- 📈 Interactive charts
- 🔄 Time range selection
- 📱 Responsive grid layout
- ⚡ Real-time data updates

## 🎨 UI Components

### Base Components

```tsx
import { 
  Button, 
  Card, 
  Badge, 
  Dialog, 
  Progress, 
  Avatar,
  LoadingSpinner,
  LoadingDots,
  LoadingSkeleton
} from '@your-org/subscription-nft-sdk'
```

### Button Variants

```tsx
<Button variant="default">Default</Button>
<Button variant="subscription">Subscribe</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="outline">Outline</Button>
<Button loading={true}>Loading...</Button>
```

### Badge Variants

```tsx
<Badge variant="active">Active</Badge>
<Badge variant="expired">Expired</Badge>
<Badge variant="pending">Pending</Badge>
<Badge variant="processing">Processing</Badge>
```

## 🎭 Animations

All components include beautiful animations powered by Framer Motion:

- **Hover effects** - Smooth scale and shadow transitions
- **Loading states** - Spinning indicators and skeleton screens
- **Modal transitions** - Slide and fade animations
- **Card interactions** - Hover and click feedback
- **Progress indicators** - Animated progress bars

## 🎨 Styling

### CSS Classes

The component library includes utility classes for common patterns:

```css
/* Loading states */
.loading-skeleton { @apply animate-pulse bg-gray-200 rounded; }
.loading-shimmer { /* shimmer animation */ }

/* Card effects */
.card-hover { @apply transition-all duration-200 hover:shadow-lg hover:scale-105; }

/* Status indicators */
.status-active { @apply bg-green-100 text-green-800 border-green-200; }
.status-expired { @apply bg-red-100 text-red-800 border-red-200; }

/* Gradients */
.gradient-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.gradient-success { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
```

### Customization

Components accept `className` props for custom styling:

```tsx
<SubscriptionCard 
  className="custom-card-styles"
  sdk={sdk} 
  merchantId={BigInt(1)} 
/>
```

## 📱 Responsive Design

All components are fully responsive and work on:

- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1280px+)

## 🔧 TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
interface SubscriptionModalProps {
  sdk: SubscriptionSDK | null
  merchantId: bigint
  paymentToken?: Address | 'ETH'
  isOpen: boolean
  onClose: () => void
  onSuccess?: (hash: string) => void
  onError?: (error: Error) => void
  className?: string
}
```

## 🚀 Examples

### Complete Subscription Flow

```tsx
import { 
  SubscriptionModal, 
  SubscriptionCard, 
  WalletConnect 
} from '@your-org/subscription-nft-sdk'

function SubscriptionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sdk, setSdk] = useState<SubscriptionSDK | null>(null)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Subscriptions</h1>
        <WalletConnect sdk={sdk} variant="detailed" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SubscriptionCard 
          sdk={sdk}
          merchantId={BigInt(1)}
          variant="detailed"
          onSubscribe={() => setIsModalOpen(true)}
        />
        <SubscriptionCard 
          sdk={sdk}
          merchantId={BigInt(2)}
          variant="detailed"
          onSubscribe={() => setIsModalOpen(true)}
        />
      </div>

      <SubscriptionModal
        sdk={sdk}
        merchantId={BigInt(1)}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(hash) => {
          console.log('Subscription successful:', hash)
          setIsModalOpen(false)
        }}
      />
    </div>
  )
}
```

### Merchant Dashboard

```tsx
import { MerchantDashboard, AnalyticsWidget } from '@your-org/subscription-nft-sdk'

function MerchantPage() {
  const [view, setView] = useState<'dashboard' | 'analytics'>('dashboard')

  return (
    <div className="max-w-7xl mx-auto p-6">
      {view === 'dashboard' ? (
        <MerchantDashboard
          sdk={sdk}
          merchantId={BigInt(1)}
          onViewAnalytics={() => setView('analytics')}
          onEditMerchant={() => console.log('Edit merchant')}
        />
      ) : (
        <AnalyticsWidget
          sdk={sdk}
          merchantId={BigInt(1)}
          timeRange="30d"
          onTimeRangeChange={(range) => console.log('Time range:', range)}
        />
      )}
    </div>
  )
}
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- React 18+
- TypeScript 5+

### Installation

```bash
npm install @your-org/subscription-nft-sdk
# or
yarn add @your-org/subscription-nft-sdk
# or
pnpm add @your-org/subscription-nft-sdk
```

### Dependencies

The component library includes these peer dependencies:

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "framer-motion": "^10.0.0",
  "lucide-react": "^0.200.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^1.0.0"
}
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions and support, please open an issue on GitHub or contact the development team.


