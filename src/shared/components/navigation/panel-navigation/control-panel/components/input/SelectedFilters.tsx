import { SearchFiltersEnum } from '@/shared/components/navigation/navigation.types'
import { FaFilter, FaLayerGroup } from 'react-icons/fa'
import { TbTrashX } from 'react-icons/tb'

export const SelectedFilters = ({
  filters,
  onDelete,
}: {
  filters: any[]
  onDelete: (item: any) => void
}) => {
  return (
    <>
      {filters.map((item, index) => (
        <div key={index} className="item__fcol rounded-start-2 rounded-end-2">
          <div
            className={`item__fcol_left rounded-start-2 ${item.type === SearchFiltersEnum.GROUP_BY ? 'groupBy' : 'filter'}`}
          >
            {item.type === SearchFiltersEnum.BY_INPUT ? (
              <>{item.items[0].key}</>
            ) : (
              <>
                {item.type === SearchFiltersEnum.GROUP_BY ? (
                  <FaLayerGroup style={{ fontSize: '10px' }} />
                ) : (
                  <FaFilter style={{ fontSize: '10px' }} />
                )}
              </>
            )}
          </div>
          <div className="item__fcol_right rounded-end-2">
            <div className="item__fcol_value">
              {item.items.map((subitem: any, index: number) => (
                <div key={subitem.value} className="flex items-center">
                  <small>{subitem.value}</small>
                  {index < item.items.length - 1 && (
                    <>
                      {item.type === SearchFiltersEnum.GROUP_BY ? (
                        <div className="item__fcol_value__sep">{'>'}</div>
                      ) : (
                        <em className="item__fcol_value__sep">o</em>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="item__fcol_close">
              <div className="item__fcol_close_cicon">
                <TbTrashX onClick={() => onDelete(item)} className="text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
