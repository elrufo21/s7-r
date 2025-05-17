import { MouseEvent, useEffect, useState } from 'react'

import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import { signOut } from '@/data/auth'
import useUserStore from '@/store/persist/persistStore'
import { useNavigate } from 'react-router-dom'
import useAppStore from '@/store/app/appStore'

export const MenuAccount = () => {
  const navigate = useNavigate()
  const userData = useUserStore((state) => state.userData)
  const setUserSession = useUserStore((state) => state.setUserSession)
  const changeEmpPred = useUserStore((state) => state.changeEmpPred)
  const setUsersEmpSelected = useAppStore((state) => state.setUsersEmpSelected)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [wordName, setWordName] = useState<string>('')
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    changeEmpPred(null)
    setUsersEmpSelected([])
    await signOut()
    setUserSession(null)
    navigate('/auth')
  }

  useEffect(() => {
    if (userData?.nombre) {
      setWordName(userData.nombre[0])
    }
  }, [userData])

  return (
    <>
      <button
        onClick={handleClick}
        className="h-6 w-6 flex justify-center items-center mx-2 bg-green-600 rounded text-gray-200 dark:text-gray-300 focus:outline-none"
      >
        {userData?.avatar ? (
          <Avatar
            src={userData?.avatar?.[0].publicUrl}
            alt={userData?.name}
            sx={{ width: 26, height: 26 }}
            variant="rounded"
          />
        ) : (
          <span className="font-bold">{wordName}</span>
        )}
      </button>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 26,
              height: 26,
              ml: -0.5,
              mr: 1.75,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Mi perfil
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemText>Cambiar contraseña</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>{/* <Logout fontSize="small" /> */}</ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  )
}
