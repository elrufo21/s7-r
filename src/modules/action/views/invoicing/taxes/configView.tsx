import { useEffect, useState } from 'react'
import useAppStore from '@/store/app/appStore'
import {
  AutocompleteControlled,
  CheckBoxControlled,
  SelectControlled,
  // SwitchControlled,
  TextControlled,
} from '@/shared/ui'
import { frmElementsProps } from '@/shared/shared.types'
import CompanyField from '@/shared/components/extras/CompanyField'
import { required } from '@/shared/helpers/Validators'
export function FrmTitle({ control, errors, editConfig }: frmElementsProps) {
  const style = {
    fontSize: 26,
    lineHeight: '38px',
    color: '#111827',
  }
  return (
    <>
      <TextControlled
        name={'name'}
        control={control}
        rules={required()}
        errors={errors}
        placeholder={'por ejemplo, Alberto Cervantes'}
        style={style}
        multiline={true}
        editConfig={{ config: editConfig }}
      />
    </>
  )
}

export function FrmMiddle({ control, errors, editConfig }: frmElementsProps) {
  const Options_calculo = [
    { label: 'Grupo de impuestos', value: 'group' },
    { label: 'Fijo', value: 'fixed' },
    { label: 'Porcentaje', value: 'percent' },
    { label: 'Porcentaje de impuesto incluido', value: 'division' },
  ]
  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Nombre del impuesto</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'name'}
              control={control}
              rules={required()}
              errors={errors}
              placeholder={''}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>

      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Cálculo del impuesto</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <SelectControlled
              name={'calculation'}
              control={control}
              errors={errors}
              options={Options_calculo}
            />
          </div>
        </div>
      </div>
      {/*
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Activo</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <SwitchControlled
              name={'state_switch'}
              onChange={() => {}}
              control={control}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
      */}
    </>
  )
}

