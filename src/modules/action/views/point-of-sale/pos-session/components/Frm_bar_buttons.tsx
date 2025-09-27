import { CustomToast } from '@/components/toast/CustomToast'
import { frmElementsProps } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'
import { useNavigate, useParams } from 'react-router-dom'

export function Frm_bar_buttons({ watch }: frmElementsProps) {
  const { executeFnc, setSyncData } = useAppStore()
  const { id } = useParams()
  const navigate = useNavigate()
  const item = watch()
  const handleClick = () => {
    // 1️⃣ Obtener datos de localStorage de forma segura
    const localPosOpen = JSON.parse(localStorage.getItem('local_pos_open') || '[]')
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]')

    const isOpen = localPosOpen.some((p: any) => p?.point_id === item.point_id)
    if (!isOpen) {
      CustomToast({
        title: 'No se puede seguir vendiendo',
        description: `Otro usuario está en el punto de venta.`,
        type: 'warning',
      })
      return
    }

    const targetSession = {
      session_id: item.session_id ?? null,
      point_id: item.point_id,
      session_name: item.name,
      active: true,
    }

    const nextSessions = sessions.map((s: any) =>
      s.point_id === item.point_id ? targetSession : { ...s, active: false }
    )

    if (!nextSessions.find((s: any) => s.point_id === item.point_id)) {
      nextSessions.push(targetSession)
    }
    const prevActive = sessions.find((s: any) => s.active)
    if (!prevActive || prevActive.point_id !== item.point_id) {
      setSyncData(true)
    }

    localStorage.setItem('sessions', JSON.stringify(nextSessions))
    navigate(`/pos/${item.point_id}`)
  }

  const detailShop = async () => {
    const { oj_data: rs } = await executeFnc('fnc_pos_session_report', '', [id])
    import('@/modules/invoicing/components/SalesReportPDF').then((module) => {
      const SalesReportPDF = module.default

      import('@react-pdf/renderer').then((pdfModule) => {
        const { pdf } = pdfModule
        pdf(SalesReportPDF({ data: { products: rs.result_1, control: rs.result_3 } }))
          .toBlob()
          .then((blob) => {
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'detalle-ventas.pdf'
            link.click()
            URL.revokeObjectURL(url)
          })
      })
    })
  }
  return (
    <>
      {watch('state') === 'I' && (
        <button className="btn btn-primary" onClick={handleClick}>
          Seguir vendiendo
        </button>
      )}
      <button className="btn btn-secondary" onClick={detailShop}>
        Detalle de ventas
      </button>
    </>
  )
}
