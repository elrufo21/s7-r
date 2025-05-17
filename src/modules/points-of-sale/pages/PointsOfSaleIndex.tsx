import { ManagerContent } from '@/shared/components/core'
import { useEffect } from 'react'
import useAppStore from '@/store/app/appStore'
import useUserStore from '@/store/persist/persistStore'
import { useModuleFilterList } from '@/shared/hooks/useModule'
import { ModulesEnum } from '@/shared/shared.types'
import { useLocation } from 'react-router-dom'

export const PointOfSaleIndex = () => {
  const location = useLocation()
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
    fncName: 'fnc_pos',
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
    if (data) {
      setInitialData({
        data: data.oj_data ?? [],
        total: data.oj_info?.total_count ?? 0,
      })
    }
  }, [data, setInitialData, viewType, listCurrentPage])
  console.log('config', config)

  return <ManagerContent />
}
