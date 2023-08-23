import { ChainIDAvalanchefuji, ChainIDMumbai,ChainIDFantomTestnet, AllowListTradeToken, listAxelra } from './valueConst'

export function FindRPCByChainID(chainID: number): string {
    let rpc = ""
    switch (chainID) {
      case ChainIDAvalanchefuji:
        rpc = 'https://avalanche-fuji.blockpi.network/v1/rpc/public'
        break
      case ChainIDMumbai:
        rpc = 'https://polygon-mumbai-bor.publicnode.com'
        break
      case ChainIDFantomTestnet:
        rpc = 'https://endpoints.omniatech.io/v1/fantom/testnet/public'
        break
      default:
        rpc = 'https://avalanche-fuji.blockpi.network/v1/rpc/public'
        break
    }
   
  return rpc
}

 
export function FindAddressTokenByChainID(chainID: number | undefined,isToken0: boolean): string {
    let addressToken = ""
    switch (chainID) {
      case ChainIDAvalanchefuji:
        addressToken = isToken0
          ? AllowListTradeToken.Avalanche.Token0.contractAddress
          : AllowListTradeToken.Avalanche.Token1.contractAddress
        break
      case ChainIDMumbai:
          addressToken = isToken0
            ? AllowListTradeToken.Avalanche.Token0.contractAddress
            : AllowListTradeToken.Avalanche.Token1.contractAddress
        break
      case ChainIDFantomTestnet:
          addressToken = isToken0
            ? AllowListTradeToken.Fantom.Token0.contractAddress
            : AllowListTradeToken.Fantom.Token1.contractAddress
        break
      default:
          addressToken = isToken0
            ? AllowListTradeToken.Avalanche.Token0.contractAddress
            : AllowListTradeToken.Avalanche.Token1.contractAddress
        break
    }
   
  return addressToken
}

export function FindAddressAxelraByChainID(chainID: number | undefined): string {
    let addressAxekra = ""
    switch (chainID) {
      case ChainIDAvalanchefuji:
        addressAxekra = listAxelra.Avalanche.contractAddress
        break
      case ChainIDMumbai:
        addressAxekra = listAxelra.Avalanche.contractAddress
        break
      case ChainIDFantomTestnet:
        addressAxekra = listAxelra.Fantom.contractAddress
        break
      default:
        addressAxekra = listAxelra.Fantom.contractAddress
        break
    }
   
  return addressAxekra
}

 export function CheckAvailableChainByChainID(chainID: number | undefined): boolean {
   switch (chainID) {
     case ChainIDAvalanchefuji:
       return true
       break
     case ChainIDMumbai:
       return true
       break
     case ChainIDFantomTestnet:
       return true
       break
     default:
       return false
       break
   }
 }

 export function GetChainNameByChainId(chainID: number | undefined): string {
     let chainName = ''
     switch (chainID) {
       case ChainIDAvalanchefuji:
         chainName = 'Avalanche'
         break
       case ChainIDMumbai:
        chainName = 'Polygon'
         break
       case ChainIDFantomTestnet:
         chainName = 'Fantom'
         break
       default:
         chainName = 'Avalanche'
         break
     }

     return chainName
 }