import { ManagerContent } from '@/shared/components/core'
import { useEffect } from 'react'
import useAppStore from '@/store/app/appStore'
import useUserStore from '@/store/persist/persistStore'
import { useModuleFilterList } from '@/shared/hooks/useModule'
import { ModulesEnum } from '@/shared/shared.types'
import { useLocation } from 'react-router-dom'
import { usePWA } from '@/hooks/usePWA'
import { offlineCache } from '@/lib/offlineCache'

export const PointOfSaleIndex = () => {
  const location = useLocation()
  const { isOnline } = usePWA()
  const {
    setInitialData,
    listCurrentPage,
    viewType,
    setGroupByData,
    setFrmLoading,
    setViewType,
    setViewTypeFromConfig,
    viewTypeFromConfig,
    config,
    setTabForm,
  } = useAppStore()
  const { filters } = useUserStore()

  const { data, isLoading } = useModuleFilterList({
    filters,
    fncName: 'fnc_pos_point',
    module: ModulesEnum.POINTS_OF_SALE,
  })

  useEffect(() => {
    if (viewTypeFromConfig && config.module_url === location.pathname) {
      setViewType(config.view_default)
      setTabForm(0)
      setViewTypeFromConfig(false)
      return
    }
  }, [viewTypeFromConfig, config, viewType])

  useEffect(() => {
    if (data && data.oj_gby_data) {
      setGroupByData(data.oj_gby_data)
    }
  }, [data, setGroupByData])

  useEffect(() => {
    setFrmLoading(isLoading)
  }, [isLoading, setFrmLoading])

  useEffect(() => {
    const loadData = async () => {
      if (!isOnline) {
        try {
          // Usar la instancia singleton de OfflineCache
          await offlineCache.init()

          const offlineData = await offlineCache.getOfflinePosPoints()

          setInitialData({
            data: offlineData,
            total: offlineData.length,
          })
        } catch (error) {
          console.error('Error cargando datos offline:', error)
          setInitialData({
            data: [],
            total: 0,
          })
        }
        return
      }

      if (data) {
        setInitialData({
          data: data.oj_data ?? [],
          total: data.oj_info?.total_count ?? 0,
        })
        await offlineCache.refetchPosPointsCache(data)
      }
    }

    loadData()
  }, [data, setInitialData, viewType, listCurrentPage, isOnline])

  return <ManagerContent />
}
