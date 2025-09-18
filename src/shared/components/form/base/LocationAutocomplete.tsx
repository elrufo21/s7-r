import { AutocompleteControlled } from '@/shared/ui/inputs/AutocompleteControlled'
import { useLocationField } from '@/shared/components/form/hooks/useLocationField'

type LocationAutocompleteProps = {
  control: any
  errors: any
  setValue: any
  watch?: any
  formItem?: any
  editConfig: any
  placeholder?: string
  name: string
  idField: string
  nameField: string
  level: 'n1' | 'n2' | 'n3' | 'n4'
  parentIdField?: string
  parentValue?: string | number | null
  onLocationChange?: (data: any) => void
}

export const LocationAutocomplete = ({
  control,
  errors,
  setValue,
  formItem,
  editConfig,
  placeholder,
  name,
  idField,
  nameField,
  level,
  parentIdField,
  parentValue,
  onLocationChange,
}: LocationAutocompleteProps) => {
  // Usar el hook para manejar la lógica de ubicación
  const { options, loadOptions, handleOnChanged } = useLocationField({
    level,
    formItem,
    idField,
    nameField,
    parentIdField,
    parentValue,
    setValue,
    onChangeCallback: onLocationChange,
  })

  return (
    <AutocompleteControlled
      name={name}
      control={control}
      errors={errors}
      options={options}
      fnc_loadOptions={loadOptions}
      handleOnChanged={handleOnChanged}
      editConfig={{ config: editConfig }}
      placeholder={placeholder}
    />
  )
}

// Componentes específicos para cada nivel
export const CountryAutocomplete = (props: Omit<LocationAutocompleteProps, 'level'>) => (
  <LocationAutocomplete {...props} level="n1" />
)

export const DepartmentAutocomplete = (props: Omit<LocationAutocompleteProps, 'level'>) => (
  <LocationAutocomplete {...props} level="n2" />
)

export const ProvinceAutocomplete = (props: Omit<LocationAutocompleteProps, 'level'>) => (
  <LocationAutocomplete {...props} level="n3" />
)

export const DistrictAutocomplete = (props: Omit<LocationAutocompleteProps, 'level'>) => (
  <LocationAutocomplete {...props} level="n4" />
)
