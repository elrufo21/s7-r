import useAppStore from '@/store/app/appStore'
import { FaArrowRightArrowLeft } from 'react-icons/fa6'
import { LiaCashRegisterSolid } from 'react-icons/lia'
import { LuRefreshCw } from 'react-icons/lu'
import { AiOutlineHome } from 'react-icons/ai'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import { downloadAccountsReportPDF } from '@/modules/invoicing/components/AcountsReport'

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
  const sessions = JSON.parse(localStorage.getItem('sessions') || '[]')
  const session = sessions.find((s: any) => s.point_id === Number(pointId))
  const { session_id } = session || {}

  const handleDownloadReport = async () => {
    // Aquí debes obtener tus datos reales
    // Ejemplo con datos de muestra:
    const data = [
      {
        partner_name: 'ABELARDO SACHAYCOTO',
        debt_up: 90.8,
        debt: null,
        debt_total_up: 90.8,
        payments_made: null,
        debt_total: 90.8,
      },
      // ... más datos
    ]

    try {
      await downloadAccountsReportPDF(data)
      closeDialog()
    } catch (error) {
      console.error('Error al descargar PDF:', error)
    }
  }

  return (
    <div className="p-6 w-full flex gap-4">
      <button
        onClick={() => {
          handleCashInAndOut()
          closeDialog()
        }}
        className="btn-style-1 flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-6 rounded-lg text-gray-700 font-medium text-center"
      >
        <div>
          <div className="c-img">
            <FaArrowRightArrowLeft
              style={{ fontSize: '40px' }}
              className="text-gray-500 hover:text-gray-700"
            />
          </div>
          <div className="c-text">Entrada/salida de efectivo</div>
        </div>
      </button>

      <button
        onClick={() => {
          handleCloseCashRegister()
          closeDialog()
        }}
        className="btn-style-1 flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-6 rounded-lg text-gray-700 font-medium text-center"
      >
        <div>
          <div className="c-img">
            <LiaCashRegisterSolid
              style={{ fontSize: '50px' }}
              className="text-gray-500 hover:text-gray-700"
            />
          </div>
        </div>
      </button>

      <button
        onClick={handleDownloadReport}
        className="btn-style-1 flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-6 rounded-lg text-gray-700 font-medium text-center"
      >
        <div>
          <div className="c-img">
            <HiOutlineDocumentReport
              style={{ fontSize: '40px' }}
              className="text-gray-500 hover:text-gray-700"
            />
          </div>
          <div className="c-text">Descargar reporte de cuentas</div>
        </div>
      </button>

      <button
        onClick={async () => {
          closeDialog()
          await forceReloadPosData(pointId || '', true, session_id)
        }}
        className="btn-style-1 flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-6 rounded-lg text-gray-700 font-medium text-center"
      >
        <div>
          <div className="c-img">
            <LuRefreshCw
              style={{ fontSize: '40px' }}
              className="text-gray-500 hover:text-gray-700"
            />
          </div>
          <div className="c-text">Volver a cargar datos</div>
        </div>
      </button>

      <button
        onClick={returnToMain}
        className="btn-style-1 flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-6 rounded-lg text-gray-700 font-medium text-center"
      >
        <div>
          <div className="c-img">
            <AiOutlineHome
              style={{ fontSize: '40px' }}
              className="text-gray-500 hover:text-gray-700"
            />
          </div>
          <div className="c-text">Regresar a la ventana principal</div>
        </div>
      </button>
    </div>
  )
}

export default ModalButtons
