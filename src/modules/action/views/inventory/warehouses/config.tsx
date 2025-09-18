import { ViewTypeEnum, FormConfig, ModulesEnum, ItemStatusTypeEnum } from '@/shared/shared.types'
import { FrmMiddle, FrmMiddleRight, FrmTitle } from './configView'

const UnitMeasurementConfig: FormConfig = {
  fnc_name: 'fnc_warehouses',
  title: 'Almacenes',
  dsc: 'Almacén',
  dsc_view: 'name',
  module: ModulesEnum.INVENTORY,
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '/action/156',
  item_url: '/action/156/detail',
  new_url: '/action/156/detail/new',
  fnc_valid: (data) => {
    //const hasErrors = data.units.some((unit: any) => !unit.name || !unit.factor || !unit.rounding)

    return data
  },

  default_values: {
    warehouse_id: null,
    name: '',
    code: '',
    company_id: null,
    partner_id: null,
    state: ItemStatusTypeEnum.ACTIVE,
  },
  grid: {
    idRow: 'warehouse_id',
    col_name: 'name',
    isDragable: false,
    list: {
      columns: [
        {
          header: 'Almacén',
          accessorKey: 'name',
        },
        {
          header: 'Direccción',
          accessorKey: 'partner_name',
        },
        {
          header: 'Empresa',
          accessorKey: 'company_name',
        },
      ],
    },
  },
  visibility_columns: {},
  filters: [],

  filters_columns: [],

  configControls: {},
  form_inputs: {
    imagenFields: [],
    auditoria: false,
    frm_title({ watch, control, errors, editConfig = {}, setValue }) {
      return (
        <FrmTitle
          watch={watch}
          control={control}
          errors={errors}
          editConfig={editConfig}
          setValue={setValue}
        />
      )
    },
    frm_middle({ watch, control, errors, editConfig = {}, setValue }) {
      return (
        <FrmMiddle
          watch={watch}
          control={control}
          errors={errors}
          editConfig={editConfig}
          setValue={setValue}
        />
      )
    },
    frm_middle_right({ watch, control, errors, editConfig = {}, setValue }) {
      return (
        <FrmMiddleRight
          watch={watch}
          control={control}
          errors={errors}
          editConfig={editConfig}
          setValue={setValue}
        />
      )
    },
  },
}

export default UnitMeasurementConfig
