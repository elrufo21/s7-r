import { Autocomplete, CircularProgress, Paper, TextField, Tooltip } from '@mui/material'
import { FocusEvent, useState } from 'react'
import { TbArrowNarrowRight } from 'react-icons/tb'
import { Controller } from 'react-hook-form'

import { OptionsType } from './input.types'

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
}: AutocompleteControlledProps) => {
  const { config } = editConfig
  const [loading, setLoading] = useState(false)
  const [enlaceLoading, setEnlaceLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

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
                <div
                  className={fnc_enlace ? 'text-teal-600 cursor-pointer' : 'text-black'}
                  onClick={fnc_enlace ? () => executeEnlace(value) : undefined}
                >
                  {recordOption?.label || value}
                </div>
              ) : (
                <span className="text-transparent">-</span>
              )}
            </div>
          )
        }
        return (
          <div className="w-full flex items-center group !min-w-40">
            <Autocomplete
              PaperComponent={(props) => (
                <Paper
                  sx={{
                    fontSize: '14px !important',
                    textTransform: 'none !important',
                  }}
                  {...props}
                />
              )}
              {...field}
              onOpen={async () => {
                setIsFocused(true)
                setLoading(true)
                await fnc_loadOptions()
                setLoading(false)
              }}
              onChange={async (_, data) => {
                handleOnChanged?.(data)

                if (typeof data?.value === 'string') {
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
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? <CircularProgress color="inherit" size={16} /> : null}
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
