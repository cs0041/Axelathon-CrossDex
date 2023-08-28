import { Cog6ToothIcon, ArrowDownCircleIcon } from '@heroicons/react/24/solid'
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

interface Props {}

function index({}: Props) {
  return (
    <div className="flex flex-col justify-center items-center   relative mt-10">
      <div className="flex flex-col gap-1 justify-center items-center">
        <p className="font-bold text-7xl mb-1">
          It's time for cross-chain Defi
        </p>
        <p className="text-base">
          A trading experience so simple it feels like other dex.{' '}
        </p>
        <p className="text-sm">
          Integrating defi with Axelar cross-chain technology.
        </p>
      </div>
      <div className="mt-10 mb-8 flex flex-row gap-1 justify-center items-center">
        <img src="/logo.png" alt="logo" className="h-20 w-20" />
        <h1 className="font-semibold text-2xl">CrossDex</h1>
      </div>

      <Link
        href={'/swap'}
        className="mb-16 bg-[#0D111C] px-2 py-3 rounded-3xl border-[1px] border-[#fafafa4d]   w-[450px] 
        opacity-50 !cursor-pointer hover:border-blue-700 hover:scale-110  hover:opacity-100 transition-all"
      >
        <div className="flex flex-row justify-between items-center mb-2 px-2">
          <h1 className="font-bold ">Swap</h1>
          <div
            className="flex flex-row justify-center items-center gap-1 text-xs
             bg-blue-600 rounded-2xl py-1 px-3"
          >
            <div>0.1% slippage</div>
            <Cog6ToothIcon className="h-6 w-6 " />
          </div>
        </div>

        <div
          className={`InputOrder  gap-1 pt-2 pb-3 px-4  hover:border-[#121A2A] cursor-pointer 
        `}
        >
          <div className="text-gray-500 cursor-pointer">You pay</div>
          <div className="flex flex-row gap-3 cursor-pointer">
            <div className="text-3xl  w-full   text-left  bg-transparent outline-none  text-white cursor-pointer">
              0
            </div>
            <div className="bg-[#293249]   flex flex-row justify-center items-center px-4 py-0   gap-1 rounded-lg text-sm cursor-pointer">
              <img src="logo.png" alt="logo" className="w-6 h-6" />
              <div>cUSDT</div>
            </div>
          </div>
          <div className="flex justify-end gap-2 text-sm text-gray-400 cursor-pointer">
            <div className="flex flex-row justify-center items-center gap-2">
              <div>Balance</div>
              1000
            </div>
            <div className="text-blue-500">Max</div>
          </div>
        </div>

        <div className="flex justify-center items-center mt-3 mb-3">
          <ArrowDownCircleIcon className="h-8 w-8 text-white  " />
        </div>

        <div
          className={`InputOrder rounded-b-none gap-1 pt-2 pb-3 px-4 hover:border-[#121A2A] cursor-pointer  
        `}
        >
          <div className="text-gray-500 cursor-pointer">You receive</div>
          <div className="flex flex-row gap-3 cursor-pointer">
            <div className="text-3xl  w-full   text-left  bg-transparent outline-none  text-white cursor-pointer">
              0
            </div>

            <div className="bg-[#293249]   flex flex-row justify-center items-center px-4 py-0   gap-1 rounded-lg text-sm cursor-pointer">
              <img src="logo.png" alt="logo" className="w-6 h-6" />
              <div>cUSDC</div>
            </div>
          </div>
          <div className="flex justify-end gap-2 text-sm text-gray-400 cursor-pointer">
            <div className="flex flex-row justify-center items-center gap-2">
              <div>Balance</div>
              1000
            </div>
          </div>
        </div>
        <div className="flex flex-row bg-[#121A2A] rounded-b-[15px] mt-[1px] py-2  px-4 items-center gap-2">
          <div className="flex flex-row gap-1">
            <InformationCircleIcon className="h-4 w-4 text-white  " />
            <div className="text-xs">1 cUSDT = 1 cUSDC</div>
          </div>
        </div>
        <button
          className={`mt-2 flex w-full py-3 rounded-2xl  items-center justify-center 
          transition-all cursor-pointer bg-blue-700`}
        >
          <h1 className="text-xl font-bold">Swap</h1>
        </button>
      </Link>
      <div className="flex flex-col gap-1 justify-center items-center">
        <p className="font-bold text-3xl">Trade crypto in minutes</p>
        <p className="text-sm">Buy, sell, bridge tokens cross-chain</p>
        <Link
          href={'/swap'}
          className={`mt-2 flex px-6  py-3 rounded-3xl  items-center justify-center 
          transition-all cursor-pointer bg-blue-700 hover:bg-blue-600 hover:scale-105`}
        >
          <h1 className="text-xl font-bold">Swap Now</h1>
        </Link>
      </div>
      {/* <div className="mt-10 w-full bg-red-400 flex flex-col justify-center items-end mr-2 ">
        <p className=" text-sm text-gray-500 ">BUILD BY 0xPascal</p>
      </div> */}
    </div>
  )
}

export default index
