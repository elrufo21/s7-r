import useAppStore from '@/store/app/appStore'
import { useState, useEffect, useCallback } from 'react'
import { OptionsType } from '@/shared/ui/inputs/input.types'
export type Filter =
  | [0, 'fequal' | 'flike', string, string | number]
  | ['s2', string, string, string | string[]]
  | { column: string; value: string | number }
type UseAutocompleteFieldProps = {
  initialValue?: { id: string | number; name: string }
  fncName: string
  action?: string
  idField: string
  nameField: string
  setValue?: (name: string, value: any) => void
  onChangeCallback?: (data: any) => void
  formItem?: any
  filters?: Filter[]
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

  // SOLUCIÓN 1: Agregar los valores específicos como dependencias
  const currentId = formItem?.[idField]
  const currentName = formItem?.[nameField]

  useEffect(() => {
    if (currentId && currentName) {
      setOptions((prevOptions) => {
        // Buscar si ya existe una opción con este ID
        const existingIndex = prevOptions.findIndex((opt) => opt.value === currentId)

        if (existingIndex !== -1) {
          // Si existe, actualizar la etiqueta si ha cambiado
          const existingOption = prevOptions[existingIndex]
          if (existingOption.label !== currentName) {
            const updatedOptions = [...prevOptions]
            updatedOptions[existingIndex] = {
              ...existingOption,
              label: currentName,
            }
            return updatedOptions
          }
          return prevOptions
        } else {
          // Si no existe, añadirla
          return [
            ...prevOptions,
            {
              value: currentId,
              label: currentName,
            },
          ]
        }
      })
    }
  }, [currentId, currentName]) // Dependencias específicas

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
