import useAppStore from '@/store/app/appStore'

const ModalButtons = ({
  handleCashInAndOut,
  handleCloseCashRegister,
  returnToMain,
  closeDialog,
  pointId,
}: {
  handleCashInAndOut: () => void
  handleCloseCashRegister: () => void
  returnToMain: () => void
  closeDialog: () => void
  pointId: string
}) => {
  const { forceReloadPosData } = useAppStore()
  return (
    <div className="p-6 w-full flex gap-4">
      <button
        onClick={() => {
          handleCashInAndOut()
          closeDialog()
        }}
        className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-6 rounded-lg text-gray-700 font-medium text-center"
      >
        Entrada/salida de efectivo
      </button>

      <button
        onClick={() => {
          handleCloseCashRegister()
          closeDialog()
        }}
        className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-6 rounded-lg text-gray-700 font-medium text-center"
      >
        Cerrar caja registradora
      </button>

      <button
        onClick={async () => {
          await forceReloadPosData(pointId || '')
          closeDialog()
        }}
        className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-6 rounded-lg text-gray-700 font-medium text-center"
      >
        Volver a cargar datos
      </button>
      <button
        onClick={returnToMain}
        className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-6 rounded-lg text-gray-700 font-medium text-center"
      >
        Regresar a la ventana principal
      </button>
    </div>
  )
}

export default ModalButtons
