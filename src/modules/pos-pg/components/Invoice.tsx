import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BiCheckCircle } from 'react-icons/bi'
import useAppStore from '@/store/app/appStore'
import { usePWA } from '@/hooks/usePWA'
import { offlineCache } from '@/lib/offlineCache'
import { RiPrinterLine } from 'react-icons/ri'
import TicketHTML from './TicketHtml'

const Invoice = () => {
  const {
    orderDataPg,
    selectedOrderPg,
    addNewOrderPg,
    executeFnc,
    localModePg,
    setScreenPg,
    ensureFourOrdersPg, // Nueva función que crearemos
  } = useAppStore()
  const [order, setOrder] = useState({})
  const { isOnline } = usePWA()

  useEffect(() => {
    const fetchOrder = async () => {
      if (!isOnline || localModePg) {
        const orders = await offlineCache.getOfflinePosOrders()
        setOrder(orders.find((order) => order.order_id === selectedOrderPg) || {})
        await ensureFourOrdersPg()
        return
      }
      const { oj_data } = await executeFnc('fnc_pos_order', 's1', [selectedOrderPg])
      setOrder(oj_data[0] || {})

      await ensureFourOrdersPg()
    }
    fetchOrder()
  }, [orderDataPg])
  const info = { ...order, lines: (order as any)?.lines || [] }

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
    root.render(<TicketHTML info={info} />)

    setTimeout(() => {
      window.print()

      setTimeout(() => {
        root.unmount()
        document.body.removeChild(printContainer)
        document.head.removeChild(printStyles)
      }, 1000)
    }, 500)
  }

  return (
    <div className="receipt-screen screen h-100 bg-100">
      <div className="screen-content d-flex flex-column h-100">
        <div className="default-view d-flex flex-lg-row flex-column overflow-hidden flex-grow-1">
          <div className="actions d-flex flex-column justify-content-between flex-lg-grow-1 flex-grow-0 flex-shrink-1 flex-basis-0 border-end">
            <div className="o_payment_successful d-flex flex-column w-100 w-xxl-75 px-[100px] py-[70px]  pt-xxl-5 mx-auto">
              <div className="d-flex flex-column align-items-center mb-3 p-1 p-lg-3 border border-success rounded-3 bg-success-subtle text-success fs-3 bg-green-100">
                <i className="fa fa-fw fa-2x fa-check-circle">
                  <BiCheckCircle size={50} />
                </i>
                <span className="fs-3 fw-bolder">Pago exitoso</span>
                <div className="fs-4 fw-bold d-flex justify-content-center align-items-center gap-2">
                  <span>S/&nbsp;{(order as any)?.amount_total?.toFixed(2)}</span>
                  <span className="bg-green-600 edit-order-payment badge bg-success text-white rounded cursor-pointer pt-1">
                    Editar pago
                  </span>
                </div>
              </div>

              <div className="receipt-options d-flex flex-column gap-2">
                <div className="d-flex gap-1">
                  <button
                    className="button print btn btn-lg btn-secondary w-100 py-3 lh-xlg"
                    type="button"
                    onClick={fnc_printTicket}
                  >
                    <div className="flex justify-center">
                      <i className="fa fa-print me-3 self-center">
                        <RiPrinterLine style={{ fontSize: '24px' }} className="" />
                      </i>
                      <div>Imprimir recibo</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            {/**<div
              id="action_btn_desktop"
              className="validation-buttons d-flex w-100 gap-2 p-2 sticky-bottom"
            >
              <button
                className="button next validation btn btn-primary btn-lg w-100 py-4 lh-xlg highlight"
                name="done"
                type="button"
                onClick={async () => {
                  await ensureFourOrdersPg()
                  addNewOrderPg()
                }}
              >
                Nueva orden
              </button>
            </div> */}{' '}
            <div
              id="action_btn_desktop"
              className="validation-buttons d-flex w-100 gap-2 p-2 sticky-bottom"
            >
              <button
                className="button next validation btn btn-primary btn-lg w-100 py-4 lh-xlg highlight"
                name="done"
                type="button"
                onClick={async () => {
                  await ensureFourOrdersPg()
                  setScreenPg('products')
                }}
              >
                Volver a la lista
              </button>
            </div>
          </div>

          <div className="pos-receipt-container d-flex flex-grow-1 flex-lg-grow-0 w-100 w-lg-50 user-select-none justify-content-center bg-200 text-center overflow-hidden">
            <div className="w-full d-inline-block m-2 m-lg-3 p-3 text-start overflow-y-auto overflow-x-hidden">
              <div className="w-full h-full flex items-center align-middle justify-center scale-125">
                <TicketHTML info={info} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoice
