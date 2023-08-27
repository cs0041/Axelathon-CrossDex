import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { Dispatch, SetStateAction, useState } from 'react'

interface ItemNavbar {
  title: string
  link: string
  currentPage: string
  setCurrentPage: Dispatch<SetStateAction<string>>
}

const objTitlelink = [
  { title: 'Swap', link: 'swap' },
  { title: 'Liquidity', link: 'liquidity' },
  { title: 'Faucet', link: 'faucet' },
  { title: 'Status Axelar Bridge', link: 'statusaxelar' },
]

const NavbarItem = ({ title, link, currentPage, setCurrentPage }:ItemNavbar) => {
  return (
    <Link href={`/${link}`}>
      <div
        onClick={() => setCurrentPage(link)}
        className={`  cursor-pointer  transition ease-in-out  py-2 px-4 rounded-lg hover:bg-gray-800 ${
          link == currentPage ? 'text-white' : 'text-[#98a1c0]'
        } `}
      >
        {title}
      </div>
    </Link>
  )
}


function Navbar() {
   const [currentPage, setCurrentPage] = useState<string>(location.pathname.slice(1))
  return (
    <div className="sticky inset-0 z-10">
      <div className="flex flex-row items-center justify-between px-5 py-3 transition-all duration-200">
        <div className="font-semibold text-base  flex flex-row justify-center items-center">
          <div className="flex gap-1 mr-6  text-xl justify-center items-center mx-2">
            <img src="/logo.png" alt="logo" className="h-9 w-9" />
            {/* <h1>CrossDex</h1> */}
          </div>
          <div className="flex flex-row  items-center gap-2  ">
            {objTitlelink.map((item, index) => (
              <NavbarItem
                key={item.title + index}
                title={item.title}
                link={item.link}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            ))}
          </div>
        </div>
        <ConnectButton
          label="connect web3"
          accountStatus={{
            smallScreen: 'address',
            largeScreen: 'full',
          }}
          showBalance={{
            smallScreen: false,
            largeScreen: true,
          }}
          chainStatus={{
            smallScreen: 'full',
            largeScreen: 'full',
          }}
        />
      </div>
    </div>
  )
}

export default Navbar
