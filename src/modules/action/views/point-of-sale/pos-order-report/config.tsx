import { ViewTypeEnum, FormConfig, ModulesEnum, ItemStatusTypeEnum } from '@/shared/shared.types'

const PosPaymentConfig: FormConfig = {
  fnc_name: 'fnc_analitics_pos_order',
  title: 'Análisis de órdenes',
  dsc: 'Análisis de órdenes',
  dsc_view: 'name',
  module: ModulesEnum.POINTS_OF_SALE,
  views: [ViewTypeEnum.LIBRE],
  view_default: ViewTypeEnum.LIBRE,
  module_url: '/action/893',
  item_url: '',
  new_url: '',
  isFavoriteColumn: false,

  fnc_valid: (data) => {
    if (!data['name']) {
      return null
    }
    return data
  },

  default_values: {
    payment_term_id: null,
    group_id: null,
    company_id: null,
    state: ItemStatusTypeEnum.ACTIVE,
    name: '',
  },
  grid: {
    idRow: 'order_id',
    col_name: 'order_id',
    /**
     * 
    kanban: {
      box: {
        id: "payment_term_id",
        // fav: 'fav',
        //   image: "files",
        title: "name",
        //   subtitle: "name_rel",
        //   desc1: "location_sl2_name__location_country_name",
        //   desc2: "email",
      },
    },
     */
    list: {
      columns: [
        {
          header: 'Método',
          accessorKey: 'name',
          className: '!w-auto text-left',
        },
        {
          header: 'Diario	',
          accessorKey: 'journal_name',
          className: '!w-auto text-left',
        },
        {
          header: 'Empresa',
          accessorKey: 'company_name',
          className: '!w-auto text-left',
        },
        {
          header: 'Punto de venta',
          accessorKey: 'pos_name',
          className: '!w-auto text-left',
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
      dsc: 'Metodos de pago',
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

export default PosPaymentConfig
