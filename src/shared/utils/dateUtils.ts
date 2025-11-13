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

  if (isToday(date)) {
    return 'Hoy'
  }

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

export function isToday(date: Date | string | Temporal.ZonedDateTime | Temporal.PlainDate) {
  if (!date) return false

  try {
    const todayDate = now().toPlainDate()
    let compareDate: Temporal.PlainDate

    if (date instanceof Temporal.ZonedDateTime) {
      compareDate = date.toPlainDate()
    } else if (date instanceof Temporal.PlainDate) {
      compareDate = date
    } else {
      const d = toPlainDateTime(date)
      if (!d) return false
      compareDate = d.toPlainDate()
    }

    return Temporal.PlainDate.compare(todayDate, compareDate) === 0
  } catch (err) {
    console.error('isToday: Invalid date', date, err)
    return false
  }
}

export function formatDateWithToday(date: Date | string, useShortMonth: boolean = false) {
  if (!date) return ''

  if (isToday(date)) {
    return 'Hoy'
  }

  return formatShortDate(date, useShortMonth)
}
export function setCurrentTimeIfToday(input: string | Date) {
  if (!input) return ''

  try {
    const limaZone = 'America/Lima'
    let baseDate: Temporal.ZonedDateTime

    // 🧩 Si es instancia de Date
    if (input instanceof Date) {
      baseDate = Temporal.ZonedDateTime.from({
        timeZone: limaZone,
        year: input.getFullYear(),
        month: input.getMonth() + 1,
        day: input.getDate(),
        hour: input.getHours(),
        minute: input.getMinutes(),
        second: input.getSeconds(),
      })
    }

    // 🧩 Si es string (ISO o con offset)
    else if (typeof input === 'string') {
      // Caso con zona
      if (input.includes('[')) {
        baseDate = Temporal.ZonedDateTime.from(input)
      } else {
        // Caso ISO u offset
        try {
          baseDate = Temporal.ZonedDateTime.from(`${input}[${limaZone}]`)
        } catch {
          // Si ni así, intenta como PlainDateTime
          const plain = Temporal.PlainDateTime.from(input)
          baseDate = plain.toZonedDateTime({ timeZone: limaZone })
        }
      }
    }

    // 🚫 Cualquier otro tipo (evita el "expected a string")
    else {
      console.warn('setCurrentTimeIfToday: tipo inesperado', typeof input, input)
      return ''
    }

    const now = Temporal.Now.zonedDateTimeISO(limaZone)
    const sameDay =
      baseDate.year === now.year && baseDate.month === now.month && baseDate.day === now.day

    const result = sameDay
      ? baseDate.with({
          hour: now.hour,
          minute: now.minute,
          second: now.second,
          millisecond: 0,
        })
      : baseDate

    // 🔁 Limpia la zona para que no aparezca [America/Lima]
    return result.toString().replace(`[${limaZone}]`, '')
  } catch (err) {
    console.error('setCurrentTimeIfToday: error parsing date', input, err)
    return ''
  }
}
