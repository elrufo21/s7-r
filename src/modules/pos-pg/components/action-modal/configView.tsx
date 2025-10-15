import { FiFileText, FiRotateCcw } from 'react-icons/fi'
import { BsTrash2 } from 'react-icons/bs'
import { FaLink } from 'react-icons/fa6'
import { FaList } from 'react-icons/fa'

export function frm_middle() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-3 gap-2">
        {/* Primera fila */}
        <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 p-8 rounded text-center transition-colors">
          <div className="flex flex-col items-center">
            <FiFileText className="mb-2" size={20} />
            <span className="font-medium text-sm">Nota de cliente</span>
          </div>
        </button>

        <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 p-8 rounded text-center transition-colors">
          <div className="flex flex-col items-center">
            <FaLink className="mb-2" size={20} />
            <span className="font-medium text-sm">Cotización/orden</span>
          </div>
        </button>

        <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 p-8 rounded text-center transition-colors">
          <div className="flex flex-col items-center">
            <FaList className="mb-2" size={20} />
            <span className="font-medium text-sm">Lista de precios</span>
          </div>
        </button>

        {/* Segunda fila */}
        <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 p-8 rounded text-center transition-colors">
          <div className="flex flex-col items-center">
            <FiRotateCcw className="mb-2" size={20} />
            <span className="font-medium text-sm">Reembolso</span>
          </div>
        </button>

        <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 p-8 rounded text-center transition-colors">
          <div className="flex flex-col items-center">
            <BsTrash2 className="mb-2" size={20} />
            <span className="font-medium text-sm">Cancelar orden</span>
          </div>
        </button>

        {/* Celda vacía para mantener la cuadrícula de 3 columnas */}
        <div></div>
      </div>
    </div>
  )
}
