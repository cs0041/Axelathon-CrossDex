import React, { useContext, useState }  from 'react'
import {
  Cog6ToothIcon,
  ArrowDownCircleIcon,
} from '@heroicons/react/24/solid'
import {
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import SVGLoader from '../components/SVGLoader'
import MyRecipientAddressModal from '../components/MyRecipientAddressModal'
import { useAccount } from 'wagmi'
import MyListBox from '../components/MyListBox'
import MySettingModal from '../components/MySettingModal'
import { ContractContext } from '../context/contractContext'
import { shortenAddress } from '../utils/shortenAddress'


type Props = {}

function swap({}: Props) {
  const {
    getAmountsOut,
    getAmountsIn,
    loadReservePair,
    reserve0,
    reserve1,
    userBalanceToken0,
    userBalanceToken1,
  } = useContext(ContractContext)

  const { address } = useAccount()

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
  const [recipientAddress, setRecipientAddress] = useState<string|undefined>(address)

  //data input
  const [inputIn, setInputIn] = useState<string>('')
  const [inputOut, setInputOut] = useState<string>('')
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
          className={`InputOrder rounded-b-none gap-1 pt-2 pb-3 px-4
        ${loadingIn && 'opacity-50'}
        `}
        >
          <span className="text-gray-500">You pay</span>
          <div className="flex flex-row gap-2">
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
                  '0x974333304df277F849f21aa311aF6e0050C22623',
                  '0xC8d848847CAC98300f1A48B2ed26eD7fF3aDdbD1'
                )
                setInputOut(amountOut)
                setLoadingPrice(false)
                setLoadingOut(false)
              }}
            />
            <MyListBox
              listItem={[{ text: 'ETH' }, { text: 'USDT' }, { text: 'AXL' }]}
            />
          </div>
          <div className="flex justify-end gap-2 text-sm text-gray-400">
            <span> Balance: {userBalanceToken0.slice(0, -10)}</span>
            <span
              onClick={async () => {
                setLoadingPrice(true)
                setLoadingOut(true)
                setInputIn(userBalanceToken0)
                const amountOut = await getAmountsOut(
                  userBalanceToken0,
                  '0x974333304df277F849f21aa311aF6e0050C22623',
                  '0xC8d848847CAC98300f1A48B2ed26eD7fF3aDdbD1'
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

        <div className="flex justify-center items-center mt-3 mb-3">
          <ArrowDownCircleIcon className="h-8 w-8 text-white cursor-pointer hover:scale-105 hover:opacity-70 transition-all " />
        </div>

        <div
          className={`InputOrder rounded-b-none gap-1 pt-2 pb-3 px-4
        ${loadingOut && 'opacity-50'}
        `}
        >
          <span className="text-gray-500">You receive</span>
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
              value={inputOut}
              onChange={async (e) => {
                setLoadingPrice(true)
                setLoadingIn(true)
                setInputOut(e.target.value)
                const amountIn = await getAmountsIn(
                  e.target.value,
                  '0x974333304df277F849f21aa311aF6e0050C22623',
                  '0xC8d848847CAC98300f1A48B2ed26eD7fF3aDdbD1'
                )
                setInputIn(amountIn)
                setLoadingPrice(false)
                setLoadingIn(false)
              }}
            />
            <MyListBox
              listItem={[{ text: 'ETH' }, { text: 'USDT' }, { text: 'AXL' }]}
            />
          </div>
          <div className="flex justify-end gap-2 text-sm text-gray-400">
            <span> Balance: {userBalanceToken1.slice(0, -10)}</span>
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
                <span className="text-xs">
                  1 = {(Number(inputOut) / Number(inputIn)).toFixed(8)}
                </span>
              )}
            </>
          )}
        </div>
        <button
          disabled={loadingPrice}
          className={`mt-2 flex w-full py-3 rounded-2xl  items-center justify-center 
          transition-all 
         ${
           loadingPrice
             ? 'bg-gray-600 cursor-not-allowed'
             : 'bg-blue-700 hover:bg-blue-600'
         }
         `}
        >
          <h1 className="text-xl font-bold">Swap</h1>
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
          <div className="text-right">
            <p>0.00</p>
            <p>0%</p>
            <p>0% fee</p>
          </div>
        </div>
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
            <MyListBox
              listItem={[
                { text: 'Avalanche' },
                { text: 'Fantom' },
                { text: 'Polygon' },
              ]}
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
      {showModalSetting && (
        <MySettingModal
          onClose={() => setShowModalSetting(false)}
          setSlippage={setSlippage}
          slippage={slippage}
          setDeadline={setDeadline}
          deadline={deadline}
        />
      )}
    </div>
  )
}

export default swap
