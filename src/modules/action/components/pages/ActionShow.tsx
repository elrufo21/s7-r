import { ManagerContent } from '@/shared/components/core'
import { useModuleList } from '@/shared/hooks/useModule'
import useAppStore from '@/store/app/appStore'
import useUserStore from '@/store/persist/persistStore'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export const ActionShow = () => {
  const { idAction } = useParams()
  const { filters } = useUserStore()

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

  useEffect(() => {}, [])
  const { data, isLoading } = useModuleList({
    filters,
    fncName: config.fnc_name,
    module: config.module,
    id: idAction ?? '',
  })

  useEffect(() => {
    setFrmLoading(isLoading)
  }, [isLoading, setFrmLoading])

  useEffect(() => {
    setInitialData({
      data: data?.oj_data ?? [],
      total: data?.oj_info?.total_count ?? 0,
    })
  }, [data, setInitialData, listCurrentPage, idAction, viewType])
  useEffect(() => {
    if (viewTypeFromConfig && config.module_url === location.pathname) {
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
