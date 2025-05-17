import { FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import React from 'react'

const SettingOptionRadio = ({
  label,
  description,
  options,
  value,
  onChange,
}: {
  label: string
  description: string
  options: { value: string; label: string }[]
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <div className="o_setting_box col-12 col-lg-6 o_searchable_setting">
      <div className="o_setting_left_pane"></div>
      <div className="o_setting_right_pane">
        <label className="o_form_label">{label}</label>
        <div className="text-muted">{description}</div>
        <div className="mt8">
          <div className="o_field_widget o_required_modifier o_field_radio o_light_label">
            <FormControl>
              <RadioGroup
                name="controlled-radio-buttons-group"
                value={value}
                onChange={onChange}
                sx={{ gap: 0 }}
              >
                {options.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={
                      <Radio
                        size="small"
                        sx={{
                          transform: 'scale(0.8)',
                          color: '#005F5F',
                          '&.Mui-checked': { color: '#005F5F' },
                        }}
                      />
                    }
                    label={option.label}
                    sx={{
                      marginBottom: '-8px',
                      '& .MuiTypography-root': {
                        fontSize: '0.85rem',
                        lineHeight: '1',
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingOptionRadio
