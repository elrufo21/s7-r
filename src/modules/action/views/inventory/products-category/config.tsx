import { ViewTypeEnum, FormConfig, ModulesEnum, ItemStatusTypeEnum } from '@/shared/shared.types'
import { FrmMiddle, FrmTitle } from './configView'

const ProductsCategoryConfig: FormConfig = {
  fnc_name: 'fnc_product_category',
  title: 'Categorías de productos',
  dsc: 'Categoría',
  dsc_view: 'full_name',
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module: ModulesEnum.INVENTORY,
  module_url: '/action/180',
  item_url: '/action/180/detail',
  new_url: '/action/180/detail/new',
  no_content_title: 'Crear una categoría de producto',
  no_content_dsc:
    'Asigne una categoria a sus productos para organizarlos, filtrarlos y rastrearlos.',
  visibility_columns: {},

  fnc_valid: (data: any) => {
    if (!data['name']) {
      return null
    }
    return data
  },

  default_values: {
    category_id: null,
    name: '',
    group_id: null,
    parent_id: null,
    state: ItemStatusTypeEnum.ACTIVE,
    company_id: null,
  },

  grid: {
    idRow: 'category_id',
    col_name: 'full_name',

    list: {
      columns: [
        {
          header: 'Categoría del producto',
          accessorKey: 'full_name',
          size: 'auto',
          enableSorting: false,
        },
      ],
    },
  },

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

  group_by: [
    {
      list: [
        {
          title: 'Categoría',
          key: 'parent_name',
          key_gby: 'parent_id',
        },
      ],
    },
  ],

  filters_columns: [
    {
      dsc: 'Categoría',
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

    /** */
    frm_title: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmTitle
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
      />
    ),

    frm_middle: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmMiddle
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
      />
    ),
  },
}

export default ProductsCategoryConfig
