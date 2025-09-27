import {
  FrmMiddle,
  FrmMiddleRight,
  FrmPhoto,
  FrmTab0,
  FrmTab1,
  FrmTab2,
  FrmTab3,
  FrmTitle,
  Subtitle,
  TopTitle,
} from './configView'
import { FormConfig, ModulesEnum } from '@/shared/shared.types'
import { ActionTypeEnum, ViewTypeEnum } from '@/shared/shared.types'
import { ContactOptionEnum } from '@/modules/contacts/contacts.types'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'

const ContactIndexConfig: FormConfig = {
  fnc_name: 'fnc_partner',
  title: 'Contactos',
  dsc: 'Contactos',
  module: ModulesEnum.CONTACTS,
  module_url: '/contacts',
  dsc_view: 'full_name',
  views: [ViewTypeEnum.KANBAN, ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.KANBAN,
  item_url: '/contacts',
  new_url: '/contacts/new',
  no_content_title: 'Crear un contacto en su libreta de direcciones',
  no_content_dsc:
    'S7 le ayuda a llevar seguimiento de todas las actividades relacionadas con sus contactos.',
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

  fnc_valid: (data: any, formItem: any) => {
    if (!data?.name) return null
    data.bank_accounts = (data?.bank_accounts || []).map((elem: any, index: number) => ({
      ...elem,
      order_id: index + 1,
    }))
    const areSameTags =
      JSON.stringify((formItem?.categories || []).map((tag: any) => tag.label)) !==
      JSON.stringify((data?.categories || []).map((tag: any) => tag.label))
    data.categories_change = areSameTags
    data.group_id = formItem?.group_id || null
    if (data['type'] === 'C') {
      data['parent_id'] = null
    }
    //data.address_type===ContactOption.ADD_CONTACT
    if (data.address_type === ContactOptionEnum.ADD_CONTACT || data.address_type === '1') {
      if (!data['name']) return null
    }
    if (data.contacts && data.contacts.length) {
      const isString = (value: any) => typeof value.partner_id === 'string'
      const addProps = {
        action: ActionTypeEnum.INSERT,
        type: 'I',
        company_id: formItem.company_id,
        group_id: null,
        contacts: [],
        state: 'A',
        parent_id: formItem.parent_id,
      }
      const newListContact = data.contacts.map((contact: any) =>
        isString(contact) ? { ...contact, ...addProps } : contact
      )
      //const files = data.files
      return { ...data, contacts: newListContact }
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

  formButtons: [],

  grid: {
    idRow: 'partner_id',
    col_name: 'full_name',
    isDragable: false,

    list: {
      columns: [
        {
          header: 'Nombre',
          accessorKey: 'full_name',
          align: 'left',
          size: 400,
        },
        {
          header: 'Móvil',
          accessorKey: 'mobile',
          size: 180,
          align: 'left',
        },
        {
          header: 'Correo electrónico',
          accessorKey: 'email',
          size: 350,
          align: 'left',
        },
        {
          header: 'Departamento',
          accessorKey: 'ln2_name',
          size: 200,
        },
        {
          header: 'País',
          accessorKey: 'ln1_name',
          size: 120,
          cell: (props: any) => <div className="text-cyan-600">{props.getValue()}</div>,
        },
        {
          header: 'Compañía',
          accessorKey: 'company_name',
          size: 210,
        },
      ],
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

  group_by: [
    {
      list: [
        {
          title: 'Tipo',
          key: 'type_description',
          key_gby: 'type',
        },
        {
          title: 'País',
          key: 'ln1_name',
          key_gby: 'ln1_id',
        },
        {
          title: 'Tipo de registro',
          key: 'address_type',
          key_gby: 'address_type',
        },
      ],
    },
  ],

  filters_columns: [
    {
      dsc: 'Nombre',
      key: 'name',
      default: true,
    },
    {
      dsc: 'Empresa relacionada',
      key: 'parent_name',
      default: false,
    },
    {
      dsc: 'Correo electrónico',
      key: 'email',
      default: false,
    },
    {
      dsc: 'Teléfono/Celular',
      key: 'phone__mobile',
      default: false,
    },
    {
      dsc: 'Etiqueta',
      key: 'category_name',
      default: false,
    },
  ],

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

    frm_photo: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmPhoto
        watch={watch}
        control={control}
        setValue={setValue}
        errors={errors}
        editConfig={editConfig}
      />
    ),
    frm_top_title: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <TopTitle
        watch={watch}
        control={control}
        errors={errors}
        setValue={setValue}
        editConfig={editConfig}
      />
    ),
    frm_title: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmTitle
        control={control}
        errors={errors}
        setValue={setValue}
        editConfig={editConfig}
        watch={watch}
      />
    ),
    frm_sub_title: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <Subtitle
        control={control}
        errors={errors}
        fnc_name={'fnc_partner'}
        watch={watch}
        setValue={setValue}
        editConfig={editConfig}
      />
    ),
    frm_middle: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmMiddle
        setValue={setValue}
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
      />
    ),
    frm_middle_right: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmMiddleRight
        setValue={setValue}
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
      />
    ),

    tabs: [
      {
        name: 'Contactos y direcciones',
        content: ({ watch, setValue }) => <FrmTab0 watch={watch} setValue={setValue} />,
      },
      {
        name: 'Venta y compra',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab1
            watch={watch}
            control={control}
            setValue={setValue}
            errors={errors}
            editConfig={editConfig}
          />
        ),
      },
      {
        name: 'Facturación / Contabilidad',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => {
          return (
            <FrmTab2
              watch={watch}
              control={control}
              setValue={setValue}
              errors={errors}
              editConfig={editConfig}
              fnc_name={'fnc_partner'}
            />
          )
        },
      },

      {
        name: 'Notas internas',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab3
            watch={watch}
            control={control}
            setValue={setValue}
            errors={errors}
            editConfig={editConfig}
          />
        ),
      },
    ],
  },
}

export default ContactIndexConfig
