import { RegisterOptions } from 'react-hook-form'

export const required = (message = ''): RegisterOptions => ({
  required: { value: true, message },
})

const GLOBAL_FIELD_LABELS: Record<string, string> = {
  name: 'Nombre',
  email: 'Correo electrónico',
  phone: 'Teléfono',
  description: 'Descripción',
}

export const getRequiredFieldErrors = (
  errors: Record<string, any>,
  configFieldLabels?: Record<string, string>
): string[] => {
  const missingFields: string[] = []

  Object.entries(errors).forEach(([fieldName, error]) => {
    // Verificar si es un error de campo requerido
    const isRequiredError =
      error?.type === 'required' ||
      error?.message === 'Este campo es requerido' ||
      error?.message === '' ||
      !error?.message

    if (isRequiredError) {
      // Prioridad: configFieldLabels > GLOBAL_FIELD_LABELS > fieldName formateado
      const fieldLabel =
        configFieldLabels?.[fieldName] ||
        GLOBAL_FIELD_LABELS[fieldName] ||
        formatFieldName(fieldName)

      missingFields.push(fieldLabel)
    }
  })

  return missingFields
}

// Función auxiliar para formatear nombres de campos
const formatFieldName = (fieldName: string): string => {
  return fieldName
    .replace(/_/g, ' ') // Reemplaza guiones bajos con espacios
    .replace(/([A-Z])/g, ' $1') // Agrega espacio antes de mayúsculas
    .toLowerCase() // Convierte a minúsculas
    .replace(/^./, (str) => str.toUpperCase()) // Capitaliza la primera letra
}
