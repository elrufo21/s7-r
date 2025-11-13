import { CustomToast } from '@/components/toast/CustomToast'
import useAppStore from '@/store/app/appStore'
import { Temporal } from '@js-temporal/polyfill'
import { useState } from 'react'
const normalizeDate = (date: Date): Date => {
  const today = new Date()
  const isSameDay =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()

  if (!isSameDay) {
    // Si la fecha es diferente a hoy, seteamos 00:00:00
    date.setHours(0, 0, 0, 0)
  }
  return date
}

const DateCalculatorPanel = ({ dialogId }: { dialogId: string }) => {
  const { setDateInvoice, closeDialogWithData } = useAppStore()
  const [dateString, setDateString] = useState(() => {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = String(today.getFullYear())
    return `${day}${month}${year}`
  })

  // Nuevo estado para saber qué campo se está editando
  const [activeField, setActiveField] = useState<'day' | 'month' | 'year'>('day')
  const [partialInput, setPartialInput] = useState('') // almacena el valor temporal (ej. primer dígito del día)

  const formatDateDisplay = () => {
    if (!dateString) return 'DD/MM/YYYY'

    const digits = dateString.padEnd(8, '_')
    const day = digits.substring(0, 2)
    const month = digits.substring(2, 4)
    const year = digits.substring(4, 8)

    return `${day}/${month}/${year}`
  }

  const handleFieldClick = (field: 'day' | 'month' | 'year') => {
    setActiveField(field)
    setPartialInput('') // limpiar entrada temporal
  }

  const handleNumberClick = (digit: string) => {
    let day = dateString.substring(0, 2)
    let month = dateString.substring(2, 4)
    let year = dateString.substring(4, 8)

    if (activeField === 'day') {
      let input = partialInput + digit
      if (input.length === 1 && parseInt(input) > 3) return
      if (input.length === 2) {
        const num = parseInt(input)
        if (num === 0 || num > 31) return
        day = input
        setPartialInput('')
        setActiveField('month')
      } else {
        // primer dígito: reemplaza el primer char visualmente y espera el segundo
        day = input.padEnd(2, day[1] || '_')
        setPartialInput(input)
      }
    } else if (activeField === 'month') {
      let input = partialInput + digit
      if (input.length === 1 && parseInt(input) > 1) return
      if (input.length === 2) {
        const num = parseInt(input)
        if (num === 0 || num > 12) return
        month = input
        setPartialInput('')
        setActiveField('year')
      } else {
        month = input.padEnd(2, month[1] || '_')
        setPartialInput(input)
      }
    } else if (activeField === 'year') {
      let input = partialInput + digit
      if (input.length <= 4) {
        year = input.padEnd(4, year[input.length - 1] || '')
        setPartialInput(input)
      }
    }

    // guardamos la fecha sin caracteres de relleno ('_')
    const newDate = `${day.replace(/_/g, '')}${month.replace(/_/g, '')}${year.replace(/_/g, '')}`
    setDateString(newDate)
  }
  const handleBackspace = () => {
    let day = dateString.substring(0, 2)
    let month = dateString.substring(2, 4)
    let year = dateString.substring(4, 8)

    if (activeField === 'day') {
      day = '00'
    } else if (activeField === 'month') {
      month = '00'
    } else if (activeField === 'year') {
      year = '0000'
    }

    setDateString(`${day}${month}${year}`)
    setPartialInput('')
  }

  const isValidDate = (day, month, year) => {
    const dayNum = parseInt(day)
    const monthNum = parseInt(month)
    const yearNum = parseInt(year)
    if (dayNum === 0 || monthNum === 0 || yearNum === 0) return false
    const date = new Date(yearNum, monthNum - 1, dayNum)
    return (
      date.getDate() === dayNum &&
      date.getMonth() === monthNum - 1 &&
      date.getFullYear() === yearNum
    )
  }

  const handleOk = () => {
    if (dateString.length === 8) {
      const day = dateString.substring(0, 2)
      const month = dateString.substring(2, 4)
      const year = dateString.substring(4, 8)

      if (isValidDate(day, month, year)) {
        const dateObj = new Date(Number(year), Number(month) - 1, Number(day))
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (dateObj > today) {
          CustomToast({
            title: 'Fecha inválida',
            description: 'No puedes seleccionar una fecha futura.',
            type: 'error',
          })
          return
        }

        // Si la fecha es diferente a hoy → poner hora 00:00:00
        const isSameDate =
          dateObj.getFullYear() === today.getFullYear() &&
          dateObj.getMonth() === today.getMonth() &&
          dateObj.getDate() === today.getDate()

        let zonedDate: Temporal.ZonedDateTime

        if (!isSameDate) {
          // Fecha pasada → 00:00:00 en Lima
          zonedDate = Temporal.ZonedDateTime.from({
            timeZone: 'America/Lima',
            year: Number(year),
            month: Number(month),
            day: Number(day),
            hour: 0,
            minute: 0,
            second: 0,
          })
        } else {
          // Fecha actual → hora actual en Lima
          const now = Temporal.Now.zonedDateTimeISO('America/Lima')
          zonedDate = Temporal.ZonedDateTime.from({
            timeZone: 'America/Lima',
            year: now.year,
            month: now.month,
            day: now.day,
            hour: now.hour,
            minute: now.minute,
            second: now.second,
          })
        }

        // 👉 Guardar como string ISO con zona incluida (compatible con formatPlain)
        console.log('zonedDate.toString()', zonedDate.toString())
        const formattedForDb = zonedDate.toString().replace('[America/Lima]', '')
        setDateInvoice(formattedForDb)
        closeDialogWithData(dialogId, {})
      } else {
        CustomToast({
          title: 'Fecha inválida',
          description: 'Por favor verifica los valores ingresados.',
          type: 'error',
        })
      }
    } else {
      CustomToast({
        title: 'Fecha incompleta',
        description: 'Completa los 8 dígitos (ddmmaaaa) antes de continuar.',
        type: 'warning',
      })
    }
  }

  const handleClear = () => {
    setDateString('')
    setPartialInput('')
    setActiveField('day')
  }

  // Extra: mostrar qué campo está activo
  const formatDateDisplayWithHighlight = () => {
    const digits = dateString.padEnd(8, '_')
    const day = digits.substring(0, 2)
    const month = digits.substring(2, 4)
    const year = digits.substring(4, 8)

    return (
      <div className="text-5xl font-bold font-mono text-gray-800 mb-2">
        <span
          onClick={() => handleFieldClick('day')}
          style={{
            cursor: 'pointer',
            backgroundColor: activeField === 'day' ? '#E64627' : 'transparent',
            borderRadius: '4px',
            padding: '0 4px',
          }}
        >
          {day}
        </span>
        /
        <span
          onClick={() => handleFieldClick('month')}
          style={{
            cursor: 'pointer',
            backgroundColor: activeField === 'month' ? '#E64627' : 'transparent',
            borderRadius: '4px',
            padding: '0 4px',
          }}
        >
          {month}
        </span>
        /
        <span
          onClick={() => handleFieldClick('year')}
          style={{
            cursor: 'pointer',
            backgroundColor: activeField === 'year' ? '#E64627' : 'transparent',
            borderRadius: '4px',
            padding: '0 4px',
          }}
        >
          {year}
        </span>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-[500px] w-full">
      <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-6 text-center">
        {formatDateDisplayWithHighlight()}
      </div>

      <div className="pads">
        <div className="subpads">
          <div className="grid-container">
            {[1, 2, 3].map((n) => (
              <div className="grid-item" key={n}>
                <button
                  className="numpad-button btn2 fs-3 lh-lg w-full h-full"
                  onClick={() => handleNumberClick(String(n))}
                >
                  {n}
                </button>
              </div>
            ))}

            <div className="grid-item pink-bg">
              <button
                className="numpad-button btn2 fs-3 lh-lg w-full h-full o_colorlist_item_numpad_color_1"
                onClick={handleBackspace}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 7L8.8 7.00001L3 12L8.8 17H20C20.5523 17 21 16.5523 21 16V8C21 7.44772 20.5523 7 20 7Z"
                    stroke="currentColor"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 10L16 14M16 10L12 14"
                    stroke="currentColor"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>

            {[4, 5, 6, 7, 8, 9].map((n) => (
              <div className="grid-item" key={n}>
                <button
                  className="numpad-button btn2 fs-3 lh-lg w-full h-full"
                  onClick={() => handleNumberClick(String(n))}
                >
                  {n}
                </button>
              </div>
            ))}

            <div className="grid-item bg-white"></div>

            <div className="grid-item">
              <button
                className="numpad-button btn2 fs-3 lh-lg w-full h-full"
                onClick={() => handleNumberClick('0')}
              >
                0
              </button>
            </div>

            <div className="grid-item bg-white"></div>

            <div className="grid-item ok-button !h-auto">
              <button className="numpad-button w-full h-full" onClick={handleOk}>
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DateCalculatorPanel
