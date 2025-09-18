import { frmElementsProps } from '@/shared/shared.types'
import { PosTextControlled } from '@/shared/ui/inputs/PosTextControlled'

export function FrmMiddle({ control, errors }: frmElementsProps) {
  return (
    <div className="o_inner_group w-[1000px] mix-h-[100px] mt-6">
      <PosTextControlled
        name="reason"
        placeholder="Motivo"
        multiline={true}
        control={control}
        errors={errors}
      />
    </div>
  )
}
