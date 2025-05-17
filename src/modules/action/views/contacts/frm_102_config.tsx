import { ViewTypeEnum } from '@/shared/shared.types'
import { FormConfig, ModulesEnum } from '@/shared/shared.types'
import { FrmPhoto, FrmTab0, FrmTitle } from './frm_102'

const Frm_102_config: FormConfig = {
  fnc_name: 'fnc_company',
  title: 'Empresas',
  module: ModulesEnum.SETTINGS,
  dsc: 'Nombre de la empresa',
  dsc_view: 'company_name',
  views: [ViewTypeEnum.KANBAN, ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  new_url: '',
  item_url: '',
  module_url: '',
  visibility_columns: {},

  fnc_valid: (data) => {
    if (!data['company_name']) {
      return null
    }
    return data
  },

  default_values: {
    partner_id: null,
    state: '',
    files: null,
    cod_tdir: '',
    nif: '',
    currency_id: null,

    company_name: '',

    street: '',
    street_2: '',
    location_sl1_id: null,
    location_sl2_id: null,
    location_sl3_id: null,
    zip: '',
    location_country_id: null,

    phone: '',
    mobile: '',
    email: '',
    website: '',
  },

  grid: {
    idRow: 'company_id',
    col_name: 'company_name',
    isDragable: true,

    list: {
      columns: [
        {
          header: 'Nombre de la compañía',
          accessorKey: 'company_name',
          align: 'left',
        },
        {
          header: 'Departamento',
          accessorKey: 'location_sl3_name',
          size: 200,
        },
        {
          header: 'País',
          accessorKey: 'location_country_name',
          size: 120,
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

  group_by: [],

  filters_columns: [
    {
      dsc: 'Nombre de la empresa',
      key: 'company_name',
      default: true,
    },
  ],

  configControls: {},

  form_inputs: {
    imagenFields: ['files'],
    auditoria: true,

    frm_photo: ({ control, errors, watch, setValue, editConfig = {} }) => (
      <FrmPhoto
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
      />
    ),

    frm_title: ({ control, errors, watch, setValue, editConfig = {} }) => (
      <FrmTitle
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
      />
    ),

    tabs: [
      {
        name: 'Información general',
        content: ({ control, errors, watch, setValue, editConfig = {} }) => (
          <FrmTab0
            watch={watch}
            control={control}
            errors={errors}
            setValue={setValue}
            editConfig={editConfig}
          />
        ),
      },
    ],
  },
}

export default Frm_102_config
