import useAppStore from '@/store/app/appStore'
import { useState, useEffect, useCallback } from 'react'
import { OptionsType } from '@/shared/ui/inputs/input.types'

type UseAutocompleteFieldProps = {
  initialValue?: { id: string | number; name: string }
  fncName: string
  action?: string
  idField: string
  nameField: string
  setValue?: (name: string, value: any) => void
  onChangeCallback?: (data: any) => void
  formItem?: any
  filters?: Array<{ column: string; value: any }>
}

export const useAutocompleteField = ({
  initialValue,
  fncName,
  action = 's2',
  idField,
  nameField,
  setValue,
  onChangeCallback,
  formItem,
  filters = [],
}: UseAutocompleteFieldProps) => {
  const [options, setOptions] = useState<OptionsType[]>([])
  const [loading, setLoading] = useState(false)
  const { createOptions } = useAppStore()

  // Función para cargar opciones - usando useCallback para mantener la referencia estable
  const loadOptions = useCallback(async () => {
    setLoading(true)
    try {
      const result = await createOptions({
        fnc_name: fncName,
        action: action,
        filters: filters,
      })
      setOptions(result)
      return result
    } catch (error) {
      console.error(`Error loading options for ${fncName}:`, error)
      return []
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fncName, action, JSON.stringify(filters), createOptions])

  // Función para recargar opciones y posiblemente añadir una nueva opción
  const reloadOptions = useCallback(
    async (newOption?: OptionsType) => {
      const result = await loadOptions()

      // Si se proporciona una nueva opción, asegúrate de que esté en la lista
      if (newOption) {
        setOptions((prevOptions) => {
          const exists = prevOptions.some((opt) => opt.value === newOption.value)
          if (exists) return prevOptions
          return [...prevOptions, newOption]
        })
      }

      return result
    },
    [loadOptions]
  )

  // Efecto para cargar valor inicial si existe
  useEffect(() => {
    if (formItem && formItem[idField]) {
      setOptions((prevOptions) => {
        const exists = prevOptions.some((opt) => opt.value === formItem[idField])
        if (exists) return prevOptions

        return [
          ...prevOptions,
          {
            value: formItem[idField],
            label: formItem[nameField],
          },
        ]
      })
    }
  }, [formItem, idField, nameField])

  // Efecto para cargar valor inicial pasado directamente
  useEffect(() => {
    if (initialValue) {
      setOptions((prevOptions) => {
        const exists = prevOptions.some((opt) => opt.value === initialValue.id)
        if (exists) return prevOptions

        return [
          ...prevOptions,
          {
            value: initialValue.id,
            label: initialValue.name,
          },
        ]
      })
    }
  }, [initialValue])

  // Manejador de cambios
  const handleOnChanged = (data: any) => {
    if (onChangeCallback && data) {
      onChangeCallback(data)
    }

    // Si se proporciona setValue y nameField, actualizar el campo de etiqueta
    if (setValue && data?.label) {
      setValue(nameField, data.label)
    }
  }

  return {
    options,
    setOptions,
    loadOptions,
    reloadOptions,
    loading,
    handleOnChanged,
  }
}
