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
  const supabase = supabaseClient()
  const res = await supabase.rpc('fnc_get_user_session', { it_user_uid: idusu })
  return JSON.stringify(res)
}
