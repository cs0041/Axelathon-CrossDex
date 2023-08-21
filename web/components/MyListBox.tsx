import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const listItem = [
  { text: 'Avalanche' },
  { text: 'Fantom' },
  { text: 'Polygon' },
]

interface Props {
  listItem: { text: string }[]
}

export default function MyListBox({ listItem }: Props) {
  const [textselected, setSelected] = useState(listItem[0])

  return (
    <div className=" w-36 !text-sm">
      <Listbox value={textselected} onChange={setSelected}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-pointer hover:bg-gray-700 rounded-lg bg-[#293249] py-1 pl-2 text-left ">
            <div className="flex flex-row gap-1  items-center">
              <img src="logo.png" alt="logo" className="w-6 " />
              <span className="block truncate">{textselected.text}</span>
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
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
                          textselected.text == item.text ? 'text-blue-600' : ''
                        }`}
                      >
                        <img src="logo.png" alt="logo" className="w-6 " />
                        <span>{item.text}</span>
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
