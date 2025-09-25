import {
  getContract,
  type Address,
  type PublicClient,
  type WalletClient,
  type Hash,
  parseEther
} from 'viem';
import { subscriptionManagerABI, subscriptionNFTABI } from '@/config/abis';
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import { ROLE_HASHES } from '@/config/constants';

/**
 * Service for admin and owner operations
 * Handles platform configuration, fee management, role management, and emergency functions
 */
export class AdminService {
  private managerContract: any;
  private nftContract: any;

  constructor(
    private publicClient: PublicClient,
    private walletClient?: WalletClient
  ) {
    this.managerContract = getContract({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      client: { public: this.publicClient, wallet: this.walletClient }
    });

    this.nftContract = getContract({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      client: { public: this.publicClient, wallet: this.walletClient }
    });
  }

  /**
   * Check if address is contract owner
   */
  async isOwner(address: Address): Promise<boolean> {
    try {
      const owner = await this.managerContract.read.owner();
      return owner.toLowerCase() === address.toLowerCase();
    } catch {
      return false;
    }
  }

  /**
   * Check if address has specific role
   */
  async hasRole(role: string, address: Address): Promise<boolean> {
    try {
      const roleHash = this.getRoleHash(role);
      return await this.nftContract.read.hasRole([roleHash, address]);
    } catch {
      return false;
    }
  }

  /**
   * Set platform fee (owner only)
   */
  async setPlatformFee(feeBps: number): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    if (feeBps > 10000) throw new Error('Fee cannot exceed 100%');
    
