import { useState, useEffect, useCallback } from 'react'
import useAppStore from '@/store/app/appStore'
import { OptionsType } from '@/shared/ui/inputs/input.types'

type LocationLevel = 'n1' | 'n2' | 'n3' | 'n4'

type UseLocationFieldProps = {
  level: LocationLevel
  formItem?: any
  idField: string
  nameField: string
  parentIdField?: string
  parentValue?: string | number | null
  setValue?: (name: string, value: any) => void
  onChangeCallback?: (data: any) => void
}

export const useLocationField = ({
  level,
  formItem,
  idField,
  nameField,
  parentIdField,
  parentValue,
  setValue,
  onChangeCallback,
}: UseLocationFieldProps) => {
  const [options, setOptions] = useState<OptionsType[]>([])
  const [loading, setLoading] = useState(false)
  const { createOptions, executeFnc } = useAppStore()
  const [hierarchyCache, setHierarchyCache] = useState<Record<string, any>>({})

  // Mapeo de nivel a nombre de función
  const getFunctionName = () => {
    const functionMap: Record<LocationLevel, string> = {
      n1: 'fnc_location_n1', // País
      n2: 'fnc_location_n2', // Departamento
      n3: 'fnc_location_n3', // Provincia
      n4: 'fnc_location_n4', // Distrito
    }
    return functionMap[level]
  }

  // Cargar opciones
  const loadOptions = useCallback(async () => {
    setLoading(true)
    try {
      const filters = [{ column: 'state', value: 'A' }]

      // Añadir filtro de padre si existe
      if (parentIdField && parentValue) {
        filters.push({ column: parentIdField, value: parentValue.toString() })
      }

      const result = await createOptions({
        fnc_name: getFunctionName(),
        filters,
        action: 's2',
      })
      setOptions(result)
      return result
    } catch (error) {
      console.error(`Error loading location options for ${level}:`, error)
      return []
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, parentIdField, parentValue, createOptions])

  // Recargar opciones (útil después de crear nuevos elementos)
  const reloadOptions = useCallback(async () => {
    return await loadOptions()
  }, [loadOptions])

  // Efecto para cargar opciones cuando cambia el valor del padre
  useEffect(() => {
    if (parentIdField === undefined || parentValue !== undefined) {
      loadOptions()
    }
  }, [parentIdField, parentValue, loadOptions])

  // Efecto para cargar valor inicial si existe
  useEffect(() => {
    if (formItem && formItem[idField]) {
      setOptions((prevOptions) => {
        // Verificar si la opción ya existe en el array para evitar duplicados
        const optionExists = prevOptions.some((opt) => opt.value === formItem[idField])

        // Si ya existe, no modificar el array
        if (optionExists) return prevOptions

        // Si no existe, añadir la nueva opción
        return [
          ...prevOptions,
          {
            value: formItem[idField],
            label: formItem[nameField] || formItem[`ln${level.charAt(1)}_name`],
          },
        ]
      })
    }
  }, [formItem, idField, nameField, level])

  // Obtener información completa de la ubicación seleccionada
  const getLocationDetails = useCallback(
    async (locationId: string | number) => {
      // Verificar si ya tenemos los datos en caché
      const cacheKey = `${level}_${locationId}`
      if (hierarchyCache[cacheKey]) {
        return hierarchyCache[cacheKey]
      }

      try {
        const response = await executeFnc(getFunctionName(), 'get', { id: locationId })

        if (response && response.oj_data) {
          // Guardar en caché para futuras referencias
          setHierarchyCache((prev) => ({
            ...prev,
            [cacheKey]: response.oj_data,
          }))
          return response.oj_data
        }
        return null
      } catch (error) {
        console.error(`Error fetching location details for ${level}:`, error)
        return null
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [level, executeFnc, hierarchyCache]
  )

  // Manejador de cambios
  const handleOnChanged = useCallback(
    async (data: any) => {
      if (!data || !setValue) return

      // Actualizar el campo de nombre actual
      if (data.label) {
        setValue(nameField, data.label)
      }

      // Si no tenemos información completa, obtenerla
      let locationDetails = data
      if (!data.ln1_id && level !== 'n1') {
        const details = await getLocationDetails(data.value)
        if (details) {
          locationDetails = details
        }
      }

      // Actualizar campos basados en el nivel
      updateLocationHierarchy(locationDetails)

      // Actualizar código postal si está disponible
      if (locationDetails.zip) {
        setValue('zip', locationDetails.zip)
      }

      // Llamar al callback si existe
      if (onChangeCallback) {
        onChangeCallback(locationDetails)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [level, setValue, nameField, onChangeCallback, getLocationDetails]
  )

  // Función auxiliar para actualizar la jerarquía de ubicación
  const updateLocationHierarchy = useCallback(
    (locationDetails: any) => {
      if (!setValue) return

      switch (level) {
        case 'n4': // Distrito
          updateDistrictHierarchy(locationDetails)
          break
        case 'n3': // Provincia
          updateProvinceHierarchy(locationDetails)
          break
        case 'n2': // Departamento
          updateDepartmentHierarchy(locationDetails)
          break
        case 'n1': // País
          clearChildLocations()
          break
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [level, setValue]
  )

  // Actualiza la jerarquía cuando se selecciona un distrito
  const updateDistrictHierarchy = useCallback(
    (details: any) => {
      if (!setValue) return

      // Actualizar provincia
      if (details.ln3_id) {
        setValue('ln3_id', details.ln3_id)
        setValue('ln3_name', details.ln3_name || '')
      }

      // Actualizar departamento
      if (details.ln2_id) {
        setValue('ln2_id', details.ln2_id)
        setValue('ln2_name', details.ln2_name || '')
      }

      // Actualizar país
      if (details.ln1_id) {
        setValue('ln1_id', details.ln1_id)
        setValue('ln1_name', details.ln1_name || '')
      }
    },
    [setValue]
  )

  // Actualiza la jerarquía cuando se selecciona una provincia
  const updateProvinceHierarchy = useCallback(
    (details: any) => {
      if (!setValue) return

      // Actualizar departamento
      if (details.ln2_id) {
        setValue('ln2_id', details.ln2_id)
        setValue('ln2_name', details.ln2_name || '')
      }

      // Actualizar país
      if (details.ln1_id) {
        setValue('ln1_id', details.ln1_id)
        setValue('ln1_name', details.ln1_name || '')
      }

      // Limpiar distrito
      clearDistrictLocation()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setValue]
  )

  // Actualiza la jerarquía cuando se selecciona un departamento
  const updateDepartmentHierarchy = useCallback(
    (details: any) => {
      if (!setValue) return

      // Actualizar país
      if (details.ln1_id) {
        setValue('ln1_id', details.ln1_id)
        setValue('ln1_name', details.ln1_name || '')
      }

      // Limpiar provincia y distrito
      clearProvinceLocation()
      clearDistrictLocation()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setValue]
  )

  // Funciones para limpiar ubicaciones hijas
  const clearDistrictLocation = useCallback(() => {
    if (!setValue) return
    setValue('ln4_id', null)
    setValue('ln4_name', '')
  }, [setValue])

  const clearProvinceLocation = useCallback(() => {
    if (!setValue) return
    setValue('ln3_id', null)
    setValue('ln3_name', '')
  }, [setValue])

  const clearChildLocations = useCallback(() => {
    if (!setValue) return
    setValue('ln2_id', null)
    setValue('ln2_name', '')
    setValue('ln3_id', null)
    setValue('ln3_name', '')
    setValue('ln4_id', null)
    setValue('ln4_name', '')
  }, [setValue])

  return {
    options,
    loading,
    loadOptions,
    reloadOptions,
    handleOnChanged,
  }
}
