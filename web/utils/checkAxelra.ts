import {
  AxelarGMPRecoveryAPI,
  Environment,
  GMPStatusResponse,
  EvmChain,
} from '@axelar-network/axelarjs-sdk'
import { ChainIDAvalanchefuji } from './valueConst'
import { ChainIDMumbai } from './valueConst'
import { ChainIDFantomTestnet } from './valueConst'

const sdk = new AxelarGMPRecoveryAPI({
  environment: Environment.TESTNET,
})

export const readStatusAxelarTx = async(txHash:string) => {
    const txStatus: GMPStatusResponse = await sdk.queryTransactionStatus(txHash)
    return txStatus
}

export const sendTxAddGas = async (txHash: string,chainName:string) => {
  try {
    const { success, transaction, error } = await sdk.addNativeGas(
      findEvmChainObjByChainName(chainName),
      txHash
    )
    if (success) {
      console.log('Added native gas tx:', transaction?.transactionHash)
      return transaction?.transactionHash
    } else {
      console.log('Cannot add native gas', error)
       throw new Error('Cannot add native gas' + error)
    }
  }  catch (error: any) {
    if (error.reason) {
      throw new Error(error.reason)
    } else if (error.data?.message) {
      throw new Error(error.data.message)
    } else {
      throw new Error(error)
    }
  }
    
}

export const sendTxExecute  = async (txHash: string) => {
   try {
     const { success, transaction, error } = await sdk.execute(txHash)
     if (success) {
       console.log('Execute manually tx:', transaction?.transactionHash)
       return transaction?.transactionHash
     } else {
       console.log('Cannot execute manually', error)
       throw new Error('Cannot execute manually ' + error)
     }
   } catch (error:any) {
      if (error.reason) {
        throw new Error(error.reason)
      } else if (error.data?.message) {
        throw new Error(error.data.message)
      } else {
        throw new Error(error)
      }
   }
   
}


const findEvmChainObjByChainName = (chainName: string) => {
  switch (chainName) {
    case 'avalanche':
      return EvmChain.AVALANCHE
    case 'polygon':
      return EvmChain.POLYGON
    case 'fantom':
      return EvmChain.FANTOM
    default:
      return EvmChain.FANTOM
  }
}