    return await this.managerContract.write.setPlatformFee([feeBps]);
  }

  /**
   * Get current platform fee
   */
  async getPlatformFee(): Promise<number> {
    const fee = await this.managerContract.read.platformFeeBps();
    return Number(fee);
  }

  /**
   * Set subscription NFT contract address (one-time setup)
   */
  async setSubscriptionNFT(nftAddress: Address): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    return await this.managerContract.write.setSubscriptionNFT([nftAddress]);
  }

  /**
   * Set reactive contract address on NFT
   */
  async setReactiveContract(reactiveAddress: Address): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    return await this.nftContract.write.setReactiveContract([reactiveAddress]);
  }

  /**
   * Grant role to address
   */
  async grantRole(role: string, address: Address): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    const roleHash = this.getRoleHash(role);
    return await this.nftContract.write.grantRole([roleHash, address]);
  }

  /**
   * Revoke role from address
   */
  async revokeRole(role: string, address: Address): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    const roleHash = this.getRoleHash(role);
    return await this.nftContract.write.revokeRole([roleHash, address]);
  }

  /**
   * Withdraw platform fees
   */
  async withdrawPlatformFees(params: {
    token: Address;
    to: Address;
  }): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    return await this.managerContract.write.withdrawPlatformFees([
      params.token,
      params.to
    ]);
  }

  /**
   * Get platform fee balance for a token
   */
  async getPlatformFeeBalance(token: Address): Promise<bigint> {
    // This would need to be tracked via events or a getter function
    // For now, return 0 as placeholder
    return 0n;
  }

  /**
   * Transfer ownership of manager contract
   */
  async transferOwnership(newOwner: Address): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    return await this.managerContract.write.transferOwnership([newOwner]);
  }

  /**
   * Renounce ownership (irreversible!)
   */
  async renounceOwnership(): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    const confirmed = confirm('This action is irreversible! Are you sure you want to renounce ownership?');
    if (!confirmed) throw new Error('Operation cancelled');
    
    return await this.managerContract.write.renounceOwnership();
  }

  /**
   * Pause NFT transfers (emergency)
   */
  async pauseNFT(): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    return await this.nftContract.write.pause();
  }

  /**
   * Unpause NFT transfers
   */
  async unpauseNFT(): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    return await this.nftContract.write.unpause();
  }

  /**
   * Check if NFT is paused
   */
  async isNFTPaused(): Promise<boolean> {
    return await this.nftContract.read.paused();
  }

  /**
   * Update base URI for NFT metadata
   */
  async setBaseURI(uri: string): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    return await this.nftContract.write.setBaseURI([uri]);
  }

  /**
   * Get contract configuration
   */
  async getContractConfig(): Promise<{
    manager: {
      owner: Address;
      platformFeeBps: number;
      subscriptionNFT: Address;
    };
    nft: {
      baseURI: string;
      paused: boolean;
      reactiveContract: Address;
    };
  }> {
    const [
      owner,
      platformFeeBps,
      subscriptionNFT,
      baseURI,
      paused
    ] = await Promise.all([
      this.managerContract.read.owner(),
      this.managerContract.read.platformFeeBps(),
      this.managerContract.read.subscriptionNFT(),
      this.nftContract.read.uri([0n]), // Get base URI
      this.nftContract.read.paused()
    ]);

    return {
      manager: {
        owner,
        platformFeeBps: Number(platformFeeBps),
        subscriptionNFT
      },
      nft: {
        baseURI,
        paused,
        reactiveContract: CONTRACT_ADDRESSES.reactive.subscriptionReactive
      }
    };
  }

  /**
   * Get platform statistics
   */
  async getPlatformStats(): Promise<{
    totalMerchants: number;
    totalSubscriptions: number;
    platformRevenue: Map<Address, bigint>;
  }> {
    // This would require event parsing or additional view functions
    // Placeholder implementation
    return {
      totalMerchants: 0,
      totalSubscriptions: 0,
      platformRevenue: new Map()
    };
  }

  /**
   * Emergency withdrawal (if contract has stuck funds)
   */
  async emergencyWithdraw(params: {
    contract: 'manager' | 'nft';
    token: Address;
    to: Address;
    amount: bigint;
  }): Promise<Hash> {
    if (!this.walletClient) throw new Error('Wallet not connected');
    
    // This would need to be implemented in the contracts
    // For now, throw not implemented
    throw new Error('Emergency withdrawal not implemented');
  }

  /**
   * Batch operations for efficiency
   */
  async batchGrantRoles(params: Array<{
    role: string;
    address: Address;
  }>): Promise<Hash[]> {
    const hashes: Hash[] = [];
    
    for (const param of params) {
      const hash = await this.grantRole(param.role, param.address);
      hashes.push(hash);
    }
    
    return hashes;
  }

  /**
   * Monitor admin events
   */
  watchAdminEvents(callback: (event: any) => void) {
    const unwatchers: (() => void)[] = [];

    // Watch ownership transfers
    const watchOwnershipTransfer = this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      eventName: 'OwnershipTransferred',
      onLogs: (logs) => {
        logs.forEach((log) => {
          callback({
            type: 'OwnershipTransferred',
            ...log.args
          });
        });
      }
    });
    unwatchers.push(watchOwnershipTransfer);

    // Watch role grants
    const watchRoleGranted = this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: 'RoleGranted',
      onLogs: (logs) => {
        logs.forEach((log) => {
          callback({
            type: 'RoleGranted',
            ...log.args
          });
        });
      }
    });
    unwatchers.push(watchRoleGranted);

    // Watch role revokes
    const watchRoleRevoked = this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: 'RoleRevoked',
      onLogs: (logs) => {
        logs.forEach((log) => {
          callback({
            type: 'RoleRevoked',
            ...log.args
          });
        });
      }
    });
    unwatchers.push(watchRoleRevoked);

    // Return combined unsubscribe function
    return () => {
      unwatchers.forEach(unwatch => unwatch());
    };
  }

  /**
   * Get role hash for a role name
   */
  private getRoleHash(role: string): string {
    // Use constants from the central constants file
    return ROLE_HASHES[role as keyof typeof ROLE_HASHES] || role;
  }

  /**
   * Validate admin permissions before operation
   */
  async validateAdminPermissions(address: Address): Promise<{
    isOwner: boolean;
    isManager: boolean;
    isPauser: boolean;
  }> {
    const [isOwner, isManager, isPauser] = await Promise.all([
      this.isOwner(address),
      this.hasRole('MANAGER', address),
      this.hasRole('PAUSER', address)
    ]);

    return { isOwner, isManager, isPauser };
  }
}