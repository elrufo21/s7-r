import Cf_date from '@/shared/components/extras/Cf_date'
import Custom_field_currency from '@/shared/components/extras/custom_field_currency'
import BaseAutocomplete from '@/shared/components/form/base/BaseAutocomplete'
import { ContactAutocomplete } from '@/shared/components/form/base/ContactAutocomplete'
import FormRow from '@/shared/components/form/base/FormRow'
import { frmElementsProps, TypeContactEnum } from '@/shared/shared.types'
import { AutocompleteControlled, RadioButtonControlled, TextControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import { useState } from 'react'
import JournalConfig from '@/modules/action/views/invoicing/diaries/config'

export const FrmTittle = ({ watch }: frmElementsProps) => {
  return (
    <h1 className="text-2xl font-bold mb-0 text-gray-900">
      {watch('state') === 'D' ? <span>Borrador</span> : <span>{watch('name')}</span>}
    </h1>
  )
}
export const FrmMiddle = ({
  control,
  errors,
  editConfig = {},
  watch,
  setValue,
}: frmElementsProps) => {
  const { formItem } = useAppStore()
  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label flex align-items-center ">
          <label className="o_form_label">Tipo de pago</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <div className="w-full flex">
              <RadioButtonControlled
                name={'payment_type'}
                control={control}
                rules={{}}
                options={[
                  { value: 'S', label: 'Enviar' },
                  { value: 'R', label: 'Recibir' },
                ]}
                editConfig={{ config: editConfig }}
              />
            </div>
          </div>
        </div>
      </div>
      <FormRow label={'Cliente'}>
        <ContactAutocomplete
          name={'partner_id'}
          control={control}
          errors={errors}
          setValue={setValue}
          formItem={formItem}
          editConfig={editConfig}
          fnc_name={'fnc_partner'}
          idField={'partner_id'}
          nameField={'partner_name'}
          type={TypeContactEnum.INDIVIDUAL}
        />
      </FormRow>

      <FormRow label={'Importe'} className="flex gap-2">
        <div className="">S/</div>
        <div className="">
          <TextControlled
            name={'amount'}
            control={control}
            errors={errors}
            editConfig={{ config: editConfig }}
          />
        </div>
        <div className="w-full">
          <Custom_field_currency
            control={control}
            errors={errors}
            editConfig={editConfig}
            setValue={setValue}
            watch={watch}
            label={false}
          />
        </div>
      </FormRow>

      <Cf_date
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
        fieldName={'date'}
        label={true}
        watch={watch}
        startToday={true}
        rulers
      />
      <FormRow label={'Memo'}>
        <TextControlled
          name={'memo'}
          control={control}
          errors={errors}
          editConfig={{ config: editConfig }}
        />
      </FormRow>
    </>
  )
}

export const FrmMiddleRight = ({
  control,
  errors,
  editConfig,
  watch,
  setValue,
}: frmElementsProps) => {
  const [paymentMethods, setPaymentMethods] = useState<{ value: any; label: string }[]>([])
  const { formItem, createOptions } = useAppStore()

  const fnc_load_payment_methods = async () => {
    const options = await createOptions({
      fnc_name: 'fnc_journal_payment_methods',
      filters: [[0, 'fequal', 'journal_id', watch('journal_id')]],
      action: 's2',
    })
    setPaymentMethods(options)
  }

  return (
    <>
      <FormRow label={'Diario'}>
        <BaseAutocomplete
          control={control}
          errors={errors}
          setValue={setValue}
          editConfig={{ config: editConfig }}
          formItem={formItem}
          name={'journal_id'}
          label="journal_name"
          rulers={true}
          filters={[]}
          allowSearchMore={true}
          config={{
            modalConfig: JournalConfig,
            modalTitle: 'Diarios',
            primaryKey: 'journal_id',
            fncName: 'fnc_journal',
          }}
        />
      </FormRow>

      <FormRow label={'Metodo de pago'}>
        <AutocompleteControlled
          name={'payment_method_id'}
          control={control}
          errors={errors}
          editConfig={{ config: editConfig }}
          options={paymentMethods}
          fnc_loadOptions={() => {
            fnc_load_payment_methods()
          }}
        />
      </FormRow>

      <FormRow label={'Cuenta bancaria de la empresa'}>
        <AutocompleteControlled
          name={'bank_account_id'}
          control={control}
          errors={errors}
          editConfig={{ config: editConfig }}
          options={[]}
          fnc_loadOptions={() => {}}
        />
      </FormRow>
    </>
  )
}
