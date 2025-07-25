import { ViewTypeEnum, FormConfig, ModulesEnum } from '@/shared/shared.types'
import { FrmMiddle } from './configView'

const PosContainers: FormConfig = {
  fnc_name: 'fnc_pos_containers',
  title: 'Contenedores',
  dsc: 'Contenedores',
  dsc_view: 'name',
  module: ModulesEnum.POINTS_OF_SALE,
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '/action/900',
  item_url: '/action/900/detail',
  new_url: '/action/900/detail/new',
  // isFavoriteColumn: false,
  no_content_title: 'No se encontraron contenedores',
  no_content_dsc: 'Registre un contenedor para agilizar el proceso de cierre de sesión.',
  fnc_valid: (data) => {
    if (!data['name']) {
      return null
    }
    return data
  },

  default_values: {
    name: '',
    code: '',
    symbol: '',
    position: '',
    rounding: '',
    rounding_method: '',
    active: true,
  },
  grid: {
    idRow: 'ticket_id',
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
          header: 'Valor',
          accessorKey: 'value',
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

export default PosContainers
