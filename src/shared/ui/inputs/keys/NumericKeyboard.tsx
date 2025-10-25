import React, { useEffect, useRef, useCallback } from 'react'

interface NumericKeyboardProps {
  onKeyPress: (key: string) => void
  onClose: () => void
  position: { position: 'top' | 'bottom' }
}

const NumericKeyboard: React.FC<NumericKeyboardProps> = ({ onKeyPress, onClose, position }) => {
  const keyboardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (keyboardRef.current && !keyboardRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement
        if (
          !target.closest('.MuiAutocomplete-root') &&
          !target.closest('[data-keyboard-icon]') &&
          !target.closest('.MuiAutocomplete-popper') &&
          !target.closest('.MuiAutocomplete-listbox')
        ) {
          onClose()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleKeyClick = useCallback(
    (key: string) => {
      onKeyPress(key)
    },
    [onKeyPress]
  )

  const baseKeyStyle =
    'px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 text-base font-medium min-w-[55px] flex items-center justify-center'

  const isTop = position?.position === 'top'

  return (
    <div
      ref={keyboardRef}
      className={`fixed z-[99999] bg-white border border-gray-300 shadow-lg p-4 w-full flex justify-center ${
        isTop ? 'top-0 left-0 right-0 border-b' : 'bottom-0 left-0 right-0 border-t'
      }`}
    >
      <div className="flex flex-col gap-2 w-auto items-center">
        {/* Fila 1 */}
        <div className="flex gap-2">
          {['1', '2', '3'].map((key) => (
            <button
              key={key}
              type="button"
              className={baseKeyStyle}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleKeyClick(key)
              }}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Fila 2 */}
        <div className="flex gap-2">
          {['4', '5', '6'].map((key) => (
            <button
              key={key}
              type="button"
              className={baseKeyStyle}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleKeyClick(key)
              }}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Fila 3 */}
        <div className="flex gap-2">
          {['7', '8', '9'].map((key) => (
            <button
              key={key}
              type="button"
              className={baseKeyStyle}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleKeyClick(key)
              }}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Fila 4 */}
        <div className="flex gap-2">
          {['+/-', '0', '.'].map((key) => (
            <button
              key={key}
              type="button"
              className={baseKeyStyle}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleKeyClick(key)
              }}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Fila 5 */}
        <div className="flex gap-2 w-full">
          <button
            type="button"
            className={`${baseKeyStyle} flex-1 min-w-[100px]`}
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleKeyClick('Backspace')
            }}
          >
            ← Borrar
          </button>
          <button
            type="button"
            className={`${baseKeyStyle} flex-1 min-w-[100px]`}
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onClose()
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default NumericKeyboard
