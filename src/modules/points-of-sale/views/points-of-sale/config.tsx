import { FormConfig, ModulesEnum } from '@/shared/shared.types'
import { ViewTypeEnum } from '@/shared/shared.types'

const PosIndexConfig: FormConfig = {
  fnc_name: 'fnc_pos_point',
  title: 'Puntos de venta',
  dsc: 'Puntos de venta',
  module: ModulesEnum.POINTS_OF_SALE,
  module_url: '/points-of-sale',
  dsc_view: 'full_name',
  views: [ViewTypeEnum.KANBAN, ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.KANBAN,
  item_url: '/points-of-sale',
  new_url: '',
  no_content_dsc: 'Crea un punto de venta',
  ribbonList: [
    {
      label: 'ARCHIVADO',
      state: 'I',
      className: 'ribbon',
    },
  ],

  fnc_valid: (data: any) => {
    return data
  },

  default_values: {},

  formButtons: [],

  grid: {
    idRow: 'partner_id',
    col_name: 'full_name',
    isDragable: false,

    list: {
      columns: [
        {
          header: 'Nombre',
          accessorKey: 'full_name',
          align: 'left',
          size: 400,
        },
        {
          header: 'Móvil',
          accessorKey: 'mobile',
          size: 180,
          align: 'left',
        },
        {
          header: 'Correo electrónico',
          accessorKey: 'email',
          size: 350,
          align: 'left',
        },
        {
          header: 'Departamento',
          accessorKey: 'ln2_name',
          size: 200,
        },
        {
          header: 'País',
          accessorKey: 'ln1_name',
          size: 120,
          cell: (props: any) => <div className="text-cyan-600">{props.getValue()}</div>,
        },
        {
          header: 'Compañía',
          accessorKey: 'company_name',
          size: 210,
        },
      ],
    },
  },

  visibility_columns: {},

  filters: [
    {
      list: [
        {
          group: '1',
          title: 'Personas',
          key: '1.1',
          key_db: 'type',
          value: 'I',
          type: 'check',
        },
        {
          group: '1',
          title: 'Empresas',
          key: '1.2',
          key_db: 'type',
          value: 'C',
          type: 'check',
        },
      ],
    },
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

  group_by: [
    {
      list: [
        {
          title: 'Tipo',
          key: 'type_description',
          key_gby: 'type',
        },
        {
          title: 'País',
          key: 'ln1_name',
          key_gby: 'ln1_id',
        },
        {
          title: 'Tipo de registro',
          key: 'address_type',
          key_gby: 'address_type',
        },
      ],
    },
  ],

  filters_columns: [
    {
      dsc: 'Nombre',
      key: 'name',
      default: true,
    },
    {
      dsc: 'Empresa relacionada',
      key: 'parent_name',
      default: false,
    },
    {
      dsc: 'Correo electrónico',
      key: 'email',
      default: false,
    },
    {
      dsc: 'Teléfono/Celular',
      key: 'phone__mobile',
      default: false,
    },
    {
      dsc: 'Etiqueta',
      key: 'category_name',
      default: false,
    },
  ],

  configControls: {
    // type:{
    //   hb_e: false
    // },
    // partner_id_rel: {
    //   hb_e: false
    // },
    // name: {
    //   hb_e: false
    // },
    // identification_number: {
    //   hb_e: false
    // },
    // phone: {
    //   hb_e: false
    // },
    // files:{
    //   hb_n: false
    // }
  },

  form_inputs: {
    imagenFields: ['files'],
    auditoria: true,
    preserveTagPlaceholder: false,
  },
}

export default PosIndexConfig
