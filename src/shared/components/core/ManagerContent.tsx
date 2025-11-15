import { useEffect, useState } from 'react'
import { KanbanView } from '@/shared/components/view-types/KanbanView'
import useAppStore from '@/store/app/appStore'
import { ListView } from '@/shared/components/view-types/ListView'
import { ModulesEnum, ViewTypeEnum } from '@/shared/shared.types'
import { useLocation, useParams } from 'react-router-dom'
import useUserStore from '@/store/persist/persistStore'
import { useUpdateStatus } from '@/shared/hooks/useModifyStatus'
import InvoiceAnalisys from './InvoiceAnalisys'
import OrderAnalytics from '@/modules/action/views/point-of-sale/pos-order-report/components/OrderAnalytics'

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
    formItem,
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
    // setBreadcrumb([{ title: config.title, url: pathname, viewType }])
  }, [config.title, pathname, setBreadcrumb, viewType])
  useEffect(() => {
    if (!breadcrumb.find((item) => item.title === config.title)) {
      setViewType(config.view_default)
    }
  }, [breadcrumb, config.title, config.view_default, setViewType])

  /*
  configurar para que acepte info del diario 
  useEffect(() => {
    return () => {
      const view = viewType
      if (!settingsBreadcrumb && breadcrumb.find((item)=>item.d)) {
        setBreadcrumb([{ title: config.title, url: pathname, viewType: view }])
      }
    }
  }, [config.title, pathname, setBreadcrumb, viewType])
*/
  useEffect(() => {
    return () => {
      // Acceder directamente al store para obtener los valores más actualizados
      const store = useAppStore.getState()
      const currentBreadcrumb = store.breadcrumb
      const currentConfig = store.config

      if (currentBreadcrumb.find((item) => item.haveSecondaryList)) {
        setBreadcrumb([
          ...currentBreadcrumb,
          { title: currentConfig.title, url: pathname, viewType },
        ])
      } else {
        setBreadcrumb([])
      }
    }
  }, []) // Sin dependencias - se ejecuta solo al desmontar

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)
      return
    }

    // EJECUTAR AL MONTAR, no al desmontar
    /*  if (settingsBreadcrumb) {
      console.log('settingsBreadcrumb is true, setting breadcrumb', breadcrumb)
      // Para formularios, NO modificar el breadcrumb - mantener el estado actual
      if (viewType === ViewTypeEnum.FORM) {
        // No hacer nada - mantener el breadcrumb como está
        return
      }

      // Solo para LIST/KANBAN manejar existencia en breadcrumb
      const existingIndex = breadcrumb.findIndex((item) => item.url === pathname)

      if (existingIndex !== -1) {
        // Si existe, cortar hasta ese punto (navegación desde breadcrumb)
        setBreadcrumb(breadcrumb.slice(0, existingIndex + 1))
      } else {
        // Si no existe, agregar según el tipo
        if (viewType === ViewTypeEnum.LIST || viewType === ViewTypeEnum.KANBAN) {
          setBreadcrumb([...breadcrumb, { title: config.title, url: pathname, viewType }])
        }
      }
    }*/
  }, [
    pathname, // Ejecutar cuando cambie la ruta
    formItem, // Ejecutar cuando se cargue el formItem
  ])

  /*console.log('settingsBreadcrumb', settingsBreadcrumb)
  useEffect(() => {
    return () => {
      if (settingsBreadcrumb) {
        console.log(
          'settingsBreadcrumb',
          settingsBreadcrumb,
          breadcrumb,
          config,
          settingsBreadcrumb
        )
        setBreadcrumb([...breadcrumb, { title: config.title, url: pathname, viewType }])
      }
      //
    }
  }, [viewType])*/
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

  useEffect(() => {
    //setBreadcrumb([{ title: config.title, url: pathname, viewType }])
  }, [config.title, pathname, setBreadcrumb, viewType])
  return (
    <div className="o_content">
      {viewType === ViewTypeEnum.KANBAN && (
        <div
          className={`o_kanban_renderer ${config.fnc_name === 'fnc_journal' && 'three-columns '} o_renderer d-flex o_kanban_ungrouped align-content-start flex-wrap justify-content-start`}
        >
          {config && <KanbanView config={config} />}
        </div>
      )}
      {viewType === ViewTypeEnum.LIST && (
        <div className="o_list_renderer o_renderer  ">
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
      {viewType === ViewTypeEnum.LIBRE && (
        <div className="o_graph_renderer o_renderer h-100 d-flex flex-column border-top undefined">
          {config.module === ModulesEnum.INVOICING && <InvoiceAnalisys />}
          {config.module === ModulesEnum.POINTS_OF_SALE && <OrderAnalytics />}
        </div>
      )}
    </div>
  )
}
