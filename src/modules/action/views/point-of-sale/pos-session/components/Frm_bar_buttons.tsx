import { frmElementsProps } from '@/shared/shared.types'
import { useNavigate } from 'react-router-dom'

export function Frm_bar_buttons({ watch }: frmElementsProps) {
  const navigate = useNavigate()
  const item = watch()
  const handleClick = () => {
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]')
    const targetSession = {
      session_id: item.session_id ?? null,
      point_id: item.point_id,
    }
    const idx = sessions.findIndex((s: any) => s.point_id === item.point_id)
    const nextSessions =
      idx >= 0
        ? sessions.map((s: any, i: number) => (i === idx ? targetSession : s))
        : [...sessions, targetSession]

    localStorage.setItem('sessions', JSON.stringify(nextSessions))
    navigate(`/pos/${item.point_id}`)
  }
  const detailShop = () => {
    import('@/modules/invoicing/components/SalesReportPDF').then((module) => {
      const SalesReportPDF = module.default

      import('@react-pdf/renderer').then((pdfModule) => {
        const { pdf } = pdfModule
        pdf(SalesReportPDF())
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
