import React, { useRef, useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Tooltip } from '@mui/material'
import { BiSearch } from 'react-icons/bi'

interface InputWithKeyboardProps extends React.InputHTMLAttributes<HTMLInputElement> {
  enableVirtualKeyboard?: boolean
  useNumericKeyboard?: boolean
  isInsideModal?: boolean
  onValueChange?: (value: string) => void
}

let globalKeyboardState: {
  activeInputRef: HTMLInputElement | null
  showKeyboard: boolean
  setShowKeyboard: ((show: boolean) => void) | null
} = {
  activeInputRef: null,
  showKeyboard: false,
  setShowKeyboard: null,
}

const NumericKeyboard = ({ onKeyPress, onClose, position }: any) => {
  const keyboardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (keyboardRef.current && !keyboardRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement
        if (!target.closest('[data-keyboard-icon]')) {
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

const VirtualKeyboard = ({ onKeyPress, onClose, capsLock, onCapsLockToggle, position }: any) => {
  const keyboardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (keyboardRef.current && !keyboardRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement
        if (!target.closest('[data-keyboard-icon]')) {
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
        <div className="flex gap-2 justify-center">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((key) => (
            <button
              key={key}
              type="button"
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 text-base font-medium min-w-[55px]"
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

        <div className="flex gap-2 justify-center">
          {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map((key) => (
            <button
              key={key}
              type="button"
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 text-base font-medium min-w-[55px]"
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

        <div className="flex gap-2 justify-center">
          {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ'].map((key) => (
            <button
              key={key}
              type="button"
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 text-base font-medium min-w-[55px]"
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

        <div className="flex gap-2 justify-center">
          <button
            type="button"
            className={`px-4 py-3 rounded-lg border border-gray-300 text-base font-medium min-w-[85px] ${
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
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 text-base font-medium min-w-[55px]"
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
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 text-base font-medium min-w-[85px]"
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleKeyClick('Backspace')
            }}
          >
            ← Borrar
          </button>
        </div>

        <div className="flex gap-2 justify-center w-full">
          <button
            type="button"
            className="px-4 py-3 bg-red-100 hover:bg-red-200 rounded-lg border border-red-300 text-base font-medium min-w-[100px]"
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
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 text-base font-medium flex-1"
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
            className="px-4 py-3 bg-teal-100 hover:bg-teal-200 rounded-lg border border-teal-300 text-base font-medium min-w-[100px]"
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

export const InputWithKeyboard: React.FC<InputWithKeyboardProps> = ({
  enableVirtualKeyboard = false,
  useNumericKeyboard = false,
  isInsideModal = false,
  onValueChange,
  className = '',
  value,
  onChange,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const [keyboardPosition, setKeyboardPosition] = useState<any>({ position: 'bottom' })
  const activeInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (showKeyboard) {
      globalKeyboardState.showKeyboard = true
      globalKeyboardState.setShowKeyboard = setShowKeyboard
      globalKeyboardState.activeInputRef = activeInputRef.current
    }
  }, [showKeyboard])

  const calculateKeyboardPosition = useCallback(() => {
    if (!containerRef.current) return { position: 'bottom' as const }

    if (isInsideModal) {
      const inputRect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const windowMiddle = windowHeight / 2

      if (inputRect.top < windowMiddle) {
        return { position: 'bottom' as const }
      } else {
        return { position: 'top' as const }
      }
    }

    const inputRect = containerRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const keyboardHeight = useNumericKeyboard ? 350 : 280

    const spaceBelow = windowHeight - inputRect.bottom
    const spaceAbove = inputRect.top

    if (spaceBelow < keyboardHeight && spaceAbove > keyboardHeight) {
      return { position: 'top' as const }
    }

    return { position: 'bottom' as const }
  }, [useNumericKeyboard, isInsideModal])

  const handleVirtualKeyPress = useCallback(
    (key: string) => {
      const input = activeInputRef.current
      if (!input) return

      const currentValue = input.value || ''
      let newValue = currentValue

      switch (key) {
        case 'Backspace':
          newValue = currentValue.slice(0, -1)
          break
        case 'Space':
          newValue = currentValue + ' '
          break
        case 'Clear':
          newValue = ''
          break
        case '+/-':
          if (currentValue.startsWith('-')) {
            newValue = currentValue.substring(1)
          } else if (currentValue.length > 0) {
            newValue = '-' + currentValue
          }
          break
        default:
          newValue = currentValue + (capsLock ? key.toUpperCase() : key.toLowerCase())
      }

      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(input, newValue)
        const inputEvent = new Event('input', { bubbles: true })
        input.dispatchEvent(inputEvent)

        if (onValueChange) {
          onValueChange(newValue)
        }

        input.focus()
      }
    },
    [capsLock, onValueChange]
  )

  const toggleKeyboard = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (inputRef.current) {
        activeInputRef.current = inputRef.current
        globalKeyboardState.activeInputRef = inputRef.current
      }

      if (
        globalKeyboardState.showKeyboard &&
        globalKeyboardState.setShowKeyboard &&
        !showKeyboard
      ) {
        globalKeyboardState.setShowKeyboard(false)
      }

      const position = calculateKeyboardPosition()
      setKeyboardPosition(position)
      setShowKeyboard((prev) => !prev)
    },
    [showKeyboard, calculateKeyboardPosition]
  )

  const closeKeyboard = useCallback(() => {
    setShowKeyboard(false)
    globalKeyboardState.showKeyboard = false
    globalKeyboardState.activeInputRef = null
  }, [])

  const toggleCapsLock = useCallback(() => {
    setCapsLock((prev) => !prev)
  }, [])

  const handleInputFocus = useCallback(() => {
    if (inputRef.current) {
      activeInputRef.current = inputRef.current

      if (
        globalKeyboardState.showKeyboard &&
        globalKeyboardState.activeInputRef !== inputRef.current
      ) {
        if (globalKeyboardState.setShowKeyboard) {
          globalKeyboardState.setShowKeyboard(false)
        }
      }
    }

    if (enableVirtualKeyboard && !showKeyboard) {
      const position = calculateKeyboardPosition()
      setKeyboardPosition(position)
      setShowKeyboard(true)

      if (inputRef.current) {
        activeInputRef.current = inputRef.current
        globalKeyboardState.activeInputRef = inputRef.current
        globalKeyboardState.showKeyboard = true
        globalKeyboardState.setShowKeyboard = setShowKeyboard
      }
    }
  }, [enableVirtualKeyboard, showKeyboard, calculateKeyboardPosition])

  const renderKeyboard = () => {
    if (!enableVirtualKeyboard || !showKeyboard) return null

    const keyboardComponent = useNumericKeyboard ? (
      <NumericKeyboard
        onKeyPress={handleVirtualKeyPress}
        onClose={closeKeyboard}
        position={keyboardPosition}
      />
    ) : (
      <VirtualKeyboard
        onKeyPress={handleVirtualKeyPress}
        onClose={closeKeyboard}
        capsLock={capsLock}
        onCapsLockToggle={toggleCapsLock}
        position={keyboardPosition}
      />
    )

    return createPortal(keyboardComponent, document.body)
  }
  return (
    <div ref={containerRef} className="relative inline-flex items-center w-full">
      <BiSearch className="mt-[3px] text-gray-400" size={25} />

      <input
        {...props}
        ref={inputRef}
        className={`${className} pl-2 outline-none text-gray-500 text-xl w-96`}
        value={value}
        onChange={onChange}
        onFocus={handleInputFocus}
      />

      {value && (
        <button
          type="button"
          onClick={() => {
            const input = inputRef.current
            if (input) {
              const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                'value'
              )?.set
              nativeInputValueSetter?.call(input, '')
              input.dispatchEvent(new Event('input', { bubbles: true }))
            }
            if (onValueChange) onValueChange('')
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}

      {renderKeyboard()}
    </div>
  )
}
