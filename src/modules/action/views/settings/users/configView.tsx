import { useEffect, useState } from 'react'
import { AutocompleteControlled, ImageInput, MultiSelectObject, TextControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import Chip from '@mui/material/Chip'
import { frmElementsProps } from '@/shared/shared.types'
import { required } from '@/shared/helpers/validators'

export function Frm_bar_buttons() {
  return <button className="btn btn-secondary">Enviar un correo de invitación</button>
}

export function Frm_bar_status() {
  return (
    <>
      <div className="c_bar_step active" data-status="P">
        <div className="bar-step">Nunca se conecta</div>
      </div>
      <div className="c_bar_step" data-status="C">
        <div className="bar-step">Confirmado</div>
      </div>
    </>
  )
}

export function FrmPhoto({ watch, setValue, control, editConfig }: frmElementsProps) {
  return (
    <>
      <div className="o_field_widget o_field_image oe_avatar">
        <ImageInput
          watch={watch}
          setValue={setValue}
          name={'files'}
          control={control}
          //errors={errors}
          editConfig={{ config: editConfig }}
        />
      </div>
    </>
  )
}

export function FrmTitle({ control, errors, editConfig, frmState }: frmElementsProps) {
  return (
    <>
      <TextControlled
        name={'name'}
        placeholder={'por ejemplo, Alberto Cervantes'}
        className={'frm_dsc'}
        multiline={true}
        control={control}
        rules={required()}
        errors={errors}
        editConfig={{ frmState, config: editConfig }}
      />
    </>
  )
}

export function Subtitle({ control, errors, editConfig, frmState }: frmElementsProps) {
  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label mb-1 mt-2">
          <label className="o_form_label">Correo electrónico</label>
        </div>
        <div className="o_field_widget o_field_field_partner_autocomplete text-break">
          <TextControlled
            name={'email'}
            placeholder={'por ejemplo, email@suempresa.com'}
            className={'frm_dsc_sub'}
            control={control}
            rules={required()}
            errors={errors}
            editConfig={{ frmState, config: editConfig }}
          />
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label mb-1 mt-2">
          <label className="o_form_label">Teléfono</label>
        </div>
        <div className="o_field_widget o_field_field_partner_autocomplete text-break">
          <TextControlled
            name={'phone'}
            placeholder={'por ejemplo, 987654321'}
            className={'frm_dsc_sub'}
            control={control}
            rules={required()}
            errors={errors}
            editConfig={{ frmState, config: editConfig }}
          />
        </div>
      </div>
    </>
  )
}

export function FrmTab0({ control, errors, editConfig, setValue }: frmElementsProps) {
  const formItem = useAppStore((state) => state.formItem)
  const createOptions = useAppStore((state) => state.createOptions)

  const [TagCias, setTagCias] = useState<{ value: string; label: string }[]>([])
  const cargaData_TagCias = async () => {
    const data = await createOptions({
      fnc_name: 'fnc_company',
      action: 's2',
    })

    const transformedData = data.map((item) => ({
      ...item,
      company_name: item.name,
      label: item.name,
      value: item.company_id,
    }))

    setTagCias(transformedData)
  }

  const fnc_renderTags = (value: any, getTagProps: any) => {
    return value.map((option: any, index: number) => (
      <Chip
        sx={{ backgroundColor: '#bbd7f8' }}
        {...getTagProps({ index })}
        key={index}
        label={option['company_name']}
        size="small"
      />
    ))
  }

  const [Cias, setCias] = useState<{ value: string; label: string }[]>([])
  const cargaData_Cias = async () => {
    const data = await createOptions({
      fnc_name: 'fnc_company',
      action: 's2',
    })

    const transformedData = data.map((item) => ({
      label: item.name,
      value: item.company_id,
    }))

    setCias(transformedData)
  }

  useEffect(() => {
    if (formItem?.['default_company_id']) {
      setCias([
        {
          value: formItem['default_company_id'],
          label: formItem['default_company_name'],
        },
      ])
    }
  }, [formItem])
  return (
    <div className="o_group mt-4">
      <div className="lg:w-1/2">
        <div className="o_inner_group grid">
          <div className="g-col-sm-2">
            <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
              Multi-empresas
            </div>
          </div>

          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Empresas permitidas</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <MultiSelectObject
                  name={'companies'}
                  control={control}
                  errors={errors}
                  options={TagCias}
                  fnc_loadOptions={cargaData_TagCias}
                  renderTags={fnc_renderTags}
                  searchOpt={true}
                  editConfig={{ config: editConfig }}
                  handleOnChanged={() => setValue('companies_change', true)}
                />
              </div>
            </div>
          </div>

          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Empresa predeterminada</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <AutocompleteControlled
                  name={'default_company_id'}
                  control={control}
                  errors={errors}
                  rules={required()}
                  options={Cias}
                  fnc_loadOptions={cargaData_Cias}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
