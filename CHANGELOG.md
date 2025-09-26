# Changelog

## [2.0.0] - 2025-01-26

### 🎉 New Features
- **Merchant Metadata Support**: Added complete off-chain metadata management for merchants
  - `registerMerchantWithMetadata()`: Register merchant with business profile in one call
  - `getMerchantMetadata()`: Fetch merchant's business information
  - `updateMerchantMetadata()`: Update merchant's profile (name, description, logo)
  - `getMerchantComplete()`: Get both on-chain and off-chain data in one call

### 🖼️ Image Handling
- Support for base64 encoded logos with automatic size validation
- Maximum image size: 500KB for optimal performance
- Automatic compression utilities available

### 🔄 Breaking Changes
- None - v2 is fully backward compatible
- Original `registerMerchant()` method still works for on-chain only registration

### 📝 Documentation Updates
- Fixed incorrect merchant registration examples
- Clarified NFT metadata URI structure
- Added notes about on-chain vs off-chain data separation
- Corrected time units from days to seconds

## [1.0.0] - 2025-01-25

### Initial Release
- Core subscription management
- Merchant registration (on-chain only)
- NFT operations
- Event monitoring
- React components and hooks
- Reactive Network integration