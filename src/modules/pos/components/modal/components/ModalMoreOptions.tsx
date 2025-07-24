const ModalMoreOptions = ({
  closeDialog,
  handleCustomerNote,
  moreInfo,
  handleCancelOrder,
}: {
  closeDialog: () => void
  handleCustomerNote: () => void
  moreInfo: () => void
  handleCancelOrder: () => void
}) => {
  return (
    <div className="p-6 w-full flex gap-4">
      <button
        onClick={() => {
          handleCustomerNote()
          closeDialog()
        }}
        className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-6 rounded-lg text-gray-700 font-medium text-center"
      >
        Nota de cliente
      </button>

      <button
        onClick={() => {
          moreInfo()
          closeDialog()
        }}
        className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-6 rounded-lg text-gray-700 font-medium text-center"
      >
        Informacion
      </button>

      <button
        onClick={() => {
          handleCancelOrder()
          closeDialog()
        }}
        className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-6 rounded-lg text-gray-700 font-medium text-center"
      >
        Cancelar orden
      </button>
    </div>
  )
}

export default ModalMoreOptions
