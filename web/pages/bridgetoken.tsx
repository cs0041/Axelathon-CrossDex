import React, { useContext, useState } from 'react'
import MyListBoxChain from '../components/MyListBoxChain'
import MyListBoxTrade from '../components/MyListBoxTrade'
import SVGLoader from '../components/SVGLoader'
import { useAccount, useNetwork } from 'wagmi'
import MyRecipientAddressModal from '../components/MyRecipientAddressModal'
import {
  AllowListTradeToken,
  ChainIDMainChainDex,
  ChainNameMainChainDex,
  listBoxChainName,
  listPairLPMainChain,
} from '../utils/valueConst'
import {
  FindAddressTokenByChainID,
  GetChainNameByChainId,
} from '../utils/findByChainId'
import { ContractContext } from '../context/contractContext'
import { notificationToast } from '../utils/notificationToastify'
import { shortenAddress } from '../utils/shortenAddress'


type Props = {}

enum TabBar {
  Pos = 'Positions',
  Add = 'Add',
  Remove = 'Remove',
}

function bridgetoken({}: Props) {
  const {
    userBalanceToken,
    loadingUserBalanceToken,
    sendTxBridgeToken
  } = useContext(ContractContext)

  // wagmi
  const { chain } = useNetwork()
  const { address } = useAccount()

  // Modal
  const [showModalEditAddress, setShowModalEditAddress] = useState(false)

  // modal setting Recipient Address
  const [recipientAddress, setRecipientAddress] = useState<string | undefined>(
    address
  )

  // Destination  chain name
  const [destinationChainName, setDestinationChainName] = useState<string>(
    GetChainNameByChainId(chain?.id)
  )

  //data input bridge token
  const [inputBridge, setInputBridge] = useState<string>('')

  // list trade token
  const [addressToken, setAddressToken] = useState<string>(FindAddressTokenByChainID(chain?.id, true))

  const [symbolToken, setSymbolToken] = useState<string>(AllowListTradeToken.Avalanche.Token0.symbol)


  return (
    <div className="flex mt-5 mb-24 xs:mt-14 p-2 justify-center items-center">
      <div className="relative bg-[#0D111C] px-2 py-3 rounded-3xl border-[1px] border-[#fafafa4d]  w-[450px]">
        <div className="flex flex-row justify-between items-center mb-2 px-2">
          <h1 className="font-bold text-sm">Bridge Token</h1>
        </div>
        <div className="InputOrder rounded-b-none gap-1 pt-2 pb-3 px-4">
          <span className="text-gray-500">Amount to bridge</span>
          <div className="flex flex-row gap-2 ">
            <input
              className="text-3xl  w-full   text-left  bg-transparent outline-none  text-white"
              placeholder="0"
              type="number"
              onKeyPress={(event) => {
                if (!/^[0-9]*[.,]?[0-9]*$/.test(event.key)) {
                  event.preventDefault()
                }
              }}
              value={inputBridge}
              onChange={async (e) => {
                setInputBridge(e.target.value)
              }}
            />
            <div className="w-4/12 flex">
              <MyListBoxTrade
                nowSymbolToken={symbolToken}
                setAddressToken={setAddressToken}
                setSymbolToken={setSymbolToken}
                listItem={[
                  {
                    symbol: AllowListTradeToken.Avalanche.Token0.symbol,
                    contractAddress: FindAddressTokenByChainID(chain?.id, true),
                  },
                  {
                    symbol: AllowListTradeToken.Avalanche.Token1.symbol,
                    contractAddress: FindAddressTokenByChainID(
                      chain?.id,
                      false
                    ),
                  },
                ]}
              />
            </div>
            {/* <div className="bg-[#293249]   flex flex-row justify-center items-center px-4 py-0   gap-1 rounded-lg text-sm">
              <img src="logo.png" alt="logo" className="w-6 h-6" />
              <span>{symbolToken}</span>
            </div> */}
          </div>
          <div className="flex justify-end gap-2 text-sm text-gray-400">
            <span>Balance</span>
            {loadingUserBalanceToken ? (
              <SVGLoader />
            ) : (
              Number(userBalanceToken[addressToken]).toFixed(6)
            )}
            <span
              onClick={() => {
                setInputBridge(userBalanceToken[addressToken])
              }}
              className="text-blue-500 cursor-pointer hover:text-blue-700 transition-all"
            >
              Max
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            notificationToast(
              sendTxBridgeToken(
                inputBridge,
                addressToken,
                recipientAddress!,
                destinationChainName
              ),
              chain?.id,
              true
            )
          }}
          disabled={
            Number(userBalanceToken[addressToken]) < Number(inputBridge)
          }
          className={`mt-2 flex w-full py-3 rounded-2xl  items-center justify-center 
                transition-all 
                ${
                  Number(userBalanceToken[addressToken]) < Number(inputBridge)
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-700 hover:bg-blue-600'
                }
                `}
        >
          <h1 className="text-xl font-bold">
            {Number(userBalanceToken[addressToken]) < Number(inputBridge)
              ? 'Insufficient user balance'
              : 'Bridge Token'}
          </h1>
        </button>

        <div
          className="bg-[#121A2A] flex flex-col mt-2 rounded-lg py-2 px-4 justify-center items-start 
          text-gray-300  text-xs gap-2 "
        >
          <div className="flex flex-row w-full items-center justify-between ">
            <div>Recipient Address</div>
            <div className="flex gap-1">
              <span> {shortenAddress(recipientAddress)} </span>
              <span
                className="text-blue-500 underline cursor-pointer hover:opacity-60 transition-all"
                onClick={() => setShowModalEditAddress(true)}
              >
                Edit
              </span>
            </div>
          </div>
          <div className="flex flex-row w-full items-center justify-between">
            <div>Destination Chain ReceiveToken</div>
            <MyListBoxChain
              listItem={listBoxChainName}
              nowChainName={destinationChainName}
              setDestinationChainName={setDestinationChainName}
            />
          </div>
        </div>
      </div>

      {showModalEditAddress && (
        <MyRecipientAddressModal
          recipientAddress={recipientAddress}
          setRecipientAddress={setRecipientAddress}
          onClose={() => setShowModalEditAddress(false)}
        />
      )}
    </div>
  )
}

export default bridgetoken

