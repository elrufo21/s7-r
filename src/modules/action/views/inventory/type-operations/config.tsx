import { ViewTypeEnum, FormConfig, ModulesEnum, ItemStatusTypeEnum } from '@/shared/shared.types'
import { FrmTab0, FrmTitle } from './configView'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'

const TypeOperationsConfig: FormConfig = {
  fnc_name: 'fnc_types_operations',
  title: 'Tipos de operaciones',
  dsc: 'Tipo de operación',
  dsc_view: 'name',
  module: ModulesEnum.INVENTORY,
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '/action/195',
  item_url: '/action/195/detail',
  new_url: '/action/195/detail/new',
  ribbonList: {
    field: 'state',
    ribbonList: [
      {
        label: 'ARCHIVADO',
        state: StatusContactEnum.ARCHIVE,
        className: 'ribbon ',
      },
    ],
    getLabelFromData: (_, data) => data?.state_description,
  },
  fnc_valid: (data) => {
    //const hasErrors = data.units.some((unit: any) => !unit.name || !unit.factor || !unit.rounding)

    return data
  },

  default_values: {
    type_operation_id: null,
    name: '',
    code: '',
    sequence_code: '',
    barcode: '',
    company_id: null,
    return_picking_type_id: null,
    create_backorder: '',
    state: ItemStatusTypeEnum.ACTIVE,
  },
  grid: {
    idRow: 'type_operation_id',
    col_name: 'name',
    isDragable: false,
    list: {
      columns: [
        {
          header: 'Tipo de operación',
          accessorKey: 'name',
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
    tabs: [
      {
        name: 'General',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab0
            control={control}
            errors={errors}
            setValue={setValue}
            editConfig={editConfig}
            watch={watch}
          />
        ),
      },
    ],
  },
}

export default TypeOperationsConfig
