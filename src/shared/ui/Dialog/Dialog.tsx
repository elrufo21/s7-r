import Button from '@mui/material/Button'
import { Dialog as DialogMui } from '@mui/material'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { Typography } from '@mui/material'

import { BsExclamationCircle } from 'react-icons/bs'
import useAppStore from '@/store/app/appStore'

const Dialog = () => {
  const appDialog = useAppStore((state) => state.appDialog)
  const setAppDialog = useAppStore((state) => state.setAppDialog)
  const setFrmDialogAction = useAppStore((state) => state.setFrmDialogAction)
  const frmDialogLoading = useAppStore((state) => state.frmDialogLoading)

  const onConfirm = async () => {
    if (appDialog.handleConfirm) {
      await appDialog.handleConfirm()
      setAppDialog({ ...appDialog, open: false })
      return
    }
    setAppDialog({ ...appDialog, open: false })
  }

  const handleSave = () => {
    setFrmDialogAction('save')
  }

  const handleClose = () => {
    setAppDialog({ ...appDialog, open: false })
  }

  return (
    <DialogMui
      sx={{ overflow: 'initial' }}
      maxWidth={appDialog.isForm && 'md'}
      open={appDialog.open}
      onClose={handleClose}
    >
      {appDialog.isForm ? (
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {appDialog.title}
        </DialogTitle>
      ) : (
        <DialogContent>
          <div className="flex justify-center">
            <BsExclamationCircle size={40} className="text-lred dark:text-bred" />
          </div>
          <DialogContentText className="mb-5 font-medium text-center text-2xl">
            {appDialog.title}
          </DialogContentText>
        </DialogContent>
      )}

      <DialogContent sx={{ padding: 0, overflow: 'initial' }} className="w-full mb-3">
        {appDialog.content}
      </DialogContent>
      {appDialog.isForm ? (
        <DialogActions>
          <div className="o_form_buttons_edit d-flex gap-1">
            <button
              disabled={frmDialogLoading}
              onClick={handleSave}
              type="button"
              className="btn btn-primary o_form_button_save"
            >
              {appDialog.listSearch ? 'Nuevo' : 'Guardar y cerrar'}{' '}
            </button>
            <button
              disabled={frmDialogLoading}
              onClick={handleClose}
              type="button"
              className="btn btn-secondary o_form_button_cancel"
            >
              {appDialog.listSearch ? 'Cerrar' : 'Descartar'}
            </button>
          </div>
        </DialogActions>
      ) : (
        <DialogActions>
          {appDialog.actions ? (
            <div className="w-full grid_native grid-flow-col justify-stretch">
              <Button sx={{ paddingX: 2 }} onClick={handleClose}>
                <Typography fontSize={'16px'} sx={{ textTransform: 'none' }}>
                  ¡No, cancelar!
                </Typography>
              </Button>
              <Button
                className="text-lred dark:text-bred"
                sx={{ paddingX: 2 }}
                onClick={onConfirm}
                autoFocus
              >
                <Typography fontSize={'16px'} sx={{ textTransform: 'none' }}>
                  {appDialog.textConfirm ? appDialog.textConfirm : '¡Si, elimínalo!'}
                </Typography>
              </Button>
            </div>
          ) : (
            <div className="w-full grid_native grid-flow-col justify-stretch">
              <Button sx={{ paddingX: 2 }} onClick={handleClose}>
                <Typography fontSize={'16px'} sx={{ textTransform: 'none' }}>
                  Cerrar
                </Typography>
              </Button>
            </div>
          )}
        </DialogActions>
      )}
    </DialogMui>
  )
}
export default Dialog
