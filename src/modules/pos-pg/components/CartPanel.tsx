import { useState, useEffect, useRef } from 'react'
import contactsConfig from '../views/contact-index/config'
import CartItem from './CartItem'
import clientConfig from '@/modules/contacts/views/contact-index/config'
import useAppStore from '@/store/app/appStore'
import { ModalBase } from '@/shared/components/modals/ModalBase'
import { CustomHeader } from './CustomHeader'
import { FrmBaseDialog } from '@/shared/components/core'
import { ActionTypeEnum } from '@/shared/shared.types'
import noteConfig from '../views/notes/config'
import { Product } from '../types'
import { Operation } from '../context/CalculatorContext'

import ModalMoreOptions from './modal/components/ModalMoreOptions'
import productInfoConfig from '../views/product-info/config'
import { usePWA } from '@/hooks/usePWA'
import { offlineCache } from '@/lib/offlineCache'

import { adjustTotal } from '@/shared/helpers/helpers'
import CalculatorPanel from './modal/components/ModalCalculatorPanel'
import { usePosActionsPg } from '@/modules/pos/hooks/usePosActionsPg'
import { CustomToast } from '@/components/toast/CustomToast'
import CartTable from './CartTable'

export default function CartPanel({ order }: { order: any[] }) {
  const {
    openDialog,
    closeDialogWithData,
    executeFnc,
    updateOrderPartnerPg,
    setModalData,
    orderDataPg,
    getTotalPriceByOrderPg,
    selectedOrderPg,
    selectedItemPg,
    setSelectedItemPg,
    screenPg,
    changeToPaymentLocalPg,
    finalCustomerPg,
    setFinalCustomerPg,
    setHandleChangePg,
    operationPg,
    setOperationPg,
    clearDisplayPg,
    addDigitPg,
    defaultPosSessionDataPg,
    deleteOrderPg,
    setSelectedLinePg,
    resetTriggerPg,
    setSelectedOrderPg,
    temporaryValuesPg,
    temporaryListPg,
    applyTemporaryValuesByPositionPg,
  } = useAppStore()
  const { isOnline } = usePWA()
  const [cart, setCart] = useState<Product[]>([])
  const prevLinesCount = useRef<number>(order?.lines?.length || 0)
  useEffect(() => {
    prevLinesCount.current = order?.lines?.length || 0
    //  openCalculatorModal()
  }, [order?.lines?.length])
  const [total, setTotal] = useState<number | string>()
  const [is_change, setIsChange] = useState(false)
  const { saveCurrentOrder } = usePosActionsPg()

  const finalCustomerPgRef = useRef(finalCustomerPg)

  useEffect(() => {
    setOperationPg(Operation.QUANTITY)
    setSelectedLinePg(selectedOrderPg, selectedItemPg)
  }, [selectedItemPg])
  useEffect(() => {
    if (!resetTriggerPg) return

    // 👇 Aquí limpias los estados locales del CartPanel
    clearDisplayPg()
  }, [resetTriggerPg])
  useEffect(() => {
    const pos_Status = orderDataPg?.find((item) => item?.order_id === selectedOrderPg)?.pos_status
    // if (pos_Status === 'P' && backToProductsPg === false) setScreenPg('payment')

    setCart(
      orderDataPg
        ?.find((item) => item.order_id === selectedOrderPg)
        ?.lines?.filter((item: any) => item.action !== ActionTypeEnum.DELETE) || []
    )

    // setLocalValue(cart?.find((item) => item.product_id === selectedItemPg)?.quantity.toString() || '')
  }, [orderDataPg, selectedOrderPg])

  useEffect(() => {
    finalCustomerPgRef.current = finalCustomerPg
  }, [finalCustomerPg])

  useEffect(() => {
    setIsChange(true)
  }, [screenPg, selectedOrderPg])

  useEffect(() => {
    const currentOrder = orderDataPg.find((item) => item.order_id === selectedOrderPg)
    const lines = currentOrder?.lines || []
    const selected = lines.filter((item: any) => item.selected)[0]?.line_id
    if (lines.length === 0) {
      setSelectedItemPg(null)
      return
    }
    if (selected) {
      setSelectedItemPg(selected)
    } else {
      setSelectedItemPg(lines[lines.length - 1].line_id)
    }
  }, [selectedOrderPg])
  useEffect(() => {
    setFinalCustomerPg({
      partner_id:
        orderDataPg.find((item) => item.order_id === selectedOrderPg)?.partner_id ||
        defaultPosSessionDataPg.partner_id,
      name:
        orderDataPg.find((item) => item.order_id === selectedOrderPg)?.partner_name ||
        defaultPosSessionDataPg.name,
    })
    if (is_change) {
      if (orderDataPg.find((item) => item.order_id === selectedOrderPg)?.partner_id) {
        /* setFinalCustomerPg({
          partner_id: orderDataPg.find((item) => item.order_id === selectedOrderPg)?.partner_id,
          name: orderDataPg.find((item) => item.order_id === selectedOrderPg)?.partner_name,
        })*/
      }
      if (orderDataPg?.find((item) => item?.order_id === selectedOrderPg)?.pos_status === 'Y')
        // setScreenPg('payment')

        setIsChange(false)
    }
  }, [is_change, orderDataPg, selectedOrderPg])

  const fnc_edit_client = async (client: any) => {
    const { oj_data } = await executeFnc('fnc_partner', 's1', [client.partner_id.toString()])
    let getData = () => ({})
    const dialogId = openDialog({
      title: 'Editar Cliente',

      dialogContent: () => (
        <FrmBaseDialog
          config={clientConfig}
          setGetData={(fn: any) => (getData = fn)}
          initialValues={oj_data[0]}
        />
      ),
      buttons: [
        {
          text: 'Guardar',
          type: 'confirm',
          onClick: async () => {
            try {
              const formData = getData() as any
              await executeFnc('fnc_partner', 'u', formData)
              const rs = await executeFnc('fnc_partner', 's', [[1, 'pag', 1]])
              if (finalCustomerPg) {
                const newData = rs.oj_data.map((item: any) => {
                  if (item.partner_id === finalCustomerPgRef.current?.partner_id) {
                    return {
                      ...item,
                      selected: true,
                    }
                  }
                  return item
                })
                setModalData(newData)
                setHandleChangePg(true)
                closeDialogWithData(dialogId, {})
                return
              }
              /*if (formData.selected === true) {
                const newData = rs.oj_data.map((item: any) => {
                  if (item.partner_id === finalCustomerPgRef.current?.partner_id) {
                    return {
                      ...item,
                      selected: true,
                    }
                  }
                  return item
                })
                console.log('newData', newData)
                setModalData(newData)
                closeDialogWithData(dialogId, {})
                return
              }*/
              setModalData(rs.oj_data)
              setHandleChangePg(true)
              closeDialogWithData(dialogId, {})
            } catch (err) {
              console.error('Error al actualizar cliente:', err)
            }
          },
        },
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialogId, {}),
        },
      ],
    })
  }

  useEffect(() => {
    setTotal(getTotalPriceByOrderPg(order.order_id))
  }, [cart])
  const MAX_DECIMALS = 2

  const fnc_create_customer = () => {
    let getData = () => ({})
    const dialogId = openDialog({
      title: 'Crear cliente',
      contactModal: true,
      dialogContent: () => (
        <FrmBaseDialog config={contactsConfig} setGetData={(fn: any) => (getData = fn)} />
      ),
      buttons: [
        {
          text: 'Guardar',
          type: 'confirm',
          onClick: async () => {
            const formData = getData()
            if (!isOnline) {
              offlineCache.saveContactOffline({
                ...formData,
                partner_id: crypto.randomUUID(),
                action: ActionTypeEnum.INSERT,
              })
              setFinalCustomerPg(formData)
              setIsChange(true)
              setHandleChangePg(true)
              closeDialogWithData(dialogId, {})
              return
            }
            const rs = await executeFnc('fnc_partner', 'i', formData)
            //oj_data.partner_id
            const newData = await executeFnc('fnc_partner', 's', [[1, 'pag', 1]])
            const dataUpdate = newData.oj_data.map((item: any) => {
              if (item.partner_id === rs.oj_data.partner_id) {
                return {
                  ...item,
                  selected: true,
                }
              }
              return item
            })
            setModalData(dataUpdate)
            updateOrderPartnerPg(selectedOrderPg, rs.oj_data.partner_id, formData.name)
            offlineCache.saveContactOffline({
              ...formData,
              partner_id: rs.oj_data.partner_id,
            })
            //setFinalCustomerPg(dataUpdate.find((item: any) => item.selected === true))
            setIsChange(true)
            setHandleChangePg(true)
            closeDialogWithData(dialogId, {})
          },
        },
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialogId, {}),
        },
      ],
    })
  }
  const fnc_open_contact_modal = async () => {
    const localCustomers = await offlineCache.getOfflineContacts()
    setModalData(localCustomers)
    const dialogId = openDialog({
      title: 'Elija un cliente',
      contactModal: true,
      dialogContent: () => (
        <ModalBase
          config={contactsConfig}
          onRowClick={(row) => {
            /*if (row.partner_id === finalCustomerPg.partner_id) {
              setFinalCustomerPg({})
              setIsChange(true)
              setHandleChangePg(true)
              closeDialogWithData(dialogId, row)
              return
            }*/
            setIsChange(true)
            updateOrderPartnerPg(order.order_id, row.partner_id, row.name)
            //setFinalCustomerPg(row)
            setHandleChangePg(true)
            closeDialogWithData(dialogId, row)
          }}
          contactModal={true}
          openEditModal={(client: any) => {
            fnc_edit_client(client)
          }}
          customHeader={<CustomHeader fnc_create_button={fnc_create_customer} />}
        />
      ),
      buttons: [
        {
          text: 'Descartar',
          type: 'cancel',
          onClick: () => {
            setFinalCustomerPg({
              partner_id: defaultPosSessionDataPg.partner_id,
              partner_name: defaultPosSessionDataPg.name,
            })
            closeDialogWithData(dialogId, {})
          },
        },
      ],
    })
  }

  useEffect(() => {
    if (cart.length > 0) {
      const lastItem = cart[cart.length - 1]
      if (lastItem && lastItem.line_id === selectedItemPg) {
        // Esperar a que el DOM se actualice
        setTimeout(() => {
          if (itemRefs.current[lastItem.line_id]) {
            itemRefs.current[lastItem.line_id]?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })
          }
        }, 0)
      }
    }
  }, [cart.length])

  // Efecto para manejar el scroll cuando se selecciona un item existente
  useEffect(() => {
    if (selectedItemPg && itemRefs.current[selectedItemPg]) {
      itemRefs.current[selectedItemPg]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [selectedItemPg])

  // Función para manejar la selección de productos
  const handleSelectItem = (productId: string) => {
    if (productId !== selectedItemPg) {
      setSelectedItemPg(productId)

      const selectedProduct = cart.find((item) => item.line_id === productId)
      if (selectedProduct && selectedProduct.quantity !== undefined) {
        // Usar base_quantity si existe, sino usar quantity como fallback
        const baseQuantity = selectedProduct.base_quantity || selectedProduct.quantity
        const quantity = baseQuantity.toString()
        const price = selectedProduct.sale_price.toString()
        const tara = selectedProduct.taraQuantity?.toString() || '0'
        const taraValue = selectedProduct.taraValue?.toString() || '0'

        clearDisplayPg()
        let valueToDisplay
        if (operationPg === Operation.PRICE) {
          valueToDisplay = price
        } else if (operationPg === Operation.TARA_QUANTITY) {
          valueToDisplay = tara
        } else if (operationPg === Operation.TARA_VALUE) {
          valueToDisplay = taraValue
        } else {
          valueToDisplay = quantity
        }
        for (const digit of valueToDisplay) {
          addDigitPg(digit)
        }
        setHandleChangePg(true)
      }
    }
  }

  const fnc_customer_note = () => {
    const dialogId = openDialog({
      title: 'Nota de cliente',
      dialogContent: () => <FrmBaseDialog config={noteConfig} />,
      buttons: [
        {
          text: 'Guardar',
          type: 'confirm',
          onClick: () => closeDialogWithData(dialogId, {}),
        },
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialogId, {}),
        },
      ],
    })
  }
  const fnc_more_info = async () => {
    const product_id = cart.find((item) => item.line_id === selectedItemPg)?.product_id
    const { oj_data } = await executeFnc('fnc_product', 's1', [product_id])

    const dialogId = openDialog({
      title: 'Producto',
      dialogContent: () => <FrmBaseDialog config={productInfoConfig} initialValues={oj_data[0]} />,
      buttons: [
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialogId, {}),
        },
      ],
    })
  }
  const fnc_cancel_order = async () => {
    await executeFnc('fnc_pos_order', 'd', [selectedOrderPg])
    /*const newOrders = await executeFnc('fnc_pos_order', 's_pos', [
      [0, 'fequal', 'point_id', pointId],
      [
        0,
        'multi_filter_in',
        [
          { key_db: 'state', value: 'I' },
          { key_db: 'state', value: 'Y' },
        ],
      ],
    ])*/
    deleteOrderPg(selectedOrderPg)
  }

  const fnc_open_more_options_modal = () => {
    const dialogId = openDialog({
      title: 'Opciones',
      dialogContent: () => (
        <ModalMoreOptions
          closeDialog={() => closeDialogWithData(dialogId, {})}
          handleCustomerNote={fnc_customer_note}
          moreInfo={fnc_more_info}
          handleCancelOrder={fnc_cancel_order}
        />
      ),
      buttons: [
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialogId, {}),
        },
      ],
    })
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--clear-next-digit', 'false')
  }, [])

  const fnc_open_note_modal = () => {
    let getData = () => ({})
    console.log('getData', getData)
    const dialogId = openDialog({
      title: 'Notas',
      dialogContent: () => (
        <FrmBaseDialog config={noteConfig} setGetData={(fn: any) => (getData = fn)} />
      ),
      buttons: [
        {
          text: 'Aplicar',
          type: 'confirm',

          onClick: async () => {
            closeDialogWithData(dialogId, {})
          },
        },
        {
          text: 'Descartar',
          type: 'cancel',

          onClick: async () => {
            closeDialogWithData(dialogId, {})
          },
        },
      ],
    })
  }

  const fnc_to_pay = async () => {
    changeToPaymentLocalPg(selectedOrderPg)
    /*  const rs = await executeFnc('fnc_pos_order', 'u', {
      order_id: selectedOrderPg,
      state: 'Y',
    })
    if (rs.oj_data.length > 0) {
      const newOrders = await executeFnc('fnc_pos_order', 's_pos', [
        [0, 'fequal', 'point_id', pointId],
      ])
      setorderDataPg(newOrders.oj_data)
    }*/
    //Linea comentada, analizar luego
    //  changeToPayment(selectedOrderPg)
    // setScreenPg('payment')
    saveCurrentOrder(true, true)
  }

  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const openCalculatorModal = () => {
    const dialogId = openDialog({
      title: cart?.find((c) => c.line_id === selectedItemPg)?.name,
      dialogContent: () => (
        <CalculatorPanel
          product={cart?.find((c) => c.line_id === selectedItemPg)}
          dialogId={dialogId}
          selectedField={Operation.QUANTITY}
        />
      ),
      buttons: [
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => {
            closeDialogWithData(dialogId, {})
          },
        },
      ],
    })
  }
  const lastTapTime = useRef({})

  const handleDoubleTap = (itemId) => {
    const now = Date.now()
    const lastTap = lastTapTime.current[itemId] || 0
    const timeSinceLastTap = now - lastTap

    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      openCalculatorModal(itemId)
      lastTapTime.current[itemId] = 0
    } else {
      lastTapTime.current[itemId] = now
    }
  }
  return (
    // <div
    //   className={`flex flex-col h-full border rounded-md shadow-sm transition-all duration-200 ${selectedOrderPg === order.order_id
    //     ? 'border-green600 ring-4 ring-green-300 !bg-green-200 *:!bg-green-200'
    //     : 'border-gray-200'
    //     }`}
    // >

    <div className={`flex flex-col h-full`}>
      <div className="pads">
        <div className="control-buttons bg-black ">
          <div className="w-full flex justify-between text-truncate font-bold text-yellow-500 ">
            <div className="w-full text-center">
              {temporaryListPg.find(
                (t) =>
                  t.position_pg === order.position_pg && t.payment_state === order.payment_state
              )?.name || ''}
            </div>
            <div className="mr-8">
              {temporaryListPg.find(
                (t) =>
                  t.position_pg === order.position_pg && t.payment_state === order.payment_state
              )?.base_quantity || '0'}
            </div>
          </div>
        </div>
      </div>
      <div className="control-buttons mb-0 pt-0">
        <button
          className="btn touch-lh-m text-truncate w-full text-action text-white"
          style={{
            backgroundColor: 'oklch(62.7% 0.194 149.214)',
            fontSize: '1.1rem',
          }}
          onClick={() => {
            if (!temporaryValuesPg?.product_id) {
              CustomToast({
                title: 'Alerta',
                description: 'Seleccione un producto antes de agregarlo a la lista',
                type: 'warning',
              })
            }
            setSelectedOrderPg(order.order_id)
            //  applyTemporaryValuesToPg(order.order_id)
            applyTemporaryValuesByPositionPg(
              order.position_pg,
              order.payment_state,
              temporaryValuesPg.tara_value,
              temporaryValuesPg.tara_quantity
            )
          }}
        >
          AGREGAR A LA LISTA
        </button>
      </div>

      <div className="w-full min-h-[40px] h-[40px] flex items-center justify-center font-bold bg-white">
        {/* Usar order.payment_state en lugar de order.payment_state */}
        {order.payment_state === 'PE' ? 'CRÉDITO' : 'VENTA PÚBLICO'}
      </div>

      <div className="pads">
        <div className="control-buttons ">
          <button
            className="text-truncate w-full font-bold text-yellow-500"
            style={{
              backgroundColor: 'black',
              fontSize: '1rem',
              height: '50px',
            }}
            onClick={() => {
              fnc_open_contact_modal()
            }}
          >
            {order.partner_name ?? 'Sin cliente'}
          </button>
        </div>
      </div>

      <div
        // className={`order-container cursor-pointer`}
        className={`order-container cursor-pointer ${
          selectedOrderPg === order.order_id ? 'bg-yellow-400' : ''
        }`}
        onClick={() => setSelectedOrderPg(order.order_id)}
      >
        {order.lines?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            {/*
            <div className="text-6xl mb-4">
              <svg
                fill="#858585"
                height="70px"
                width="70px"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 60.013 60.013"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  {' '}
                  <path d="M11.68,12.506l-0.832-5h-2.99c-0.447-1.72-1.999-3-3.858-3c-2.206,0-4,1.794-4,4s1.794,4,4,4c1.859,0,3.411-1.28,3.858-3 h1.294l0.5,3H9.624l0.222,1.161l0,0.003c0,0,0,0,0,0l2.559,13.374l1.044,5.462h0.001l1.342,7.015 c-2.468,0.186-4.525,2.084-4.768,4.475c-0.142,1.405,0.32,2.812,1.268,3.858c0.949,1.05,2.301,1.652,3.707,1.652h2 c0,3.309,2.691,6,6,6s6-2.691,6-6h11c0,3.309,2.691,6,6,6s6-2.691,6-6h4c0.553,0,1-0.447,1-1s-0.447-1-1-1h-4.35 c-0.826-2.327-3.043-4-5.65-4s-4.824,1.673-5.65,4h-11.7c-0.826-2.327-3.043-4-5.65-4s-4.824,1.673-5.65,4H15 c-0.842,0-1.652-0.362-2.224-0.993c-0.577-0.639-0.848-1.461-0.761-2.316c0.152-1.509,1.546-2.69,3.173-2.69h0.781 c0.02,0,0.038,0,0.06,0l6.128-0.002L33,41.501v-0.001l7.145-0.002L51,41.496v-0.001l4.024-0.001c2.751,0,4.988-2.237,4.988-4.987 V12.494L11.68,12.506z M4,10.506c-1.103,0-2-0.897-2-2s0.897-2,2-2s2,0.897,2,2S5.103,10.506,4,10.506z M46,45.506 c2.206,0,4,1.794,4,4s-1.794,4-4,4s-4-1.794-4-4S43.794,45.506,46,45.506z M23,45.506c2.206,0,4,1.794,4,4s-1.794,4-4,4 s-4-1.794-4-4S20.794,45.506,23,45.506z M58.013,21.506H51v-7.011l7.013-0.002V21.506z M42,39.498v-6.991h7v6.989L42,39.498z M42,30.506v-7h7v7H42z M24,39.503v-6.997h7v6.995L24,39.503z M24,30.506v-7h7v7H24z M13.765,23.506H22v7h-6.895L13.765,23.506z M49,21.506h-7v-7h7V21.506z M40,21.506h-7V14.5l7-0.002V21.506z M31,14.506v7h-7v-7H31z M33,23.506h7v7h-7V23.506z M51,23.506h7v7 h-7V23.506z M22,14.504v7.003h-8.618l-1.34-7L22,14.504z M15.487,32.506H22v6.997l-5.173,0.002L15.487,32.506z M33,32.506h7v6.992 L33,39.5V32.506z M55.024,39.494L51,39.495v-6.989h7.013v4C58.013,38.154,56.672,39.494,55.024,39.494z"></path>{' '}
                </g>
              </svg>
            </div>
            */}
            {/* <p className="text-gray-500">Comience a agregar productos</p> */}
          </div>
        ) : (
          <div>
            <CartTable order={order} />
            {/** {order.lines?.map((item) => (
              <div
                key={item.line_id}
                ref={(el) => (itemRefs.current[item.line_id] = el)}
                // onClick={() => handleDoubleTap(item.line_id)}
              >
                <CartItem
                  item={{
                    ...item,
                    quantity: item.quantity ?? 0,
                    price_unit: item.price_unit ?? 0,
                  }}
                  isSelected={selectedItemPg === item.line_id}
                  onSelect={() => {
                    setOperationPg(Operation.QUANTITY)
                    handleSelectItem(item.line_id)
                    // setSelectedLinePg(selectedOrderPg, item.line_id)
                  }}
                  maxDecimals={MAX_DECIMALS}
                  btnDelete={true}
                  key={item.line_id}
                />
              </div>
            ))} */}
          </div>
        )}
      </div>

      <div className="order-bottom mt-[8px]">
        {/* {order.lines?.length > 0 && ( */}
        {/* <div className="order-summary p-3 border-b bg-gray-50"> */}
        <div className="order-summary px-3 py-[0.2rem] bg-black">
          <div className="flex justify-between font-bold text-[22px]">
            <div className="w-full text-center text-yellow-500">
              {/* S/ {adjustTotal(Number(total)).adjusted.toFixed(2)} */}
              {adjustTotal(Number(total)).adjusted.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/*
      <div className="pads bg-white">
        <div className="subpads pt-[8px]">
          <div className="actionpad">
            <button
              // className="btn btn-primary btn-lg flex-auto touch-lh-l"
              className="btn btn-primary btn-lg flex-auto min-h-[70px]"
              disabled={frmLoading}
              onClick={async () => {
                if (total === 0) {
                  CustomToast({
                    title: 'Error al continuar a pago',
                    description: 'No se puede continuar: el monto debe ser distinto de 0.',
                    type: 'error',
                  })
                  return
                }
                if (order.payment_state === TypeStatePayment.PENDING_PAYMENT) {
                  const nd = buildOrderPayloadNoPayment({
                    orderData: order,
                    selectedOrder: selectedOrderPg,
                    session_id: session_id,
                    userData,
                    finalCustomer: finalCustomerPg,
                    pointId,
                  })
                  await offlineCache.saveOrderOffline({
                    ...nd,
                    action: typeof order.order_id === 'string' ? 'i' : 'u',
                  })
                  const orders = await offlineCache.getOfflinePosOrders()
                  setOrderDataPg(orders)
                  setScreenPg('invoice')
                  return
                }
                setBackToProductsPg(false)
                setIsChange(true)
                setHandleChangePg(true)
                fnc_to_pay()
              }}
            >
              Pago
            </button>
          </div>
        </div>
      </div>
      */}
    </div>
  )
}
