import { NFTFactoryABI } from './abis/NFTFactory';
import { NFTCollectionABI } from './abis/NFTCollection';
import { sepolia, bsc } from 'viem/chains'

export const contracts = {
  sepolia: {
    NFTFactory: "0x20Afc1897De534bB6a6501257aae354cC99Bfd55" as const,
  },
  bsc: {
    NFTFactory: "0xd96052C0959540EF2d2C0c26ccD4E1c31a5b31F7" as const, // BSC 主网合约地址
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