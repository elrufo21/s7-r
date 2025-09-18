import { FormConfig, ListFilterItem } from '@/shared/shared.types'
import { SearchFiltersEnum } from '@/shared/components/navigation/navigation.types'
import { Divider, Grid2, MenuItem } from '@mui/material'
import { Fragment } from 'react'
import { GrFormCheckmark } from 'react-icons/gr'
import { VscFilterFilled } from 'react-icons/vsc'

type FilterByProps = {
  config: FormConfig
  addFilter: (item: any, type: SearchFiltersEnum) => void
  listFilterBy: ListFilterItem[]
  setListFilterBy: any
}

export const FilterBy = ({ config, addFilter, listFilterBy, setListFilterBy }: FilterByProps) => {
  const handleFilterBy = (item: any) => {
    const isSelected = listFilterBy.find((f: ListFilterItem) => f.key === item.key)
    if (isSelected) {
      setListFilterBy(listFilterBy.filter((f: ListFilterItem) => f.key !== item.key))
    } else {
      setListFilterBy([...listFilterBy, item])
    }
    addFilter(item, SearchFiltersEnum.FILTER_BY)
  }

  const renderMenuItem = (subItem: any, index: number) => {
    const isSelected = listFilterBy.some((filter) => filter.key === subItem.key)
    return (
      <MenuItem key={index} onClick={() => handleFilterBy(subItem)}>
        <span style={{ width: '14px' }}>
          {isSelected && <GrFormCheckmark className="text-cyan-600" style={{ fontSize: '18px' }} />}
        </span>
        <label>
          <span />
          <span className={`MenuItemText ${isSelected ? 'font-medium' : ''}`}>{subItem.title}</span>
        </label>
      </MenuItem>
    )
  }

  return (
    <Grid2 className="px-4">
      <div className="MenuHead">
        <div className="MenuHeadIcon">
          <VscFilterFilled color="RGBA(113, 75, 103, 1)" />
        </div>
        <div className="MenuText">Filtros</div>
      </div>
      {config?.filters?.map(
        (item, i) =>
          item?.list && (
            <Fragment key={i}>
              {item.list.map(renderMenuItem)}
              {i < config.filters.length - 1 && <Divider orientation="horizontal" flexItem />}
            </Fragment>
          )
      )}
    </Grid2>
  )
}
