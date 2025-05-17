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

const CustomersConfig: FormConfig = {
  fnc_name: 'fnc_partner',
  title: 'Contactos',
  dsc: 'Contactos',
  module: ModulesEnum.INVOICING,
  module_url: '/action/605',
  dsc_view: 'full_name',
  views: [ViewTypeEnum.KANBAN, ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.KANBAN,
  item_url: '/action/605/detail',
  new_url: '/action/605/detail/new',
  no_content_dsc: 'Crea un cliente en tu libreta de direcciones',

  fnc_valid: (data) => {
    //default: (data)=>{return data}
    if (data['type'] === 'C') {
      data['partner_id_rel'] = null
    }
    if (!data['name']) {
      return null
    }
    return data
  },

  default_values: {
    // partner_id: null,
    type: 'C',
    // type_description: "",
    name: '',
    identification_type_id: null,
    identification_number: '',
    partner_id_rel: null,
    //type: "1",
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
    notas_int: '',
    customer_payment_term_id: null,
    id_tfa: null,
    supplier_payment_term_id: null,
    files: null,
  },
  filters_columns: [],
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
          default: true,
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
        content: ({ watch }) => <FrmTab0 watch={watch} />,
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

export default CustomersConfig
