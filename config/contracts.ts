import { NFTFactoryABI } from './abis/NFTFactory';
import { NFTCollectionABI } from './abis/NFTCollection';
import { sepolia, bsc } from 'viem/chains'

export const contracts = {
  sepolia: {
    NFTFactory: "0xDC3551ab1e3c0DDEE375F85f7d6BDC23535ea803" as const,
  },
  bsc: {
    NFTFactory: "0x1191B087FF6816303674DCF27D91c61805e867b8" as const, // BSC 主网合约地址
  },
} as const;

export function getNFTFactoryAddress(chainId: number) {
  switch (chainId) {
    case bsc.id: // BSC
      return contracts.bsc.NFTFactory
    case sepolia.id: // Sepolia
      return contracts.sepolia.NFTFactory
    default:
      throw new Error("Unsupported chain")
  }
}

export type ContractAddresses = typeof contracts;

export { NFTFactoryABI, NFTCollectionABI };