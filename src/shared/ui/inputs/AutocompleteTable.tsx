import { Autocomplete, TextField, Tooltip } from '@mui/material'
import { Row } from '@tanstack/react-table'
import React, {
  ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { TbArrowNarrowRight } from 'react-icons/tb'

interface AutocompleteTableProps {
  row: Row<any>
  column: any
  options: any[]
  limit?: number
  onChange: (option: { rowId: number; columnId: string; option: Record<string, any> }) => void
  navFunction?: (value: number) => void
  endContent?: ReactNode
  placeholder?: string
  createOpt?: boolean
  editOpt?: ((value: string) => void) | undefined
  addOption?: boolean | undefined
  searchOpt?: ((value?: string) => void) | undefined
  fnc_create?: ((data: string) => Promise<void>) | undefined
}

export const AutocompleteTable = ({
  row,
  column,
  options,
  limit = 10,
  onChange,
  navFunction,
  endContent,
  placeholder = '',
  editOpt,
  searchOpt,
  fnc_create,
}: AutocompleteTableProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [currentValue, setCurrentValue] = useState(row.original[column.id] || null)
  const [currentLabel, setCurrentLabel] = useState('')
  const [inputValue, setInputValue] = useState('')

  const inputRef = useRef<HTMLDivElement>(null)
  const optionsMemo = useMemo(() => options ?? [], [options])

  const navToLink = (e: React.MouseEvent, value: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (navFunction) {
      navFunction(value)
    }
  }

  const handleOnChange = (e: SyntheticEvent<Element, Event>, data: any) => {
    e.preventDefault()
    setCurrentValue(data.value)
    updateCurrentLabel()
    onChange({ rowId: row.index, columnId: column.id, option: data })
  }
  const updateCurrentLabel = useCallback(() => {
    setCurrentLabel(optionsMemo?.find((item) => item.value === currentValue)?.label || '')
  }, [currentValue, optionsMemo])

  // Update currentValue when row data changes
  useEffect(() => {
    const newValue = row.original[column.id]
    if (newValue !== currentValue) {
      setCurrentValue(newValue)
    }
  }, [row.original, column.id, currentValue])

  useEffect(() => {
    if (optionsMemo.length > 0) {
      updateCurrentLabel()
    }
  }, [optionsMemo, updateCurrentLabel])

  const handleCreateAndEdit = async (inputValue: string) => {
    if (editOpt !== undefined) {
      editOpt(inputValue)
    }
  }

  const handleSearchMore = () => {
    if (searchOpt !== undefined) {
      searchOpt()
    }
  }

  const createrExpress = async (inputValue: string) => {
    if (fnc_create !== undefined) {
      await fnc_create(inputValue)
    }
  }

  const extraOptions = (inputValue: string) => {
    let extraOpts = []

    // Solo agrega "Crear" si fnc_create existe y hay texto ingresado
    if (inputValue.length > 0 && fnc_create !== undefined) {
      extraOpts.push({
        value: inputValue,
        label: `Crear "${inputValue}"`,
      })
    }

    // Solo agrega "Crear y Editar" si editOpt existe y hay texto ingresado
    if (inputValue.length > 0 && editOpt !== undefined) {
      extraOpts.push({
        value: `${inputValue}-create`,
        label: `Crear y Editar ...`,
      })
    }

    // Solo agrega "Buscar más" si searchOpt existe
    if (searchOpt !== undefined) {
      extraOpts.push({
        value: `${inputValue}-search`,
        label: `Buscar más...`,
      })
    }

    return extraOpts
  }

  if (isEditing) {
    return (
      <Autocomplete
        onBlur={() => setIsEditing(false)}
        options={optionsMemo}
        isOptionEqualToValue={(option, value) => option.value == value.value}
        getOptionLabel={(option) => option?.label || ''}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue)
        }}
        value={optionsMemo?.find((option) => option?.value === row.original[column.id]) || null}
        className="w-full autocompleteEx_table h-10 flex items-center"
        sx={{
          '& .MuiAutocomplete-listbox': {
            '::-webkit-scrollbar': {
              width: '8px',
            },
            '::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '::-webkit-scrollbar-thumb': {
              background: 'white',
              borderRadius: '4px',
            },
            scrollbarWidth: 'thin',
            scrollbarColor: 'white transparent',
          },
        }}
        filterOptions={(options, params) => {
          const filteredOptions = options?.filter((option) =>
            option?.label?.toLowerCase().includes(params.inputValue.toLowerCase())
          )

          let filterResult = filteredOptions.slice(0, limit)

          filterResult = [...filterResult, ...extraOptions(params.inputValue)]
          return filterResult
        }}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.value}>
              <span
                className={`${typeof option.value === 'string' ? 'text-teal-600' : ''} text-sm`}
              >
                {option.label}
              </span>
            </li>
          )
        }}
        renderInput={(params) => (
          <div className="flex items-center w-full">
            <TextField
              {...params}
              ref={inputRef}
              variant="standard"
              className="w-full"
              placeholder={placeholder}
              autoFocus
            />
            {currentValue && navFunction ? (
              <Tooltip title="Ver producto" placement="bottom">
                <button
                  type="button"
                  className="cursor-pointer ml-1 w-fit"
                  onClick={(e) => navToLink(e, currentValue)}
                >
                  <TbArrowNarrowRight className="w-5 h-6 text-gray-500 hover:text-teal-600" />
                </button>
              </Tooltip>
            ) : (
              <></>
            )}
            {endContent && endContent}
          </div>
        )}
        onChange={async (_, data) => {
          if (!data) return

          if (typeof data?.value === 'string') {
            if (data.value.includes('-create')) {
              const newValue = data.value.split('-')[0]
              handleCreateAndEdit(newValue)
            } else if (data.value.includes('-search')) {
              handleSearchMore()
            } else {
              await createrExpress(data.value)
            }
            setIsEditing(false)
          } else {
            handleOnChange(_, data)
          }
        }}
      />
    )
  }

  return (
    <div
      className={`input-text-table text-truncate !h-10 w-full`}
      onClick={() => setIsEditing(true)}
    >
      {currentLabel ? currentLabel : placeholder}
    </div>
  )
}
