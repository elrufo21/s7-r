import { MouseEvent } from 'react'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { MdDragHandle, MdViewModule } from 'react-icons/md'
import { ViewTypeEnum } from '@/shared/shared.types'
import { PiListBold } from 'react-icons/pi'
import { TbLayoutKanbanFilled } from 'react-icons/tb'

type ViewTypeIconsProps = {
  viewType: ViewTypeEnum
  changeView: (newValue: ViewTypeEnum) => void
  listViews: ViewTypeEnum[]
}

export const ViewTypeIcons = ({ viewType, changeView, listViews }: ViewTypeIconsProps) => {
  const handleButtonClick = (event: MouseEvent, value: ViewTypeEnum) => {
    event.preventDefault()
    changeView(value)
  }

  const iconView = (value: ViewTypeEnum) => {
    switch (value) {
      case ViewTypeEnum.LIST:
        return (
          <PiListBold
            size={22}
            className={
              `group-hover:${value === viewType ? '' : 'text-gray-300'} ` +
              (value === viewType ? 'text-teal-800' : '')
            }
          />
        )
      case ViewTypeEnum.KANBAN:
        return (
          <TbLayoutKanbanFilled
            size={26}
            className={
              `group-hover:${value === viewType ? '' : 'text-gray-300'} ` +
              (value === viewType ? 'text-teal-800' : '')
            }
          />
        )
      case ViewTypeEnum.DRAGLIST:
        return (
          <MdDragHandle
            size={22}
            className={
              `group-hover:${value === viewType ? '' : 'text-gray-300'} ` +
              (value === viewType ? 'text-teal-800' : '')
            }
          />
        )
      default:
        return (
          <MdViewModule
            size={22}
            className={
              `group-hover:${value === viewType ? '' : 'text-gray-300'} ` +
              (value === viewType ? 'text-teal-800' : '')
            }
          />
        )
    }
  }

  return (
    <ToggleButtonGroup
      orientation="horizontal"
      value={viewType}
      exclusive
      onChange={handleButtonClick}
    >
      {listViews.map((value, i) => {
        return (
          <ToggleButton
            key={i}
            value={value}
            sx={{ height: '37px', width: '40px' }}
            className="group"
          >
            {iconView(value)}
          </ToggleButton>
        )
      })}
    </ToggleButtonGroup>
  )
}
