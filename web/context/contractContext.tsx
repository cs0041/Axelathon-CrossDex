import React, { createContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import  artifactCrossDexRouter from '../../smart contract/artifacts/contracts/CrossDex/CrossDexRouter.sol/CrossDexRouter.json'
import  artifactCrossDexFactory from '../../smart contract/artifacts/contracts/CrossDex/CrossDexFactory.sol/CrossDexFactory.json'
import  artifactCrossDexPair from '../../smart contract/artifacts/contracts/CrossDex/CrossDexPair.sol/CrossDexPair.json'
import  artifactAxelraToken from '../../smart contract/artifacts/contracts/Axelra/AxelraToken.sol/axelraToken0.json'
import { CrossDexRouter,CrossDexFactory,CrossDexPair,AxelraToken0 } from '../../smart contract/typechain-types'
import {
  toEtherandFixFloatingPoint,
  toWei,
  toEther,
  toEtherFloatingPoint,
  toFixUnits
} from '../utils/UnitInEther'
import { useNetwork } from 'wagmi'
import { FindAddressTokenByChainID, FindRPCByChainID } from '../utils/findByChainId'
import { ContractAddressRouter,ContractAddressFactory, AllowListTradeToken } from '../utils/valueConst'

interface IContract {
  getAmountsOut: (amountIn: string, addressTokenIn: string, addressTokenOut: string) =>Promise<string>
  getAmountsIn: (amountOut: string, addressTokenIn: string, addressTokenOut: string) =>Promise<string>
  loadReservePair: (addressToken0: string, addressToken1: string) => Promise<void>
  reserve0: number
  reserve1: number
  loadUserBalanceToken0: (addressToken0: string) => Promise<void>
  loadUserBalanceToken1: (addressToken0: string) => Promise<void>
  userBalanceToken0: string
  userBalanceToken1: string
}

export const ContractContext = createContext<IContract>({
  getAmountsOut: async () => '',
  getAmountsIn: async () => '',
  loadReservePair: async () => {},
  reserve0: 0,
  reserve1: 0,
  loadUserBalanceToken0: async () => {},
  loadUserBalanceToken1: async () => {},
  userBalanceToken0: "",
  userBalanceToken1: "",
})

interface ChildrenProps {
  children: React.ReactNode
}

export const ContractProvider = ({ children }: ChildrenProps) => {
  const { chain } = useNetwork()
  let providerWindow: ethers.providers.Web3Provider
  let providerRPCAvalanchefuji: ethers.providers.JsonRpcProvider
  providerRPCAvalanchefuji = new ethers.providers.JsonRpcProvider(FindRPCByChainID(43114))

  const contractCrossDexRouter = new ethers.Contract(
      ContractAddressRouter,
      artifactCrossDexRouter.abi,
      providerRPCAvalanchefuji
  ) as CrossDexRouter
  const contractCrossDexFactory = new ethers.Contract(
      ContractAddressFactory,
      artifactCrossDexFactory.abi,
      providerRPCAvalanchefuji
  ) as CrossDexFactory

  if (typeof window !== 'undefined') {
    try {
      providerWindow = new ethers.providers.Web3Provider(window.ethereum as any)
    } catch (error) {}
  }
  
  const [initialLoading, setInitialLoading] = useState(true)
  
  const [reserve0, setReserve0] = useState<number>(0)
  const [reserve1, setReserve1] = useState<number>(0)
  const [userBalanceToken0, setUserBalanceToken0] = useState<string>('')
  const [userBalanceToken1, setUserBalanceToken1] = useState<string>('')

  
  const getAxelraTokenContract = (addressToken: string) => {
    const contract = new ethers.Contract(
      addressToken,
      artifactAxelraToken.abi,
      providerWindow
    ) as AxelraToken0

    return contract
  }


  useEffect(() => {
    if (!window.ethereum) return alert('Please install metamask')
    const loadInint = async() => {
      addlistenerEvents()
      loadUserBalanceToken0(FindAddressTokenByChainID(chain!.id,true))
      loadUserBalanceToken1(FindAddressTokenByChainID(chain!.id, false))
    }
    loadInint()
    setInitialLoading(false)
  }, [])

  const getAmountsOut = async (amountIn: string,addressTokenIn: string,addressTokenOut: string) => {
    try {
      if (!window.ethereum) return ''
      const result = await contractCrossDexRouter.getAmountsOut(
        toWei(amountIn),
        addressTokenIn,
        addressTokenOut,
      )
      return toEtherFloatingPoint(result,8)
    } catch (error) {
      console.log(error)
      return "0"
    }
  }

  const getAmountsIn = async (amountOut: string,addressTokenIn: string,addressTokenOut: string) => {
    try {
      if (!window.ethereum) return ''
      const result = await contractCrossDexRouter.getAmountsIn(
        toWei(amountOut),
        addressTokenIn,
        addressTokenOut
      )
      return toEtherFloatingPoint(result,8)
    } catch (error) {
      console.log(error)
      return "0"
    }
  }

  const loadReservePair = async (addressToken0: string,addressToken1: string) => {
    try {
      if (!window.ethereum) return
      const pairLP = await contractCrossDexFactory.getPair(
        addressToken0,
        addressToken1,
      )
      const contractCrossDexPair = new ethers.Contract(
        pairLP,
        artifactCrossDexPair.abi,
        providerRPCAvalanchefuji
      ) as CrossDexPair
      const result = await contractCrossDexPair.getReserves()
      setReserve0(Number(toEther(result._reserve0)))
      setReserve1(Number(toEther(result._reserve1)))
    } catch (error) {
      console.log(error)
    }
  }

  const loadUserBalanceToken0 = async (addressToken0: string) => {
    try {
      if (!window.ethereum) return
      const contractToken0 = getAxelraTokenContract(addressToken0) 
      const accounts = (await window.ethereum.request({ method: 'eth_accounts', }))[0]
      const result = await contractToken0.balanceOf(accounts)
      setUserBalanceToken0(toEther(result))
    } catch (error) {
      console.log(error)
    }
  }
  const loadUserBalanceToken1 = async (addressToken0: string) => {
    try {
      if (!window.ethereum) return
      const contractToken0 = getAxelraTokenContract(addressToken0) 
      const accounts = (await window.ethereum.request({ method: 'eth_accounts', }))[0]
      const result = await contractToken0.balanceOf(accounts)
      setUserBalanceToken1(toEther(result))
    } catch (error) {
      console.log(error)
    }
  }


  

  const addlistenerEvents = async () => {
    try {
 
      if (window.ethereum != undefined) {
        //@ts-ignore
        window.ethereum.on('accountsChanged', () => {
          window.location.reload()
        })
        interface ConnectInfo {
          chainId: string
        }

        //@ts-ignore
        window.ethereum.on('chainChanged', (_chainId) => {
          window.location.reload()
        })
      }
    } catch (error) {}
  }
  
  return (
    <ContractContext.Provider
      value={{
        getAmountsOut,
        getAmountsIn,
        loadReservePair,
        reserve0,
        reserve1,
        loadUserBalanceToken0,
        loadUserBalanceToken1,
        userBalanceToken0,
        userBalanceToken1,
      }}
    >
      {!initialLoading && children}
    </ContractContext.Provider>
  )
}
