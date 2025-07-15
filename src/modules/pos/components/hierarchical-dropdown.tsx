import type React from 'react'
import { useState } from 'react'
import { Button, Menu, MenuItem, Typography, Tooltip } from '@mui/material'
import { MdKeyboardArrowDown } from 'react-icons/md'

interface MenuOption {
  label: string
  value: string
  children?: MenuOption[]
}

interface HierarchicalDropdownProps {
  options: MenuOption[]
  selectedValue?: string
  onSelect?: (value: string) => void
  buttonClassName?: string
  menuClassName?: string
}

export default function HierarchicalDropdown({
  options,
  selectedValue,
  onSelect,
  buttonClassName = '',
  menuClassName = '',
}: HierarchicalDropdownProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selected, setSelected] = useState(selectedValue || options[0]?.value || '')
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = (value: string) => {
    setSelected(value)
    onSelect?.(value)
    handleClose()
  }

  const getSelectedLabel = () => {
    const findLabel = (items: MenuOption[]): string => {
      for (const item of items) {
        if (item.value === selected) return item.label
        if (item.children) {
          const childLabel = findLabel(item.children)
          if (childLabel) return childLabel
        }
      }
      return ''
    }
    return findLabel(options)
  }

  const renderMenuItems = (items: MenuOption[], level = 0) => {
    return items.map((item) => (
      <div key={item.value}>
        <Tooltip title={item.label} placement="right" arrow>
          <MenuItem
            onClick={() => handleSelect(item.value)}
            className={`text-sm ${selected === item.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
            sx={{
              fontSize: '0.875rem',
              paddingLeft: `${16 + level * 16}px`,
              paddingRight: '16px',
              paddingTop: '8px',
              paddingBottom: '8px',
              backgroundColor: selected === item.value ? '#eff6ff' : 'transparent',
              color: selected === item.value ? '#1d4ed8' : '#374151',
              fontWeight: selected === item.value ? 500 : 400,
              minWidth: 0,
              '&:hover': {
                backgroundColor: selected === item.value ? '#eff6ff' : '#f9fafb',
              },
            }}
          >
            <Typography
              variant="body2"
              component="span"
              className="truncate max-w-[150px] sm:max-w-[200px] block"
            >
              {item.label}
            </Typography>
          </MenuItem>
        </Tooltip>
        {item.children && renderMenuItems(item.children, level + 1)}
      </div>
    ))
  }

  return (
    <div>
      <Tooltip title={getSelectedLabel()} placement="top" arrow>
        <Button
          onClick={handleClick}
          endIcon={<MdKeyboardArrowDown />}
          className={`normal-case text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 min-w-0 max-w-full ${buttonClassName}`}
          sx={{
            textTransform: 'none',
            color: '#374151',
            borderColor: '#d1d5db',
            backgroundColor: 'white',
            minWidth: 0,
            maxWidth: '100%',
            '&:hover': {
              backgroundColor: '#f9fafb',
            },
          }}
        >
          <span className="truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
            {getSelectedLabel()}
          </span>
        </Button>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className={menuClassName}
        MenuListProps={{
          sx: {
            padding: 0,
            minWidth: '140px',
            maxWidth: '90vw',
          },
        }}
        PaperProps={{
          sx: {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            border: '1px solid #e5e7eb',
          },
        }}
      >
        {renderMenuItems(options)}
      </Menu>
    </div>
  )
}
