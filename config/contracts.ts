import { NFTFactoryABI } from './abis/NFTFactory';
import { NFTCollectionABI } from './abis/NFTCollection';

export const contracts = {
  sepolia: {
    NFTFactory: '0x0Cc4FB1069F94678470653555aFCf73ff9c5530C'
  }
} as const;

export type ContractAddresses = typeof contracts;

export { NFTFactoryABI, NFTCollectionABI };