import {
  useRef,
  useEffect,
  useState,
  MouseEvent,
  ChangeEvent,
  KeyboardEvent,
  useCallback,
} from 'react'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import { Menu, Divider } from '@mui/material'
import Grid from '@mui/material/Grid2'
import Popper from '@mui/material/Popper'
import { ClickAwayListener } from '@mui/base/ClickAwayListener'
import { TiArrowSortedDown } from 'react-icons/ti'
import { GroupBy } from './GroupBy'
import { FilterBy } from './FilterBy'
import { IoSearch } from 'react-icons/io5'
import { SearchFiltersEnum } from '@/shared/components/navigation/navigation.types'
import {
  FormConfig,
  ListFilterItem,
  ListGByItem,
  ListInputItem,
  ViewTypeEnum,
} from '@/shared/shared.types'
import { SelectedFilters } from './input/SelectedFilters'
import { ExpandedState } from '@tanstack/react-table'
import { useLocation } from 'react-router-dom'

type SearchInputProps = {
  config: FormConfig
  setFilters: (filters: any[], actualCurrentPage: number) => void
  filtersLocal: any[]
  setFiltersLocal: (filters: any) => void
  searchFiltersLabel: any[]
  setSearchFiltersLabel: (searchFiltersLabel: any[]) => void
  listFilterBy: ListFilterItem[]
  setListGroupBy: (data: ListGByItem[]) => void
  setListFilterBy: (data: ListFilterItem[]) => void
  actualCurrentPage: number
  setExpandedData: (expandedData: ExpandedState) => void
  setPrevFilters: (prevFilters: any[]) => void
  prevFilters: any[]
  setActualCurrentPage: (page: number) => void
  setKanbanCurrentPage?: (page: number) => void
  setListCurrentPage: (page: number) => void
  setGroupByData: (groupByData: Record<string, any>[]) => void
  setViewType?: (viewType: ViewTypeEnum) => void
  listGroupBy: ListGByItem[]
  setListViewData: (listViewData: any[]) => void
}
type FilterType = ListInputItem | ListFilterItem | ListGByItem

type GroupedDataType = {
  [key: string]: ListFilterItem[]
}

