import { Tooltip } from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'

const FormRow = ({
  label,
  children,
  className,
  infoLabel,
  editConfig,
  fieldName,
}: {
  label: string
  children: ReactNode
  className?: string
  infoLabel?: string
  editConfig?: any
  fieldName?: string
}) => {
  const [isEdit, setIsEdit] = useState(false)
  useEffect(() => {
    if (editConfig && fieldName) {
      setIsEdit(editConfig[fieldName]?.isEdit)
    }
  }, [editConfig, fieldName])
  return (
    <div className="d-sm-contents">
      <div className="o_cell o_wrap_label">
        <label className={`o_form_label ${isEdit ? 'no-edit' : ''}`}>
          {label}{' '}
          {infoLabel && (
            <Tooltip arrow title={infoLabel}>
              <sup className="text-info p-1">?</sup>
            </Tooltip>
          )}
        </label>
      </div>
      <div className={`o_cell ${className}`}>{children}</div>
    </div>
  )
}
export default FormRow
