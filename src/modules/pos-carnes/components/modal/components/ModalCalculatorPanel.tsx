import { useEffect, useState } from 'react'
import { Operation, Product } from '@/modules/pos/types'
import useAppStore from '@/store/app/appStore'
import { AiOutlineTag } from 'react-icons/ai'

interface Props {
  product: Product
  selectedField?: Operation
  dialogId: string
}
const sanitizeInputString = (raw: string) => {
  if (raw === '' || raw === '-' || raw === '.' || raw === '-.') return raw
  let s = raw

  s = s.replace(/\s+/g, '')

  if (s.includes('-')) {
    s = s.replace(/-/g, '')
    s = '-' + s
  }

  const firstDotIdx = s.indexOf('.')
  if (firstDotIdx >= 0) {
    const intPart = s.slice(0, firstDotIdx)
    let decPart = s.slice(firstDotIdx + 1).replace(/\./g, '')
    decPart = decPart.slice(0, 2)
    return intPart + '.' + decPart
  }

  return s
}
const to2 = (v: any) => Number(Number(v || 0).toFixed(2))

const CalculatorPanel = ({ product, selectedField, dialogId }: Props) => {
  const {
    closeDialogWithData,
    updateOrderLine,
    setHandleChange,
    deleteProductInOrder,
    selectedOrder,
  } = useAppStore()

  const [localProduct, setLocalProduct] = useState<Product>({ ...product })
  const [activeField, setActiveField] = useState<Operation>(selectedField ?? Operation.QUANTITY)
  const fieldMap: Record<Operation, keyof Product> = {
    [Operation.QUANTITY]: 'base_quantity',
    [Operation.PRICE]: 'price_unit',
    [Operation.TARA_VALUE]: 'tara_value',
    [Operation.TARA_QUANTITY]: 'tara_quantity',
  }
  const currentFieldKey = fieldMap[activeField]
  const [inputValue, setInputValue] = useState<string>(String(localProduct[currentFieldKey] ?? ''))
  const [replaceOnNextDigit, setReplaceOnNextDigit] = useState<boolean>(true)

  useEffect(() => {
    setLocalProduct({ ...product })
  }, [product])

  useEffect(() => {
    const cur = localProduct[currentFieldKey]
    setInputValue(cur !== undefined && cur !== null ? String(cur) : '')
    setReplaceOnNextDigit(true)
  }, [activeField])

  const recalc = (updated: Product): Product => {
    const baseQ = to2(updated.base_quantity)
    const tV = to2(updated.tara_value)
    const tQ = to2(updated.tara_quantity)
    const price = to2(updated.price_unit)

    const tara_total = to2(tV * tQ)
    const quantity = to2(baseQ - tara_total)
    const amount_untaxed = to2(price * quantity)

    return {
      ...updated,
      base_quantity: baseQ,
      tara_value: tV,
      tara_quantity: tQ,
      price_unit: price,
      tara_total,
      quantity,
      amount_untaxed,
      amount_withtaxed: amount_untaxed,
      amount_untaxed_total: amount_untaxed,
      amount_withtaxed_total: amount_untaxed,
      amount_tax: 0,
      amount_tax_total: 0,
    }
  }
  const applyInput = (raw: string) => {
    const sanitized = sanitizeInputString(raw)

    // actualizar visual: si sanitized termina en '.' dejamos así (ej: "0."), si es "-" igualmente
    setInputValue(sanitized)

    // calcular número para la lógica (si termina en '.' o es '-' tratamos como 0)
    let parsed = 0
    if (sanitized === '' || sanitized === '-' || sanitized === '.' || sanitized === '-.') {
      parsed = 0
    } else {
      parsed = parseFloat(sanitized)
      if (!Number.isFinite(parsed)) parsed = 0
    }
    parsed = to2(parsed)

    setLocalProduct((prev) => recalc({ ...prev, [currentFieldKey]: parsed }))
  }

  const handleNumberClick = (digit: string) => {
    let next = replaceOnNextDigit ? digit : inputValue + digit

    // ✅ Permitir 0 al inicio sin borrarlo
    if (replaceOnNextDigit && digit === '0') {
      next = '0' // Se queda visible
    }

    // ⚠ Control de máximo 2 decimales
    if (next.includes('.')) {
      const [intPart, decimalPart = ''] = next.split('.')
      if (decimalPart.length > 2) {
        return // No más de 2 decimales
      }
    }

    setReplaceOnNextDigit(false)

    // ✅ Actualizar primero el inputValue para preservar el formato visual
    setInputValue(next)

    // ⚠ Solo aplicar cálculo con número limpio (pero sin modificar inputValue)
    const sanitized = sanitizeInputString(next)
    let parsed = 0
    if (sanitized === '' || sanitized === '-' || sanitized === '.' || sanitized === '-.') {
      parsed = 0
    } else {
      parsed = parseFloat(sanitized)
      if (!Number.isFinite(parsed)) parsed = 0
    }
    parsed = to2(parsed)

    setLocalProduct((prev) => recalc({ ...prev, [currentFieldKey]: parsed }))
  }

  const handleBackspace = () => {
    if (!inputValue || inputValue.length === 0) {
      setReplaceOnNextDigit(true)
      setInputValue('')
      applyInput('')
      return
    }
    const next = inputValue.slice(0, -1)
    setInputValue(next)
    if (next === '' || next === '-') {
      setReplaceOnNextDigit(true)
    } else {
      setReplaceOnNextDigit(false)
    }
    applyInput(next)
  }

  const handleDot = () => {
    if (inputValue.includes('.')) return

    if (replaceOnNextDigit) {
      const next = '0.'
      setInputValue(next)
      setReplaceOnNextDigit(false)
      applyInput(next)
      return
    }

    const next = inputValue === '' || inputValue === '-' ? '0.' : inputValue + '.'
    setInputValue(next)
    setReplaceOnNextDigit(false)
    applyInput(next)
  }

  const toggleSign = () => {
    if (inputValue === '') return
    const next = inputValue.startsWith('-') ? inputValue.slice(1) : '-' + inputValue
    setInputValue(next)
    applyInput(next)
  }

  const handleOk = () => {
    applyInput(inputValue)
    setHandleChange(true)
    updateOrderLine(localProduct)
    closeDialogWithData(dialogId, {})
  }

  const showTaraInfo = (localProduct.tara_value ?? 0) > 0 || (localProduct.tara_quantity ?? 0) > 0

  return (
    <div className="flex flex-row p-[15px]">
      <div className="pr-3">
        <div className="grid-container2">
          <div className="grid-item2">
            <button
              className={`btn-style-1 flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 
        rounded-lg text-gray-700 font-medium text-center h-full ${
          activeField === Operation.QUANTITY ? 'abc' : ''
        }`}
              onClick={() => setActiveField(Operation.QUANTITY)}
            >
              <div className="pt-1">
                <div className="text-[1.09375rem]">Cantidad</div>
              </div>
            </button>
          </div>
          <div className="grid-item2">
            <button
              className={`btn-style-1 flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 
        rounded-lg text-gray-700 font-medium text-center h-full ${
          activeField === Operation.PRICE ? 'abc' : ''
        }`}
              onClick={() => setActiveField(Operation.PRICE)}
            >
              <div className="pt-1">
                <div className="">
                  <AiOutlineTag style={{ fontSize: '24px' }} className="mb-[3px]" />
                </div>
                <div className="text-[1.09375rem]">Precio</div>
              </div>
            </button>
          </div>
          <div className="grid-item2">
            <button
              className={`btn-style-1 flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 
        rounded-lg text-gray-700 font-medium text-center h-full ${
          activeField === Operation.TARA_QUANTITY ? 'abc' : ''
        }`}
              onClick={() => setActiveField(Operation.TARA_QUANTITY)}
            >
              <div className="pt-1">
                <div className="text-[1.09375rem]">Tara cantidad</div>
              </div>
            </button>
          </div>
          <div className="grid-item2">
            <button
              className={`btn-style-1 flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 
        rounded-lg text-gray-700 font-medium text-center h-full ${
          activeField === Operation.TARA_VALUE ? 'abc' : ''
        }`}
              onClick={() => setActiveField(Operation.TARA_VALUE)}
            >
              <div className="pt-1">
                <div className="text-[1.09375rem]">Tara peso</div>
              </div>
            </button>
          </div>
          <div className="grid-item2">
            <button
              className="btn-style-1 flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 
        rounded-lg text-gray-700 font-medium text-center h-full"
              onClick={() => {
                closeDialogWithData(dialogId, {})
                deleteProductInOrder(selectedOrder, product?.line_id)
              }}
            >
              <div className="pt-1">
                <div className="text-red-600">
                  {/* <GrTrash style={{ fontSize: '20px' }} className="mb-[3px]" /> */}
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 48 48"
                    fill="none"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M 24 15 V 8" stroke-width="2.5" />
                    <path d="M 8 15 H 40" stroke-width="2.5" />
                    <path d="M 35 16 V 38 H 13 V 16" stroke-width="2.5" />
                    <path d="M 21 21 V 32" stroke-width="2.5" />
                    <path d="M 27 21 V 32" stroke-width="2.5" />
                  </svg>
                </div>
                <div className="text-red-600 text-[1.09375rem]">Eliminar</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="">
        <div className="pb-3">
          {showTaraInfo && (
            <>
              <div className="flex justify-between text-gray-700 text-xl">
                <span
                  className={`${activeField === Operation.QUANTITY ? 'text-red-500 font-bold' : ''}`}
                >
                  Peso bruto:
                </span>
                <span
                  className={`${activeField === Operation.QUANTITY ? 'text-red-500 font-bold' : ''}`}
                >
                  {to2(localProduct.price_unit).toFixed(2)} {localProduct.uom_name}
                </span>
              </div>
              <div className="flex justify-between text-gray-700 text-xl">
                <span
                  className={`${activeField === Operation.TARA_QUANTITY || activeField === Operation.TARA_VALUE ? 'text-red-500 font-bold' : ''}`}
                >
                  Tara:
                </span>
                <span>
                  <span
                    className={`${activeField === Operation.TARA_QUANTITY ? 'text-red-500 font-bold' : ''}`}
                  >
                    {to2(localProduct.tara_quantity)} und
                  </span>{' '}
                  ×{' '}
                  <span
                    className={`${activeField === Operation.TARA_VALUE ? 'text-red-500 font-bold' : ''}`}
                  >
                    {to2(localProduct.tara_value)} {localProduct.uom_name}
                  </span>{' '}
                  = {to2(localProduct.tara_total)} {localProduct.uom_name}
                </span>
              </div>
            </>
          )}

          <div className="flex justify-between text-gray-700 text-xl">
            <span
              className={`${activeField === Operation.QUANTITY && !showTaraInfo ? 'text-red-500 font-bold' : ''}`}
            >
              Peso neto:
            </span>
            <span
              className={`${activeField === Operation.QUANTITY && !showTaraInfo ? 'text-red-500 font-bold' : ''}`}
            >
              {to2(localProduct.quantity)} {localProduct.uom_name}
            </span>
          </div>

          <div
            className="flex justify-between text-gray-700 text-xl"
            style={{ borderBottom: '1px solid #000' }}
          >
            <span className={`${activeField === Operation.PRICE ? 'text-red-500 font-bold' : ''}`}>
              {' '}
              Precio:
            </span>
            <span className={`${activeField === Operation.PRICE ? 'text-red-500 font-bold' : ''}`}>
              S/ {to2(localProduct.price_unit).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-xl font-bold">
            <span>Importe total:</span>
            <span>S/ {to2(localProduct.amount_untaxed).toFixed(2)}</span>
          </div>
        </div>

        <div className="pads">
          <div className="subpads">
            <div className="grid-container">
              {[1, 2, 3].map((n) => (
                <div className="grid-item" key={n}>
                  <button
                    className="numpad-button btn2 fs-3 lh-lg w-full h-full"
                    onClick={() => handleNumberClick(String(n))}
                  >
                    {n}
                  </button>
                </div>
              ))}

              <div className="grid-item pink-bg">
                <button
                  className="numpad-button btn2 fs-3 lh-lg w-full h-full o_colorlist_item_numpad_color_1"
                  onClick={handleBackspace}
                >
                  {/* <HiOutlineBackspace style={{ fontSize: '34px' }} /> */}
                  {/* 
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5h11z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12 10l4 4m0 -4l-4 4" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  */}
                  {/* 
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 6H8L3 12L8 18H21a1 1 0 0 0 1-1V7a1 1 0 0 0 -1-1z" stroke="black" stroke-width="1" stroke-linecap="round" stroke-linejoin="miter" />
                    <path d="M12 10l4 4m0 -4l-4 4" stroke="black" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  */}
                  {/* 
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 7L8.8 7.00001L3 12L8.8 17H20C20.5523 17 21 16.5523 21 16V8C21 7.44772 20.5523 7 20 7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg> */}

                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 7L8.8 7.00001L3 12L8.8 17H20C20.5523 17 21 16.5523 21 16V8C21 7.44772 20.5523 7 20 7Z"
                      stroke="currentColor"
                      stroke-width="1.3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12 10L16 14M16 10L12 14"
                      stroke="currentColor"
                      stroke-width="1.3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {[4, 5, 6, 7, 8, 9].map((n) => (
                <div className="grid-item" key={n}>
                  <button
                    className="numpad-button btn2 fs-3 lh-lg w-full h-full"
                    onClick={() => handleNumberClick(String(n))}
                  >
                    {n}
                  </button>
                </div>
              ))}

              <div className="grid-item special-bg">
                <button
                  className="numpad-button btn2 fs-3 lh-lg w-full h-full o_colorlist_item_numpad_color_3"
                  onClick={toggleSign}
                >
                  +/-
                </button>
              </div>

              <div className="grid-item">
                <button
                  className="numpad-button btn2 fs-3 lh-lg w-full h-full"
                  onClick={() => handleNumberClick('0')}
                >
                  0
                </button>
              </div>

              <div className="grid-item yellow-bg">
                <button
                  className="numpad-button btn2 fs-3 lh-lg w-full h-full o_colorlist_item_numpad_color_2"
                  onClick={handleDot}
                >
                  .
                </button>
              </div>

              <div className="grid-item ok-button !h-auto">
                <button className="numpad-button w-full h-full" onClick={handleOk}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalculatorPanel
