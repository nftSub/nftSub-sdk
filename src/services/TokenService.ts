import {
  getContract,
  type Address,
  type PublicClient,
  type WalletClient,
  type Hash,
  parseUnits,
  formatUnits,
  zeroAddress
} from 'viem';
import { mockERC20ABI } from '@/config/abis';
import { CONTRACT_ADDRESSES } from '@/config/contracts';

export interface TokenInfo {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
}

export interface TokenBalance {
  address: Address;
  symbol: string;
  decimals: number;
  balance: bigint;
  formattedBalance: string;
}

/**
 * Service for managing ERC20 tokens and test token minting
 * Handles token operations, approvals, minting for testing, and balance management
 */
export class TokenService {
  private tokenContracts: Map<Address, any> = new Map();

  constructor(
    private publicClient: PublicClient,
    private walletClient?: WalletClient
  ) {}

  /**
   * Get or create token contract instance
   */
  private getTokenContract(tokenAddress: Address): any {
    if (!this.tokenContracts.has(tokenAddress)) {
      const contract = getContract({
        address: tokenAddress,
        abi: mockERC20ABI,
        client: { public: this.publicClient, wallet: this.walletClient }
      });
      this.tokenContracts.set(tokenAddress, contract);
    }
    return this.tokenContracts.get(tokenAddress);
  }

