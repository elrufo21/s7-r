export function getShortUUID(length = 8) {
  return crypto.randomUUID().replace(/-/g, '').slice(0, length)
}
export function formatNumber(value: number, maxDecimals: number = 2): string {
  if (isNaN(value)) return (0).toFixed(maxDecimals)

  const factor = Math.pow(10, maxDecimals)
  const rounded = Math.round(value * factor) / factor

  return rounded.toFixed(maxDecimals)
}
export function adjustTotal(
  value: number,
  step: number = 0.1
): { adjusted: number; residual: number } {
  if (isNaN(value)) return { adjusted: 0, residual: 0 }

  const countDecimals = (n: number) => {
    if (!isFinite(n)) return 0
    const s = n.toString()
    // maneja notación científica como "1e-7"
    if (s.indexOf('e-') >= 0) {
      const match = /(?:\.(\d+))?e-(\d+)$/.exec(s)
      if (!match) return 0
      const fractionDigits = match[1] ? match[1].length : 0
      return parseInt(match[2], 10) + fractionDigits
    }
    const parts = s.split('.')
    return parts[1]?.length ?? 0
  }

  const decimalsStep = countDecimals(step)
  const decimalsValue = countDecimals(value)

  const rawAdjusted = Math.ceil(value / step) * step
  const adjusted = Number(rawAdjusted.toFixed(decimalsStep))

  const rawResidual = adjusted - value
  const residualDecimals = Math.max(decimalsStep, decimalsValue)
  // redondeamos al número de decimales necesario
  let residual = Number(rawResidual.toFixed(residualDecimals))

  // limpiar tiny negative/zero por precisión de punto flotante
  if (Math.abs(residual) < 1e-12) residual = 0

  return { adjusted, residual }
}

export function formatNumberDisplay(value: number | string): string {
  if (Number(value) % 1 === 0) {
    return Number(value).toFixed(0)
  }
  return Number(value).toFixed(2)
}
