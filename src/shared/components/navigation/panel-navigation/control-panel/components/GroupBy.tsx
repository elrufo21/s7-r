import { FormConfig, ListGByItem } from '@/shared/shared.types'
import { SearchFiltersEnum } from '@/shared/components/navigation/navigation.types'
import { ViewTypeEnum } from '@/shared/shared.types'
import { Divider, MenuItem } from '@mui/material'
import { Fragment } from 'react'
import { FaLayerGroup } from 'react-icons/fa'
import { GrFormCheckmark } from 'react-icons/gr'
import Grid from '@mui/material/Grid2'

type GroupByProps = {
  config: FormConfig
  addFilter: (item: ListGByItem, type: SearchFiltersEnum) => void
  setViewType?: (viewType: ViewTypeEnum) => void
  listGroupBy: ListGByItem[]
  setListGroupBy: (data: ListGByItem[]) => void
  setListCurrentPage: (page: number) => void
  setListViewData: (listViewData: any[]) => void
}
export const GroupBy = ({
  config,
  addFilter,
  setViewType,
  listGroupBy,
  setListGroupBy,
  setListCurrentPage,
  setListViewData,
}: GroupByProps) => {
  const handleGroupBy = (item: ListGByItem) => {
    if (setViewType) setViewType(ViewTypeEnum.LIST)
    const isSelected = listGroupBy.find((f: ListGByItem) => f.key_gby === item.key_gby)
    if (isSelected) {
      setListGroupBy(listGroupBy.filter((f: ListGByItem) => f.key_gby !== item.key_gby))
    } else {
      setListGroupBy([...listGroupBy, item])
      setListCurrentPage(1)
    }
    addFilter(item, SearchFiltersEnum.GROUP_BY)
    setListViewData([])
  }

  return (
    <Grid className="px-4">
      <div className="MenuHead">
        <div className="MenuHeadIcon">
          <FaLayerGroup color="RGBA(1, 126, 132, 1)" />
        </div>
        <div className="MenuText">Agrupar por</div>
      </div>

      {config?.group_by?.map(
        (item, i) =>
          item?.list && (
            <Fragment key={i}>
              {item?.list?.map((subItem, index) => {
                const isSelected = listGroupBy.find((filter) => filter.key_gby === subItem.key_gby)
                return (
                  <MenuItem onClick={() => handleGroupBy(subItem)} key={index}>
                    <span style={{ width: '14px' }}>
                      {isSelected && <GrFormCheckmark className="text-cyan-600" size={18} />}
                    </span>
                    <label>
                      <span className={`MenuItemText ${isSelected && ' font-medium'}`}>
                        {subItem.title}
                      </span>
                    </label>
                  </MenuItem>
                )
              })}
              {i < (config?.group_by ?? []).length - 1 && (
                <Divider orientation="horizontal" flexItem />
              )}
            </Fragment>
          )
      )}
    </Grid>
  )
}
