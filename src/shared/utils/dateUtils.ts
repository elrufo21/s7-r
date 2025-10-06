import { Temporal } from '@js-temporal/polyfill'

const ZONE = 'America/Lima'

export function now() {
  return Temporal.Now.zonedDateTimeISO(ZONE)
}

export function parse(dateString: string) {
  try {
    return Temporal.ZonedDateTime.from(dateString).withTimeZone(ZONE)
  } catch (err) {
    console.error('parse: Invalid dateString', dateString, err)
    return now()
  }
}

export function formatDateTime(date: Temporal.ZonedDateTime) {
  if (!date) return ''
  try {
    return `${date.toPlainDate().toString()} ${date.toPlainTime().toString().slice(0, 5)}`
  } catch (err) {
    console.error('formatDateTime: Invalid date', date, err)
    return ''
  }
}

export function today() {
  return now().toPlainDate().toString()
}

export function currentTime() {
  return now().toPlainTime().toString().slice(0, 5)
}

// Función segura para convertir a PlainDateTime
function toPlainDateTime(date: Date | string) {
  if (!date) return null
  try {
    if (date instanceof Date) return Temporal.PlainDateTime.from(date.toISOString())
    return Temporal.PlainDateTime.from(date)
  } catch (err) {
    console.error('toPlainDateTime: Invalid date', date, err)
    return null
  }
}

export function formatPlain(date: Date | string) {
  const d = toPlainDateTime(date)
  if (!d) return ''
  const day = String(d.day).padStart(2, '0')
  const month = String(d.month).padStart(2, '0')
  const year = d.year
  const dateFormatted = `${day}/${month}/${year}`
  const timeFormatted = d.toPlainTime().toString().slice(0, 5)
  return `${dateFormatted} ${timeFormatted}`
}

export function getHour(date: Date | string) {
  const d = toPlainDateTime(date)
  if (!d) return ''
  return d.toPlainTime().toString().slice(0, 5)
}

export function formatShortDate(date: Date | string, useShortMonth: boolean = false) {
  const d = toPlainDateTime(date)
  if (!d) return ''

  const day = String(d.day).padStart(2, '0')

  if (useShortMonth) {
    const months = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ]
    const monthName = months[d.month - 1]

    const currentYear = new Date().getFullYear()
    return d.year === currentYear ? `${day} ${monthName}` : `${day} ${monthName} ${d.year}`
  }

  const month = String(d.month).padStart(2, '0')
  const year = String(d.year).slice(-2)
  return `${day}/${month}/${year}`
}
