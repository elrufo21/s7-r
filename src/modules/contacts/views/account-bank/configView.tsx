import { useEffect, useState } from 'react'
import { AutocompleteControlled, TextControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import { useNavigate } from 'react-router-dom'
import { frmElementsProps } from '@/shared/shared.types'

export function FrmMiddle({ setValue, watch, control, errors, editConfig }: frmElementsProps) {
  const { createOptions, formItem } = useAppStore()

  const navigate = useNavigate()

  //Ubicar descripciones a campos con valor
  const [bankNumber, setBankNumber] = useState<{ label: string; value: string }[]>([])
  const loadBankNumber = async () => {
    setBankNumber(
      await createOptions({
        fnc_name: 'fnc_bank',
        action: 's2',
      })
    )
  }

  useEffect(() => {
    if (watch('bank_id')) {
      setBankNumber([{ label: watch('bank_name'), value: watch('bank_id') }])
    }

    setValue('partner_id', formItem['partner_id'])
    setValue('full_name', formItem['full_name'])
  }, [formItem])

  const navToCustomer = (value: number) => {
    console.log(value)
    navigate(`/contacts/${value}`)
  }
  console.log('www', watch(), formItem)
  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Número de cuenta</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              control={control}
              errors={errors}
              name={'number'}
              rules={{
                required: { value: true, message: 'Este campo es requerido' },
              }}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Banco</label>
        </div>
        <AutocompleteControlled
          name={'bank_id'}
          control={control}
          errors={errors}
          options={bankNumber}
          fnc_loadOptions={loadBankNumber}
          editConfig={{ config: editConfig }}
          handleOnChanged={(data) => setValue('bank_name', data.label)}
        />
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Titular de Cuenta</label>
        </div>
        <TextControlled
          control={control}
          errors={errors}
          name={'full_name'}
          rules={{}}
          editConfig={{ config: editConfig }}
          navigateLink={() => navToCustomer(watch('partner_id'))}
          disabled={true}
        />
      </div>
    </>
  )
}

export function FrmMiddleRight({ setValue, watch, control, errors, editConfig }: frmElementsProps) {
  const { createOptions, formItem, setNewAppDialogs } = useAppStore()
  const navigate = useNavigate()

  const [currency, setCurrency] = useState<{ label: string; value: string }[]>([])
  const [company, setCompany] = useState<{ label: string; value: string }[]>([])

  const loadCurrency = async () => {
    setCurrency(
      await createOptions({
        fnc_name: 'fnc_con_ct_div',
        action: 's2',
      })
    )
  }

  useEffect(() => {
    if (watch('currency_id')) {
      setCurrency([{ label: watch('currency_name'), value: watch('currency_id') }])
    }
    if (formItem['company_id']) {
      setCompany([{ value: formItem['company_id'], label: formItem['company_name'] }])
      setValue('company_id', formItem['company_id'])
      setValue('company_name', formItem['company_name'])
    }
  }, [])

  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Empresa</label>
        </div>
        <AutocompleteControlled
          name={'company_id'}
          control={control}
          errors={errors}
          editConfig={{ config: editConfig }}
          options={company}
          fnc_loadOptions={() => {}}
          enlace
          fnc_enlace={(value) => {
            navigate(`/contacts/${value}`)
            setNewAppDialogs([])
          }}
        />
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Moneda</label>
        </div>
        <AutocompleteControlled
          name={'currency_id'}
          control={control}
          errors={errors}
          options={currency}
          fnc_loadOptions={loadCurrency}
          editConfig={{ config: editConfig }}
          handleOnChanged={(data) => setValue('currency_name', data.label)}
        />
      </div>
    </>
  )
}
