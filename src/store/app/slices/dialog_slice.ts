import { DialogSliceState, SetState } from '@/store/store.types'

const createFrmDialogSlice = (set: SetState<DialogSliceState>): DialogSliceState => ({
  newAppDialogs: [],

  setNewAppDialogs: (dialogs) => set({ newAppDialogs: dialogs }),

  modalData: [],
  setModalData: (data) => set({ modalData: data }),

  searchTerm: '',
  setSearchTerm: (searchTerm) => set({ searchTerm }),

  openDialog: ({
    dialogContent,
    parentId = null,
    title,
    buttons = [],
    btnCreate = false,
    btnDiscard = false,
    contactModal = false,
    customHeader = false,
    fullScreen = false,
    disableClose = false,
    handleCloseDialog = null,
  }) => {
    const dialogId = crypto.randomUUID()
    set((state) => {
      const newDialog = {
        id: dialogId,
        parentId,
        open: true,
        title,
        content: (closeDialogWithData: any) => dialogContent(closeDialogWithData),
        buttons,
        btnCreate: btnCreate,
        btnDiscard: btnDiscard,
        contactModal: contactModal,
        customHeader: customHeader,
        fullScreen: fullScreen,
        disableClose: disableClose,
        handleCloseDialog: handleCloseDialog,
      }
      return { newAppDialogs: [...state.newAppDialogs, newDialog] }
    })
    return dialogId
  },

  // ➜ Cierra un diálogo y pasa data al padre correcto
  closeDialogWithData: (dialogId, data, key) =>
    set((state) => {
      const dialogToClose = state.newAppDialogs.find((d) => d.id === dialogId)
      if (!dialogToClose) return state

      let updatedDialogs = state.newAppDialogs.filter((d) => d.id !== dialogId)

      // Si hay un padre, le pasamos los datos
      if (dialogToClose.parentId && Object.keys(data).length) {
        updatedDialogs = updatedDialogs.map((d) => {
          if (d.id === dialogToClose.parentId) {
            // Inicializamos childData como objeto si no existe o es array
            const childData =
              d.childData && typeof d.childData === 'object' && !Array.isArray(d.childData)
                ? { ...d.childData }
                : {}

            if (key) {
              // Asegúrate de que la categoría exista como un array
              childData[key] = childData[key] || []

              // Añadir los datos al array de la categoría correspondiente
              childData[key].push(data)
            }

            return { ...d, childData }
          }
          return d
        })
      }
      /*
      else if (dialogToClose.onCloseWithData) {
        // 📌 Si es el primer diálogo, ejecutamos el callback con los datos
        dialogToClose.onCloseWithData(data)
      }
      */

      return { newAppDialogs: updatedDialogs }
    }),
  frmDialogAction: null,
  setFrmDialogAction: (action: any) => set({ frmDialogAction: action }),
  frmDialogLoading: false,
  setFrmDialogLoading: (frmDialogLoading: any) => set({ frmDialogLoading: frmDialogLoading }),
  frmDialogItem: null,
  setFrmDialogItem: (frmDialogItem: any) => set({ frmDialogItem }),
})

export default createFrmDialogSlice
