import { FrmMiddle } from './configView'
import { FormConfig, ModulesEnum } from '@/shared/shared.types'
import { ViewTypeEnum } from '@/shared/shared.types'

const ContactIndexConfig: FormConfig = {
  fnc_name: '',
  title: '',
  dsc: '',
  module: ModulesEnum.CONTACTS,
  module_url: '',
  dsc_view: '',
  views: [ViewTypeEnum.KANBAN, ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.KANBAN,
  item_url: '',
  new_url: '',
  no_content_dsc: '',

  fnc_valid: () => {},

  default_values: {},

  grid: {
    idRow: '',
  },

  visibility_columns: {},

  filters: [],

  group_by: [],

  filters_columns: [],

  configControls: {},

  form_inputs: {
    imagenFields: ['files'],
    auditoria: true,
    preserveTagPlaceholder: false,
    frm_middle: ({ watch, control, errors, editConfig = {}, setValue }) => (
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

export default ContactIndexConfig
