import { Controller, ControllerRenderProps, FieldValues } from 'react-hook-form'
import Switch from '@mui/material/Switch'
import { ChangeEvent } from 'react'

interface SwitchControlledProps {
  name: string
  control: any
  rules?: any
  className?: string
  row?: any
  editConfig?: any
  onChange: (value: boolean) => void
}

export const SwitchControlled = ({
  name,
  control,
  rules = {},
  editConfig = { config: {} },
  onChange,
}: SwitchControlledProps) => {
  const { config } = editConfig

  const switchHandler = (
    event: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, string>
  ) => {
    field.onChange(event.target.checked)
    if (onChange) {
      onChange(event.target.checked)
    }
  }

  return (
    <>
      <Controller
        name={name}
        control={control}
        // defaultValue={options[0].value}
        // defaultValue={false}
        rules={rules}
        render={({ field }) => {
          if (config?.[name]?.isEdit) {
            return (
              <>
                <div className="">
                  {/* {field.value ? (
                    dsc
                  ) : (
                    <span className="text-transparent">-</span>
                  )} */}
                </div>
              </>
            )
          }

          return (
            // <FormControlLabel
            // className={"" + className}
            //   control={

            <Switch
              className="switchEx"
              // {...label}
              size="small"
              {...field}
              // disableRipple="false"
              // defaultChecked={false}

              // value={field.value}
              onChange={(e) => switchHandler(e, field)}
              // key={index}
              checked={field.value}

              // onClick={switchHandler}
              // onClick={() => switchHandler}
            />
            //   }
            // />
          )
        }}
      />
    </>
  )
}
