import { frmElementsProps } from '@/shared/shared.types'
import { useNavigate } from 'react-router-dom'

export function Frm_bar_buttons({ watch }: frmElementsProps) {
  const navigate = useNavigate()
  const item = watch()
  console.log('item', item)
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
  return (
    <>
      {watch('state') === 'I' && (
        <button className="btn btn-primary" onClick={handleClick}>
          Seguir vendiendo
        </button>
      )}
    </>
  )
}
