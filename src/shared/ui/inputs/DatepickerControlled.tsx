import { Controller } from 'react-hook-form'
import { FormHelperText } from '@mui/material'
import { Calendar } from 'primereact/calendar'
import { addLocale } from 'primereact/api'
import { formatDateToDDMMYYYY } from '@/shared/utils/utils'

interface DatepickerControlledProps {
  name: string
  control: any
  rules: any
  errors: any
  startToday?: boolean
  showTodayText?: boolean
  className?: string
  editConfig?: any
}

export const DatepickerControlled = ({
  name,
  control,
  rules,
  errors,
  startToday = false,
  showTodayText = true,
  className = '',
  editConfig = { config: {} },
}: DatepickerControlledProps) => {
  const today = startToday ? new Date() : null

  addLocale('es', {
    firstDayOfWeek: 1,
    //showMonthAfterYear: true,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ],
    monthNamesShort: [
      'ene',
      'feb',
      'mar',
      'abr',
      'may',
      'jun',
      'jul',
      'ago',
      'sep',
      'oct',
      'nov',
      'dic',
    ],
    today: 'Hoy',
    clear: 'Limpiar',
  })

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const { config } = editConfig
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        if (config?.[name]?.isEdit) {
          return (
            <div className={'DivEx ' + className}>
              {field.value ? (
                showTodayText && isToday(new Date(field.value)) ? (
                  'Hoy'
                ) : (
                  formatDateToDDMMYYYY(field.value)
                )
              ) : (
                <span className="text-transparent">-</span>
              )}
            </div>
          )
        }
        return (
          <>
            <Calendar
              className={`custom__calendar relative `}
              value={field.value ? new Date(field.value) : today}
              onChange={(e) => {
                const selectedDate = e.value
                field.onChange(selectedDate)
              }}
              locale="es"
              dateFormat="dd/mm/yy"
              panelClassName="!w-min"
            />
            <FormHelperText className="text-red-600">{errors[name]?.message}</FormHelperText>
          </>
        )
      }}
    />
  )
}
