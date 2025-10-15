import { useState } from 'react'
import { FormConfig, ListFilterItem } from '@/shared/shared.types'
import { SearchFiltersEnum } from '@/shared/components/navigation/navigation.types'
import { Divider, Grid2, MenuItem } from '@mui/material'
import { Fragment } from 'react'
import { GrFormCheckmark } from 'react-icons/gr'
import { VscFilterFilled } from 'react-icons/vsc'
import { IoMdArrowDropup } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";

type FilterByProps = {
  config: FormConfig
  addFilter: (item: any, type: SearchFiltersEnum) => void
  listFilterBy: ListFilterItem[]
  setListFilterBy: any
}

export const FilterBy = ({ config, addFilter, listFilterBy, setListFilterBy }: FilterByProps) => {
  const [openGroup, setOpenGroup] = useState<string | null>(null)

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
      <>
        <MenuItem key={index} onClick={() => handleFilterBy(subItem)}>
          <span style={{ width: '14px' }}>
            {isSelected && <GrFormCheckmark className="text-cyan-600" style={{ fontSize: '18px' }} />}
          </span>
          <label>
            <span className={`MenuItemText ${isSelected ? 'font-medium' : ''}`}>{subItem.title}</span>
          </label>
        </MenuItem>
        {(index === 1 && subItem.group === 'date') && (
          <Divider orientation="horizontal" flexItem />
        )}
      </>
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

      {config?.filters?.map((item, i) => (
        <Fragment key={i}>
          {item.collapsible ? (
            <>
              <MenuItem onClick={() => setOpenGroup(openGroup === item.title ? null : item.title)}>
                <span style={{ width: '14px' }}>
                  {/* {isSelected && <GrFormCheckmark className="text-cyan-600" style={{ fontSize: '18px' }} />} */}
                </span>
                <label>
                  <span className={`MenuItemText`}>{item.title}</span>
                </label>
                {openGroup === item.title ? <IoMdArrowDropup style={{ paddingTop: '2px', fontSize: '24px', marginRight: '8px' }} /> : <IoMdArrowDropdown style={{ paddingTop: '2px', fontSize: '24px', marginRight: '8px' }} />}
              </MenuItem>

              {openGroup === item.title && (
                // <div style={{ paddingLeft: '20px' }}>{item.list.map(renderMenuItem)}</div>
                <div className='prueba33'>{item.list.map(renderMenuItem)}</div>
              )}
            </>
          ) : (
            item.list.map(renderMenuItem)
          )}

          {i < config.filters.length - 1 && <Divider orientation="horizontal" flexItem />}
        </Fragment>
      ))}
    </Grid2>
  )
}
