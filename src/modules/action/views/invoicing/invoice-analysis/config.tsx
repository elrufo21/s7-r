import { ViewTypeEnum, FormConfig, ModulesEnum } from '@/shared/shared.types'

const PaymentTermsConfig: FormConfig = {
  fnc_name: 'fnc_invoice',
  title: 'Analisis de facturas',
  dsc: 'Analisis de factura',
  dsc_view: 'name',
  module: ModulesEnum.INVOICING,
  views: [ViewTypeEnum.LIBRE],
  view_default: ViewTypeEnum.LIBRE,
  module_url: '/action/667',
  item_url: '',
  new_url: '',
  isFavoriteColumn: false,
  formTitle: '',

  fnc_valid: (data) => {
    if (!data['name']) {
      return null
    }
    return data
  },

  default_values: {},
  grid: {
    idRow: 'journal_id',
    col_name: 'name',
  },

  visibility_columns: {},

  filters: [
    {
      list: [
        {
          group: '1',
          title: 'Favoritos',
          key: '1.1',
          key_db: 'type',
          value: 'I',
          type: 'check',
          default: true,
        },
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
      dsc: 'Términos de pago',
      key: 'name',
      default: true,
    },
  ],

  group_by: [
    {
      list: [
        {
          title: 'Empresa',
          key: 'company_name',
          key_gby: 'company_id',
        },
      ],
    },
  ],

  form_inputs: {
    imagenFields: [],
    auditoria: false,
  },
}

export default PaymentTermsConfig
