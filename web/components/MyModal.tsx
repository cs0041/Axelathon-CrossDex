import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { Fragment, useState } from 'react'

interface Props {
  onClose: () => void
  userAddress: string|undefined
}

export default function MyModal({onClose,userAddress}:Props) {
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

          <div className="fixed top-1/4 left-0 right-0  overflow-y-auto">
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
                  className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#0D111C] p-6 text-left align-middle shadow-xl transition-all
                border-[1px] border-gray-700"
                >
                  <Dialog.Title
                    as="h3"
                       className="text-xl font-bold  flex flex-row justify-between border-b-2 border-gray-700 pb-2"
                  >
                    <span>Recipient Address</span>
                    <button
                      onClick={closeModal}
                      className=" absolute right-5 top-5 text-gray-500  hover:bg-gray-800 hover:text-white 
                         p-1 rounded-lg  transition-all "
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </Dialog.Title>

                  <div className="InputOrder mt-5">
                    <input
                      type="text"
                      onKeyPress={(event) => {
                        if (!/^[a-zA-Z0-9]*$/.test(event.key)) {
                          event.preventDefault()
                        }
                      }}
                      onChange={(e) => {
                        //   setInputAddressToken0(e.target.value)
                      }}
                      className=" text-base  w-full py-3 px-3  text-left  bg-transparent outline-none  text-white"
                      placeholder="Destination Address"
                      required
                    />
                  </div>
                  <button
                    onClick={closeModal}
                    className="mt-5 flex w-full py-3 rounded-md bg-blue-700 items-center justify-center 
                        hover:bg-blue-600 transition-all "
                  >
                    <h1 className="text-xl font-bold">
                      Confirm Recipient Address
                    </h1>
                  </button>

                  {/* <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your payment has been successfully submitted. We’ve sent
                      you an email with all of the details of your order.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
                  </div> */}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
