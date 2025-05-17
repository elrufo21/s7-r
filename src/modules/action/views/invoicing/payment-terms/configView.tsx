import { useEffect, useState } from 'react'
import useAppStore from '@/store/app/appStore'
import { frmElementsProps } from '@/shared/shared.types'
import { AutocompleteControlled, TextControlled } from '@/shared/ui'

const required = {
  required: { value: true, message: 'Este campo es requerido' },
}

export function FrmTitle({ control, errors, editConfig }: frmElementsProps) {
  return (
    <TextControlled
      name={'name'}
      className={'frm_dsc'}
      placeholder={'por ejemplo, 30 días'}
      multiline={true}
      control={control}
      rules={required}
      errors={errors}
      editConfig={{ config: editConfig }}
    />
  )
}

export function Subtitle({ control, errors, watch, editConfig }: frmElementsProps) {
  const { createOptions, formItem } = useAppStore((state) => state)
  const [companies, setCompanies] = useState<{ label: string; value: string }[]>([])

  const cargaData = async () => {
    let filters = [{ filterBy: 'type', filterValue: 'C', exclude: false }]
    if (watch('partner_id')) {
      filters.push({
        filterBy: 'partner_id',
        filterValue: watch('partner_id'),
        exclude: true,
      })
    }
    setCompanies(
      await createOptions({
        fnc_name: 'fnc_partner',
        action: 's2',
      })
    )
  }

  const fnc_create = async (value: string) => {
    console.log(value)
    /**
     * 
    let res = await executeFnc(fnc_name ?? '', 'i', { name: value, type: 'C' })

    if (res) {
      await cargaData()
      setValue('partner_id_rel', res.partner_id)
    } else {
      toast.error('Error al crear la empresa')
    }
     */
  }

  useEffect(() => {
    if (formItem) {
      if (formItem['partner_id_rel']) {
        setCompanies([
          {
            label: formItem['name_rel'],
            value: formItem['partner_id_rel'],
          },
        ])
      }
    }
  }, [formItem])

  return (
    <>
      {watch('type') === 'I' && (
        <AutocompleteControlled
          name={'partner_id_rel'}
          placeholder={'Nombre de la empresa ...'}
          control={control}
          errors={errors}
          options={companies}
          createItem={fnc_create}
          createAndEditItem={true}
          fnc_loadOptions={cargaData}
          enlace={true}
          fnc_enlace={() => {}}
          editConfig={{ config: editConfig }}
        />
      )}
    </>
  )
}

export function FrmMiddle({ control, errors, editConfig }: frmElementsProps) {
  const createOptions = useAppStore((state) => state.createOptions)
  const formItem = useAppStore((state) => state.formItem)

  const [companies, setCompanies] = useState<{ label: string; value: string }[]>([])

  const cargaData = async () => {
    // let filters = [{ filterBy: 'type', filterValue: 'C' }]
    // if (watch('partner_id')) {
    //     filters.push({ filterBy: 'partner_id', filterValue: watch('partner_id'), exclude: true })
    // }
    // console.log(fnc_name)

    // console.log(lcompanies)
    setCompanies(
      await createOptions({
        fnc_name: 'fnc_company',
        action: 's2',
      })
    )
  }

  const fnc_enlace = () => {}

  useEffect(() => {
    if (formItem?.['company_id']) {
      setCompanies([
        {
          label: formItem['company_name'],
          value: formItem['company_id'],
        },
      ])
    }
  }, [formItem])

  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Empresa</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <AutocompleteControlled
              name={'company_id'}
              placeholder={''}
              control={control}
              errors={errors}
              options={companies}
              fnc_loadOptions={cargaData}
              enlace={true}
              fnc_enlace={fnc_enlace}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
