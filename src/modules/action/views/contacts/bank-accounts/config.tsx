import { ItemStatusTypeEnum, ViewTypeEnum } from '@/shared/shared.types'
import { FormConfig, ModulesEnum } from '@/shared/shared.types'
import { FrmMiddle, FrmMiddleBottom, FrmMiddleRight, FrmTitle } from './configView'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'

const BankAccountsConfig: FormConfig = {
  fnc_name: 'fnc_partner_bank_accounts',
  title: 'Cuentas bancarias',
  dsc: 'Número de cuenta',
  module: ModulesEnum.CONTACTS,
  dsc_view: 'number',
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  item_url: '/action/110/detail',
  new_url: '/action/110/detail/new',
  module_url: '/action/110',

  no_content_title: 'Crear una cuenta bancaria',
  no_content_dsc:
    'Desde aquí puede administrar todas las cuentas bancarias que están vinculadas a usted y a sus contactos.',
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
    if (!data['number']) {
      return null
    }
    return data
  },

  default_values: {
    bank_account_id: null,
    company_id: null,
    group_id: null,
    state: ItemStatusTypeEnum.ACTIVE,
    number: '',
    bank_id: null,
    partner_id: null,
    currency_id: null,
  },

  grid: {
    idRow: 'bank_account_id',
    col_name: 'number',
    isDragable: true,

    list: {
      columns: [
        {
          header: 'Número de cuenta',
          accessorKey: 'number',
          align: 'left',
        },
        {
          header: 'Titular de la cuenta',
          accessorKey: 'partner_name',
          size: 300,
        },
        {
          header: 'Banco',
          accessorKey: 'bank_name',
          size: 350,
        },
        {
          header: 'Empresa',
          accessorKey: 'company_name',
          size: 270,
        },
      ],
    },
  },

  filters: [
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

  visibility_columns: {},

  group_by: [],

  filters_columns: [
    {
      dsc: 'Nombre del banco',
      key: 'bank_name',
      default: true,
    },
    {
      dsc: 'Titular de la cuenta',
      key: 'partner_name',
      default: false,
    },
    {
      dsc: 'Número de cuenta',
      key: 'number',
      default: false,
    },
  ],

  configControls: {},

  form_inputs: {
    imagenFields: [],
    auditoria: true,

    frm_title: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmTitle
        setValue={setValue}
        watch={watch}
        control={control}
        errors={errors}
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
    frm_middle_bottom: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmMiddleBottom
        setValue={setValue}
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
      />
    ),
  },
}

export default BankAccountsConfig
