import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia, bsc,base } from 'viem/chains'
import { http } from 'viem'
import {
  metaMaskWallet,
  okxWallet,
  oneKeyWallet,
  bitgetWallet,
  trustWallet,
  coinbaseWallet,
  binanceWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'

if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not defined')
}

export const config = getDefaultConfig({
  appName: 'NFT Maker',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  chains: [base,sepolia,bsc],
  transports: {
    [base.id]: http("https://mainnet.base.org"),
    [bsc.id]: http("https://bsc-dataseed.bnbchain.org"),
    [sepolia.id]: http()
  },
  wallets: [
    {
      groupName: 'Popular',
      wallets: [
        metaMaskWallet,
        okxWallet,
        oneKeyWallet,
        bitgetWallet,
        trustWallet,
        coinbaseWallet,
        binanceWallet,
        walletConnectWallet,
      ]
    }
  ],
}) 