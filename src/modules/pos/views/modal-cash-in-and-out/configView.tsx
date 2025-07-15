import { frmElementsProps } from '@/shared/shared.types'
import { TextControlled } from '@/shared/ui'

export function FrmMiddle({ control, errors, editConfig }: frmElementsProps) {
  return (
    <div className="o_inner_group w-[500px] h-[50px]">
      <div className="mb-4">
        <div className="pl-4 flex flex-col gap-1">
          <div className="flex justify-between items-center ">
            <TextControlled
              name="reason"
              placeholder="Motivo"
              multiline={true}
              multilineRows={5}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
