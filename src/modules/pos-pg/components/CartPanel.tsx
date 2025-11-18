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
  console.log('orderabc', order)
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
            <div className="w-full text-center uppercase">
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
              textTransform: 'uppercase',
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
