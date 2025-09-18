import { ViewTypeEnum } from '@/shared/shared.types'
import { FormConfig, ModulesEnum } from '@/shared/shared.types'

const IdentificationTypeConfig: FormConfig = {
  fnc_name: 'fnc_partner_identification_type',
  title: 'Tipo de Identificación',
  dsc: 'Tipo de Identificación',
  module: ModulesEnum.CONTACTS,
  dsc_view: 'name',
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  item_url: null,
  new_url: null,
  module_url: '/action/111',
  no_content_title: '',
  no_content_dsc: '',

  fnc_valid: (data) => {
    if (!data['name']) {
      return null
    }
    return data
  },

  default_values: {
    state: '',
    name: '',
    description: null,
    ln1_id: null,
    is_identification_fiscal: false,
    code: null,
  },

  grid: {
    idRow: 'identification_type_id',
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
          header: 'Descripción',
          accessorKey: 'description',
          size: 350,
        },
        {
          header: 'País',
          accessorKey: 'ln1_name',
          size: 120,
        },

        {
          header: 'Activo',
          accessorKey: 'state',
          size: 100,
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
      dsc: 'Nombre',
      key: 'name',
      default: true,
    },
    {
      dsc: 'Descripción',
      key: 'description',
      default: false,
    },
    {
      dsc: 'País',
      key: 'country',
      default: false,
    },
  ],

  configControls: {},

  form_inputs: {
    imagenFields: [],
    auditoria: false,
  },

  /*
    form_inputs: {
      imagenFields: [],
      auditoria: true,
  
      frm_title: (control, errors, editConfig = {}) => (
        <FrmTitle control={control} errors={errors} editConfig={editConfig} />
      ),
  
      frm_middle: (control, errors, watch, setValues, editConfig = {}) => (
        <FrmMiddle
          setValues={setValues}
          watch={watch}
          control={control}
          
          errors={errors}
          editConfig={editConfig}
        />
      ),
      frm_middle_right: (control, errors, setValues, watch, editConfig) => (
        <FrmMiddleRight
          setValues={setValues}
          watch={watch}
          control={control}
          
          errors={errors}
          editConfig={editConfig}
        />
      ),
    },
    */
}

export default IdentificationTypeConfig
