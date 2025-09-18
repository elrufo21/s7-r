import { frmElementsProps } from '@/shared/shared.types'
import { AutocompleteControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import { useEffect, useState } from 'react'
import { required } from '@/shared/helpers/validators'
interface custom_frm_elementsProps extends frmElementsProps {
  rules?: boolean
}
const Custom_field_currency = ({
  control,
  errors,
  editConfig,
  setValue,
  watch,
  label = true,
  rules = false,
}: custom_frm_elementsProps) => {
  const [currency, setCurrency] = useState<{ label: string; value: string }[]>([])
  const { formItem, createOptions } = useAppStore()
  const fnc_load_data_currency = async () => {
    const options = await createOptions({
      fnc_name: 'fnc_currency',
      filters: [{ column: 'state', value: 'A' }],
      action: 's2',
    })
    if (!formItem) {
      return setCurrency(options)
    }
    setCurrency([...options])
  }
  useEffect(() => {
    if (formItem?.['currency_id'] || watch('currency_id')) {
      setCurrency([
        {
          value: watch('currency_id') ?? formItem['currency_id'],
          label: watch('currency_name') ?? formItem['currency_name'],
        },
      ])
    }
  }, [formItem])
  return (
    <div className="d-sm-contents">
      <div className="o_cell o_wrap_label">
        {label && <label className="o_form_label">Moneda</label>}
      </div>
      <div className="o_cell">
        <div className="o_field">
          <AutocompleteControlled
            name={'currency_id'}
            control={control}
            errors={errors}
            editConfig={{ config: editConfig }}
            options={currency}
            fnc_loadOptions={fnc_load_data_currency}
            handleOnChanged={(data) => {
              setValue('currency_id', data.value)
              setValue('currency_name', data.label)
            }}
            rules={rules ? required() : {}}
          />
        </div>
      </div>
    </div>
  )
}

export default Custom_field_currency
