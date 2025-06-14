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

  // Cerrar diálogo por ID en lugar de índice
  const handleCloseDialog = (dialogId: string) => {
    setNewAppDialogs(newAppDialogs.filter((dialog) => dialog.id !== dialogId))
  }
  return (
    <>
      {newAppDialogs.map((dialog) => {
        return (
          <Dialog
            key={dialog.id}
            open={dialog.open}
            onClose={() => handleCloseDialog(dialog.id)}
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
            {!dialog.customHeader && (
              <IconButton
                aria-label="close"
                onClick={() => handleCloseDialog(dialog.id)}
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <IoClose />
              </IconButton>
            )}

            <DialogContent dividers={true} sx={{ padding: 0 }} className="modal-dialog">
              {dialog.content(() => handleCloseDialog(dialog.id))}
            </DialogContent>

            <DialogActions className="modal-footer !p-[15px]">
              {dialog.customHeader ? (
                <button
                  className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={() => handleCloseDialog(dialog.id)}
                >
                  Descartar
                </button>
              ) : (
                <div className="o_form_buttons_edit d-flex">
                  {dialog.buttons.map((button, index) => (
                    <button
                      key={index}
                      className={clsx(
                        'py-[5px] px-[10px] text-white border-[1.5px] border-[#e7e9ed]/50 rounded-[4px] font-semibold',
                        button.type === 'confirm'
                          ? 'bg-[#714b67] hover:bg-[#52374b]'
                          : 'bg-[#374151] hover:bg-[#d8dadd]',
                        button.className
                      )}
                      onClick={button.onClick}
                    >
                      {button.text}
                    </button>
                  ))}
                </div>
              )}
            </DialogActions>
          </Dialog>
        )
      })}
    </>
  )
}
