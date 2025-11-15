import useAppStore from '@/store/app/appStore'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import { IoClose } from 'react-icons/io5'

import Paper from '@mui/material/Paper'
import Draggable from 'react-draggable'
import { Dialog } from '@mui/material'
import clsx from 'clsx'

function PaperComponent(props: any) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  )
}

export const NewMultiDialog = () => {
  const { newAppDialogs, setNewAppDialogs } = useAppStore()

  // Cerrar diálogo por ID con validación de disableClose
  const handleCloseDialog = async (dialogId: string) => {
    const dialog = newAppDialogs.find((d) => d.id === dialogId)

    if (!dialog) return

    if (dialog?.handleCloseDialog) await dialog?.handleCloseDialog()
    // ✅ Si el diálogo tiene disableClose: true, no lo cerrar
    if (dialog?.disableClose) {
      return
    }

    setNewAppDialogs(newAppDialogs.filter((dialog) => dialog.id !== dialogId))
  }
  return (
    <>
      {newAppDialogs.map((dialog) => {
        return (
          <Dialog
            key={dialog.id}
            open={dialog.open}
            onClose={dialog.disableClose ? undefined : () => handleCloseDialog(dialog.id)}
            disableEscapeKeyDown={dialog.disableClose}
            maxWidth={false}
            scroll={'paper'}
            PaperComponent={PaperComponent}
            className="modal o_technical_modal"
            fullScreen={dialog.fullScreen}
          >
            <DialogTitle id="draggable-dialog-title" className="ModalDialogTitle">
              {dialog.customHeader ? (
                dialog.customHeader
              ) : (
                <span className="modal-title fs-4">{dialog.title}</span>
              )}
            </DialogTitle>
            {!dialog.customHeader && !dialog.disableClose && (
              <IconButton
                aria-label="close"
                onClick={() => handleCloseDialog(dialog.id)}
                // className='!bg-gray-200 hover:!bg-gray-300'
                //className='hover:!bg-red-100 !p-0'
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: 6.5,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                {/* <IoClose /> */}
                {/* <IoClose style={{ fontSize: '20px' }} /> */}
                {/* <FaRegCircleXmark style={{ fontSize: '28px' }} className='text-red-500' /> */}
                <IoClose style={{ fontSize: '26px' }} className="text-gray-500" />
              </IconButton>
            )}

            <DialogContent dividers={false} sx={{ padding: 0 }} className="modal-dialog">
              <div className="overflow-y-auto max-h-[70vh]">
                {dialog.content(() => handleCloseDialog(dialog.id))}
              </div>
            </DialogContent>

            <DialogActions className="modal-footer !p-[15px]">
              {/* <div className="o_form_buttons_edit d-flex"> */}
              <div className="c-equivalent">
                {dialog.buttons.map((button, index) => (
                  <button
                    key={index}
                    className={clsx(
                      'c-equivalent-son btn btn-lg lh-lg',
                      button.type === 'confirm' ? 'btn-primary' : 'btn-secondary',
                      button.className
                    )}
                    onClick={button.onClick}
                  >
                    {button.text}
                  </button>

                  // <button
                  //   key={index}
                  //   className={clsx(
                  //     'py-[5px] px-[10px] text-white border-[1.5px] border-[#e7e9ed]/50 rounded-[4px] font-semibold',
                  //     button.type === 'confirm'
                  //       ? 'bg-[#714b67] hover:bg-[#52374b]'
                  //       : 'bg-[#374151] hover:bg-[#d8dadd]',
                  //     button.className
                  //   )}
                  //   onClick={button.onClick}
                  // >
                  //   {button.text}
                  // </button>
                ))}
              </div>
            </DialogActions>
          </Dialog>
        )
      })}
    </>
  )
}
