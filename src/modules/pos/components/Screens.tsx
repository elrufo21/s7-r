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
import { TypeStateOrder } from '../types'
import { useParams } from 'react-router-dom'
import { offlineCache } from '@/lib/offlineCache'

const Screens = () => {
  const {
    screen,
    cart,
    orderData,
    selectedOrder,
    setScreen,
    backToProducts,
    total,
    orderSelected,
    setSelectedOrder,
    setSelectedNavbarMenu,
    openDialog,
    closeDialogWithData,
    executeFnc,
    finalCustomer,
    setOrderData,
    setSyncData,
    setSyncLoading,
    session_id,
    setSelectedOrderInList,
    selectedOrderInList,
  } = useAppStore()
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
    root.render(<TicketHTML info={ticketInfo} finalCustomer={finalCustomer} />)

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
      (screen === 'products' || screen === 'payment') &&
      orderData?.find((item) => item.order_id === selectedOrder)?.state === 'Y' &&
      backToProducts === false
    ) {
      setScreen('payment')
    }
    if (screen === 'payment' && backToProducts === true) {
      setScreen('products')
    }
    if (orderData?.find((item) => item.order_id === selectedOrder)?.state === 'P') {
      setScreen('invoice')
    }
  }, [orderData, selectedOrder, screen])
  useEffect(() => {
    if (screen === 'products') {
      if (!selectedOrder) {
        setSelectedOrder(orderData[0]?.order_id)
      }
    }
  }, [screen])
  const fnc_detailsModal = async (order_id: string | number) => {
    let orderID = order_id
    let data
    if (!Number(order_id)) {
      const { selectedOr } = await offlineCache.syncOfflineData(
        executeFnc,
        pointId,
        setOrderData,
        setSyncLoading,
        session_id,
        null,
        null,
        true
      )
      setSyncData(false)
      const { oj_data } = await executeFnc('fnc_pos_order', 's1', [selectedOr])
      data = oj_data[0]
      setSelectedOrderInList(selectedOr)
    } else {
      await offlineCache
        .syncOfflineData(executeFnc, pointId, setOrderData, setSyncLoading, session_id)
        .then(async () => {
          setSyncData(false)
          const { oj_data } = await executeFnc('fnc_pos_order', 's1', [orderID])
          data = oj_data[0]
        })
      setSelectedOrderInList(orderID)
    }
    let getData = () => ({})
    const dialogId = openDialog({
      title: 'Detalles de la orden',
      dialogContent: () => (
        <FrmBaseDialog
          config={orderConfig}
          setGetData={(fn: any) => (getData = fn)}
          initialValues={{ ...data, dialogId }}
          onFinish={() => alert('FF')}
        />
      ),
      buttons: [
        {
          type: 'cancel',
          text: 'Cerrar',
          onClick: () => {
            const formData = getData()
            console.log('formData', formData)
            setSelectedOrderInList(formData.order_id)
            closeDialogWithData(dialogId, {})
          },
        },
      ],
    })
  }

  switch (screen) {
    case 'products':
      return (
        <div className="product-screen">
          <div className="leftpanel">
            <CartPanel />
          </div>

          <div className="rightpanel">
            <div className="rightpanel-sub-1">
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
                    {cart.map((item) => (
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
                    <span>S/ {total}</span>
                  </div>
                </div>
              </div>
              {(orderSelected?.state === TypeStateOrder.REGISTERED ||
                orderSelected?.state === 'E') && (
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
                      fnc_detailsModal(selectedOrderInList || '')
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
                    onClick={() => fnc_printTicket(orderSelected?.order_id || '')}
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
              {(orderSelected?.state === 'I' || orderSelected?.state === 'Y') && (
                <div className="d-flex gap-2 m-2 mt-0 min-h-[100px]">
                  <button className="back-button btn btn-secondary btn-lg lh-lg">
                    <MdKeyboardArrowLeft style={{ fontSize: '36px' }} />
                  </button>
                  <button
                    className="button validation load-order-button w-100 btn btn-lg btn-primary py-3 min-h-[100px]"
                    onClick={() => {
                      setScreen('products')
                      setSelectedNavbarMenu('R')
                      setSelectedOrder(orderSelected?.order_id || '')
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
