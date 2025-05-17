import useUserStore from '@/store/persist/persistStore'
import { useEffect } from 'react'
import { getSession } from '@/modules/auth/hooks/useAuth'
import { signOut } from '@/data/auth'
import { useNavigate } from 'react-router-dom'

export const VerifySession = () => {
  const setUserSession = useUserStore((state) => state.setUserSession)
  const user = useUserStore((state) => state.user)
  const setUserData = useUserStore((state) => state.setUserData)
  const navigate = useNavigate()

  useEffect(() => {
    const gettingSession = async () => {
      const { data } = await getSession()
      const { session } = data
      if (!session) {
        await signOut()
        setUserSession(null)
        navigate('/auth')
        return
      }
      if (user) {
        setUserData()
      } else {
        setUserSession(session.user)
      }
    }
    gettingSession()
  }, [])

  useEffect(() => {
    if (user) {
      setUserData()
    }
  }, [user])

  return <></>
}
