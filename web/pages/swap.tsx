import React, { useState }  from 'react'
import {
  Cog6ToothIcon,
  ArrowDownCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid'
import SVGLoader from '../components/SVGLoader'
import MyModal from '../components/MyModal'
import { useAccount } from 'wagmi'
import MyListBox from '../components/MyListBox'
import MySettingModal from '../components/MySettingModal'


type Props = {}

function swap({}: Props) {
   const { address } = useAccount()
  const [showModalEditAddress, setShowModalEditAddress] = useState(false)
  const [showModalSetting, setShowModalSetting] = useState(false)
   return (
     <div className="flex mt-14 justify-center items-center">
       <div className="relative bg-[#0D111C] px-2 py-3 rounded-3xl border-[1px] border-[#fafafa4d]  max-w-[450px] min-w-[400px]">
         <div className="flex flex-row justify-between items-center mb-2 px-2">
           <h1 className="font-bold text-base">Swap</h1>
           <div
             className="flex flex-row justify-center items-center gap-1 text-xs
            hover:opacity-60 cursor-pointer transition-all bg-blue-600 rounded-2xl py-1 px-3"
             onClick={() => setShowModalSetting(true)}
           >
             <span>0.1% slippage</span>
             <Cog6ToothIcon className="h-6 w-6 " />
           </div>
         </div>

         <div className="InputOrder gap-1 pt-2 pb-3 px-4">
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
             />
             <MyListBox
               listItem={[{ text: 'ETH' }, { text: 'USDT' }, { text: 'AXL' }]}
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
           <ArrowDownCircleIcon className="h-8 w-8 text-white cursor-pointer hover:scale-105 hover:opacity-70 transition-all " />
         </div>

         <div className="InputOrder rounded-b-none gap-1 pt-2 pb-3 px-4">
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
             />
             <MyListBox
               listItem={[{ text: 'ETH' }, { text: 'USDT' }, { text: 'AXL' }]}
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
           text-gray-300  text-xs  "
         >
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
       </div>

       {showModalEditAddress && (
         <MyModal
           userAddress={address}
           onClose={() => setShowModalEditAddress(false)}
         />
       )}
       {showModalSetting && (
         <MySettingModal onClose={() => setShowModalSetting(false)} />
       )}
     </div>
   )
}

export default swap
