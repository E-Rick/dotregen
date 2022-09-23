import { ChakraProvider } from '@chakra-ui/react'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'
import type { AppProps } from 'next/app'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { DomainProvider } from '../context/DomainContext'
import '../styles/global.css'
import theme from '../theme'
import { APP_NAME } from '../utils/constants'

const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_KEY }), publicProvider()]
)

const client = createClient(
  getDefaultClient({
    appName: APP_NAME,
    chains,
    provider,
    autoConnect: true,
  })
)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <DomainProvider>
        <ChakraProvider theme={theme}>
          <ConnectKitProvider>
            <Component {...pageProps} />
          </ConnectKitProvider>
        </ChakraProvider>
      </DomainProvider>
    </WagmiConfig>
  )
}

export default MyApp
