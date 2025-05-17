import { useEffect, useState } from 'react'
import { AutocompleteControlled, TextControlled } from '@/shared/ui'
import { useNavigate } from 'react-router-dom'
import { frmElementsProps } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'

export function FrmMiddle({ setValue, watch, control, errors, editConfig }: frmElementsProps) {
  const { createOptions, formItem } = useAppStore()

  //Ubicar descripciones a campos con valor
  const [bankNumber, setBankNumber] = useState<{ label: string; value: string }[]>([])
  const loadBankNumber = async () => {
    setBankNumber(await createOptions({ fnc_name: 'fnc_account_bank', action: 's2' }))
  }

  const [ownerContact, setOwnerContact] = useState<{ label: string; value: string }[]>([])
  const loadOwnerContact = async () => {
    setOwnerContact(
      await createOptions({
        fnc_name: 'fnc_partner',
        action: 's2',
      })
    )
  }

  useEffect(() => {
    if (watch('id_ban')) {
      setBankNumber([{ label: watch('nom_ban'), value: watch('id_ban') }])
    }
    if (watch('id_con')) {
      setOwnerContact([{ label: watch('dsc_con'), value: watch('id_con') }])
    } else {
      setValue('id_con', formItem['id_con'])
      setOwnerContact([{ label: formItem['dsc_con'], value: formItem['id_con'] }])
    }
  }, [formItem, setValue, watch])

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
              name={'num_cba'}
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
          name={'id_ban'}
          control={control}
          errors={errors}
          options={bankNumber}
          fnc_loadOptions={loadBankNumber}
          editConfig={{ config: editConfig }}
          handleOnChanged={(data) => setValue('nom_ban', data.label)}
        />
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Titular de Cuenta</label>
        </div>
        <AutocompleteControlled
          name={'id_con'}
          control={control}
          errors={errors}
          options={ownerContact}
          fnc_loadOptions={loadOwnerContact}
          handleOnChanged={(data) => setValue('dsc_con', data.label)}
          editConfig={{ config: editConfig }}
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
    setCurrency(await createOptions({ fnc_name: 'fnc_currency', action: 's2' }))
  }

  useEffect(() => {
    if (watch('id_div')) {
      setCurrency([{ label: watch('dsc_div'), value: watch('id_div') }])
    }
    if (formItem['id_cia']) {
      setCompany([{ value: formItem['id_cia'], label: formItem['dsc_cia'] }])
      setValue('id_cia', formItem['id_cia'])
      setValue('dsc_cia', formItem['dsc_cia'])
    }
  }, [formItem, setValue, watch])

  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Empresa</label>
        </div>
        <AutocompleteControlled
          name={'id_cia'}
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
          name={'id_div'}
          control={control}
          errors={errors}
          options={currency}
          fnc_loadOptions={loadCurrency}
          editConfig={{ config: editConfig }}
          handleOnChanged={(data) => setValue('dsc_div', data.label)}
        />
      </div>
    </>
  )
}
