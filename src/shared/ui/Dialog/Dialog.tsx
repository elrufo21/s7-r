import Button from '@mui/material/Button'
import { Dialog as DialogMui } from '@mui/material'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { Typography } from '@mui/material'

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
    appDialog?.handleCancel()
    setAppDialog({ ...appDialog, open: false })
  }

  return (
    <DialogMui
      className="l-modal-question"
      maxWidth={appDialog.isForm && 'md'}
      open={appDialog.open}
      onClose={handleClose}
    >
      {/*
      <button
      className='bg-gray-400'
        aria-label="close"
        onClick={handleClose}
        style={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}
      >
        <IoCloseSharp className="h-5 w-5 " />
      </button>
      */}
      {appDialog.isForm ? (
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {appDialog.title}
        </DialogTitle>
      ) : (
        <DialogContent>
          {/*
          <div className="flex justify-center">
            <BsExclamationCircle size={80} className="text-lred dark:text-bred" style={{ color: "rgba(0, 0, 0, 0.87)"}} />
          </div>
          */}
          <DialogContentText className="">{appDialog.title}</DialogContentText>
        </DialogContent>
      )}

      <DialogContent className="">{appDialog.content}</DialogContent>

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
            <>
              <Button
                className={`${appDialog.textConfirm ? 'btn_confirm' : 'btn_delete'}`}
                sx={{ paddingX: 2 }}
                onClick={onConfirm}
                autoFocus
              >
                {appDialog.textConfirm ? appDialog.textConfirm : '¡Si, elimínalo!'}
              </Button>
              <Button onClick={handleClose} className="btn_generic">
                ¡No, cancelar!
              </Button>
            </>
          ) : (
            <div className="w-full grid_native grid-flow-col justify-stretch">
              <Button onClick={handleClose}>
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
