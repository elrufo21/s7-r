import { useEffect } from 'react'
import useAppStore from '@/store/app/appStore'
import useUserStore from '@/store/persist/persistStore'
import { useModuleFilterList } from '@/shared/hooks/useModule'
import { ModulesEnum } from '@/shared/shared.types'
import TestView from '../views/testView'

export const SettingsIndex = () => {
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
  } = useAppStore()
  const { filters } = useUserStore()

  const { data, isLoading } = useModuleFilterList({
    filters,
    fncName: 'fnc_partner',
    module: ModulesEnum.CONTACTS,
  })

  useEffect(() => {
    if (viewTypeFromConfig) {
      console.log('config.view_default', config.view_default)
      setViewType(config.view_default)
      setViewTypeFromConfig(false)
    }
  }, [viewTypeFromConfig])

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

  return <TestView />
}
