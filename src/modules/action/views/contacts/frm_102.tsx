import { useEffect, useState } from 'react'
import { AutocompleteControlled, ImageInput, TextControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import { frmElementsProps } from '@/shared/shared.types'
import AddressField from '@/shared/components/extras/AddressField'

const required = {
  required: { value: true, message: 'Este campo es requerido' },
}

export function FrmPhoto({ watch, setValue, control, editConfig }: frmElementsProps) {
  return (
    <div className="o_field_widget o_field_image oe_avatar">
      <ImageInput
        watch={watch}
        setValue={setValue}
        name={'files'}
        control={control}
        editConfig={{ config: editConfig }}
      />
    </div>
  )
}

export function FrmTitle({ control, errors, editConfig }: frmElementsProps) {
  const style = {
    fontSize: 26,
    lineHeight: '38px',
    color: '#111827',
  }
  return (
    <>
      <TextControlled
        name={'company_name'}
        control={control}
        rules={required}
        errors={errors}
        placeholder={'por ejemplo, Mi empresa'}
        style={style}
        multiline={true}
        editConfig={{ config: editConfig }}
      />
    </>
  )
}

export function FrmTab0({ control, errors, editConfig, setValue, watch }: frmElementsProps) {
  const createOptions = useAppStore((state) => state.createOptions)
  const formItem = useAppStore((state) => state.formItem)

  const [Divisas, setDivisas] = useState<{ label: string; value: string }[]>([])
  const cargaData_Divisas = async () => {
    let lDivisas = await createOptions({
      fnc_name: 'fnc_currency',
      action: 's2',
    })
    setDivisas(lDivisas)
  }

  //Ubicar descripciones a campos con valor
  const cargaData = () => {
    if (formItem['currency_id']) {
      setDivisas([
        {
          value: formItem['currency_id'],
          label: formItem['currency_name'],
        },
      ])
    }
  }

  useEffect(() => {
    if (formItem) {
      cargaData()
    }
  }, [formItem])

  return (
    <>
      <div className="o_group mt-4">
        <div className="lg:w-1/2">
          <div className="o_inner_group grid">
            <div className="d-sm-contents">
              <div className="o_cell">
                <label className="o_form_label">Dirección</label>
              </div>
              <AddressField
                control={control}
                errors={errors}
                editConfig={{ config: editConfig }}
                watch={watch}
                setValue={setValue}
              />
            </div>

            <div className="d-sm-contents">
              <div className="o_cell o_wrap_label">
                <label className="o_form_label">Código de tipo de dirección</label>
              </div>
              <div className="o_cell">
                <div className="o_field">
                  <TextControlled
                    name={'cod_tdir'}
                    control={control}
                    errors={errors}
                    multiline={true}
                    placeholder={''}
                    editConfig={{ config: editConfig }}
                  />
                </div>
              </div>
            </div>
            <div className="d-sm-contents">
              <div className="o_cell o_wrap_label">
                <label className="o_form_label">NIF</label>
              </div>
              <div className="o_cell">
                <div className="o_field">
                  <TextControlled
                    name={'nif'}
                    control={control}
                    errors={errors}
                    placeholder={''}
                    editConfig={{ config: editConfig }}
                  />
                </div>
              </div>
            </div>

            <div className="d-sm-contents">
              <div className="o_cell o_wrap_label">
                <label className="o_form_label">Moneda</label>
              </div>
              <div className="o_cell">
                <div className="o_field">
                  <AutocompleteControlled
                    name={'currency_id'}
                    placeholder={''}
                    control={control}
                    rules={required}
                    errors={errors}
                    options={Divisas}
                    // fnc_create={fnc_create}
                    // createOpt={true}
                    // editOpt={true}
                    // frmSearch={() => (<FrmSearch />)}
                    fnc_loadOptions={cargaData_Divisas}
                    // enlace={true}
                    // fnc_enlace={fnc_enlace}
                    editConfig={{ config: editConfig }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="o_inner_group grid">
            <div className="d-sm-contents">
              <div className="o_cell o_wrap_label">
                <label className="o_form_label">Teléfono</label>
              </div>
              <div className="o_cell">
                <div className="o_field">
                  <TextControlled
                    name={'phone'}
                    control={control}
                    errors={errors}
                    multiline={true}
                    placeholder={''}
                    editConfig={{ config: editConfig }}
                  />
                </div>
              </div>
            </div>
            <div className="d-sm-contents">
              <div className="o_cell o_wrap_label">
                <label className="o_form_label">Móvil</label>
              </div>
              <div className="o_cell">
                <div className="o_field">
                  <TextControlled
                    name={'mobile'}
                    control={control}
                    errors={errors}
                    placeholder={''}
                    editConfig={{ config: editConfig }}
                  />
                </div>
              </div>
            </div>
            <div className="d-sm-contents">
              <div className="o_cell o_wrap_label">
                <label className="o_form_label">Correo electrónico</label>
              </div>
              <div className="o_cell">
                <div className="o_field">
                  <TextControlled
                    name={'email'}
                    control={control}
                    errors={errors}
                    placeholder={''}
                    editConfig={{ config: editConfig }}
                  />
                </div>
              </div>
            </div>
            <div className="d-sm-contents">
              <div className="o_cell o_wrap_label">
                <label className="o_form_label">Sitio web</label>
              </div>
              <div className="o_cell">
                <div className="o_field">
                  <TextControlled
                    name={'website'}
                    control={control}
                    errors={errors}
                    placeholder={'p. ej. https://www.system.com'}
                    editConfig={{ config: editConfig }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
