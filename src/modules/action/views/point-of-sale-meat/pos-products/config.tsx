import { ViewTypeEnum, FormConfig, ModulesEnum, ItemStatusTypeEnum } from '@/shared/shared.types'
import {
  FrmPhoto,
  FrmTab0,
  FrmTab1,
  FrmTab2,
  FrmTab3,
  FrmTab4,
  FrmTab5,
  FrmStar,
  FrmTitle,
  Subtitle,
} from '@/modules/action/views/inventory/products/configView'
import { Chip } from '@mui/material'
import { compareArrays } from '@/modules/action/views/inventory/utils'
import AttributesVariantsTable from '../../inventory/products/components/attributesVariants'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'

const ProductsConfig: FormConfig = {
  fnc_name: 'fnc_product_template',
  title: 'Producto',
  dsc: 'Producto',
  dsc_view: 'name',
  formTitle: 'Producto',
  module: ModulesEnum.POINTS_OF_SALE_MEAT,
  views: [ViewTypeEnum.KANBAN, ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '/action/204',
  item_url: '/action/204/detail',
  new_url: '/action/204/detail/new',
  isFavoriteColumn: true,
  no_content_title: 'Crear nuevo producto',
  no_content_dsc: 'Defina productos y categorías para su empresa',
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

  fnc_valid: (data, formItem) => {
    if (!data.name) return null
    const { taxes_sale, taxes_purchase } = data

    if (taxes_sale || taxes_purchase) {
      const newTaxSales = (taxes_sale ?? []).map(
        (tax: { label: string; value: number; type: string; operation: string }) => ({
          name: tax.label,
          tax_id: tax.value,
          operation: tax.type || tax.operation,
        })
      )
      const newTaxBuys = (taxes_purchase ?? []).map(
        (tax: { label: string; value: number; type: string; operation: string }) => ({
          name: tax.label,
          tax_id: tax.value,
          operation: tax.type || tax.operation,
        })
      )
      data.taxes = [...newTaxSales, ...newTaxBuys]
    }

    delete data.taxes_sale
    delete data.taxes_purchase
    let newAttributes = []
    if (data?.attributes) {
      newAttributes = data.attributes.map((attr: any) => ({
        id: attr.id,
        attribute_id: attr.attribute_id,
        values_change: attr.values_change,
        values: attr.values,
      }))
    }

    const idTaxesFromBD = [
      ...(formItem?.taxes_sale || []),
      ...(formItem?.taxes_purchase ?? []),
    ].map((tax) => tax.tax_id)

    const idTaxesFromData = data.taxes.map((tax: any) => tax.tax_id)

    if (!compareArrays(idTaxesFromBD, idTaxesFromData)) data.taxes_change = true
    data.attributes_change = data?.attributes_change || false
    data.attributes = newAttributes.map((attr: any) => ({
      ...attr,
      values: attr.values.map((val: any) => ({
        ...val,
        attribute_id: attr.attribute_id,
      })),
    }))
    /* const valueSet = new Set()
    let hasDuplicate = false

    for (const attr of newAttributes) {
      for (const val of attr.values) {
        if (valueSet.has(val.value)) {
          hasDuplicate = true
          break // Detiene la búsqueda en el primer duplicado encontrado
        }
        valueSet.add(val.value)
      }
      if (hasDuplicate) break // Sale del bucle principal si hay duplicado
    }

    if (hasDuplicate) {
      // Aquí puedes usar un toast de tu librería preferida (ej: react-toastify)
      toast.error('Hay valores duplicados, por favor verifique los valores de los atributos')
      return null
    }*/
    if (data.attributes.length > 0) {
      delete data.cost
      delete data.barcode
      delete data.weight
      delete data.volume
      delete data.description_pickingout
      delete data.internal_code
    }
    data.product_template_id = formItem?.product_template_id || null
    data.attributes = (data?.attributes || []).map((elem: any, index: number) => ({
      ...elem,
      order_id: index + 1,
    }))

    // agregado hoy
    const areSameTags =
      JSON.stringify((formItem?.categories || []).map((tag: any) => tag.label)) !==
      JSON.stringify((data?.categories || []).map((tag: any) => tag.label))
    data.categories_change = areSameTags

    return data
  },

  default_values: {
    company_id: null,
    state: ItemStatusTypeEnum.ACTIVE,
    group_id: null,
    is_favorite: false,
    name: '',
    attributes_change: false,
    files: null,
    sale_ok: true,
    purchase_ok: true,
    type: 'B',
    uom_id: null,
    purchase_uom_id: null,
    sale_price: '',
    cost: '',
    category_id: null,
    internal_code: '',
    attributes: [],
    barcode: '',
    internal_notes: '',
    description_sale: '',
    available_in_pos: false,
    taxes_sale: null,
    description_purchase: '',
    description_pickingin: '',
    dsc_enaddress_typea: '',
    unspsc_code_id: null,
    is_storable: false,
    invoice_policy: 'CO',
    stock_type: null,
    tax_buys: null,
    taxes: [],
    parent_id: null,
    categories: [],
    sw_categories: false,
  },

  grid: {
    idRow: 'product_template_id',
    isDragable: false,
    col_name: 'name',
    list: {
      columns: [
        {
          header: 'Referencia interna',
          accessorKey: 'internal_code',
          size: 130,
        },
        {
          header: 'Código de barras',
          accessorKey: 'barcode',
          align: 'middle',
          size: 200,
        },
        {
          header: 'Nombre',
          accessorKey: 'name',
        },
        {
          header: 'Precio de venta',
          accessorKey: 'sale_price',
          align: 'right',
          size: 120,
        },

        {
          header: 'Impuestos de venta',
          accessorKey: 'taxes_sale',
          cell: (row: any) => {
            if (!row.row.original?.['taxes_sale']) return <></>
            return row.row.original?.['taxes_sale'].map((tax: any) => (
              <Chip key={tax.value} label={tax.label} size="small" className="ml-1" />
            ))
          },
          align: 'left',
          size: 150,
        },
        {
          header: 'Impuestos de compra',
          accessorKey: 'taxes_purchase',
          cell: (row: any) => {
            if (!row.row.original?.['taxes_purchase']) return <></>
            return row.row.original?.['taxes_purchase'].map((tax: any) => (
              <Chip key={tax.value} label={tax.label} size="small" className="ml-1" />
            ))
          },
          align: 'left',
          size: 150,
        },

        {
          header: 'Costo',
          accessorKey: 'cost',
          align: 'right',
          size: 120,
        },
        {
          header: 'Categoría del producto',
          accessorKey: 'category_name',
          align: 'middle',
          size: 200,
        },
        {
          header: 'Tipo de producto',
          accessorKey: 'type_description',
          align: 'middle',
          size: 100,
        },
        {
          header: 'Unidad',
          accessorKey: 'uom_name',
          align: 'middle',
          size: 120,
        },
      ],
    },
  },

  visibility_columns: {
    barcode: false,
    category_name: false,
    type_description: false,
    internal_code: false,
    taxes_sale: false,
    taxes_purchase: false,
  },

  filters: [
    {
      list: [
        {
          group: '1',
          title: 'Servicios',
          key: '1.1',
          key_db: 'type',
          value: 'S',
          type: 'check',
        },
        {
          group: '1',
          title: 'Bienes',
          key: '1.2',
          key_db: 'type',
          value: 'B',
          type: 'check',
        },
        {
          group: '1',
          title: 'Combo',
          key: '1.3',
          key_db: 'type',
          value: 'C',
          type: 'check',
        },
        {
          group: '1',
          title: 'Gestión de inventario',
          key: '1.4',
          key_db: 'is_storable',
          value: '1',
          type: 'check',
        },
      ],
    },
    {
      list: [
        {
          group: '2',
          title: 'Disponible en PdV',
          key: '2.1',
          key_db: 'available_in_pos',
          value: '1',
          type: 'check',
        },
        {
          group: '2',
          title: 'Se puede vender',
          key: '2.2',
          key_db: 'sale_ok',
          value: '1',
          type: 'check',
        },
        {
          group: '2',
          title: 'Se puede comprar',
          key: '2.3',
          key_db: 'purchase_ok',
          value: '1',
          type: 'check',
        },
      ],
    },
    {
      list: [
        {
          group: '3',
          title: 'Favoritos',
          key: '3.1',
          key_db: 'is_favorite',
          value: '1',
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
          title: 'Tipo de producto',
          key: 'type_description',
          key_gby: 'type',
        },
        {
          title: 'Categoría del producto',
          key: 'category_name',
          key_gby: 'category_id',
        },
      ],
    },
  ],

  filters_columns: [
    {
      dsc: 'Producto',
      key: 'name',
      default: true,
    },
    {
      dsc: 'Categoría del producto',
      key: 'category_name',
      default: false,
    },
  ],

  configControls: {},

  form_inputs: {
    imagenFields: ['files'],
    auditoria: true,

    frm_photo: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmPhoto
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
      />
    ),
    frm_star: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmStar
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
      />
    ),
    frm_title: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmTitle
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
      />
    ),
    frm_sub_title: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <Subtitle
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
      />
    ),

    tabs: [
      {
        name: 'Información general',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab0
            watch={watch}
            control={control}
            errors={errors}
            editConfig={editConfig}
            setValue={setValue}
            fnc_name={'fnc_product_category'}
          />
        ),
      },
      {
        name: 'Atributos y variantes',
        content: (props) => <AttributesVariantsTable {...props} />,
      },

      {
        name: 'Ventas',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab1
            watch={watch}
            control={control}
            errors={errors}
            editConfig={editConfig}
            setValue={setValue}
          />
        ),
      },
      {
        name: 'Punto de venta',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab5
            watch={watch}
            control={control}
            errors={errors}
            editConfig={editConfig}
            setValue={setValue}
          />
        ),
      },
      {
        name: 'Compras',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab2
            watch={watch}
            control={control}
            errors={errors}
            editConfig={editConfig}
            setValue={setValue}
          />
        ),
      },
      {
        name: 'Inventario',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab3
            watch={watch}
            control={control}
            errors={errors}
            editConfig={editConfig}
            setValue={setValue}
          />
        ),
      },
      {
        name: 'Contabilidad',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab4
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

export default ProductsConfig
