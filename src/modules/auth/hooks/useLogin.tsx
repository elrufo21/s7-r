import { setCookie } from '@/shared/utils/cookieUtils'
import supabaseClient from '@/lib/supabase'
import useUserStore from '@/store/persist/persistStore'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePWA } from '@/hooks/usePWA'

type loginType = (email: string, password: string) => Promise<void>

export const useLogin = (): {
  loading: boolean
  login: loginType
  hasErrors: boolean
} => {
  const { isOnline } = usePWA()
  const navigate = useNavigate()
  const { setUserSession } = useUserStore()
  const [loading, setLoading] = useState<boolean>(false)
  const [hasErrors, setHasErrors] = useState<boolean>(false)

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true)
    setHasErrors(false)
    if (!isOnline) {
      const offlineSessionData = {
        state: {
          user: {
            id: '9b9fc0da-f427-437a-8f47-648ed1ce879b',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'desarrollo.linksoft@hotmail.com',
            email_confirmed_at: '2024-12-16T17:28:32.152982Z',
            phone: '',
            confirmed_at: '2024-12-16T17:28:32.152982Z',
            last_sign_in_at: '2025-07-31T14:51:46.852038165Z',
            app_metadata: {
              provider: 'email',
              providers: ['email'],
            },
            user_metadata: {},
            identities: [
              {
                identity_id: 'a82651c6-f46e-4ff0-be93-4c1a3c589618',
                id: '9b9fc0da-f427-437a-8f47-648ed1ce879b',
                user_id: '9b9fc0da-f427-437a-8f47-648ed1ce879b',
                identity_data: {
                  email: 'desarrollo.linksoft@hotmail.com',
                  email_verified: false,
                  phone_verified: false,
                  sub: '9b9fc0da-f427-437a-8f47-648ed1ce879b',
                },
                provider: 'email',
                last_sign_in_at: '2024-12-16T17:28:32.14941Z',
                created_at: '2024-12-16T17:28:32.149465Z',
                updated_at: '2024-12-16T17:28:32.149465Z',
                email: 'desarrollo.linksoft@hotmail.com',
              },
            ],
            created_at: '2024-12-16T17:28:32.146178Z',
            updated_at: '2025-07-31T14:51:46.889693Z',
            is_anonymous: false,
          },
          userData: {
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
          userError: null,
          companies: [1],
          userCiaEmp: [
            {
              name: 'Empresa 1 DEMO',
              companies: null,
              company_id: 1,
            },
            {
              name: 'Empresa 3 DEMO',
              companies: null,
              company_id: 3,
            },
          ],
          filters: [[1, 'pag', 1]],
          aditionalFilters: [],
        },
        version: 0,
      }
      const fakeAuthToken = {
        access_token: 'fake-offline-access-token',
        token_type: 'bearer',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        refresh_token: 'fake-offline-refresh-token',
        user: offlineSessionData.state.user,
      }

      localStorage.setItem('sb-wmhhzgqpnsneiggexoon-auth-token', JSON.stringify(fakeAuthToken))

      setUserSession(offlineSessionData)
      navigate('/points-of-sale')
      setLoading(false)
      setHasErrors(false)

      //setHasErrors(true)
      //setLoading(false)
      return
    }
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
