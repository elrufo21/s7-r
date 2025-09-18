import BaseAutocomplete from '@/shared/components/form/base/BaseAutocomplete'
import ModalPaymentTermConfig from '@/modules/action/views/invoicing/diaries/config'
import FormRow from '@/shared/components/form/base/FormRow'
import { frmElementsProps } from '@/shared/shared.types'
import { ImageInput, TextControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import CfCompany from '@/shared/components/extras/Cf_company'
import { required } from '@/shared/helpers/validators'

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
  return (
    <TextControlled
      name={'name'}
      className={'frm_dsc'}
      placeholder={'Por ejemplo, efectivo'}
      control={control}
      multiline={true}
      rules={required()}
      errors={errors}
      editConfig={{ config: editConfig }}
    />
  )
}

export function FrmMiddle({ control, errors, editConfig, setValue, watch }: frmElementsProps) {
  const { formItem } = useAppStore()

  return (
    <>
      {/*
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Pago en línea</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <div className="frmControlEx">
              <CheckBoxControlled
                dsc={''}
                name={'online_payment'}
                className="align-text-bottom"
                control={control}
                editConfig={{ config: editConfig }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Identificar cliente</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <div className="frmControlEx">
              <CheckBoxControlled
                dsc={''}
                name={'identify_customer'}
                className="align-text-bottom"
                control={control}
                editConfig={{ config: editConfig }}
              />
            </div>
          </div>
        </div>
      </div>
       */}
      <FormRow label="Diario" editConfig={editConfig} fieldName={'journal_id'}>
        <BaseAutocomplete
          name={'journal_id'}
          control={control}
          errors={errors}
          placeholder={''}
          editConfig={editConfig}
          setValue={setValue}
          formItem={formItem}
          label="journal_name"
          allowSearchMore={true}
          config={{
            fncName: 'fnc_journal',
            primaryKey: 'journal_id',
            modalConfig: ModalPaymentTermConfig,
            modalTitle: 'Diario',
          }}
        />
      </FormRow>
      {/*
      <FormRow label="Cuenta intermediaria" editConfig={editConfig} fieldName={'account_id'}>
        <BaseAutocomplete
          name={'account_id'}
          control={control}
          errors={errors}
          placeholder={''}
          editConfig={editConfig}
          setValue={setValue}
          formItem={formItem}
          label="journal_name"
          config={{
            fncName: 'fnc_journal',
            primaryKey: 'journal_id',
            modalTitle: 'Diario',
          }}
        />
      </FormRow>
      */}
      <CfCompany
        control={control}
        errors={errors}
        editConfig={{ config: editConfig }}
        setValue={setValue}
        isEdit={true}
        label="Empresa"
        watch={watch}
      />
      {/*
      <FormRow label="Punto de venta" editConfig={editConfig} fieldName={'order_id'}>
        <BaseAutocomplete
          name={'order_id'}
          control={control}
          errors={errors}
          placeholder={''}
          editConfig={editConfig}
          setValue={setValue}
          formItem={formItem}
          label="pos_name"
          config={{
            fncName: 'fnc_order_pos',
            primaryKey: 'order_id',
            modalTitle: 'Punto de venta',
          }}
        />
      </FormRow>
      */}
    </>
  )
}

export function FrmMiddleRight() {
  return (
    <>
      {/*
      <FormRow label="Integración" editConfig={editConfig} fieldName={'integration_id'}>
        <SelectControlled
          name={'integration_id'}
          control={control}
          errors={errors}
          options={[
            { label: 'No requiere', value: 0 },
            { label: 'Terminal', value: 1 },
          ]}
        />
      </FormRow>
      */}
    </>
  )
}
