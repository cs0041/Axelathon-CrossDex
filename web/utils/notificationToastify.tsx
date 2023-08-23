import { toast } from 'react-toastify'
import { shortenAddress } from './shortenAddress'
import { filterErrorMessage } from './filterErrorMessage'
import '../styles/font.module.css'
import SVGLoader from '../components/SVGLoader'
export function notificationToast(myFunction: any) {
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
          <div>
            <h1 className="font-bold">Transaction receipt</h1>
            <a
              className="text-[#6f6e84] hover:text-white font-body text-xs underline mt-5"
              href={`https:/..........io/tx/${data}`}
              target="_blank"
            >
              View on ....: {shortenAddress(data)}
            </a>
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

 