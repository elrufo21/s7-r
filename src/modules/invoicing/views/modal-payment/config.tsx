import { ViewTypeEnum, FormConfig, ModulesEnum } from '@/shared/shared.types'
import {
  FrmMiddle,
  FrmMiddleRight,
  FrmTittle,
} from '@/modules/action/views/invoicing/payment/configView'

const PaymentTermsConfig: FormConfig = {
  fnc_name: 'fnc_document_type',
  title: 'Pagos del cliente',
  dsc: 'Pagos del cliente',
  dsc_view: 'name',
  module: ModulesEnum.INVOICING,
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '',
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

  default_values: {
    date: '',
    name: '',
    payment_method: '',
    customer: '',
    import: '',
    state: '',
  },
  grid: {
    idRow: 'payment_id',
    col_name: 'name',
    list: {
      columns: [
        {
          header: 'Fecha',
          accessorKey: 'date',
          className: '!w-auto text-left',
        },
        {
          header: 'Númeno',
          accessorKey: 'name',
          className: '!w-auto text-left',
        },
        {
          header: 'Método de pago',
          accessorKey: 'payment_method',
          className: '!w-auto text-left',
        },
        {
          header: 'Cliente',
          accessorKey: 'customer',
          className: '!w-auto text-left',
        },
        {
          header: 'Importe',
          accessorKey: 'import',
          className: '!w-auto text-left',
        },
        {
          header: 'Estado',
          accessorKey: 'state',
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
    frm_title: () => <FrmTittle />,
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
  },
}

export default PaymentTermsConfig
