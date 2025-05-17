import { FormConfig, ModulesEnum } from '@/shared/shared.types'
import { ViewTypeEnum } from '@/shared/shared.types'

const InvoiceIndexConfig: FormConfig = {
  fnc_name: '',
  title: 'Inventario',
  dsc: 'Resumen de inventario',
  module: ModulesEnum.INVENTORY,
  module_url: '/inventory',
  dsc_view: 'name',
  views: [ViewTypeEnum.KANBAN, ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  item_url: '/inventory',
  new_url: '/inventory/new',
  filters_columns: [],
  visibility_columns: {},

  fnc_valid: (data) => {
    return data
  },

  default_values: {},

  grid: {
    idRow: 'inventory_id',
    list: {
      columns: [],
    },
  },

  filters: [],

  group_by: [],

  configControls: {},

  form_inputs: { imagenFields: [], auditoria: false },
}

export default InvoiceIndexConfig
