# Contributing to NFT Sub SDK

We welcome contributions to the NFT Sub SDK! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your contribution
4. Make your changes
5. Push to your fork
6. Submit a pull request

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/nftSub-sdk.git
cd nftSub-sdk

# Install dependencies
pnpm install

# Build the SDK
pnpm build

# Run tests
pnpm test
```

### Development Commands

```bash
# Build the SDK
pnpm build

# Watch mode for development
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Format code
pnpm format
```

## How to Contribute

### Types of Contributions

We accept various types of contributions:

- **Bug Fixes**: Fix issues reported in GitHub Issues
- **New Features**: Add new functionality to the SDK
- **Documentation**: Improve or add documentation
- **Tests**: Add missing tests or improve existing ones
- **Performance**: Optimize code for better performance
- **Refactoring**: Improve code quality and maintainability

### Before You Start

1. Check existing issues and pull requests to avoid duplicating work
2. For major changes, open an issue first to discuss the proposed changes
3. Ensure your idea aligns with the project's goals and roadmap

## Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Make Your Changes**
   - Write clean, maintainable code
   - Follow the coding standards
   - Add tests for new functionality
   - Update documentation as needed

3. **Commit Your Changes**
   ```bash
   git commit -m "feat: add new feature description"
   # or
   git commit -m "fix: resolve issue with description"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `test:` Test additions or fixes
   - `refactor:` Code refactoring
   - `perf:` Performance improvements
   - `chore:` Maintenance tasks

4. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a pull request on GitHub.

5. **Pull Request Requirements**
   - Clear title and description
   - Reference any related issues
   - Pass all CI checks
   - Have at least one approval from maintainers
   - No merge conflicts

## Coding Standards

### TypeScript Guidelines

- Use TypeScript for all new code
- Provide proper type definitions
- Avoid using `any` type
- Use interfaces over type aliases when possible
- Export types that consumers might need

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multi-line objects/arrays
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic

### File Organization

```
src/
├── config/        # Configuration files
├── core/          # Core SDK functionality
├── services/      # Service classes
├── hooks/         # React hooks
├── components/    # React components
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Testing

### Test Requirements

- Write tests for all new features
- Maintain or improve code coverage
- Test edge cases and error scenarios
- Use descriptive test names

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test src/services/MerchantService.test.ts
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';

describe('FeatureName', () => {
  it('should perform expected behavior', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

## Documentation

### Code Documentation

- Add JSDoc comments for public APIs
- Include parameter descriptions
- Provide usage examples
- Document return values and exceptions

```typescript
/**
 * Registers a new merchant with metadata
 * @param params - Registration parameters
 * @param params.payoutAddress - Address to receive payments
 * @param params.subscriptionPeriod - Duration in seconds
 * @returns Transaction hash and merchant ID
 * @throws {SDKError} If wallet not connected
 * @example
 * const result = await sdk.merchants.registerMerchantWithMetadata({
 *   payoutAddress: '0x...',
 *   subscriptionPeriod: 2592000
 * });
 */
```

### README Updates

Update the README when:
- Adding new features
- Changing API interfaces
- Adding new dependencies
- Modifying setup instructions

## Reporting Issues

### Bug Reports

When reporting bugs, include:
- SDK version
- Node.js version
- Operating system
- Steps to reproduce
- Expected behavior
- Actual behavior
- Error messages/stack traces
- Code snippets (if applicable)

### Feature Requests

When requesting features:
- Describe the use case
- Explain the expected behavior
- Provide examples if possible
- Explain why existing features don't meet your needs

## Questions and Support

- **Discord**: Join our [Discord server](https://discord.gg/nftsub)
- **GitHub Discussions**: Use for questions and discussions
- **GitHub Issues**: Use for bug reports and feature requests

## License

By contributing to NFT Sub SDK, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- The project's README
- Release notes for significant contributions
- Our website's contributors page

Thank you for contributing to NFT Sub SDK!