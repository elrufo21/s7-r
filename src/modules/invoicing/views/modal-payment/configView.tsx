import ModalPaymentTermConfig from '@/modules/action/views/invoicing/diaries/config'
import Cf_date from '@/shared/components/extras/Cf_date'
import Custom_field_currency from '@/shared/components/extras/custom_field_currency'
import BaseAutocomplete from '@/shared/components/form/base/BaseAutocomplete'
import FormRow from '@/shared/components/form/base/FormRow'
import { required } from '@/shared/helpers/validators'
import { frmElementsProps } from '@/shared/shared.types'
import { AutocompleteControlled, TextControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import { useState } from 'react'

export const FrmMiddle = ({ control, errors, editConfig, watch, setValue }: frmElementsProps) => {
  const [diaries, setDiaries] = useState<{ value: any; label: string }[]>([])
  const [paymentMethods, setPaymentMethods] = useState<{ value: any; label: string }[]>([])
  const { createOptions, formItem } = useAppStore()

  const fnc_load_payment_methods = async () => {
    const options = await createOptions({
      fnc_name: 'fnc_journal_payment_methods',
      filters: [[0, 'fequal', 'journal_id', watch(`journal_id-${watch('dialog_id')}`)]],
      action: 's2',
    })
    setPaymentMethods(options)
  }
  return (
    <>
      <FormRow label={'Diario'}>
        <BaseAutocomplete
          name={`journal_id-${watch('dialog_id')}`}
          control={control}
          errors={errors}
          placeholder={''}
          editConfig={editConfig}
          setValue={setValue}
          formItem={formItem}
          label="journal_name"
          allowSearchMore={true}
          rulers={required()}
          disableFrmIsChanged={true}
          filters={[
            [
              0,
              'multi_filter_in',
              [
                { key_db: 'type', value: 'BK' },
                { key_db: 'type', value: 'CS' },
              ],
            ],
          ]}
          config={{
            fncName: 'fnc_journal',
            primaryKey: 'journal_id',
            modalConfig: ModalPaymentTermConfig,
            modalTitle: 'Diario',
          }}
        />
      </FormRow>

      <FormRow label={'Metodo de pago'}>
        <AutocompleteControlled
          name={`payment_method_id-${watch('dialog_id')}`}
          control={control}
          errors={errors}
          editConfig={{ config: editConfig }}
          options={paymentMethods}
          disableFrmIsChanged={true}
          rules={required()}
          fnc_loadOptions={() => {
            fnc_load_payment_methods()
          }}
        />
      </FormRow>

      <FormRow label={'Cuenta bancaria receptora'}>
        <AutocompleteControlled
          name={`bank_account_id-${watch('dialog_id')}`}
          control={control}
          errors={errors}
          editConfig={{ config: editConfig }}
          options={[{ value: '', label: 'Seleccione' }]}
          fnc_loadOptions={() => {}}
          is_edit={true}
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
  return (
    <>
      <FormRow label={'Importe'} className="flex gap-2">
        <div className="">S/</div>
        <div className="">
          <TextControlled
            name={`amount-${watch('dialog_id')}`}
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
            disableFrmIsChanged={true}
          />
        </div>
      </FormRow>

      <Cf_date
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
        fieldName={`date-${watch('dialog_id')}`}
        label={true}
        watch={watch}
        startToday={true}
        disableFrmIsChanged={true}
      />
      <FormRow label={'Memo'}>
        <TextControlled
          name={`memo-${watch('dialog_id')}`}
          control={control}
          errors={errors}
          editConfig={{ config: editConfig }}
        />
      </FormRow>
    </>
  )
}
