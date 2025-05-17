import { FormConfig, ModulesEnum } from '@/shared/shared.types'
import { ViewTypeEnum } from '@/shared/shared.types'
import { ContactOptionEnum } from '@/modules/contacts/contacts.types'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'

const ContactIndexConfig: FormConfig = {
  fnc_name: 'fnc_partner',
  title: 'Configuracion',
  dsc: 'Configuracion',
  module: ModulesEnum.SETTINGS,
  module_url: '/settings',
  dsc_view: 'full_name',
  views: [ViewTypeEnum.KANBAN, ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.KANBAN,
  item_url: '/settings',
  new_url: '/settings/new',
  no_content_dsc: 'Crea un contacto en tu libreta de direcciones',

  fnc_valid: (data: any) => {
    return data
  },

  default_values: {
    company_id: 0,
    state: StatusContactEnum.UNARCHIVE,
    type: 'C',
    name: '',
    full_name: 'Nuevo',
    files: [],
    identification_type_id: null,
    identification_number: '',
    parent_id: null,
    address_type: ContactOptionEnum.ADD_CONTACT,
    street: '',
    street_2: '',
    location_sl1_id: null,
    location_sl2_id: null,
    location_sl3_id: null,
    zip: '',
    location_country_id: null,
    workstation: '',
    phone: '',
    mobile: '',
    email: '',
    website: '',
    title_id: null,
    categories: [],
    contacts: [],
    customer_payment_term_id: null,
    price_list_id: null,
    supplier_payment_term_id: null,
    barcode: '',
    fiscal_position_id: null,
    reference: '',
    industry_id: null,
    internal_notes: '',
    sw_categories: false,
    group_id: null,
  },

  grid: {
    idRow: 'partner_id',
    col_name: 'full_name',
    isDragable: false,

    list: {
      columns: [],
    },
  },

  visibility_columns: {},

  filters: [
    {
      list: [
        {
          group: '1',
          title: 'Personas',
          key: '1.1',
          key_db: 'type',
          value: 'I',
          type: 'check',
        },
        {
          group: '1',
          title: 'Empresas',
          key: '1.2',
          key_db: 'type',
          value: 'C',
          type: 'check',
        },
      ],
    },
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

  group_by: [],

  filters_columns: [],

  configControls: {
    // type:{
    //   hb_e: false
    // },
    // partner_id_rel: {
    //   hb_e: false
    // },
    // name: {
    //   hb_e: false
    // },
    // identification_number: {
    //   hb_e: false
    // },
    // phone: {
    //   hb_e: false
    // },
    // files:{
    //   hb_n: false
    // }
  },

  form_inputs: {
    imagenFields: ['files'],
    auditoria: true,
    preserveTagPlaceholder: false,
  },
}

export default ContactIndexConfig
