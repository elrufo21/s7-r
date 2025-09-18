import supabaseClient from '../../lib/supabase'

export const signInWithEmail = async (email: string, password: string) => {
  const supabase = supabaseClient()
  const result = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return result
}

export const signOut = async () => {
  const supabase = supabaseClient()
  const result = await supabase.auth.signOut()
  return result
}

export async function readUserSession() {
  const supabase = supabaseClient()

  return supabase.auth.getSession()
}

export async function fnc_user_login(email: string, password: string) {
  const supabase = supabaseClient()
  const res = await supabase.rpc('fnc_user_login', {
    it_email: email,
    it_password: password,
  })

  if (res.error) {
    throw new Error(res.error.message)
  }

  const payload = res.data?.[0]

  if (!payload) {
    throw new Error('Respuesta vacía del servidor')
  }

  // Caso error desde la función
  if (payload.oj_info?.type === 'error') {
    // Aquí es donde capturas tu "else"
    return {
      success: false,
      message: payload.oj_info.message || 'Error desconocido',
    }
  }

  // Caso éxito: retornas el usuario
  return {
    success: true,
    data: payload.oj_data?.[0],
  }
}

export async function getDataEmpresa(idusu: string) {
  if (!navigator.onLine) {
    return JSON.stringify({
      data: [
        {
          name: 'Usuario Fernando Villarruel Quispe',
          email: 'desarrollo.linksoft@hotmail.com',
          avatar: [
            {
              path: 'ec968584-faa3-488f-9df6-df2e851ad806',
              publicUrl:
                'https://wmhhzgqpnsneiggexoon.supabase.co/storage/v1/object/public/images/ec968584-faa3-488f-9df6-df2e851ad806',
            },
          ],
          user_id: 1,
          group_id: 1,
          company_id: 1,
        },
      ],
      error: null,
    })
  }

  const supabase = supabaseClient()
  const res = await supabase.rpc('fnc_get_user_session', { it_user_uid: idusu })
  return JSON.stringify(res)
}
