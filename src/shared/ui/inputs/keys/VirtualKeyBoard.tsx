import React, { useRef, useEffect, useCallback } from 'react'

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void
  onClose: () => void
  capsLock: boolean
  onCapsLockToggle: () => void
  position: { position: 'top' | 'bottom' }
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  onClose,
  capsLock,
  onCapsLockToggle,
  position,
}) => {
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

  const isTop = position?.position === 'top'

  return (
    <div
      ref={keyboardRef}
      className={`fixed z-[99999] bg-white border border-gray-300 shadow-lg p-4 w-full ${
        isTop ? 'top-0 left-0 right-0 border-b' : 'bottom-0 left-0 right-0 border-t'
      }`}
    >
      <div className="flex flex-col gap-2 items-center">
        {/* Primera fila - Números */}
        <div className="flex gap-2 justify-center">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((key) => (
            <button
              key={key}
              type="button"
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 text-base font-medium min-w-[90px] min-h-[70px]"
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

        {/* Segunda fila - Q-P */}
        <div className="flex gap-2 justify-center">
          {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map((key) => (
            <button
              key={key}
              type="button"
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 text-base font-medium min-w-[90px] min-h-[70px]"
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleKeyClick(key)
              }}
            >
              {capsLock ? key.toUpperCase() : key}
            </button>
          ))}
        </div>

        {/* Tercera fila - A-Ñ */}
        <div className="flex gap-2 justify-center">
          {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ'].map((key) => (
            <button
              key={key}
              type="button"
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 text-base font-medium min-w-[90px] min-h-[70px]"
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleKeyClick(key)
              }}
            >
              {capsLock ? key.toUpperCase() : key}
            </button>
          ))}
        </div>

        {/* Cuarta fila - Z-M + Borrar */}
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            className={`px-4 py-3 rounded-lg border border-gray-300 text-base font-medium min-w-[140px] min-h-[70px] ${
              capsLock ? 'bg-teal-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onCapsLockToggle()
            }}
          >
            Caps
          </button>
          {['z', 'x', 'c', 'v', 'b', 'n', 'm'].map((key) => (
            <button
              key={key}
              type="button"
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 text-base font-medium min-w-[90px] min-h-[70px]"
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleKeyClick(key)
              }}
            >
              {capsLock ? key.toUpperCase() : key}
            </button>
          ))}
          <button
            type="button"
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 text-base font-medium min-w-[140px] min-h-[70px]"
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleKeyClick('Backspace')
            }}
          >
            ← Borrar
          </button>
        </div>

        {/* Quinta fila - Espacio, limpiar y cerrar */}
        <div className="flex gap-2 justify-center w-full">
          <button
            type="button"
            className="px-4 py-3 bg-red-100 hover:bg-red-200 rounded-lg border border-red-300 text-base font-medium min-w-[250px] min-h-[70px]"
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleKeyClick('Clear')
            }}
          >
            Limpiar
          </button>
          <button
            type="button"
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 text-base font-medium flex-1 min-h-[70px]"
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleKeyClick('Space')
            }}
          >
            Espacio
          </button>
          <button
            type="button"
            className="px-4 py-3 bg-teal-100 hover:bg-teal-200 rounded-lg border border-teal-300 text-base font-medium min-w-[250px] min-h-[70px]"
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

export default VirtualKeyboard
