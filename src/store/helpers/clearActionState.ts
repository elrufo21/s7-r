import useAppStore from '../app/appStore'
import useUserStore from '../persist/persistStore'
import { ViewTypeEnum } from '@/shared/shared.types'
import { useCallback } from 'react'

/**
 * Helper para limpiar completamente el estado cuando se cambia de action
 * Esto resuelve el problema de que se mantengan los filtros y counter page
 * al cambiar entre diferentes actions
 */
export const useClearActionState = () => {
  const {
    clearPaginationState,
    clearGridState,
    setBreadcrumb,
    setSearchFiltersLabel,
    setFiltersLocal,
    setListGroupBy,
    setViewType,
    setTabForm,
  } = useAppStore()

  const { clearFilters } = useUserStore()

  const clearActionState = useCallback(() => {
    // Limpiar estado de paginación
    clearPaginationState()
    clearGridState()

    // Limpiar filtros
    clearFilters()

    // Limpiar breadcrumb y navegación
    setBreadcrumb([])
    setSearchFiltersLabel([])
    setFiltersLocal([])
    setListGroupBy([])

    // Resetear vista y tabs
    setViewType(ViewTypeEnum.KANBAN)
    setTabForm(0)
  }, [
    clearPaginationState,
    clearGridState,
    clearFilters,
    setBreadcrumb,
    setSearchFiltersLabel,
    setFiltersLocal,
    setListGroupBy,
    setViewType,
    setTabForm,
  ])

  return { clearActionState }
}
