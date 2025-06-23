import { NFTFactoryABI } from './abis/NFTFactory';
import { NFTCollectionABI } from './abis/NFTCollection';
import { sepolia, bsc, base } from 'viem/chains'

export const contracts = {
  sepolia: {
    NFTFactory: "0xDC3551ab1e3c0DDEE375F85f7d6BDC23535ea803" as const,
  },
  bsc: {
    NFTFactory: "0x1191B087FF6816303674DCF27D91c61805e867b8" as const, // BSC 主网合约地址
  },
  base: {
    NFTFactory: "0x80400f594DB5F35c48d99b3032654aA38FA81720" as const, // base 主网合约地址
  },
} as const;

export function getNFTFactoryAddress(chainId: number) {
  switch (chainId) {
    case bsc.id: // BSC
      return contracts.bsc.NFTFactory
    case sepolia.id: // Sepolia
      return contracts.sepolia.NFTFactory
    case base.id: // Base
      return contracts.base.NFTFactory
    default:
      throw new Error("Unsupported chain")
  }
}

export type ContractAddresses = typeof contracts;

export { NFTFactoryABI, NFTCollectionABI };