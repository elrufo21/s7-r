import '../../pos2.css'
import Header from './components/Header'
import Screens from './components/Screens'
import useAppStore from '@/store/app/appStore'
import { useEffect } from 'react'
import { FrmBaseDialog } from '@/shared/components/core'
import PosDetailConfig from './components/modal/opening-control/config'
import { useNavigate, useParams } from 'react-router-dom'
import useUserStore from '@/store/persist/persistStore'
import { usePWA } from '@/hooks/usePWA'

const PointOfSale = () => {
  const { pointId } = useParams()
  const { userData } = useUserStore()
  const navigate = useNavigate()
  const { isOnline } = usePWA()
  const { executeFnc, openDialog, closeDialogWithData, initializePointOfSale } = useAppStore()

  const sessions = JSON.parse(localStorage.getItem('sessions') || '[]')
  const { session_id } = sessions.find((s: any) => s.point_id === Number(pointId))

  const loadInitialData = async () => {
    if (!pointId) return
    try {
      await initializePointOfSale(pointId, isOnline)
    } catch (error) {
      console.error('Fallo la inicialización de datos del POS:', error)
    }
  }

  useEffect(() => {
    const storedSessionId = session_id

    if (storedSessionId) {
      return
    }

    let getData = () => ({})
    const dialogId = openDialog({
      title: `Control de apertura ${pointId ? `- Punto ${pointId}` : ''}`,
      disableClose: true,
      dialogContent: () => (
        <FrmBaseDialog
          config={PosDetailConfig}
          setGetData={(fn: any) => (getData = fn)}
          initialValues={{ initial_cash: 0, opening_note: '' }}
        />
      ),
      buttons: [
        {
          text: 'Abrir caja registradora',
          type: 'confirm',
          onClick: async () => {
            const formData = getData()
            const data = {
              ...formData,
              company_id: userData.company_id,
              state: 'I',
              point_id: pointId,
              start_at: new Date(),
              currency_id: 1,
              user_id: userData.user_id,
            }
            const response = await executeFnc('fnc_pos_session', 'i', data)
            if (response.oj_data?.session_id) {
              const newSessions = sessions.map((s: any) =>
                s.point_id === Number(pointId)
                  ? { ...s, session_id: response.oj_data.session_id }
                  : s
              )
              localStorage.setItem('sessions', JSON.stringify(newSessions))
            }

            closeDialogWithData(dialogId, {})
          },
        },
        {
          text: 'Descartar',
          type: 'cancel',
          onClick: () => {
            closeDialogWithData(dialogId, {})
            navigate('/points-of-sale')
          },
        },
      ],
    })
  }, [])

  useEffect(() => {
    if (session_id) {
      loadInitialData()
    }
  }, [session_id, pointId])

  return (
    <>
      <Header pointId={pointId ?? ''} />
      <div className="pos-content">
        <Screens pointId={pointId ?? ''} />
      </div>
    </>
  )
}

export default PointOfSale
