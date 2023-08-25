import {
  AxelarGMPRecoveryAPI,
  Environment,
  GMPStatusResponse,
  EvmChain,
} from '@axelar-network/axelarjs-sdk'

const sdk = new AxelarGMPRecoveryAPI({
  environment: Environment.TESTNET,
})

export const readStatusAxelarTx = async(txHash:string) => {
    console.log("start find status . . .")
    const txStatus: GMPStatusResponse = await sdk.queryTransactionStatus(txHash)
    // console.log("status",txStatus.status)
    // console.log("gasPaidInfo",txStatus.gasPaidInfo)
    // console.log("callTx",txStatus.callTx)
    // console.log("callback",txStatus.callback)
    console.log("ALLLL",txStatus)
    return txStatus
}

export const sendTxAddGas = async (txHash: string) => {
  console.log('send add gas')
    const { success, transaction, error } = await sdk.addNativeGas(
        EvmChain.FANTOM,
        txHash,
    )
    if (success) {
      console.log('Added native gas tx:', transaction?.transactionHash)
      return transaction?.transactionHash
    } else {
      console.log('Cannot add native gas', error)
      throw Error(error)
    }
}

export const sendTxExecute  = async (txHash: string) => {
    const {success,transaction,error} = await sdk.execute(
      txHash,
    )
    if (success) {
      console.log('Execute manually tx:', transaction?.transactionHash)
    } else {
      console.log('Cannot execute manually', error)
    }
}