  /**
   * Get token information
   */
  async getTokenInfo(tokenAddress: Address): Promise<TokenInfo> {
    if (tokenAddress === zeroAddress) {
      return {
        address: zeroAddress,
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
        totalSupply: 0n // Not applicable for ETH
      };
    }

    const contract = this.getTokenContract(tokenAddress);
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.read.name(),
      contract.read.symbol(),
      contract.read.decimals(),
      contract.read.totalSupply()
    ]);

    return {
      address: tokenAddress,
      name,
      symbol,
      decimals,
      totalSupply
    };
  }

  /**
   * Get token balance for an address
   */
  async getBalance(tokenAddress: Address, userAddress: Address): Promise<bigint> {
    if (tokenAddress === zeroAddress) {
      // ETH balance
      return await this.publicClient.getBalance({ address: userAddress });
    }

    const contract = this.getTokenContract(tokenAddress);
    return await contract.read.balanceOf([userAddress]);
  }

  /**
   * Get multiple token balances
   */
  async getBalances(
    tokens: Array<{ address: Address; symbol: string; decimals: number }>,
    userAddress: Address
  ): Promise<TokenBalance[]> {
    const balances: TokenBalance[] = [];

    for (const token of tokens) {
      const balance = await this.getBalance(token.address, userAddress);
      balances.push({
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        balance,
        formattedBalance: this.formatTokenAmount(balance, token.decimals)
      });
    }

    return balances;
  }

  /**
   * Approve token spending
   */
  async approve(params: {
    tokenAddress: Address;
    spender: Address;
    amount: bigint;
  }): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    if (params.tokenAddress === zeroAddress) {
      throw new Error('Cannot approve ETH');
    }

    const contract = this.getTokenContract(params.tokenAddress);
    return await contract.write.approve([params.spender, params.amount]);
  }

  /**
   * Check token allowance
   */
  async getAllowance(params: {
    tokenAddress: Address;
    owner: Address;
    spender: Address;
  }): Promise<bigint> {
    if (params.tokenAddress === zeroAddress) {
      return 0n; // ETH doesn't have allowance
    }

    const contract = this.getTokenContract(params.tokenAddress);
    return await contract.read.allowance([params.owner, params.spender]);
  }

  /**
   * Approve if needed
   */
  async approveIfNeeded(params: {
    tokenAddress: Address;
    spender: Address;
    amount: bigint;
  }): Promise<{ needed: boolean; hash?: Hash }> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    if (params.tokenAddress === zeroAddress) {
      return { needed: false };
    }

    const currentAllowance = await this.getAllowance({
      tokenAddress: params.tokenAddress,
      owner: this.walletClient.account!.address,
      spender: params.spender
    });

    if (currentAllowance < params.amount) {
      const hash = await this.approve({
        tokenAddress: params.tokenAddress,
        spender: params.spender,
        amount: params.amount
      });
      return { needed: true, hash };
    }

    return { needed: false };
  }

  /**
   * Mint test tokens (only for MockERC20)
   */
  async mintTestTokens(params: {
    tokenAddress: Address;
    to: Address;
    amount: string; // Amount in token units
  }): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');

    const contract = this.getTokenContract(params.tokenAddress);
    const decimals = await contract.read.decimals();
    const amountInWei = parseUnits(params.amount, decimals);

    // Check if contract has mint function (MockERC20)
    try {
      return await contract.write.mint([params.to, amountInWei]);
    } catch (error) {
      throw new Error('This token does not support minting');
    }
  }

  /**
   * Burn tokens
   */
  async burnTokens(params: {
    tokenAddress: Address;
    amount: string;
  }): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');

    const contract = this.getTokenContract(params.tokenAddress);
    const decimals = await contract.read.decimals();
    const amountInWei = parseUnits(params.amount, decimals);

    try {
      return await contract.write.burn([amountInWei]);
    } catch (error) {
      throw new Error('This token does not support burning');
    }
  }

  /**
   * Transfer tokens
   */
  async transfer(params: {
    tokenAddress: Address;
    to: Address;
    amount: string;
  }): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');

    if (params.tokenAddress === zeroAddress) {
      // ETH transfer
      const amountInWei = parseUnits(params.amount, 18);
      return await this.walletClient.sendTransaction({
        account: this.walletClient.account!,
        to: params.to,
        value: amountInWei,
        chain: this.walletClient.chain // fix: add required 'chain' property
      });
    }

    const contract = this.getTokenContract(params.tokenAddress);
    const decimals = await contract.read.decimals();
    const amountInWei = parseUnits(params.amount, decimals);

    return await contract.write.transfer([params.to, amountInWei]);
  }

  /**
   * Get faucet tokens for testing
   */
  async getFaucetTokens(userAddress: Address): Promise<{
    tokenAddress: Address;
    amount: bigint;
    hash: Hash;
  }> {
    if (!this.walletClient) throw new Error('Wallet not connected');

    // Mint 1000 test tokens
    const amount = '1000';
    const hash = await this.mintTestTokens({
      tokenAddress: CONTRACT_ADDRESSES.sepolia.testToken,
      to: userAddress,
      amount
    });

    return {
      tokenAddress: CONTRACT_ADDRESSES.sepolia.testToken,
      amount: parseUnits(amount, 18),
      hash
    };
  }

  /**
   * Watch token transfers
   */
  watchTransfers(params: {
    tokenAddress: Address;
    from?: Address;
    to?: Address;
    callback: (event: {
      from: Address;
      to: Address;
      value: bigint;
    }) => void;
  }) {
    const contract = this.getTokenContract(params.tokenAddress);

    return this.publicClient.watchContractEvent({
      address: params.tokenAddress,
      abi: mockERC20ABI,
      eventName: 'Transfer',
      args: {
        from: params.from,
        to: params.to
      },
      onLogs: (logs) => {
        logs.forEach((log) => {
          const args = log.args as any;
          params.callback({
            from: args.from,
            to: args.to,
            value: args.value
          });
        });
      }
    });
  }

  /**
   * Watch approvals
   */
  watchApprovals(params: {
    tokenAddress: Address;
    owner?: Address;
    spender?: Address;
    callback: (event: {
      owner: Address;
      spender: Address;
      value: bigint;
    }) => void;
  }) {
    return this.publicClient.watchContractEvent({
      address: params.tokenAddress,
      abi: mockERC20ABI,
      eventName: 'Approval',
      args: {
        owner: params.owner,
        spender: params.spender
      },
      onLogs: (logs) => {
        logs.forEach((log) => {
          const args = log.args as any;
          params.callback({
            owner: args.owner,
            spender: args.spender,
            value: args.value
          });
        });
      }
    });
  }

  /**
   * Get supported tokens for the platform
   */
  getSupportedTokens(): Array<{
    address: Address;
    name: string;
    symbol: string;
    decimals: number;
    isNative: boolean;
  }> {
    return [
      {
        address: zeroAddress,
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
        isNative: true
      },
      {
        address: CONTRACT_ADDRESSES.sepolia.testToken,
        name: 'Subscription Test Token',
        symbol: 'SUBTEST',
        decimals: 18,
        isNative: false
      }
      // Add more supported tokens here
    ];
  }

  /**
   * Format token amount for display
   */
  formatTokenAmount(amount: bigint, decimals: number, precision: number = 6): string {
    const formatted = formatUnits(amount, decimals);
    const num = parseFloat(formatted);
    
    if (num === 0) return '0';
    if (num < 0.000001) return '< 0.000001';
    
    return num.toFixed(precision).replace(/\.?0+$/, '');
  }

  /**
   * Parse token amount from user input
   */
  parseTokenAmount(amount: string, decimals: number): bigint {
    return parseUnits(amount, decimals);
  }

  /**
   * Estimate gas for token operations
   */
  async estimateGas(params: {
    operation: 'approve' | 'transfer' | 'mint';
    tokenAddress: Address;
    to?: Address;
    amount?: bigint;
  }): Promise<bigint> {
    if (!this.walletClient) throw new Error('Wallet not connected');

    const contract = this.getTokenContract(params.tokenAddress);
    const from = this.walletClient.account!.address;

    switch (params.operation) {
      case 'approve':
        return await this.publicClient.estimateContractGas({
          address: params.tokenAddress,
          abi: mockERC20ABI,
          functionName: 'approve',
          args: [params.to!, params.amount!],
          account: from
        });

      case 'transfer':
        return await this.publicClient.estimateContractGas({
          address: params.tokenAddress,
          abi: mockERC20ABI,
          functionName: 'transfer',
          args: [params.to!, params.amount!],
          account: from
        });

      case 'mint':
        return await this.publicClient.estimateContractGas({
          address: params.tokenAddress,
          abi: mockERC20ABI,
          functionName: 'mint',
          args: [params.to!, params.amount!],
          account: from
        });

      default:
        throw new Error('Unknown operation');
    }
  }

  /**
   * Check if address has sufficient balance
   */
  async hasSufficientBalance(params: {
    tokenAddress: Address;
    userAddress: Address;
    requiredAmount: bigint;
  }): Promise<boolean> {
    const balance = await this.getBalance(params.tokenAddress, params.userAddress);
    return balance >= params.requiredAmount;
  }
}