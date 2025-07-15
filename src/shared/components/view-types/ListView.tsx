import { Fragment, lazy, ReactNode, Suspense, useEffect, useMemo, useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import { Tooltip } from '@mui/material'
import { MdArrowForwardIos, MdArrowBackIos } from 'react-icons/md'
import { LuSettings2 } from 'react-icons/lu'

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnDef,
  ColumnResizeMode,
  Row,
  ExpandedState,
  Table,
} from '@tanstack/react-table'

import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'

import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { DraggableRow, RowDragHandleCell } from './list/components/dragable/Dragable'
import { GroupedItemsType, dataStateType } from './viewTypes.types'
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io'
import { SearchFiltersEnum } from '../navigation/navigation.types'
import { formatGroupItems } from './list/helpers/constructList'
import { FaChevronDown, FaChevronUp, FaRegStar, FaStar } from 'react-icons/fa'
import { IndeterminateCheckbox } from '@/shared/ui'
import { useNavigate } from 'react-router-dom'
import { FormConfig, ListGByItem } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'
import useUserStore from '@/store/persist/persistStore'

const NavMenuList = lazy(
  () => import('@/shared/components/navigation/top-navigation/components/NavMenuList')
)

export type ListViewProps = {
  config: FormConfig
  listCurrentPage: number
  setDataFormShow?: (dataFormShow: any) => void
  groupedParentRow: Row<GroupedItemsType>
  setGroupedParentRow: (groupedParentRow: Row<GroupedItemsType>) => void
  table: Table<any> | null
  setTable: (table: Table<any>) => void
  groupByData: Record<string, any>[]
  setExpandedData: (expandedData: ExpandedState) => void
  expandedData: ExpandedState
  setListViewData: (listViewData: any[]) => void
  listViewData: any[]
  listGroupBy: ListGByItem[]
  setCanChangeGroupBy: (canChangeGroupBy: boolean) => void
  canChangeGroupBy: boolean
  dataShow: any[]
  filters: any[]
  setFilters: (filters: any[], actualCurrentPage: number) => void
  setColumnsVisibility: (columVisibility: Record<string, Record<string, boolean>>) => void
  columnsVisibility: Record<string, Record<string, boolean>>
  multiple?: boolean
  onRowClick?: (row: Record<string, any>) => void
  useLocalSelection?: boolean
  onRowSelectionChange?: (selection: Record<string, boolean>, selectedRowsData: any[]) => void
}

const updateGroupItemsRecursively = (
  arr: Record<string, any>[],
  targetGroupKey: string | number,
  newGroupData: Record<string, any>,
  parents: string
): Record<string, any>[] => {
  return arr.map((elem) => {
    if (elem.groupKey === targetGroupKey && JSON.stringify(elem.parents) === parents) {
      return {
        ...elem,
        ...newGroupData,
      }
    }

    if (elem.groupItems && Array.isArray(elem.groupItems)) {
      return {
        ...elem,
        groupItems: updateGroupItemsRecursively(
          elem.groupItems,
          targetGroupKey,
          newGroupData,
          parents
        ),
      }
    }

    return elem
  })
}

