import { useLocation, useNavigate } from 'react-router-dom'
import { TextControlled } from '@/shared/ui'
import { ViewTypeEnum } from '@/shared/shared.types'
import FormRow from './FormRow'
import useAppStore from '@/store/app/appStore'

interface BaseTextControlledProps {
  name: string
  control: any
  errors: any
  placeholder?: string
  editConfig: any
  label: string
  multiline?: boolean
  navigateLink?: () => void
  navigationConfig?: {
    modelId: string | number
    recordId: string | number
    fieldName?: string
  }
  required?: boolean
}
const BaseTextControlled = ({
  name,
  control,
  errors,
  placeholder = '',
  editConfig,
  label,
  multiline = false,
  navigateLink,
  navigationConfig,
  required = false,
}: BaseTextControlledProps) => {
  const { formItem, setBreadcrumb, breadcrumb } = useAppStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const handleNavigate = () => {
    if (navigationConfig?.modelId && navigationConfig?.recordId) {
      setBreadcrumb([
        ...breadcrumb,
        {
          title: navigationConfig.fieldName ? formItem[navigationConfig.fieldName] : formItem.name,
          url: pathname,
          viewType: ViewTypeEnum.FORM,
        },
      ])
      navigate(`/action/${navigationConfig.modelId}/detail/${navigationConfig.recordId}`)
    }
  }
  return (
    <FormRow label={label} editConfig={editConfig} fieldName={name} className="min-w-[140px]">
      <TextControlled
        name={name}
        placeholder={placeholder}
        control={control}
        errors={errors}
        editConfig={{ config: editConfig }}
        multiline={multiline}
        navigateLink={navigationConfig ? handleNavigate : navigateLink}
        required={required}
      />
    </FormRow>
  )
}

export default BaseTextControlled
