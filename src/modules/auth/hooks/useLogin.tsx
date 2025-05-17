import { setCookie } from '@/shared/utils/cookieUtils'
import supabaseClient from '@/lib/supabase'
import useUserStore from '@/store/persist/persistStore'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type loginType = (email: string, password: string) => Promise<void>

export const useLogin = (): {
  loading: boolean
  login: loginType
  hasErrors: boolean
} => {
  const navigate = useNavigate()
  const { setUserSession } = useUserStore()
  const [loading, setLoading] = useState<boolean>(false)
  const [hasErrors, setHasErrors] = useState<boolean>(false)

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true)
    setHasErrors(false)

    const supabase = supabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setHasErrors(true)
      setLoading(false)
    } else {
      setUserSession(data.user)
      setCookie('supabase_session', data.session.access_token, {})
      navigate('/')
    }

    setLoading(false)
  }

  return { loading, login, hasErrors }
}
