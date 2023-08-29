import React ,{useContext} from 'react'
import { ContractContext } from '../context/contractContext'
import { useNetwork } from 'wagmi'
import { notificationToast } from '../utils/notificationToastify'
type Props = {}

function faucet({}: Props) {
  const { sendTxGetFaucet } = useContext(ContractContext)

  // wagmi
  const { chain } = useNetwork()
  return (
    <>
      <div className="flex mt-5 mb-24 xs:mt-14 p-2 justify-center items-center">
        <div className=" bg-[#0D111C]  rounded-3xl border-[1px] border-[#fafafa4d] text-gray-500 font-bold ">
          <div className="p-5  flex flex-col gap-3 justify-start ">
            <h1 className="text-white text-xl  ">Get Test Tokens</h1>

            <div className="  text-base font-normal">
              <p>
                This faucet transfers TestToken (cUSDT, cUSDC) for use in
                CrossDex
              </p>
            </div>
            <h2 className="text-white text-base   ">Received</h2>
            <div className="flex flex-row gap-2 text-sm  text-white">
              <div className="bg-blue-700  p-2 rounded-md">10,000 cUSDT</div>
              <div className="bg-blue-700  p-2 rounded-md">10,000 cUSDC</div>
            </div>
            <button
              onClick={() => {
                notificationToast(sendTxGetFaucet(), chain?.id,false)
              }}
              className="text-white  py-2 bg-blue-700 hover:bg-blue-600 rounded-md transition-all"
            >
              Get Faucet
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
export default faucet
