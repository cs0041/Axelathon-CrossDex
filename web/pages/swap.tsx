import React  from 'react'
import {
  Cog6ToothIcon,
  ArrowDownCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid'
import SVGLoader from '../components/SVGLoader'


type Props = {}

function swap({}: Props) {
   return (
     <div className="flex mt-14 justify-center items-center">
       <div className="bg-[#0D111C] px-2 py-3 rounded-xl border-[1px] border-[#fafafa4d]  max-w-[450px] min-w-[400px]">
         <div className="flex flex-row justify-between items-center mb-2 px-2">
           <h1 className="font-bold text-sm">Swap</h1>
           <Cog6ToothIcon className="h-6 w-6 hover:opacity-60 cursor-pointer transition-all" />
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
             <button className=" gap-1 flex flex-row px-3 items-center justify-center bg-[#293249]  rounded-xl font-bold text-white cursor-pointer">
               <img src="logo.png" alt="logo" className="w-6 " />
               <span>USD</span>
             </button>
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
             <button className=" gap-1 flex flex-row px-3 items-center justify-center bg-[#293249]  rounded-xl font-bold text-white cursor-pointer">
               <img src="logo.png" alt="logo" className="w-6 " />
               <span>USD</span>
             </button>
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
           <div className='text-right'>
             <p>0.00</p>
             <p>0%</p>
             <p>0% fee</p>
           </div>
         </div>
       </div>
     </div>
   )
}

export default swap
