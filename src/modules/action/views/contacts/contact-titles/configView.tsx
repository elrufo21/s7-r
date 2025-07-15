import { useEffect } from 'react'
import { TextControlled } from '@/shared/ui'
import { frmElementsProps } from '@/shared/shared.types'
import { required } from '@/shared/helpers/validators'

export function FrmMiddle({ control, errors, editConfig }: frmElementsProps) {
  const handleEsc = () => {}

  useEffect(() => {
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])

  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Título</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'name'}
              placeholder={'por ejemplo, "Señor", "Doctor", "Profesor", ...'}
              control={control}
              rules={required()}
              errors={errors}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Abreviatura</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'abbreviation'}
              placeholder={''}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
