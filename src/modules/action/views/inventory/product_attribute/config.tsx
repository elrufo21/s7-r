import { ViewTypeEnum, FormConfig, ModulesEnum, ItemStatusTypeEnum } from '@/shared/shared.types'
import { FrmMiddle } from './configView'
import ProductVariantsTable from './components/productAttributes'

const ProductsCategoryConfig: FormConfig = {
  fnc_name: 'fnc_product_attributes_template',
  title: 'Atributos',
  dsc: 'Atributos',
  dsc_view: 'name',
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module: ModulesEnum.INVENTORY,
  module_url: '/action/177',
  item_url: '/action/177/detail',
  new_url: '/action/177/detail/new',
  no_content_title: 'Crear una atributo de producto',
  no_content_dsc:
    'Asigne una atributo a sus productos para organizarlos, filtrarlos y rastrearlos.',
  visibility_columns: {},

  fnc_valid: (data: any) => {
    if (!data['name']) {
      return null
    }
    data.values = (data?.values || []).map((elem: any, index: number) => ({
      ...elem,
      order_id: index + 1,
    }))

    return data
  },

  default_values: {
    attribute_id: null,
    group_id: null,
    name: '',
    display_type: 'radio',
    state: ItemStatusTypeEnum.ACTIVE,
    create_variant: 'always',
  },

  grid: {
    idRow: 'attribute_id',
    isDragable: true,
    col_name: 'name',

    list: {
      columns: [
        {
          header: 'Atributo',
          accessorKey: 'name',
          size: 'auto',
          enableSorting: false,
        },
        {
          header: 'Tipo de visualización',
          accessorKey: 'display_type',
          size: 'auto',
        },
        {
          header: 'Creacion de variantes',
          accessorKey: 'create_variant',
          size: 'auto',
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

  group_by: [],

  filters_columns: [
    {
      dsc: 'Atributo',
      key: 'name',
      default: true,
    },
  ],

  configControls: {},

  form_inputs: {
    imagenFields: [],
    auditoria: false,
    frm_middle: ({ control, errors, watch, setValue, editConfig = {} }) => (
      <FrmMiddle
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
        editConfig={editConfig}
      />
    ),
    tabs: [
      {
        name: 'Valores de atributo',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <ProductVariantsTable
            watch={watch}
            control={control}
            errors={errors}
            editConfig={editConfig}
            setValue={setValue}
          />
        ),
      },
    ],
  },
}

export default ProductsCategoryConfig
