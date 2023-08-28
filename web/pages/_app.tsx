import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { polygonMumbai,avalancheFuji,fantomTestnet } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import '@rainbow-me/rainbowkit/styles.css'
import {
  ConnectButton,
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit'
import { Chain } from '@rainbow-me/rainbowkit'
import { ContractProvider } from '../context/contractContext'
import Navbar from '../components/Navbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const hardhat: Chain = {
  id: 31337,
  name: 'Hardhat',
  network: 'Harthat at http://127.0.0.1:8545/',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'Eth',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545/'],
    },
    public: {
      http: ['http://127.0.0.1:8545/'],
    },
  },
  testnet: true,
}

const customFantomTestnet: Chain = {
  id: 4002,
  name: 'Fantom Testnet',
  network: 'fantom-testnet',
  iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3513.png',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Fantom',
    symbol: 'FTM',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.fantom.network'],
    },
    public: {
      http: ['https://rpc.testnet.fantom.network'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'FTMScan',
      url: 'https://testnet.ftmscan.com',
    },
    default: {
      name: 'FTMScan',
      url: 'https://testnet.ftmscan.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 8328688,
    },
  },
}



const { chains, provider } = configureChains(
  [avalancheFuji, customFantomTestnet, polygonMumbai],
  [
    alchemyProvider({ apiKey: '' }),
    infuraProvider({ apiKey: '' }),
    publicProvider(),
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'My app',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ContractProvider>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          coolMode
          chains={chains}
          theme={lightTheme({
            accentColorForeground: 'black',
            overlayBlur: 'large',
            accentColor: 'white',
          })}
        >
          <Navbar/>
          <Component {...pageProps} />
          <ToastContainer position='top-right' className="!top-20" theme="dark"   />
        </RainbowKitProvider>
      </WagmiConfig>
    </ContractProvider>
  )
}

export default MyApp
