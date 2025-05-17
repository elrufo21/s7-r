import { TextControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import { FC } from 'react'
import { Control, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import {
  CountryAutocomplete,
  DepartmentAutocomplete,
  DistrictAutocomplete,
  ProvinceAutocomplete,
} from '../form/base/LocationAutocomplete'

interface AddressFieldProps {
  control: Control<any>
  errors: FieldErrors
  editConfig: any
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
}

const AddressField: FC<AddressFieldProps> = ({ control, errors, watch, editConfig, setValue }) => {
  const { formItem } = useAppStore()

  // Observar los valores para filtrado en cascada
  const countryId = watch('ln1_id')
  const departmentId = watch('ln2_id')
  const provinceId = watch('ln3_id')

  return (
    <div className="o_cell">
      <div className="pt-6">
        <div className="o_field">
          <TextControlled
            name={'street'}
            placeholder={'Calle ...'}
            control={control}
            errors={errors}
            editConfig={{ config: editConfig }}
          />
        </div>
        <div className="o_field">
          <TextControlled
            name={'street_2'}
            placeholder={'Calle 2 ...'}
            control={control}
            errors={errors}
            editConfig={{ config: editConfig }}
          />
        </div>
        <div className="o_field">
          <DistrictAutocomplete
            name="ln4_id"
            idField="ln4_id"
            nameField="ln4_name"
            control={control}
            errors={errors}
            setValue={setValue}
            formItem={formItem}
            editConfig={editConfig}
            placeholder="Distrito"
            parentIdField="ln3_id"
            parentValue={provinceId}
          />
        </div>
        <div className="o_field">
          <ProvinceAutocomplete
            name="ln3_id"
            idField="ln3_id"
            nameField="ln3_name"
            control={control}
            errors={errors}
            setValue={setValue}
            formItem={formItem}
            editConfig={editConfig}
            placeholder="Provincia"
            parentIdField="ln2_id"
            parentValue={departmentId}
          />
        </div>
        <div className="o_field flex gap-5">
          <div className="w-8/12">
            <DepartmentAutocomplete
              name="ln2_id"
              idField="ln2_id"
              nameField="ln2_name"
              control={control}
              errors={errors}
              setValue={setValue}
              formItem={formItem}
              editConfig={editConfig}
              placeholder="Departamento"
              parentIdField="ln1_id"
              parentValue={countryId}
            />
          </div>
          <div className="w-4/12">
            <TextControlled
              name={'zip'}
              placeholder={'C.P.'}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
        <div className="o_field">
          <CountryAutocomplete
            name="ln1_id"
            idField="ln1_id"
            nameField="ln1_name"
            control={control}
            errors={errors}
            setValue={setValue}
            formItem={formItem}
            editConfig={editConfig}
            placeholder="País"
          />
        </div>
      </div>
    </div>
  )
}
export default AddressField
