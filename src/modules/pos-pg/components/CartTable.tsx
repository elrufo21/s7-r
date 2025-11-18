import { formatNumberDisplay } from '@/shared/helpers/helpers'
import type { CartItem as CartItemType } from '../types'
import useAppStore from '@/store/app/appStore'
import { useRef } from 'react'

interface CartTableProps {
  order: any
}

export default function CartTable({ order }: CartTableProps) {
  const { selectedItemPg, setSelectedItemPg } = useAppStore()

  const itemRefs = useRef<Record<string, HTMLTableRowElement | null>>({})

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[12px] leading-[10px]">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-1 border">Prod</th>
            <th className="p-1 border">Bruto</th>
            <th className="p-1 border">Tara</th>
            <th className="p-1 border">Neto</th>
            <th className="p-1 border">Imp</th>
          </tr>
        </thead>

        <tbody>
          {order?.lines?.map((item: CartItemType) => {
            const taraTotal = item.tara_total ?? (item.tara_value || 0) * (item.tara_quantity || 0)

            const importe = (item.quantity ?? 0) * (item.price_unit ?? 0)

            return (
              <tr
                key={item.line_id}
                ref={(el) => (itemRefs.current[item.line_id] = el)}
                onClick={() => {
                  setSelectedItemPg(item.line_id)
                }}
                className={`h-[40px] cursor-pointer border ${
                  selectedItemPg === item.line_id ? 'bg-yellow-600 text-white' : 'hover:bg-gray-100'
                }`}
              >
                <td className="p-1 border font-semibold break-words max-w-[60px] uppercase">
                  {item.name}
                </td>

                <td className="p-1 border text-right">
                  {formatNumberDisplay(item.base_quantity ?? 0)}
                </td>

                <td className="p-1 border text-right">{formatNumberDisplay(taraTotal)}</td>

                <td className="p-1 border text-right">{formatNumberDisplay(item.quantity ?? 0)}</td>

                <td className="p-1 border text-right font-bold">{formatNumberDisplay(importe)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
