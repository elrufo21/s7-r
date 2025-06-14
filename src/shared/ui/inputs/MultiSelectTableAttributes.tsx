import { useEffect, useRef, useState } from 'react'
import Chip from '@mui/material/Chip'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { Paper } from '@mui/material'

interface MultiSelecTableProps {
  row: any
  column: any
  options: any[]
  onChange: (data: { rowId: number; columnId: string; option: any[] }) => void
  onOpen?: () => Promise<void>
  renderTags?: any
  fnc_create?: (data: any) => void
  createOpt?: boolean
  limit?: number
}

export const MultiSelecTableAttributes = ({
  row,
  column,
  options: listOptions,
  onChange,
  onOpen,
  renderTags,
  fnc_create,
  createOpt = false,
  limit = 10,
}: MultiSelecTableProps) => {
  const divRef = useRef(null)
  const inputRef = useRef<any>(null)
  const [isEditing, setIsEditing] = useState<{ rowId?: number; columnId?: number; option?: any }>(
    {}
  )
  const [currentValue, setCurrentValue] = useState<Record<string, any>[]>([])
  const [options, setOptions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const selectedValues = row.original[column.id] || []
    const formattedValues = selectedValues.map((val: any) => ({
      ...val,
      label: val.label || val.name,
      value: val.value || val.attribute_value_id,
      idRow: val.idRow || row.original.attribute,
      ...(val.tax_id && { tax_id: val.tax_id }),
    }))
    setCurrentValue(formattedValues)
  }, [row.original, column.id])

  useEffect(() => {
    const formattedOptions = listOptions.map((opt) => ({
      ...opt,
      label: opt.label || opt.name,
      value: opt.value || opt.attribute_value_id,
      ...(opt.tax_id && { tax_id: opt.tax_id }),
    }))
    setOptions(formattedOptions)
  }, [listOptions])

  const handleBlur = () => {
    setIsEditing({})
  }

  const extraOptions = (inputValue: string) => {
    let extraOpts = []
    if (createOpt && inputValue.length > 0) {
      extraOpts.push({
        value: inputValue,
        label: `Crear "${inputValue}"`,
      })
    }
    return extraOpts
  }

  const handleOnChanged = async (data: Record<string, any>[]) => {
    const formattedData = data.map((item) => ({
      ...item,
      label: item.label || item.name,
      value: item.value || item.attribute_value_id,
      idRow: row.original.attribute,
      ...(item.tax_id && { tax_id: item.tax_id }),
    }))

    const uniqueData = Array.from(new Map(formattedData.map((item) => [item.value, item])).values())

    // Manejar la creación de nuevas opciones
    const lastItem = data[data.length - 1]
    if (typeof lastItem?.value === 'string' && fnc_create) {
      try {
        setIsLoading(true)
        fnc_create(lastItem)
      } catch (error) {
        console.error('Error al crear:', error)
      } finally {
        setIsLoading(false)
      }
    }

    setCurrentValue(uniqueData)

    onChange({
      rowId: row.index,
      columnId: column.id,
      option: uniqueData,
    })
  }

  const handleClick = async () => {
    setIsEditing({ rowId: row.id, columnId: column.id })

    if (onOpen) {
      try {
        setIsLoading(true)
        await onOpen()
      } catch (error) {
        console.error('Error en onOpen:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    if (isEditing && isEditing.rowId === row.id && isEditing.columnId === column.id) {
      if (inputRef.current) inputRef.current.focus()
    }
  }, [isEditing])

  return isEditing && isEditing.rowId === row.id && isEditing.columnId === column.id ? (
    <Autocomplete
      multiple
      onBlur={handleBlur}
      PaperComponent={(props) => <Paper sx={{ fontSize: '14px !important' }} {...props} />}
      filterSelectedOptions
      options={options}
      size="small"
      value={currentValue}
      loading={isLoading}
      getOptionLabel={(option) => option.label || ''}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      renderOption={(props, option) => (
        <li {...props} key={option.value}>
          <span className={typeof option.value === 'string' ? 'text-teal-700' : ''}>
            {option.label || option.name}
          </span>
        </li>
      )}
      renderTags={(value, getTagProps) => {
        if (renderTags) {
          return renderTags(value, getTagProps)
        }
        return value.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option.value}
            label={option.label || option.name}
            size="small"
          />
        ))
      }}
      onChange={(_, data) => handleOnChanged(data)}
      className="w-full autocompleteEx_table"
      filterOptions={(options, params) => {
        const { inputValue } = params
        const filteredOptions = options.filter((option) =>
          option?.label?.toLowerCase().includes(params.inputValue.toLowerCase())
        )
        const limitedOptions = filteredOptions.slice(0, limit)
        return [...limitedOptions, ...extraOptions(inputValue)]
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          inputRef={inputRef}
          autoFocus
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <span>Cargando..........</span> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  ) : (
    <div ref={divRef} onClick={handleClick} className="InputEx o_form_label">
      {currentValue?.length > 0 ? (
        <div className="flex flex-wrap">
          {currentValue.map((item) => (
            <Chip key={item.value} label={item.label || item.name} size="small" className="m-1" />
          ))}
        </div>
      ) : (
        <span className="text-transparent">-</span>
      )}
    </div>
  )
}
