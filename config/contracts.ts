import { NFTFactoryABI } from './abis/NFTFactory';
import { NFTCollectionABI } from './abis/NFTCollection';

export const contracts = {
  sepolia: {
    NFTFactory: '0xfB42f542b995ED3Ebe1829a73abA642706d8d329'
  }
} as const;

export type ContractAddresses = typeof contracts;

export { NFTFactoryABI, NFTCollectionABI };