export const ListView = ({
  config,
  listCurrentPage,
  setDataFormShow,
  groupedParentRow,
  setGroupedParentRow,
  table,
  setTable,
  groupByData,
  setExpandedData,
  expandedData,
  setListViewData,
  listViewData,
  listGroupBy,
  setCanChangeGroupBy,
  canChangeGroupBy,
  dataShow,
  filters,
  setFilters,
  setColumnsVisibility,
  columnsVisibility,
  multiple = true,
  onRowClick,
  useLocalSelection = false,
  onRowSelectionChange,
}: ListViewProps) => {
  const navigate = useNavigate()
  const {
    itemsPerPage,
    executeFnc,
    setFrmLoading,
    rowSelection,
    setRowSelection,
    changeFavoriteId,
    setChangeFavoriteId,
    frmLoading,
  } = useAppStore()
  const { col_name, isDragable = false } = config.grid

  const idRow = config.grid.idRow

  const [expanded, setExpanded] = useState<ExpandedState>(expandedData)
  const [dataState, setDataState] = useState(dataStateType.NORMAL)
  const [groupedList, setGroupedList] = useState<any[]>([])
  const [columnVisibilityState, setColumnVisibilityState] = useState(
    columnsVisibility[config.module_url] || {}
  )
  const [columnResizeMode] = useState<ColumnResizeMode>('onChange')
  const [dataIds, setDataIds] = useState<UniqueIdentifier[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: itemsPerPage })
  const [filterRows, setFilterRows] = useState<string[]>([])
  const [localRowSelection, setLocalRowSelection] = useState<Record<string, boolean>>({})

  const effectiveRowSelection = useLocalSelection ? localRowSelection : rowSelection

  const viewItem = async (row: Row<any>) => {
    const parentRow = row.getParentRow()
    const data = parentRow?.original?.groupItems ?? []
    const item = row.original

    if (!item[idRow]) return
    if (parent) setGroupedParentRow(parentRow!)
    if (setDataFormShow) {
      setDataFormShow(groupByData.length ? data : dataShow)
      navigate(`${config.item_url}/${item[idRow]}`)
    } else {
      //comes from modal
      onRowClick?.(item)
      setRowSelection(() => ({}))
    }
  }

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'select',
        size: 40,
        enableResizing: false,
        header: ({ table }) => {
          const isChecked = () => {
            const listRowSelection = Object.keys(rowSelection).filter((elem) => rowSelection[elem])
            const listRowTable = table
              .getRowModel()
              .rows.filter((row) => typeof row?.id !== 'string')
            if (!listRowTable.length && !listRowSelection.length) return false
            return listRowSelection.length === listRowTable.length
          }

          return (
            <div className="w-full flex justify-center">
              <IndeterminateCheckbox
                {...{
                  className: 'accent-sgreen-400 ',
                  checked: table.getIsAllRowsSelected() || isChecked(),
                  indeterminate: table.getIsSomeRowsSelected(),
                  onChange: table.getToggleAllRowsSelectedHandler(),
                  //getToggleAllPageRowsSelectedHandler()
                  //getToggleAllRowsSelectedHandler(),
                }}
              />
            </div>
          )
        },
        cell: ({ row }) => {
          if (!row.original[idRow]) return <></>
          return (
            <div className="px-1 flex justify-center w-full">
              {row.getCanExpand() ? (
                <button {...{ onClick: row.getToggleExpandedHandler() }}>
                  {row.getIsExpanded() ? (
                    <IoMdArrowDropdown style={{ width: '14px' }} />
                  ) : (
                    <IoMdArrowDropright style={{ width: '14px' }} />
                  )}
                </button>
              ) : (
                <IndeterminateCheckbox
                  {...{
                    className: 'accent-sgreen-400 ',
                    checked: row.getIsSelected(),
                    disabled: !row.getCanSelect(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler(),
                  }}
                />
              )}
            </div>
          )
        },
        enableSorting: false,
      },
      {
        id: 'drag-handle',
        header: ' ',
        cell: ({ row }) => {
          if (!row.original[idRow]) return <></>
          return (
            <div className="w-full">
              <RowDragHandleCell rowId={row?.id} />
            </div>
          )
        },
        size: dataState === dataStateType.GROUPED ? 2 : 33,
        enableResizing: false,
        enableSorting: false,
      },
      ...(config.isFavoriteColumn
        ? [
            {
              id: 'is_favorite',
              header: '',
              cell: ({ row }: { row: Row<any> }) => {
                return (
                  <div
                    className={`flex justify-center ${
                      changeFavoriteId ? 'pointer-events-none' : ''
                    }`}
                    onClick={() => setChangeFavoriteId(row.original[idRow])}
                  >
                    {row.original.is_favorite ? (
                      <FaStar fill="#FFDE21" size={18} />
                    ) : (
                      <FaRegStar size={18} />
                    )}
                  </div>
                )
              },
              size: 33,
              enableSorting: false,
            },
          ]
        : []),

      ...(config.grid && config.grid.list ? config.grid.list.columns : []),
      {
        id: 'settings',
        header: ({ table }) => {
          return (
            <Suspense>
              <NavMenuList
                menu={''}
                icon={<LuSettings2 />}
                className={'MenuButtonExList'}
                isClose={false}
              >
                {table.getAllLeafColumns().map((column, i) => {
                  if (
                    column.id === 'select' ||
                    column.id === col_name ||
                    column.id === 'settings' ||
                    column.id === 'drag-handle'
                  )
                    return null

                  return (
                    <MenuItem className="MenuButtonExList__item " key={i}>
                      <label className="w-full flex cursor-pointer gap-1">
                        <input
                          className={`m-1 group-hover:bg-sgreen-400 group-hover:text-sgreen-200 cursor-pointer accent-sgreen-400 ${
                            column.getIsVisible() ? ` text-sgreen-400` : ` bg-gray-100`
                          }`}
                          {...{
                            type: 'checkbox',
                            checked: column.getIsVisible(),
                            onChange: column.getToggleVisibilityHandler(),
                          }}
                        />
                        <span>{column.columnDef.header as string}</span>
                      </label>
                    </MenuItem>
                  )
                })}
              </NavMenuList>
            </Suspense>
          )
        },
        size: 33,
        enableSorting: false,
      },
    ],
    [dataState, rowSelection, table, dataShow, isDragable, config.grid]
  )

  const currentTable = useReactTable({
    data: dataState === dataStateType.GROUPED ? groupedList : dataShow,
    columns,
    columnResizeMode,
    enableRowSelection: true,
    enableColumnResizing: true,
    enableMultiRowSelection: true,
    paginateExpandedRows: false,
    onRowSelectionChange: (updater) => {
      if (useLocalSelection) {
        const newSelection = typeof updater === 'function' ? updater(localRowSelection) : updater
        setLocalRowSelection(newSelection)

        // Obtener los datos de las filas seleccionadas
        const selectedRows = currentTable
          .getRowModel()
          .rows.filter((row) => {
            const rowId = row.original[idRow]
            return rowId && newSelection[rowId]
          })
          .map((row) => row.original)

        // Llamar al callback con ambos valores
        onRowSelectionChange?.(newSelection, selectedRows)
      } else {
        setRowSelection(updater, false, filterRows)
      }
    },
    onColumnVisibilityChange: setColumnVisibilityState,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: (row) => row[idRow],
    state: {
      rowSelection: effectiveRowSelection,
      sorting,
      columnVisibility: { ...columnsVisibility[config.module_url as string], select: !!multiple },
      expanded,
      pagination,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.groupItems,
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      const oldIndex = dataIds.indexOf(active.id)
      const newIndex = dataIds.indexOf(over.id)
      const nlist = arrayMove(dataShow, oldIndex, newIndex)
      console.log(nlist)
    }
  }

  const groupingSpacer = (level: number) => {
    const divs = []
    for (let i = 0; i < level; i++) {
      divs.push(<div key={i} style={{ width: '10px', display: 'inline-block' }}></div>)
    }
    return divs
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const generateRowData = async (row: Row<GroupedItemsType>) => {
    try {
      setFrmLoading(true)
      let actualPage
      actualPage = row.original.level === listGroupBy.length - 1 ? 1 : 0

      const level = row.original.level
      const parents = row.original.parents
      const columns = row.original.parents.map((elem) => ({ col: elem.key, val: elem.value }))
      const listData = Object.values(groupedParentRow).length ? listViewData : groupedList

      const data = await executeFnc(config.fnc_name, 's', [
        ...filters,
        [
          filters.length,
          'gby_select',
          [
            { page: actualPage },
            {
              columns,
            },
          ],
        ],
      ])

      if (actualPage)
        return setGroupedList(
          updateGroupItemsRecursively(
            listData,
            row.original.groupKey,
            {
              groupItems: data.oj_data ?? [],
            },
            JSON.stringify(parents)
          )
        )

      const valueOfGroupItems = {
        groupItems: !actualPage
          ? formatGroupItems({
              list: data.oj_gby_data ?? [],
              level: level + 1,
              itemsPerPage,
              parents: row.original.parents,
              listGroupBy,
            })
          : data,
      }

      const newValue = listData.map((elem) => {
        if (elem.groupKey === row.original.groupKey) {
          return {
            ...elem,
            ...valueOfGroupItems,
          }
        }
        if (elem.groupItems && Array.isArray(elem.groupItems)) {
          return {
            ...elem,
            groupItems: updateGroupItemsRecursively(
              elem.groupItems,
              row.original.groupKey,
              valueOfGroupItems,
              JSON.stringify(parents)
            ),
          }
        }
        return elem
      })
      setGroupedList(newValue)
    } catch (e) {
      console.log('error in generateRowData', e)
    } finally {
      setFrmLoading(false)
    }
  }
  useEffect(() => {
    if (columnsVisibility[config.module_url as string]) {
      if (Object.keys(columnsVisibility[config.module_url as string]).length > 1) {
        setColumnVisibilityState(columnsVisibility[config.module_url as string])
      }
    }
  }, [columnsVisibility, config.module_url])

  useEffect(() => {
    setColumnsVisibility({
      ...columnsVisibility,
      [config.module_url as string]: columnVisibilityState,
    })
  }, [columnVisibilityState])

  useEffect(() => {
    setColumnVisibilityState((prev) => {
      return { ...prev, ...config.visibility_columns }
    })
  }, [config.visibility_columns])

  useEffect(() => {
    const generateNewData = async () => {
      if (listGroupBy.length && Object.keys(groupedParentRow).length) {
        await generateRowData(groupedParentRow)
        setGroupedParentRow({} as Row<GroupedItemsType>)
      }
    }
    generateNewData()
  }, [listGroupBy])

  useEffect(() => {
    if (groupedList.length) setListViewData(groupedList)
  }, [groupedList])

  useEffect(() => {
    if (table && dataShow.length > 0) {
      setDataIds(
        dataShow.map((item) => item?.[idRow]).filter((id): id is UniqueIdentifier => id != null)
      )
    }
    if (table) {
      if (listGroupBy.length > 0) {
        setDataState(dataStateType.GROUPED)

        if (listViewData.length && canChangeGroupBy) {
          setGroupedList(listViewData)
          setListViewData([])
          setCanChangeGroupBy(false)
          return
        }
        const list = formatGroupItems({ itemsPerPage, listGroupBy, list: groupByData })
        setGroupedList(list)
      } else {
        setDataState(dataStateType.NORMAL)
      }
    }
  }, [dataShow, listGroupBy, table, groupByData])

  useEffect(() => {
    setTable(currentTable)
  }, [currentTable, setTable, dataShow])

  useEffect(() => {
    setExpanded(expandedData)
  }, [expandedData])

  useEffect(() => {
    setExpandedData(expanded)
  }, [expanded, setExpandedData])

  useEffect(() => {
    const headerSorted = table?.getState().sorting
    if (headerSorted) {
      const newItem = [
        SearchFiltersEnum.ORDER_BY,
        [{ column: headerSorted[0]?.id ?? '', direction: headerSorted[0]?.desc ? 'desc' : 'asc' }],
      ]
      const filterWithoutOby = filters.filter((elem) => elem[1] !== SearchFiltersEnum.ORDER_BY)
      setFilters(headerSorted.length ? [...filterWithoutOby, newItem] : filterWithoutOby, 1)
    }
  }, [table?.getState().sorting])

  useEffect(() => {
    if (dataState === dataStateType.GROUPED) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }))
    } else {
      setDataState(dataStateType.NORMAL)
      setColumnVisibilityState((prev) => ({ ...prev, 'drag-handle': isDragable }))
    }
  }, [dataState, isDragable])

  useEffect(() => {
    if (dataState === dataStateType.GROUPED) {
      setPagination((prev) => ({ ...prev, pageIndex: listCurrentPage - 1 }))
    }
  }, [listCurrentPage])

  useEffect(() => {
    if (table) {
      const rows = table
        .getRowModel()
        .rows.filter((row) => typeof row?.id !== 'string')
        .map((row) => row?.id)
      setFilterRows(rows)
    }
  }, [table?.getRowModel()])

  const handleNoDataList = () => {
    if (frmLoading) {
      return null
    }
    if (!dataShow.length) {
      if (groupByData.length) {
        return
      } else if (!dataShow.length) {
        return (
          <div className="o_view_nocontent">
            <div className="w-full h-full flex flex-col justify-center items-center gap-3">
              <img src="/images/not-content.svg" />
              <h2 className="text-center text-[1.25rem] font-bold ">{config.no_content_title}</h2>
              <h2 className="text-center text-[1rem]">{config.no_content_dsc}</h2>
            </div>
          </div>
        )
      }
    }
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      {handleNoDataList()}

      <table className="list_table w-full">
        <TableHeader table={table!} />
        <TableBody
          table={table!}
          isDragable={isDragable}
          dataState={dataState}
          dataIds={dataIds}
          viewItem={viewItem}
          rowSelection={effectiveRowSelection}
          idRow={idRow}
          col_name={col_name ?? ''}
          groupingSpacer={groupingSpacer}
          generateRowData={generateRowData}
          listGroupBy={listGroupBy}
          groupedList={groupedList}
          setGroupedList={setGroupedList}
          config={config}
        />
      </table>
    </DndContext>
  )
}

