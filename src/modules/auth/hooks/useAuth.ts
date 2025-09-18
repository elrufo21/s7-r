import supabaseClient from '@/lib/supabase'

export async function getSession() {
  const supabase = supabaseClient()
  return await supabase.auth.getSession()
}

export async function refreshSession() {
  const supabase = supabaseClient()
  return await supabase.auth.refreshSession()
}
