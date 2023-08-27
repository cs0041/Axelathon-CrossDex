import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

 

interface Props {
  listItem: { symbol: string; contractAddress: string }[]
  nowSymbolToken: string
  setAddressToken: React.Dispatch<React.SetStateAction<string>>
  setSymbolToken: React.Dispatch<React.SetStateAction<string>>
}

export default function MyListBoxTrade({
  listItem,
  nowSymbolToken,
  setAddressToken,
  setSymbolToken,
}: Props) {
  const [textselected, setSelected] = useState(
    listItem[
      listItem.findIndex((item) => {
        return item.symbol === nowSymbolToken
      })
    ]
  )

  return (
    <div className=" w-36 !text-sm">
      <Listbox value={textselected} onChange={setSelected}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-pointer hover:bg-gray-700 rounded-lg bg-[#293249] py-1 pl-1 text-left ">
            <div className="flex flex-row gap-1  items-center">
              <img src="logo.png" alt="logo" className="w-6 " />
              <span className="block truncate">{textselected.symbol}</span>
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#293249] py-1 ">
              {listItem.map((item, Idx) => (
                <Listbox.Option
                  key={Idx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-1 px-2 transition-all ${
                      active ? 'bg-slate-700 ' : 'text-gray-300'
                    }`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <>
                      <div
                        className={` flex flex-row gap-1 ${
                          textselected.symbol == item.symbol
                            ? 'text-blue-600'
                            : ''
                        }`}
                         onClick={()=>{
                          setAddressToken(item.contractAddress)
                          setSymbolToken(item.symbol)
                        }}
                      >
                        <img src="logo.png" alt="logo" className="w-6 " />
                        <span>{item.symbol}</span>
                      </div>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}
