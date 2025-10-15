import useAppStore from '@/store/app/appStore'
import { Divider } from '@mui/material'
import { useEffect, useState } from 'react'
import { Operation } from '../context/CalculatorContext'
import { IoArrowUndoSharp } from 'react-icons/io5'
import CalculatorPanel from './modal/components/ModalCalculatorPanel'
import { Product } from '@/lib/offlineCache'
import { ActionTypeEnum } from '@/shared/shared.types'

const TaraOptions = () => {
  const {
    setTaraValue,
    setTaraQuantity,
    selectedItem,
    selectedOrder,
    setProductQuantityInOrder,
    getProductTaraValue,
    getProductTaraQuantity,
    setOperation,
    operation,
    containers,
    getProductPrice,
    weightValue,
    resetSelectedItem,
    setHandleChange,
    connected,
    connectToDevice,
    orderData,
    backToProducts,
    setScreen,
    openDialog,
    closeDialogWithData,
  } = useAppStore()
  const [cart, setCart] = useState<Product[]>([])
  console.log('containers', containers)
  useEffect(() => {
    const pos_Status = orderData?.find((item) => item?.order_id === selectedOrder)?.pos_status
    if (pos_Status === 'P' && backToProducts === false) setScreen('payment')

    setCart(
      orderData
        ?.find((item) => item.order_id === selectedOrder)
        ?.lines?.filter((item: any) => item.action !== ActionTypeEnum.DELETE) || []
    )
  }, [orderData, selectedOrder])

  useEffect(() => {
    setOperation(Operation.QUANTITY)

    if (selectedItem && selectedOrder) {
      const currentTaraQuantity = getProductTaraQuantity(selectedOrder, selectedItem)
      const currentTaraValue = getProductTaraValue(selectedOrder, selectedItem)

      if (currentTaraValue > 0 && currentTaraQuantity === 0) {
        setTaraQuantity(selectedOrder, selectedItem, 1)
      }
    }
  }, [selectedItem])

  const handleTaraSelect = (weight: number) => {
    setTaraValue(selectedOrder, selectedItem || 0, weight)

    const currentTaraQuantity = getProductTaraQuantity(selectedOrder, selectedItem || 0)
    if (currentTaraQuantity === 0) {
      setTaraQuantity(selectedOrder, selectedItem || 0, 1)
    }
  }
  const resetItem = () => {
    resetSelectedItem()
    setHandleChange(true)
  }

  const openCalculatorModal = ({ operation }: { operation: Operation }) => {
    const dialogId = openDialog({
      title: cart.find((c) => c.line_id === selectedItem)?.name,
      dialogContent: () => (
        <CalculatorPanel
          product={cart.find((c) => c.line_id === selectedItem)}
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

  return (
    <div className="d-flex gap-3 py-2 pr-2 w-100 align-items-start flex-wrap">
      {!connected && (
        <div className="w-100 ">
          <button
            className="btn fw-semibold rounded-3 shadow-sm d-flex align-items-center justify-content-center text-white w-100"
            style={{
              backgroundColor: connected ? '#059669' : '#D63515',
              borderColor: connected ? '#059669' : '#D63515',
              height: '80px',
              fontSize: '13px',
            }}
            onClick={() => connectToDevice()}
            disabled={connected}
          >
            <span>{connected ? 'CONECTADO' : 'CONECTAR BALANZA'}</span>
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
            className={`numpad-button btn2 btn2-white fs-3 lh-xlg ${operation === Operation.QUANTITY ? 'active' : ''}`}
            onClick={() => {
              setOperation(Operation.QUANTITY)
              openCalculatorModal({ operation: Operation.QUANTITY })
            }}
            // style={{ flex: 1, height: '48px', fontSize: '13px', maxWidth: '466px' }}
          >
            <span>Cantidad</span>
          </button>

          <button
            className={`numpad-button btn2 btn2-white fs-3 lh-xlg ${operation === Operation.PRICE ? 'active' : ''}`}
            onClick={() => {
              setOperation(Operation.PRICE)
              openCalculatorModal({ operation: Operation.PRICE })
            }}
            // style={{ flex: 1, height: '48px', fontSize: '13px', maxWidth: '466px' }}
          >
            <span>Precio</span>
          </button>

          <button
            className={`numpad-button btn2 btn2-white fs-3 lh-xlg ${operation === Operation.TARA_QUANTITY ? 'active' : ''}`}
            onClick={() => {
              setOperation(Operation.TARA_QUANTITY)
              openCalculatorModal({ operation: Operation.TARA_QUANTITY })
            }}
            // style={{ flex: 1, height: '48px', fontSize: '13px', maxWidth: '466px' }}
          >
            <span>TARA cantidad</span>
          </button>

          <button
            className={`numpad-button btn2 btn2-white fs-3 lh-xlg ${operation === Operation.TARA_VALUE ? 'active' : ''}`}
            onClick={() => {
              setOperation(Operation.TARA_VALUE)
              openCalculatorModal({ operation: Operation.TARA_VALUE })
            }}
            // style={{ flex: 1, height: '48px', fontSize: '13px', maxWidth: '466px' }}
          >
            <span>TARA peso</span>
          </button>
        </div>

        <div className="mt-2 d-flex flex-wrap gap-2 numpad">
          {containers.map((value: { weight: number; name: string }) => (
            <button
              key={value.weight}
              className="numpad-button btn2 btn2-white fs-3 lh-mlg"
              onClick={() => {
                handleTaraSelect(value.weight)
                setHandleChange(true)
                setTaraValue(selectedOrder, selectedItem || 0, value.weight)
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
              {weightValue.toFixed(2)}
            </div>
            <Divider component="div" style={{ height: '2px', backgroundColor: '#60a5fa' }} />
            <div
              className="text-truncate"
              style={{ color: '#fbbf24', fontSize: '14px', fontWeight: '600' }}
            >
              S/ {getProductPrice(selectedItem || '', selectedOrder || '').toFixed(2)}
            </div>
          </div>
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
            setProductQuantityInOrder(selectedOrder, selectedItem || 0, weightValue || 0)

            const currentTaraQuantity = getProductTaraQuantity(selectedOrder, selectedItem || 0)
            if (currentTaraQuantity === 0) {
              setTaraQuantity(selectedOrder, selectedItem || 0, 0)
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
            if (selectedItem && selectedOrder) {
              setProductQuantityInOrder(selectedOrder, selectedItem || 0, -weightValue || 0)
            }
          }}
        >
          DEVOLVER
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
