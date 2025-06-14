import { ViewTypeEnum, FormConfig, ModulesEnum, ItemStatusTypeEnum } from '@/shared/shared.types'
import { FrmTab1, FrmTab2, FrmTitle } from './configView'

const PaymentTermsConfig: FormConfig = {
  fnc_name: 'fnc_payment_method',
  title: 'Metodos de pago',
  dsc: 'Metodo de pago',
  dsc_view: 'name',
  module: ModulesEnum.INVOICING,
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '/action/621',
  item_url: '/action/621/detail',
  new_url: '/action/621/detail/new',
  isFavoriteColumn: false,

  fnc_valid: (data) => {
    if (!data['name']) {
      return null
    }
    return data
  },

  default_values: {
    payment_term_id: null,
    group_id: null,
    company_id: null,
    state: ItemStatusTypeEnum.ACTIVE,
    name: '',
  },
  grid: {
    idRow: 'payment_term_id',
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
          header: 'Nombre',
          accessorKey: 'name',
          className: '!w-auto text-left',
        },
        {
          header: 'Activo',
          accessorKey: 'company_name',
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
    frm_title: ({ control, errors, editConfig = {}, setValue, watch }) => (
      <FrmTitle
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
        watch={watch}
      />
    ),
    tabs: [
      {
        name: 'Proveedores',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab1
            watch={watch}
            control={control}
            errors={errors}
            setValue={setValue}
            editConfig={editConfig}
          />
        ),
      },
      {
        name: 'Marcas',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab2
            watch={watch}
            control={control}
            errors={errors}
            setValue={setValue}
            editConfig={editConfig}
          />
        ),
      },
    ],
  },
}

export default PaymentTermsConfig
