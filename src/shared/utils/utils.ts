import * as XLSX from 'xlsx'

export const downloadExcel = (data: any) => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  // Dowload file
  XLSX.writeFile(workbook, 'DataSheet.xlsx')
}

export const formatDateToDDMMYYYY = (date: Date | string) => {
  if (!date) return ''
  const formatDate = typeof date === 'string' ? new Date(date) : date
  const day = String(formatDate.getUTCDate()).padStart(2, '0')
  const month = String(formatDate.getUTCMonth() + 1).padStart(2, '0')
  const year = formatDate.getUTCFullYear()

  return `${day}/${month}/${year}`
}
export const formatDateTimeToDDMMYYYYHHMM = (date: Date | string) => {
  if (!date) return ''
  const formatDate = typeof date === 'string' ? new Date(date) : date
  const day = String(formatDate.getUTCDate()).padStart(2, '0')
  const month = String(formatDate.getUTCMonth() + 1).padStart(2, '0')
  const year = formatDate.getUTCFullYear()
  const hours = String(formatDate.getUTCHours()).padStart(2, '0')
  const minutes = String(formatDate.getUTCMinutes()).padStart(2, '0')

  return `${day}/${month}/${year} ${hours}:${minutes}`
}
export const sumItems = (list: any[], prop: string) => {
  return list.reduce((acc, obj) => {
    return acc + obj[prop]
  }, 0)
}

export const daysUntilDate = (targetDate: string) => {
  const today = new Date().setHours(0, 0, 0, 0)
  const [day, month, year] = targetDate.split('/').map(Number)
  const targetDateMs = new Date(year, month - 1, day).getTime()

  const difference = Math.floor((targetDateMs - today) / (1000 * 60 * 60 * 24))
  if (difference === 0) {
    return 'Hoy'
  } else if (difference === 1) {
    return 'Mañana'
  } else if (difference === -1) {
    return 'Ayer'
  } else if (difference > 1) {
    return `en ${difference} días`
  } else if (isNaN(difference)) {
    return ''
  } else {
    return `hace ${-difference} días`
  }
}
