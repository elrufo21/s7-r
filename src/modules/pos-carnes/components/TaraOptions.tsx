import useAppStore from '@/store/app/appStore'
import { Divider } from '@mui/material'
import { useEffect, useState } from 'react'
import { Operation } from '../context/CalculatorContext'
import { IoArrowUndoSharp } from 'react-icons/io5'

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
  } = useAppStore()

  const [isManualMode, setIsManualMode] = useState(false)
  const [isQuantityMode, setIsQuantityMode] = useState(false)

  useEffect(() => {
    if (operation === Operation.QUANTITY || operation === Operation.PRICE) {
      setIsQuantityMode(false)
      setIsManualMode(false)
    }
  }, [operation])

  useEffect(() => {
    setIsManualMode(false)
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
    setIsManualMode(false)
    setTaraValue(selectedOrder, selectedItem || 0, weight)

    const currentTaraQuantity = getProductTaraQuantity(selectedOrder, selectedItem || 0)
    if (currentTaraQuantity === 0) {
      setTaraQuantity(selectedOrder, selectedItem || 0, 1)
    }
  }

  const handleManualMode = () => {
    if (isManualMode) {
      setOperation(Operation.QUANTITY)
    } else {
      setOperation(Operation.TARA_VALUE)
      const currentTaraQuantity = getProductTaraQuantity(selectedOrder, selectedItem || 0)
      if (currentTaraQuantity === 0) {
        setTaraQuantity(selectedOrder, selectedItem || 0, 1)
      }
    }
    setIsQuantityMode(false)
    setIsManualMode(!isManualMode)
  }

  const handleQuantityMode = () => {
    if (isQuantityMode) {
      setOperation(Operation.QUANTITY)
    } else {
      setOperation(Operation.TARA_QUANTITY)
    }
    setIsManualMode(false)
    setIsQuantityMode(!isQuantityMode)
  }

  const resetItem = () => {
    resetSelectedItem()
    setHandleChange(true)
  }

  return (
    <div className="d-flex gap-3 py-2 w-100 align-items-start">
      <div className="flex-fill max-w-[400px]">
        <div className="d-flex gap-2 align-items-center numpad">
          <button
            className={`numpad-button btn2 btn2-white fs-3 lh-lg  ${isManualMode ? 'active' : ''}`}
            onClick={handleManualMode}
            style={{ flex: 1, height: '48px', fontSize: '13px', maxWidth: '466px' }}
          >
            <span>TARA peso</span>
          </button>
          <button
            className={`numpad-button btn2 btn2-white fs-3 lh-lg ${isQuantityMode ? 'active' : ''}`}
            onClick={handleQuantityMode}
            style={{ flex: 1, height: '48px', fontSize: '13px', maxWidth: '466px' }}
          >
            <span>TARA cantidad</span>
          </button>
        </div>

        <div className="mt-2 d-flex flex-wrap gap-2 numpad">
          {containers.map((value: { weight: number; name: string }) => (
            <button
              key={value.weight}
              className="numpad-button btn2 btn2-white fs-3 lh-lg"
              onClick={() => {
                handleTaraSelect(value.weight)
                setHandleChange(true)
                setTaraValue(selectedOrder, selectedItem || 0, value.weight)
              }}
              style={{ minWidth: '60px', flex: '1 0 60px', height: '48px', fontSize: '14px' }}
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
            backgroundColor: connected ? '#059669' : '#10b981',
            borderColor: connected ? '#059669' : '#10b981',
            flex: '1',
            height: '48px',
            fontSize: '13px',
          }}
          onClick={() => connectToDevice()}
          disabled={connected}
        >
          <span>{connected ? 'CONECTADO' : 'CONECTAR BALANZA'}</span>
        </button>
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
      <div className="d-flex flex-column gap-2" style={{ minWidth: '120px' }}>
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
    </div>
  )
}

export default TaraOptions
