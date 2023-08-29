import { toast } from 'react-toastify'
import { shortenAddress } from './shortenAddress'
import { filterErrorMessage } from './filterErrorMessage'
import '../styles/font.module.css'
import SVGLoader from '../components/SVGLoader'
import { findExplorerByChainID }from '../utils/findByChainId'
import { ChainIDMainChainDex } from './valueConst'
import Link from 'next/link'

export function notificationToast(myFunction: any, chainID:number|undefined , showStatusaxelar:boolean) {
  toast.promise(myFunction, {
    pending: {
      icon: ({ theme, type }) => <SVGLoader />,
      style: {
        fontFamily: 'Inter',
        backgroundColor: '#0D111C',
        color: 'white',
        overflow: 'auto',
        fontSize: 12,
        borderWidth: '1px',
        borderColor: '#293249',
      },
      render() {
        return (
          <div>
            <h1 className="font-semibold">Processing . . .</h1>
          </div>
        )
      },
    },
    success: {
      icon: ({ theme, type }) => (
        <img src="success.png" alt="me" className="h-5 w-5" />
      ),
      autoClose: 5000,
      style: {
        fontFamily: 'Inter',
        backgroundColor: '#0D111C',
        color: 'white',
        overflow: 'auto',
        fontSize: 12,
        borderWidth: '1px',
        borderColor: '#293249',
      },
      render({ data }: any) {
        return (
          <div className="flex flex-col">
            <h1 className="font-bold">Transaction receipt</h1>
            <a
              className="hover:opacity-60 transition-all text-xs font-semibold underline  "
              href={`${findExplorerByChainID(chainID)}/tx/${data}`}
              target="_blank"
            >
              View tx : {shortenAddress(data)}
            </a>
            {showStatusaxelar && (
              <Link
                className="hover:opacity-60 transition-all text-xs font-semibold underline "
                href={`/statusaxelar/tx?txHash=${data}`}
              >
                View status bridge : {shortenAddress(data)}
              </Link>
            )}
          </div>
        )
      },
    },
    error: {
      icon: ({ theme, type }) => (
        <img src="fail.png" alt="me" className="h-5 w-5" />
      ),
      autoClose: 3000,
      style: {
        fontFamily: 'Inter',
        backgroundColor: '#0D111C',
        color: 'white',
        overflow: 'auto',
        fontSize: 12,
        borderWidth: '1px',
        borderColor: '#293249',
      },
      render({ data }: any) {
        return (
          <div>
            <h1 className="font-bold">Transaction Fail</h1>
            <p> {filterErrorMessage(data.message)}</p>
          </div>
        )
      },
    },
  })
}

export function simpleNotificationToast(text: string) {
  toast.success(text, {
    autoClose: 1000,
    style: {
      backgroundColor: '#0D111C',
      color: 'white',
      borderWidth: '1px',
      borderColor: 'gray',
      overflow: 'auto',
      fontSize: 16,
      fontWeight: 'bold',
    },
    icon: '📝',
  })
}

