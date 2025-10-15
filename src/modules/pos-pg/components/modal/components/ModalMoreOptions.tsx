import { GrTrash } from 'react-icons/gr'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { PiNote } from 'react-icons/pi'

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
        className="min-w-[220px] btn-style-1 flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-6 rounded-lg text-gray-700 font-medium text-center"
      >
        <div>
          <div className="h-[35px]">
            <PiNote style={{ fontSize: '26px' }} />
          </div>
          <div className="text-[1.09375rem]">Nota de cliente</div>
        </div>
      </button>

      <button
        onClick={() => {
          moreInfo()
          closeDialog()
        }}
        className="min-w-[220px] btn-style-1 flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-6 rounded-lg text-gray-700 font-medium text-center"
      >
        <div>
          <div className="h-[35px]">
            <AiOutlineInfoCircle style={{ fontSize: '24px' }} />
          </div>
          <div className="text-[1.09375rem]">Información</div>
        </div>
      </button>

      <button
        onClick={() => {
          handleCancelOrder()
          closeDialog()
        }}
        className="min-w-[220px] btn-style-1 flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-6 rounded-lg text-gray-700 font-medium text-center"
      >
        <div>
          <div className="h-[35px]">
            <GrTrash style={{ fontSize: '20px' }} className="mt-[2px]" />
          </div>
          <div className="text-[1.09375rem]">Cancelar orden</div>
        </div>
      </button>
    </div>
  )
}

export default ModalMoreOptions
