import PaymentTicketHtml from '@/modules/pos-pg/components/PaymentTicketHtml'
import { Type_pos_payment_origin } from '@/modules/pos-pg/types'
import { codePayment } from '@/shared/helpers/helpers'
import { FormActionEnum, frmElementsProps } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'
import { createRoot } from 'react-dom/client'

export function Frm_bar_buttons({ watch, setValue }: frmElementsProps) {
  const setFrmAction = useAppStore((state) => state.setFrmAction)
  const fnc_printTicket = () => {
    const info = {
      name: watch('partner_name') || watch('partner_name_2') || null,
      order_date: watch('date'),
      receipt_number: codePayment(watch('date')),
      point_id: watch('point_id'),
      payments: [{ payment_method_name: watch('payment_method_name'), amount: watch('amount') }],
      amount_total: watch('amount'),
      amount_residual: '',
      type: watch('type'),
      origin: watch('origin'),
    }
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
    root.render(<PaymentTicketHtml info={info} />)

    setTimeout(() => {
      window.print()

      setTimeout(() => {
        root.unmount()
        document.body.removeChild(printContainer)
        document.head.removeChild(printStyles)
      }, 1000)
    }, 500)
  }
  const cancelOrder = () => {
    setValue('state', 'C')
    setFrmAction(FormActionEnum.PRE_SAVE)
  }
  return (
    <>
      {watch('origin') !== Type_pos_payment_origin.DOCUMENT && (
        <>
          <button
            className="btn btn-secondary"
            onClick={() => {
              fnc_printTicket()
            }}
          >
            Imprimir
          </button>

          {watch('state') !== 'C' && (
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
      )}
    </>
  )
}
