import { createClient } from '@supabase/supabase-js'

const client = createClient(
  import.meta.env.VITE_PUBLIC_SUPABASE_URL,
  import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY
)

const supabaseClient = () => client
/**
 * 
supabaseClient().auth.onAuthStateChange((event, session) => {
  console.log(event, session)
})
 */

export default supabaseClient
