import { useEffect } from 'react'
import useAppStore from '@/store/app/appStore'
import {
  CheckBoxControlled,
  SelectControlled,
  // SwitchControlled,
  TextControlled,
} from '@/shared/ui'
import { frmElementsProps } from '@/shared/shared.types'
import { required } from '@/shared/helpers/validators'
import FormRow from '@/shared/components/form/base/FormRow'
import BaseAutocomplete from '@/shared/components/form/base/BaseAutocomplete'
import CfCompany from '@/shared/components/extras/Cf_company'
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

export function FrmMiddle({ control, errors, editConfig, setValue }: frmElementsProps) {
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
              onChange={(e) => {
                setValue('calculation', e)
              }}
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

  /*const Options_unece = [
    { label: '', value: '' },
    { label: 'Exento de impuestos', value: 'E' },
    { label: 'Articulo de exportación, libre de impuestos.', value: 'G' },
    { label: 'Servicios fuera del ámbito fiscal', value: 'O' },
    { label: 'Tarifa estándar', value: 'S' },
    { label: 'Bienes libres de impuestos', value: 'Z' },
  ]*/

  const Options_timp = [
    { label: ' ', value: 'N' },
    { label: 'Ventas', value: 'S' },
    { label: 'Compras', value: 'P' },
  ]

  const Options_aimp = [
    { label: ' ', value: 'N' },
    { label: 'Servicios', value: 'S' },
    { label: 'Bienes', value: 'G' },
  ]
  /*
  const Tax_codes = [
    { label: '', value: '' },
    { label: 'IGV - Impuesto General a las Ventas', value: 'IGV' },
    { label: 'IVAP - Impuesto a la Venta Arroz Pilado', value: 'IVAP' },
    { label: 'ISC - Impuesto Selectivo al Consumo', value: 'ISC' },
    { label: 'ICBPER - Impuesto a la bolsa plástica', value: 'ICBPER' },
    { label: 'EXP - Exportación', value: 'EXP' },
    { label: 'GRA - Gratuito', value: 'GRA' },
    { label: 'EXO - Exonerado', value: 'EXO' },
    { label: 'INA - Inafecto', value: 'INA' },
    { label: 'OTROS - Otros impuestos', value: 'OTROS' },
  ]
  const Affectation_reason = [
    { label: '', value: '' },
    { label: 'Servicios', value: 'S' },
    { label: 'Bienes', value: 'B' },
  ]*/
  return (
    <>
      {/*
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Código</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <SelectControlled
              name={'tax_code_id'}
              control={control}
              errors={errors}
              options={Tax_codes}
            />
          </div>
        </div>
      </div>
      */}

      {/*
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
      */}

      {/*
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">EDI Razón de afectación</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <SelectControlled
              name={'affectation_reason_id'}
              control={control}
              errors={errors}
              options={Affectation_reason}
            />
          </div>
        </div>
      </div>
     */}
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
  const formItem = useAppStore((state) => state.formItem)

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
            <FormRow label="Grupo de impuestos">
              <BaseAutocomplete
                name="tax_group_id"
                control={control}
                errors={errors}
                setValue={setValue}
                formItem={formItem}
                label="tax_group_name"
                filters={[]}
                editConfig={editConfig}
                rulers={true}
                config={{
                  fncName: 'fnc_tax_group',
                  primaryKey: 'tax_group_id',
                }}
              />
            </FormRow>

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
              <CfCompany
                control={control}
                errors={errors}
                editConfig={{ config: editConfig }}
                setValue={setValue}
                isEdit={true}
                label="Empresa"
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
                      rules={required()}
                      options={[
                        { value: 'P', label: 'Predeterminado' },
                        { value: 'I', label: 'Impuestos incluidos' },
                        { value: 'E', label: 'Impuestos no incluidos' },
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
