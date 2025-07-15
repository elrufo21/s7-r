const ModalButtons = ({
  handleCashInAndOut,
  handleCloseCashRegister,
  returnToMain,
}: {
  handleCashInAndOut: () => void
  handleCloseCashRegister: () => void
  returnToMain: () => void
}) => {
  return (
    <div className="p-6 w-full flex gap-4">
      <button
        onClick={handleCashInAndOut}
        className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-6 rounded-lg text-gray-700 font-medium text-center"
      >
        Entrada/salida de efectivo
      </button>

      <button
        onClick={handleCloseCashRegister}
        className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-6 rounded-lg text-gray-700 font-medium text-center"
      >
        Cerrar caja registradora
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
