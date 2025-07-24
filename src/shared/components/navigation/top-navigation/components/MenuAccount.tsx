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
import { usePWA } from '@/hooks/usePWA'

export const MenuAccount = () => {
  const navigate = useNavigate()
  const userData = useUserStore((state) => state.userData)
  const setUserSession = useUserStore((state) => state.setUserSession)
  const changeEmpPred = useUserStore((state) => state.changeEmpPred)
  const setUsersEmpSelected = useAppStore((state) => state.setUsersEmpSelected)
  const { installApp } = usePWA()
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

  const handleInstallApp = async () => {
    console.log('Intentando instalar la PWA...')
    await installApp()
    handleClose()
  }

  useEffect(() => {
    if (userData?.nombre) {
      setWordName(userData.nombre[0])
    }
  }, [userData])

  return (
    <>
      <button className="ls_user_avatar" onClick={handleClick}>
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
        {/* Solo mostrar si realmente se puede instalar */}

        <MenuItem onClick={handleInstallApp}>
          <ListItemText>Instalar aplicación</ListItemText>
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
