import { ActionTypeEnum, FormConfig, ModulesEnum } from '@/shared/shared.types'
import { Row } from '@tanstack/react-table'
import { ViewTypeEnum } from '@/shared/shared.types'
import { FrmMiddle, FrmTab0, FrmTab1, FrmTab2, FrmTab3 } from './configView'
import { Frm_bar_buttons } from './components/Frm_bar_buttons'
import { TypeStateOrder } from '@/modules/pos/types'
import { formatPlain } from '@/shared/utils/dateUtils'

interface PosOrderData {
  order_id: number
  group_id: number
  company_id: number
  copy_id: number
  copied_id: number
  parent_id: number
  state: string
  state_description: string
  creation_user: string
  creation_date: Date
  modification_user: string
  modification_date: Date
  name: string
  partner_id: string
  order_date: Date
  session_id: string
  currency_id: string
  pos_reference: string
  order_number: string
  general_customer_note: string
  amount_untaxed: number
  amount_tax: number
  amount_withtaxed: number
  amount_payment: number
  amount_residual: number
  session_name?: string
  point_name?: string
  receipt_number?: string
  order_sequence_ft?: string
  partner_name?: string
  user_name?: string
  amount_withtaxed_currency?: string
  invoice_state?: string
  invoice_state_description?: string
}

