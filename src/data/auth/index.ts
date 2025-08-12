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
