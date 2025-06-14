import { Tooltip } from '@mui/material'
import { ReactNode } from 'react'

const FormRow = ({
  label,
  children,
  className,
  infoLabel,
}: {
  label: string
  children: ReactNode
  className?: string
  infoLabel?: string
}) => {
  return (
    <div className="d-sm-contents">
      <div className="o_cell o_wrap_label">
        <label className="o_form_label">
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
