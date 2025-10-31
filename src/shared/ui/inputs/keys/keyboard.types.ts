export type KeyboardPosition = {
  position: 'top' | 'bottom'
}

export type GlobalKeyboardState = {
  activeInputRef: HTMLInputElement | HTMLTextAreaElement | null
  showKeyboard: boolean
  setShowKeyboard: ((show: boolean) => void) | null
}

export const globalKeyboardState: GlobalKeyboardState = {
  activeInputRef: null,
  showKeyboard: false,
  setShowKeyboard: null,
}
