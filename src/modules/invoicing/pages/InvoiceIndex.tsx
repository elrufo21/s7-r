import { ManagerContent } from '@/shared/components/core'
import { ModulesEnum } from '@/shared/shared.types'
import { useModuleList } from '@/shared/hooks/useModule'
import useAppStore from '@/store/app/appStore'
import useUserStore from '@/store/persist/persistStore'
import { useEffect } from 'react'

export const InvoiceIndex = () => {
  const {
    viewType,
    setInitialData,
    listCurrentPage,
    setFrmLoading,
    setGroupByData,
    viewTypeFromConfig,
    setViewType,
    setViewTypeFromConfig,
    config,
    setTabForm,
  } = useAppStore()
  const { filters } = useUserStore()
  const { data, isLoading } = useModuleList({
    filters,
    fncName: 'fnc_account_move',
    module: ModulesEnum.INVOICING,
  })

  useEffect(() => {
    if (viewTypeFromConfig && config.module_url === location.pathname) {
      setViewType(config.view_default)
      setTabForm(0)
      setViewTypeFromConfig(false)
      return
    }
  }, [viewTypeFromConfig, config])
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
      setInitialData({ data: data.oj_data ?? [], total: data.oj_info?.total_count ?? 0 })
    }
  }, [data, setInitialData, viewType, listCurrentPage])

  return <ManagerContent />
}
