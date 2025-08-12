import '../../pos2.css'
import Header from './components/Header'
import Screens from './components/Screens'
import useAppStore from '@/store/app/appStore'
import { useEffect, useRef } from 'react'
import { FrmBaseDialog } from '@/shared/components/core'
import PosDetailConfig from './components/modal/opening-control/config'
import { useNavigate, useParams } from 'react-router-dom'
import useUserStore from '@/store/persist/persistStore'
import { usePWA } from '@/hooks/usePWA'
import { offlineCache } from '@/lib/offlineCache'

const PointOfSale = () => {
  const { pointId } = useParams()
  const { userData } = useUserStore()
  const navigate = useNavigate()
  const { isOnline } = usePWA()
  const {
    executeFnc,
    openDialog,
    closeDialogWithData,
    initializePointOfSale,
    setOrderData,
    setSyncLoading,
  } = useAppStore()

  const sessions = JSON.parse(localStorage.getItem('sessions') || '[]')
  const session = sessions.find((s: any) => s.point_id === Number(pointId))
  const { session_id } = session || {}
  const isOnlineRef = useRef(isOnline)
  const loadInitialData = async () => {
    if (!pointId) return
    try {
      if (!isOnline) {
        await offlineCache.generateTestOrders(100, Number(pointId), session_id)
      }
      await initializePointOfSale(pointId, isOnline)
    } catch (error) {
      console.error('Fallo la inicialización de datos del POS:', error)
    }
  }
  useEffect(() => {
    isOnlineRef.current = isOnline
  }, [isOnline])
  useEffect(() => {
    return () => {
      if (!isOnlineRef.current) {
        offlineCache.addPosOrderToQueue()
        offlineCache.clearOfflinePosOrders()
      } else {
        offlineCache.clearOfflinePosOrders()
      }
    }
  }, [])

  useEffect(() => {
    if (isOnline) {
      const getPosOrders = async () => {
        offlineCache.syncOfflineData(executeFnc, Number(pointId), setOrderData, setSyncLoading)
        offlineCache.clearSyncOrdersQueue()
      }
      getPosOrders()
    }
  }, [isOnline])

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
            if (!isOnline) {
              const id = Math.floor(Math.random() * 1000000)
              await offlineCache.cachePosSessions(executeFnc, 'i', {
                session_id: id,
                ...data,
              })
              const posPoints = await offlineCache.getOfflinePosPoints()
              const posPoint = posPoints.find((p: any) => p.point_id === Number(pointId))
              if (posPoint) {
                posPoint.session_id = id
                posPoint.state = 'u'
                await offlineCache.updatePosPointOffline(posPoint)
              }
              await offlineCache.updatePosSessionOffline({
                session_id: id,
                ...data,
                action: 'i',
              })
              const newSessions = sessions.map((s: any) =>
                s.point_id === Number(pointId) ? { ...s, session_id: id } : s
              )
              localStorage.setItem('sessions', JSON.stringify(newSessions))
              closeDialogWithData(dialogId, {})
              return
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
