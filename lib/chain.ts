import { bsc, bscTestnet, sepolia } from 'viem/chains'

export function getNativeTokenSymbol(chainId: number) {
  switch (chainId) {
    case bsc.id:
    case bscTestnet.id:
      return 'BNB'
    case sepolia.id:
      return 'ETH'
    default:
      return 'ETH'
  }
} 