export interface Unit {
  category_id: number
  value: string
  label: string
  type: string
  id: number
  name: string
  description: string
  action: string
  state: string
  uom_id: number
  factor: number | null
  rounding: number | null
}

export interface RowData {
  category_id: number | null
  name: string
  units: Unit[]
}
