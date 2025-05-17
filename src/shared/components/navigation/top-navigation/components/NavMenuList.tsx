import { MouseEvent, ReactNode, useState } from 'react'

import { styled, alpha } from '@mui/material/styles'
import Menu, { MenuProps } from '@mui/material/Menu'
import ListItemIcon from '@mui/material/ListItemIcon'

interface NavMenuListProps {
  menu: string
  children: ReactNode
  icon?: ReactNode
  className?: string
  isClose?: boolean
}

const NavMenuList = ({
  menu,
  children,
  icon,
  className = '',
  isClose = true,
}: NavMenuListProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleClose_click = () => {
    if (isClose) setAnchorEl(null)
  }

  return (
    <>
      <div className={'MenuButtonEx ' + className} onClick={handleClick}>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}

        {menu}
      </div>
      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose_click}
        className="menuEx"
      >
        {children}
      </StyledMenu>
    </>
  )
}

export default NavMenuList

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    {...props}
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}))
