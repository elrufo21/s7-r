import { useState, useEffect, useRef } from 'react'
import contactsConfig from '../views/contact-index/config'
import CartItem from './CartItem'
import clientConfig from '@/modules/contacts/views/contact-index/config'
import { HiOutlineBackspace } from 'react-icons/hi2'
import useAppStore from '@/store/app/appStore'
import { ModalBase } from '@/shared/components/modals/ModalBase'
import { CustomHeader } from './CustomHeader'
import { FrmBaseDialog } from '@/shared/components/core'
import { ActionTypeEnum } from '@/shared/shared.types'
import noteConfig from '../views/notes/config'
import { Product } from '../types'
import { Operation } from '../types'

import ModalMoreOptions from './modal/components/ModalMoreOptions'
import { useParams } from 'react-router-dom'
import productInfoConfig from '../views/product-info/config'

export default function CartPanel() {
  const {
    openDialog,
    closeDialogWithData,
    executeFnc,
    modalData,
    setModalData,
    setProductPriceInOrder,
    setProductQuantityInOrder,
    toggleProductQuantitySign,
    toggleProductPriceSign,
    orderData,
    deleteProductInOrder,
    getTotalPriceByOrder,
    selectedOrder,
    selectedItem,
    setSelectedItem,
    setScreen,
    screen,
    changeToPaymentLocal,
    finalCustomer,
    setFinalCustomer,
    setHandleChange,
    operation,
    setOperation,
    clearDisplay,
    addDigit,
    setBackToProducts,
    backToProducts,
    defaultPosSessionData,
    setOrderData,
    setSelectedOrder,
  } = useAppStore()
  const { pointId } = useParams()
  const [cart, setCart] = useState<Product[]>([])
  // const [finalCustomer, setFinalCustomer] = useState<any>({})

  const [localPrice, setLocalPrice] = useState<string>('')

  const [total, setTotal] = useState<number | string>()
  const [is_change, setIsChange] = useState(false)

  const finalCustomerRef = useRef(finalCustomer)

  useEffect(() => {
    setOperation(Operation.QUANTITY)
    setDecimalCount(0)
    setIsDecimalMode(false)
    setShouldReplaceValue(false)
    setLocalValue('')
  }, [selectedItem])

  useEffect(() => {
    const pos_Status = orderData?.find((item) => item?.order_id === selectedOrder)?.pos_status
    if (pos_Status === 'P' && backToProducts === false) setScreen('payment')
    setCart(
      orderData
        ?.find((item) => item.order_id === selectedOrder)
        ?.lines?.filter((item: any) => item.action !== ActionTypeEnum.DELETE) || []
    )

    // setLocalValue(cart?.find((item) => item.product_id === selectedItem)?.quantity.toString() || '')
  }, [orderData, selectedOrder])
  useEffect(() => {
    finalCustomerRef.current = finalCustomer
  }, [finalCustomer])

  useEffect(() => {
    setIsChange(true)
  }, [screen, selectedOrder])
  useEffect(() => {
    const currentOrder = orderData.find((item) => item.order_id === selectedOrder)
    const lines = currentOrder?.lines || []
    setSelectedItem(lines[lines.length - 1]?.product_id)
  }, [selectedOrder])
  useEffect(() => {
    setFinalCustomer({
      partner_id:
        orderData.find((item) => item.order_id === selectedOrder)?.partner_id ||
        defaultPosSessionData.partner_id,
      name:
        orderData.find((item) => item.order_id === selectedOrder)?.partner_name ||
        defaultPosSessionData.name,
    })
    if (is_change) {
      if (orderData.find((item) => item.order_id === selectedOrder)?.partner_id) {
        /* setFinalCustomer({
          partner_id: orderData.find((item) => item.order_id === selectedOrder)?.partner_id,
          name: orderData.find((item) => item.order_id === selectedOrder)?.partner_name,
        })*/
      }
      if (orderData?.find((item) => item?.order_id === selectedOrder)?.pos_status === 'Y')
        // setScreen('payment')

        setIsChange(false)
    }
  }, [is_change, orderData, selectedOrder])

  const fetchClients = async () => {
    try {
      const { oj_data } = await executeFnc('fnc_partner', 's', [[1, 'pag', 1]])
      setModalData(oj_data)
    } catch (err) {
      console.error('Error al obtener clientes:', err)
    }
  }
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
              if (finalCustomer) {
                const newData = rs.oj_data.map((item: any) => {
                  if (item.partner_id === finalCustomerRef.current?.partner_id) {
                    return {
                      ...item,
                      selected: true,
                    }
                  }
                  return item
                })
                setModalData(newData)
                closeDialogWithData(dialogId, {})
                return
              }
              /*if (formData.selected === true) {
                const newData = rs.oj_data.map((item: any) => {
                  if (item.partner_id === finalCustomerRef.current?.partner_id) {
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
    setTotal(getTotalPriceByOrder(selectedOrder).toFixed(MAX_DECIMALS))
  }, [cart])

  const [localValue, setLocalValue] = useState('')
  const [shouldReplaceValue, setShouldReplaceValue] = useState(false)
  const [isDecimalMode, setIsDecimalMode] = useState(false)
  const [decimalCount, setDecimalCount] = useState(0)
  const MAX_DECIMALS = 2

  const updateValue = (value: string) => {
    if (!selectedItem) return

    const isPrice = operation === Operation.PRICE
    const setter = isPrice ? setLocalPrice : setLocalValue
    const updateStore = isPrice ? setProductPriceInOrder : setProductQuantityInOrder
    const parser = parseFloat
    setter(value)

    clearDisplay()
    for (const digit of value) {
      addDigit(digit)
    }

    setHandleChange(true)
    updateStore(selectedOrder, selectedItem, parser(value) || 0)
  }

  const handleDecimalClick = () => {
    if (!selectedItem) return
    const isPrice = operation === Operation.PRICE
    const currentValue = isPrice ? localPrice : localValue
    if (currentValue.includes('.')) return

    const newValue = currentValue === '' ? '0.' : currentValue + '.'

    updateValue(newValue)

    setIsDecimalMode(true)
    setDecimalCount(0)
  }
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
            setFinalCustomer(dataUpdate.find((item: any) => item.selected === true))
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
  const fnc_open_contact_modal = () => {
    if (modalData.length === 0) fetchClients()
    const dialogId = openDialog({
      title: 'Elija un cliente',
      contactModal: true,
      dialogContent: () => (
        <ModalBase
          config={contactsConfig}
          onRowClick={(row) => {
            if (row.partner_id === finalCustomer.partner_id) {
              setFinalCustomer({})
              closeDialogWithData(dialogId, row)
              return
            }
            setFinalCustomer(row)
            closeDialogWithData(dialogId, row)
          }}
          contactModal={true}
          openEditModal={(client: any) => {
            fnc_edit_client(client)
          }}
        />
      ),
      customHeader: <CustomHeader fnc_create_button={fnc_create_customer} />,
      buttons: [
        {
          text: 'Descartar',
          type: 'confirm',
          onClick: () => {
            setFinalCustomer({
              partner_id: defaultPosSessionData.partner_id,
              partner_name: defaultPosSessionData.name,
            })
            closeDialogWithData(dialogId, {})
          },
        },
      ],
    })
  }

  const handleCalculatorClick = (number: number) => {
    if (!selectedItem) return

    const isPrice = operation === Operation.PRICE
    const currentValue = isPrice ? localPrice : localValue

    if (shouldReplaceValue) {
      const newValue = number.toString()
      updateValue(newValue)
      setIsDecimalMode(false)
      setDecimalCount(0)
      setShouldReplaceValue(false)
    } else {
      if (isDecimalMode && decimalCount >= MAX_DECIMALS) {
        return
      }

      const newValue = currentValue + number.toString()
      updateValue(newValue)
      if (isDecimalMode) {
        setDecimalCount((prev) => prev + 1)
      }
    }
  }

  const deleteLastDigit = () => {
    if (!selectedItem) return

    const isPrice = operation === Operation.PRICE
    const currentValue = isPrice ? localPrice : localValue
    const setter = isPrice ? setLocalPrice : setLocalValue

    if (currentValue === '0') {
      if (isPrice) {
        setOperation(Operation.QUANTITY)
      } else {
        // Al borrar la cantidad '0', se elimina el producto del carrito.
        // El useEffect que observa los cambios en `cart` se encargará de seleccionar el siguiente item.
        deleteProductInOrder(selectedOrder, selectedItem)
        setHandleChange(true)
      }
      return
    }

    let newValue = currentValue.slice(0, -1)

    if (newValue === '' || newValue === '-') {
      newValue = '0'
    }

    setter(newValue)

    const pointIndex = newValue.indexOf('.')
    if (pointIndex === -1) {
      setIsDecimalMode(false)
      setDecimalCount(0)
    } else {
      setIsDecimalMode(true)
      setDecimalCount(newValue.length - pointIndex - 1)
    }

    updateValue(newValue)
  }

  // Efecto para manejar el scroll cuando se agrega un nuevo producto
  useEffect(() => {
    if (cart.length > 0) {
      const lastItem = cart[cart.length - 1]
      if (lastItem && lastItem.product_id === selectedItem) {
        // Esperar a que el DOM se actualice
        setTimeout(() => {
          if (itemRefs.current[lastItem.product_id]) {
            itemRefs.current[lastItem.product_id]?.scrollIntoView({
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
    if (selectedItem && itemRefs.current[selectedItem]) {
      itemRefs.current[selectedItem]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [selectedItem])

  // Función para manejar la selección de productos
  const handleSelectItem = (productId: string) => {
    if (productId !== selectedItem) {
      setLocalValue('')
      setLocalPrice('')
      setIsDecimalMode(false)
      setDecimalCount(0)
      setSelectedItem(productId)
      setShouldReplaceValue(true)

      const selectedProduct = cart.find((item) => item.product_id === productId)
      if (selectedProduct && selectedProduct.quantity !== undefined) {
        const quantity = selectedProduct.quantity.toString()
        const price = selectedProduct.sale_price.toString()
        setLocalValue(quantity)
        setLocalPrice(price)

        clearDisplay()
        const valueToDisplay = operation === Operation.PRICE ? price : quantity
        for (const digit of valueToDisplay) {
          addDigit(digit)
        }
        setHandleChange(true)
      }
    }
  }
  const handleSymbolsClick = () => {
    if (!selectedItem) return

    const isPrice = operation === Operation.PRICE

    if (isPrice) {
      setHandleChange(true)
      toggleProductPriceSign(selectedOrder, selectedItem)
    } else {
      setHandleChange(true)
      toggleProductQuantitySign(selectedOrder, selectedItem)
    }

    const updatedCart =
      orderData
        ?.find((item) => item.order_id === selectedOrder)
        ?.lines?.filter((item: any) => item.action !== ActionTypeEnum.DELETE) || []

    const updatedProduct = updatedCart.find((item) => item.product_id === selectedItem)

    if (updatedProduct) {
      const newQuantity = updatedProduct.quantity?.toString() || '0'
      const newPrice = updatedProduct.price_unit?.toString() || '0'

      setLocalValue(newQuantity)
      setLocalPrice(newPrice)

      clearDisplay()
      const valueToDisplay = isPrice ? newPrice : newQuantity
      for (const digit of valueToDisplay) {
        addDigit(digit)
      }
    }

    setHandleChange(true)
    setShouldReplaceValue(false)
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
  const fnc_more_info = () => {
    const dialogId = openDialog({
      title: 'Producto',
      dialogContent: () => <FrmBaseDialog config={productInfoConfig} />,
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
    const rs = await executeFnc('fnc_pos_order', 'u', {
      order_id: selectedOrder,
      state: 'C',
    })
    if (rs.oj_data.length > 0) {
      const newOrders = await executeFnc('fnc_pos_order', 's_pos', [
        [0, 'fequal', 'point_id', pointId],
        [
          0,
          'multi_filter_in',
          [
            { key_db: 'state', value: 'I' },
            { key_db: 'state', value: 'Y' },
          ],
        ],
      ])
      setSelectedOrder(newOrders.oj_data[0].order_id)
      setOrderData(newOrders.oj_data)
    }
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
    changeToPaymentLocal(selectedOrder)
    /*  const rs = await executeFnc('fnc_pos_order', 'u', {
      order_id: selectedOrder,
      state: 'Y',
    })
    if (rs.oj_data.length > 0) {
      const newOrders = await executeFnc('fnc_pos_order', 's_pos', [
        [0, 'fequal', 'point_id', pointId],
      ])
      setOrderData(newOrders.oj_data)
    }*/
    //Linea comentada, analizar luego
    //  changeToPayment(selectedOrder)
    setScreen('payment')
  }

  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  return (
    <>
      <div className="order-container">
        {cart?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
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

            <p className="text-gray-500">Comience a agregar productos</p>
          </div>
        ) : (
          <div>
            {cart?.map((item) => (
              <div key={item.product_id} ref={(el) => (itemRefs.current[item.product_id] = el)}>
                <CartItem
                  item={{ ...item, quantity: item.quantity ?? 0 }}
                  isSelected={selectedItem === item.product_id}
                  onSelect={() => {
                    setOperation(Operation.QUANTITY)
                    handleSelectItem(item.product_id)
                  }}
                  maxDecimals={MAX_DECIMALS}
                  btnDelete={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="order-bottom">
        {cart?.length > 0 && (
          // <div className="order-summary p-3 border-b bg-gray-50">
          <div className="order-summary p-3">
            <div className="flex justify-between text-gray-500">
              <span>Impuestos</span>
              <span>S/ 0:00</span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-1">
              <span>Total</span>
              <span>S/ {total}</span>
            </div>
          </div>
        )}
        <div className="pads">
          <div className="control-buttons">
            <button
              className="btn2 btn2-white lh-lg text-truncate w-auto text-action"
              onClick={() => {
                fnc_open_contact_modal()
              }}
            >
              {finalCustomer.name ? finalCustomer.name : defaultPosSessionData.name}
            </button>

            <button className="btn2 btn2-white lh-lg w-auto" onClick={() => fnc_open_note_modal()}>
              Nota
            </button>

            <button
              className="btn2 btn2-white lh-lg text-truncate w-auto ml-auto"
              onClick={() => {
                fnc_open_more_options_modal()
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>

          {cart?.length > 0 && (
            <>
              <div className="subpads">
                <div className="numpad">
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg"
                    onClick={() => handleCalculatorClick(1)}
                  >
                    1
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg"
                    onClick={() => handleCalculatorClick(2)}
                  >
                    2
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg"
                    onClick={() => handleCalculatorClick(3)}
                  >
                    3
                  </button>

                  <button
                    className={`numpad-button btn2 btn2-white fs-3 lh-lg ${operation === Operation.QUANTITY ? 'active' : ''}`}
                    onClick={() => {
                      setOperation(Operation.QUANTITY)
                      if (selectedItem) {
                        setShouldReplaceValue(true)
                        clearDisplay()
                        for (const digit of localValue) {
                          addDigit(digit)
                        }
                      }
                    }}
                  >
                    Cant.
                  </button>

                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg"
                    onClick={() => handleCalculatorClick(4)}
                  >
                    4
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg"
                    onClick={() => handleCalculatorClick(5)}
                  >
                    5
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg"
                    onClick={() => handleCalculatorClick(6)}
                  >
                    6
                  </button>

                  <button
                    className={`numpad-button btn2 btn2-white fs-3 lh-lg ${operation === Operation.DISCOUNT ? 'active' : ''}`}
                    onClick={() => {
                      setOperation(Operation.DISCOUNT)
                      setLocalValue('')
                      setLocalPrice('')
                    }}
                  >
                    %
                  </button>

                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg"
                    onClick={() => handleCalculatorClick(7)}
                  >
                    7
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg"
                    onClick={() => handleCalculatorClick(8)}
                  >
                    8
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg"
                    onClick={() => handleCalculatorClick(9)}
                  >
                    9
                  </button>

                  <button
                    className={`numpad-button btn2 btn2-white fs-3 lh-lg ${operation === Operation.PRICE ? 'active' : ''}`}
                    onClick={() => {
                      setOperation(Operation.PRICE)
                      if (selectedItem) {
                        setShouldReplaceValue(true)
                        clearDisplay()
                        for (const digit of localPrice) {
                          addDigit(digit)
                        }
                      }
                    }}
                  >
                    Precio
                  </button>

                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg o_colorlist_item_numpad_color_3"
                    onClick={() => handleSymbolsClick()}
                  >
                    +/-
                  </button>

                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg"
                    onClick={() => handleCalculatorClick(0)}
                  >
                    0
                  </button>

                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg o_colorlist_item_numpad_color_2"
                    onClick={() => {
                      handleDecimalClick()
                    }}
                  >
                    .
                  </button>

                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg justify-items-center o_colorlist_item_numpad_color_1"
                    onClick={() => deleteLastDigit()}
                  >
                    <HiOutlineBackspace style={{ fontSize: '28px' }} />
                  </button>
                </div>

                <div className="actionpad">
                  <button
                    className="btn2 btn2-primary btn-lg flex-auto min-h-[70px]"
                    onClick={() => {
                      setBackToProducts(false)
                      fnc_to_pay()
                    }}
                  >
                    Pago
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