const TableHeader = ({ table }: { table: Table<any> }) => (
  <thead className="thead s-sticky bg-[#F9FAFB] ">
    {table?.getHeaderGroups()?.map((headerGroup) => (
      <tr
        key={headerGroup.id}
        className="list-th-tr left-sticky border-b  bg-[#F9FAFB]"
        style={{ height: '42px' }}
      >
        {headerGroup.headers.map((header) => (
          <th
            key={header.id}
            colSpan={header.colSpan}
            style={{ width: header.getSize() }}
            className={`relative  ${header.id === 'select' && ' left-sticky justify-center '}
                ${header.id === 'settings' && ' right-sticky  bg-gray-50'} 
                p-2 ${header.column.columnDef.enableSorting === false ? 'cursor-default' : 'cursor-pointer'} ${header.column.getIsSorted() && 'bg-gray-200 '}  ${(header.column.columnDef as { className?: string })?.className ?? 'text-left'} font-semibold `}
          >
            {header.isPlaceholder ? null : (
              <div className="w-full box-border flex">
                <div
                  className="flex items-center w-full"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <span
                    style={{ flexGrow: 1 }}
                    className={`list-th-span ${(header.column.columnDef.meta as { headerAlign?: string })?.headerAlign ?? 'text-left'} font-semibold`}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </span>
                  {header.column.getIsSorted() && (
                    <span className="box-border">
                      {header.column.getIsSorted() === 'asc' && <FaChevronUp />}
                      {header.column.getIsSorted() === 'desc' && <FaChevronDown />}
                    </span>
                  )}
                </div>
                {header.column.id !== 'select' && header.column.id !== 'settings' && (
                  <div
                    {...{
                      onDoubleClick: () => header.column.resetSize(),
                      onMouseDown: header.getResizeHandler(),
                      onTouchStart: header.getResizeHandler(),
                      className: `box-border active:bg-primary resizer ${table.options.columnResizeDirection} 
                            ${header.column.getIsResizing() ? 'isResizing' : ' '}`,
                    }}
                  ></div>
                )}
              </div>
            )}
          </th>
        ))}
      </tr>
    ))}
  </thead>
)
interface TableBodyProps {
  table: Table<any>
  isDragable: boolean
  dataState: dataStateType
  dataIds: UniqueIdentifier[]
  viewItem: (row: Row<any>) => void
  rowSelection: Record<string, boolean>
  idRow: string
  col_name: string
  groupingSpacer: (level: number) => ReactNode
  generateRowData: (row: Row<any>) => void
  listGroupBy: ListGByItem[]
  groupedList: GroupedItemsType[]
  setGroupedList: (groupedList: GroupedItemsType[]) => void
  config: any
}
const TableBody = ({
  table,
  isDragable,
  dataState,
  dataIds,
  viewItem,
  rowSelection,
  idRow,
  col_name,
  groupingSpacer,
  generateRowData,
  listGroupBy,
  groupedList,
  setGroupedList,
  config,
}: TableBodyProps) => {
  return (
    <tbody>
      <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
        {table?.getRowModel().rows.map((row, i) => (
          <Fragment key={i}>
            {isDragable && dataState !== dataStateType.GROUPED ? (
              <DraggableRow
                key={row?.id}
                row={row}
                index={i}
                col_name={col_name ?? ''}
                rowSelection={rowSelection}
                idRow={idRow}
                viewItem={() => viewItem(row)}
              />
            ) : (
              <StandardRow
                row={row}
                viewItem={() => {
                  if (config.new_url !== null) viewItem(row)
                }}
                dataState={dataState}
                listGroupBy={listGroupBy}
                groupingSpacer={groupingSpacer}
                generateRowData={generateRowData}
                rowSelection={rowSelection}
                idRow={idRow}
                col_name={col_name ?? ''}
                groupedList={groupedList}
                setGroupedList={setGroupedList}
              />
            )}
          </Fragment>
        ))}
      </SortableContext>
    </tbody>
  )
}

