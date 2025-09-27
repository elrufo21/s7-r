import { ViewTypeEnum, FormConfig, ModulesEnum, ItemStatusTypeEnum } from '@/shared/shared.types'
import { FrmMiddle } from '@/modules/action/views/inventory/unit-measurement/configView'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'

const UnitMeasurementConfig: FormConfig = {
  fnc_name: 'fnc_uom',
  title: 'Unidades de medida',
  dsc: 'Unidades de medida',
  dsc_view: 'name',
  module: ModulesEnum.INVOICING,
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '/action/92',
  item_url: '/action/92/detail',
  new_url: '/action/92/detail/new',
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
    category_id: null,
    name: '',
    factor: '1',
    group_id: null,
    state: ItemStatusTypeEnum.ACTIVE,
  },
  grid: {
    idRow: 'uom_id',
    col_name: 'name',
    isDragable: false,
    list: {
      columns: [
        {
          header: 'Nombre de la unidad',
          accessorKey: 'name',
          //meta: { align: 'text-center' },
        },
        {
          header: 'Contiene',
          accessorKey: 'factor',
          //meta: { align: 'text-right' },
          className: 'text-right',
        },
        {
          header: 'Unidad de referencia',
          accessorKey: 'parent_name',
        },
      ],
    },
  },
  visibility_columns: {},
  filters: [
    {
      list: [
        {
          group: 'state',
          title: 'Archivado',
          key: 'state',
          key_db: 'state',
          value: 'I',
          type: 'check',
        },
      ],
    },
  ],
  filters_columns: [
    {
      dsc: 'Nombre de la unidad',
      key: 'name',
      default: true,
    },
  ],

  group_by: [
    {
      list: [
        {
          title: 'Unidad de referencia',
          key: 'parent_name',
          key_gby: 'parent_id',
        },
      ],
    },
  ],

  configControls: {},
  form_inputs: {
    imagenFields: [],
    auditoria: false,
    frm_middle: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmMiddle
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
      />
    ),
  },
}

export default UnitMeasurementConfig
