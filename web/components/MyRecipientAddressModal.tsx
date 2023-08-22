import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { Fragment, useState } from 'react'

interface Props {
  onClose: () => void
  recipientAddress: string | undefined
  setRecipientAddress: React.Dispatch<React.SetStateAction<string | undefined>>
}

export default function MyRecipientAddressModal({ onClose, recipientAddress,setRecipientAddress }: Props) {
  const [isOpen, setIsOpen] = useState(true)
  const [tempRecipientAddress, setTempRecipientAddress] = useState<string|undefined>(recipientAddress)

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
                         p-1 rounded-lg  transition-all  focus-visible:outline-none"
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
                      value={tempRecipientAddress}
                      onChange={(e) => {
                        setTempRecipientAddress(e.target.value)
                      }}
                      className=" text-sm  w-full py-3 px-3  text-left  bg-transparent outline-none  text-white"
                      placeholder="Destination Address"
                      required
                    />
                  </div>
                  <button
                    onClick={()=>{
                      setRecipientAddress(tempRecipientAddress)
                      closeModal()
                    }}
                    className="mt-5 flex w-full py-3 rounded-md bg-blue-700 items-center justify-center 
                        hover:bg-blue-600 transition-all "
                  >
                    <h1 className="text-xl font-bold">
                      Confirm Recipient Address
                    </h1>
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
