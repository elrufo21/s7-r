import BaseAutocomplete from '@/shared/components/form/base/BaseAutocomplete'
import { frmElementsProps } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'

export function Subtitle({ control, errors, editConfig, setValue }: frmElementsProps) {
  const { formItem } = useAppStore()
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-4">
        <label className="font-medium text-gray-700 min-w-[140px]">Reporte de la sesión</label>
        <div className="flex-1">
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
              modalConfig: <></>,
              modalTitle: 'Diarios',
              primaryKey: 'journal_id',
              fncName: 'fnc_journal',
            }}
          />
        </div>
      </div>
    </div>
  )
}
