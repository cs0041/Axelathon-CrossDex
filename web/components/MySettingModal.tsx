import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { Fragment, useState } from 'react'

interface Props {
  onClose: () => void
}

export default function MySettingModal({ onClose }: Props) {
  let [isOpen, setIsOpen] = useState(true)

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
                         p-1 rounded-lg  transition-all "
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </Dialog.Title>
                  <h1 className="mt-3 font-bold">Slippage Tolerance</h1>
                  <div className="flex flex-row justify-center items-center gap-2  mt-3 ">
                    <button className="flex h-full bg-gray-700 rounded-md p-2 hover:bg-blue-600">
                      0.1%
                    </button>
                    <button className="flex h-full bg-gray-700 rounded-md p-2 hover:bg-blue-600">
                      0.5%
                    </button>
                    <button className="flex h-full bg-gray-700 rounded-md p-2 hover:bg-blue-600">
                      1.0%
                    </button>
                    <div className="InputOrder px-4">
                      <div className="flex flex-row justify-center items-center gap-3">
                        <input
                          onKeyPress={(event) => {
                            if (!/^[0-9]*[.,]?[0-9]*$/.test(event.key)) {
                              event.preventDefault()
                            }
                          }}
                          onChange={(e) => {
                            //   setInputAddressToken0(e.target.value)
                          }}
                          className="    w-full py-2  text-left  bg-transparent outline-none  text-right"
                          placeholder="0"
                          type="number"
                          required
                        />
                        <span>%</span>
                      </div>
                    </div>
                  </div>
                  <h1 className="mt-3 font-bold">Transaction deadline</h1>
                  <div className="InputOrder px-4 mt-3">
                    <div className="flex flex-row justify-center items-center gap-3">
                      <input
                        onKeyPress={(event) => {
                          if (!/^[0-9]*$/.test(event.key)) {
                            event.preventDefault()
                          }
                        }}
                        onChange={(e) => {
                          //   setInputAddressToken0(e.target.value)
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
