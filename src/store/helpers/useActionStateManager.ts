import { useEffect, useRef } from 'react'
import { useClearActionState } from './clearActionState'

/**
 * Hook personalizado para manejar la limpieza del estado cuando cambia de action
 * Evita bucles infinitos y solo limpia cuando es necesario
 */
export const useActionStateManager = (idAction: string | undefined) => {
  const { clearActionState } = useClearActionState()
  const previousIdAction = useRef<string | undefined>()
  const isInitialMount = useRef(true)

  useEffect(() => {
    // No limpiar en el montaje inicial
    if (isInitialMount.current) {
      isInitialMount.current = false
      previousIdAction.current = idAction
      return
    }

    // Solo limpiar si cambió de action
    if (idAction && previousIdAction.current && idAction !== previousIdAction.current) {
      clearActionState()
    }

    previousIdAction.current = idAction
  }, [idAction, clearActionState])

  return { previousIdAction: previousIdAction.current }
}
