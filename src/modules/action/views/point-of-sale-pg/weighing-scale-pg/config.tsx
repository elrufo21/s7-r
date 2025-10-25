import { ViewTypeEnum, FormConfig, ModulesEnum, ItemStatusTypeEnum } from '@/shared/shared.types'
import { FrmMiddle } from '@/modules/action/views/point-of-sale/weighing-scale/configView'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'

const PosWeighingScaleConfig: FormConfig = {
  fnc_name: 'fnc_device',
  title: 'Dispositivos',
  dsc: 'Dispositivos',
  dsc_view: 'name',
  module: ModulesEnum.POINTS_OF_SALE_PG,
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '/action/408',
  item_url: '/action/408/detail',
  new_url: '/action/408/detail/new',
  no_content_title: 'Crear un dispositivo para mejorar la gestión de sus procesos',
  no_content_dsc: 'S7 le ayuda a llevar el control de sus dispositivos.',
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
    type: 'ES',
    name: '',
    code: '',
    description: '',
    character_uuid: '',
    state: ItemStatusTypeEnum.ACTIVE,
  },
  grid: {
    idRow: 'device_id',
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
      dsc: 'Dispositivos',
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
