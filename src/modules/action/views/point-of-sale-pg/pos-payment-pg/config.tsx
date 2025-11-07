import { ViewTypeEnum, FormConfig, ModulesEnum, ItemStatusTypeEnum } from '@/shared/shared.types'
import { FrmMiddle } from './configView'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'
import { formatPlain } from '@/shared/utils/dateUtils'
import { Type_pos_payment_origin, TypeStatePayment } from '@/modules/pos-pg/types'
import { Frm_bar_buttons } from './components/frmBarButtons'
import { StatusChip } from '@/shared/components/table/components/StatusChip'

const PosPaymentConfig: FormConfig = {
  form_id: 402,
  fnc_name: 'fnc_pos_payment',
  title: 'Pagos',
  dsc: 'Pagos',
  dsc_view: 'name',
  module: ModulesEnum.POINTS_OF_SALE_PG,
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '/action/402',
  item_url: '/action/402/detail',
  new_url: '',
  // isFavoriteColumn: false,
  no_content_title: 'No se encontraron órdenes',
  no_content_dsc: 'Inicie una nueva sesión para registrar nuevas órdenes.',
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
  aditionalFilters: [
    [
      0,
      'multi_filter_in',
      [
        { key_db: 'origin', value: Type_pos_payment_origin.DOCUMENT },
        { key_db: 'origin', value: Type_pos_payment_origin.DIRECT_PAYMENT },
        { key_db: 'origin', value: Type_pos_payment_origin.PAY_DEBT },
      ],
    ],
  ],
  default_values: {
    payment_term_id: null,
    group_id: null,
    company_id: null,
    state: ItemStatusTypeEnum.ACTIVE,
    name: '',
  },
  grid: {
    idRow: 'payment_id',
    col_name: 'name',
    /**
     * 
    kanban: {
      box: {
        id: "payment_term_id",
        // fav: 'fav',
        //   image: "files",
        title: "name",
        //   subtitle: "name_rel",
        //   desc1: "location_sl2_name__location_country_name",
        //   desc2: "email",
      },
    },
     */
    list: {
      columns: [
        {
          header: 'Fecha',
          cell: ({ row }) => {
            return <div>{row.original?.date ? formatPlain(row.original?.date) : ''}</div>
          },
        },
        {
          header: 'Cliente',
          accessorKey: 'partner_name',
          className: '!w-auto text-left',
        },
        {
          header: 'Método de pago',
          accessorKey: 'payment_method_name',
          className: '!w-auto text-left',
        },
        // {
        //   header: 'Orden',
        //   accessorKey: 'order_name',
        //   className: '!w-auto text-left',
        // },
        {
          header: 'Detalle',
          accessorKey: 'detail',
          className: '!w-auto text-left',
        },
        {
          header: 'Empleado',
          accessorKey: 'user_name',
          className: '!w-auto text-left',
        },
        {
          header: 'Importe',
          id: 'amount',
          accessorKey: 'amount_in_currency',
          className: '!w-auto text-right font-semibold',
          meta: {
            textAlign: 'text-right',
            headerAlign: 'text-right',
          },
        },
        {
          header: 'Estado',
          size: 120,
          cell: ({ row }: { row: any }) => {
            const state = row.original.state
            const stateDescription = row.original.state_description

            return (
              <StatusChip
                value={state}
                description={stateDescription}
                classesMap={{
                  R: 'text-bg-success',
                  C: 'text-bg-danger',
                }}
              />
            )
          },
        },
      ],
    },
    totalColumns: ['amount'],
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
  statusBarConfig: {
    visibleStates: [
      { state: 'R', label: 'Registrado' },
      { state: 'C', label: 'Cancelado' },
    ],
  },

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
    frm_middle: ({ control, errors, editConfig = {}, setValue, watch }) => (
      <FrmMiddle
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
        watch={watch}
      />
    ),
  },
}

export default PosPaymentConfig
