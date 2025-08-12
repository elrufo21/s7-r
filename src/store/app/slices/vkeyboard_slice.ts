import { SetState, VKeyboardSliceState } from '@/store/store.types'

const createVKeyboardSlice = (set: SetState<VKeyboardSliceState>): VKeyboardSliceState => ({
  vKeyboardOpen: false,
  setVKeyboardOpen: (vKeyboardOpen) => set({ vKeyboardOpen }),
  vKeyboardValue: '',
  setVKeyboardValue: (vKeyboardValue) => set({ vKeyboardValue }),
  focusedInputRef: null,
  setFocusedInputRef: (focusedInputRef) => set({ focusedInputRef }),
  focusedFieldOnChange: null,
  setFocusedFieldOnChange: (fn) => set({ focusedFieldOnChange: fn }),
})

export default createVKeyboardSlice