export function FrmMiddleRight({ control, errors, editConfig }: frmElementsProps) {
  useEffect(() => {
    // loadData()
  }, [])

  const Options_unece = [
    { label: '', value: '' },
    { label: 'Exento de impuestos', value: 'E' },
    { label: 'Articulo de exportación, libre de impuestos.', value: 'G' },
    { label: 'Servicios fuera del ámbito fiscal', value: 'O' },
    { label: 'Tarifa estándar', value: 'S' },
    { label: 'Bienes libres de impuestos', value: 'Z' },
  ]

  const Options_timp = [
    { label: 'Ventas', value: 'sales' },
    { label: 'Compras', value: 'purchases' },
    { label: 'Ninguno', value: 'none' },
  ]

  const Options_aimp = [
    { label: '', value: '' },
    { label: 'Servicios', value: 'S' },
    { label: 'Bienes', value: 'B' },
  ]

  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Código</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            {/* 
            <SelectControlled
              name={'tax_code_id'}
              control={control}
              errors={errors}
              options={companies || []}
            /> */}
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Código UNECE</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <SelectControlled
              name={'code_unece'}
              control={control}
              errors={errors}
              options={Options_unece || []}
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">EDI Razón de afectación</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            {/*             
            <SelectControlled
              name={'affectation_reason_id'}
              control={control}
              errors={errors}
              options={aigv || []}
            /> */}
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Tipo de impuesto</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <SelectControlled
              name={'type'}
              control={control}
              errors={errors}
              options={Options_timp || []}
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Ámbito del impuesto</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <SelectControlled
              name={'scope'}
              control={control}
              errors={errors}
              options={Options_aimp || []}
            />
          </div>
        </div>
      </div>

      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Importe</label>
        </div>

        <div className="o_cell">
          <div className="o_field">
            <div className="w-full flex">
              <div className="w-28 pr-2 o_field_importe">
                <TextControlled
                  name={'percentage'}
                  control={control}
                  errors={errors}
                  placeholder={''}
                  editConfig={{ config: editConfig }}
                />
              </div>
              <div
                // name="udm_string"
                // className="o_field_widget o_label_importe"
                className="o_field_widget"
              >
                <span>%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export function FrmTab0({ control, errors, editConfig, setValue, watch }: frmElementsProps) {
  const createOptions = useAppStore((state) => state.createOptions)
  const formItem = useAppStore((state) => state.formItem)

  const [tax_group, setTax_group] = useState<{ label: string; value: string }[]>([])

  // tax_group - start
  const fnc_load_data_tax_group = async () => {
    const options = await createOptions({
      fnc_name: 'fnc_tax_group',
      filters: [{ column: 'state', value: 'A' }],
      action: 's2',
    })
    if (!formItem) {
      return setTax_group(options)
    }
    setTax_group([...options])
  }
  // tax_group - end

  const loadData = () => {
    if (formItem?.['tax_group_id']) {
      setTax_group([
        {
          value: formItem['tax_group_id'],
          label: formItem['tax_group_name'],
        },
      ])
    }
  }

  useEffect(() => {
    loadData()
  }, [formItem])

  return (
    <>
      <div className="o_group mt-4">
        <div className="lg:w-1/2">
          <div className="o_inner_group grid">
            <div className="d-sm-contents">
              <div className="o_cell o_wrap_label">
                <label className="o_form_label">Etiqueta en facturas</label>
              </div>
              <div className="o_cell">
                <div className="o_field">
                  <TextControlled
                    name={'invoice_label'}
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
                <label className="o_form_label">Descripción</label>
              </div>
              <div className="o_cell">
                <div className="o_field">
                  <TextControlled
                    name={'description'}
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
                <label className="o_form_label">Grupo de impuestos</label>
              </div>
              <div className="o_cell">
                <div className="o_field">
                  <AutocompleteControlled
                    name={'tax_group_id'}
                    control={control}
                    errors={errors}
                    editConfig={{ config: editConfig }}
                    rules={required()}
                    enlace={true}
                    options={tax_group}
                    fnc_loadOptions={fnc_load_data_tax_group}
                    // fnc_enlace={fnc_navigate_tax_group}
                    // createItem={fnc_create_tax_group}
                    // createAndEditItem={(data: string) => fnc_create_edit_tax_group(data)}
                    // loadMoreResults={fnc_search_tax_group}
                  />

                  {/*               
                  <AutocompleteControlled
                    name={'tax_group_id'}
                    placeholder={''}
                    control={control}
                    rules={required()}
                    errors={errors}
                    options={taxGroup || []}
                    
                    enlace={true}
                    editConfig={{ config: editConfig }}
                  />
                   */}
                </div>
              </div>
            </div>
            {/*
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
                    options={companies || []}
                    fnc_loadOptions={loadDataCompanies}
                    enlace={true}
                    editConfig={{ config: editConfig }}
                  />
                </div>
              </div>
            </div>
            */}
            {
              <CompanyField
                control={control}
                errors={errors}
                setValue={setValue}
                editConfig={{ config: editConfig }}
                watch={watch}
              />
            }
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="o_inner_group grid">
            <div className="d-sm-contents">
              {/* <div className="o_cell o_wrap_label"> */}
              <div className="o_cell">
                <label className="o_form_label">Incluido en el precio</label>
              </div>
              <div className="o_cell">
                <div className="o_field">
                  <div className="frmControlEx">
                    {/*<CheckBoxControlled
                      dsc={''}
                      name={'price_include'}
                      className="align-text-bottom"
                      control={control}
                      editConfig={{ config: editConfig }}
                    />*/}
                    <SelectControlled
                      name={'price_include'}
                      control={control}
                      errors={errors}
                      options={[
                        { value: 'P', label: 'Predeterminado' },
                        { value: 'I', label: 'Impuestos incluidos' },
                        { value: 'N', label: 'Impuestos no incluidos' },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="d-sm-contents">
              {/* <div className="o_cell o_wrap_label"> */}
              <div className="o_cell">
                <label className="o_form_label">Afecta la base de los impuestos subsecuentes</label>
              </div>
              <div className="o_cell">
                <div className="o_field">
                  <div className="frmControlEx">
                    <CheckBoxControlled
                      dsc={''}
                      name={'subsequent_taxes'}
                      className="align-text-bottom"
                      control={control}
                      editConfig={{ config: editConfig }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
