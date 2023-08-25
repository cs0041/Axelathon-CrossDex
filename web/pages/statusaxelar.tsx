import React, { useState } from 'react'
import { readStatusAxelarTx } from '../utils/checkAxelra'
import CustomizedSteppers from '../components/StatusStepper'


type Props = {}

function statusAxelar({}: Props) {
  const [inputTx, setinputTx] = useState<string>('')
  const [startFindStatus, setStartFindStatus] = useState(false)
  return (
    <div>
      <div className="flex flex-col gap-10  items-center justify-center w-9/12   mx-auto">
        <div className="flex flex-row justify-center items-center gap-3 w-full mt-20">
          <div className="InputOrder  w-11/12 border-2 border-gray-700">
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
              required
            />
          </div>
          {startFindStatus ? (
            <button
              onClick={() => {
                setStartFindStatus(false)
              }}
              className="flex px-3 py-3 text-sm items-center justify-center font-bold  w-[120px] bg-red-500 rounded-md hover:opacity-60 transition-all"
            >
              clear
            </button>
          ) : (
            <button
              onClick={() => {
                setStartFindStatus(true)
              }}
              className="flex px-3 py-3 text-sm items-center justify-center font-bold  w-[120px] bg-red-500 rounded-md hover:opacity-60 transition-all"
            >
              Find Status
            </button>
          )}
        </div>
        {startFindStatus ? (
          <CustomizedSteppers txHash={inputTx} />
        ) : (
          <div className=" text-center text-gray-500  ">
            input transactions hash for check transactions status axelra bridge
          </div>
        )}
      </div>
    </div>
  )
}

export default statusAxelar
