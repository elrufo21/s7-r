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
} from '@/modules/contacts/views/contact-index/configView'
import { FormConfig, ModulesEnum } from '@/shared/shared.types'
import { ActionTypeEnum, ConfigType, ViewTypeEnum } from '@/shared/shared.types'
import { FrmTabAddContact } from '@/modules/contacts/components/FrmTabAddContact'
import { FrmTabAddBankAccount } from '../../components/FrmTabAddBankAccount'
const topTitleOptions = [
  { label: 'Individual', value: 'I' },
  { label: 'Compañía', value: 'C' },
]
const ModalContactIndexConfig: FormConfig = {
  title: 'Contactos',
  type_config: ConfigType.MODAL,
  dsc: 'Contactos',
  module: ModulesEnum.CONTACTS,
  views: [ViewTypeEnum.KANBAN, ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.KANBAN,
  new_url: '',
  dsc_view: '',
  item_url: '',
  module_url: '',
  visibility_columns: {},

  fnc_name: 'fnc_partner',
  fnc_valid: (data) => {
    if (data['type'] === 'C') {
      data['partner_id_rel'] = null
    }
    if (!data['name']) {
      return null
    }
    if (data.list_contacts && data.list_contacts.length) {
      const isString = (value: { partner_id: string | number }) =>
        typeof value.partner_id === 'string'
      const addProps = {
        accion: ActionTypeEnum.INSERT,
        type: 'I',
        company_id: data.company_id,
      }
      const newListContact = data.list_contacts.map((contact: any) =>
        isString(contact) ? { ...contact, ...addProps } : contact
      )
      return { ...data, list_contacts: newListContact }
    }
    return data
  },

  default_values: {
    company_id: null,
    state: 'A',
    type: 'C',
    name: '',
    files: null,
    identification_type_id: null,
    identification_number: '',
    partner_id_rel: null,
    address_type: 'AD',
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
    list_contacts: [],
    customer_payment_term_id: null,
    price_list_id: null,
    supplier_payment_term_id: null,
    barcode: '',
    fiscal_position_id: null,
    reference: '',
    industry_id: null,
    internal_notes: '',
  },
  grid: {
    idRow: 'partner_id',
    col_name: 'name',
    idRow_db: 'con.partner_id',
    kanban: {
      box: {
        fnc: 'fnc_partner',
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
          header: 'Nombre',
          accessorKey: 'name',
          align: 'left',
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
          accessorKey: 'location_sl3_name',
          size: 200,
        },
        {
          header: 'País',
          accessorKey: 'location_country_name',
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
  configControls: {},

  form_inputs: {
    imagenFields: ['files'],
    auditoria: true,
    frm_photo: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmPhoto
        control={control}
        errors={errors}
        setValue={setValue}
        editConfig={editConfig}
        watch={watch}
      />
    ),
    frm_top_title: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <TopTitle
        watch={watch}
        control={control}
        errors={errors}
        setValue={setValue}
        editConfig={editConfig}
        options={topTitleOptions}
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
        content: ({ watch, type_config, idDialog, setValue }) => {
          if (type_config === ConfigType.MODAL)
            return <FrmTabAddContact watch={watch} idDialog={idDialog} setValue={setValue} />
          return <FrmTab0 watch={watch} setValue={setValue} />
        },
      },
      {
        name: 'Venta y compra',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => {
          return (
            <FrmTab1
              watch={watch}
              control={control}
              errors={errors}
              editConfig={editConfig}
              setValue={setValue}
            />
          )
        },
      },
      {
        name: 'Facturación / Contabilidad',
        content: ({ watch, control, errors, editConfig = {}, setValue, type_config, idDialog }) => {
          if (type_config === ConfigType.MODAL)
            return (
              <FrmTabAddBankAccount
                fnc_name={'fnc_partner'}
                watch={watch}
                idDialog={idDialog}
                setValue={setValue}
              />
            )
          return (
            <FrmTab2
              watch={watch}
              control={control}
              errors={errors}
              editConfig={editConfig}
              setValue={setValue}
            />
          )
        },
      },
      {
        name: 'Notas Internas',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab3
            control={control}
            errors={errors}
            editConfig={editConfig}
            setValue={setValue}
            watch={watch}
          />
        ),
      },
    ],
  },
}

export default ModalContactIndexConfig
