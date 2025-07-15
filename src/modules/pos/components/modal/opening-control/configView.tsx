import { frmElementsProps } from '@/shared/shared.types'
import BaseTextControlled from '@/shared/components/form/base/BaseTextControlled'
import FormRow from '@/shared/components/form/base/FormRow'
import { TextControlled } from '@/shared/ui/inputs/TextControlled'

export function FrmMiddle({ control, errors, editConfig }: frmElementsProps) {
  return (
    <div className="w-[500px]">
      <div className="flex items-center gap-4">
        <label className="font-medium min-w-[140px]">Efectivo de apertura</label>
        <div className="flex-1">
          <BaseTextControlled
            name="initial_cash"
            label=""
            control={control}
            errors={errors}
            editConfig={editConfig}
          />
        </div>
      </div>
      <FormRow label="Nota de apertura">
        <TextControlled
          className="col-12 w-[500px]"
          name="opening_note"
          control={control}
          errors={errors}
          multiline
        />
      </FormRow>
    </div>
  )
}
