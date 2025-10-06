import {
  ViewTypeEnum,
  FormConfig,
  ModulesEnum,
  ItemStatusTypeEnum,
  frmElementsProps,
} from '@/shared/shared.types'
import { FrmMiddle, FrmTitle } from '@/modules/action/views/point-of-sale/pos-session/configView'
import { Frm_bar_buttons } from '@/modules/action/views/point-of-sale/pos-session/components/Frm_bar_buttons'
import { Row } from 'primereact/row'
import { formatPlain } from '@/shared/utils/dateUtils'
import { BsCash, BsFillBasket2Fill } from 'react-icons/bs'
const PosSessionConfig: FormConfig = {
  fnc_name: 'fnc_pos_session',
  title: 'Sesiones',
  dsc: 'Sesión',
  dsc_view: 'name',
  module: ModulesEnum.POINTS_OF_SALE_MEAT,
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '/action/200',
  item_url: '/action/200/detail',
  new_url: '',
  no_content_title: 'No se encontraron sesiones',
  no_content_dsc:
    'Una sesión es un periodo, usualmente un día, durante el cual utiliza el Punto de ventas para realizar sus ventas.',

  fnc_valid: (data) => {
    if (!data['name']) {
      return null
    }
    return data
  },
  formButtons: [
    {
      condition: (data: any) => data?.state === 'R',
      icon: BsFillBasket2Fill,
      text: 'Órdenes',
      value: 'final_cash_in_currency',
      onClick: (context: any) => {
        console.log('asientos contables', context.formItem)
      },
    },
    {
      condition: (data: any) => data?.state === 'R',
      icon: BsCash,
      text: 'Pagos',
      value: '1',
      onClick: () => {
        console.log('asientos contables')
      },
    },
  ],
  default_values: {
    payment_term_id: null,
    group_id: null,
    company_id: null,
    state: ItemStatusTypeEnum.ACTIVE,
    name: '',
  },
  grid: {
    idRow: 'session_id',
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
          header: 'ID de sesión',
          accessorKey: 'name',
          className: ' text-left',
        },
        {
          header: 'Punto de venta',
          accessorKey: 'point_name',
          className: ' text-left',
        },
        {
          header: 'Abierta por',
          accessorKey: 'user_name',
          className: ' text-left',
        },
        {
          header: 'Fecha de apertura',
          accessorKey: 'start_at',
          className: ' text-left',
          cell: ({ row }: { row: Row }) => (
            <div>{row.original.start_at ? formatPlain(row.original.start_at) : ''}</div>
          ),
        },
        {
          header: 'Fecha de cierre',
          accessorKey: 'stop_at',
          className: ' text-left',
          cell: ({ row }: { row: Row }) => (
            <div>
              {row.original.stop_at && row.original.state == 'R'
                ? formatPlain(row.original.stop_at)
                : ''}
            </div>
          ),
        },
        {
          header: 'Saldo inicial',
          accessorKey: 'initial_cash',
          className: ' text-left',
        },
        {
          header: 'Saldo final',
          accessorKey: 'final_cash',
          className: ' text-left',
          cell: ({ row }: { row: Row }) => (
            <div>{row.original.state === 'R' ? row.original.final_cash : ''}</div>
          ),
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

  form_inputs: {
    imagenFields: [],
    auditoria: false,
    frm_bar_buttons: ({ watch, setValue, control, errors, editConfig }: frmElementsProps) => (
      <Frm_bar_buttons
        watch={watch}
        setValue={setValue}
        control={control}
        errors={errors}
        editConfig={editConfig}
      />
    ),
    frm_title: ({ control, errors, editConfig = {}, setValue, watch }) => (
      <FrmTitle
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
        watch={watch}
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
    /*
    tabs: [
      {
        name: 'Metodos de pago',
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
    ],
    */
  },

  statusBarConfig: {
    visibleStates: [
      { state: 'I', label: 'En curso' },
      // { state: 'C', label: 'Control de cierre' },
      { state: 'R', label: 'Cerrado y registrado' },
    ],
    defaultState: 'I',
  },
}

export default PosSessionConfig
