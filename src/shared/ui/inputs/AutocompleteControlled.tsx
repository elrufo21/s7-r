import { Autocomplete, CircularProgress, Paper, TextField, Tooltip } from '@mui/material'
import React, { FocusEvent, useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { TbArrowNarrowRight } from 'react-icons/tb'
import { Controller } from 'react-hook-form'

import { OptionsType } from './input.types'
import useAppStore from '@/store/app/appStore'

type AutocompleteControlledProps = {
  rules?: any
  errors: any
  control: any
  name: string
  setValue?: any
  limit?: number
  className?: string
  labelName?: string
  placeholder?: string
  options: OptionsType[]
  createAndEditItem?: any
  editConfig?: { config: any }
  fnc_loadOptions: () => void
  createItem?: (data: any) => void
  handleOnChanged?: (data: any) => void
  handleOnBlur?: (value: string) => void
  loadMoreResults?: (value?: any) => void
  fnc_enlace?: (value: any, name: any) => void
  is_edit?: boolean
  disableFrmIsChanged?: boolean
  enableVirtualKeyboard?: boolean
  useNumericKeyboard?: boolean
  isInsideModal?: boolean
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
        {/* Primera fila - 1, 2, 3 */}
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

        {/* Segunda fila - 4, 5, 6 */}
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

        {/* Tercera fila - 7, 8, 9 */}
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

        {/* Cuarta fila - +/-, 0, . */}
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

        {/* Quinta fila - Borrar y Cerrar */}
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

        {/* Segunda fila - Q-P */}
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

        {/* Tercera fila - A-L */}
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

        {/* Cuarta fila - Z-M */}
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

        {/* Quinta fila - Espacio y controles */}
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

export const AutocompleteControlled = ({
  name,
  errors,
  control,
  options,
  setValue,
  limit = 5,
  labelName,
  fnc_enlace,
  createItem,
  rules = {},
  handleOnBlur,
  className = '',
  fnc_loadOptions,
  handleOnChanged,
  loadMoreResults,
  placeholder = '',
  createAndEditItem,
  is_edit = false,
  editConfig = { config: {} },
  disableFrmIsChanged = false,
  enableVirtualKeyboard = false,
  useNumericKeyboard = false,
  isInsideModal = false,
}: AutocompleteControlledProps) => {
  const { setFrmIsChanged } = useAppStore()
  const { config } = editConfig
  const [loading, setLoading] = useState(false)
  const [enlaceLoading, setEnlaceLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const [keyboardPosition, setKeyboardPosition] = useState<any>({ position: 'bottom' })
  const inputRef = useRef<HTMLDivElement>(null)
  const activeInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (showKeyboard) {
      globalKeyboardState.showKeyboard = true
      globalKeyboardState.setShowKeyboard = setShowKeyboard
      globalKeyboardState.activeInputRef = activeInputRef.current
    }
  }, [showKeyboard])

  const calculateKeyboardPosition = useCallback(() => {
    if (!inputRef.current) return { position: 'bottom' as const }

    // Si está dentro de un modal, decidir basándose en la posición del input en la pantalla
    if (isInsideModal) {
      const inputRect = inputRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const windowMiddle = windowHeight / 2

      // Si el input está en la mitad superior de la pantalla, teclado abajo
      // Si está en la mitad inferior, teclado arriba
      if (inputRect.top < windowMiddle) {
        return { position: 'bottom' as const }
      } else {
        return { position: 'top' as const }
      }
    }

    // Si NO está en modal, usar la lógica original
    const inputRect = inputRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const keyboardHeight = useNumericKeyboard ? 350 : 280

    const spaceBelow = windowHeight - inputRect.bottom
    const spaceAbove = inputRect.top

    if (spaceBelow < keyboardHeight && spaceAbove > keyboardHeight) {
      return { position: 'top' as const }
    }

    return { position: 'bottom' as const }
  }, [useNumericKeyboard, isInsideModal])

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    if (handleOnBlur) handleOnBlur(e.target.value)
    setIsFocused(false)
  }

  const executeEnlace = async (value: number) => {
    if (fnc_enlace) {
      setEnlaceLoading(true)
      await fnc_enlace(value, name)
      setEnlaceLoading(false)
    }
  }

  const handleVirtualKeyPress = useCallback(
    (key: string) => {
      const input = activeInputRef.current
      if (!input) {
        return
      }

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
        input.focus()
      }
    },
    [capsLock]
  )

  const toggleKeyboard = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const input = inputRef.current?.querySelector('input') as HTMLInputElement
      if (input) {
        activeInputRef.current = input
        globalKeyboardState.activeInputRef = input
      }

      if (
        globalKeyboardState.showKeyboard &&
        globalKeyboardState.setShowKeyboard &&
        !showKeyboard
      ) {
        globalKeyboardState.setShowKeyboard(false)
      }

      // Calcular posición antes de mostrar
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
    const input = inputRef.current?.querySelector('input') as HTMLInputElement
    if (input) {
      activeInputRef.current = input

      if (globalKeyboardState.showKeyboard && globalKeyboardState.activeInputRef !== input) {
        if (globalKeyboardState.setShowKeyboard) {
          globalKeyboardState.setShowKeyboard(false)
        }
      }
    }
  }, [])

  // Renderizar el teclado usando Portal
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

    // Renderizar el teclado directamente en el body usando Portal
    return createPortal(keyboardComponent, document.body)
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, field }) => {
        if (config?.[name]?.isEdit || is_edit) {
          let recordOption = options?.find((item) => item.value === value)
          return (
            <div className={className}>
              {recordOption ? (
                <div className="ls_view">
                  <span
                    className={fnc_enlace ? 'text-teal-600 cursor-pointer' : 'text-black'}
                    onClick={fnc_enlace ? () => executeEnlace(value) : undefined}
                  >
                    {recordOption?.label || value}
                  </span>
                </div>
              ) : (
                <span className="text-transparent">-</span>
              )}
            </div>
          )
        }
        return (
          <div className="w-full relative">
            <div className="w-full flex items-center group !min-w-40">
              <Autocomplete
                PaperComponent={(props) => (
                  <Paper
                    sx={{
                      fontSize: '14px !important',
                      textTransform: 'none !important',
                      zIndex: 9999,
                    }}
                    {...props}
                  />
                )}
                {...field}
                ref={inputRef}
                onOpen={async () => {
                  setIsFocused(true)
                  setLoading(true)
                  await fnc_loadOptions()
                  setLoading(false)
                }}
                onFocus={(e) => {
                  handleInputFocus()
                  if (enableVirtualKeyboard && !showKeyboard) {
                    // Simular el toggle automático del teclado
                    const position = calculateKeyboardPosition()
                    setKeyboardPosition(position)
                    setShowKeyboard(true)

                    // Registrar el input activo
                    const input = inputRef.current?.querySelector('input') as HTMLInputElement
                    if (input) {
                      activeInputRef.current = input
                      globalKeyboardState.activeInputRef = input
                      globalKeyboardState.showKeyboard = true
                      globalKeyboardState.setShowKeyboard = setShowKeyboard
                    }
                  }
                }}
                onChange={async (_, data) => {
                  handleOnChanged?.(data)
                  if (!disableFrmIsChanged) setFrmIsChanged(true)
                  if (typeof data?.value === 'string') {
                    // Cerrar el teclado cuando se selecciona una opción extra
                    if (showKeyboard) {
                      closeKeyboard()
                    }

                    const newValue = data?.value.split('-')
                    if (newValue.length === 1) {
                      setLoading(true)
                      createItem?.(newValue[0])
                      setLoading(false)
                    }

                    if (data?.value.includes('-create')) {
                      createAndEditItem?.(newValue[0])
                    }
                    if (data?.value.includes('-search')) {
                      loadMoreResults?.(newValue[0] || '')
                    }
                  } else {
                    onChange(data?.value || '')
                    if (labelName) setValue(labelName, data?.label || '')
                    setLoading(false)
                  }
                }}
                value={options?.find((option) => value && option?.value === value) || null}
                className={className ? className : 'InputEx Autocomplete2Ex w-full'}
                includeInputInList
                options={options || []}
                isOptionEqualToValue={(option, value) => option.value == value.value}
                getOptionLabel={(option) => {
                  if (typeof option.value === 'string') {
                    return ''
                  } else {
                    return option?.label ?? ''
                  }
                }}
                renderOption={(props, option) => {
                  if (option.hasParents && option.value !== option.hasParents) return <></>

                  return (
                    <li {...props} key={option.value}>
                      <span className={typeof option.value === 'string' ? 'text-teal-700 ' : ''}>
                        {option.label ?? ''}
                      </span>
                    </li>
                  )
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={placeholder}
                    error={!!errors[name]}
                    helperText={errors[name] ? errors[name].message : null}
                    variant="standard"
                    className="capitalize"
                    onBlur={handleBlur}
                    onFocus={handleInputFocus}
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress color="inherit" size={16} /> : null}
                            {enableVirtualKeyboard && (
                              <Tooltip title="Teclado virtual" placement="bottom">
                                <div
                                  data-keyboard-icon
                                  className="cursor-pointer"
                                  onMouseDown={toggleKeyboard}
                                ></div>
                              </Tooltip>
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      },
                    }}
                  />
                )}
                filterOptions={(options, params) => {
                  const { inputValue } = params
                  const filteredOptions = options?.filter((option) => {
                    if (option?.label) {
                      return option?.label.toLowerCase().includes(params.inputValue.toLowerCase())
                    }
                  })
                  let filterResult = filteredOptions.slice(0, limit)
                  filterResult.push(
                    ...extraOptions(inputValue, createItem, createAndEditItem, loadMoreResults)
                  )
                  return filterResult
                }}
              />
              {value && fnc_enlace ? (
                <>
                  {enlaceLoading ? (
                    <CircularProgress color="inherit" size={16} />
                  ) : (
                    <Tooltip title="Enlace interno" placement="bottom">
                      <div
                        className={`o_icon_enl cursor-pointer ml-1`}
                        onClick={() => executeEnlace(value)}
                      >
                        <TbArrowNarrowRight
                          className={`group-hover:inline-block ${isFocused ? ' inline-block ' : ' hidden '} o_icon_enl w-6 h-6 text-gray-500 hover:text-teal-600`}
                        />
                      </div>
                    </Tooltip>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>

            {/* Renderizar el teclado usando Portal */}
            {renderKeyboard()}
          </div>
        )
      }}
    />
  )
}

const extraOptions = (
  inputValue: any,
  createItem: any,
  createAndEditItem: any,
  loadMoreResults: any
) => {
  let extraOpts = []

  if (inputValue.length > 0 && createItem) {
    extraOpts.push({
      value: inputValue,
      label: `Crear "${inputValue}"`,
    })
  }

  if (inputValue.length > 0 && createAndEditItem) {
    extraOpts.push({
      value: `${inputValue}-create`,
      label: `Crear y Editar ...`,
    })
  }

  if (loadMoreResults) {
    extraOpts.push({
      value: `${inputValue}-search`,
      label: `Buscar más...`,
    })
  }

  return extraOpts
}
