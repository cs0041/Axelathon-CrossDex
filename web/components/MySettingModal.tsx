import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { Fragment, useState } from 'react'
import { LightTooltip } from '../utils/muiStyled'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

interface Props {
  onClose: () => void
  setSlippage: React.Dispatch<React.SetStateAction<number>>
  slippage: number
  setDeadline: React.Dispatch<React.SetStateAction<number>>
  deadline: number
}

enum DefaultSlippage {
  one = 0.1,
  two = 0.5,
  three = 1,
}

export default function MySettingModal({
  onClose,
  setSlippage,
  slippage,
  setDeadline,
  deadline,
}: Props) {
  const [isOpen, setIsOpen] = useState(true)
  const [defaultSlippage, setDefaultSlippage] = useState<DefaultSlippage|undefined>(DefaultSlippage.one)

  function closeModal() {
    setIsOpen(false)
    onClose()
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0   backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed top-1/4 left-0 right-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-[#0D111C] p-6 text-left align-middle  transition-all
                border-[1px] border-gray-700"
                >
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-bold  flex flex-row justify-between border-b-2 border-gray-700 pb-2"
                  >
                    <span>Setting</span>
                    <button
                      onClick={closeModal}
                      className=" absolute right-5 top-5 text-gray-500  hover:bg-gray-800 hover:text-white 
                         p-1 rounded-lg  transition-all  focus-visible:outline-none"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </Dialog.Title>
                  <div className="flex flex-row gap-1 items-center mt-3">
                    <span className="font-bold">Slippage Tolerance</span>
                    <LightTooltip
                      title="Your transaction will revert if the price changes unfavorably by more than this percentage slippage.  
                      Max Slippage 100%"
                      arrow
                      placement="bottom"
                    >
                      <QuestionMarkCircleIcon className=" IconHover h-5 w-5" />
                    </LightTooltip>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-2  mt-3 ">
                    <button
                      className={`flex h-full rounded-md p-2 hover:bg-blue-600
                    ${
                      defaultSlippage == DefaultSlippage.one
                        ? 'bg-blue-600'
                        : 'bg-gray-700'
                    }`}
                      onClick={() => {
                        setSlippage(0.1)
                        setDefaultSlippage(DefaultSlippage.one)
                      }}
                    >
                      0.1%
                    </button>
                    <button
                      className={`flex h-full rounded-md p-2 hover:bg-blue-600
                    ${
                      defaultSlippage == DefaultSlippage.two
                        ? 'bg-blue-600'
                        : 'bg-gray-700'
                    }`}
                      onClick={() => {
                        setSlippage(0.5)
                        setDefaultSlippage(DefaultSlippage.two)
                      }}
                    >
                      0.5%
                    </button>
                    <button
                      className={`flex h-full rounded-md p-2 hover:bg-blue-600
                    ${
                      defaultSlippage == DefaultSlippage.three
                        ? 'bg-blue-600'
                        : 'bg-gray-700'
                    }`}
                      onClick={() => {
                        setSlippage(1)
                        setDefaultSlippage(DefaultSlippage.three)
                      }}
                    >
                      1.0%
                    </button>

                    <div className="InputOrder px-4">
                      <div className="flex flex-row justify-center items-center gap-3">
                        <input
                          onKeyPress={(event) => {
                            if (!/^[0-9]*[.,]?[0-9]*$/.test(event.key)) {
                              event.preventDefault()
                            }
                            if (String(slippage).length >= 6) {
                              event.preventDefault()
                            }
                          }}
                          value={slippage}
                          onChange={(e) => {
                            setSlippage(Number(e.target.value))
                            if (Number(e.target.value) == DefaultSlippage.one) {
                              setDefaultSlippage(DefaultSlippage.one)
                            } else if (
                              Number(e.target.value) == DefaultSlippage.two
                            ) {
                              setDefaultSlippage(DefaultSlippage.two)
                            } else if (
                              Number(e.target.value) == DefaultSlippage.three
                            ) {
                              setDefaultSlippage(DefaultSlippage.three)
                            } else {
                              setDefaultSlippage(undefined)
                            }

                            if (Number(e.target.value) > 100) {
                              setSlippage(100)
                            }
                          }}
                          className="    w-full py-2   bg-transparent outline-none  text-right"
                          placeholder="0"
                          type="number"
                          required
                        />
                        <span>%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-1 items-center mt-3">
                    <span className="font-bold">Transaction deadline</span>
                    <LightTooltip
                      title="Your transaction will revert if it is pending for more than this period of time.
                      Max deadline 60 minutes"
                      arrow
                      placement="bottom"
                    >
                      <QuestionMarkCircleIcon className=" IconHover h-5 w-5" />
                    </LightTooltip>
                  </div>
                  <div className="InputOrder px-4 mt-3">
                    <div className="flex flex-row justify-center items-center gap-3">
                      <input
                        onKeyPress={(event) => {
                          if (!/^[0-9]*$/.test(event.key)) {
                            event.preventDefault()
                          }
                          if (String(deadline).length >= 5) {
                            event.preventDefault()
                          }
                        }}
                        value={deadline}
                        onChange={(e) => {
                          setDeadline(Number(e.target.value))
                          if (Number(e.target.value) >= 60) {
                            setDeadline(60)
                          }
                          if (Number(e.target.value) <= 0) {
                            setDeadline(20)
                          }
                        }}
                        className="   w-full py-2  text-right  bg-transparent outline-none  text-white"
                        placeholder="0"
                        type="number"
                        required
                      />
                      <span>minutes</span>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
