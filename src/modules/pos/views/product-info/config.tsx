import { FrmMiddle, FrmTitle } from './configView'
import { FormConfig, ModulesEnum } from '@/shared/shared.types'
import { ViewTypeEnum } from '@/shared/shared.types'

const ProductInfo: FormConfig = {
  fnc_name: '',
  title: 'Inventario',
  dsc: 'Inventario',
  module: ModulesEnum.CONTACTS,
  module_url: '/',
  dsc_view: 'full_name',
  views: [ViewTypeEnum.KANBAN, ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.KANBAN,
  item_url: '',
  new_url: '',
  no_content_dsc: '',

  fnc_valid: () => {},

  default_values: {},

  grid: {
    idRow: 'partner_id',
    col_name: 'full_name',
    isDragable: false,
  },

  visibility_columns: {},

  filters: [],

  group_by: [],

  filters_columns: [],

  configControls: {},

  form_inputs: {
    imagenFields: ['files'],
    auditoria: false,
    preserveTagPlaceholder: false,
    frm_title: ({ watch, control, errors, editConfig = {}, setValue }) =>
      FrmTitle({ watch, control, errors, editConfig, setValue }),
    frm_middle: ({ watch, control, errors, editConfig = {}, setValue }) =>
      FrmMiddle({ watch, control, errors, editConfig, setValue }),
    frm_middle_right: ({ watch, control, errors, editConfig = {}, setValue }) =>
      FrmMiddle({ watch, control, errors, editConfig, setValue }),
  },
}

export default ProductInfo
