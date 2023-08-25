import React, { createContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import  artifactCrossDexRouter from '../../smart contract/artifacts/contracts/CrossDex/CrossDexRouter.sol/CrossDexRouter.json'
import  artifactCrossDexFactory from '../../smart contract/artifacts/contracts/CrossDex/CrossDexFactory.sol/CrossDexFactory.json'
import  artifactCrossDexPair from '../../smart contract/artifacts/contracts/CrossDex/CrossDexPair.sol/CrossDexPair.json'
import  artifactSecondaryChainAxelraDexMsg from '../../smart contract/artifacts/contracts/Axelra/SecondaryChainAxelraDexMsg.sol/SecondaryChainAxelraDexMsg.json'
import  artifactAxelraToken from '../../smart contract/artifacts/contracts/Axelra/AxelraToken.sol/axelraToken0.json'
import { CrossDexRouter,CrossDexFactory,CrossDexPair,AxelraToken0,SecondaryChainAxelraDexMsg } from '../../smart contract/typechain-types'
import {
  toEtherandFixFloatingPoint,
  toWei,
  toEther,
  toEtherFloatingPoint,
  toFixUnits
} from '../utils/UnitInEther'
import { useAccount, useNetwork } from 'wagmi'
import { CheckAvailableChainByChainID, FindAddressAxelraByChainID, FindAddressTokenByChainID, FindRPCByChainID } from '../utils/findByChainId'
import { ContractAddressRouter,ContractAddressFactory, ChainIDAvalanchefuji ,listPairLPMainChain, ChainIDMainChainDex} from '../utils/valueConst'

interface IContract {
  getAmountsOut: (
    amountIn: string,
    addressTokenIn: string,
    addressTokenOut: string
  ) => Promise<string>
  getAmountsIn: (
    amountOut: string,
    addressTokenIn: string,
    addressTokenOut: string
  ) => Promise<string>
  loadReservePairMainChain: (
    addressToken0: string,
    addressToken1: string
  ) => Promise<void>
  loadUserBalanceToken: (
    addressToken0: string,
    addressToken1: string
  ) => Promise<void>
  getQuoteForAddLiquidity: (
    amount0: string,
    reserve0: string,
    reserve1: string
  ) => Promise<string>
  reserve: { [x: string]: string }
  userBalanceToken: { [x: string]: string }
  loadingUserBalanceToken: boolean
  userBalancePairLP: string
  loadingBalancePairLP: boolean
  totalSupplyPairLP: string
  sendTxBridgeSwap: ( amountIn: string, amountOutMin: string, addressTokenIN: string, addressTokenOut: string, destinationAddressReceiveToken: string, destinationChainReceiveToken: string) => Promise<string>
  sendTxBridgeRemoveLiquidity: (   amountliquidity: string,   addressToken0: string,   addressToken1: string,   destinationAddressReceiveToken: string,   destinationChainReceiveToken: string) => Promise<string>
  sendTxBridgeAddLiquidity: (   amount0: string,   amount1: string,   addressToken0: string,   addressToken1: string,   isForceAdd: boolean,   destinationAddressReceiveToken: string,   destinationChainReceiveToken: string) => Promise<string>
  sendTxSwapExactTokensForTokens: (   amountIn: string,   amountOutMin: string,   addressTokenIN: string,   addressTokenOut: string,   to: string,   deadline: number) => Promise<string>
  sendTxRemoveLiquidity: (  liquidity: string,  addressToken0: string,  addressToken1: string,  to: string,  deadline: number) => Promise<string>
  sendTxAddLiquidity: (  amount0: string,  amount1: string,  addressToken0: string,  addressToken1: string,  isForceAdd: boolean,  to: string,  deadline: number) => Promise<string>
}

export const ContractContext = createContext<IContract>({
  getAmountsOut: async () => '0',
  getAmountsIn: async () => '0',
  loadReservePairMainChain: async () => {},
  loadUserBalanceToken: async () => {},
  getQuoteForAddLiquidity: async () => '0',
  reserve: {},
  userBalanceToken: {},
  loadingUserBalanceToken: false,
  userBalancePairLP: '0',
  loadingBalancePairLP: false,
  totalSupplyPairLP: '0',
  sendTxBridgeSwap: async () => '',
  sendTxBridgeRemoveLiquidity: async () => '',
  sendTxBridgeAddLiquidity: async () => '',
  sendTxSwapExactTokensForTokens: async () => '',
  sendTxRemoveLiquidity: async () => '',
  sendTxAddLiquidity: async () => '',
})

interface ChildrenProps {
  children: React.ReactNode
}

export const ContractProvider = ({ children }: ChildrenProps) => {
  const { chain } = useNetwork()
  const { isDisconnected } = useAccount()
  let providerWindow: ethers.providers.Web3Provider
  let providerRPCAvalanchefuji: ethers.providers.JsonRpcProvider
  providerRPCAvalanchefuji = new ethers.providers.JsonRpcProvider(
    FindRPCByChainID(43114)
  )

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

  const [reserve, setReserve] = useState<{ [x: string]: string }>({})

  // balance token
  const [userBalanceToken, setUserBalanceToken] = useState<{
    [x: string]: string
  }>({})
  const [loadingUserBalanceToken, setLoadingUserBalanceToken] =
    useState<boolean>(false)

  // balance PairLP
  const [userBalancePairLP, setUserBalancePairLP] = useState<string>('')
  const [loadingBalancePairLP, setloadingBalancePairLP] =
    useState<boolean>(false)
  const [totalSupplyPairLP, setTotalSupplyPairLP] = useState<string>('')

  const getAxelraTokenContract = (addressToken: string) => {
    const contract = new ethers.Contract(
      addressToken,
      artifactAxelraToken.abi,
      providerWindow
    ) as AxelraToken0

    return contract
  }

  useEffect(() => {
    const loadInint = async () => {
      addlistenerEvents()
      if (chain) {
        loadUserBalanceToken(
          FindAddressTokenByChainID(chain.id, true),
          FindAddressTokenByChainID(chain.id, false)
        )
      }
      loadReservePairMainChain(
        FindAddressTokenByChainID(ChainIDAvalanchefuji, true),
        FindAddressTokenByChainID(ChainIDAvalanchefuji, false)
      )
      loadPairLPToken(listPairLPMainChain['USDT-USDC'].contractAddress)
    }
    loadInint()
    setInitialLoading(false)
  }, [])

  const getAmountsOut = async (
    amountIn: string,
    addressTokenIn: string,
    addressTokenOut: string
  ) => {
    try {
      const result = await contractCrossDexRouter.getAmountsOut(
        toWei(amountIn),
        addressTokenIn,
        addressTokenOut
      )
      return toEtherFloatingPoint(result, 8)
    } catch (error) {
      console.log(error)
      return '0'
    }
  }

  const getAmountsIn = async (
    amountOut: string,
    addressTokenIn: string,
    addressTokenOut: string
  ) => {
    try {
      const result = await contractCrossDexRouter.getAmountsIn(
        toWei(amountOut),
        addressTokenIn,
        addressTokenOut
      )
      return toEtherFloatingPoint(result, 8)
    } catch (error) {
      console.log(error)
      return '0'
    }
  }

  const getQuoteForAddLiquidity = async (
    amount0: string,
    reserve0: string,
    reserve1: string
  ) => {
    try {
      const result = await contractCrossDexRouter.quote(
        toWei(amount0),
        toWei(reserve0),
        toWei(reserve1)
      )
      return toEther(result)
    } catch (error) {
      console.log(error)
      return '0'
    }
  }

  const loadReservePairMainChain = async (
    addressToken0: string,
    addressToken1: string
  ) => {
    try {
      const pairLP = await contractCrossDexFactory.getPair(
        addressToken0,
        addressToken1
      )
      const contractCrossDexPair = new ethers.Contract(
        pairLP,
        artifactCrossDexPair.abi,
        providerRPCAvalanchefuji
      ) as CrossDexPair
      const result = await contractCrossDexPair.getReserves()
      const [address0, address1] = await Promise.all([
        contractCrossDexPair.token0(),
        contractCrossDexPair.token1(),
      ])
      const DTO = {
        [address0]: toEther(result._reserve0),
        [address1]: toEther(result._reserve1),
      }
      setReserve(DTO)
    } catch (error) {
      console.log(error)
    }
  }
  const loadUserBalanceToken = async (
    addressToken0: string,
    addressToken1: string
  ) => {
    try {
      if (!window.ethereum) return
      setLoadingUserBalanceToken(true)
      const contractToken0 = getAxelraTokenContract(addressToken0)
      const contractToken1 = getAxelraTokenContract(addressToken1)
      const accounts = (
        await window.ethereum.request({ method: 'eth_accounts' })
      )[0]
      const [result0, result1] = await Promise.all([
        contractToken0.balanceOf(accounts),
        contractToken1.balanceOf(accounts),
      ])
      const DTO = {
        [addressToken0]: toEther(result0),
        [addressToken1]: toEther(result1),
      }
      setUserBalanceToken(DTO)
      setLoadingUserBalanceToken(false)
    } catch (error) {
      console.log(error)
      setLoadingUserBalanceToken(false)
    }
  }
  const loadPairLPToken = async (addressPairLP: string) => {
    try {
      setloadingBalancePairLP(true)

      const contractTokenPairLP = new ethers.Contract(
        addressPairLP,
        artifactCrossDexPair.abi,
        providerRPCAvalanchefuji
      ) as CrossDexPair

      const  resultTotalSupply  = await contractTokenPairLP.totalSupply()
      setTotalSupplyPairLP(toEther(resultTotalSupply))

      if (window.ethereum) {
        const accounts = (
          await window.ethereum.request({ method: 'eth_accounts' })
          )[0]
        const  resultUser = await   contractTokenPairLP.balanceOf(accounts)
        setUserBalancePairLP(toEther(resultUser))
      }


      setloadingBalancePairLP(false)
    } catch (error) {
      console.log(error)
      setloadingBalancePairLP(false)
    }
  }

  // Secondary Chain use

  const sendTxBridgeSwap = async (
    amountIn: string,
    amountOutMin: string,
    addressTokenIN: string,
    addressTokenOut: string,
    destinationAddressReceiveToken: string,
    destinationChainReceiveToken: string
  ) => {
    try {
      if (!window.ethereum) console.log('Please install metamask')
      if (isDisconnected) throw new Error('disconnect wallet')
      if (!CheckAvailableChainByChainID(chain?.id)) throw new Error('wrong network')
      const signer = providerWindow.getSigner()
      const contractSecondaryChainAxelra = new ethers.Contract(
        FindAddressAxelraByChainID(chain?.id),
        artifactSecondaryChainAxelraDexMsg.abi,
        signer
      ) as SecondaryChainAxelraDexMsg
      const transactionHash = await contractSecondaryChainAxelra.bridgeSwap(
        toWei(amountIn),
        toWei(amountOutMin),
        addressTokenIN,
        addressTokenOut,
        destinationAddressReceiveToken,
        destinationChainReceiveToken,
        {
          value: toWei('2'),
        }
      )
      await transactionHash.wait()
      loadUserBalanceToken(
        FindAddressTokenByChainID(chain?.id, true),
        FindAddressTokenByChainID(chain?.id, false)
      )
      return transactionHash.hash
    } catch (error: any) {
      if (error.reason) {
        throw new Error(error.reason)
      } else if (error.data?.message) {
        throw new Error(error.data.message)
      } else {
        throw new Error(error)
      }
    }
  }

  const sendTxBridgeAddLiquidity = async (
    amount0: string,
    amount1: string,
    addressToken0: string,
    addressToken1: string,
    isForceAdd: boolean,
    destinationAddressReceiveToken: string,
    destinationChainReceiveToken: string
  ) => {
    try {
      if (!window.ethereum) console.log('Please install metamask')
      if (isDisconnected) throw new Error('disconnect wallet')
      if (!CheckAvailableChainByChainID(chain?.id)) throw new Error('wrong network')
      const signer = providerWindow.getSigner()
      const contractSecondaryChainAxelra = new ethers.Contract(
        FindAddressAxelraByChainID(chain?.id),
        artifactSecondaryChainAxelraDexMsg.abi,
        signer
      ) as SecondaryChainAxelraDexMsg
      const transactionHash =
        await contractSecondaryChainAxelra.bridgeAddLiquidity(
          toWei(amount0),
          toWei(amount1),
          addressToken0,
          addressToken1,
          isForceAdd,
          destinationAddressReceiveToken,
          destinationChainReceiveToken,
          {
            value: toWei('2'),
          }
        )
      await transactionHash.wait()
      loadUserBalanceToken(
        FindAddressTokenByChainID(chain?.id, true),
        FindAddressTokenByChainID(chain?.id, false)
      )
      return transactionHash.hash
    } catch (error: any) {
      if (error.reason) {
        throw new Error(error.reason)
      } else if (error.data?.message) {
        throw new Error(error.data.message)
      } else {
        throw new Error(error)
      }
    }
  }

  const sendTxBridgeRemoveLiquidity = async (
    amountliquidity: string,
    addressToken0: string,
    addressToken1: string,
    destinationAddressReceiveToken: string,
    destinationChainReceiveToken: string
  ) => {
    try {
      if (!window.ethereum) console.log('Please install metamask')
      if (isDisconnected) throw new Error('disconnect wallet')
      if (!CheckAvailableChainByChainID(chain?.id)) throw new Error('wrong network')
      const signer = providerWindow.getSigner()
      const contractSecondaryChainAxelra = new ethers.Contract(
        FindAddressAxelraByChainID(chain?.id),
        artifactSecondaryChainAxelraDexMsg.abi,
        signer
      ) as SecondaryChainAxelraDexMsg
      const transactionHash =
        await contractSecondaryChainAxelra.bridgeRemoveLiquidity(
          toWei(amountliquidity),
          addressToken0,
          addressToken1,
          destinationAddressReceiveToken,
          destinationChainReceiveToken,
          {
            value: toWei('2'),
          }
        )
      await transactionHash.wait()
      return transactionHash.hash
    } catch (error: any) {
      if (error.reason) {
        throw new Error(error.reason)
      } else if (error.data?.message) {
        throw new Error(error.data.message)
      } else {
        throw new Error(error)
      }
    }
  }

  // Main Chain use
  const sendTxSwapExactTokensForTokens = async (
    amountIn: string,
    amountOutMin: string,
    addressTokenIN: string,
    addressTokenOut: string,
    to: string,
    deadline: number
  ) => {
    try {
      if (!window.ethereum) console.log('Please install metamask')
      if (isDisconnected) throw new Error('disconnect wallet')
      if (!CheckAvailableChainByChainID(chain?.id)) throw new Error('wrong network')
      if (chain?.id != ChainIDMainChainDex) throw new Error('Only use in main chain')
      const signer = providerWindow.getSigner()
      const contractCrossDexRouter = new ethers.Contract(
        ContractAddressRouter,
        artifactCrossDexRouter.abi,
        signer
      ) as CrossDexRouter
      const transactionHash =
        await contractCrossDexRouter.swapExactTokensForTokens(
          toWei(amountIn),
          toWei(amountOutMin),
          addressTokenIN,
          addressTokenOut,
          to,
          deadline
        )
      await transactionHash.wait()
      loadUserBalanceToken(
        FindAddressTokenByChainID(chain?.id, true),
        FindAddressTokenByChainID(chain?.id, false)
      )
      return transactionHash.hash
    } catch (error: any) {
      if (error.reason) {
        throw new Error(error.reason)
      } else if (error.data?.message) {
        throw new Error(error.data.message)
      } else {
        throw new Error(error)
      }
    }
  }

  const sendTxAddLiquidity = async (
    amount0: string,
    amount1: string,
    addressToken0: string,
    addressToken1: string,
    isForceAdd:boolean,
    to: string,
    deadline: number
  ) => {
    try {
      if (!window.ethereum) console.log('Please install metamask')
      if (isDisconnected) throw new Error('disconnect wallet')
      if (!CheckAvailableChainByChainID(chain?.id)) throw new Error('wrong network')
      if (chain?.id != ChainIDMainChainDex) throw new Error('Only use in main chain')
      const signer = providerWindow.getSigner()
      const contractCrossDexRouter = new ethers.Contract(
        ContractAddressRouter,
        artifactCrossDexRouter.abi,
        signer
      ) as CrossDexRouter
      const transactionHash = await contractCrossDexRouter.addLiquidity(
        toWei(amount0),
        toWei(amount1),
        addressToken0,
        addressToken1,
        isForceAdd,
        to,
        deadline
      )
      await transactionHash.wait()
      loadUserBalanceToken(
        FindAddressTokenByChainID(chain?.id, true),
        FindAddressTokenByChainID(chain?.id, false)
      )
      return transactionHash.hash
    } catch (error: any) {
      if (error.reason) {
        throw new Error(error.reason)
      } else if (error.data?.message) {
        throw new Error(error.data.message)
      } else {
        throw new Error(error)
      }
    }
  }

  const sendTxRemoveLiquidity = async (
    liquidity: string,
    addressToken0: string,
    addressToken1: string,
    to: string,
    deadline: number
  ) => {
    try {
      if (!window.ethereum) console.log('Please install metamask')
      if (isDisconnected) throw new Error('disconnect wallet')
      if (!CheckAvailableChainByChainID(chain?.id)) throw new Error('wrong network')
      if (chain?.id != ChainIDMainChainDex) throw new Error('Only use in main chain')
      const signer = providerWindow.getSigner()
      const contractCrossDexRouter = new ethers.Contract(
        ContractAddressRouter,
        artifactCrossDexRouter.abi,
        signer
      ) as CrossDexRouter
      const transactionHash = await contractCrossDexRouter.removeLiquidity(
        toWei(liquidity),
        addressToken0,
        addressToken1,
        to,
        deadline
      )
      await transactionHash.wait()
      loadUserBalanceToken(
        FindAddressTokenByChainID(chain?.id, true),
        FindAddressTokenByChainID(chain?.id, false)
      )
      return transactionHash.hash
    } catch (error: any) {
      if (error.reason) {
        throw new Error(error.reason)
      } else if (error.data?.message) {
        throw new Error(error.data.message)
      } else {
        throw new Error(error)
      }
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
        loadReservePairMainChain,
        loadUserBalanceToken,
        getQuoteForAddLiquidity,
        reserve,
        userBalanceToken,
        loadingUserBalanceToken,
        userBalancePairLP,
        loadingBalancePairLP,
        totalSupplyPairLP,
        sendTxBridgeSwap,
        sendTxBridgeRemoveLiquidity,
        sendTxBridgeAddLiquidity,
        sendTxSwapExactTokensForTokens,
        sendTxRemoveLiquidity,
        sendTxAddLiquidity,
      }}
    >
      {!initialLoading && children}
    </ContractContext.Provider>
  )
}
