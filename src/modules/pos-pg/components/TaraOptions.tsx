import useAppStore from '@/store/app/appStore'
import { Divider } from '@mui/material'
import { useEffect, useState } from 'react'
import { Operation } from '../context/CalculatorContext'
import CalculatorPanel from './modal/components/ModalCalculatorPanel'
import { offlineCache, Product } from '@/lib/offlineCache'
import { ActionTypeEnum, ViewTypeEnum } from '@/shared/shared.types'
import { FrmBaseDialog } from '@/shared/components/core'
import PaymentsModal from '../../pos-pg/views/modal-payment/config'
import { CustomToast } from '@/components/toast/CustomToast'
import { usePosActionsPg } from '@/modules/pos/hooks/usePosActionsPg'
import { Type_pos_payment_origin, TypePayment } from '../types'
import { now } from '@/shared/utils/dateUtils'
import PosModalPaymentListConfig from '../views/modal-payment-list/config'
import { usePWA } from '@/hooks/usePWA'
import { codePayment } from '@/shared/helpers/helpers'

const TaraOptions = () => {
  const {
    setTaraValuePg,
    setTaraQuantityPg,
    selectedItemPg,
    selectedOrderPg,
    setProductQuantityInOrderPg,
    getProductTaraValuePg,
    getProductTaraQuantityPg,
    setOperationPg,
    operationPg,
    getProductPricePg,
    weightValuePg,
    resetSelectedItemPg,
    setHandleChangePg,
    connectedPg,
    connectToDevicePg,
    orderDataPg,
    backToProductsPg,
    setScreenPg,
    openDialog,
    closeDialogWithData,
    getTotalPriceByOrderPg,
    setBackToProductsPg,
    changeToPaymentLocalPg,
    executeFnc,
    getProductQuantityInOrderPg,
    session_idPg,
    setPayment,
    setPrevWeight,
    setChangePricePg,
  } = useAppStore()
  const { isOnline } = usePWA()
  const { saveCurrentOrder } = usePosActionsPg()
  const [cart, setCart] = useState<Product[]>([])
  const { state } = JSON.parse(localStorage.getItem('session-store') ?? '{}')
  const { userData } = state
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
    setScreenPg('payment')
    saveCurrentOrder(true, true)
  }
  useEffect(() => {
    const pos_Status = orderDataPg?.find((item) => item?.order_id === selectedOrderPg)?.pos_status
    if (pos_Status === 'P' && backToProductsPg === false) setScreenPg('payment')

    setCart(
      orderDataPg
        ?.find((item) => item.order_id === selectedOrderPg)
        ?.lines?.filter((item: any) => item.action !== ActionTypeEnum.DELETE) || []
    )
  }, [orderDataPg, selectedOrderPg])

  useEffect(() => {
    setOperationPg(Operation.QUANTITY)

    if (selectedItemPg && selectedOrderPg) {
      const currentTaraQuantity = getProductTaraQuantityPg(selectedOrderPg, selectedItemPg)
      const currentTaraValue = getProductTaraValuePg(selectedOrderPg, selectedItemPg)

      if (currentTaraValue > 0 && currentTaraQuantity === 0) {
        setTaraQuantityPg(selectedOrderPg, selectedItemPg, 1)
      }
    }
  }, [selectedItemPg])

  const handleTaraSelect = (weight: number) => {
    setTaraValuePg(selectedOrderPg, selectedItemPg || 0, weight)

    const currentTaraQuantity = getProductTaraQuantityPg(selectedOrderPg, selectedItemPg || 0)
    if (currentTaraQuantity === 0) {
      setTaraQuantityPg(selectedOrderPg, selectedItemPg || 0, 1)
    }
  }
  const resetItem = () => {
    resetSelectedItemPg()
    setHandleChangePg(true)
  }

  const openCalculatorModal = ({ operation }: { operation: Operation }) => {
    const dialogId = openDialog({
      title: cart.find((c) => c.line_id === selectedItemPg)?.name,
      dialogContent: () => (
        <CalculatorPanel
          product={cart.find((c) => c.line_id === selectedItemPg)}
          selectedField={operation}
          dialogId={dialogId}
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
  const openPaymentsModal = async () => {
    const paymentMethods = await offlineCache.getOfflinePaymentMethods()
    const localCustomers = await offlineCache.getOfflineContacts()
    let getData = () => ({})
    const dialogId = openDialog({
      title: 'PAGOS',
      /** const sampleData = {
    name: 'OKAMI',
    order_date: new Date('2025-10-29'),
    receipt_number: 'PG-291020251016640',
    point_id: '1',
    payments: [{ payment_method_name: 'TRANSFERENCIA', amount: 2295.4 }],
    amount_total: 2295.4,
    amount_residual: 0,
  } */
      dialogContent: () => (
        <FrmBaseDialog
          initialValues={{
            paymentMethods: paymentMethods,
            type: TypePayment.INPUT,
            origin: Type_pos_payment_origin.PAY_DEBT,
            customers: localCustomers,
            dialogId: dialogId,
            partner_id: null,
          }}
          viewType={ViewTypeEnum.LIBRE}
          config={PaymentsModal}
          setGetData={(fn: any) => (getData = fn)}
        />
      ),
      buttons: [
        {
          text: 'Guardar',
          type: 'confirm',
          onClick: async () => {
            const formData = getData()
            const data = {
              amount: formData.amount,
              partner_id: formData.partner_id,
              reason: formData.reason,
              type: TypePayment.INPUT,
              payment_method_id: formData.payment_method_id,
              date: now().toPlainDateTime().toString(),
              origin: Type_pos_payment_origin.PAY_DEBT,
              currency_id: 1,
              state: 'R',
              company_id: userData?.company_id,
              user_id: userData?.user_id,
              session_id: session_idPg,
            }
            let errors = []
            if (!data.amount) {
              errors.push({ message: 'El campo importe es requerido' })
            }
            if (!data.reason) errors.push({ message: 'El campo motivo es requerido' })
            if (!data.payment_method_id) errors.push({ message: 'Seleccione un metodo de pago' })
            if (!data.partner_id) errors.push({ message: 'Seleccione un cliente' })
            if (errors.length > 0) {
              CustomToast({
                title: 'Errores encontrados',
                items: errors,
                type: 'error',
              })
              return
            }
            setPayment({
              name: formData.partner_name || null,
              order_date: now().toPlainDateTime().toString(),
              receipt_number: codePayment(),
              point_id: formData.point_id,
              payments: [
                { payment_method_name: formData.payment_method_name, amount: formData.amount },
              ],
              amount_total: formData.amount,
              amount_residual: '',
              type: TypePayment.INPUT,
              origin: Type_pos_payment_origin.PAY_DEBT,
            })
            if (!isOnline) {
              await offlineCache.saveOfflinePayment(data)
            } else {
              const { oj_data } = await executeFnc('fnc_pos_payment', 'i', data)
            }
            CustomToast({
              title: 'Exito',
              description: `¡Se creo el pago de S/ ${data.amount} correctamente!`,
              type: 'success',
            })
            setScreenPg('invoice')
            closeDialogWithData(dialogId, null)
          },
        },
        {
          type: 'cancel',
          text: 'Cerrar',
          onClick: () => {
            closeDialogWithData(dialogId, {})
          },
        },
        {
          text: 'Lista de pagos',
          type: 'cancel',
          onClick: () => {
            handlePaymentsList()
          },
        },
      ],
    })
  }
  const handlePaymentsList = async () => {
    const dialogId = openDialog({
      title: 'Lista de pagos',
      dialogContent: () => (
        <FrmBaseDialog
          config={PosModalPaymentListConfig}
          viewType={ViewTypeEnum.LIBRE}
          initialValues={{ typeForm: 'pg_payments_list', session_id: session_idPg }}
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
  return (
    <div className="d-flex gap-3 py-2 w-100 align-items-start flex-wrap">
      {!connectedPg && (
        <div className="w-100 ">
          <button
            className="btn fw-semibold rounded-3 shadow-sm d-flex align-items-center justify-content-center text-white w-100"
            style={{
              backgroundColor: connectedPg ? '#059669' : '#D63515',
              borderColor: connectedPg ? '#059669' : '#D63515',
              height: '80px',
              fontSize: '13px',
            }}
            onClick={() => connectToDevicePg()}
            disabled={connectedPg}
          >
            <span>{connectedPg ? 'CONECTADO' : 'CONECTAR BALANZA'}</span>
          </button>
        </div>
      )}
      <div className="flex-fill max-w-[400px]">
        {/*
        <div className="d-flex gap-2 align-items-center numpad">
        </div>
        */}

        {/* <div className="d-flex gap-2 align-items-center numpad"> */}
        <div className="grid grid-cols-2 gap-2 numpad">
          <button
            className={`numpad-button btn2 btn2-white fs-3 lh-xlg ${operationPg === Operation.QUANTITY ? 'active' : ''}`}
            onClick={() => {
              if (selectedItemPg) {
                setOperationPg(Operation.QUANTITY)
                openCalculatorModal({ operation: Operation.QUANTITY })
                setChangePricePg(false)
              }
            }}
            // style={{ flex: 1, height: '48px', fontSize: '13px', maxWidth: '466px' }}
          >
            <span>Cantidad</span>
          </button>

          <button
            className={`numpad-button btn2 btn2-white fs-3 lh-xlg ${operationPg === Operation.PRICE ? 'active' : ''}`}
            onClick={() => {
              if (selectedItemPg) {
                setOperationPg(Operation.PRICE)
                openCalculatorModal({ operation: Operation.PRICE })
                setChangePricePg(false)
              }
            }}
            // style={{ flex: 1, height: '48px', fontSize: '13px', maxWidth: '466px' }}
          >
            <span>Precio</span>
          </button>

          <button
            className={`numpad-button btn2 btn2-white fs-3 lh-xlg ${operationPg === Operation.TARA_QUANTITY ? 'active' : ''}`}
            onClick={() => {
              if (selectedItemPg) {
                setOperationPg(Operation.TARA_QUANTITY)
                openCalculatorModal({ operation: Operation.TARA_QUANTITY })
                setChangePricePg(false)
              }
            }}
            // style={{ flex: 1, height: '48px', fontSize: '13px', maxWidth: '466px' }}
          >
            <span>TARA cantidad</span>
          </button>

          <button
            className={`numpad-button btn2 btn2-white fs-3 lh-xlg ${operationPg === Operation.TARA_VALUE ? 'active' : ''}`}
            onClick={() => {
              if (selectedItemPg) {
                setOperationPg(Operation.TARA_VALUE)
                openCalculatorModal({ operation: Operation.TARA_VALUE })
                setChangePricePg(false)
              }
            }}
            // style={{ flex: 1, height: '48px', fontSize: '13px', maxWidth: '466px' }}
          >
            <span>TARA peso</span>
          </button>
        </div>
        {/*
        <div className="mt-2 d-flex flex-wrap gap-2 numpad">
          {containersPg.map((value: { weight: number; name: string }) => (
            <button
              key={value.weight}
              className="numpad-button btn2 btn2-white fs-3 lh-mlg"
              onClick={() => {
                if (selectedItemPg) {
                  handleTaraSelect(value.weight)
                  setHandleChangePg(true)
                  setTaraValuePg(selectedOrderPg, selectedItemPg || 0, value.weight)
                }
              }}
              // style={{ minWidth: '60px', flex: '1 0 60px', height: '48px', fontSize: '14px' }}
              style={{ minWidth: '60px' }}
            >
              {value.name}
            </button>
          ))}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={`ghost-${index}`} style={{ minWidth: '60px', flex: '1 0 60px', height: 0 }} />
          ))}
        </div>
        */}
      </div>

      <div className="d-flex flex-column" style={{ minWidth: '160px', maxWidth: '180px' }}>
        <div
          className="rounded-3 p-3 shadow-sm d-flex flex-column"
          style={{ backgroundColor: '#1f2937', height: '104px' }}
        >
          <div className="text-center flex-grow-1 d-flex flex-column justify-content-center">
            <div
              className="fw-bold mb-0"
              style={{ color: '#60a5fa', fontSize: '40px', lineHeight: '1.1' }}
            >
              {weightValuePg.toFixed(2)}
            </div>
            <Divider component="div" style={{ height: '2px', backgroundColor: '#60a5fa' }} />
            <div
              className="text-truncate"
              style={{ color: '#fbbf24', fontSize: '14px', fontWeight: '600' }}
            >
              S/ {getProductPricePg(selectedItemPg || '', selectedOrderPg || '').toFixed(2)}
            </div>
          </div>
        </div>

        <div className="rounded-3 p-3 d-flex flex-column mt-2" style={{ height: '104px' }}>
          <button
            className={`numpad-button btn2 btn2-white fs-3 w-full lh-xlg ${operationPg === Operation.TARA_VALUE ? 'active' : ''}`}
            onClick={() => {
              openPaymentsModal()
            }}
            // style={{ flex: 1, height: '48px', fontSize: '13px', maxWidth: '466px' }}
          >
            <span>PAGAR DEUDA</span>
          </button>
        </div>
      </div>

      <div className="d-flex flex-column gap-2" style={{ minWidth: '120px' }}>
        <button
          className="btn fw-semibold rounded-3 shadow-sm d-flex align-items-center justify-content-center text-white"
          style={{
            backgroundColor: '#3b82f6',
            borderColor: '#3b82f6',
            flex: '2',
            height: '48px',
            fontSize: '13px',
          }}
          onClick={() => {
            setPrevWeight(weightValuePg)
            return
            if (!selectedItemPg || !selectedOrderPg) return
            const currentTaraQuantity = getProductTaraQuantityPg(
              selectedOrderPg,
              selectedItemPg || 0
            )
            const quantityTotal = getProductQuantityInOrderPg(selectedOrderPg, selectedItemPg)
            if (Number(quantityTotal) !== 0 && Number(quantityTotal) > 0) {
              CustomToast({
                title: '',
                description: 'El producto ya tiene un peso asignado.',
                type: 'warning',
              })
              return
            }
            setProductQuantityInOrderPg(selectedOrderPg, selectedItemPg || 0, weightValuePg || 0)

            /*const currentTaraQuantity = getProductTaraQuantityPg(
              selectedOrderPg,
              selectedItemPg || 0
            )*/
            if (currentTaraQuantity === 0) {
              setTaraQuantityPg(selectedOrderPg, selectedItemPg || 0, 0)
            }
          }}
        >
          <span>CAPTURAR</span>
        </button>
        <button
          className="btn fw-semibold rounded-3 shadow-sm d-flex align-items-center justify-content-center text-white"
          style={{
            backgroundColor: '#f97316',
            borderColor: '#f97316',
            flex: '1',
            height: '48px',
            fontSize: '13px',
          }}
          onClick={() => {
            if (selectedItemPg && selectedOrderPg) {
              setProductQuantityInOrderPg(selectedOrderPg, selectedItemPg || 0, -weightValuePg || 0)
            }
          }}
        >
          DEVOLVER
        </button>
      </div>

      <div className="d-flex flex-column gap-2" style={{ minWidth: '120px' }}>
        <button
          className="btn fw-semibold rounded-3 shadow-sm d-flex align-items-center justify-content-center text-white"
          style={{
            backgroundColor: '#3b82f6',
            borderColor: '#3b82f6',
            flex: '2',
            height: '48px',
            fontSize: '13px',
          }}
          onClick={() => {
            if (getTotalPriceByOrderPg(selectedOrderPg) === 0) {
              CustomToast({
                title: 'Error al continuar a pago',
                description: 'No se puede continuar: el monto debe ser distinto de 0.',
                type: 'error',
              })

              return
            }
            setBackToProductsPg(false)
            setHandleChangePg(true)
            fnc_to_pay()
          }}
        >
          <span>FINALIZAR VENTA</span>
        </button>
      </div>

      {/**
       * <div className="d-flex flex-column gap-2" style={{ minWidth: '120px' }}>
        <button
          className="btn fw-semibold rounded-3 shadow-sm d-flex align-items-center justify-content-center text-white"
          style={{
            backgroundColor: connected ? '#059669' : '#10b981',
            borderColor: connected ? '#059669' : '#10b981',
            flex: '1',
            height: '48px',
            fontSize: '13px',
          }}
          onClick={resetItem}
          disabled={connected}
        >
          <div className="text-center flex-grow-1 d-flex flex-column justify-content-center items-center">
            <IoArrowUndoSharp size={40} />
            <div className="mt-2">DESHACER</div>
          </div>
        </button>
      </div>
       * 
       */}
    </div>
  )
}

export default TaraOptions
