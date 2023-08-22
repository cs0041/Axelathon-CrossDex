import { ChainIDAvalanchefuji, ChainIDMumbai,ChainIDFantomTestnet, AllowListTradeToken } from './valueConst'

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

 
export function FindAddressTokenByChainID(chainID: number,Token0or1: boolean): string {
    let addressToken = ""
    switch (chainID) {
      case ChainIDAvalanchefuji:
        addressToken = Token0or1
          ? AllowListTradeToken.Avalanche.Token0
          : AllowListTradeToken.Avalanche.Token1
        break
      case ChainIDMumbai:
          addressToken = Token0or1
            ? AllowListTradeToken.Avalanche.Token0
            : AllowListTradeToken.Avalanche.Token1
        break
      case ChainIDFantomTestnet:
          addressToken = Token0or1
            ? AllowListTradeToken.Fantom.Token0
            : AllowListTradeToken.Fantom.Token1
        break
      default:
          addressToken = Token0or1
            ? AllowListTradeToken.Avalanche.Token0
            : AllowListTradeToken.Avalanche.Token1
        break
    }
   
  return addressToken
}

 