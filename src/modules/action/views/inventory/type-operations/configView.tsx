import { frmElementsProps } from '@/shared/shared.types'
import { AutocompleteControlled, SelectControlled, TextControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import { useState } from 'react'

export function FrmTitle({ control, errors, editConfig }: frmElementsProps) {
  return (
    <TextControlled
      name={'name'}
      className={'frm_dsc'}
      placeholder={'Por ejemplo, recepciones'}
      multiline={true}
      control={control}
      errors={errors}
      editConfig={{ config: editConfig }}
    />
  )
}

export function FrmTab0({ control, errors, editConfig }: frmElementsProps) {
  const { createOptions } = useAppStore((state) => state)

  const [companies, setCompanies] = useState<{ label: string; value: string }[]>([])
  const loadCompanies = async () => {
    setCompanies(
      await createOptions({
        fnc_name: 'fnc_partner',
        action: 's2',
      })
    )
  }
  return (
    <div className="o_group mt-4">
      <div className="lg:w-1/2">
        <div className="o_inner_group grid">
          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Tipo de operación</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <SelectControlled
                  name={'operation_type'}
                  control={control}
                  errors={errors}
                  editConfig={{ config: editConfig }}
                  options={[
                    { label: 'Recepción', value: 'r' },
                    { label: 'Entrega', value: 'e' },
                    { label: 'Traslado interno', value: 't' },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Prefijo de secuencia</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <TextControlled
                  name={'secuence_code'}
                  control={control}
                  errors={errors}
                  placeholder={''}
                  multiline
                  editConfig={{ config: editConfig }}
                />
              </div>
            </div>
          </div>
          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Código de barras</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <TextControlled
                  name={'bar_code'}
                  control={control}
                  errors={errors}
                  placeholder={''}
                  multiline
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
            <div className="o_cell">
              <label className="o_form_label">Empresa</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <div className="frmControlEx">
                  <AutocompleteControlled
                    name={'company_id'}
                    control={control}
                    errors={errors}
                    editConfig={{ config: editConfig }}
                    options={companies}
                    fnc_loadOptions={loadCompanies}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="d-sm-contents">
            {/* <div className="o_cell o_wrap_label"> */}
            <div className="o_cell">
              <label className="o_form_label">Tipo de devolución</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <div className="frmControlEx">
                  <AutocompleteControlled
                    name={'return_picking_type_id'}
                    control={control}
                    errors={errors}
                    editConfig={{ config: editConfig }}
                    options={[]}
                    fnc_loadOptions={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Crear orden parcial</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <SelectControlled
                  name={'operation_type'}
                  control={control}
                  errors={errors}
                  editConfig={{ config: editConfig }}
                  options={[
                    { label: 'Pregunta', value: 'r' },
                    { label: 'Siempre', value: 'e' },
                    { label: 'Nunca', value: 't' },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
