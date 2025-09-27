import { ViewTypeEnum, FormConfig, ModulesEnum, ItemStatusTypeEnum } from '@/shared/shared.types'
import { FrmMiddle } from './configView'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'

const PosWeighingScaleConfig: FormConfig = {
  fnc_name: 'fnc_pos_weighing_scale',
  title: 'Balanzas',
  dsc: 'Balanzas',
  dsc_view: 'name',
  module: ModulesEnum.POINTS_OF_SALE,
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '/action/901',
  item_url: '/action/901/detail/',
  new_url: '/action/901/detail/new',
  isFavoriteColumn: false,
  formTitle: '',
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
    if (!data['name']) {
      return null
    }
    return data
  },

  default_values: {
    name: '',
    description: '',
    state: ItemStatusTypeEnum.ACTIVE,
  },
  grid: {
    idRow: 'weighing_scale_id',
    col_name: 'name',
    list: {
      columns: [
        {
          header: 'Nombre',
          accessorKey: 'name',
          className: '!w-auto text-left',
        },
        {
          header: 'Descripción',
          accessorKey: 'description',
          className: '!w-auto text-left',
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
      dsc: 'Balanzas',
      key: 'name',
      default: true,
    },
  ],

  group_by: [],

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

export default PosWeighingScaleConfig
