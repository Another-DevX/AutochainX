'use client'

import * as React from 'react'
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets
} from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  trustWallet,
  ledgerWallet
} from '@rainbow-me/rainbowkit/wallets'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  zora,
  goerli
} from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { Chain } from '@wagmi/core'
 
export const avalanche = {
  id: 979797,
  name: 'AutoChainX',
  network: 'avalanche',
  nativeCurrency: {
    decimals: 18,
    name: 'OPEX',
    symbol: 'OPX',
  },
  rpcUrls: {
    public: { http: ['http://127.0.0.1:9650/ext/bc/2GyHK2AczFbKxxUke3M5c1sTv1uGPuY9UMpNuRqWmUntW2KAX2/rpc'] },
    default: { http: ['http://127.0.0.1:9650/ext/bc/2GyHK2AczFbKxxUke3M5c1sTv1uGPuY9UMpNuRqWmUntW2KAX2/rpc'] },
  },
  blockExplorers: {
    etherscan: { name: 'SnowTrace', url: 'https://snowtrace.io' },
    default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
  },
} as const satisfies Chain

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    avalanche
  ],
  [publicProvider()]
)

const projectId = 'YOUR_PROJECT_ID'

const { wallets } = getDefaultWallets({
  appName: 'RainbowKit demo',
  projectId,
  chains
})

const demoAppInfo = {
  appName: 'Rainbowkit Demo'
}

const connectors = connectorsForWallets([
  ...wallets,
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient
})

export function Providers ({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} appInfo={demoAppInfo}>
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
