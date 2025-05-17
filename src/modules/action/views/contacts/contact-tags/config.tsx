import { FormConfig, ItemStatusTypeEnum, ModulesEnum } from '@/shared/shared.types'
import { FrmMiddle } from './configView'
import { ViewTypeEnum } from '@/shared/shared.types'
import { ColorSquare } from '@/shared/components/extras/ColorSquare'

const ContactTagsConfig: FormConfig = {
  fnc_name: 'fnc_partner_category',
  module: ModulesEnum.CONTACTS,
  title: 'Etiquetas de contacto',
  dsc: 'Etiquetas de contacto',
  dsc_view: 'full_name',
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '/action/101',
  item_url: '/action/101/detail',
  new_url: '/action/101/detail/new',
  no_content_title: 'Crear una etiqueta de contacto',
  no_content_dsc: 'Asigne etiquetas a sus contactos para organizarlos, filtrarlos y rastrearlos.',
  visibility_columns: {},

  fnc_valid: (data) => {
    if (!data['name']) {
      return null
    }
    return data
  },

  default_values: {
    state: ItemStatusTypeEnum.ACTIVE,
    name: '',
    color: '',
    parent_id: null,
    group_id: null,
  },

  grid: {
    idRow: 'category_id',
    col_name: 'name',
    isDragable: false,
    list: {
      columns: [
        {
          header: 'Nombre',
          accessorKey: 'name',
          align: 'left',
        },
        {
          header: 'Categoría',
          accessorKey: 'parent_name',
          align: 'left',
        },
        {
          header: 'Color',
          accessorKey: 'color',
          size: 250,
          align: 'center',
          cell: (row: any) => {
            if (!row.row.original?.['category_id']) return <></>
            return <ColorSquare color={row.getValue()} />
          },
        },
      ],
    },
  },

  filters: [
    {
      list: [
        {
          group: 'state',
          key: 'state_I',
          title: 'Archivado',
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
          title: 'Categoría',
          key: 'parent_name',
          key_gby: 'parent_id',
        },
        {
          title: 'Color',
          key: 'color',
          key_gby: 'color',
        },
      ],
    },
  ],

  filters_columns: [
    {
      dsc: 'Nombre de la etiqueta',
      key: 'name',
      default: true,
    },
    {
      dsc: 'Categoría principal',
      key: 'parent_name',
      default: false,
    },
  ],

  configControls: {},

  form_inputs: {
    imagenFields: [],
    auditoria: false,

    frm_middle: ({ control, errors, watch, setValue, editConfig = {} }) => (
      <FrmMiddle
        setValue={setValue}
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
      />
    ),
  },
}

export default ContactTagsConfig
