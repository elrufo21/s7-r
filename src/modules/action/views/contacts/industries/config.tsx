import { ViewTypeEnum } from '@/shared/shared.types'
import { FormConfig, ModulesEnum } from '@/shared/shared.types'
import { FrmMiddle } from './configView'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'

const IndustriesConfig: FormConfig = {
  fnc_name: 'fnc_partner_industry',
  title: 'Industrias',
  module: ModulesEnum.CONTACTS,
  dsc: 'Industrias',
  dsc_view: 'name',
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  item_url: '/action/103/detail',
  new_url: '/action/103/detail/new',
  module_url: '/action/103',

  no_content_title: 'Crear un sector',
  no_content_dsc: 'Especifique los sectores para clasificar sus contactos y elaborar informes.',
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
    industry_id: null,
    group_id: null,
    state: 'A',
    creation_user: '',
    creation_date: '',
    name: '',
    full_name: '',
  },

  grid: {
    idRow: 'industry_id',
    col_name: 'name',
    isDragable: false,

    list: {
      columns: [
        {
          header: 'Nombre',
          accessorKey: 'name',
          align: 'left',
          size: 200,
        },
        {
          header: 'Nombre completo',
          accessorKey: 'full_name',
          align: 'left',
        },
      ],
    },
  },

  filters: [
    {
      list: [
        {
          group: 'state',
          key: 'state_I',
          title: 'Archivado',
          value: 'I',
          type: 'check',
        },
      ],
    },
  ],

  visibility_columns: {},

  group_by: [],

  filters_columns: [
    {
      dsc: 'Nombre',
      key: 'name',
      default: true,
    },
    {
      dsc: 'Nombre completo',
      key: 'full_name',
      default: false,
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

export default IndustriesConfig
