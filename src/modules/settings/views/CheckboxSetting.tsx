import { Checkbox } from '@mui/material'
import { useState } from 'react'

const CheckboxSetting = ({
  title,
  description,
  buttonDescription,
  fnc_navigate,
}: {
  title: string
  description: string
  buttonDescription?: string
  fnc_navigate?: () => void
}) => {
  const [isChecked, setIsChecked] = useState(true)
  return (
    <div className="o_setting_box col-12 col-lg-6 o_searchable_setting" id="active_user_setting">
      <div className="o_setting_left_pane">
        <div className="o_field_widget o_field_boolean">
          <div className="o-checkbox form-check d-inline-block ">
            <Checkbox
              className="form-check-input"
              size="small"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
          </div>
        </div>
      </div>
      <div className="o_setting_right_pane">
        <label className="o_form_label">{title}</label>
        <div className="text-muted">{description}</div>
        {isChecked && buttonDescription && fnc_navigate && (
          <div className="mt8">
            <button className="btn btn-link" onClick={fnc_navigate}>
              <span>{buttonDescription}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckboxSetting
