import Chip from '@mui/material/Chip'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { Controller } from 'react-hook-form'
import { ReactNode, useState } from 'react'
import { CircularProgress, Paper } from '@mui/material'

type MultiSelectObjectProps = {
  name: string
  control: any
  options: any[]
  errors: any
  rules?: any
  renderTags?: (value: any, getTagProps: any) => ReactNode
  fnc_loadOptions: (value?: any) => void
  placeholder?: string
  className?: string
  handleSearchOpt?: () => void
  handleOnChanged?: (data: any) => void
  fnc_create?: (data: any) => void
  createOpt?: boolean
  editOpt?: boolean
  searchOpt?: boolean
  limit?: number
  editConfig?: { config: any }
}

export const MultiSelectObject = ({
  name,
  control,
  options,
  errors,
  rules = {},
  renderTags,
  fnc_loadOptions,
  placeholder = '',
  className,
  handleOnChanged,
  handleSearchOpt,
  fnc_create,
  createOpt = false,
  editOpt = false,
  searchOpt = false,
  limit = 10,
  editConfig = { config: {} },
}: MultiSelectObjectProps) => {
  const { config } = editConfig

  const [loading, setLoading] = useState(false)

  const viewTags = (values: any) => {
    console.log(values)
    if (renderTags) {
      return renderTags(values, () => {})
    } else {
      //field.value.map((item, index) => {
      //  return <Chip key={index} label={item.label} size="small" className="text-gray-700" />;
      //});
    }
    return <></>
  }

  const createrExpress = (data: any) => {
    console.log(data)
    if (fnc_create) fnc_create(data)
  }

  const extraOptions = (inputValue: any) => {
    let options = []
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

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        if (config?.[name]?.isEdit) {
          return (
            <div className={className}>
              {field?.value?.length > 0 ? (
                viewTags(field.value)
              ) : (
                <span className="text-transparent">-</span>
              )}
            </div>
          )
        }

        return (
          <Autocomplete
            PaperComponent={(props) => (
              <Paper
                sx={{
                  fontSize: '14px !important',
                  // textTransform: "capitalize !important",
                }}
                {...props}
              />
            )}
            {...field}
            multiple
            filterSelectedOptions
            options={options}
            size="small"
            onChange={async (_, data) => {
              let ndata = data[data.length - 1]
              if (handleOnChanged !== null) {
                if (handleOnChanged) handleOnChanged(data)
              }
              if (typeof ndata?.value === 'string') {
                const newValue = ndata?.value.split('-')
                if (newValue.length === 1) {
                  setLoading(true)
                  await createrExpress(data)

                  setLoading(false)
                }

                if (ndata?.value.includes('-create')) {
                  // setOpen(true)
                  //create & edit
                }
                if (ndata?.value.includes('-search')) {
                  //search
                  if (handleSearchOpt) {
                    handleSearchOpt()
                  }
                  console.log('buscar')
                }
              } else {
                field.onChange(data || [])
                setLoading(false)
              }
            }}
            value={field?.value ?? []}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.value}>
                  <span className={typeof option.value === 'string' ? 'text-teal-700 ' : ''}>
                    {option.label}
                  </span>
                </li>
              )
            }}
            onOpen={() => {
              setLoading(true)
              fnc_loadOptions(field.value)
              setLoading(false)
            }}
            renderTags={(value, getTagProps) => {
              if (renderTags) {
                return renderTags(value, getTagProps)
              } else {
                return value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.label + index}
                    className="text-gray-100"
                    label={option.label}
                    size="small"
                  />
                ))
              }
            }}
            getOptionLabel={(option) => option.label}
            getOptionKey={(option) => option.value}
            className={className ? className : 'InputEx AutocompleteChip2Ex w-full'}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            filterOptions={(options, params) => {
              const { inputValue } = params
              const filteredOptions = options?.filter((option) => {
                // const isExisting = options.some((option) => inputValue === option.label);

                if (option?.label) {
                  return option?.label.toLowerCase().includes(params.inputValue.toLowerCase())
                }
              })
              let filterResult = filteredOptions.slice(0, limit)
              filterResult.push(...extraOptions(inputValue))
              // }
              return filterResult
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeholder}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                // readOnly={readOnly}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={16} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                error={errors[name] ? true : false}
              />
            )}
          />
        )
      }}
    />
  )
}
