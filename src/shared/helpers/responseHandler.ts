import { toast } from 'sonner'
import { CustomToast } from '@/components/toast/CustomToast'

export function handleExecuteResponse(res: any) {
  const { oj_info, oj_data } = res.data[0]
  const status = oj_info?.code || res.status
  if (status >= 200 && status <= 299) return res
  let title = ''
  let message = ''
  if (status >= 400) {
    if (status == 404 && oj_info.sqlstate == 23503) {
      title = 'Restricción'
      message = `No se pudo completar la operación: otro modelo necesita que elimine el registro. Si es posible, archívelo. - Limitación: ${oj_info.constraint_name}`
    } else if (status == 403) {
      title = String(status)
      message = `Limitación: ${oj_info.sqlerrm}`
    } else if (status == 402) {
      title = 'Error al actualizar'
      message = `Limitación: ${oj_info.sqlerrm}`
    } else if (status == 401) {
      title = 'Error al insertar'
      message = `Limitación: ${oj_info.sqlerrm}`
    } else {
      title = 'Error general'
      message = `Limitación: ${oj_info.sqlerrm}`
    }

    CustomToast({
      title: title,
      description: message,
      type: 'error',
    })

    throw new Error(message)
  }
  if (oj_data === null || res === null) {
    throw new Error('No se encontraron datos')
  }
}
