import supabaseClient from '@/lib/supabase'
import { refreshSession } from '@/modules/auth/hooks/useAuth'
import { handleExecuteResponse } from '@/shared/helpers/responseHandler'
import { FiltersDataType, FiltersOptionType } from '@/shared/shared.types'
import { toast } from 'sonner'

interface FncExecuteProps {
  fnc_name: string
  caccion: string
  form: FiltersDataType | FiltersOptionType[] | string[] | Record<string, any>
}

export async function fncExecute(props: FncExecuteProps) {
  const { caccion, fnc_name, form } = props
  const supabase = await supabaseClient()
  const { state } = JSON.parse(localStorage.getItem('session-store') ?? '{}')
  if (!state) throw new Error('No se encontró la sesión')
  const { userData } = state

  const query = {
    ic_fnc: fnc_name,
    in_user_id: userData?.user_id,
    in_group_id: userData?.group_id,
    ij_companies: state.companies,
    it_action: caccion,
    ij_data: form ? form : [],
  }
  try {
    const res = await supabase.rpc('fnc_execute', query)
    if (res.error) {
      if (res.error.code === 'PGRST301') {
        try {
          await refreshSession()
          const res = await supabase.rpc('fnc_execute', query)
          const result = handleExecuteResponse(res)
          return result
        } catch (e) {
          console.log(e)
          toast.error('Error token', { description: 'Error en refresh_token' })
        }
      }
      toast.error('Error en consulta', { description: 'Error en consulta' })
      return res
    }
    const result = handleExecuteResponse(res)
    return result
  } catch (error) {
    console.error('Error crítico en la accion:', error)

    return null
  }
}

export async function uploadFile(bucketName: any, filePath: any, file: any, type: any) {
  const supabase = await supabaseClient()
  const res = await supabase.storage.from(bucketName).upload(filePath, file, type)
  return JSON.stringify(res)
}

export async function getPublicUrl(bucketName: any, filePath: any) {
  const supabase = await supabaseClient()
  const res = supabase.storage.from(bucketName).getPublicUrl(filePath)
  return JSON.stringify(res)
}

export async function deleteFile(bucketName: any, filePath: any) {
  const supabase = await supabaseClient()
  const res = supabase.storage.from(bucketName).remove([filePath])
  return JSON.stringify(res)
}
