import { ManagerContent } from '@/shared/components/core'
import { useModuleList } from '@/shared/hooks/useModule'
import useAppStore from '@/store/app/appStore'
import useUserStore from '@/store/persist/persistStore'
import { useActionStateManager } from '@/store/helpers/useActionStateManager'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { offlineCache } from '@/lib/offlineCache'

export const ActionShow = () => {
  const { idAction } = useParams()
  const { filters, user } = useUserStore()
  // Usar el hook personalizado para manejar la limpieza del estado
  useActionStateManager(idAction)

  const {
    setInitialData,
    setGroupByData,
    viewType,
    setViewType,
    listCurrentPage,
    config,
    setFrmLoading,
    viewTypeFromConfig,
    setViewTypeFromConfig,
    setTabForm,
  } = useAppStore()

  const { data, isLoading } = useModuleList({
    filters: [...filters, ...(config?.aditionalFilters ? config.aditionalFilters : [])],
    fncName: config.fnc_name,
    module: config.module,
    id: idAction ?? '',
  })
  //desarrollo permisos.
  useEffect(() => {
    offlineCache.ensureDefaultDeletePermissions(1, [400, 201, 202, 401, 402, 888])
    offlineCache.ensureDefaultCreatePermissions(1, [400, 201, 202, 401, 402, 888])
  }, [])
  useEffect(() => {
    setFrmLoading(isLoading)
  }, [isLoading, setFrmLoading])

  // El hook useActionStateManager se encarga de limpiar el estado cuando cambia de action

  useEffect(() => {
    if (data) {
      setInitialData({
        data: data.oj_data ?? [],
        total: data.oj_info?.total_count ?? 0,
      })
    }
  }, [data, setInitialData, viewType, listCurrentPage, config.module_url, idAction])
  useEffect(() => {
    if (viewTypeFromConfig && config.module_url === location.pathname) {
      console.log('config.view_default', config.view_default)
      setViewType(config.view_default)
      setViewTypeFromConfig(false)
      setTabForm(0)
      return
    }
  }, [viewTypeFromConfig, config])

  useEffect(() => {
    if (data && data.oj_gby_data) {
      setGroupByData(data.oj_gby_data)
    }
  }, [data, setGroupByData])
  //if (isLoading) return <KanbanLaoder />
  return <ManagerContent />
}
