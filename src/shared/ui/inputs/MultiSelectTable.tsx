import { useEffect, useRef, useState } from 'react'
import Chip from '@mui/material/Chip'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { Paper } from '@mui/material'
import { TaxFormType } from '@/modules/invoicing/invoice.types'

interface MultiSelecTableProps {
  row: any
  column: any
  listName: string
  itemName: string
  options: any[]
  onChange: (data: { rowId: number; columnId: string; option: any[] }) => void
  createOpt?: boolean
  editOpt?: boolean
  searchOpt?: boolean
  limit?: number
  renderTags?: any
}

export const MultiSelecTable = ({
  row,
  column,
  listName,
  itemName,
  options: listOptions,
  onChange,
  createOpt = false,
  editOpt = false,
  searchOpt = false,
  limit = 10,
  renderTags,
}: MultiSelecTableProps) => {
  const divRef = useRef(null)
  const inputRef = useRef<any>(null)
  const [isEditing, setIsEditing] = useState<{ rowId?: number; columnId?: number; option?: any }>(
    {}
  )
  const [currentValue, setCurrentValue] = useState<Record<string, any>[]>([])
  const [options, setOptions] = useState<(TaxFormType & { label: string; value: string })[]>([])

  useEffect(() => {
    setCurrentValue(() => {
      const list_elem = row.original[column.id] ?? []
      const formatImp = list_elem.map((imp: any) => ({
        label: imp?.label ?? '',
        tax_id: imp?.tax_id ?? '',
        idRow: row.original.product_id,
      }))
      const lastProductId = formatImp.at(-1)?.idRow ?? -1
      return formatImp.filter((imp: any) => imp.idRow === lastProductId)
    })
  }, [column.id, row])

  const align = column.columnDef.align

  const handleBlur = () => {
    setIsEditing({})
  }

  const handleOnChanged = (data: Record<string, any>[]) => {
    const clearData = Array.from(new Map(data.map((item) => [item.tax_id, item])).values())
    setCurrentValue(clearData)
    onChange({ rowId: row.index, columnId: column.id, option: clearData })
  }

  const handleClick = () => {
    setIsEditing({ rowId: row.id, columnId: column.id })
  }

  const extraOptions = (inputValue: string) => {
    let options: any[] = []
    const create = {
      value: inputValue,
      label: `Crear "${inputValue}"`,
    }
    const createEdit = {
      value: `${inputValue}-create`,
      label: `Crear y Editar ...`,
    }
    const search = {
      value: `${inputValue}-search`,
      label: `Buscar más...`,
    }
    if (createOpt && inputValue.length > 0) {
      options.push(create)
    }

    if (editOpt && inputValue.length > 0) {
      options.push(createEdit)
    }
    if (searchOpt) {
      options.push(search)
    }
    return options
  }

  useEffect(() => {
    if (isEditing && isEditing.rowId === row.id && isEditing.columnId === column.id) {
      if (inputRef.current) inputRef.current.focus()
    }
  }, [isEditing])

  useEffect(() => {
    setOptions(listOptions)
  }, [listOptions])

  return isEditing && isEditing.rowId === row.id && isEditing.columnId === column.id ? (
    <Autocomplete
      //blurOnSelect={handleBlur}
      onBlur={handleBlur}
      PaperComponent={(props) => (
        <Paper
          sx={{
            fontSize: '14px !important',
          }}
          {...props}
        />
      )}
      multiple
      filterSelectedOptions
      options={options}
      size="small"
      value={currentValue || []}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.value}>
            <span className={typeof option.value === 'string' ? 'text-teal-700 ' : ''}>
              {option.label}
            </span>
          </li>
        )
      }}
      renderTags={(value, getTagProps) => {
        if (renderTags) {
          return renderTags(value, getTagProps)
        } else {
          return value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.value}
              className="text-gray-100"
              label={option.label}
              size="small"
            />
          ))
        }
      }}
      getOptionLabel={(option) => option.label}
      getOptionKey={(option) => option.value}
      className="w-full autocompleteEx_table"
      isOptionEqualToValue={(option, value) => option.value === value.value}
      filterOptions={(options, params) => {
        const { inputValue } = params
        let avaliableOptions = options
        if (listName && itemName) {
          const listId = (row.original[listName] ?? []).map((item: any) => item[itemName])
          avaliableOptions = options.filter((option) => !listId.includes(option[itemName]))
        }

        if (!inputValue) return avaliableOptions.slice(0, limit)

        const filteredOptions = avaliableOptions?.filter((option) =>
          option?.label?.toLowerCase().includes(inputValue.toLowerCase())
        )

        let filterResult = filteredOptions.slice(0, limit)
        filterResult.push(...extraOptions(inputValue))
        return filterResult
      }}
      onChange={(_, data) => {
        let ndata = data[data.length - 1]
        if (handleOnChanged) handleOnChanged(data)

        if (typeof ndata?.value === 'string') {
          const newValue = ndata?.value.split('-')
          if (newValue.length === 1) {
            // await createrExpress(data)
          }

          if (ndata?.value.includes('-create')) {
            // setOpen(true)
            //create & edit
          }
          if (ndata?.value.includes('-search')) {
            //search
            // setOpenSearch(true)c
          }
        } else {
          //field.onChange(data || []);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          slotProps={{
            htmlInput: {
              ...params.inputProps,
              style: { textAlign: align },
            },
          }}
          onBlur={handleBlur}
          inputRef={inputRef}
        />
      )}
    />
  ) : (
    <div ref={divRef} onClick={handleClick} className="InputEx o_form_label">
      {currentValue?.length > 0 ? (
        <div className="flex flex-wrap">
          {currentValue.map((item, index) => (
            <Chip key={index} label={item.label} size="small" className="m-1" />
          ))}
        </div>
      ) : (
        <span className="text-transparent">-</span>
      )}
    </div>
  )
}
