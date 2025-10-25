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
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'

const PosProductsConfig: FormConfig = {
  fnc_name: 'fnc_product',
  title: 'Variantes de Producto',
  dsc: 'Variantes de Producto',
  dsc_view: 'name',
  formTitle: 'Producto',
  module: ModulesEnum.POINTS_OF_SALE_PG,
  views: [ViewTypeEnum.KANBAN, ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '/action/405',
  item_url: '/action/405/detail',
  new_url: '/action/405/detail/new',
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
    const {
      taxes_sale = [],
      taxes_purchase = [],
      product_id,
      state,
      files,
      barcode,
      cost,
      weight,
      volume,
      description_pickingout,
      internal_code,
      product_template_id,
    } = data

    const mapTaxes = (taxes = []) =>
      Array.isArray(taxes)
        ? taxes.map(({ label, value, type, operation }) => ({
            name: label,
            tax_id: value,
            operation: type ?? operation,
          }))
        : []

    const newData = {
      ...data,
      taxes: [...mapTaxes(taxes_sale), ...mapTaxes(taxes_purchase)],
    }

    delete newData.taxes_sale
    delete newData.taxes_purchase

    const idTaxesFromBD = [
      ...(formItem?.taxes_sale ?? []),
      ...(formItem?.taxes_purchase ?? []),
    ].map(({ tax_id }) => tax_id)

    const idTaxesFromData = (newData.taxes || []).map(({ tax_id }: { tax_id: number }) => tax_id)

    if (!compareArrays(idTaxesFromBD, idTaxesFromData)) newData.taxes_change = true
    const dataToReturn = {
      product_id: product_id || null,
      data: [
        {
          ...newData,
          product_template_id: product_template_id,
          product_id: product_template_id || undefined,
          barcode: undefined,
          cost: undefined,
          weight: undefined,
          volume: undefined,
          description_pickingout: undefined,
          internal_code: undefined,
        },
        {
          state,
          files,
          barcode,
          product_id,
          cost,
          weight,
          volume,
          description_pickingout,
          internal_code,
        },
      ],
    }
    return dataToReturn
  },

  default_values: {
    company_id: null,
    state: ItemStatusTypeEnum.ACTIVE,
    group_id: null,
    is_favorite: false,
    name: '',
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
    weight: '',
    volume: '',
    description_pickingout: '',
  },

  grid: {
    idRow: 'product_id',
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
          header: 'Valores de las variantes',
          accessorKey: 'variants',
          cell: (row: any) => {
            return row.row.original?.['variants'].map((variant: any) => (
              <Chip
                key={variant.attribute_value_id}
                label={variant.name}
                size="small"
                className="ml-1"
              />
            ))
          },
          align: 'left',
          size: 150,
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
          />
        ),
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

export default PosProductsConfig
