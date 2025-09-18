import { ViewTypeEnum } from '@/shared/shared.types'
import { FormConfig, ModulesEnum } from '@/shared/shared.types'
import { FrmMiddle, FrmMiddleRight, FrmTitle } from './configView'

const BanksConfig: FormConfig = {
  fnc_name: 'fnc_location_n4',
  title: 'Distritos',
  dsc: 'Nombre',
  module: ModulesEnum.CONTACTS,
  dsc_view: 'name',
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  item_url: '/action/163/detail',
  new_url: '/action/163/detail/new',
  module_url: '/action/163',

  no_content_title: 'Crear un distrito en su directorio',
  no_content_dsc:
    'Odoo le ayuda a llevar fácilmente un seguimiento de todas las actividades relacionadas con sus contactos.',

  fnc_valid: (data) => {
    return data
  },

  default_values: {
    bank_id: 0,
    group_id: null,
    state: 'A',
    name: '',
    code_id: '',
    street: '',
    street_2: '',
    zip: '',
    phone: '',
    email: '',
  },

  grid: {
    idRow: 'bank_id',
    col_name: 'name',
    isDragable: false,

    list: {
      columns: [
        {
          header: 'Nombre',
          accessorKey: 'name',
          align: 'left',
        },
        {
          header: 'Provincia',
          accessorKey: 'ln3_name',
          size: 700,
        },
        {
          header: 'Departamento',
          accessorKey: 'ln2_name',
          size: 120,
        },
        {
          header: 'País',
          accessorKey: 'ln1_name',
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
  visibility_columns: {},

  group_by: [],

  filters_columns: [
    {
      dsc: 'Nombre',
      key: 'nom_ban',
      default: true,
    },
  ],

  configControls: {},

  form_inputs: {
    imagenFields: [],
    auditoria: false,

    frm_title: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmTitle
        setValue={setValue}
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
      />
    ),

    frm_middle: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmMiddle
        setValue={setValue}
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
      />
    ),

    frm_middle_right: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmMiddleRight
        setValue={setValue}
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
      />
    ),
  },
}

export default BanksConfig