const StandardRow = ({
  row,
  viewItem,
  dataState,
  listGroupBy,
  groupingSpacer,
  rowSelection,
  idRow,
  col_name,
  generateRowData,
  groupedList,
  setGroupedList,
}: {
  row: Row<any>
  viewItem: (row: Row<any>) => void
  dataState: dataStateType
  rowSelection: Record<string, boolean>
  idRow: string
  col_name: string
  listGroupBy: ListGByItem[]
  groupingSpacer: (level: number) => ReactNode
  generateRowData: (row: Row<any>) => void
  groupedList: GroupedItemsType[]
  setGroupedList: (groupedList: GroupedItemsType[]) => void
}) => {
  const { setFrmLoading, executeFnc, config, itemsPerPage, setRowSelection } = useAppStore()
  const { filters } = useUserStore()

  const handleSubRowsPagination = async (
    row: Row<GroupedItemsType>,
    direction: 'back' | 'next'
  ) => {
    try {
      const { currentPage: current, totalItems, pages: totalPages } = row.original
      setFrmLoading(true)
      const actualPage =
        direction === 'back'
          ? current === 1
            ? totalPages
            : current - 1
          : current === totalPages
            ? 1
            : current + 1

      const columns = row.original.parents.map((elem) => ({ col: elem.key, val: elem.value }))

      const data = await executeFnc(config.fnc_name, 's', [
        ...filters,
        [filters.length, 'gby_select', [{ page: actualPage }, { columns }]],
      ])

      const newGroupData = {
        groupItems: data.oj_data ?? [],
        currentPage: actualPage,
        first: (actualPage - 1) * itemsPerPage + 1,
        last: totalItems < actualPage * itemsPerPage ? totalItems : actualPage * itemsPerPage,
      }

      setGroupedList(
        groupedList.map((elem) => {
          if (elem.groupKey === row.original.groupKey) {
            return { ...elem, ...newGroupData }
          }
          return {
            ...elem,
            groupItems: updateGroupItemsRecursively(
              elem.groupItems,
              row.original.groupKey,
              newGroupData,
              JSON.stringify(row.original.parents)
            ),
          }
        })
      )

      setRowSelection(() => ({}))
    } catch (e) {
      console.log('error in handeSubRowsPagination', e)
    } finally {
      setFrmLoading(false)
    }
  }

  const handleBackSubRows = (row: Row<GroupedItemsType>) => handleSubRowsPagination(row, 'back')
  const handleNextSubRows = (row: Row<GroupedItemsType>) => handleSubRowsPagination(row, 'next')

  return (
    <tr
      key={row?.id}
      className={`group list-tr border-b border-opacity-30
    ${!row.getIsSelected() ? 'odd:bg-white even:bg-[#f9fafbf6] hover:bg-gray-200 border-b-[#c5c3c3b7]' : ''}
    ${row.getIsSelected() ? 'bg-[#d1ecf1]' : ''}
    ${rowSelection[row.original[idRow] as string] ? 'text-gray-900' : ''}
  `}
      style={{ height: '44px' }}
    >
      {row.getCanExpand() ? (
        <>
          {row.getVisibleCells().map((_, ind) => (
            <Fragment key={ind}>
              {ind === 1 && (
                <td colSpan={row.getVisibleCells().length} className="font-medium">
                  <div className="w-full flex justify-between">
                    <div className="ml-2 flex gap-2">
                      {groupingSpacer(row.original.level)}
                      <button onClick={row.getToggleExpandedHandler()}>
                        <div className="h-full w-full">
                          {row.getIsExpanded() ? (
                            <IoMdArrowDropdown style={{ width: '16px' }} />
                          ) : (
                            <IoMdArrowDropright
                              style={{ width: '16px' }}
                              onClick={() => generateRowData(row)}
                            />
                          )}
                        </div>
                      </button>
                      {row.original.groupName} {` (${row.original.totalItems})`}{' '}
                    </div>
                    <div>
                      {row.original.level + 1 === listGroupBy.length && row.getIsExpanded()
                        ? row.original.pages > 1 && (
                            <div className="flex items-center gap-2">
                              {`${row.original.first}-${row.original.last} / ${row.original.totalItems}  `}
                              <span className="flex items-center gap-1">
                                <button
                                  onClick={() => handleBackSubRows(row)}
                                  className="border px-2 rounded-sm bg-gray-50"
                                >
                                  <MdArrowBackIos />
                                </button>
                                <button
                                  onClick={() => handleNextSubRows(row)}
                                  className="border px-2 rounded-sm bg-gray-50"
                                >
                                  <MdArrowForwardIos />
                                </button>
                              </span>
                            </div>
                          )
                        : ' '}
                    </div>
                  </div>
                </td>
              )}
            </Fragment>
          ))}
        </>
      ) : (
        row.getVisibleCells().map((cell) => {
          if (cell.id.includes('drag-handle') && dataState === dataStateType.GROUPED)
            return <td key={cell.id}></td>
          return (
            <td
              key={cell.id}
              onClick={() => {
                if (
                  cell.column.id !== 'select' &&
                  cell.column.id !== 'is_favorite' &&
                  cell.column.id !== 'state'
                ) {
                  viewItem(row)
                }
              }}
              className={` ${Object.keys(cell.row.original).length ? 'cursor-pointer' : ''} ${
                cell.column.id === 'select' &&
                ` left-sticky ${
                  rowSelection[row.original[idRow] as string]
                    ? 'bg-sgreen-100 group-hover:bg-sgreen-200 text-gray-900'
                    : `border-gray-300 group-hover:bg-gray-200`
                }`
              }
              px-2 py-3 truncate`}
            >
              <div
                className={`cell-list-view-truncate ${(cell.column.columnDef as { className?: string })?.className} ${cell.column.id === 'select' && ' text-hideable'}`}
              >
                {cell.column.id === col_name ? (
                  <Tooltip arrow title={flexRender(cell.column.columnDef.cell, cell.getContext())}>
                    <div className="text-hideable truncate">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </Tooltip>
                ) : (
                  <div
                    className={`text-hideable truncate ${(cell.column.columnDef.meta as { textAlign?: string })?.textAlign ?? 'text-left'}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                )}
              </div>
            </td>
          )
        })
      )}
    </tr>
  )
}
