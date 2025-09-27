type StatusChipProps = {
  value: string
  description?: string
  classesMap?: Record<string, string>
  textMap?: Record<string, string>
  defaultClass?: string
  defaultText?: string
}

export function StatusChip({
  value,
  description,
  classesMap = {},
  textMap = {},
  defaultClass = '',
  defaultText = '',
}: StatusChipProps) {
  const className = classesMap[value] || defaultClass
  const displayText = description ?? textMap[value] ?? defaultText ?? value

  return <div className={`chip_demo ${className}`}>{displayText}</div>
}
