import { FormConfig, ListFilterItem, ListGByItem } from '@/shared/shared.types'
import { useModuleList } from '@/shared/hooks/useModule'
import React, { useEffect, useState } from 'react'
import { SearchInput } from '../navigation/panel-navigation/control-panel/components/SearchInput'
import { ExpandedState, Row, Table } from '@tanstack/react-table'
import { ListView } from '../view-types/ListView'
import { GroupedItemsType } from '../view-types/viewTypes.types'
import { PageCounterList } from '../navigation/panel-navigation/control-panel/components/PageCounterList'
import useAppStore from '@/store/app/appStore'
import { ClientModal } from '@/modules/pos/components/modal/ClientModal'
import { Filter } from '../form/hooks/useAutocompleteField'

interface ModalBaseProps {
  config: FormConfig
  multiple?: boolean
  onRowClick?: (row: Record<string, any>) => void
  onModalSelectionChange?: (selection: Record<string, boolean>, selectedRowsData: any[]) => void
  contactModal?: boolean
  dataFiltered?: any[]
  openEditModal?: (client: any) => void
  defaultFiters?: Filter[]
  customHeader?: React.ReactNode
}

export const ModalBase = ({
  config,
  multiple = true,
  onRowClick,
  onModalSelectionChange,
  contactModal = false,
  dataFiltered = [],
  openEditModal,
  defaultFiters = [],
  customHeader,
}: ModalBaseProps) => {
  const { itemsPerPage, columnsVisibility, setColumnsVisibility } = useAppStore()
  const [filters, setFilters] = useState<any[]>([[1, 'pag', 1]])
  const [filtersLocal, setFiltersLocal] = useState<any[]>([])
  const [searchFiltersLabel, setSearchFiltersLabel] = useState<any[]>([])
  const [listFilterBy, setListFilterBy] = useState<ListFilterItem[]>([])
  const [listGroupBy, setListGroupBy] = useState<ListGByItem[]>([])
  const [actualCurrentPage, setActualCurrentPage] = useState<number>(1)
  const [expandedData, setExpandedData] = useState<ExpandedState>({})
  const [prevFilters, setPrevFilters] = useState<any[]>([])
  const [listCurrentPage, setListCurrentPage] = useState<number>(1)
  const [groupByData, setGroupByData] = useState<Record<string, any>[]>([])
  const [listViewData, setListViewData] = useState<any[]>([])

  // for list view
  const [dataShow, setDataShow] = useState([])
  const [groupedParentRow, setGroupedParentRow] = useState<Row<GroupedItemsType>>(
    {} as Row<GroupedItemsType>
  )
  const [table, setTable] = useState<Table<any> | null>(null)
  const [canChangeGroupBy, setCanChangeGroupBy] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)

  // Estado local para la selección
  const [localRowSelection, setLocalRowSelection] = useState<Record<string, boolean>>({})

  /*useEffect(() => {
    if (config?.default_filters) {
      setFilters((prevFilters) => [...prevFilters, config?.default_filters])
    }
  }, [config?.default_filters])*/

  const { data } = useModuleList({
    fncName: config.fnc_name,
    module: config.module,
    filters,
  })

  const indexPage = (listCurrentPage - 1) * itemsPerPage
  const groupItems = listGroupBy.length
    ? new Set(groupByData.map((item) => item[listGroupBy[0].key_gby])).size
    : total

  const onHandleFilters = (filters: any[], actualCurrentPage: number) => {
    const filtersClear = filters.map((item) => (typeof item[0] === 'number' ? item.slice(1) : item))
    const addPagination = filtersClear.some((elem) => elem[0] === 'gby' || elem[0] === 'pag')
      ? filters
      : [...filters, ['pag', actualCurrentPage]]

    const clearOBy = addPagination.reduce((acc, item) => {
      if (item[0] === 'oby') {
        acc = acc.filter((i: any) => i[0] !== 'oby')
        acc.push(item)
      } else {
        acc.push(item)
      }
      return acc
    }, [])

    const newFilters = clearOBy.map((filter: any, index: number) =>
      typeof filter[0] === 'number' ? filter : [index + 1, ...filter]
    )

    setFilters([...defaultFiters, ...newFilters])
  }

  useEffect(() => {
    if (data && data.oj_gby_data) {
      setGroupByData(data.oj_gby_data)
    }
  }, [data, setGroupByData])

  useEffect(() => {
    if (data) {
      setDataShow(data.oj_data ?? [])
      setTotal(data.oj_info?.total_count ?? 0)
    }
  }, [data])

  // Manejador de cambios en la selección
  const handleSelectionChange = (
    updater: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)
  ) => {
    const newSelection = typeof updater === 'function' ? updater(localRowSelection) : updater
    setLocalRowSelection(newSelection)

    // Obtener los datos completos de las filas seleccionadas
    const selectedRows = dataShow.filter((row) => newSelection[row[config.grid.idRow]])

    // Llamar al callback con ambos valores
    onModalSelectionChange?.(newSelection, selectedRows)
  }

  return (
    <div className="flex flex-col gap-4">
      {!contactModal && (
        <div className="flex mt-4 ">
          <div className="w-1/3"></div>
          <div className="w-1/3 sticky">
            <SearchInput
              config={config}
              setFilters={onHandleFilters}
              filtersLocal={filtersLocal}
              setFiltersLocal={setFiltersLocal}
              searchFiltersLabel={searchFiltersLabel}
              setSearchFiltersLabel={setSearchFiltersLabel}
              listFilterBy={listFilterBy}
              setListGroupBy={setListGroupBy}
              setListFilterBy={setListFilterBy}
              actualCurrentPage={actualCurrentPage}
              setExpandedData={setExpandedData}
              setPrevFilters={setPrevFilters}
              prevFilters={prevFilters}
              setActualCurrentPage={setActualCurrentPage}
              setListCurrentPage={setListCurrentPage}
              setGroupByData={setGroupByData}
              listGroupBy={listGroupBy}
              setListViewData={setListViewData}
            />
          </div>
          <div className="w-1/3 flex justify-end">
            <PageCounterList
              counterPage={{
                lowerLimit: indexPage + 1,
                totalElements: listGroupBy.length ? groupItems : total,
                upperLimit: Math.min(indexPage + itemsPerPage, groupItems),
              }}
              totalPages={Math.ceil((listGroupBy.length ? groupItems : total) / itemsPerPage)}
              listCurrentPage={listCurrentPage}
              setListCurrentPage={setListCurrentPage}
              actualCurrentPage={actualCurrentPage}
              setActualCurrentPage={setActualCurrentPage}
              filters={filters}
              setFilters={setFilters}
            />
          </div>
        </div>
      )}
      {contactModal ? (
        <>
          {customHeader}
          <ClientModal
            onSelectClient={(row) => {
              onRowClick?.(row)
            }}
            data={dataFiltered}
            openEditModal={openEditModal}
          />
        </>
      ) : (
        <div className="h-[500px] overflow-auto">
          <ListView
            config={config}
            listCurrentPage={listCurrentPage}
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
            setFilters={onHandleFilters}
            columnsVisibility={columnsVisibility}
            setColumnsVisibility={setColumnsVisibility}
            multiple={multiple}
            onRowClick={onRowClick}
            useLocalSelection={true}
            onRowSelectionChange={handleSelectionChange}
          />
        </div>
      )}
    </div>
  )
}
