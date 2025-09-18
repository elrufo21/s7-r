import { FrmMiddle, FrmMiddleRight } from './configView'
import { FormConfig, ModulesEnum } from '@/shared/shared.types'
import { ViewTypeEnum } from '@/shared/shared.types'

const AccountBankConfig: FormConfig = {
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
  visibility_columns: {},

  fnc_valid: (data: any) => {
    return data
  },

  default_values: {
    bank_id: null,
    bank_account_id: null,
    company_id: null,
    partner_id: null,
    currency_id: null,
    state: '',
    company_name: '',
    name: '',
    currency_name: '',
    bank_name: '',
    number: '',
  },

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
          group: 'type',
          key: 'type_I',
          title: 'Personas',
          value: 'I',
          type: 'check',
        },
        {
          group: 'type',
          key: 'type_C',
          title: 'Empresas',
          value: 'C',
          type: 'check',
        },
      ],
    },
    {
      list: [
        {
          group: 'state',
          key: 'state_I',
          title: 'Archivado',
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
          key: 'location_country_name',
          key_gby: 'location_country_id',
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
      key: 'name_rel',
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
      key: 'name',
      default: false,
    },
  ],
  configControls: {
    company_id: {
      hb_e: true,
    },
  },

  form_inputs: {
    imagenFields: ['files'],
    auditoria: true,
    preserveTagPlaceholder: false,
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
  },
}

export default AccountBankConfig
