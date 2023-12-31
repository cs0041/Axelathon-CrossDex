import React, { useContext, useState } from 'react'
import MyListBoxChain from '../components/MyListBoxChain'
import { PlusCircleIcon,InboxStackIcon, InboxIcon} from '@heroicons/react/24/solid'
import { ChevronUpIcon} from '@heroicons/react/24/outline'
import { InformationCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import { Disclosure } from '@headlessui/react'
import SVGLoader from '../components/SVGLoader'
import { useAccount, useNetwork } from 'wagmi'
import MyRecipientAddressModal from '../components/MyRecipientAddressModal'
import { Switch } from '@headlessui/react'
import { LightTooltip } from '../utils/muiStyled'
import {  AllowListTradeToken, ChainIDMainChainDex,ChainNameMainChainDex, listBoxChainName, listPairLPMainChain } from '../utils/valueConst'
import { FindAddressTokenByChainID, GetChainNameByChainId } from '../utils/findByChainId'
import { ContractContext } from '../context/contractContext'
import { notificationToast } from '../utils/notificationToastify'
import { shortenAddress } from '../utils/shortenAddress'
import { calculateAmountTokenBackWhenRemoveLP, calculateLPReceived, calculateShareOfPoolPercentage } from '../utils/calculate'

type Props = {}

enum TabBar {
  Pos = 'Positions',
  Add = 'Add',
  Remove = 'Remove'
}

function liquidity({}: Props) {
  const {
    reserve,
    userBalanceToken,
    userBalancePairLP,
    getQuoteForAddLiquidity,
    loadingUserBalanceToken,
    totalSupplyPairLP,
    loadingBalancePairLP,
    sendTxBridgeAddLiquidity,
    sendTxBridgeRemoveLiquidity,
    sendTxAddLiquidity,
    sendTxRemoveLiquidity,
    userAllowanceRouter,
    sendTxApproveToken,
    loadingReserve,
  } = useContext(ContractContext)


  // wagmi
  const { chain } = useNetwork()
  const { address } = useAccount()

  // Tab Bar
  const [statusTabBar, setStatusTabBar] = useState<TabBar>(TabBar.Pos)

  // Modal
  const [showModalEditAddress, setShowModalEditAddress] = useState(false)
  
  // Switch
  const [enabled, setEnabled] = useState(true)

  // loading
  const [loadingPrice, setLoadingPrice] = useState(false)
  const [loadingIn, setLoadingIn] = useState(false)
  const [loadingOut, setLoadingOut] = useState(false)
  const [loadingRemove, setLoadingRemove] = useState(false)

  // modal setting Recipient Address
  const [recipientAddress, setRecipientAddress] = useState<string | undefined>(
    address
  )

  // Destination  chain name
  const [destinationChainName, setDestinationChainName] = useState<string>(
    GetChainNameByChainId(chain?.id)
  )

  //data input Add LP
  const [inputIn, setInputIn] = useState<string>('')
  const [inputOut, setInputOut] = useState<string>('')

  //data input Remove LP
  const [inputRemove, setInputRemove] = useState<string>('')

  // list trade token
  const [addressToken0MainChain, setAddressToken0MainChain] = useState<string>(
    FindAddressTokenByChainID(ChainIDMainChainDex, true)
  )
  const [addressToken1MainChain, setAddressToken1MainChain] = useState<string>(
    FindAddressTokenByChainID(ChainIDMainChainDex, false)
  )
  const [addressToken0SecondaryChain, setAddressToken0SecondaryChain] =
    useState<string>(FindAddressTokenByChainID(chain?.id, true))
  const [addressToken1SecondaryChain, setAddressToken1SecondaryChain] =
    useState<string>(FindAddressTokenByChainID(chain?.id, false))

  const [symbolToken0, setSymbolToken0] = useState<string>(AllowListTradeToken.Avalanche.Token0.symbol)
  const [symbolToken1, setSymbolToken1] = useState<string>(AllowListTradeToken.Avalanche.Token1.symbol)


  return (
    <div className="flex mt-5 mb-24 xs:mt-14 p-2 justify-center items-center">
      <div className="relative bg-[#0D111C] px-2 py-3 rounded-3xl border-[1px] border-[#fafafa4d]  w-[375px] xs:w-[450px]">
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
            + Add
          </button>
          <button
            className={`font-bold text-sm hover:opacity-70 transition-all
            ${statusTabBar == TabBar.Remove && 'text-blue-500'} `}
            onClick={() => setStatusTabBar(TabBar.Remove)}
          >
            - Remove
          </button>
        </div>
        {statusTabBar == TabBar.Pos && (
          <div className="flex flex-col gap-3">
            <div className="bg-[#121A2A] flex flex-col justify-center items-center text-gray-300 rounded-lg  p-6">
              <h1>ADD LIQUIDITY TO RECEIVE LP TOKENS</h1>
            </div>
            { (loadingBalancePairLP || loadingReserve)? (
              <div className="flex justify-center items-center p-3">
                <span className="loader"></span>
              </div>
            ) : (
              <>
                {Number(userBalancePairLP) > 0 ? (
                  <div className="flex flex-col gap-2 ">
                    <div>
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button
                              className={`bg-[#121A2A] p-2  flex w-full justify-between  items-center  hover:bg-blue-700 transition-all
                        ${open ? 'rounded-t-lg' : 'rounded-lg'} `}
                            >
                              <div className="flex flex-row gap-2 bg-gray-700 py-2 px-3 rounded-lg">
                                <img
                                  src="logo.png"
                                  alt="logo"
                                  className="w-6 "
                                />
                                <span>
                                  {listPairLPMainChain['cUSDT-cUSDC'].symbol}
                                </span>
                              </div>

                              <div className="flex flex-row gap-2 items-center justify-center">
                                <span>
                                  {Number(userBalancePairLP).toFixed(4)}
                                </span>
                                <ChevronUpIcon
                                  className={`${
                                    open ? 'rotate-180 transform' : ''
                                  } h-5 w-5 text-white`}
                                />
                              </div>
                            </Disclosure.Button>
                            <Disclosure.Panel className="bg-[#121A2A] rounded-b-lg flex flex-col justify-between px-3 pt-4 pb-2 text-sm gap-2  ">
                              <div className="flex flex-row justify-between items-center">
                                <span>Your total pool tokens</span>
                                <span>
                                  {Number(userBalancePairLP).toFixed(4)}
                                </span>
                              </div>
                              <div className="flex flex-row justify-between items-center">
                                <span>
                                  Pooled{' '}
                                  {AllowListTradeToken.Avalanche.Token0.symbol}
                                </span>
                                <span>
                                  {' '}
                                  {calculateAmountTokenBackWhenRemoveLP(
                                    totalSupplyPairLP,
                                    userBalancePairLP,
                                    reserve[addressToken0MainChain],
                                    reserve[addressToken1MainChain]
                                  ).token0.toFixed(4)}
                                </span>
                              </div>
                              <div className="flex flex-row justify-between items-center">
                                <span>
                                  Pooled{' '}
                                  {AllowListTradeToken.Avalanche.Token1.symbol}
                                </span>
                                <span>
                                  {' '}
                                  {calculateAmountTokenBackWhenRemoveLP(
                                    totalSupplyPairLP,
                                    userBalancePairLP,
                                    reserve[addressToken0MainChain],
                                    reserve[addressToken1MainChain]
                                  ).token1.toFixed(4)}
                                </span>
                              </div>
                              <div className="flex flex-row justify-between items-center">
                                <span>Your pool share</span>
                                <p>
                                  {calculateShareOfPoolPercentage(
                                    totalSupplyPairLP,
                                    userBalancePairLP,
                                    false
                                  ).toFixed(4)}
                                  %
                                </p>
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
                                  onClick={() => setStatusTabBar(TabBar.Remove)}
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
                ) : (
                  <>
                    <div className="bg-[#121A2A] rounded-lg  p-2">
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
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {statusTabBar == TabBar.Add && (
          <>
            <div
              className={`InputOrder  gap-1 pt-2 pb-3 px-4
        ${loadingIn && 'opacity-50'}
        `}
            >
              <span className="text-gray-500">Token 0</span>
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
                    const amountToken1AddLiquidity =
                      await getQuoteForAddLiquidity(
                        e.target.value,
                        reserve[addressToken0MainChain],
                        reserve[addressToken1MainChain]
                      )
                    setInputOut(amountToken1AddLiquidity)
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
                <div className="flex flex-row justify-center items-center gap-2">
                  <span>Balance</span>
                  {loadingUserBalanceToken ? (
                    <SVGLoader />
                  ) : (
                    Number(
                      userBalanceToken[addressToken0SecondaryChain]
                    ).toFixed(6)
                  )}
                </div>
                <span
                  onClick={async () => {
                    setLoadingPrice(true)
                    setLoadingOut(true)
                    setInputIn(userBalanceToken[addressToken0SecondaryChain])
                    const amountToken1AddLiquidity =
                      await getQuoteForAddLiquidity(
                        userBalanceToken[addressToken0SecondaryChain],
                        reserve[addressToken0MainChain],
                        reserve[addressToken1MainChain]
                      )
                    setInputOut(amountToken1AddLiquidity)
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
              <PlusCircleIcon className="h-8 w-8 text-white  " />
            </div>
            <div
              className={`InputOrder rounded-b-none gap-1 pt-2 pb-3 px-4
        ${loadingOut && 'opacity-50'}
        `}
            >
              <span className="text-gray-500">Token 1</span>
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
                    const amountToken0AddLiquidity =
                      await getQuoteForAddLiquidity(
                        e.target.value,
                        reserve[addressToken1MainChain],
                        reserve[addressToken0MainChain]
                      )
                    setInputIn(amountToken0AddLiquidity)
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
                <div className="flex flex-row justify-center items-center gap-2">
                  <span>Balance</span>
                  {loadingUserBalanceToken ? (
                    <SVGLoader />
                  ) : (
                    Number(
                      userBalanceToken[addressToken1SecondaryChain]
                    ).toFixed(6)
                  )}
                  <span
                    onClick={async () => {
                      setLoadingPrice(true)
                      setLoadingIn(true)
                      setInputOut(userBalanceToken[addressToken1SecondaryChain])
                      const amountToken0AddLiquidity =
                        await getQuoteForAddLiquidity(
                          userBalanceToken[addressToken1SecondaryChain],
                          reserve[addressToken1MainChain],
                          reserve[addressToken0MainChain]
                        )
                      setInputIn(amountToken0AddLiquidity)
                      setLoadingPrice(false)
                      setLoadingIn(false)
                    }}
                    className="text-blue-500 cursor-pointer hover:text-blue-700 transition-all"
                  >
                    Max
                  </span>
                </div>
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
            {chain?.id == ChainIDMainChainDex ? (
              <>
                {Number(userAllowanceRouter[addressToken0SecondaryChain]) >=
                  Number(inputIn) &&
                Number(userAllowanceRouter[addressToken1SecondaryChain]) >=
                  Number(inputOut) ? (
                  <button
                    onClick={() => {
                      notificationToast(
                        sendTxAddLiquidity(
                          inputIn,
                          inputOut,
                          addressToken0SecondaryChain,
                          addressToken1SecondaryChain,
                          true,
                          recipientAddress!,
                          Date.now() + 1000 * 60 * 20
                        ),
                        chain.id,
                        false
                      )
                    }}
                    disabled={
                      loadingPrice ||
                      Number(userBalanceToken[addressToken0SecondaryChain]) <
                        Number(inputIn) ||
                      Number(userBalanceToken[addressToken1SecondaryChain]) <
                        Number(inputOut)
                    }
                    className={`mt-2 flex w-full py-3 rounded-2xl  items-center justify-center 
                  transition-all 
                ${
                  loadingPrice
                    ? 'bg-gray-600 cursor-not-allowed'
                    : Number(userBalanceToken[addressToken0SecondaryChain]) <
                        Number(inputIn) ||
                      Number(userBalanceToken[addressToken1SecondaryChain]) <
                        Number(inputOut)
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-700 hover:bg-blue-600'
                }
                `}
                  >
                    <h1 className="text-xl font-bold">
                      {Number(userBalanceToken[addressToken0SecondaryChain]) <
                        Number(inputIn) ||
                      Number(userBalanceToken[addressToken1SecondaryChain]) <
                        Number(inputOut)
                        ? 'Insufficient user balance'
                        : 'Add Liquidity'}
                    </h1>
                  </button>
                ) : (
                  <div className="flex flex-row gap-2">
                    {Number(userAllowanceRouter[addressToken0SecondaryChain]) <
                      Number(inputIn) && (
                      <button
                        onClick={() => {
                          notificationToast(
                            sendTxApproveToken(
                              addressToken0SecondaryChain,
                              inputIn
                            ),
                            chain.id,
                            false
                          )
                        }}
                        className={`mt-2 flex w-full py-3 rounded-2xl  items-center justify-center 
                    transition-all bg-blue-700 hover:bg-blue-600 `}
                      >
                        <h1 className="text-xl font-bold">Approve $USDT</h1>
                      </button>
                    )}

                    {Number(userAllowanceRouter[addressToken1SecondaryChain]) <
                      Number(inputOut) && (
                      <button
                        onClick={() => {
                          notificationToast(
                            sendTxApproveToken(
                              addressToken1SecondaryChain,
                              inputOut
                            ),
                            chain.id,
                            false
                          )
                        }}
                        className={`mt-2 flex w-full py-3 rounded-2xl  items-center justify-center 
                    transition-all bg-blue-700 hover:bg-blue-600 `}
                      >
                        <h1 className="text-xl font-bold">Approve $USDC</h1>
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => {
                  notificationToast(
                    sendTxBridgeAddLiquidity(
                      inputIn,
                      inputOut,
                      addressToken0SecondaryChain,
                      addressToken1SecondaryChain,
                      enabled,
                      recipientAddress!,
                      destinationChainName
                    ),
                    chain?.id,
                    true
                  )
                }}
                disabled={
                  loadingPrice ||
                  Number(userBalanceToken[addressToken0SecondaryChain]) <
                    Number(inputIn) ||
                  Number(userBalanceToken[addressToken1SecondaryChain]) <
                    Number(inputOut)
                }
                className={`mt-2 flex w-full py-3 rounded-2xl  items-center justify-center 
                  transition-all 
                ${
                  loadingPrice
                    ? 'bg-gray-600 cursor-not-allowed'
                    : Number(userBalanceToken[addressToken0SecondaryChain]) <
                        Number(inputIn) ||
                      Number(userBalanceToken[addressToken1SecondaryChain]) <
                        Number(inputOut)
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-700 hover:bg-blue-600'
                }
                `}
              >
                <h1 className="text-xl font-bold">
                  {Number(userBalanceToken[addressToken0SecondaryChain]) <
                    Number(inputIn) ||
                  Number(userBalanceToken[addressToken1SecondaryChain]) <
                    Number(inputOut)
                    ? 'Insufficient user balance'
                    : 'Add Liquidity'}
                </h1>
              </button>
            )}

            <div
              className="bg-[#121A2A] flex flex-row mt-2 rounded-lg py-2 px-4 justify-between items-center
         text-gray-300  text-xs"
            >
              <div>
                <p>{listPairLPMainChain['cUSDT-cUSDC'].symbol} LP Received</p>
                <p>Share of Pool</p>
              </div>
              <div className="text-right">
                {loadingPrice ? (
                  <div>calculating...</div>
                ) : (
                  <p>
                    {calculateLPReceived(
                      totalSupplyPairLP,
                      inputIn,
                      inputOut,
                      reserve[addressToken0MainChain],
                      reserve[addressToken1MainChain]
                    ).toFixed(4)}
                  </p>
                )}
                {loadingPrice ? (
                  <div>calculating...</div>
                ) : (
                  <p>
                    {calculateShareOfPoolPercentage(
                      totalSupplyPairLP,
                      calculateLPReceived(
                        totalSupplyPairLP,
                        inputIn,
                        inputOut,
                        reserve[addressToken0MainChain],
                        reserve[addressToken1MainChain]
                      ),
                      true
                    ).toFixed(4)}
                    %
                  </p>
                )}
              </div>
            </div>
            {/* 545454181 */}
            {GetChainNameByChainId(chain?.id) != ChainNameMainChainDex && (
              <div
                className="bg-[#121A2A] flex flex-col mt-2 rounded-lg py-2 px-4 justify-center items-start 
           text-gray-300  text-xs gap-1"
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
          </>
        )}

        {statusTabBar == TabBar.Remove && (
          <>
            <div className="InputOrder rounded-b-none gap-1 pt-2 pb-3 px-4">
              <span className="text-gray-500">Amount LPs to Remove</span>
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
                  value={inputRemove}
                  onChange={async (e) => {
                    setLoadingRemove(true)
                    setInputRemove(e.target.value)
                    // find some thing
                    setLoadingRemove(false)
                  }}
                />
                <div className="bg-[#293249]   flex flex-row justify-center w-full xs:w-8/12 items-center px-3 py-0   gap-1 rounded-lg text-sm">
                  <img src="logo.png" alt="logo" className="w-6 h-6" />
                  <span>{listPairLPMainChain['cUSDT-cUSDC'].symbol}</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 text-sm text-gray-400">
                <span>Balance</span>
                {loadingBalancePairLP ? (
                  <SVGLoader />
                ) : (
                  Number(userBalancePairLP).toFixed(6)
                )}
                <span
                  onClick={() => {
                    setLoadingRemove(true)
                    setInputRemove(userBalancePairLP)
                    // find some thing
                    setLoadingRemove(false)
                  }}
                  className="text-blue-500 cursor-pointer hover:text-blue-700 transition-all"
                >
                  Max
                </span>
              </div>
            </div>

            {chain?.id == ChainIDMainChainDex ? (
              <>
                {Number(
                  userAllowanceRouter[
                    listPairLPMainChain['cUSDT-cUSDC'].contractAddress
                  ]
                ) < Number(inputRemove) ? (
                  <button
                    onClick={() => {
                      notificationToast(
                        sendTxApproveToken(
                          listPairLPMainChain['cUSDT-cUSDC'].contractAddress,
                          inputRemove
                        ),
                        chain.id,
                        false
                      )
                    }}
                    className={`mt-2 flex w-full py-3 rounded-2xl  items-center justify-center 
                      transition-all bg-blue-700 hover:bg-blue-600`}
                  >
                    <h1 className="text-xl font-bold">Approve LP</h1>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      notificationToast(
                        sendTxRemoveLiquidity(
                          inputRemove,
                          addressToken0MainChain,
                          addressToken1MainChain,
                          recipientAddress!,
                          Date.now() + 1000 * 60 * 20
                        ),
                        chain.id,
                        true
                      )
                    }}
                    disabled={
                      loadingRemove ||
                      Number(userBalancePairLP) < Number(inputRemove)
                    }
                    className={`mt-2 flex w-full py-3 rounded-2xl  items-center justify-center 
                transition-all 
                ${
                  loadingRemove
                    ? 'bg-gray-600 cursor-not-allowed'
                    : Number(userBalancePairLP) < Number(inputRemove)
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-700 hover:bg-blue-600'
                }
                `}
                  >
                    <h1 className="text-xl font-bold">
                      {Number(userBalancePairLP) < Number(inputRemove)
                        ? 'Insufficient user balance'
                        : 'Remove Liquidity'}
                    </h1>
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => {
                  notificationToast(
                    sendTxBridgeRemoveLiquidity(
                      inputRemove,
                      addressToken0SecondaryChain,
                      addressToken1SecondaryChain,
                      recipientAddress!,
                      destinationChainName
                    ),
                    chain?.id,
                    true
                  )
                }}
                disabled={
                  loadingRemove ||
                  Number(userBalancePairLP) < Number(inputRemove)
                }
                className={`mt-2 flex w-full py-3 rounded-2xl  items-center justify-center 
                transition-all 
                ${
                  loadingRemove
                    ? 'bg-gray-600 cursor-not-allowed'
                    : Number(userBalancePairLP) < Number(inputRemove)
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-700 hover:bg-blue-600'
                }
                `}
              >
                <h1 className="text-xl font-bold">
                  {Number(userBalancePairLP) < Number(inputRemove)
                    ? 'Insufficient user balance'
                    : 'Remove Liquidity'}
                </h1>
              </button>
            )}

            <div
              className="bg-[#121A2A] flex flex-row mt-2 rounded-lg py-2 px-4 justify-between items-center
         text-gray-300  text-xs"
            >
              <div>
                <p>LPs To Remove</p>
                <p>Pooled {AllowListTradeToken.Avalanche.Token0.symbol}</p>
                <p>Pooled {AllowListTradeToken.Avalanche.Token1.symbol}</p>
                <p>Share of Pool</p>
              </div>
              <div className="text-right">
                <p>{Number(inputRemove).toFixed(4)}</p>
                <p>
                  {calculateAmountTokenBackWhenRemoveLP(
                    totalSupplyPairLP,
                    inputRemove,
                    reserve[addressToken0MainChain],
                    reserve[addressToken1MainChain]
                  ).token0.toFixed(4)}
                </p>
                <p>
                  {calculateAmountTokenBackWhenRemoveLP(
                    totalSupplyPairLP,
                    inputRemove,
                    reserve[addressToken0MainChain],
                    reserve[addressToken1MainChain]
                  ).token1.toFixed(4)}
                </p>
                <p>
                  {calculateShareOfPoolPercentage(
                    totalSupplyPairLP,
                    inputRemove,
                    false
                  ).toFixed(4)}
                  %
                </p>
              </div>
            </div>
            {GetChainNameByChainId(chain?.id) != ChainNameMainChainDex && (
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
            )}
          </>
        )}
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

export default liquidity
