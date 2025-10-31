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
import { now } from '@/shared/utils/dateUtils'

const PointOfSale = () => {
  const { pointId } = useParams()
  const { userData } = useUserStore()
  const navigate = useNavigate()
  const { isOnline } = usePWA()

  const {
    executeFnc,
    openDialog,
    closeDialogWithData,
    initializePointOfSalePg,
    setOrderDataPg,
    setSyncLoading,
    setScreenPg,
    localModePg,
    sync_dataPg,
    setSyncDataPg,
    setSessionIdPg,
    setPointIdPg,
    connectedPg,
    connectToDevicePg,
  } = useAppStore()
  const sessions = JSON.parse(localStorage.getItem('sessions') || '[]')
  const session = sessions.find((s: any) => s.point_id === Number(pointId))
  const { session_id } = session || 0
  const isOnlineRef = useRef(isOnline)
  const loadInitialData = async () => {
    if (!pointId) return

    try {
      if (!isOnline) {
        //await offlineCache.generateTestOrders(100, Number(pointId), session_id)
      }
      if (sync_dataPg) {
        await offlineCache.syncOfflineData(
          executeFnc,
          pointId,
          setOrderDataPg,
          setSyncLoading,
          session_id
        )
        setSyncDataPg(false)
      }
      await initializePointOfSalePg(pointId, isOnline, session_id, true)
    } catch (error) {
      console.error('Fallo la inicialización de datos del POS:', error)
    }
  }
  useEffect(() => {
    if (!connectedPg) {
      connectToDevicePg()
    }
  }, [connectedPg])
  useEffect(() => {
    isOnlineRef.current = isOnline
  }, [isOnline])
  useEffect(() => {
    setPointIdPg(Number(pointId))
    if (session_id !== 0 && session_id) setSessionIdPg(session_id)
    return () => {
      if (!isOnlineRef.current) {
        offlineCache.addPosOrderToQueue()
        offlineCache.clearOfflinePosOrders()
      } else {
        // offlineCache.clearOfflinePosOrders()
      }
    }
  }, [])
  function updateLocalStorageObject(key: string, updates: Record<string, any>) {
    // const existing = localStorage.getItem(key)

    //const parsed = existing ? JSON.parse(existing) : {}

    //    const updated = { ...parsed, ...updates }
    const updated = updates

    localStorage.setItem(key, JSON.stringify(updated))
  }
  useEffect(() => {
    if (isOnline) {
      const syncOfflineData = async () => {
        await offlineCache.syncPayments(executeFnc, session_id, setSyncDataPg)
      }
      syncOfflineData()
    }
    if (isOnline && !localModePg) {
      const getPosOrders = async () => {
        offlineCache.syncOfflineData(
          executeFnc,
          Number(pointId),
          setOrderDataPg,
          setSyncLoading,
          session_id
        )
        offlineCache.clearSyncOrdersQueue()
      }
      getPosOrders()
    }
  }, [isOnline])

  useEffect(() => {
    setScreenPg('products')
    const getSession = async (s: number) => {
      const { oj_data } = await executeFnc('fnc_pos_session', 's1', [s])
      updateLocalStorageObject('secuence', oj_data[0].sequence)
    }
    const storedSessionId = session_id

    if (storedSessionId) {
      getSession(session_id)
      return
    }

    let getData = () => ({})
    const dialogId = openDialog({
      title: `Control de apertura ${pointId ? `- Punto ${session.session_name}` : ''}`,
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
              start_at: now().toPlainDateTime().toString(),
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

              // ✅ Actualizamos localStorage.sessions
              const newSessions = sessions.map((s: any) =>
                s.point_id === Number(pointId) ? { ...s, session_id: id } : s
              )
              localStorage.setItem('sessions', JSON.stringify(newSessions))

              // ✅ Actualizamos local_pos_open para habilitar "Seguir vendiendo"
              const localPosOpen = JSON.parse(localStorage.getItem('local_pos_open') || '[]')
              const exists = localPosOpen.some((p: any) => p.point_id === Number(pointId))
              if (!exists) {
                localPosOpen.push({ point_id: Number(pointId), session_id: id })
                localStorage.setItem('local_pos_open', JSON.stringify(localPosOpen))
              }

              closeDialogWithData(dialogId, {})
              return
            }

            // ✅ Modo online
            const response = await executeFnc('fnc_pos_session', 'i', data)
            if (response.oj_data?.session_id) {
              const newSessions = sessions.map((s: any) =>
                s.point_id === Number(pointId)
                  ? { ...s, session_id: response.oj_data.session_id }
                  : s
              )
              getSession(response.oj_data?.session_id)
              localStorage.setItem('sessions', JSON.stringify(newSessions))

              setSessionIdPg(response.oj_data?.session_id)
              setPointIdPg(Number(pointId))

              // ✅ Guardamos en local_pos_open para que luego "Seguir vendiendo" funcione
              const localPosOpen = JSON.parse(localStorage.getItem('local_pos_open') || '[]')
              const exists = localPosOpen.some((p: any) => p.point_id === Number(pointId))
              if (!exists) {
                localPosOpen.push({
                  point_id: Number(pointId),
                  session_id: response.oj_data.session_id,
                })
                localStorage.setItem('local_pos_open', JSON.stringify(localPosOpen))
              }
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
      <div className="pos-content pos-content-pg">
        <Screens />
      </div>
    </>
  )
}

export default PointOfSale
