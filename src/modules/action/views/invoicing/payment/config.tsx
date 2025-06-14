import { ViewTypeEnum, FormConfig, ModulesEnum } from '@/shared/shared.types'
import { FrmMiddle, FrmMiddleRight, FrmTittle } from './configView'
import { Frm_bar_buttons } from './components/Frm_bar_buttons'
import { Frm_bar_status } from './components/Frm_bar_status'
import { Enum_Payment_State } from '@/modules/invoicing/invoice.types'
import { Row } from '@tanstack/react-table'
import { Data_Journal } from '@/shared/components/view-types/viewTypes.types'
import { Enum_Journal_State } from '@/modules/invoicing/invoice.types'

const PaymentTermsConfig: FormConfig = {
  fnc_name: 'fnc_payment',
  title: 'Pagos del cliente',
  dsc: 'Pago',
  dsc_view: 'name',
  module: ModulesEnum.INVOICING,
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '/action/742',
  item_url: '/action/742/detail',
  new_url: '/action/742/detail/new',
  isFavoriteColumn: false,
  // formTitle: '',

  fnc_valid: (data) => {
    /*
    if (!data['description']) {
      return null
    }
    */
    return data
  },

  default_values: {
    // payment_id: 0,
    name: null,
    payment_id: null,
    // group_id
    company_id: null,
    state: Enum_Payment_State.DRAFT,
    move_type: 'C',
    move_id: null,
    // description: '',
    description: null,
    payment_type: 'R',
    partner_id: null,
    amount: '0.00',
    currency_id: null, // agregar valor por defencto moneda selecionada para la empresa
    date: new Date(),
    memo: null,
    journal_id: null,
    payment_method_id: null,
    bank_account_id: null,
  },

  grid: {
    idRow: 'payment_id',
    col_name: 'name',
    list: {
      columns: [
        {
          header: 'Fecha',
          // className: '!w-auto text-left',
          cell: ({ row }: { row: Row<Data_Journal> }) => (
            <div
              className={`${row.original.state === Enum_Journal_State.DRAFT ? 'text-[#0180a5] font-normal' : ''}`}
            >
              {row.original.date}
            </div>
          ),
        },
        {
          header: 'Número',
          cell: ({ row }: { row: Row<Data_Journal> }) => (
            <div
              className={`${row.original.state === Enum_Journal_State.DRAFT ? 'text-[#0180a5] font-normal' : ''}`}
            >
              {row.original.name}
            </div>
          ),
        },
        {
          header: 'Diario',
          cell: ({ row }: { row: Row<Data_Journal> }) => (
            <div
              className={`${row.original.state === Enum_Journal_State.DRAFT ? 'text-[#0180a5] font-normal' : ''}`}
            >
              {row.original.journal_name}
            </div>
          ),
        },
        {
          header: 'Empresa',
          cell: ({ row }: { row: Row<Data_Journal> }) => (
            <div
              className={`${row.original.state === Enum_Journal_State.DRAFT ? 'text-[#0180a5] font-normal' : ''}`}
            >
              {row.original.company_name}
            </div>
          ),
        },
        {
          header: 'Método de pago',
          cell: ({ row }: { row: Row<Data_Journal> }) => (
            <div
              className={`${row.original.state === Enum_Journal_State.DRAFT ? 'text-[#0180a5] font-normal' : ''}`}
            >
              {row.original.payment_method_name}
            </div>
          ),
        },

        {
          header: 'Cliente',
          cell: ({ row }: { row: Row<Data_Journal> }) => (
            <div
              className={`${row.original.state === Enum_Journal_State.DRAFT ? 'text-[#0180a5] font-normal' : ''}`}
            >
              {row.original.partner_name}
            </div>
          ),
        },
        {
          header: 'Importe',
          meta: {
            textAlign: 'text-right',
            headerAlign: 'text-right',
          },
          /*
          cell: ({ row }: { row: any }) => (
            <div className="font-semibold">
              S/&nbsp;{Number.parseFloat(row.original.amount).toFixed(2)}
            </div>
          ),
          */
          cell: ({ row }: { row: Row<Data_Journal> }) => (
            <div
              className={`${row.original.state === Enum_Journal_State.DRAFT ? 'text-[#0180a5] font-normal' : ''}`}
            >
              {row.original.amount_in_currency}
            </div>
          ),
        },
        {
          header: 'Moneda',
          cell: ({ row }: { row: Row<Data_Journal> }) => (
            <div
              className={`${row.original.state === Enum_Journal_State.DRAFT ? 'text-[#0180a5] font-normal' : ''}`}
            >
              {row.original.currency_name}
            </div>
          ),
        },
        {
          header: 'Estado',
          size: 90,
          cell: ({ row }: { row: Row<Data_Journal> }) => {
            const state = row.original.state
            const defineClass = (state: string) => {
              if (state === Enum_Journal_State.DRAFT) return 'text-bg-info'
              if (state === Enum_Journal_State.IN_PROCESS) return 'text-bg-warning'
              if (state === Enum_Journal_State.PAID) return 'text-bg-success'
              if (state === Enum_Journal_State.REFUSED) return 'text-bg-success'
              return ''
            }
            return (
              <div className={`chip_demo ${defineClass(state)}`}>
                {row.original.state_description}
              </div>
            )
          },
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
    frm_bar_buttons: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <Frm_bar_buttons
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
      />
    ),
    frm_bar_status: () => <Frm_bar_status />,
    frm_title: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmTittle
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
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
  },
}

export default PaymentTermsConfig
