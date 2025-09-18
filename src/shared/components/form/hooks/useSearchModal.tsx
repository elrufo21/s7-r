import useAppStore from '@/store/app/appStore'
import { useCallback } from 'react'
import { ModalBase } from '@/shared/components/modals/ModalBase'

type UseSearchModalProps = {
  modalConfig: any
  modalTitle?: string
  idField: string
  setValue: (name: string, value: any) => void
  onRowSelected?: (option: any) => void
}

export const useSearchModal = ({
  modalConfig,
  modalTitle = 'Seleccionar',
  idField,
  setValue,
  onRowSelected,
}: UseSearchModalProps) => {
  const { openDialog, closeDialogWithData, setNewAppDialogs, setFrmIsChanged } = useAppStore()

  const handleSearch = useCallback(() => {
    const dialogId = openDialog({
      title: modalTitle,
      dialogContent: () => (
        <ModalBase
          config={modalConfig}
          multiple={false}
          onRowClick={async (option) => {
            // Actualizar el valor del formulario
            setValue(idField, option[idField])

            // Ejecutar callback adicional si existe
            if (onRowSelected) {
              onRowSelected(option)
            }

            // Marcar el formulario como cambiado si se proporciona la función
            if (setFrmIsChanged) {
              setFrmIsChanged(true)
            }

            // Cerrar el diálogo
            setNewAppDialogs([])
          }}
        />
      ),
      buttons: [
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialogId, {}),
        },
      ],
    })
  }, [modalConfig, modalTitle, idField, setValue, onRowSelected, setFrmIsChanged])

  return handleSearch
}
