import useAppStore from '@/store/app/appStore'
import 'react-simple-keyboard/build/css/index.css'
import Keyboard from 'react-simple-keyboard'
import { Dialog, DialogTitle, DialogContent, IconButton, Paper } from '@mui/material'
import Draggable from 'react-draggable'
import { useRef } from 'react'
import { MdClose } from 'react-icons/md'

export default function VirtualKeyboardDialog() {
  const {
    vKeyboardOpen,
    setVKeyboardOpen,
    focusedInputRef,
    focusedFieldOnChange,
    setFocusedInputRef,
    setFocusedFieldOnChange,
  } = useAppStore((state) => state)
  const nodeRef = useRef<HTMLDivElement | null>(null)

  function DraggablePaper(props: any) {
    return (
      <Draggable nodeRef={nodeRef as any} handle="#vk-header">
        <Paper ref={nodeRef} {...props} />
      </Draggable>
    )
  }

  const handleKeyPress = (key: string) => {
    const input = focusedInputRef?.current
    if (!input) return

    if (key === '{bksp}') {
      input.value = input.value.slice(0, -1)
    } else {
      input.value += key
    }

    // Dispara evento para que React/MUI actualice el control
    input.dispatchEvent(new Event('input', { bubbles: true }))
    // Notifica al react-hook-form a través del onChange original del field
    if (typeof focusedFieldOnChange === 'function') {
      focusedFieldOnChange({ target: { value: input.value, name: input.name } })
    }
  }

  return (
    <Dialog
      open={vKeyboardOpen}
      onClose={() => {
        setVKeyboardOpen(false)
        setFocusedInputRef(null)
        setFocusedFieldOnChange(null)
      }}
      hideBackdrop
      disableEnforceFocus
      disableAutoFocus
      disableRestoreFocus
      disableScrollLock
      keepMounted
      sx={{ zIndex: 2000 }}
      PaperComponent={DraggablePaper}
      PaperProps={{
        component: Paper,
        elevation: 6,
        sx: {
          position: 'fixed',
          right: '50%',
          transform: 'translateX(50%)',
          bottom: 16,
          m: 0,
          width: 600,
          pointerEvents: 'auto',
          zIndex: 2001,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'move',
        }}
        id="vk-header"
      >
        Teclado
        <IconButton size="small" onClick={() => setVKeyboardOpen(false)}>
          <MdClose />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <Keyboard
          onKeyPress={handleKeyPress}
          layout={{
            default: [
              '1 2 3 4 5 6 7 8 9 0 {bksp}',
              'q w e r t y u i o p',
              'a s d f g h j k l',
              'z x c v b n m',
            ],
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
