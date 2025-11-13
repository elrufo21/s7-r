import { Operation, TypeStateOrder } from '@/modules/pos/types'
import { AppStoreProps, PointsOfSaleSliceStatePg, SetState } from '@/store/store.types'
import { offlineCache, OfflineCache } from '@/lib/offlineCache'
import { getCurrentTimeInLima, now } from '@/shared/utils/dateUtils'
import { ActionTypeEnum } from '@/shared/shared.types'
import { adjustTotal, formatNumber } from '@/shared/helpers/helpers'

const createPosPg = (
  set: SetState<PointsOfSaleSliceStatePg>,
  get: () => AppStoreProps
): PointsOfSaleSliceStatePg => ({
  dateInvoice: getCurrentTimeInLima(),
  setDateInvoice: (dateInvoice) => set({ dateInvoice }),
  //Valores temporales
  temporaryValuesPg: null,
  setTemporaryValuesPg: (temporaryValuesPg) => set({ temporaryValuesPg }),

  _ensureTemporaryValuesPg: () => {
    const { temporaryValuesPg } = get()

    // Si ya existe temporal, retornarlo
    if (temporaryValuesPg) return temporaryValuesPg

    // Crear temporal vacío con estructura básica
    const newTemporary = {
      line_id: crypto.randomUUID(),
      base_quantity: 0,
      quantity: 0,
      price_unit: 0,
      tara_value: 0,
      tara_quantity: 0,
      tara_total: 0,
    }

    set({ temporaryValuesPg: newTemporary })
    return newTemporary
  },
  convertTemporaryToReturnPg: () => {
    set((state) => {
      if (!state.temporaryValuesPg) return state

      return {
        temporaryValuesPg: {
          ...state.temporaryValuesPg,
          base_quantity: Math.abs(state.temporaryValuesPg.base_quantity || 0) * -1,
          quantity: Math.abs(state.temporaryValuesPg.quantity || 0) * -1,
          // price_unit: Math.abs(state.temporaryValuesPg.price_unit || 0) * -1,
        },
      }
    })
  },
  // Establecer cantidad en valores temporales (auto-crea si no existe)
  setTemporaryQuantityPg: (base_quantity: number) => {
    get()._ensureTemporaryValuesPg()

    set((state) => {
      if (!state.temporaryValuesPg) return state

      const effectiveQuantity = get().calculateEffectiveQuantityPg(
        base_quantity,
        state.temporaryValuesPg.tara_value || 0,
        state.temporaryValuesPg.tara_quantity || 0
      )

      return {
        temporaryValuesPg: {
          ...state.temporaryValuesPg,
          base_quantity: formatNumber(base_quantity),
          quantity: formatNumber(effectiveQuantity),
        },
      }
    })
  },

  setTemporaryPricePg: (new_price: number) => {
    get()._ensureTemporaryValuesPg()

    set((state) => {
      if (!state.temporaryValuesPg) return state

      return {
        temporaryValuesPg: {
          ...state.temporaryValuesPg,
          price_unit: new_price,
        },
      }
    })
  },

  setTemporaryTaraValuePg: (tara_value: number) => {
    get()._ensureTemporaryValuesPg()

    set((state) => {
      if (!state.temporaryValuesPg) return state

      const baseQuantity =
        state.temporaryValuesPg.base_quantity || state.temporaryValuesPg.quantity || 0
      const tara_quantity = state.temporaryValuesPg.tara_quantity || 0

      const effectiveQuantity = get().calculateEffectiveQuantityPg(
        baseQuantity,
        tara_value,
        tara_quantity
      )
      const tara_total = get().calculateTaraTotalPg(tara_value, tara_quantity)

      return {
        temporaryValuesPg: {
          ...state.temporaryValuesPg,
          tara_value: tara_value,
          tara_total: tara_total,
          base_quantity: formatNumber(baseQuantity),
          quantity: formatNumber(effectiveQuantity),
        },
      }
    })
  },

  // Establecer cantidad de tara en valores temporales (auto-crea si no existe)
  setTemporaryTaraQuantityPg: (tara_quantity: number) => {
    get()._ensureTemporaryValuesPg()

    set((state) => {
      if (!state.temporaryValuesPg) return state

      const baseQuantity =
        state.temporaryValuesPg.base_quantity || state.temporaryValuesPg.quantity || 0
      const tara_value = state.temporaryValuesPg.tara_value || 0

      const effectiveQuantity = get().calculateEffectiveQuantityPg(
        baseQuantity,
        tara_value,
        tara_quantity
      )

      const tara_total = get().calculateTaraTotalPg(tara_value, tara_quantity)

      return {
        temporaryValuesPg: {
          ...state.temporaryValuesPg,
          tara_quantity: tara_quantity,
          tara_total: tara_total,
          base_quantity: formatNumber(baseQuantity),
          quantity: formatNumber(effectiveQuantity),
        },
      }
    })
  },

  // Asociar producto a valores temporales (merge con datos del producto)
  setTemporaryProductPg: (product: any) => {
    const { temporaryValuesPg } = get()

    // Si no existe temporal, crear uno nuevo con el producto
    if (!temporaryValuesPg) {
      set({
        temporaryValuesPg: {
          ...product,
          line_id: crypto.randomUUID(),
          base_quantity: 0,
          quantity: 0,
          price_unit: product.sale_price || product.price_unit || 0,
          tara_value: 0,
          tara_quantity: 0,
          tara_total: 0,
        },
      })
      return
    }

    // Si cambió el producto, CONSERVAR valores ingresados (cantidad, tara) pero TOMAR precio del producto
    if (temporaryValuesPg.product_id && temporaryValuesPg.product_id !== product.product_id) {
      set({
        temporaryValuesPg: {
          ...product, // Datos del nuevo producto (nombre, unidad, etc.)
          line_id: crypto.randomUUID(), // Nuevo line_id
          // CONSERVAR valores ya ingresados
          base_quantity: temporaryValuesPg.base_quantity || 0,
          quantity: temporaryValuesPg.quantity || 0,
          tara_value: temporaryValuesPg.tara_value || 0,
          tara_quantity: temporaryValuesPg.tara_quantity || 0,
          tara_total: temporaryValuesPg.tara_total || 0,
          // TOMAR precio del nuevo producto
          price_unit: product.sale_price || product.price_unit || 0,
        },
      })
      return
    }

    // Mismo producto o no tenía product_id: hacer merge manteniendo valores
    set((state) => {
      if (!state.temporaryValuesPg) return state

      return {
        temporaryValuesPg: {
          ...product, // Datos del producto
          line_id: state.temporaryValuesPg.line_id, // Mantener line_id temporal
          // CONSERVAR valores ingresados
          base_quantity: state.temporaryValuesPg.base_quantity || 0,
          quantity: state.temporaryValuesPg.quantity || 0,
          tara_value: state.temporaryValuesPg.tara_value || 0,
          tara_quantity: state.temporaryValuesPg.tara_quantity || 0,
          tara_total: state.temporaryValuesPg.tara_total || 0,
          // TOMAR precio del producto
          price_unit: product.sale_price || product.price_unit || 0,
        },
      }
    })
  },

  // Cambiar signo de cantidad en valores temporales
  toggleTemporaryQuantitySignPg: () => {
    set((state) => {
      if (!state.temporaryValuesPg) return state

      const currentQuantity = state.temporaryValuesPg.quantity || 0

      if (currentQuantity === 0) return state

      const newQuantity = currentQuantity * -1
      const newBaseQuantity = (state.temporaryValuesPg.base_quantity || 0) * -1

      return {
        temporaryValuesPg: {
          ...state.temporaryValuesPg,
          quantity: newQuantity,
          base_quantity: newBaseQuantity,
        },
      }
    })
  },

  // Cambiar signo de precio en valores temporales
  toggleTemporaryPriceSignPg: () => {
    set((state) => {
      if (!state.temporaryValuesPg) return state

      const currentPrice = state.temporaryValuesPg.price_unit || 0

      if (currentPrice === 0) return state

      const newPrice = currentPrice * -1

      return {
        temporaryValuesPg: {
          ...state.temporaryValuesPg,
          price_unit: newPrice,
        },
      }
    })
  },

  // Actualizar toda la línea temporal (auto-crea si no existe)
  updateTemporaryLinePg: (updatedLine: any) => {
    get()._ensureTemporaryValuesPg()

    set((state) => {
      if (!state.temporaryValuesPg) return state

      return {
        temporaryValuesPg: {
          ...state.temporaryValuesPg,
          ...updatedLine,
        },
      }
    })
  },

  // Aplicar valores temporales a la orden
  applyTemporaryValuesToPg: (order_id: string) => {
    const { temporaryValuesPg } = get()

    if (!temporaryValuesPg) return

    // Si no tiene product_id, no se puede aplicar
    if (!temporaryValuesPg.product_id) {
      console.warn('No se puede aplicar temporal sin product_id')
      return
    }

    set((state) => {
      const newOrderData = state.orderDataPg.map((order) => {
        if (order.order_id !== order_id) return order

        const existingLine = order?.lines?.find(
          (p: any) => p.product_id === temporaryValuesPg.product_id
        )

        let updatedLines

        if (state.PC_multipleSimilarProductsPg || !existingLine) {
          // Agregar como nueva línea
          updatedLines = [...(order?.lines ?? []), temporaryValuesPg]
        } else {
          // Actualizar línea existente
          if (state.isWeightModePg) {
            updatedLines = order.lines.map((p: any) =>
              p.product_id === temporaryValuesPg.product_id ? { ...p, ...temporaryValuesPg } : p
            )
          } else {
            updatedLines = order.lines.map((p: any) => {
              if (p.product_id === temporaryValuesPg.product_id) {
                const newBaseQuantity =
                  (p.base_quantity || p.quantity || 0) +
                  (temporaryValuesPg.base_quantity || temporaryValuesPg.quantity || 0)

                const effectiveQuantity = get().calculateEffectiveQuantityPg(
                  newBaseQuantity,
                  p.tara_value || 0,
                  p.tara_quantity || 0
                )

                return {
                  ...p,
                  base_quantity: newBaseQuantity,
                  quantity: effectiveQuantity,
                }
              }
              return p
            })
          }
        }

        return {
          ...order,
          lines_change: true,
          lines: updatedLines,
        }
      })

      return {
        orderDataPg: newOrderData.filter((order) => order.state !== 'P'),
        selectedItemPg: temporaryValuesPg.line_id,
        temporaryValuesPg: null, // Limpiar después de aplicar
        handleChangePg: true,
      }
    })
  },

  // Limpiar valores temporales
  clearTemporaryValuesPg: () => {
    set({ temporaryValuesPg: null })
  },

  // Obtener precio total de valores temporales
  getTemporaryTotalPricePg: () => {
    const { temporaryValuesPg } = get()

    if (!temporaryValuesPg) return 0

    const quantity = temporaryValuesPg.quantity || 0
    const price = temporaryValuesPg.price_unit || 0

    return formatNumber(quantity * price)
  },

  // Actualizar múltiples campos en valores temporales
  updateTemporaryValuesPg: (updates: Partial<any>) => {
    get()._ensureTemporaryValuesPg()

    set((state) => {
      if (!state.temporaryValuesPg) return state

      return {
        temporaryValuesPg: {
          ...state.temporaryValuesPg,
          ...updates,
        },
      }
    })
  },

  // Verificar si hay valores temporales activos
  hasTemporaryValuesPg: () => {
    return get().temporaryValuesPg !== null
  },
  //fin de valores temporales
  prevWeight: 0,
  setPrevWeight: (prevWeight) => set({ prevWeight }),
  payment: null,
  setPayment: (payment) => set({ payment }),
  changePricePg: false,
  setChangePricePg: (changePricePg) => set({ changePricePg }),
  closeSession: false,
  setCloseSession: (closeSession) => set({ closeSession }),
  selectedOrderInListPg: 0,
  setSelectedOrderInListPg: (selectedOrderInListPg) => set({ selectedOrderInListPg }),
  point_idPg: null,
  setPointIdPg: (point_idPg) => set({ point_idPg }),
  searchProductPg: '',
  setSearchProductPg: (searchProductPg) => set({ searchProductPg }),
  resetTriggerPg: 0,
  prevItemPg: {},
  setPrevItemPg: (prevItemPg) => set({ prevItemPg }),
  sync_dataPg: false,
  setSyncDataPg: (sync_dataPg) => set({ sync_dataPg }),
  localModePg: true,
  isWeightModePg: false,
  setIsWeightModePg: (isWeightModePg) => set({ isWeightModePg }),
  PC_multipleSimilarProductsPg: true,
  setPC_multipleSimilarProductsPg: (PC_multipleSimilarProductsPg) =>
    set({ PC_multipleSimilarProductsPg }),
  containersPg: [],
  //Bluetooth
  bluetooth_configPg: {
    service_Uuid: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    character_Uuid: '6e400003-b5a3-f393-e0a9-e50e24dcca9e',
    device_name: 'BalanzaESP32',
  },
  devicePg: null,
  setDevicePg: (devicePg) => set({ devicePg }),
  connectedPg: false,
  setConnectedPg: (connectedPg) => set({ connectedPg }),
  weightValuePg: 0,
  setWeightValuePg: (weightValuePg) => set({ weightValuePg }),
  setBluetoothConfigPg: (bluetooth_configPg) => set({ bluetooth_configPg }),
  characteristicPg: null,
  setCharacteristicPg: (c: BluetoothRemoteGATTCharacteristic | null) =>
    set({ characteristicPg: c }),
  updateOrderLinePg: (updatedLine) => {
    set((state) => {
      const newOrderData = state.orderDataPg.map((order) => {
        if (order.order_id !== state.selectedOrderPg) return order

        const updatedLines = order.lines.map((line) =>
          line.line_id === updatedLine.line_id ? { ...line, ...updatedLine } : line
        )

        return {
          ...order,
          lines: updatedLines,
          lines_change: true,
        }
      })

      return { orderDataPg: newOrderData }
    })
  },
  connectToDevicePg: async () => {
    try {
      const dev = await (navigator as any).bluetooth.requestDevice({
        filters: [{ name: get().bluetooth_configPg.device_name }],
        optionalServices: [get().bluetooth_configPg.service_Uuid],
      })
      set({ devicePg: dev })

      const server = await dev.gatt!.connect()
      const service = await server.getPrimaryService(get().bluetooth_configPg.service_Uuid)
      const characteristic = await service.getCharacteristic(
        get().bluetooth_configPg.character_Uuid
      )

      set({ characteristicPg: characteristic })

      characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
        const value = event.target?.value as DataView
        if (value) {
          const weightStr = new TextDecoder('utf-8').decode(value)
          const weight = parseFloat(weightStr)
          if (!isNaN(weight)) {
            set({ weightValuePg: weight })
          }
        }
      })

      await characteristic.startNotifications()
      set({ connectedPg: true })

      dev.addEventListener('gattserverdisconnected', () => set({ connectedPg: false }))
    } catch (err) {
      console.error('❌ Error al conectar:', err)
    }
  },

  disconnectPg: () => {
    const dev = get().devicePg
    if (dev && dev.gatt?.connected) {
      dev.gatt.disconnect()
      set({ connectedPg: false })
    }
  },
  //Final config Bluetooth
  setContainersPg: (containersPg) => set({ containersPg }),
  orderSelectedPg: null,
  setOrderSelectedPg: (orderSelectedPg: { order_id: string; state: string } | null) =>
    set({ orderSelectedPg }),
  defaultPosSessionDataPg: {
    partner_id: 66735,
    name: 'Consumidor final',
    currency_id: 1,
  },
  totalPg: 0,
  setTotalPg: (totalPg) => set({ totalPg }),
  paidOrdersPg: [],
  setPaidOrdersPg: (paidOrdersPg) => set({ paidOrdersPg }),
  paymentMethodsPg: [],
  setPaymentMethodsPg: (paymentMethodsPg) => set({ paymentMethodsPg }),
  setDefaultPosSessionDataPg: (defaultPosSessionDataPg) => set({ defaultPosSessionDataPg }),
  backToProductsPg: false,
  setBackToProductsPg: (backToProductsPg) => set({ backToProductsPg }),
  handleChangePg: false,
  setHandleChangePg: (handleChangePg) => set({ handleChangePg }),
  paymentsPg: [],
  setPaymentsPg: (paymentsPg) => set({ paymentsPg }),
  operationPg: Operation.QUANTITY,
  session_idPg: null,
  setSessionIdPg: (session_idPg) => set({ session_idPg }),
  setOperationPg: (operationPg) => set({ operationPg }),
  screenPg: 'products',
  setScreenPg: (screenPg) => set({ screenPg }),
  customersPg: [],
  setCustomersPg: (customersPg) => set({ customersPg }),
  productsPg: [],
  setProductsPg: (productsPg) => set({ productsPg }),
  cartPg: [],
  setCartPg: (cartPg) => set({ cartPg }),
  orderCartPg: [],
  setOrderCartPg: (orderCartPg) => set({ orderCartPg }),
  selectedOrderPg: '',
  setSelectedOrderPg: (selectedOrderPg) => set({ selectedOrderPg }),
  selectedItemPg: null,
  setSelectedItemPg: (selectedItemPg) => set({ selectedItemPg }),
  orderDataPg: [],
  setOrderDataPg: (orderDataPg) => set({ orderDataPg }),
  finalCustomerPg: {},
  setFinalCustomerPg: (finalCustomerPg) => set({ finalCustomerPg }),
  categoriesPg: [],
  setCategoriesPg: (categoriesPg) => set({ categoriesPg }),
  selectedCategoryPg: '',
  setSelectedCategoryPg: (selectedCategoryPg) => set({ selectedCategoryPg }),
  selectedNavbarMenuPg: 'R',
  setSelectedNavbarMenuPg: (selectedNavbarMenuPg) => set({ selectedNavbarMenuPg }),
  filteredProductsPg: [],
  setFilteredProductsPg: (filteredProductsPg) => set({ filteredProductsPg }),
  displayValuePg: '0',
  setDisplayValuePg: (displayValuePg) => set({ displayValuePg }),
  clearOnNextDigitPg: false,
  setClearOnNextDigitPg: (clearOnNextDigitPg) => set({ clearOnNextDigitPg }),

  getProductPricePg: (product_id, selectedOrder) => {
    const order = get().orderDataPg.find((o) => o.order_id === selectedOrder)
    if (!order) return 0

    const product = order?.lines?.find((p: any) => p?.product_id === product_id)
    if (product) {
      return Number((product.price_unit * product.quantity).toFixed(2)) || 0
    }
    return 0
  },

  addPaymentToOrderPg: (order_id, payment) => {
    set((state) => {
      const newOrderData = state.orderDataPg.map((order) => {
        if (order.order_id !== order_id) return order

        const existingPayments = order.payments || []
        const updatedPayments = [...existingPayments, payment]

        return {
          ...order,
          payments_change: true,
          payments: updatedPayments,
        }
      })

      return { orderDataPg: newOrderData.filter((order) => order.state !== 'P') }
    })
  },

  updatePaymentInOrderPg: (order_id, updatedPayment) => {
    set((state) => {
      const newOrderData = state.orderDataPg.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedPayments = order.payments?.map((p) =>
          p.payment_id === updatedPayment.payment_id ? updatedPayment : p
        )

        return {
          ...order,
          payments: updatedPayments,
        }
      })

      return { orderDataPg: newOrderData.filter((order) => order.state !== 'P') }
    })
  },

  removePaymentFromOrderPg: (order_id, payment_id) => {
    set((state) => {
      const newOrderData = state.orderDataPg.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedPayments = order.payments?.filter((p) => p.payment_id !== payment_id)

        return {
          ...order,
          payments_change: true,
          payments: updatedPayments,
        }
      })

      return { orderDataPg: newOrderData.filter((order) => order.state !== 'P') }
    })
  },

  // Función helper para calcular cantidad efectiva y tara total
  calculateEffectiveQuantityPg: (
    base_quantity: number,
    tara_value: number,
    tara_quantity: number
  ) => {
    return base_quantity - (tara_value || 0) * (tara_quantity || 0)
  },

  calculateTaraTotalPg: (tara_value: number, tara_quantity: number) => {
    return (tara_value || 0) * (tara_quantity || 0)
  },

  setProductQuantityInOrderPg: (order_id, product_id, base_quantity) => {
    set((state) => {
      const newOrderData = state.orderDataPg.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedLines = order.lines.map((p: any) => {
          if (p.line_id === product_id) {
            const effectiveQuantity = get().calculateEffectiveQuantityPg(
              base_quantity,
              p.tara_value || 0,
              p.tara_quantity || 0
            )
            return {
              ...p,
              base_quantity: formatNumber(base_quantity),
              quantity: formatNumber(effectiveQuantity),
            }
          }
          return p
        })

        return {
          ...order,
          lines_change: true,
          lines: updatedLines,
        }
      })

      return { orderDataPg: newOrderData.filter((order) => order.state !== 'P') }
    })
  },

  addProductToOrderPg: (order_id, product, added_quantity) => {
    set((state) => {
      let selectedItem = crypto.randomUUID()

      const newOrderData = state.orderDataPg.map((order) => {
        state.setHandleChangePg(true)
        if (order.order_id !== order_id) return order

        const existingLine = order?.lines?.find((p: any) => p.product_id === product.product_id)
        let updatedLines
        if (state.PC_multipleSimilarProductsPg) {
          updatedLines = [
            ...(order?.lines ?? []),
            {
              ...product,
              base_quantity: 0,
              quantity: added_quantity,
              price_unit: product.sale_price,
              tara_value: 0,
              tara_quantity: 0,
              tara_total: 0,
              line_id: selectedItem,
            },
          ]
        } else {
          if (!existingLine) {
            // Nuevo producto
            const effectiveQuantity = get().calculateEffectiveQuantityPg(
              added_quantity,
              0, // tara_value inicial
              0 // tara_quantity inicial
            )
            updatedLines = [
              ...(order?.lines ?? []),
              {
                ...product,
                base_quantity: added_quantity,
                quantity: effectiveQuantity,
                price_unit: product.sale_price,
                tara_value: 0,
                tara_quantity: 0,
                tara_total: 0,
                line_id: selectedItem,
              },
            ]
          } else {
            // Producto ya existe
            if (get().isWeightModePg) {
              // En modo peso: solo seleccionar, no agregar cantidad
              updatedLines = order.lines
            } else {
              selectedItem = existingLine.line_id

              // En modo normal: agregar cantidad
              updatedLines = order.lines.map((p: any) => {
                if (p.product_id === product.product_id) {
                  const newBaseQuantity = (p.base_quantity || p.quantity || 0) + added_quantity
                  const effectiveQuantity = get().calculateEffectiveQuantityPg(
                    newBaseQuantity,
                    p.tara_value || 0,
                    p.tara_quantity || 0
                  )
                  return {
                    ...p,
                    base_quantity: newBaseQuantity,
                    quantity: effectiveQuantity,
                  }
                }
                return p
              })
            }
          }
        }

        return {
          ...order,
          lines_change: true,
          lines: updatedLines,
        }
      })
      return {
        orderDataPg: newOrderData.filter((order) => order.state !== 'P'),
        selectedItemPg: selectedItem,
      }
    })
  },

  updateOrderPartnerPg: (order_id, partner_id, partner_name) => {
    set((state) => {
      const newOrderData = state.orderDataPg.map((order) => {
        if (order.order_id !== order_id) return order

        return {
          ...order,
          partner_id,
          partner_name,
        }
      })

      return {
        orderDataPg: newOrderData.filter((order) => order.state !== 'P'),
      }
    })
  },

  addNewOrderPg: async () => {
    const offlineCache = new OfflineCache()
    await offlineCache.init()
    const orders = await offlineCache.getOfflinePosOrders()

    const maxSequence =
      orders.length > 0 ? Math.max(...orders.map((order) => order.order_sequence)) : 0
    const newSequence = maxSequence + 1

    const secuence = JSON.parse(localStorage.getItem('secuence') || '[]')

    const formattedSession = String(secuence).padStart(4, '0')
    const formattedSequence = String(newSequence).padStart(4, '0')
    const receiptNumber = `${formattedSession}-${formattedSequence}`

    const newId = crypto.randomUUID()
    const newOrder = {
      order_id: newId,
      order_date: now().toPlainDateTime().toString(),
      name: newId,
      lines: [],
      state: TypeStateOrder.IN_PROGRESS,
      combined_states: TypeStateOrder.IN_PROGRESS,
      position: get().orderDataPg.length + 1,
      partner_id: get().defaultPosSessionDataPg.partner_id,
      partner_name: get().defaultPosSessionDataPg.name,
      order_sequence: newSequence,
      receipt_number: receiptNumber,
      session_id: get().session_idPg,
      point_id: get().point_idPg,
      currency_id: get().defaultPosSessionDataPg.currency_id,
    }

    // Guardar offline
    await offlineCache.saveOrderOffline({ ...newOrder, action: ActionTypeEnum.INSERT })

    // Actualizar el estado
    set((state) => {
      if (state.screenPg !== 'ticket') {
        state.setScreenPg('products')
      }
      state.setHandleChangePg(true)

      return {
        orderDataPg: [...state.orderDataPg, newOrder].filter((order) => order.state !== 'P'),
        selectedOrderPg: newId,
      }
    })
  },

  setProductPriceInOrderPg: (order_id, product_id, new_price) => {
    set((state) => {
      const newOrderData = state.orderDataPg.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedLines = order.lines.map((p: any) =>
          p.line_id === product_id ? { ...p, price_unit: new_price } : p
        )

        return {
          ...order,
          lines_change: true,
          lines: updatedLines,
        }
      })

      return { orderDataPg: newOrderData.filter((order) => order.state !== 'P') }
    })
  },

  toggleProductQuantitySignPg: (order_id, product_id) => {
    set((state) => {
      const newOrderData = state.orderDataPg.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedLines = order.lines.map((p: any) => {
          if (p.line_id === product_id) {
            const currentQuantity = p.quantity || 0
            // No permitir cambiar el signo si la cantidad es 0
            if (currentQuantity === 0) return p

            const newQuantity = currentQuantity * -1
            return { ...p, quantity: newQuantity }
          }
          return p
        })

        return {
          ...order,
          lines_change: true,
          lines: updatedLines,
        }
      })

      return { orderDataPg: newOrderData.filter((order) => order.state !== 'P') }
    })
  },

  toggleProductPriceSignPg: (order_id, product_id) => {
    set((state) => {
      const newOrderData = state.orderDataPg.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedLines = order.lines.map((p: any) => {
          if (p.line_id === product_id) {
            const currentPrice = p.price_unit || 0
            // No permitir cambiar el signo si el precio es 0
            if (currentPrice === 0) return p

            const newPrice = currentPrice * -1
            return { ...p, price_unit: newPrice }
          }
          return p
        })

        return {
          ...order,
          lines_change: true,
          lines: updatedLines,
        }
      })

      return { orderDataPg: newOrderData.filter((order) => order.state !== 'P') }
    })
  },

  getProductQuantityInOrderPg: (order_id, product_id) => {
    const order = get().orderDataPg.find((o) => o.order_id === order_id)
    if (!order) return 0

    const product = order?.lines?.find((p: any) => p.line_id === product_id)

    return product ? product.quantity : 0
  },
  getProductQuantityInProductsPg: (product_id, order_id) => {
    const order = get().orderDataPg.find((o) => o.order_id === order_id)
    const quantity_by_product = order?.lines
      ?.filter((p: any) => p.product_id === product_id)
      .reduce((acc: number, p: any) => acc + p.quantity, 0)
    const { adjusted } = adjustTotal(quantity_by_product)
    return adjusted || 0
  },

  getProductTaraValuePg: (order_id, product_id) => {
    const order = get().orderDataPg.find((o) => o.order_id === order_id)
    if (!order) return 0

    const product = order?.lines?.find((p: any) => p.line_id === product_id)
    return product ? product.tara_value || 0 : 0
  },

  getProductTaraQuantityPg: (order_id, product_id) => {
    const order = get().orderDataPg.find((o) => o.order_id === order_id)
    if (!order) return 0

    const product = order?.lines?.find((p: any) => p.line_id === product_id)
    return product ? product.tara_quantity || 0 : 0
  },

  deleteProductInOrderPg: (order_id, product_id) => {
    set((state) => {
      const newOrderData = state.orderDataPg.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedLines = order.lines.filter((p: any) => p.line_id !== product_id)
        const existingPayments = order.payments || []

        return {
          ...order,
          lines: updatedLines,
          lines_change: true,
          payments: existingPayments,
        }
      })

      const orderAfterDeletion = newOrderData.find((o) => o.order_id === order_id)
      const lastProductId =
        orderAfterDeletion?.lines?.[orderAfterDeletion.lines.length - 1]?.line_id || null

      return {
        orderDataPg: newOrderData.filter((order) => order.state !== 'P'),
        selectedItemPg: lastProductId,
        handleChangePg: true,
      }
    })
  },

  getTotalPriceByOrderPg: (order_id) => {
    const order = get().orderDataPg?.find((o) => o.order_id === order_id)
    if (!order) return 0

    const total = order.lines?.reduce(
      (sum: number, item: any) => sum + item.price_unit * item.quantity,
      0
    )
    return total ? formatNumber(total) : 0
  },
  setSelectedLinePg: (order_id, line_id) => {
    set((state) => {
      const newOrderData = state.orderDataPg.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedLines = order?.lines?.map((p: any) => ({
          ...p,
          selected: p?.line_id === line_id,
        }))

        return {
          ...order,
          lines: updatedLines,
        }
      })
      const selectedOrder = newOrderData.find((order) => order.order_id === order_id)
      let selectedLine = {}
      if (selectedOrder) {
        selectedLine = selectedOrder?.lines?.find((line) => line.line_id === line_id)
      } else {
        selectedLine = {}
      }

      return {
        orderDataPg: newOrderData.filter((order) => order.state !== 'P'),
        selectedItemPg: line_id,
        prevItemPg: selectedLine,
      }
    })
  },

  resetSelectedItemPg: () => {
    set((state) => {
      if (!state.selectedItemPg || !state.prevItemPg) return state

      const newOrderData = state.orderDataPg.map((order) => {
        const updatedLines = order.lines.map((line: any) => {
          if (line.line_id === state.selectedItemPg) {
            return { ...state.prevItemPg }
          }
          return line
        })
        return { ...order, lines: updatedLines, lines_change: true }
      })

      return { orderDataPg: newOrderData, resetTriggerPg: state.resetTriggerPg + 1 }
    })
  },

  deleteOrderPg: (order_id, isCloseSession = false) => {
    set((state) => {
      const remainingOrders = state.orderDataPg
        .filter((order) => order.order_id !== order_id)
        .filter(
          (order) =>
            order.state === TypeStateOrder.IN_PROGRESS || order.state === TypeStateOrder.PAY
        )
      const newSelectedOrder = remainingOrders.length > 0 ? remainingOrders[0].order_id : ''
      if (remainingOrders.length === 0 && !isCloseSession) {
        state.addNewOrderPg()
      }
      return {
        orderDataPg: remainingOrders.filter((order) => order.state !== 'P'),
        selectedOrderPg: newSelectedOrder,
        selectedItemPg: null,
      }
    })
  },

  updateOrderFromServerPg: (updatedOrder) =>
    set((state) => {
      const exists = state.orderDataPg.some((o) => o.order_id === updatedOrder.order_id)
      return {
        orderDataPg: exists
          ? state.orderDataPg
              .map((o) => (o.order_id === updatedOrder.order_id ? updatedOrder : o))
              .filter((order) => order.state !== 'P')
          : [...state.orderDataPg, updatedOrder],
      }
    }),

  changeToPaymentPg: async (order_id) => {
    const { orderDataPg, executeFnc } = get()
    const order = orderDataPg.find((o) => o.order_id === order_id)

    if (!order) return

    const updatedOrder = {
      ...order,
      pos_status: 'P',
    }

    await executeFnc('fnc_pos_order', 'u', updatedOrder)

    set((state) => ({
      orderDataPg: state.orderDataPg
        .map((o) => (o.order_id === order_id ? updatedOrder : o))
        .filter((order) => order.state !== 'P'),
    }))
  },

  changeToPaymentLocalPg: (order_id: number | string) => {
    set((state) => {
      const order = state.orderDataPg.find((o) => o.order_id === order_id)
      if (!order) return state

      const updatedOrder = {
        ...order,
        state: TypeStateOrder.PAY,
        combined_states: TypeStateOrder.PAY,
      }

      return {
        orderDataPg: state.orderDataPg
          .map((o) => (o.order_id === order_id ? updatedOrder : o))
          .filter((order) => order.state !== 'P'),
      }
    })
  },
  updateMoveIdPg: (oldMoveId: string, newMoveId: string) => {
    set((state) => {
      const updatedOrders = state.orderDataPg.map((order) =>
        order.order_id === oldMoveId ? { ...order, order_id: newMoveId } : order
      )

      return {
        orderDataPg: updatedOrders.filter((order) => order.state !== 'P'),
        selectedOrderPg: newMoveId,
      }
    })
  },

  filterProductsPg: () => {
    const { productsPg, searchTerm, selectedCategoryPg } = get()
    let result = [...productsPg]

    if (selectedCategoryPg) {
      result = result.filter((product) => product.category_id === selectedCategoryPg)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(term) || product.size?.toLowerCase().includes(term)
      )
    }

    set({ filteredProductsPg: result })
  },

  addDigitPg: (digit) => {
    const { displayValuePg, clearOnNextDigitPg } = get()
    if (digit === '.' && displayValuePg.includes('.')) return

    if (clearOnNextDigitPg) {
      set({ displayValuePg: digit, clearOnNextDigitPg: false })
    } else {
      set({ displayValuePg: displayValuePg === '0' ? digit : displayValuePg + digit })
    }
  },

  clearDisplayPg: () =>
    set({
      displayValuePg: '0',
      clearOnNextDigitPg: false,
    }),

  fetchProductsPg: async () => {
    const { executeFnc } = get()
    try {
      const { oj_data } = await executeFnc('fnc_product_template', 's', [
        [
          1,
          'fcon',
          ['Disponible en PdV'],
          '2',
          [{ key: '2.1', key_db: 'available_in_pos', value: '1' }],
        ],
        [1, 'pag', 1],
      ])
      set({ productsPg: oj_data, filteredProductsPg: oj_data })
    } catch (err) {
      console.error('Error al obtener productos:', err)
      set({ productsPg: [], filteredProductsPg: [] })
    }
  },

  getOrSetLocalStoragePg: async <T>(key: string, fetchFn: () => Promise<T>): Promise<T> => {
    const offlineCache = new OfflineCache()
    await offlineCache.init()

    try {
      let cachedData: T | null = null

      if (key === 'products') {
        cachedData = (await offlineCache.getOfflineProducts()) as T
      } else if (key === 'categories') {
        cachedData = (await offlineCache.getOfflineCategories()) as T
      } else if (key === 'payment_methods') {
        cachedData = (await offlineCache.getOfflinePaymentMethods()) as T
      } else if (key === 'containers') {
        cachedData = (await offlineCache.getOfflineContainers()) as T
      }

      if (cachedData && Array.isArray(cachedData) && cachedData.length > 0) {
        return cachedData
      }

      const data = await fetchFn()

      if (key === 'products') {
        await offlineCache.cacheProducts(get().executeFnc)
      } else if (key === 'categories') {
        await offlineCache.cacheCategories(get().executeFnc)
      } else if (key === 'payment_methods') {
        await offlineCache.cachePaymentMethods(get().executeFnc)
      } else if (key === 'containers') {
        await offlineCache.cacheContainers(get().executeFnc)
      }

      return data
    } catch (error) {
      console.error(`Error en cache para ${key}:`, error)
      return await fetchFn()
    }
  },

  refreshAllCachePg: async () => {
    const offlineCache = new OfflineCache()
    await offlineCache.init()

    try {
      await offlineCache.refreshCache(get().executeFnc)
    } catch (error) {
      console.error('Error actualizando cache:', error)
    }
  },

  clearPosCachePg: async () => {
    const offlineCache = new OfflineCache()
    await offlineCache.init()
    await offlineCache.clearAll()
  },

  getPosCacheInfoPg: async () => {
    const offlineCache = new OfflineCache()
    await offlineCache.init()

    try {
      const products = await offlineCache.getOfflineProducts()
      const categories = await offlineCache.getOfflineCategories()

      const cacheInfo = {
        products: products.length > 0 ? `${products.length} productos` : 'No cacheados',
        categories: categories.length > 0 ? `${categories.length} categorías` : 'No cacheadas',
        payment_methods: 'No implementado',
        customers: 'No implementado',
      }

      return cacheInfo
    } catch (error) {
      console.error('Error obteniendo info del cache:', error)
      return {
        products: 'Error',
        categories: 'Error',
        payment_methods: 'Error',
        customers: 'Error',
      }
    }
  },

  forceReloadPosDataPg: async (pointId, isOnline = true, session_id) => {
    const id = await offlineCache.syncOfflineData(
      get().executeFnc,
      pointId,
      get().setOrderDataPg,
      get().setSyncLoading,
      session_id,
      false,
      true
    )
  },

  initializePointOfSalePg: async (
    pointId: string,
    isOnline: boolean = true,
    session_id: string | null,
    ensureFourOrders: boolean = false
  ) => {
    if (get().closeSession) return
    const { executeFnc, getOrSetLocalStoragePg } = get()

    try {
      const cache = new OfflineCache()
      await cache.init()

      const offlineOrders = await cache.getOfflinePosOrders()
      await cache.cachePayments(executeFnc, session_id)
      if (!isOnline) {
        return
      }

      // Si hay órdenes offline activas
      if (
        offlineOrders &&
        offlineOrders.filter(
          (o) => o.state === TypeStateOrder.IN_PROGRESS || o.state === TypeStateOrder.PAY
        ).length > 0
      ) {
        const [
          offlineProducts,
          offlineCategories,
          offlinePaymentMethods,
          offlineCustomers,
          offlineContainers,
        ] = await Promise.all([
          cache.getOfflineProducts(),
          cache.getOfflineCategories(),
          cache.getOfflinePaymentMethods(),
          cache.getOfflinePosPoints(),
          cache.getOfflineContainers(),
        ])

        if (ensureFourOrders) {
          const activeOrders = offlineOrders.filter(
            (o: any) => o.state === TypeStateOrder.IN_PROGRESS || o.state === TypeStateOrder.PAY
          )

          const ordersWithPF = activeOrders.filter((o: any) => o.payment_state === 'PF')
          const ordersWithPE = activeOrders.filter((o: any) => o.payment_state === 'PE')
          const secuence = JSON.parse(localStorage.getItem('secuence') || '[]')
          const formattedSession = String(secuence).padStart(4, '0')
          const sessions = JSON.parse(localStorage.getItem('sessions') || '')
          const activeSession = sessions.find((session: any) => session.active)?.session_id

          const maxSequence =
            offlineOrders.length > 0
              ? Math.max(...offlineOrders.map((order: any) => order.order_sequence))
              : 0

          let sequenceCounter = maxSequence + 1

          // ==== PF CREATION WITH position_pg ====
          const existingPFPositions = ordersWithPF.map((o: any) => o.position_pg)
          const availablePFPositions = [1, 2].filter((pos) => !existingPFPositions.includes(pos))

          const missingPF = Math.max(0, 2 - ordersWithPF.length)
          const { state } = JSON.parse(localStorage.getItem('session-store') ?? '{}')
          const { userData } = state
          for (let i = 0; i < missingPF; i++) {
            const orderId = crypto.randomUUID()
            const formattedSequence = String(sequenceCounter).padStart(4, '0')
            const receiptNumber = `${formattedSession}-${formattedSequence}`

            const newOrder = {
              order_id: orderId,
              name: orderId,
              lines: [],
              state: TypeStateOrder.IN_PROGRESS,
              payment_state: 'PF',
              payments: [],
              position_pg: availablePFPositions[i] || 1, // asigna 1 o 2 según lo disponible
              order_sequence: sequenceCounter,
              receipt_number: receiptNumber,
              order_date: now().toPlainDateTime().toString(),
              partner_id: null,
              partner_name: 'Sin cliente',
              combined_states: TypeStateOrder.IN_PROGRESS,
              point_id: pointId,
              session_id: activeSession,
              currency_id: get().defaultPosSessionDataPg.currency_id,
              invoice_state: 'T',
              amount_total: 0,
              amount_with_tax: 0,
              amount_untaxed: 0,
              amount_adjustment: 0,
              company_id: userData.company_id,
            }

            offlineOrders.push(newOrder)
            await cache.saveOrderOffline({ ...newOrder, action: ActionTypeEnum.INSERT })
            sequenceCounter++
          }

          // ==== PE CREATION WITH position_pg ====
          const existingPEPositions = ordersWithPE.map((o: any) => o.position_pg)
          const availablePEPositions = [1, 2].filter((pos) => !existingPEPositions.includes(pos))

          const missingPE = Math.max(0, 2 - ordersWithPE.length)

          for (let i = 0; i < missingPE; i++) {
            const orderId = crypto.randomUUID()
            const formattedSequence = String(sequenceCounter).padStart(4, '0')
            const receiptNumber = `${formattedSession}-${formattedSequence}`

            const newOrder = {
              order_id: orderId,
              name: orderId,
              lines: [],
              state: TypeStateOrder.IN_PROGRESS,
              payment_state: 'PE',
              payments: [],
              position_pg: availablePEPositions[i] || 1, // asigna 1 o 2 según lo disponible
              order_sequence: sequenceCounter,
              receipt_number: receiptNumber,
              order_date: now().toPlainDateTime().toString(),
              partner_id: null,
              partner_name: 'Sin cliente',
              combined_states: TypeStateOrder.IN_PROGRESS,
              point_id: pointId,
              session_id: activeSession,
              currency_id: get().defaultPosSessionDataPg.currency_id,
              invoice_state: 'T',
              amount_total: 0,
              amount_with_tax: 0,
              amount_untaxed: 0,
              amount_adjustment: 0,
              company_id: userData.company_id,
            }

            offlineOrders.push(newOrder)
            await cache.saveOrderOffline({ ...newOrder, action: ActionTypeEnum.INSERT })
            sequenceCounter++
          }
        }

        set({
          orderDataPg: offlineOrders.filter((o: any) => o.state !== TypeStateOrder.PAID),
          productsPg: offlineProducts,
          filteredProductsPg: offlineProducts,
          categoriesPg: offlineCategories,
          customersPg: offlineCustomers,
          selectedOrderPg: offlineOrders.filter((o) => o.state === 'I' || o.state === 'Y')[0]
            .order_id,
          paymentMethodsPg: offlinePaymentMethods,
          containersPg: offlineContainers || [],
        })

        return
      }

      const today = new Date()
      const formattedDate = today.toLocaleDateString('es-PE')
      // Código para cuando se obtienen órdenes del servidor
      const ordersRes = await executeFnc('fnc_pos_order', 's_pos', [
        // [0, 'fequal', 'point_id', pointId],
        [0, 'fequal', 'session_id', session_id],
        [
          '0',
          'multi_filter_in',
          [
            { key_db: 'state', value: 'I' },
            { key_db: 'state', value: 'Y' },
          ],
        ],
        //    [0, 'fbetween', 'order_date', formattedDate, formattedDate],
      ])

      if (ordersRes?.oj_data?.length) {
        for (const order of ordersRes.oj_data) {
          await cache.saveOrderOffline(order)
        }
      }

      const [products, categories, paymentMethods, customers, containers] = await Promise.all([
        getOrSetLocalStoragePg('products', () =>
          executeFnc('fnc_product_template', 's', [
            [
              1,
              'fcon',
              ['Disponible en PdV'],
              '2',
              [{ key: '2.1', key_db: 'available_in_pos', value: '1' }],
            ],
            [1, 'pag', 1],
          ]).then((res) => res.oj_data || [])
        ),
        getOrSetLocalStoragePg('categories', () =>
          executeFnc('fnc_product_template_pos_category', 's3', [[1, 'pag', 1]]).then(
            (res) => res.oj_data || []
          )
        ),
        getOrSetLocalStoragePg('payment_methods', () =>
          executeFnc('fnc_pos_payment_method', 's', []).then((res) => res.oj_data || [])
        ),
        getOrSetLocalStoragePg('customers', () =>
          executeFnc('fnc_partner', 's', [[1, 'pag', 1]]).then((res) => res.oj_data || [])
        ),
        getOrSetLocalStoragePg('containers', () =>
          executeFnc('fnc_pos_container', 's', [[1, 'pag', 1]]).then((res) => res.oj_data || [])
        ),
      ])

      let initialOrders = ordersRes?.oj_data || []

      if (ensureFourOrders) {
        // Filtrar solo órdenes activas (I o Y) del servidor
        const activeOrdersFromServer = initialOrders.filter(
          (o: any) => o.state === TypeStateOrder.IN_PROGRESS || o.state === TypeStateOrder.PAY
        )

        // 🚫 Si ya existen órdenes activas desde backend, NO crear nuevas
        if (activeOrdersFromServer.length === 0) {
          const activeOrders = initialOrders.filter((o: any) => o.state === 'I' || o.state === 'Y')
          const ordersWithPF = activeOrders.filter((o: any) => o.payment_state === 'PF')
          const ordersWithPE = activeOrders.filter((o: any) => o.payment_state === 'PE')

          const secuence = JSON.parse(localStorage.getItem('secuence') || '[]')
          const formattedSession = String(secuence).padStart(4, '0')
          const sessions = JSON.parse(localStorage.getItem('sessions') || '')
          const activeSession = sessions.find((session: any) => session.active)?.session_id

          const maxSequence =
            initialOrders.length > 0
              ? Math.max(...initialOrders.map((order: any) => order.order_sequence))
              : 0

          let sequenceCounter = maxSequence + 1

          // ==== PF CREATION WITH position_pg ====
          const existingPFPositions = ordersWithPF.map((o: any) => o.position_pg)
          const availablePFPositions = [1, 2].filter((pos) => !existingPFPositions.includes(pos))

          const missingPF = Math.max(0, 2 - ordersWithPF.length)
          const { state } = JSON.parse(localStorage.getItem('session-store') ?? '{}')
          const { userData } = state
          for (let i = 0; i < missingPF; i++) {
            const orderId = crypto.randomUUID()
            const formattedSequence = String(sequenceCounter).padStart(4, '0')
            const receiptNumber = `${formattedSession}-${formattedSequence}`

            const newOrder = {
              order_id: orderId,
              name: orderId,
              lines: [],
              state: TypeStateOrder.IN_PROGRESS,
              payment_state: 'PF',
              payments: [],
              position_pg: availablePFPositions[i] || 1,
              order_sequence: sequenceCounter,
              receipt_number: receiptNumber,
              order_date: now().toPlainDateTime().toString(),
              partner_id: null,
              partner_name: 'Sin cliente',
              combined_states: TypeStateOrder.IN_PROGRESS,
              point_id: pointId,
              session_id: activeSession,
              currency_id: get().defaultPosSessionDataPg.currency_id,
              invoice_state: 'T',
              amount_total: 0,
              amount_with_tax: 0,
              amount_untaxed: 0,
              amount_adjustment: 0,
              company_id: userData.company_id,
            }

            initialOrders.push(newOrder)
            await cache.saveOrderOffline({ ...newOrder, action: ActionTypeEnum.INSERT })
            sequenceCounter++
          }

          // ==== PE CREATION WITH position_pg ====
          const existingPEPositions = ordersWithPE.map((o: any) => o.position_pg)
          const availablePEPositions = [1, 2].filter((pos) => !existingPEPositions.includes(pos))

          const missingPE = Math.max(0, 2 - ordersWithPE.length)
          for (let i = 0; i < missingPE; i++) {
            const orderId = crypto.randomUUID()
            const formattedSequence = String(sequenceCounter).padStart(4, '0')
            const receiptNumber = `${formattedSession}-${formattedSequence}`

            const newOrder = {
              order_id: orderId,
              name: orderId,
              lines: [],
              state: TypeStateOrder.IN_PROGRESS,
              payment_state: 'PE',
              payments: [],
              position_pg: availablePEPositions[i] || 1,
              order_sequence: sequenceCounter,
              receipt_number: receiptNumber,
              order_date: now().toPlainDateTime().toString(),
              partner_id: null,
              partner_name: 'Sin cliente',
              combined_states: TypeStateOrder.IN_PROGRESS,
              point_id: pointId,
              session_id: activeSession,
              currency_id: get().defaultPosSessionDataPg.currency_id,
              invoice_state: 'T',
              amount_total: 0,
              amount_with_tax: 0,
              amount_untaxed: 0,
              amount_adjustment: 0,
              company_id: userData.company_id,
            }

            initialOrders.push(newOrder)
            await cache.saveOrderOffline({ ...newOrder, action: ActionTypeEnum.INSERT })
            sequenceCounter++
          }
        }
      } else if (
        initialOrders.filter((o: any) => o.state === 'I' || o.state === 'Y').length === 0
      ) {
        // Solo crear una orden si NO hay ninguna orden activa
        const secuence = JSON.parse(localStorage.getItem('secuence') || '[]')
        const firstOrderId = crypto.randomUUID()
        const firstSequence = 1
        const formattedSession = String(secuence).padStart(4, '0')
        const formattedSequence = String(firstSequence).padStart(4, '0')
        const firstReceiptNumber = `${formattedSession}-${formattedSequence}`
        const sessions = JSON.parse(localStorage.getItem('sessions') || '')
        const activeSession = sessions.find((session: any) => session.active).session_id
        const { state } = JSON.parse(localStorage.getItem('session-store') ?? '{}')
        const { userData } = state
        initialOrders = [
          {
            order_id: firstOrderId,
            name: firstOrderId,
            lines: [],
            state: TypeStateOrder.IN_PROGRESS,
            payments: [],
            position_pg: 1,
            order_sequence: firstSequence,
            receipt_number: firstReceiptNumber,
            order_date: now().toPlainDateTime().toString(),
            partner_id: null,
            partner_name: 'Sin cliente',
            combined_states: TypeStateOrder.IN_PROGRESS,
            point_id: pointId,
            session_id: activeSession,
            currency_id: get().defaultPosSessionDataPg.currency_id,
            invoice_state: 'T',
            amount_total: 0,
            amount_with_tax: 0,
            amount_untaxed: 0,
            amount_adjustment: 0,
            company_id: userData.company_id,
          },
        ]

        await cache.saveOrderOffline({ ...initialOrders[0], action: ActionTypeEnum.INSERT })
      }

      // Filtrar órdenes activas para seleccionar la primera
      const activeOrdersToSet = initialOrders.filter((o: any) => o.state === 'I' || o.state === 'Y')

      set({
        orderDataPg: initialOrders.filter((o: any) => o.state !== TypeStateOrder.PAID),
        productsPg: products,
        filteredProductsPg: products,
        categoriesPg: categories,
        customersPg: customers,
        selectedOrderPg: activeOrdersToSet.length > 0 ? activeOrdersToSet[0].order_id : '',
        paymentMethodsPg: paymentMethods,
        containersPg: containers,
      })
    } catch (error) {
      console.error('Error al inicializar el punto de venta:', error)
      set({
        orderDataPg: [],
        productsPg: [],
        filteredProductsPg: [],
        categoriesPg: [],
        customersPg: [],
        paymentMethodsPg: [],
        containersPg: [],
      })
    }
  },

  setTaraValuePg: (order_id, product_id, tara_value) => {
    set((state) => {
      const newOrderData = state.orderDataPg.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedLines = order.lines.map((p: any) => {
          if (p.line_id === product_id) {
            const baseQuantity = p.base_quantity || p.quantity || 0
            const tara_quantity = p.tara_quantity || 0
            const effectiveQuantity = get().calculateEffectiveQuantityPg(
              baseQuantity,
              tara_value,
              tara_quantity
            )
            const tara_total = get().calculateTaraTotalPg(tara_value, tara_quantity)
            return {
              ...p,
              tara_value: tara_value,
              tara_total: tara_total,
              base_quantity: formatNumber(baseQuantity),
              quantity: formatNumber(effectiveQuantity),
            }
          }
          return p
        })

        return { ...order, lines_change: true, lines: updatedLines }
      })

      return { orderDataPg: newOrderData.filter((order) => order.state !== 'P') }
    })
  },

  setTaraQuantityPg: (order_id, product_id, tara_quantity) => {
    set((state) => {
      const newOrderData = state.orderDataPg.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedLines = order.lines.map((p: any) => {
          if (p.line_id === product_id) {
            const baseQuantity = p.base_quantity || p.quantity || 0
            const tara_value = p.tara_value || 0
            const effectiveQuantity = get().calculateEffectiveQuantityPg(
              baseQuantity,
              tara_value,
              tara_quantity
            )
            const tara_total = get().calculateTaraTotalPg(tara_value, tara_quantity)
            return {
              ...p,
              tara_quantity: tara_quantity,
              tara_total: tara_total,
              base_quantity: formatNumber(baseQuantity),
              quantity: formatNumber(effectiveQuantity),
            }
          }
          return p
        })

        return { ...order, lines_change: true, lines: updatedLines }
      })
      return { orderDataPg: newOrderData.filter((order) => order.state !== 'P') }
    })
  },
  ensureFourOrdersPg: async () => {
    if (get().closeSession) return

    const cache = new OfflineCache()
    await cache.init()

    const allOrders = await cache.getOfflinePosOrders()
    const activeOrders = allOrders.filter(
      (o: any) => o.state === TypeStateOrder.IN_PROGRESS || o.state === TypeStateOrder.PAY
    )

    const ordersWithPF = activeOrders.filter((o: any) => o.payment_state === 'PF')
    const ordersWithPE = activeOrders.filter((o: any) => o.payment_state === 'PE')

    const secuence = JSON.parse(localStorage.getItem('secuence') || '[]')
    const formattedSession = String(secuence).padStart(4, '0')
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]')
    const activeSession = sessions.find((session: any) => session.active)?.session_id

    const maxSequence =
      allOrders.length > 0
        ? Math.max(...allOrders.map((order: any) => order.order_sequence || 0))
        : 0

    let sequenceCounter = maxSequence + 1
    const newOrders: any[] = []

    // ==== PF CREATION WITH position_pg (Venta público) ====
    const existingPFPositions = ordersWithPF.map((o: any) => o.position_pg)
    const availablePFPositions = [1, 2].filter((pos) => !existingPFPositions.includes(pos))

    const missingPF = Math.max(0, 2 - ordersWithPF.length)
    const { state } = JSON.parse(localStorage.getItem('session-store') ?? '{}')
    const { userData } = state
    for (let i = 0; i < missingPF; i++) {
      const orderId = crypto.randomUUID()
      const formattedSequence = String(sequenceCounter).padStart(4, '0')
      const receiptNumber = `${formattedSession}-${formattedSequence}`

      const assignedPositionPg = availablePFPositions[i] ?? availablePFPositions[0] ?? 1

      const newOrder = {
        order_id: orderId,
        name: orderId,
        lines: [],
        state: TypeStateOrder.IN_PROGRESS,
        payment_state: 'PF',
        payments: [],
        position_pg: assignedPositionPg,
        order_sequence: sequenceCounter,
        receipt_number: receiptNumber,
        order_date: now().toPlainDateTime().toString(),
        partner_id: null,
        partner_name: 'Sin cliente',
        combined_states: TypeStateOrder.IN_PROGRESS,
        point_id: get().point_idPg,
        session_id: activeSession || get().session_idPg,
        currency_id: get().defaultPosSessionDataPg.currency_id,
        invoice_state: 'T',
        amount_total: 0,
        amount_with_tax: 0,
        amount_untaxed: 0,
        amount_adjustment: 0,
        company_id: userData.company_id,
      }

      newOrders.push(newOrder)
      await cache.saveOrderOffline({ ...newOrder, action: ActionTypeEnum.INSERT })
      sequenceCounter++
    }

    // ==== PE CREATION WITH position_pg (Crédito) ====
    const existingPEPositions = ordersWithPE.map((o: any) => o.position_pg)
    const availablePEPositions = [1, 2].filter((pos) => !existingPEPositions.includes(pos))

    const missingPE = Math.max(0, 2 - ordersWithPE.length)
    for (let i = 0; i < missingPE; i++) {
      const orderId = crypto.randomUUID()
      const formattedSequence = String(sequenceCounter).padStart(4, '0')
      const receiptNumber = `${formattedSession}-${formattedSequence}`

      const assignedPositionPg = availablePEPositions[i] ?? availablePEPositions[0] ?? 1

      const newOrder = {
        order_id: orderId,
        name: orderId,
        lines: [],
        state: TypeStateOrder.IN_PROGRESS,
        payment_state: 'PE',
        payments: [],
        position_pg: assignedPositionPg,
        order_sequence: sequenceCounter,
        receipt_number: receiptNumber,
        order_date: now().toPlainDateTime().toString(),
        partner_id: null,
        partner_name: 'Sin cliente',
        combined_states: TypeStateOrder.IN_PROGRESS,
        point_id: get().point_idPg,
        session_id: activeSession || get().session_idPg,
        currency_id: get().defaultPosSessionDataPg.currency_id,
        invoice_state: 'T',
        amount_total: 0,
        amount_with_tax: 0,
        amount_untaxed: 0,
        amount_adjustment: 0,
      }

      newOrders.push(newOrder)
      await cache.saveOrderOffline({ ...newOrder, action: ActionTypeEnum.INSERT })
      sequenceCounter++
    }

    if (newOrders.length > 0) {
      const updatedOrders = await cache.getOfflinePosOrders()
      set({
        orderDataPg: updatedOrders.filter((o: any) => o.state !== TypeStateOrder.PAID),
      })
    }
  },

  getSortedActiveOrdersPg: () => {
    if (get().closeSession) return

    const orders = get().orderDataPg.filter(
      (o) => o.state === TypeStateOrder.IN_PROGRESS || o.state === TypeStateOrder.PAY
    )

    const pfPos1 = orders
      .filter((o) => o.payment_state === 'PF' && o.position_pg === 1)
      .sort((a, b) => (a.order_sequence || 0) - (b.order_sequence || 0))
      .slice(0, 1)

    const pfPos2 = orders
      .filter((o) => o.payment_state === 'PF' && o.position_pg === 2)
      .sort((a, b) => (a.order_sequence || 0) - (b.order_sequence || 0))
      .slice(0, 1)

    const pePos1 = orders
      .filter((o) => o.payment_state === 'PE' && o.position_pg === 1)
      .sort((a, b) => (a.order_sequence || 0) - (b.order_sequence || 0))
      .slice(0, 1)

    const pePos2 = orders
      .filter((o) => o.payment_state === 'PE' && o.position_pg === 2)
      .sort((a, b) => (a.order_sequence || 0) - (b.order_sequence || 0))
      .slice(0, 1)

    return [...pfPos1, ...pfPos2, ...pePos1, ...pePos2]
  },

  completedOrderPg: null,
  setCompletedOrderPg: (completedOrderPg: any) => set({ completedOrderPg }),

  markOrderAsCompletedPg: async (order_id: string | number) => {
    const cache = new OfflineCache()
    await cache.init()

    const order = get().orderDataPg.find((o) => o.order_id === order_id)

    if (order) {
      set({ completedOrderPg: { ...order } })

      const updatedOrder = {
        ...order,
        state: TypeStateOrder.PAID,
        combined_states: TypeStateOrder.PAID,
      }

      await cache.saveOrderOffline({
        ...updatedOrder,
        action: typeof order.order_id === 'string' ? ActionTypeEnum.INSERT : ActionTypeEnum.UPDATE,
      })

      set((state) => ({
        orderDataPg: state.orderDataPg
          .map((o) => (o.order_id === order_id ? updatedOrder : o))
          .filter((o) => o.state !== TypeStateOrder.PAID),
      }))

      await get().ensureFourOrdersPg()
    }
  },
})

export default createPosPg
