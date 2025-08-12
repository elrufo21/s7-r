import type { CartItem as CartItemType } from '../types'

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
}: CartItemProps) {
  return (
    <div
      className={`py-2 px-2 flex items-center justify-between hover:bg-gray-50 cursor-pointer  ${
        isSelected ? 'bg-blue-50' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center">
        {/* <div className="font-medium w-6 text-center"> */}
        <div className="w-6 text-center c1">
          {/*Number.parseFloat(item.quantity).toFixed(maxDecimals)*/ item.quantity}
        </div>

        <div className="ml-4">
          {/* <div className="font-medium text-gray-900">{item.name}</div> */}
          <div className="text-gray-900">{item.name}</div>
          {/* <div className="text-gray-500 text-sm">- Verde, L</div> */}
          <div>{`S/ ${item.price_unit}`}</div>
          <div>
            {`TARA: ${item.tara_value ? item.tara_value : '0.00'} x ${item.tara_quantity || 0}`}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="text-right">
          {/* <div className="font-medium"> */}
          <div className="c1">{(item.price_unit * item.quantity).toFixed(maxDecimals)}</div>
          {/*           
          {btnDelete && (
            <button
              className="text-red-500 text-sm"
              onClick={(e) => {
                e.stopPropagation()
                removeFromCart(item.product_template_id)
              }}
            >
              Eliminar
            </button>
          )}
          */}
        </div>
        {/* <button
          className="p-1 text-red-500 hover:bg-red-50 rounded"
          onClick={(e) => {
            deteleAll(item.product_template_id)
            e.stopPropagation()
          }}
        >
          <GrTrash size={16} />
        </button> */}
      </div>
    </div>
  )
}
