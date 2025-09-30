type RibbonItem = {
  label?: string
  state: string
  className: string
  getLabel?: (value: any, data?: any) => string // <-- permite que cada item tenga su propia lógica de label
}

export type RibbonConfig = {
  field: string
  ribbonList: RibbonItem[]
  transformValue?: (value: any) => any
  getLabelFromData?: (value: any, data?: any) => string // <-- para cuando llega descripción de la BD
  fallback?: {
    className?: string
    getLabel?: (value: any, data?: any) => string
  }
}

interface Props {
  watch: any | (() => any)
  config: RibbonConfig
}

export function RibbonRenderer({ watch, config }: Props) {
  const { field, ribbonList, transformValue, getLabelFromData, fallback } = config

  const data = typeof watch === 'function' ? watch() : watch
  const rawValue = typeof watch === 'function' ? watch(field) : data?.[field]
  const fieldValue = transformValue ? transformValue(rawValue) : rawValue

  if (!fieldValue) return null

  const matchingRibbon = ribbonList.find((ribbon) => ribbon.state === fieldValue)

  if (matchingRibbon) {
    const label =
      matchingRibbon.getLabel?.(fieldValue, data) ??
      getLabelFromData?.(fieldValue, data) ??
      matchingRibbon.label ??
      fieldValue

    return <div className={matchingRibbon.className}>{label}</div>
  }

  if (fallback) {
    return (
      <div className={fallback.className ?? 'ribbon-simple bg-gray-300'}>
        {fallback.getLabel ? fallback.getLabel(fieldValue, data) : fieldValue}
      </div>
    )
  }

  return null
}
