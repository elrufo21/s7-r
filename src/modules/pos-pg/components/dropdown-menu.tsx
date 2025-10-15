import type React from 'react'
import { useState } from 'react'
import { Button, Menu, MenuItem, Typography } from '@mui/material'
import { MdKeyboardArrowDown } from 'react-icons/md'

interface DropdownMenuProps {
  options: string[]
  selectedValue?: string
  onSelect?: (value: string) => void
  buttonClassName?: string
  menuClassName?: string
}

export default function DropdownMenu({
  options,
  selectedValue = options[0],
  onSelect,
  buttonClassName = '',
  menuClassName = '',
}: DropdownMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selected, setSelected] = useState(selectedValue)
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

  return (
    <div>
      <Button
        onClick={handleClick}
        endIcon={<MdKeyboardArrowDown />}
        className={`normal-case text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 ${buttonClassName}`}
        sx={{
          textTransform: 'none',
          color: '#374151',
          borderColor: '#d1d5db',
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: '#f9fafb',
          },
        }}
      >
        {selected}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className={menuClassName}
        MenuListProps={{
          sx: {
            padding: 0,
            minWidth: '120px',
          },
        }}
        PaperProps={{
          sx: {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            border: '1px solid #e5e7eb',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            onClick={() => handleSelect(option)}
            className={`px-4 py-2 text-sm ${selected === option ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
            sx={{
              fontSize: '0.875rem',
              backgroundColor: selected === option ? '#eff6ff' : 'transparent',
              color: selected === option ? '#1d4ed8' : '#374151',
              '&:hover': {
                backgroundColor: selected === option ? '#eff6ff' : '#f9fafb',
              },
            }}
          >
            <Typography variant="body2" component="span">
              {option}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
