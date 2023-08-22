import React, { useState } from 'react'
import MyListBox from '../components/MyListBox'
import { PlusCircleIcon,InboxStackIcon, InboxIcon} from '@heroicons/react/24/solid'
import { QuestionMarkCircleIcon,ChevronUpIcon} from '@heroicons/react/24/outline'
import { Disclosure } from '@headlessui/react'
import SVGLoader from '../components/SVGLoader'
import { useAccount } from 'wagmi'
import MyModal from '../components/MyModal'
import { Switch } from '@headlessui/react'
import { LightTooltip } from '../utils/muiStyled'

type Props = {}

enum TabBar {
  Pos = 'Positions',
  Add = 'Add',
}

function liquidity({}: Props) {

    const { address } = useAccount()
    const [statusTabBar, setStatusTabBar] = useState<TabBar>(TabBar.Pos)
    const [showModalEditAddress, setShowModalEditAddress] = useState(false)
    const [enabled, setEnabled] = useState(false)
  return (
    <div className="flex mt-14 justify-center items-center">
      <div className="relative bg-[#0D111C] px-2 py-3 rounded-3xl border-[1px] border-[#fafafa4d]  w-[450px]">
        <div className="flex flex-row justify-between items-center mb-2 px-2">
          <h1 className="font-bold text-sm">Liquidity</h1>
        </div>
        <div className="flex flex-row justify-center items-center mb-5 gap-5">
          <div
            className={`flex flex-row gap-1 items-center justify-center hover:opacity-70 transition-all
            ${statusTabBar == TabBar.Pos && 'text-blue-500'}`}
          >
            <InboxStackIcon className="h-4 w-4 " />
            <button
              className="font-bold text-sm"
              onClick={() => setStatusTabBar(TabBar.Pos)}
            >
              Positions
            </button>
          </div>
          <button
            className={`font-bold text-sm hover:opacity-70 transition-all
            ${statusTabBar == TabBar.Add && 'text-blue-500'} `}
            onClick={() => setStatusTabBar(TabBar.Add)}
          >
            + Add Liquidity
          </button>
        </div>
        {statusTabBar == TabBar.Pos && (
          <div className="flex flex-col gap-3">
            <div className="bg-[#121A2A] flex flex-col justify-center items-center text-gray-300 rounded-lg  p-6">
              <h1>ADD LIQUIDITY TO RECEIVE LP TOKENS</h1>
            </div>
            {/* <div className="bg-[#121A2A] rounded-lg  p-2">
              <div className="flex flex-col gap-2 justify-center items-center text-gray-500">
                <InboxIcon className="h-8 w-8 " />
                <h1>No liquidity found.</h1>
                <h1 className="mt-3">
                  Click button below to add your liquidity
                </h1>
              </div>
            </div> 
            <button
              className=" flex w-full py-2 rounded-2xl bg-blue-700 items-center justify-center 
         hover:bg-blue-600 transition-all "
              onClick={() => setStatusTabBar(TabBar.Add)}
            >
              <h1 className="text-xl font-bold">+ Add Liquidity</h1>
            </button> */}
            <div className="flex flex-col gap-2 ">
              <div>
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="bg-[#121A2A]  p-2  flex w-full justify-between  items-center  ">
                        <div className="flex flex-row gap-2 bg-gray-700 py-2 px-3 rounded-lg">
                          <img src="logo.png" alt="logo" className="w-6 " />
                          <span>AXL - USDT</span>
                        </div>

                        <div className="flex flex-row gap-2 items-center justify-center">
                          <span>12.04</span>
                          <ChevronUpIcon
                            className={`${
                              open ? 'rotate-180 transform' : ''
                            } h-5 w-5 text-white`}
                          />
                        </div>
                      </Disclosure.Button>
                      <Disclosure.Panel className="bg-[#121A2A] flex flex-col justify-between px-3 pt-4 pb-2 text-sm gap-2  ">
                        <div className="flex flex-row justify-between items-center">
                          <span>Total pooled tokens</span>
                          <span>12.21</span>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                          <span>Pooled AXL</span>
                          <span>30.32</span>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                          <span>Pooled USDT</span>
                          <span>20.51</span>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                          <span>Share of pool</span>
                          <span>0.1%</span>
                        </div>

                        <div className="flex flex-row justify-between items-center gap-2">
                          <button
                            className=" flex w-full py-2 rounded-lg bg-blue-700 items-center justify-center 
                        hover:bg-blue-600 transition-all "
                            onClick={() => setStatusTabBar(TabBar.Add)}
                          >
                            <h1 className="text-xl font-bold">ADD</h1>
                          </button>
                          <button
                            className=" flex w-full py-2 rounded-lg bg-blue-700 items-center justify-center 
                        hover:bg-blue-600 transition-all "
                            onClick={() => setStatusTabBar(TabBar.Add)}
                          >
                            <h1 className="text-xl font-bold">REMOVE</h1>
                          </button>
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </div>
              
            </div>
          </div>
        )}
        {statusTabBar == TabBar.Add && (
          <>
            <div className="InputOrder gap-1 pt-2 pb-3 px-4">
              <span className="text-gray-500">Token 1</span>
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
                />
                <MyListBox
                  listItem={[
                    { text: 'ETH' },
                    { text: 'USDT' },
                    { text: 'AXL' },
                  ]}
                />
              </div>
              <div className="flex justify-end gap-2 text-sm text-gray-400">
                <span> Balance: 123123</span>
                <span
                  onClick={() => {}}
                  className="text-blue-500 cursor-pointer hover:text-blue-700 transition-all"
                >
                  Max
                </span>
              </div>
            </div>

            <div className="flex justify-center items-center mt-3 mb-3">
              <PlusCircleIcon className="h-8 w-8 text-white " />
            </div>

            <div className="InputOrder rounded-b-none gap-1 pt-2 pb-3 px-4">
              <span className="text-gray-500">Token 2</span>
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
                />
                <MyListBox
                  listItem={[
                    { text: 'ETH' },
                    { text: 'USDT' },
                    { text: 'AXL' },
                  ]}
                />
              </div>
              <div className="flex justify-end gap-2 text-sm text-gray-400">
                <span> Balance: 123123</span>
              </div>
            </div>
            <div className="flex flex-row bg-[#121A2A] rounded-b-[15px] mt-[1px] py-2  px-4 items-center gap-2">
              {true ? (
                <>
                  <SVGLoader />
                  <p className="text-white text-xs">Fetching price...</p>
                </>
              ) : (
                <></>
              )}
            </div>
            <button
              className="mt-2 flex w-full py-3 rounded-2xl bg-blue-700 items-center justify-center 
         hover:bg-blue-600 transition-all "
            >
              <h1 className="text-xl font-bold">Swap</h1>
            </button>

            <div
              className="bg-[#121A2A] flex flex-row mt-2 rounded-lg py-2 px-4 justify-between items-center
         text-gray-300  text-xs"
            >
              <div>
                <p>AXL-USDT LP Received</p>
                <p>Share of Pool</p>
              </div>
              <div className="text-right">
                <p>0.00</p>
                <p>0.1%</p>
              </div>
            </div>
            <div
              className="bg-[#121A2A] flex flex-col mt-2 rounded-lg py-2 px-4 justify-center items-start 
           text-gray-300  text-xs gap-2 "
            >
              <div className="flex flex-row w-full items-center justify-between">
                <div className="flex flex-row gap-1">
                  <span>Enable force add liquidity</span>
                  <LightTooltip
                    title="Enable this mode  will helps to force add liquidity, will choose token 1 as the main add liquidity first if can't add liquidity
                    , then try using token2.It will reduce the transaction failed problem when the price fluctuates"
                    arrow
                    placement="bottom"
                  >
                    <QuestionMarkCircleIcon className=" IconHover h-4 w-4 " />
                  </LightTooltip>
                </div>
                <Switch
                  checked={enabled}
                  onChange={setEnabled}
                  className={`${enabled ? 'bg-blue-500 ' : 'bg-gray-700 '}
            border-2  border-transparent relative inline-flex h-[20px] w-[40px] shrink-0 cursor-pointer 
            rounded-full  transition-colors duration-200 ease-in-out focus:outline-none`}
                >
                  <span className="sr-only">setting</span>
                  <span
                    aria-hidden="true"
                    className={`${
                      enabled
                        ? 'translate-x-5 bg-white '
                        : 'translate-x-0 bg-white'
                    }
              pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full  shadow-lg ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
              </div>
              <div className="flex flex-row w-full items-center justify-between ">
                <div>Recipient Address</div>
                <div className="flex gap-1">
                  <span> 0x313..4124</span>
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
          </>
        )}
      </div>

      {showModalEditAddress && (
        <MyModal
          userAddress={address}
          onClose={() => setShowModalEditAddress(false)}
        />
      )}
    </div>
  )
}

export default liquidity
