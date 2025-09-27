import { ViewTypeEnum } from '@/shared/shared.types'
import { FormConfig, ModulesEnum } from '@/shared/shared.types'
import { FrmMiddle } from './configView'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'

const ContactTitlesConfig: FormConfig = {
  fnc_name: 'fnc_cia_ct_cti',
  title: 'Títulos de contacto',
  dsc: 'Título de contacto',
  module: ModulesEnum.CONTACTS,
  dsc_view: 'title_name',
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  item_url: '/action/102/detail',
  new_url: '/action/102/detail/new',
  module_url: '/action/102',

  no_content_title: 'Crear un título',
  no_content_dsc:
    'Administre los nombres de contacto así como sus abreviaciones (p. ej. "Sr." "Sra.", etc).',
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
    if (!data['title_name']) {
      return null
    }
    return data
  },

  default_values: {
    tittle_id: null,
    name: '',
    abbreviation: '',
  },

  grid: {
    idRow: 'title_id',
    col_name: 'name',
    isDragable: false,

    list: {
      columns: [
        {
          header: 'Título',
          accessorKey: 'name',
          align: 'left',
        },
        {
          header: 'Abreviatura',
          accessorKey: 'abbreviation',
          size: 400,
          align: 'left',
        },
      ],
    },
  },
  visibility_columns: {},

  filters: [],
  group_by: [],

  filters_columns: [
    {
      dsc: 'Título',
      key: 'title_name',
      default: true,
    },
  ],

  configControls: {},

  form_inputs: {
    imagenFields: [],
    auditoria: false,
    frm_middle: ({ control, errors, watch, setValue, editConfig = {} }) => (
      <FrmMiddle
        setValue={setValue}
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
      />
    ),
  },
}

export default ContactTitlesConfig
