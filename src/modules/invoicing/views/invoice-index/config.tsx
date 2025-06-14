import { daysUntilDate, formatDateToDDMMYYYY } from '@/shared/utils/utils'
import { FrmMiddle, FrmMiddleRight, FrmTab1, FrmTab2, FrmTitle } from './configView'
import {
  MoveLine,
  StatusInvoiceEnum,
  InvoiceEnum_payment_state,
  InvoiceEnum_sent_state,
  InvoiceEnum_edi_state,
} from '@/modules/invoicing/invoice.types'
import { FormConfig, ModulesEnum } from '@/shared/shared.types'
import { Row } from '@tanstack/react-table'
import { ViewTypeEnum } from '@/shared/shared.types'
import { InvoiceData } from '@/shared/components/view-types/viewTypes.types'
import EditableDraggableTable from './components/InvoiceLines'
import { Frm_bar_buttons } from './components/Frm_bar_buttons'
import { Frm_bar_status } from './components/Frm_bar_status'
import { BsCardChecklist } from 'react-icons/bs'

const InvoiceIndexConfig: FormConfig = {
  fnc_name: 'fnc_account_move',
  title: 'Facturas',
  dsc: 'Factura de cliente',
  module: ModulesEnum.INVOICING,
  module_url: '/invoicing',
  dsc_view: 'name',
  views: [ViewTypeEnum.KANBAN, ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  item_url: '/invoicing',
  new_url: '/invoicing/new',
  filters_columns: [],
  visibility_columns: {},

  fnc_valid: (data) => {
    if (data.payment_term_id) data.invoice_date_due = null
    data.move_lines = (data?.move_lines || []).map((elem: MoveLine, index: number) => ({
      ...elem,
      order_id: index + 1,
      product_id: elem.product_id !== 0 ? elem.product_id : null,
      move_lines_taxes: (elem?.move_lines_taxes || []).map((elem: any) =>
        typeof elem === 'object' ? { tax_id: elem.tax_id } : elem
      ),
    }))

    if (data.invoice_date) formatDateToDDMMYYYY(data.invoice_date)
    if (data.invoice_date_due) formatDateToDDMMYYYY(data.invoice_date_due)

    if (!data['name']) {
      return null
    }
    //delete
    return data
  },

  default_values: {
    company_id: null,
    // tdoc: '',
    state: 'B',
    state2: '',
    name: 'Borrador',
    partner_id: null,
    invoice_date: '',
    payment_reference: '',
    invoice_date_due: null,
    payment_term_id: null,
    currency_id: null,
    reference: '',
    seller_id: null,
    team_id: null,
    bank_account_id: null,
    delivery_date: '',
    fiscal_position_id: null,
    typed: '',
    amount_total: 0,
    move_id: 0,
    group_id: null,
    move_lines: [],
  },
  formButtons: [
    {
      icon: BsCardChecklist,
      text: 'Pagos',
      value: '5',
      onClick: (context: any) => {
        context.setAditionalFilters([[0, 'fequal', 'move_id', context?.formItem?.move_id]])
        context.setBreadcrumb([
          {
            title: context.formItem?.name,
            url: context?.pathname,
            viewType: ViewTypeEnum.FORM,
          },
        ])
        // context.setSettingsBreadcrumb(true)
        context.navigate('/action/742')
      },
    },
  ],
  grid: {
    idRow: 'move_id',
    isDragable: false,
    col_name: 'partner_name',

    list: {
      columns: [
        {
          header: 'Número',
          size: 150,
          cell: ({ row }: { row: Row<InvoiceData> }) => (
            <div
              className={`font-semibold ${
                row.original.state === StatusInvoiceEnum.BORRADOR
                  ? 'text-[#0180a5] font-normal'
                  : ''
              }`}
            >
              {row.original.name}
            </div>
          ),
        },
        {
          header: 'Cliente',
          cell: ({ row }: { row: Row<InvoiceData> }) => (
            <div
              className={`${
                row.original.state === StatusInvoiceEnum.BORRADOR
                  ? 'text-[#0180a5] font-normal'
                  : ''
              }`}
            >
              {row.original.partner_name}
            </div>
          ),
        },
        {
          header: 'Fecha de factura',
          size: 150,
          cell: ({ row }: { row: Row<InvoiceData> }) => (
            <div
              className={`${
                row.original.state === StatusInvoiceEnum.BORRADOR
                  ? 'text-[#0180a5] font-normal'
                  : ''
              }`}
            >
              {row.original.invoice_date ? formatDateToDDMMYYYY(row.original.invoice_date) : ''}
            </div>
          ),
        },
        {
          header: 'Fecha de vencimiento',
          size: 150,
          cell: ({ row }: { row: Row<InvoiceData> }) => {
            const getDateColorClass = (date: string) => {
              const dateDiff = daysUntilDate(date)
              if (dateDiff.includes('hace') || dateDiff.includes('Ayer')) return 'text-[#D23F3A]'
              if (dateDiff.includes('en')) return 'text-[#0180A5]'
              if (dateDiff === 'Hoy' || dateDiff === 'Mañana') return 'text-[#9A6B01]'
              return ''
            }
            return (
              <div
                className={`font-semibold ${getDateColorClass(formatDateToDDMMYYYY(row.original.invoice_date_due))}`}
              >
                {daysUntilDate(formatDateToDDMMYYYY(row.original.invoice_date_due))}
              </div>
            )
          },
        },
        {
          header: 'Impuestos no incluidos',
          size: 120,
          meta: {
            textAlign: 'text-right',
            headerAlign: 'text-right',
          },
          footer: () => <div>{Math.floor(Math.random() * 10000)}</div>,
          cell: ({ row }: { row: Row<InvoiceData> }) => (
            <div
              className={`${
                row.original.state === StatusInvoiceEnum.BORRADOR
                  ? 'text-[#0180a5] font-normal '
                  : ''
              }`}
            >
              {row.original?.amount_untaxed_in_currency
                ? row.original.amount_untaxed_in_currency
                : '0.00'}
            </div>
          ),
        },
        {
          header: 'Total',
          size: 120,
          meta: {
            textAlign: 'text-right',
            headerAlign: 'text-right',
          },
          cell: ({ row }: { row: Row<InvoiceData> }) => (
            <div
              className={`font-semibold ${
                row.original.state === StatusInvoiceEnum.BORRADOR
                  ? 'text-[#0180a5] font-normal'
                  : ''
              }`}
            >
              {row.original.amount_total ? row.original.amount_total : '0.00'}
            </div>
          ),
        },
        {
          header: 'Facturación electrónica',
          size: 90,
          cell: ({ row }: { row: Row<InvoiceData> }) => {
            const state = row.original.edi_state
            const defineClass = (state: string) => {
              if (state === InvoiceEnum_edi_state.TO_SEND) return 'text-danger'
              // if (state === InvoiceEnum_edi_state.SEND) return 'text-warning'
              return ''
            }
            return (
              <div className={`font-semibold ${defineClass(state)}`}>
                {row.original.edi_state_description}
              </div>
            )
          },
        },

        /*
        {
          header: 'Estado',
          size: 100,
          cell: ({ row }: { row: Row<InvoiceData> }) => {
            const state = row.original.state
            const deffineLabel = (state: string) => {
              if (state === StatusInvoiceEnum.BORRADOR) return 'Borrador'
              if (state === StatusInvoiceEnum.PUBLICADO) return 'Publicado'
              if (state === StatusInvoiceEnum.CANCELADO) return 'Cancelado'
              return ''
            }
            return (
              <div className={`chip_demo ${state === StatusInvoiceEnum.BORRADOR ? 'P' : 'S'}`}>
                {deffineLabel(state)}
              </div>
            )
          },
        },
        */
        {
          header: 'Estado',
          size: 90,
          cell: ({ row }: { row: Row<InvoiceData> }) => {
            const state = row.original.payment_state
            const defineClass = (state: string) => {
              if (state === InvoiceEnum_payment_state.NO_PAYMENT) return 'text-bg-danger'
              if (state === InvoiceEnum_payment_state.PARTIAL_PAYMENT) return 'text-bg-warning'
              if (state === InvoiceEnum_payment_state.PAID) return 'text-bg-success'
              return ''
            }
            return (
              <div className={`chip_demo ${defineClass(state)}`}>
                {row.original.payment_state_description}
              </div>
            )
          },
        },
        {
          header: 'Enviado',
          size: 90,
          cell: ({ row }: { row: Row<InvoiceData> }) => {
            const state = row.original.sent_state
            const defineClass = (state: string) => {
              if (state === InvoiceEnum_sent_state.UNSENT) return 'text-bg-danger'
              if (state === InvoiceEnum_sent_state.SENT) return 'text-bg-success'
              return ''
            }
            return (
              <div className={`chip_demo ${defineClass(state)}`}>
                {row.original.sent_state_description}
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

  form_inputs: {
    imagenFields: [],
    auditoria: true,
    frm_bar_buttons: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <Frm_bar_buttons
        control={control}
        errors={errors}
        setValue={setValue}
        editConfig={editConfig}
        watch={watch}
      />
    ),
    frm_bar_status: () => <Frm_bar_status />,
    frm_title: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmTitle
        control={control}
        errors={errors}
        setValue={setValue}
        editConfig={editConfig}
        watch={watch}
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
    frm_middle_right: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmMiddleRight
        control={control}
        errors={errors}
        setValue={setValue}
        editConfig={editConfig}
        watch={watch}
      />
    ),

    tabs: [
      {
        name: 'Líneas de factura',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <EditableDraggableTable
            control={control}
            errors={errors}
            setValue={setValue}
            editConfig={editConfig}
            watch={watch}
          />
        ),
      },
      {
        name: 'Otra información',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab1
            control={control}
            errors={errors}
            setValue={setValue}
            editConfig={editConfig}
            watch={watch}
          />
        ),
      },
      {
        name: 'Facturación electrónica peruana',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab2
            control={control}
            errors={errors}
            setValue={setValue}
            editConfig={editConfig}
            watch={watch}
          />
        ),
      },
    ],
  },
}

export default InvoiceIndexConfig
