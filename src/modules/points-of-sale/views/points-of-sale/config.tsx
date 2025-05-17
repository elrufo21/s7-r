import { FormConfig, ModulesEnum } from '@/shared/shared.types'
import { ViewTypeEnum } from '@/shared/shared.types'

const PointsOfSaleConfig: FormConfig = {
  fnc_name: 'fnc_point_of_sale',
  title: 'Puntos de venta',
  dsc: 'Puntos de venta',
  module: ModulesEnum.POINTS_OF_SALE,
  module_url: '/points-of-sale',
  dsc_view: 'full_name',
  views: [ViewTypeEnum.KANBAN, ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.KANBAN,
  item_url: '/points-of-sale',
  new_url: '/points-of-sale/new',
  no_content_dsc: '',

  fnc_valid: (data: any) => {
    return data
  },

  default_values: {},

  grid: {
    idRow: '',
    col_name: '',
    isDragable: false,

    list: {
      columns: [],
    },
  },

  visibility_columns: {},

  filters: [],

  group_by: [],

  filters_columns: [],

  form_inputs: {
    imagenFields: ['files'],
    auditoria: true,
    preserveTagPlaceholder: false,
  },
}

export default PointsOfSaleConfig
