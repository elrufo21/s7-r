import { ViewTypeEnum, FormConfig, ModulesEnum, ItemStatusTypeEnum } from '@/shared/shared.types'
import { FrmTitle } from './configView'

const PosPaymentConfig: FormConfig = {
  fnc_name: 'fnc_pos_point',
  title: 'Puntos de venta',
  dsc: 'Punto de venta',
  dsc_view: 'name',
  module: ModulesEnum.POINTS_OF_SALE,
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '/action/892',
  item_url: '/action/892/detail',
  new_url: '/action/892/detail/new',
  // isFavoriteColumn: false,
  no_content_title: 'Crear un nuevo PdV',
  no_content_dsc: 'Configure al menos un punto de venta.',
  ribbonList: [
    {
      label: 'ARCHIVADO',
      state: 'I',
      className: 'ribbon',
    },
  ],

  fnc_valid: (data) => {
    if (!data['name']) {
      return null
    }
    return data
  },

  default_values: {
    company_id: null,
    state: ItemStatusTypeEnum.ACTIVE,
    name: null,
  },
  grid: {
    idRow: 'point_id',
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
          header: 'Punto de venta',
          accessorKey: 'name',
          className: '!w-auto text-left',
        },
        {
          header: 'Empresa',
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
    frm_title: ({ control, errors, editConfig, setValue, watch }) => (
      <FrmTitle
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