const PosOrderConfig: FormConfig = {
  fnc_name: 'fnc_pos_order',
  title: 'Órdenes',
  dsc: 'Órdenes',
  module: ModulesEnum.POINTS_OF_SALE,
  module_url: '/action/888',
  dsc_view: 'receipt_number',
  views: [ViewTypeEnum.KANBAN, ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  item_url: '/action/888/detail',
  new_url: '',
  no_content_title: 'No se encontraron órdenes',
  no_content_dsc: 'Inicie una nueva sesión para registrar nuevas órdenes.',
  filters_columns: [],
  visibility_columns: {},
  ribbonList: [
    {
      label: 'En progreso',
      state: TypeStateOrder.IN_PROGRESS,
      className: 'ribbon-simple bg-yellow-500',
    },
    {
      label: 'PAGADO',
      state: 'RPF',
      className: 'ribbon-simple',
    },
    {
      label: 'PAGADO PARCIAL',
      state: 'RPP',
      className: 'ribbon-simple bg-yellow-500',
    },
    {
      label: 'PAGO PENDIENTE',
      state: 'RPE',
      className: 'ribbon-simple bg-yellow-500',
    },
    {
      label: 'PAGO',
      state: TypeStateOrder.PAY,
      className: 'ribbon-simple bg-yellow-500',
    },
  ],
  fnc_valid: (data: any) => {
    const newData = data.lines.map((item: any, index: number) => {
      if (item.action === ActionTypeEnum.INSERT) {
        return {
          ...item,
          order_id: data.order_id,
          amount_tax: 0,
          position: index + 1,
          amount_withtaxed: item?.price_unit,
          amount_untaxed_total: item?.price_unit * item?.quantity,
          amount_tax_total: item?.price_unit * item?.quantity,
          amount_withtaxed_total: item?.price_unit * item?.quantity,
        }
      }

      return item
    })
    data.lines = newData
    data.lines = data?.lines.map((item: any, index: number) => ({
      ...item,
      position: index + 1,
    }))
    return data
  },

  default_values: {},
  formButtons: [],
  grid: {
    idRow: 'order_id',
    isDragable: false,
    col_name: 'partner_name',

    list: {
      columns: [
        /*
        {
          header: 'Ref. de la orden',
          size: 150,
          cell: ({ row }: { row: Row<PosOrderData> }) => <div>{row.original.name}</div>,
        },
        */
        {
          header: 'Número de recibo',
          size: 150,
          cell: ({ row }: { row: Row<PosOrderData> }) => <div>{row.original.receipt_number}</div>,
        },
        {
          header: 'Fecha',
          size: 120,
          cell: ({ row }: { row: Row<PosOrderData> }) => (
            <div>{row.original.order_date ? formatPlain(row.original.order_date) : ''}</div>
          ),
        },
        {
          header: 'Sesión',
          size: 120,
          cell: ({ row }: { row: Row<PosOrderData> }) => <div>{row.original.session_name}</div>,
        },
        /*
        {
          header: 'Punto de venta',
          size: 150,
          cell: ({ row }: { row: Row<PosOrderData> }) => <div>{row.original.point_name}</div>,
        },
        */
        /*
        {
          header: 'Número de orden',
          size: 150,
          cell: ({ row }: { row: Row<PosOrderData> }) => (
            <div>{row.original.order_sequence_ft}</div>
          ),
        },
        */
        {
          header: 'Cliente',
          size: 180,
          cell: ({ row }: { row: Row<PosOrderData> }) => <div>{row.original.partner_name}</div>,
        },
        {
          header: 'Cajero',
          size: 150,
          cell: ({ row }: { row: Row<PosOrderData> }) => <div>{row.original.user_name}</div>,
        },
        {
          header: 'Total',
          size: 120,
          meta: {
            textAlign: 'text-right',
            headerAlign: 'text-right',
          },
          cell: ({ row }: { row: Row<PosOrderData> }) => (
            <div>
              {row.original.amount_withtaxed_currency
                ? row.original.amount_withtaxed_currency
                : '0.00'}
            </div>
          ),
        },

        // {
        //   header: 'Estado',
        //   size: 100,
        //   cell: ({ row }: { row: Row<PosOrderData> }) => <div>{row.original.state}</div>,
        // },

        {
          header: 'Estado',
          size: 120,
          cell: ({ row }: { row: Row<PosOrderData> }) => {
            const state = row.original.state
            const defineClass = (state: string) => {
              // if (state === 'I') return 'text-bg-danger'
              if (state === 'I') return 'text-bg-warning'
              if (state === 'Y') return 'text-bg-warning'

              if (state === 'E') return 'text-bg-info'
              if (state === 'P') return 'text-bg-success'
              if (state === 'RPF') return 'text-bg-success'
              if (state === 'RPP') return 'text-bg-warning'
              if (state === 'RPE') return 'text-bg-warning'
              //if (state === 'C') return 'text-bg-danger'
              return ''
            }
            return (
              <div className={`chip_demo ${defineClass(state)}`}>
                {row.original.state_description}
              </div>
            )
          },
        },

        {
          header: 'Estado de la factura',
          size: 100,
          cell: ({ row }: { row: Row<PosOrderData> }) => {
            const invoice_state = row.original.invoice_state
            const defineClass = (state: string) => {
              if (state === 'P') return 'text-bg-warning'
              if (state === 'B') return 'text-bg-success'
              return ''
            }
            return (
              <div className={`chip_demo ${defineClass(invoice_state || '')}`}>
                {row.original.invoice_state_description}
              </div>
            )
          },
        },
      ],
    },
  },

  filters: [
    {
      list: [
        {
          group: '1',
          title: 'Mis facturas',
          key: '1.1',
          key_db: 'partner_id',
          value: 'partner_id',
          type: 'check',
        },
      ],
    },
    {
      list: [
        {
          group: 'state',
          title: 'Borrador',
          key: 'draft',
          key_db: 'state',
          value: 'B',
          type: 'check',
        },
        {
          group: 'state',
          title: 'Registrado',
          key: 'registered',
          key_db: 'state',
          value: 'R',
          type: 'check',
        },
        {
          group: 'state',
          title: 'Cancelado',
          key: 'cancelated',
          key_db: 'state',
          value: 'C',
          type: 'check',
        },
      ],
    },
    {
      list: [
        {
          group: '2',
          title: 'Sin enviar',
          key: '',
          key_db: '',
          value: '',
          type: 'check',
        },
      ],
    },
    {
      list: [
        {
          group: '',
          title: 'Facturas',
          key: '',
          key_db: '',
          value: '',
          type: '',
        },
        {
          group: '',
          title: 'Notas de credito',
          key: '',
          key_db: '',
          value: '',
          type: '',
        },
        {
          group: '',
          title: 'Notas de debito',
          key: '',
          key_db: '',
          value: '',
          type: '',
        },
      ],
    },
    {
      list: [
        {
          group: '',
          title: 'Por revisar',
          key: '',
          key_db: '',
          value: '',
          type: 'check',
        },
      ],
    },
    {
      list: [
        {
          group: '',
          title: 'Por pagar',
          key: '',
          key_db: '',
          value: '',
          type: '',
        },
        {
          group: '',
          title: 'En proceso de pago',
          key: '',
          key_db: '',
          value: '',
          type: '',
        },
        {
          group: '',
          title: 'Vencidas',
          key: '',
          key_db: '',
          value: '',
          type: '',
        },
      ],
    },
    {
      list: [
        {
          group: '',
          title: 'Fecha de facturas',
          key: '',
          key_db: '',
          value: '',
          type: '',
        },
        {
          group: '',
          title: 'Fecha de vencimiento',
          key: '',
          key_db: '',
          value: '',
          type: '',
        },
      ],
    },
  ],

  group_by: [
    {
      list: [
        {
          title: 'Vendedor',
          key: '',
          key_gby: '',
        },
        {
          title: 'Contacto',
          key: '',
          key_gby: '',
        },
        {
          title: 'Estado',
          key: 'state',
          key_gby: 'state',
        },
      ],
    },
    {
      list: [
        {
          title: 'Equipo de ventas',
          key: '',
          key_gby: '',
        },
        {
          title: 'Metodo de pago',
          key: '',
          key_gby: '',
        },
        {
          title: 'Diario',
          key: '',
          key_gby: '',
        },
        {
          title: 'Empresa',
          key: '',
          key_gby: '',
        },
      ],
    },
    {
      list: [
        {
          title: 'Fecha de factura ',
          key: '',
          key_gby: '',
        },
        {
          title: 'Fecha de vencimiento',
          key: '',
          key_gby: '',
        },
        {
          title: 'Fecha contable',
          key: '',
          key_gby: '',
        },
        {
          title: 'Tipo de documento',
          key: '',
          key_gby: '',
        },
      ],
    },
  ],

  configControls: {},

  statusBarConfig: {
    visibleStates: [
      { state: TypeStateOrder.REGISTERED, label: 'Registrado' },
      { state: TypeStateOrder.CANCELED, label: 'Cancelado' },
    ],
    defaultState: 'I',
  },

  form_inputs: {
    imagenFields: [],
    auditoria: true,
    frm_bar_buttons: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <Frm_bar_buttons
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
      />
    ),
    frm_middle: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmMiddle
        control={control}
        errors={errors}
        fnc_name={'fnc_partner'}
        setValue={setValue}
        editConfig={editConfig}
        watch={watch}
      />
    ),
    tabs: [
      {
        name: 'Productos',
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
        name: 'Pagos',
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
        name: 'Información adicional',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab2
            watch={watch}
            control={control}
            errors={errors}
            editConfig={editConfig}
            setValue={setValue}
          />
        ),
      },
      {
        name: 'Nota de cliente',
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

  fieldLabels: {
    journal_id: 'Diario',
    currency_id: 'Moneda',
    document_type_id: 'Tipo de Documento',
  },
}

export default PosOrderConfig