export const SearchInput = ({
  config,
  setFilters,
  filtersLocal,
  setFiltersLocal,
  searchFiltersLabel,
  setSearchFiltersLabel,
  listFilterBy,
  setListGroupBy,
  setListFilterBy,
  actualCurrentPage,
  setExpandedData,
  setPrevFilters,
  prevFilters,
  setActualCurrentPage,
  setKanbanCurrentPage,
  setListCurrentPage,
  setGroupByData,
  setViewType,
  listGroupBy,
  setListViewData,
}: SearchInputProps) => {
  const inputReference = useRef<HTMLDivElement | null>(null)

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [anchorEl_2, setAnchorEl_2] = useState<HTMLButtonElement | null>(null)

  const [filtersColumns, setFiltersColumns] = useState<ListInputItem[]>([])
  const [filtersSorted, setFiltersSorted] = useState<any[]>(prevFilters)
  const [inputSearch, setInputSearch] = useState('')
  const [swBox, setSwBox] = useState(false)
  const pathname = useLocation().pathname
  const open = Boolean(anchorEl_2)
  const id = open ? 'simple-popper' : undefined
  const buildItemsSelected = () => {
    const reduceFilters = searchFiltersLabel.reduce((acc, value) => {
      if (value.type === SearchFiltersEnum.FILTER_BY) {
        if (!acc[value.group]) {
          acc[value.group] = {
            type: value.type,
            grouper: value.group,
            items: [{ key: value.key, value: value.title, type: value.type }],
          }
        } else {
          acc[value.group].items.push({ key: value.key, value: value.title, type: value.type })
        }
      }
      if (value.type === SearchFiltersEnum.GROUP_BY) {
        if (!acc[value.type]) {
          acc[value.type] = {
            type: value.type,
            grouper: value.type,
            items: [{ key: value.key_gby, value: value.title, type: value.type }],
          }
        } else {
          acc[value.type].items.push({ key: value.key_gby, value: value.title, type: value.type })
        }
      }
      if (value.type === SearchFiltersEnum.BY_INPUT) {
        if (!acc[value.dsc]) {
          acc[value.dsc] = {
            type: value.type,
            grouper: value.dsc,
            items: [{ key: value.dsc, value: value.input, type: value.type }],
          }
        } else {
          acc[value.dsc].items.push({ key: value.key, value: value.input, type: value.type })
        }
      }
      return acc
    }, {})
    return Object.values(reduceFilters)
  }

  const addFilter = (item: any, type: SearchFiltersEnum) => {
    setInputSearch('')
    setActualCurrentPage(1)
    if (setKanbanCurrentPage) setKanbanCurrentPage(1)
    setListCurrentPage(1)
    if (type === SearchFiltersEnum.BY_INPUT)
      setSearchFiltersLabel([...searchFiltersLabel, { ...item, type }])
    if (type === SearchFiltersEnum.FILTER_BY) {
      const existFilterBy = searchFiltersLabel.some(
        (filter) => filter.type === SearchFiltersEnum.FILTER_BY && filter.key === item.key
      )
      if (!existFilterBy) setSearchFiltersLabel([...searchFiltersLabel, { ...item, type }])
      if (existFilterBy)
        setSearchFiltersLabel(searchFiltersLabel.filter((filter) => filter.key !== item.key))
    }
    if (type === SearchFiltersEnum.GROUP_BY) {
      const existFilterGroupBy = searchFiltersLabel.some(
        (filter) => filter.type === SearchFiltersEnum.GROUP_BY && filter.key === item.key
      )
      if (!existFilterGroupBy) setSearchFiltersLabel([...searchFiltersLabel, { ...item, type }])
      if (existFilterGroupBy)
        setSearchFiltersLabel(searchFiltersLabel.filter((filter) => filter.key !== item.key))
      setExpandedData({})
      //setListViewData(listViewData.map((elem) => ({ ...elem, groupItems: [{}] })))
    }

    const updateFilterItems = (filterType: SearchFiltersEnum, newItems: FilterType[]) => {
      return filtersLocal.map((filter) =>
        filter.type === filterType ? { ...filter, items: newItems } : filter
      )
    }

    const removeFilterIfEmpty = (existingFilter: any) => {
      const updatedItems = existingFilter.items.filter(
        (existingItem: any) => existingItem.key !== item.key
      )
      if (updatedItems.length === 0) {
        return filtersLocal.filter((filter) => filter.type !== type)
      }
      return updateFilterItems(type, updatedItems)
    }

    const existingFilter = filtersLocal.find((filter) => filter.type === type)

    if (existingFilter) {
      if (type === SearchFiltersEnum.BY_INPUT) {
        // Agregar el item al filtro BY_INPUT
        setFiltersLocal(updateFilterItems(type, [...existingFilter.items, item]))
      } else {
        const isItemExist = existingFilter.items.some(
          (existingItem: any) => existingItem.key === item.key
        )

        if (isItemExist) {
          // Eliminar el item si existe
          setFiltersLocal(removeFilterIfEmpty(existingFilter))
        } else {
          // Agregar el item nuevo
          setFiltersLocal(updateFilterItems(type, [...existingFilter.items, item]))
        }
      }
    } else {
      // Si el filtro no existe, crear uno nuevo
      setFiltersLocal([...filtersLocal, { type, items: [item] }])
    }
  }

  useEffect(() => {
    if (!config?.filters || !Array.isArray(config.filters)) return
    if (filtersLocal.length > 0) return

    if (pathname === config.module_url) {
      const groupedFilters = config.filters.reduce(
        (acc, filter) => {
          if (!Array.isArray(filter.list)) return acc

          const defaultItems = filter.list.filter((item) => item.default)

          if (defaultItems.length > 0) {
            if (acc.length === 0) {
              acc.push({
                type: 'fcon',
                items: [],
              })
            }

            acc[0].items.push(...defaultItems)
          }

          return acc
        },
        [] as { type: string; items: any[] }[]
      )

      setFiltersLocal(groupedFilters)

      const defaultFilterItems = groupedFilters.flatMap((group) =>
        group.items.filter((item) => item.default)
      )
      setListFilterBy(defaultFilterItems)

      setSearchFiltersLabel(
        groupedFilters.flatMap((group) =>
          group.items.map((item) => ({ ...item, type: group.type }))
        )
      )
    }
  }, [config?.filters, pathname])

  const buildFiltersToSend = useCallback(() => {
    const formatFilters = filtersLocal.flatMap((filter) => {
      if (filter.type === SearchFiltersEnum.FILTER_BY) {
        const items = filter.items as ListFilterItem[]
        const groupedData = items.reduce<GroupedDataType>((acc, item) => {
          if (!acc[item.group]) {
            acc[item.group] = []
          }
          // Agregamos el item al grupo correspondiente
          acc[item.group].push(item)
          return acc
        }, {})
        const filterItem = Object.entries(groupedData).map(([key, value]) => [
          filter.type,
          value.map((elem) => elem.title),
          key,
          value.map((elem) => ({ key: elem.key, key_db: elem.key_db ?? '', value: elem.value })),
        ])
        return filterItem
      }
      if (filter.type === SearchFiltersEnum.GROUP_BY) {
        const items = filter.items as ListGByItem[]
        const gbItem = [
          filter.type,
          items.map((elem) => elem.title),
          items.map((elem) => elem.key),
          items.map((elem) => elem.key_gby),
        ]
        return [gbItem]
      }
      //TODO: ADD INPUT FILTER
      if (filter.type === SearchFiltersEnum.BY_INPUT) {
        const items = filter.items as ListInputItem[]
        const groupInputs: Record<string, any> = items.reduce(
          (acc: any, { key, dsc, input }: any) => {
            if (!acc[key]) {
              acc[key] = { key, dsc, inputs: [input] }
            } else {
              acc[key].inputs.push(input)
            }
            return acc
          },
          {}
        )
        const inputItem = Object.values(groupInputs).map((input) => [
          filter.type,
          input.inputs,
          input.key,
          input.dsc,
        ])
        return inputItem
      }
      return []
    })
    setPrevFilters(formatFilters)
    setFiltersSorted(formatFilters)
  }, [filtersLocal])

  useEffect(() => {
    setFilters(filtersSorted, actualCurrentPage)
  }, [filtersSorted])

  useEffect(() => {
    buildFiltersToSend()
  }, [buildFiltersToSend, filtersLocal])

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (inputReference.current && !inputReference.current?.contains(event.target as Node)) {
        setSwBox(false)
      } else {
        setSwBox(true)
      }
    }
    window.addEventListener('mousedown', handleOutsideClick)
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [inputReference])

  const handleClickAway = () => {
    if (!swBox) {
      setInputSearch('')
      setAnchorEl_2(null)
      if (inputReference.current) inputReference.current.focus()
    }
  }
  useEffect(() => {
    if (anchorEl_2) {
      let count = 0
      const filtersColumns_tmp = (config.filters_columns ?? []).map((item) => {
        count = count + 1
        return {
          id: count,
          dsc: item.dsc,
          key: item.key,
          default: item.default,
        }
      })
      setFiltersColumns(filtersColumns_tmp)
    }
  }, [anchorEl_2, config?.filters_columns])

  const onClickOption = (item: any) => {
    addFilter({ ...item, input: inputSearch }, SearchFiltersEnum.BY_INPUT)
    setAnchorEl_2(null)
  }
  const onChangeInput = (value: string, event: ChangeEvent) => {
    setInputSearch(value)
    setAnchorEl_2(value.length ? (event.currentTarget as HTMLButtonElement) : null)
  }

  const onMouseMove = (item_selected: ListInputItem) => {
    const filtersColumns_local = filtersColumns.map((item: any) => {
      if (item.key !== item_selected.key) {
        return {
          ...item,
          default: false,
        }
      } else {
        return {
          ...item,
          default: true,
        }
      }
    })
    // Re-render with the new array
    setFiltersColumns(filtersColumns_local)
  }

  const onDelete = (item: any) => {
    setActualCurrentPage(1)
    if (setKanbanCurrentPage) setKanbanCurrentPage(1)
    setListCurrentPage(1)
    setGroupByData([])
    if (item.type === SearchFiltersEnum.GROUP_BY) {
      setSearchFiltersLabel(searchFiltersLabel.filter((filter) => filter.type !== item.grouper))
      setListGroupBy([])
    }
    if (item.type === SearchFiltersEnum.FILTER_BY) {
      setSearchFiltersLabel(searchFiltersLabel.filter((filter) => filter.group !== item.grouper))
      setListFilterBy(listFilterBy.filter((filter) => filter.group !== item.grouper))
      setFiltersLocal(
        filtersLocal.map((elem) => {
          const newItems = elem.items.filter((filter: any) => filter.group !== item.grouper)
          return { ...elem, items: newItems }
        })
      )
      return
    }
    if (item.type === SearchFiltersEnum.BY_INPUT) {
      setSearchFiltersLabel(searchFiltersLabel.filter((filter) => filter.dsc !== item.grouper))
      setFiltersLocal(
        filtersLocal.map((elem) => {
          const newItems = elem.items.filter((filter: any) => filter.dsc !== item.grouper)
          return { ...elem, items: newItems }
        })
      )
      return
    }
    setExpandedData({})
    setFiltersLocal(filtersLocal.filter((elem) => elem.type !== item.type))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key === 'Backspace' && !inputSearch) {
      const lastFilter = buildItemsSelected().at(-1)
      if (lastFilter) {
        onDelete(lastFilter)
      }
    }
    if (event.key === 'Enter') {
      if (inputSearch.length > 0) {
        addFilter(
          { ...filtersColumns.find((item) => item.default), input: inputSearch },
          SearchFiltersEnum.BY_INPUT
        )
        setAnchorEl_2(null)
      }
    } else if (event.key === 'Escape') {
      setInputSearch('')
      setAnchorEl_2(null)
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      const count_items = filtersColumns.length
      let item_next = filtersColumns.findIndex((item) => item.default)

      if (event.key === 'ArrowUp') {
        item_next = (item_next - 1 + count_items) % count_items
      } else if (event.key === 'ArrowDown') {
        item_next = (item_next + 1) % count_items
      }

      setFiltersColumns(
        filtersColumns.map((item, index) => ({
          ...item,
          default: index === item_next,
        }))
      )
    }
  }

  return (
    <Paper variant="outlined" className="w-full flex">
      <div
        className="w-full flex"
        style={{
          paddingLeft: '5px',
          paddingRight: '10px',
          paddingTop: '5px',
          paddingBottom: '4px',
        }}
      >
        <IoSearch className="self-center mr-1" size={18} />
        <div className="w-full flex items-center InputSearchEx">
          {/**change conditional */}
          <SelectedFilters filters={buildItemsSelected()} onDelete={onDelete} />

          <InputBase
            sx={{ flex: 1 }}
            placeholder="Buscar ..."
            inputProps={{ 'aria-label': 'buscar ...' }}
            fullWidth
            inputRef={inputReference}
            value={inputSearch}
            onChange={(e) => onChangeInput(e.target.value, e)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      {config?.filters && (
        <>
          <Divider className="h-auto" orientation="vertical" />
          <IconButton
            onClick={handleClick}
            color="primary"
            aria-label="filtros"
            className="flex items-center"
            disableRipple
          >
            <TiArrowSortedDown className="w-4 h-4 text-gray-700" />
          </IconButton>
          <Menu
            className="MenuSearchEx"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Grid container className="MenuSearchEx_container">
              <FilterBy
                config={config}
                addFilter={addFilter}
                listFilterBy={listFilterBy}
                setListFilterBy={setListFilterBy}
              />

              <Divider orientation="vertical" flexItem />

              <GroupBy
                config={config}
                addFilter={addFilter}
                setViewType={setViewType}
                listGroupBy={listGroupBy}
                setListViewData={setListViewData}
                setListCurrentPage={setListCurrentPage}
                setListGroupBy={setListGroupBy}
              />
            </Grid>
          </Menu>
        </>
      )}
      <ClickAwayListener onClickAway={handleClickAway}>
        <Popper id={id} open={open} anchorEl={anchorEl_2} className="card_2 !z-[9999]">
          <Paper className="sub_card_2" elevation={3}>
            {filtersColumns.length > 0 &&
              filtersColumns.map((item) => (
                <div
                  className={`item__filters_columns ${item.default ? ' focus' : ''}`}
                  onClick={() => onClickOption(item)}
                  onMouseMove={() => onMouseMove(item)}
                >
                  <div className="mr-1">Búsqueda</div>
                  <div className="mr-1 font-bold">{item.dsc}</div>
                  <div className="mr-1">para:</div>
                  <div className="font-bold" style={{ color: '#714B67' }}>
                    {inputSearch}
                  </div>
                </div>
              ))}
          </Paper>
        </Popper>
      </ClickAwayListener>
    </Paper>
  )
}
