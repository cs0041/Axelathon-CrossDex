import React, { useEffect, useState } from 'react'
import { readStatusAxelarTx } from '../../utils/checkAxelra'
import CustomizedSteppers from '../../components/StatusStepper'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import { XMarkIcon } from '@heroicons/react/24/solid'

type Props = {}

function statusAxelar({}: Props) {
  const currentPathName = usePathname()
  const router = useRouter()

  const { pid, txHash } = router.query

  const [inputTx, setinputTx] = useState<any>(txHash)
  const [startFindStatus, setStartFindStatus] = useState(false)

  useEffect(() => {
     if(txHash){
       setStartFindStatus(true)
     }
  }, [])
  
  return (
    <div>
      <div className="flex flex-col gap-10  items-center justify-center w-9/12   mx-auto">
        <div className="flex flex-row justify-center items-center gap-3 w-full mt-20">
          <div className="InputOrder  w-full border-2 border-gray-700">
            <input
              type="text"
              onKeyPress={(event) => {
                if (!/^[a-zA-Z0-9]*$/.test(event.key)) {
                  event.preventDefault()
                }
              }}
              value={inputTx}
              onChange={(e) => {
                setinputTx(e.target.value)
              }}
              className=" text-sm  w-full py-3 px-3  text-left  bg-transparent outline-none  text-white"
              placeholder="txHash..."
              required={true}
            />
          </div>
          {startFindStatus ? (
            <button
              onClick={() => {
                setStartFindStatus(false)
              }}
              className="flex px-3 py-3 text-sm items-center justify-center font-bold  w-[120px] bg-blue-700 hover:bg-blue-600 rounded-md hover:opacity-60 transition-all"
            >
              <XMarkIcon className="h-5 w-5 text-white  " />
              Clear
            </button>
          ) : (
            <button
              onClick={() => {
                setStartFindStatus(true)
              }}
              className="flex px-3 py-3 text-[11px] lg:text-sm items-center justify-center font-bold  w-[120px] bg-blue-700 hover:bg-blue-600 rounded-md hover:opacity-60 transition-all"
            >
              Find Status
            </button>
          )}
        </div>
        <div className=" overflow-x-auto w-full   ">
          <div className="flex justify-center items-center w-full ">
            {startFindStatus ? (
              <div className="flex w-[700px] xs:w-full  border-[1px] border-gray-700 p-5  rounded-md ">
                <CustomizedSteppers txHash={inputTx} />
              </div>
            ) : (
              <div className="text-sm text-center text-gray-500  ">
                input transactions hash for check transactions status axelar
                bridge
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default statusAxelar
