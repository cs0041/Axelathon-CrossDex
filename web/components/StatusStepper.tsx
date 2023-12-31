import * as React from 'react'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Check from '@mui/icons-material/Check'
import Start from '@mui/icons-material/Start'
import Paid from '@mui/icons-material/Paid'
import ManageSearch from '@mui/icons-material/ManageSearch'
import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector'
import { StepIconProps } from '@mui/material/StepIcon'
import { readStatusAxelarTx, sendTxAddGas, sendTxExecute } from '../utils/checkAxelra'
import { ArrowLongLeftIcon, ArrowLongRightIcon ,DocumentDuplicateIcon} from '@heroicons/react/24/solid'
import { shortenAddress } from '../utils/shortenAddress'
import { notificationToast } from '../utils/notificationToastify'
import { useNetwork } from 'wagmi'
import { findExplorerByChainName } from '../utils/findByChainId'


const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient(188deg, rgba(0,101,255,1) 0%, rgba(0,101,255,1) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient(188deg, rgba(0,101,255,1) 0%, rgba(0,101,255,1) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}))

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean }
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
      'linear-gradient(188deg, rgba(0,101,255,1) 0%, rgba(0,101,255,1) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      'linear-gradient(188deg, rgba(0,101,255,1) 0%, rgba(0,101,255,1) 100%)',
  }),
}))

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props

  const icons: { [index: string]: React.ReactElement } = {
    1: <Start />,
    2: <Paid />,
    3: <ManageSearch />,
    4: <Check />,
  }

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  )
}

const delay = (ms:number) => new Promise((res) => setTimeout(res, ms))

const steps = ['Send', 'Gas Paid', 'Confirmed', 'Executed']

interface Props {
  txHash: string
}

enum tabCallback {
  NoCallBackYet,
  Orgin,
  Callback
}
  // SRC_GATEWAY_CALLED = "source_gateway_called",
  //   DEST_GATEWAY_APPROVED = "destination_gateway_approved",
  //   DEST_EXECUTED = "destination_executed",
  //   EXPRESS_EXECUTED = "express_executed",
  //   DEST_EXECUTE_ERROR = "error",
  //   DEST_EXECUTING = "executing",
  //   APPROVING = "approving",
  //   FORECALLED = "forecalled",
  //   FORECALLED_WITHOUT_GAS_PAID = "forecalled_without_gas_paid",
  //   NOT_EXECUTED = "not_executed",
  //   NOT_EXECUTED_WITHOUT_GAS_PAID = "not_executed_without_gas_paid",
  //   INSUFFICIENT_FEE = "insufficient_fee",
  //   UNKNOWN_ERROR = "unknown_error",
  //   CANNOT_FETCH_STATUS = "cannot_fetch_status",
  //   SRC_GATEWAY_CONFIRMED = "confirmed"


  //  ;(GAS_UNPAID = 'gas_unpaid'),
  //    (GAS_PAID = 'gas_paid'),
  //    (GAS_PAID_NOT_ENOUGH_GAS = 'gas_paid_not_enough_gas'),
  //    (GAS_PAID_ENOUGH_GAS = 'gas_paid_enough_gas')

export default function CustomizedSteppers({ txHash }: Props) {
  const { chain } = useNetwork()

  const [step, setStep] = React.useState(0)
  const [buttonPaidGas, setButtonPaidGas] = React.useState(false)
  const [buttonExcute, setButtonExcute] = React.useState(false)
  const [fristInit, setFristInit] = React.useState(true)
  const [isHaveCallBack, setIsHaveCallBack] = React.useState<tabCallback>(tabCallback.NoCallBackYet)
  const [txCallBack, setTxCallBack] = React.useState('')
  const [txOrigin, setTxOrigin] = React.useState(txHash)
  const [txNow, setTxNow] = React.useState(txHash)
  const [chainName, setChainName] = React.useState('')

  const [excuteTx, setExcuteTx] = React.useState('')
  const [excuteChainName, setExcuteChainName] = React.useState('')

  const [failToGetStatus, setFailToGetStatus] = React.useState(false)

  const [stillFind, setStillFind] = React.useState(true)

  const initFindStatus = async () => {
    let find = true
    while (find) {
      const status = await readStatusAxelarTx(txNow)
      if (status.status == 'cannot_fetch_status' || txHash == '') {
        setFristInit(false)
        find = false
        setStillFind(false)
        setFailToGetStatus(true)
      } else {
        setFristInit(false)
      }
      if (status.status == 'destination_executed') {
        setButtonExcute(false)
        setExcuteTx(status.executed.transactionHash)
        setExcuteChainName(status.executed.chain)
        setStep(3)
        await delay(10000)
        const tempStatus = await readStatusAxelarTx(txNow)
        if (
          tempStatus.callback != undefined &&
          tempStatus.callback != '' &&
          tempStatus.callback != 'undefined'
        ) {
          setTxCallBack(tempStatus.callback.transactionHash)
          setIsHaveCallBack(tabCallback.Orgin)
        } 
        find = false
        setStillFind(false)
      } else if (status.status == 'error') {
        setChainName(status.approved.chain)
        setStep(3)
        find = false
        setStillFind(false)
        setButtonExcute(true)
      } else if (status.status == 'confirmed' || status.status == 'executing') {
        setStep(2)
      } else if (
        status.gasPaidInfo?.status == 'gas_paid' ||
        status.gasPaidInfo?.status == 'gas_paid_enough_gas'
      ) {
        setButtonPaidGas(false)
        setStep(1)
      } else if (
        status.gasPaidInfo?.status == 'gas_unpaid' ||
        status.gasPaidInfo?.status == 'gas_paid_not_enough_gas'
      ) {
        setStep(1)
        setChainName(status.callTx.chain)
        setButtonPaidGas(true)
      } else if (status.status == 'source_gateway_called') {
        setStep(0)
      }

      await delay(5000)
    }
  }

  React.useEffect(() => {
     initFindStatus()
  }, [isHaveCallBack])

  return (
    <div className=" w-full relative">
      {failToGetStatus ? (
        <div className="flex flex-col gap-2 justify-center items-center text-gray-500">
          <div>Something went wrong</div>
          <div>cannot fetch status</div>
        </div>
      ) : (
        <>
          {fristInit ? (
            <div className="w-full flex flex-col gap-5 justify-center items-center p-5">
              <span className="loader2"></span>
              <span className="text-gray-500">fetch status...</span>
            </div>
          ) : (
            <>
              <div className="flex  flex-col sm:flex-row gap-2 mb-7">
                <div
                  className="flex flex-row justify-center items-center gap-1 
                  font-bold p-2 bg-blue-700 px-3 rounded-md w-fit"
                >
                  <span>Tx: {shortenAddress(txNow)}</span>
                </div>
                <div className="font-bold p-2 bg-white text-black px-3 rounded-md w-fit">
                  Method: CallContract
                </div>
                {isHaveCallBack === tabCallback.Orgin && (
                  <button
                    className="flex flex-row justify-center items-center gap-1 
                font-bold p-2 bg-blue-700 hover:bg-blue-600 transition-all px-3 rounded-md w-fit"
                    onClick={async () => {
                      setFristInit(true)
                      setTxNow(txCallBack)
                      setStillFind(true)
                      await delay(3000)
                      setIsHaveCallBack(tabCallback.Callback)
                    }}
                  >
                    <span>CallBack</span>
                    <ArrowLongRightIcon className="h-5 w-5 text-white  " />
                  </button>
                )}
                {isHaveCallBack === tabCallback.Callback && (
                  <button
                    className="flex flex-row justify-center items-center gap-1 
                font-bold p-2 bg-blue-700 hover:bg-blue-600 transition-all px-3 rounded-md w-fit"
                    onClick={async () => {
                      setFristInit(true)
                      setTxNow(txOrigin)
                      setStillFind(true)
                      await delay(3000)
                      setIsHaveCallBack(tabCallback.Orgin)
                    }}
                  >
                    <ArrowLongLeftIcon className="h-5 w-5 text-white  " />
                    <span>Origin</span>
                  </button>
                )}
                {stillFind && (
                  <span className="loader3 absolute right-3  top-3 "></span>
                )}
              </div>
              <div>
                <Stepper
                  alternativeLabel
                  activeStep={step}
                  connector={<ColorlibConnector />}
                >
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel
                        style={{ color: 'blue' }}
                        StepIconComponent={ColorlibStepIcon}
                      >
                        <div className="text-white flex flex-col gap-1 mb-2 font-semibold ">
                          <span>{label}</span>
                          {step == 3 && excuteTx != '' && index == 3 && (
                            <div>
                              <a
                                className=" hover:opacity-60 transition-all text-[10px] md:text-xs underline mt-5"
                                href={`${findExplorerByChainName(
                                  excuteChainName
                                )}/tx/${excuteTx}`}
                                target="_blank"
                              >
                                Tx : {shortenAddress(excuteTx)}
                              </a>
                            </div>
                          )}
                        </div>
                        {buttonPaidGas && index == 1 && (
                          <div>
                            <button
                              className="p-2 rounded-md bg-blue-700 hover:bg-blue-600 transition-all font-bold text-white text-[10px]  xs:text-base "
                              onClick={() =>
                                notificationToast(
                                  sendTxAddGas(txNow, chainName),
                                  chain?.id,
                                  false
                                )
                              }
                            >
                              Paid Gas in chain {chainName}
                            </button>
                          </div>
                        )}
                        {buttonExcute && index == 3 && (
                          <div>
                            <button
                              className="p-2 rounded-md bg-blue-700 hover:bg-blue-600 transition-all font-bold text-white text-[10px]  xs:text-base"
                              onClick={() =>
                                notificationToast(
                                  sendTxExecute(txNow),
                                  chain?.id,
                                  false
                                )
                              }
                            >
                              Execute in chain {chainName}
                            </button>
                          </div>
                        )}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
