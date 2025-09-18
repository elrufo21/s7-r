import { OptionsType } from '@/shared/ui/inputs/input.types'
import useAppStore from '@/store/app/appStore'
import { useCallback, useState, useEffect } from 'react'

export type AttributeValue = {
  attribute_value_id: string
  label: string
  value: string
}

export const useAttributesOptions = () => {
  const [attributes, setAttributes] = useState<OptionsType[]>([])
  const [values, setValues] = useState<Record<string, OptionsType[]>>({})
  const { createOptions } = useAppStore()

  // Cargar atributos una sola vez
  const loadAttributes = useCallback(async () => {
    try {
      const attributesData: OptionsType[] = await createOptions({
        fnc_name: 'fnc_product_attributes_template',
        action: 's2',
      })
      setAttributes(attributesData ?? []) // 👀 Evita valores `undefined`
    } catch (error) {
      console.error('Error cargando atributos:', error)
    }
  }, [createOptions])

  const loadValues = useCallback(
    async (attribute_id: string): Promise<void> => {
      if (!attribute_id) return

      try {
        const valuesData: AttributeValue[] = await createOptions({
          fnc_name: 'fnc_product_attributes_template',
          action: 's3',
          filters: [attribute_id],
        })

        // Transformar los datos añadiendo label y value
        const transformedValues =
          valuesData?.map((item) => ({
            ...item,
            label: item.name,
            value: item.attribute_value_id,
          })) ?? []

        setValues((prevValues) => ({
          ...prevValues,
          [attribute_id]: transformedValues,
        }))
      } catch (error) {
        console.error(`Error cargando valores para ${attribute_id}:`, error)
      }
    },
    [createOptions]
  )
  useEffect(() => {
    if (attributes?.length > 0) {
      Promise.all(attributes.map((attribute) => loadValues(attribute.value)))
    }
  }, [attributes, loadValues])

  return { attributes, values, loadAttributes }
}
