import { FormControlLabel } from '@mui/material'
import { Controller } from 'react-hook-form'

interface CheckBoxControlledProps {
  dsc?: string
  name: string
  control: any
  rules?: any
  className?: string
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom' | undefined
  editConfig?: any
}

export const CheckBoxControlled = ({
  dsc = '',
  name,
  control,
  rules = {},
  className = '',
  labelPlacement = 'end',
  editConfig = { config: {} },
}: CheckBoxControlledProps) => {
  const { config } = editConfig

  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => {
          if (config?.[name]?.isEdit) {
            return (
              <div className="">
                {field.value ? dsc : <span className="text-transparent">-</span>}
              </div>
            )
          }

          return (
            <FormControlLabel
              className={'' + className}
              control={
                <input
                  {...field}
                  //defaultValue={false}
                  value={field.value}
                  checked={field.value}
                  type="checkbox"
                  className="checkboxEx"
                />
              }
              labelPlacement={labelPlacement}
              label={dsc}
            />
          )
        }}
      />
    </>
  )
}
