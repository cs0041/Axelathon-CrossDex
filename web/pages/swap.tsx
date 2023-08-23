import React, { useContext, useEffect, useState }  from 'react'
import {
  Cog6ToothIcon,
  ArrowDownCircleIcon,
} from '@heroicons/react/24/solid'
import {
  InformationCircleIcon,
} from '@heroicons/react/20/solid'
import SVGLoader from '../components/SVGLoader'
import MyRecipientAddressModal from '../components/MyRecipientAddressModal'
import { useAccount, useNetwork } from 'wagmi'
import MyListBoxChain from '../components/MyListBoxChain'
import MySettingModal from '../components/MySettingModal'
import { ContractContext } from '../context/contractContext'
import { shortenAddress } from '../utils/shortenAddress'
import { FindAddressTokenByChainID, GetChainNameByChainId } from '../utils/findByChainId'
import { ChainIDAvalanchefuji, ChainNameMainChainDex, listBoxChainName } from '../utils/valueConst'
import { notificationToast } from '../utils/notificationToastify'

type Props = {}

function swap({}: Props) {
  const {
    getAmountsOut,
    getAmountsIn,
    loadReservePairMainChain,
    reserve,
    userBalanceToken,
    loadUserBalanceToken,
    sendTxBridgeSwap,
  } = useContext(ContractContext)

  // wagmi
  const { address } = useAccount()
  const { chain } = useNetwork()

  // Modal
  const [showModalEditAddress, setShowModalEditAddress] = useState(false)
  const [showModalSetting, setShowModalSetting] = useState(false)

  // loading
  const [loadingPrice, setLoadingPrice] = useState(false)
  const [loadingIn, setLoadingIn] = useState(false)
  const [loadingOut, setLoadingOut] = useState(false)

  // modal setting swap
  const [slippage, setSlippage] = useState<number>(0.1)
  const [deadline, setDeadline] = useState<number>(20)

  // modal setting Recipient Address
  const [recipientAddress, setRecipientAddress] = useState<string | undefined>( address)
  
  // Destination  chain name
  const [destinationChainName,setDestinationChainName] = useState<string>( GetChainNameByChainId(chain?.id))

  //data input
  const [inputIn, setInputIn] = useState<string>('')
  const [inputOut, setInputOut] = useState<string>('')
  // list trade token
  const [addressToken0MainChain, setAddressToken0MainChain] = useState<string>(FindAddressTokenByChainID(ChainIDAvalanchefuji,true))
  const [addressToken1MainChain, setAddressToken1MainChain] = useState<string>(FindAddressTokenByChainID(ChainIDAvalanchefuji,false))
  const [addressToken0SecondaryChain, setAddressToken0SecondaryChain] = useState<string>(FindAddressTokenByChainID(chain?.id,true))
  const [addressToken1SecondaryChain, setAddressToken1SecondaryChain] = useState<string>(FindAddressTokenByChainID(chain?.id,false))

  const [symbolToken0, setSymbolToken0] = useState<string>('USDT')
  const [symbolToken1, setSymbolToken1] = useState<string>('USDC')
  

  return (
    <div className="flex mt-14 justify-center items-center">
      <div className="relative bg-[#0D111C] px-2 py-3 rounded-3xl border-[1px] border-[#fafafa4d]   w-[450px]">
        <div className="flex flex-row justify-between items-center mb-2 px-2">
          <h1 className="font-bold ">Swap</h1>
          <div
            className="flex flex-row justify-center items-center gap-1 text-xs
            hover:opacity-60 cursor-pointer transition-all bg-blue-600 rounded-2xl py-1 px-3"
            onClick={() => setShowModalSetting(true)}
          >
            <span>{slippage}% slippage</span>
            <Cog6ToothIcon className="h-6 w-6 " />
          </div>
        </div>

        <div
          className={`InputOrder  gap-1 pt-2 pb-3 px-4
        ${loadingIn && 'opacity-50'}
        `}
        >
          <span className="text-gray-500">You pay</span>
          <div className="flex flex-row gap-3">
            <input
              className="text-3xl  w-full   text-left  bg-transparent outline-none  text-white"
              placeholder="0"
              type="number"
              onKeyPress={(event) => {
                if (!/^[0-9]*[.,]?[0-9]*$/.test(event.key)) {
                  event.preventDefault()
                }
              }}
              value={inputIn}
              onChange={async (e) => {
                setLoadingPrice(true)
                setLoadingOut(true)
                setInputIn(e.target.value)
                const amountOut = await getAmountsOut(
                  e.target.value,
                  addressToken0MainChain,
                  addressToken1MainChain
                )
                setInputOut(amountOut)
                setLoadingPrice(false)
                setLoadingOut(false)
              }}
            />
            <div className="bg-[#293249]   flex flex-row justify-center items-center px-4 py-0   gap-1 rounded-lg text-sm">
              <img src="logo.png" alt="logo" className="w-6 h-6" />
              <span>{symbolToken0}</span>
            </div>
          </div>
          <div className="flex justify-end gap-2 text-sm text-gray-400">
            <span>
              {' '}
              Balance:{' '}
              {Number(userBalanceToken[addressToken0SecondaryChain]).toFixed(6)}
            </span>
            <span
              onClick={async () => {
                setLoadingPrice(true)
                setLoadingOut(true)
                setInputIn(userBalanceToken[addressToken0SecondaryChain])
                const amountOut = await getAmountsOut(
                  userBalanceToken[addressToken0SecondaryChain],
                  addressToken0MainChain,
                  addressToken1MainChain
                )
                setInputOut(amountOut)
                setLoadingPrice(false)
                setLoadingOut(false)
              }}
              className="text-blue-500 cursor-pointer hover:text-blue-700 transition-all"
            >
              Max
            </span>
          </div>
        </div>

        <div
          className="flex justify-center items-center mt-3 mb-3"
          onClick={async () => {
            const tempaddressToken0MainChain = addressToken0MainChain
            const tempaddressToken0SecondaryChain = addressToken0SecondaryChain
            const tempsymbolToken0 = symbolToken0
            setAddressToken0MainChain(addressToken1MainChain)
            setAddressToken1MainChain(tempaddressToken0MainChain)
            setAddressToken0SecondaryChain(addressToken1SecondaryChain)
            setAddressToken1SecondaryChain(tempaddressToken0SecondaryChain)
            setSymbolToken0(symbolToken1)
            setSymbolToken1(tempsymbolToken0)

            setInputIn('')
            setInputOut('')
          }}
        >
          <ArrowDownCircleIcon className="h-8 w-8 text-white cursor-pointer hover:scale-105 hover:opacity-70 transition-all " />
        </div>

        <div
          className={`InputOrder rounded-b-none gap-1 pt-2 pb-3 px-4
        ${loadingOut && 'opacity-50'}
        `}
        >
          <span className="text-gray-500">You receive</span>
          <div className="flex flex-row gap-3 ">
            <input
              className="text-3xl  w-full   text-left  bg-transparent outline-none  text-white"
              placeholder="0"
              type="number"
              onKeyPress={(event) => {
                if (!/^[0-9]*[.,]?[0-9]*$/.test(event.key)) {
                  event.preventDefault()
                }
              }}
              value={inputOut}
              onChange={async (e) => {
                setLoadingPrice(true)
                setLoadingIn(true)
                setInputOut(e.target.value)
                const amountIn = await getAmountsIn(
                  e.target.value,
                  addressToken0MainChain,
                  addressToken1MainChain
                )
                setInputIn(amountIn)
                setLoadingPrice(false)
                setLoadingIn(false)
              }}
            />
            <div className="bg-[#293249]   flex flex-row justify-center items-center px-4 py-0   gap-1 rounded-lg text-sm">
              <img src="logo.png" alt="logo" className="w-6 h-6" />
              <span>{symbolToken1}</span>
            </div>
          </div>
          <div className="flex justify-end gap-2 text-sm text-gray-400">
            <span>
              {' '}
              Balance:{' '}
              {Number(userBalanceToken[addressToken1SecondaryChain]).toFixed(6)}
            </span>
          </div>
        </div>
        <div className="flex flex-row bg-[#121A2A] rounded-b-[15px] mt-[1px] py-2  px-4 items-center gap-2">
          {loadingPrice ? (
            <>
              <SVGLoader />
              <p className="text-white text-xs">Fetching price...</p>
            </>
          ) : (
            <>
              {inputIn == '' || inputOut == '' ? (
                <span className="text-red-600 text-xs">
                  Please input amount
                </span>
              ) : (
                <div className="flex flex-row gap-1">
                  <InformationCircleIcon className="h-4 w-4 text-white  " />
                  <span className="text-xs">
                    1 {symbolToken0} ={' '}
                    {(Number(inputOut) / Number(inputIn)).toFixed(6)}{' '}
                    {symbolToken1}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        <button
          onClick={() => {
            notificationToast(
              sendTxBridgeSwap(
                inputIn,
                '0',
                addressToken0SecondaryChain,
                addressToken1SecondaryChain,
                recipientAddress!,
                destinationChainName
              )
            )
          }}
          disabled={
            loadingPrice ||
            reserve[addressToken1MainChain] < Number(inputOut) ||
            Number(userBalanceToken[addressToken0SecondaryChain]) <
              Number(inputIn)
          }
          className={`mt-2 flex w-full py-3 rounded-2xl  items-center justify-center 
          transition-all 
         ${
           loadingPrice
             ? 'bg-gray-600 cursor-not-allowed'
             : reserve[addressToken1MainChain] < Number(inputOut)
             ? 'bg-gray-600 cursor-not-allowed'
             : Number(userBalanceToken[addressToken0SecondaryChain]) <
               Number(inputIn)
             ? 'bg-gray-600 cursor-not-allowed'
             : 'bg-blue-700 hover:bg-blue-600'
         }
         `}
        >
          <h1 className="text-xl font-bold">
            {reserve[addressToken1MainChain] < Number(inputOut)
              ? 'Insufficient liquidity balance'
              : Number(userBalanceToken[addressToken0SecondaryChain]) <
                Number(inputIn)
              ? 'Insufficient user balance'
              : 'Swap'}
          </h1>
        </button>

        <div
          className="bg-[#121A2A] flex flex-row mt-2 rounded-lg py-2 px-4 justify-between items-center
         text-gray-300  text-xs"
        >
          <div>
            <p>Minimum received</p>
            <p>Price Impact</p>
            <p>Liquidity Provider Fee</p>
          </div>
          <div className="flex flex-col justify-center items-end">
            {loadingPrice ? (
              <div>calculating...</div>
            ) : (
              <p>{(Number(inputOut) * ((100 - slippage) / 100)).toFixed(6)}</p>
            )}
            {loadingPrice ? (
              <div>calculating...</div>
            ) : (
              <p>
                {(
                  (reserve[addressToken1MainChain] /
                    reserve[addressToken0MainChain] -
                    Number(inputOut) / Number(inputIn)) /
                  (reserve[addressToken1MainChain] /
                    reserve[addressToken0MainChain] /
                    100)
                ).toFixed(2)}
                %
              </p>
            )}

            <p>0% fee</p>
          </div>
        </div>
        {GetChainNameByChainId(chain?.id) != ChainNameMainChainDex && (
          <div
            className="bg-[#121A2A] flex flex-col mt-2 rounded-lg py-2 px-4 justify-center items-start 
           text-gray-300  text-xs "
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
        )}
      </div>
      {showModalEditAddress && (
        <MyRecipientAddressModal
          recipientAddress={recipientAddress}
          setRecipientAddress={setRecipientAddress}
          onClose={() => setShowModalEditAddress(false)}
        />
      )}
      {showModalSetting && (
        <MySettingModal
          onClose={() => setShowModalSetting(false)}
          setSlippage={setSlippage}
          slippage={slippage}
          setDeadline={setDeadline}
          deadline={deadline}
        />
      )}
      <div className="bg -z-50" />
    </div>
  )
}

export default swap
