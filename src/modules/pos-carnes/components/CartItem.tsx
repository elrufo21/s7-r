import useAppStore from '@/store/app/appStore'
import type { CartItem as CartItemType } from '../types'
import { formatNumber, formatNumberDisplay } from '@/shared/helpers/helpers'
// import { GrTrash } from 'react-icons/gr'

interface CartItemProps {
  item: CartItemType
  isSelected?: boolean
  onSelect?: () => void
  maxDecimals?: number
  btnDelete?: boolean
}

export default function CartItem({
  item,
  isSelected = false,
  onSelect,
  maxDecimals = 2,
  btnDelete = false,
}: CartItemProps) {
  const { selectedOrder, deleteProductInOrder, setHandleChange } = useAppStore()
  return (
    <div
      className={`py-2 px-2 flex items-center justify-between hover:bg-gray-50 cursor-pointer  ${isSelected ? 'bg-blue-50' : ''
        }`}
      onClick={onSelect}
    >
      <div className="flex items-center">

        {/* <div className="w-6 text-center c1"> */}
        <div className="w-auto min-w-[24px] text-center c1">
          {
            /*Number.parseFloat(item.quantity).toFixed(maxDecimals)*/ formatNumberDisplay(
            item.quantity
          )
          }
        </div>

        <div className="ml-4">
          {/* <div className="font-medium text-gray-900">{item.name}</div> */}
          <div className="text-gray-900 font-bold">{item.name}</div>
          {/* <div className="text-gray-500 text-sm">- Verde, L</div> */}
          <div>{`S/ ${item?.price_unit} por ${item?.uom_name}`}</div>

          {item.tara_value || item.tara_quantity ? (
            <>
              <div className="">
                Peso bruto:
                <span className="font-bold">{` ${item.base_quantity} ${item.uom_name}`}</span>
              </div>
              <div>
                Tara:
                <span className="font-bold">{` ${item.tara_quantity || 0} und x ${item.tara_value ? item.tara_value : '0.00'} kg = ${formatNumber(item.tara_value * (item.tara_quantity || 0))} kg`}</span>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="text-right">
          {/* <div className="font-medium"> */}
          <div className="c1">
            {' '}
            {formatNumber(Number(item.price_unit) * Number(item.quantity), maxDecimals)}
          </div>

          {btnDelete && (
            <button
              className="text-red-500 text-sm"
              onClick={(e) => {
                e.stopPropagation()
                deleteProductInOrder(selectedOrder, item.line_id)
                setHandleChange(true)
              }}
            >
              Eliminar
            </button>
          )}
        </div>

        {/* 
        <button
          onClick={(e) => {
            e.stopPropagation()
            deleteProductInOrder(selectedOrder, item.line_id)
            setHandleChange(true)
          }}
          className="p-1 text-red-500 hover:bg-red-50 rounded"
        >
          <GrTrash size={16} />
        </button>
        */}
      </div>
    </div>
  )
}
