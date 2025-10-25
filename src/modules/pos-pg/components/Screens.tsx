import CartPanel from './CartPanel'
import CategorySelector from './CategorySelector'
import ProductGrid from './ProductGrid'
import { OrderList } from './OrderList'
import CartItem from './CartItem'
import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import Payment from './Payment'
import Invoice from './Invoice'
import useAppStore from '@/store/app/appStore'
import orderConfig from '@/modules/action/views/point-of-sale/pos-order/config'
import { FrmBaseDialog } from '@/shared/components/core'
import TaraOptions from './TaraOptions'
import TicketHTML from './TicketHtml'

import { AiOutlineEdit } from 'react-icons/ai'
import { RiPrinterLine } from 'react-icons/ri'
import { TypeStateOrder, TypeStatePayment } from '../types'
import { useParams } from 'react-router-dom'
import { offlineCache } from '@/lib/offlineCache'

const Screens = () => {
  const {
    screenPg,
    cartPg,
    orderDataPg,
    selectedOrderPg,
    setScreenPg,
    backToProductsPg,
    totalPg,
    orderSelectedPg,
    setSelectedOrderPg,
    setSelectedNavbarMenuPg,
    openDialog,
    closeDialogWithData,
    executeFnc,
    finalCustomerPg,
    setOrderDataPg,
    setSyncDataPg,
    setSyncLoading,
    session_id: session_idPg,
    setSelectedOrderInListPg,
    selectedOrderInListPg,
    getSortedActiveOrdersPg,
  } = useAppStore()
  const sortedOrders = getSortedActiveOrdersPg()
  const { pointId } = useParams()
  const fnc_printTicket = async (order_id: string) => {
    // Obtener los datos completos de la orden
    const { oj_data } = await executeFnc('fnc_pos_order', 's1', [order_id])
    const orderInfo = oj_data[0] || {}

    // Preparar los datos para el ticket
    const ticketInfo = {
      name: orderInfo.name || '',
      order_date: orderInfo.order_date || new Date(),
      receipt_number: orderInfo.receipt_number || orderInfo.name,
      point_id: orderInfo.point_id || '',
      lines: orderInfo.lines || [],
      payments: orderInfo.payments || [],
    }

    // Crear un contenedor temporal para la impresión
    const printContainer = document.createElement('div')
    printContainer.id = 'print-container'
    printContainer.style.position = 'fixed'
    printContainer.style.top = '-9999px'
    printContainer.style.left = '-9999px'
    printContainer.style.width = '58mm' // Ancho de ticket térmico típico
    printContainer.style.background = 'white'

    // Agregar estilos específicos para impresión
    const printStyles = document.createElement('style')
    printStyles.textContent = `
    @page {
      size: 58mm auto;
      margin: 0;
    }
    
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
        width: 58mm !important;
        height: auto !important;
      }
      
      /* Estilos específicos para ticket térmico */
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  `
    document.head.appendChild(printStyles)
    document.body.appendChild(printContainer)

    // Renderizar el TicketHTML en el contenedor temporal (NO el PDF)
    const root = createRoot(printContainer)
    root.render(<TicketHTML info={ticketInfo} finalCustomer={finalCustomerPg} />)

    // Esperar un momento para que se renderice y luego imprimir
    setTimeout(() => {
      window.print()

      // Limpiar después de la impresión
      setTimeout(() => {
        root.unmount()
        document.body.removeChild(printContainer)
        document.head.removeChild(printStyles)
      }, 1000)
    }, 500)
  }

  useEffect(() => {
    if (
      (screenPg === 'products' || screenPg === 'payment') &&
      orderDataPg?.find((item) => item.order_id === selectedOrderPg)?.state === 'Y' &&
      backToProductsPg === false
    ) {
    //  setScreenPg('payment')
    }
    if (screenPg === 'payment' && backToProductsPg === true) {
      setScreenPg('products')
    }
    if (orderDataPg?.find((item) => item.order_id === selectedOrderPg)?.state === 'P') {
      setScreenPg('invoice')
    }
  }, [orderDataPg, selectedOrderPg, screenPg])
  useEffect(() => {
    if (screenPg === 'products') {
      if (!selectedOrderPg) {
        setSelectedOrderPg(orderDataPg[0]?.order_id)
      }
    }
  }, [screenPg])
  const fnc_detailsModal = async (order_id: string | number) => {
    let orderID = order_id
    let data
    if (!Number(order_id)) {
      const { selectedOr } = await offlineCache.syncOfflineData(
        executeFnc,
        pointId,
        setOrderDataPg,
        setSyncLoading,
        session_idPg,
        null,
        null,
        true
      )
      setSyncDataPg(false)
      const { oj_data } = await executeFnc('fnc_pos_order', 's1', [selectedOr])
      data = oj_data[0]
      setSelectedOrderInListPg(selectedOr || 0)
    } else {
      await offlineCache
        .syncOfflineData(executeFnc, pointId, setOrderDataPg, setSyncLoading, session_idPg)
        .then(async () => {
          setSyncDataPg(false)
          const { oj_data } = await executeFnc('fnc_pos_order', 's1', [orderID])
          data = oj_data[0]
        })
      setSelectedOrderInListPg(orderID)
    }

    let getData = () => ({})
    const dialogId = openDialog({
      title: 'Detalles de la orden',
      dialogContent: () => (
        <FrmBaseDialog
          config={orderConfig}
          setGetData={(fn: any) => (getData = fn)}
          initialValues={{ ...data, dialogId }}
        />
      ),
      handleCloseDialog: async () => {
        closeDialogWithData(dialogId, {})
        await offlineCache
          .syncOfflineData(executeFnc, pointId, setOrderDataPg, setSyncLoading, session_idPg)
          .then(async () => {
            setSyncDataPg(false)
            const { oj_data } = await executeFnc('fnc_pos_order', 's1', [orderID])
            data = oj_data[0]
          })
        setSelectedOrderInListPg(orderID)
      },
      buttons: [
        {
          type: 'cancel',
          text: 'Cerrar',
          onClick: () => {
            const formData = getData()
            setSelectedOrderInListPg(formData.order_id)
            closeDialogWithData(dialogId, {})
          },
        },
      ],
    })
  }

  const displayOrders = sortedOrders?.map((order) => ({
    ...order,
    payment_state:
      order.payment_state === 'PF' ? TypeStatePayment.PAYMENT : TypeStatePayment.PENDING_PAYMENT,
  }))

  switch (screenPg) {
    case 'products':
      return (
        <div className="product-screen gap-[8px] px-[8px]">
          {displayOrders?.map((order) => (
            <div className="leftpanel-pg" key={order.order_id}>
              <CartPanel order={order} payment_state={order.payment_state} />
            </div>
          ))}

          <div className="rightpanel">
            <div className="rightpanel-sub-1 overflow-auto">
              <TaraOptions />
              <CategorySelector />
              <ProductGrid />
            </div>
          </div>
        </div>
      )
    case 'ticket':
      return (
        <div className="ticket-screen">
          <div className="screen-full-width d-flex w-100 h-100">
            <div className="rightpane pane-border d-flex flex-column flex-grow-1 w-100 h-100 h-lg-100 pe-lg-0 bg-view border-end overflow-y-auto">
              <OrderList />
            </div>

            <div className="leftpane d-flex flex-column flex-grow-1 gap-2 w-100 h-100 h-lg-100 bg-view h-full">
              <div className="d-flex flex-column flex-grow-1 overflow-hidden">
                <div className="order-container d-flex flex-column flex-grow-1 overflow-y-auto text-start">
                  <div>
                    {cartPg?.map((item) => (
                      <div key={crypto.randomUUID()}>
                        <CartItem item={item} maxDecimals={2} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="order-summary d-flex flex-column gap-1 p-2 border-bottom fw-bolder lh-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Impuestos</span>
                    <span>S/ 0:00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-1">
                    <span>Total</span>
                    <span>S/ {totalPg}</span>
                  </div>
                </div>
              </div>
              {(orderSelectedPg?.state === TypeStateOrder.REGISTERED ||
                orderSelectedPg?.state === TypeStateOrder.CANCELED ||
                orderSelectedPg?.state === 'E') && (
                <div className="control-buttons ticket">
                  {/*
                  <button
                    className="btn2 btn2-white lh-lg text-truncate w-auto text-action"
                    onClick={() => {
                      fnc_detailsModal(orderSelected?.order_id || '')
                    }}
                  >
                    Detalles
                  </button>
                  
                  <button
                    className="btn2 btn2-white lh-lg w-auto"
                    onClick={() => fnc_printTicket(orderSelected?.order_id || '')}
                  >
                    Imprimir recibo
                  </button>
                  */}

                  <button
                    onClick={() => {
                      fnc_detailsModal(selectedOrderInListPg || '')
                    }}
                    className="btn-style-1 h-[100px] flex-1 bg-gray-200 hover:bg-gray-300 transition-colors duration-200 p-6 rounded-[0.25rem] text-gray-700 font-medium text-center"
                  >
                    <div>
                      <div className="h-[30px]">
                        <AiOutlineEdit style={{ fontSize: '24px' }} />
                      </div>
                      <div className="text-[1.09375rem]">Detalles</div>
                    </div>
                  </button>

                  <button
                    onClick={() => fnc_printTicket(orderSelectedPg?.order_id || '')}
                    className="btn-style-1 h-[100px] flex-1 bg-gray-200 hover:bg-gray-300 transition-colors duration-200 p-6 rounded-[0.25rem] text-gray-700 font-medium text-center"
                  >
                    <div>
                      <div className="h-[30px]">
                        <RiPrinterLine style={{ fontSize: '24px' }} />
                      </div>
                      <div className="text-[1.09375rem]">Imprimir recibo</div>
                    </div>
                  </button>
                </div>
              )}
              {(orderSelectedPg?.state === 'I' || orderSelectedPg?.state === 'Y') && (
                <div className="d-flex gap-2 m-2 mt-0 min-h-[100px]">
                  <button className="back-button btn btn-secondary btn-lg lh-lg">
                    <MdKeyboardArrowLeft style={{ fontSize: '36px' }} />
                  </button>
                  <button
                    className="button validation load-order-button w-100 btn btn-lg btn-primary py-3 min-h-[100px]"
                    onClick={() => {
                      setScreenPg('products')
                      setSelectedNavbarMenuPg('R')
                      setSelectedOrderPg(orderSelectedPg?.order_id || '')
                    }}
                  >
                    <span className="d-block">Cargar orden</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    case 'payment':
      return <Payment />
    case 'invoice':
      return <Invoice />
    default:
      return <></>
  }
}

export default Screens
