import { FormActionEnum, frmElementsProps } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'
//import PosPaymentModalConfig from '../../payment-modal/config'
import PosPaymentModalConfig from '@/modules/action/views/point-of-sale/payment-modal/config'
import { useEffect } from 'react'
import { FrmBaseDialog } from '@/shared/components/core'
import { PosOrderStateEnum } from '../../types'
import { TypeStateOrder, TypeStatePayment } from '@/modules/pos/types'
import PaymentTicketHtml from '@/modules/pos-pg/components/PaymentTicketHtml'
import TicketHTMLSimple from '@/modules/pos-pg/components/TicketHtmlSimple'
import { createRoot } from 'react-dom/client'

export function Frm_bar_buttons({ watch, setValue }: frmElementsProps) {
  const setFrmAction = useAppStore((state) => state.setFrmAction)
  const { openDialog, closeDialogWithData, setFrmDialogAction } = useAppStore((state) => state)

  const setFrmConfigControls = useAppStore((state) => state.setFrmConfigControls)

  useEffect(() => {
    setFrmConfigControls({
      session_name: {
        isEdit: true,
      },
      point_name: {
        isEdit: true,
      },
      name: {
        isEdit: true,
      },
      order_date: {
        isEdit: true,
      },
      user_name: {
        isEdit: true,
      },
      partner_id: {
        isEdit: watch('state') === PosOrderStateEnum.PAID,
      },
    })
  }, [setFrmConfigControls, watch('state')])
  const fnc_printTicket = () => {
    const printContainer = document.createElement('div')
    printContainer.id = 'print-container'
    printContainer.style.position = 'fixed'
    printContainer.style.top = '-9999px'
    printContainer.style.left = '-9999px'
    printContainer.style.width = '210mm'
    printContainer.style.background = 'white'

    const printStyles = document.createElement('style')
    printStyles.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        #print-container, #print-container * {
          visibility: visible;
        }
        #print-container {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: 100% !important;
        }
      }
    `
    document.head.appendChild(printStyles)
    document.body.appendChild(printContainer)

    const root = createRoot(printContainer)

    root.render(<TicketHTMLSimple info={watch()} />)

    setTimeout(() => {
      window.print()

      setTimeout(() => {
        root.unmount()
        document.body.removeChild(printContainer)
        document.head.removeChild(printStyles)
      }, 1000)
    }, 500)
  }
  const openModal = () => {
    let getData = () => ({})
    console.log(getData)
    const dialog = openDialog({
      title: 'Pagar',
      dialogContent: () => (
        <FrmBaseDialog config={PosPaymentModalConfig} setGetData={(fn: any) => (getData = fn)} />
      ),
      buttons: [
        {
          text: 'Guardar y cerrar',
          type: 'confirm',
          onClick: async () => {
            pay_order()
            closeDialogWithData(dialog, {})
          },
        },
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialog, {}),
        },
      ],
    })
  }

  const return_order = () => {
    setValue('state', 'N')
    setFrmAction(FormActionEnum.PRE_SAVE)
  }
  const returnRegistered = () => {
    if (watch('dialogId')) {
      setFrmDialogAction('u')

      setValue('state', TypeStateOrder.REGISTERED)
    } else {
      setValue('state', TypeStateOrder.REGISTERED)
      setFrmAction(FormActionEnum.PRE_SAVE)
    }
  }
  const pay_order = () => {
    setValue('state', 'I')
    setFrmAction(FormActionEnum.PRE_SAVE)
  }
  const cancelOrder = () => {
    if (watch('dialogId')) {
      setFrmDialogAction('u')
      setValue('state', TypeStateOrder.CANCELED)
      //setFrmAction(FormActionEnum.PRE_SAVE)
    } else {
      setValue('state', TypeStateOrder.CANCELED)
      setFrmAction(FormActionEnum.PRE_SAVE)
    }
  }

  return (
    <>
      {watch('state') === PosOrderStateEnum.PAID && (
        <>
          <button className="btn btn-secondary" onClick={() => {}}>
            Factura
          </button>

          <button className="btn btn-secondary" onClick={return_order}>
            Devolver producto
          </button>
        </>
      )}
      {(watch('payment_state') == TypeStatePayment.PARTIAL_PAYMENT ||
        watch('payment_state') == TypeStatePayment.PENDING_PAYMENT) && <></>}
      {watch('state') === PosOrderStateEnum.CANCELED && (
        <button className="btn btn-secondary" onClick={returnRegistered}>
          Restablecer a Registrado
        </button>
      )}
      <button className="btn btn-secondary" onClick={fnc_printTicket}>
        Descargar PDF
      </button>
      {watch('state') === PosOrderStateEnum.REGISTERED && (
        <button
          className="btn btn-secondary"
          onClick={() => {
            cancelOrder()
          }}
        >
          Cancelar
        </button>
      )}
    </>
  )
}
