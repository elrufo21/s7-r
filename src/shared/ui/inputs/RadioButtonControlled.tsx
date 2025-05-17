import { FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material'
import { Controller } from 'react-hook-form'

interface RadioButtonControlledProps {
  name: string
  control: any
  rules?: any
  options: { label: string; value: string }[]
  size?: 'small' | 'medium'
  row?: boolean
  editConfig?: any
}

export const RadioButtonControlled = ({
  name,
  control,
  rules = {},
  options,
  size = 'small',
  row = true,
  editConfig = { config: {} },
}: RadioButtonControlledProps) => {
  const { config } = editConfig

  return (
    <FormControl>
      <Controller
        name={name}
        control={control}
        defaultValue={options[0].value}
        rules={rules}
        render={({ field }) => {
          let opt = options.find((opt) => opt.value === field.value)
          if (config?.[name]?.isEdit) {
            return (
              <>
                <div className="">
                  {opt ? (
                    <Typography fontSize={'14.4px'}>{opt.label}</Typography>
                  ) : (
                    <span className="text-transparent">-</span>
                  )}
                </div>
              </>
            )
          }
          return (
            <RadioGroup {...field} row={row}>
              {options.map((option, index) => {
                // console.log(option)
                return (
                  <FormControlLabel
                    key={index}
                    value={option.value}
                    control={<Radio size={size} />}
                    label={<Typography fontSize={'14.4px'}>{option.label}</Typography>}
                  />
                )
              })}
            </RadioGroup>
          )
        }}
      ></Controller>
    </FormControl>
  )
}
