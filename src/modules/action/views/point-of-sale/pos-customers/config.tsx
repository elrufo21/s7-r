import { ViewTypeEnum } from '@/shared/shared.types'
import {
  FrmMiddle,
  FrmMiddleRight,
  FrmPhoto,
  FrmTab0,
  FrmTab1,
  FrmTab3,
  FrmTitle,
  Subtitle,
  TopTitle,
} from '@/modules/contacts/views/contact-index/configView'
import { FormConfig, ModulesEnum } from '@/shared/shared.types'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'
import { ContactOptionEnum } from '@/modules/contacts/contacts.types'

const PosPaymentConfig: FormConfig = {
  fnc_name: 'fnc_partner',
  title: 'Clientes',
  dsc: 'Clientes',
  dsc_view: 'name',
  module: ModulesEnum.POINTS_OF_SALE,
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '/action/895',
  item_url: '/action/895/detail',
  new_url: '/action/895/detail/new',
  // isFavoriteColumn: false,
  no_content_title: 'No se encontraron clientes',
  no_content_dsc: 'Inicie una nueva sesión para registrar nuevos clientes.',
  ribbonList: {
    field: 'state',
    ribbonList: [
      {
        label: 'ARCHIVADO',
        state: StatusContactEnum.ARCHIVE,
        className: 'ribbon ',
      },
    ],
    getLabelFromData: (_, data) => data?.state_description,
  },
  fnc_valid: (data) => {
    if (!data['name']) {
      return null
    }
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
    ln1_id: null,
    ln2_id: null,
    ln3_id: null,
    ln4_id: null,
    zip: '',
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
  grid: {
    idRow: 'partner_id',
    col_name: 'name',
    idRow_db: 'con.partner_id',
    kanban: {
      box: {
        id: 'partner_id',
        // fav: 'fav',
        image: 'files',
        title: 'name',
        subtitle: 'name_rel',
        desc1: 'location_sl2_name__location_country_name',
        desc2: 'email',
      },
    },
    list: {
      columns: [
        {
          header: 'Nombres',
          accessorKey: 'name',
        },
        {
          header: 'Móvil',
          accessorKey: 'mobile',
          size: 250,
        },
        {
          header: 'Correo electrónico',
          accessorKey: 'email',
          size: 500,
        },
        {
          header: 'Ciudad',
          accessorKey: 'location_sl1_id',
          size: 150,
        },

        {
          header: 'País',
          accessorKey: 'location_country_id',
          size: 100,
        },
      ],
    },
  },

  visibility_columns: {},

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
    imagenFields: ['files'],
    auditoria: true,
    frm_photo: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmPhoto
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
      />
    ),
    frm_top_title: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <TopTitle
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
      />
    ),
    frm_title: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmTitle
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
      />
    ),
    frm_sub_title: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <Subtitle
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
        fnc_name={'fnc_partner'}
      />
    ),
    frm_middle: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmMiddle
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
      />
    ),
    frm_middle_right: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmMiddleRight
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
      />
    ),

    tabs: [
      {
        name: 'Contactos y direcciones',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab0
            watch={watch}
            control={control}
            errors={errors}
            editConfig={editConfig}
            setValue={setValue}
          />
        ),
      },
      {
        name: 'Venta y compra',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab1
            watch={watch}
            control={control}
            errors={errors}
            editConfig={editConfig}
            setValue={setValue}
          />
        ),
      },
      {
        name: 'Facturación / Contabilidad',
        // content:()=>(<h2>content3</h2>),
      },
      {
        name: 'Notas Internas',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab3
            watch={watch}
            control={control}
            errors={errors}
            editConfig={editConfig}
            setValue={setValue}
          />
        ),
      },
    ],
  },
}

export default PosPaymentConfig
