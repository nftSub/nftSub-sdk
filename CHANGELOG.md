# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2025-09-26

### Added
- Multi-chain mainnet support
  - Base (Chain ID: 8453)
  - BSC/Binance Smart Chain (Chain ID: 56)  
  - Avalanche C-Chain (Chain ID: 43114)
  - Sonic (Chain ID: 146)
- Unified contract addresses across all chains via CREATE2
  - SubscriptionManager: `0x99ad42b29a7a99Ee4552cf6dc36dc4d44d8b0A2c`
  - SubscriptionNFT: `0x6D4b8BC4613dDCB98450a97b297294BacBd2DDD8`
- Reactive Network callback proxy addresses for each chain
- Enhanced `SupportedChain` type definition
- Mainnet configuration constants

### Changed
- Updated chain configuration structure
- Enhanced type definitions for mainnet support
- Improved constants with mainnet chain details

## [2.0.0] - 2025-09-26

### Added
- Merchant metadata support with off-chain storage
  - `registerMerchantWithMetadata()`: Register merchant with business profile
  - `getMerchantMetadata()`: Fetch merchant business information
  - `updateMerchantMetadata()`: Update merchant profile
  - `getMerchantComplete()`: Get combined on-chain and off-chain data
- Base64 encoded logo support with size validation
- Maximum image size limit of 500KB
- Image compression utilities

### Changed
- Updated merchant registration documentation
- Clarified NFT metadata URI structure
- Fixed time unit documentation (days to seconds)

### Fixed
- Incorrect merchant registration examples in documentation
- NFT metadata URI structure documentation

## [1.0.0] - 2025-01-25

### Initial Release
- Core subscription management
- Merchant registration (on-chain only)
- NFT operations
- Event monitoring
- React components and hooks
- Reactive Network integration