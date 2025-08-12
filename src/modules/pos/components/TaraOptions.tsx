import useAppStore from '@/store/app/appStore'
import { Divider } from '@mui/material'
import { useEffect, useState } from 'react'
import { Operation } from '../context/CalculatorContext'

const TaraOptions = () => {
  const {
    setTaraValue,
    setTaraQuantity,
    selectedItem,
    selectedOrder,
    setProductQuantityInOrder,
    getProductQuantityInOrder,
    getProductTaraValue,
    getProductTaraQuantity,
    setOperation,
    operation,
    containers,
  } = useAppStore()
  const [balance, setBalance] = useState(0.0)
  const [isManualMode, setIsManualMode] = useState(false)
  const [isQuantityMode, setIsQuantityMode] = useState(false)
  const [capture, setCapture] = useState(false)

  useEffect(() => {
    if (operation === Operation.QUANTITY || operation === Operation.PRICE) {
      setIsQuantityMode(false)
      setIsManualMode(false)
    }
  }, [operation])
  useEffect(() => {
    setIsManualMode(false)
    setOperation(Operation.QUANTITY)
    setCapture(false)

    // Verificar si el producto seleccionado tiene tara peso pero no tara cantidad
    if (selectedItem && selectedOrder) {
      const currentTaraQuantity = getProductTaraQuantity(selectedOrder, selectedItem)
      const currentTaraValue = getProductTaraValue(selectedOrder, selectedItem)

      // Si hay tara peso pero no tara cantidad, establecer 1 por defecto
      if (currentTaraValue > 0 && currentTaraQuantity === 0) {
        setTaraQuantity(selectedOrder, selectedItem, 1)
      }
    }
  }, [selectedItem])
  useEffect(() => {
    if (!capture) {
      const interval = setInterval(() => {
        const nuevoPeso = Math.random() * 10
        setBalance(parseFloat(nuevoPeso.toFixed(2)))
      }, 500)
      return () => clearInterval(interval)
    }
  }, [capture]) // <--- importante

  const handleTaraSelect = (weight: number) => {
    setIsManualMode(false)
    // Establecer el valor de tara peso
    setTaraValue(selectedOrder, selectedItem || 0, weight)

    // Verificar si no hay tara cantidad y establecer 1 por defecto
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
      // Cuando se activa el modo manual de tara peso, verificar si hay tara cantidad
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

  return (
    <div className="d-flex gap-3 py-2 w-100 align-items-start">
      <div className="flex-fill max-w-[400px]">
        <div className="d-flex gap-2 align-items-center numpad">
          <button
            className={`numpad-button btn2 btn2-white fs-3 lh-lg  ${isManualMode ? 'active' : ''}`}
            onClick={() => {
              handleManualMode()
            }}
            style={{
              flex: 1,
              height: '48px',
              fontSize: '13px',
              maxWidth: '466px',
            }}
          >
            <span>TARA peso</span>
          </button>
          <button
            className={`numpad-button btn2 btn2-white fs-3 lh-lg ${isQuantityMode ? 'active' : ''}`}
            onClick={() => handleQuantityMode()}
            style={{
              flex: 1,
              height: '48px',
              fontSize: '13px',
              maxWidth: '466px',
            }}
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
                setTaraValue(selectedOrder, selectedItem || 0, value.weight)
              }}
              style={{
                minWidth: '60px',
                flex: '1 0 60px',
                height: '48px',
                fontSize: '14px',
              }}
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
          style={{
            backgroundColor: '#1f2937',
            height: '104px',
          }}
        >
          <div className="text-center flex-grow-1 d-flex flex-column justify-content-center">
            <div
              className="fw-bold mb-0"
              style={{
                color: '#60a5fa',
                fontSize: '40px',
                lineHeight: '1.1',
              }}
            >
              {balance.toFixed(2)}
            </div>
            <Divider component="div" style={{ height: '2px', backgroundColor: '#60a5fa' }} />
            <div
              className="text-truncate"
              style={{
                color: '#fbbf24',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              S/ 0.00
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
            setCapture(true)
            setProductQuantityInOrder(selectedOrder, selectedItem || 0, balance)

            // Verificar si no hay tara cantidad y establecer 1 por defecto
            const currentTaraQuantity = getProductTaraQuantity(selectedOrder, selectedItem || 0)
            if (currentTaraQuantity === 0) {
              setTaraQuantity(selectedOrder, selectedItem || 0, 1)
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
              // Obtener la cantidad actual del producto
              const currentQuantity = getProductQuantityInOrder(selectedOrder, selectedItem)
              // Solo hacer negativa si la cantidad es positiva
              if (currentQuantity > 0) {
                setProductQuantityInOrder(selectedOrder, selectedItem, -currentQuantity)
              }
            }
          }}
        >
          DEVOLVER
        </button>
      </div>
    </div>
  )
}

export default TaraOptions
