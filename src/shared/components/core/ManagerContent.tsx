import { useEffect, useState } from 'react'
import { KanbanView } from '@/shared/components/view-types/KanbanView'
import useAppStore from '@/store/app/appStore'
import { ListView } from '@/shared/components/view-types/ListView'
import { ViewTypeEnum } from '@/shared/shared.types'
import { useLocation, useParams } from 'react-router-dom'
import useUserStore from '@/store/persist/persistStore'
import { useUpdateStatus } from '@/shared/hooks/useModifyStatus'

export const ManagerContent = () => {
  const {
    viewType,
    config,
    breadcrumb,
    setBreadcrumb,
    setListCurrentPage,
    listCurrentPage,
    setRowSelection,
    setDataFormShow,
    groupedParentRow,
    setGroupedParentRow,
    table,
    setTable,
    dataListShow: { dataShow },
    groupByData,
    setExpandedData,
    expandedData,
    setListViewData,
    listViewData,
    listGroupBy,
    setCanChangeGroupBy,
    canChangeGroupBy,
    setColumnsVisibility,
    columnsVisibility,
    executeFnc,
    changeFavoriteId,
    setChangeFavoriteId,
    setFrmLoading,
    setViewType,
    settingsBreadcrumb,
  } = useAppStore()

  const { filters, setFilters } = useUserStore()
  const { pathname } = useLocation()
  const [isFirstRender, setIsFirstRender] = useState(true)
  const { idAction } = useParams()
  const { mutate: updateStatus, isPending } = useUpdateStatus({
    filters,
    fncName: config.fnc_name,
    module: config.module,
    id: idAction ?? '',
  })
  useEffect(() => {
    setFrmLoading(isPending)
  }, [isPending, setFrmLoading])

  useEffect(() => {
    if (!settingsBreadcrumb) {
      setBreadcrumb([{ title: config.title, url: pathname, viewType }])
    }
  }, [config.title, pathname, setBreadcrumb, viewType])

  useEffect(() => {
    if (!breadcrumb.find((item) => item.title === config.title)) {
      setViewType(config.view_default)
    }
  }, [breadcrumb, config.title, config.view_default, setViewType, viewType])

  useEffect(() => {
    return () => {
      const view = viewType
      if (!settingsBreadcrumb) {
        setBreadcrumb([{ title: config.title, url: pathname, viewType: view }])
      }
    }
  }, [config.title, pathname, setBreadcrumb, viewType])

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)
      return
    }
    return () => {
      if (settingsBreadcrumb) {
        setBreadcrumb([...breadcrumb, { title: config.title, url: pathname, viewType: viewType }])
      }
    }
  }, [isFirstRender])

  useEffect(() => {
    if (viewType === ViewTypeEnum.KANBAN || viewType === ViewTypeEnum.LIST) {
      setListCurrentPage(listCurrentPage)
      setRowSelection(() => ({}))
    }
  }, [listCurrentPage, setListCurrentPage, setRowSelection, viewType])

  useEffect(() => {
    const handleChangeFavorite = async () => {
      if (changeFavoriteId) {
        await updateStatus({
          filters: {
            [config.grid.idRow]: changeFavoriteId,
            column: 'is_favorite',
          },
          fncName: config.fnc_name,
        })

        setChangeFavoriteId(null)
      }
    }
    handleChangeFavorite()
  }, [changeFavoriteId, config.fnc_name, config.grid.idRow, executeFnc, setChangeFavoriteId])

  useEffect(() => {
    setRowSelection(() => ({}))
  }, [config.module_url])

  return (
    <div className="o_content">
      {viewType === ViewTypeEnum.KANBAN && (
        <div className="o_kanban_renderer o_renderer d-flex o_kanban_ungrouped align-content-start flex-wrap justify-content-start">
          {config && <KanbanView config={config} />}
        </div>
      )}
      {viewType === ViewTypeEnum.LIST && (
        <div className="o_list_renderer o_renderer table-responsive">
          {config && (
            <ListView
              config={config}
              listCurrentPage={listCurrentPage}
              setDataFormShow={setDataFormShow}
              groupedParentRow={groupedParentRow}
              setGroupedParentRow={setGroupedParentRow}
              table={table}
              setTable={setTable}
              groupByData={groupByData}
              setExpandedData={setExpandedData}
              expandedData={expandedData}
              setListViewData={setListViewData}
              listViewData={listViewData}
              listGroupBy={listGroupBy}
              setCanChangeGroupBy={setCanChangeGroupBy}
              canChangeGroupBy={canChangeGroupBy}
              dataShow={dataShow}
              filters={filters}
              setFilters={setFilters}
              setColumnsVisibility={setColumnsVisibility}
              columnsVisibility={columnsVisibility}
            />
          )}
        </div>
      )}
    </div>
  )
}
