import { ViewTypeEnum, FormConfig, ModulesEnum, ItemStatusTypeEnum } from '@/shared/shared.types'
import {
  FrmPhoto,
  FrmMiddle,
  FrmMiddleRight,
  FrmTitle,
} from '@/modules/action/views/point-of-sale/pos-payment-method/configView'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'

const PosPaymentConfig: FormConfig = {
  fnc_name: 'fnc_pos_payment_method',
  title: 'Métodos de pago',
  dsc: 'Método de pago',
  dsc_view: 'name',
  module: ModulesEnum.POINTS_OF_SALE_MEAT,
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '/action/206',
  item_url: '/action/206/detail',
  new_url: '/action/206/detail/new',
  // isFavoriteColumn: false,
  no_content_title: 'Agregar un nuevo método de pago',
  no_content_dsc:
    'Desde los ajustes generales de la aplicación Facturación, creará métodos de pago bancarios y en efectivo automáticamente.',
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

  default_values: {
    payment_term_id: null,
    group_id: null,
    files: null,
    company_id: null,
    state: ItemStatusTypeEnum.ACTIVE,
    name: '',
  },
  grid: {
    idRow: 'payment_method_id',
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
          header: 'Método',
          accessorKey: 'name',
          className: '!w-auto text-left',
        },
        {
          header: 'Diario	',
          accessorKey: 'journal_name',
          className: '!w-auto text-left',
        },
        {
          header: 'Empresa',
          accessorKey: 'company_name',
          className: '!w-auto text-left',
        },
        /*
        {
          header: 'Punto de venta',
          accessorKey: 'pos_name',
          className: '!w-auto text-left',
        },
        */
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
    imagenFields: ['files'],
    auditoria: false,

    frm_photo: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmPhoto
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
      />
    ),

    frm_title: ({ control, errors, editConfig = {}, setValue, watch }) => (
      <FrmTitle
        control={control}
        errors={errors}
        editConfig={editConfig}
        watch={watch}
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
    frm_middle_right: ({ control, errors, editConfig = {}, setValue, watch }) => (
      <FrmMiddleRight
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
