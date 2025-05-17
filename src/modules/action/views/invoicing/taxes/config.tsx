import { ViewTypeEnum, FormConfig, ModulesEnum, ItemStatusTypeEnum } from '@/shared/shared.types'
import { FrmMiddle, FrmMiddleRight, FrmTab0 } from './configView'
import { SwitchTable } from '@/shared/ui/inputs/SwitchTable'
import useAppStore from '@/store/app/appStore'

const TaxesConfig: FormConfig = {
  fnc_name: 'fnc_tax',
  module: ModulesEnum.INVOICING,
  title: 'Impuestos',
  dsc: 'Impuestos',
  dsc_view: 'name',
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '/action/616',
  item_url: '/action/616/detail',
  new_url: '/action/616/detail/new',
  no_content_title: 'Crear una impuesto',
  no_content_dsc: 'Asigne impuestos a sus productos para organizarlos, filtrarlos y rastrearlos.',
  filters_columns: [],

  fnc_valid: (data: any) => {
    return data
  },
  default_values: {
    tax_id: null,
    group_id: null,
    company_id: null,
    state: ItemStatusTypeEnum.ACTIVE,
    name: '',
    description: '',
    calculation: 'percent',
    tax_code_id: null,
    code_unece: '',
    affectation_reason_id: null,
    type: 'sales',
    scope: '',
    percentage: '0',
    invoice_label: '',
    tax_group_id: null,
    ln1_id: null,
    price_include: 'P',
    subsequent_taxes: false,
  },
  grid: {
    idRow: 'tax_id',
    col_name: 'name',
    idRow_db: 'tax_id',
    kanban: {
      box: {
        id: 'tax_id',
        title: 'name',
        subtitle: 'name_rel',
        desc1: 'location_sl2_name__location_country_name',
        desc2: 'email',
      },
    },
    list: {
      columns: [
        {
          header: 'Nombre del impuesto',
          accessorKey: 'name',
          size: 230,
          align: 'left',
        },
        {
          header: 'Descripción',
          accessorKey: 'description',
          align: 'left',
        },
        {
          header: 'Tipo de impuesto',
          accessorKey: 'type_description',
          size: 210,
          align: 'left',
        },
        {
          header: 'Ámbito del impuesto',
          accessorKey: 'scope_description',
          size: 210,
          align: 'left',
        },
        {
          header: 'Etiqueta en facturas',
          accessorKey: 'invoice_label',
          size: 210,
        },
        {
          header: 'Empresa',
          accessorKey: 'company_name',
          size: 210,
        },
        {
          header: 'Activo',
          accessorKey: 'state',
          cell: ({ row, column }: { row: any; column: any }) => {
            const { setInitialData, dataListShow } = useAppStore()
            const handleStateChange = (tax_id: number) => {
              const newData = dataListShow.dataShow.map((item) =>
                item.tax_id === tax_id
                  ? { ...item, state: row.original.state === 'a' ? 'i' : 'a' }
                  : item
              )
              setInitialData({
                data: newData,
                total: newData.length,
              })
            }
            return (
              <div className="flex justify-center">
                <SwitchTable
                  row={row}
                  column={column}
                  onChange={() => {
                    handleStateChange(row.original.tax_id)
                  }}
                />
                {/*
                
                <SwitchCell
                  size="small"
                  color="success"
                  initialValue={row.original.state === 'a'}
                />*/}
              </div>
            )
          },
        },
      ],
    },
  },
  visibility_columns: {},

  filters: [
    /** 
    {
      list: [
        {
          title: 'Venta',
          type: 'check',
          key: '1',
        },
        {
          title: 'Compra',
          type: 'check',
          key: '2',
        },
      ],
    },
    {
      list: [
        {
          title: 'Servicios',
          type: 'check',
          key: '3',
        },
        {
          title: 'Bienes',
          type: 'check',
          key: '4',
        },
      ],
    },
    {
      list: [
        {
          title: 'Archivado',
          type: 'check',
          key: 'state_I',
        },
      ],
    },
     */
  ],

  group_by: [
    /**
    {
      list: [
        {
          title: 'Compañía',
          type: 'check',
          key: '1',
        },
        {
          title: 'Tipo de Impuesto',
          type: 'check',
          key: '2',
        },
        {
          title: 'Ámbito del impuesto',
          type: 'check',
          key: '2',
        },
      ],
    },
     */
  ],

  configControls: {
    company_id: {
      hb_n: false,
      hb_e: false,
    },
  },

  form_inputs: {
    imagenFields: [],
    auditoria: true,

    frm_middle: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmMiddle
        control={control}
        errors={errors}
        setValue={setValue}
        editConfig={editConfig}
        watch={watch}
      />
    ),

    frm_middle_right: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmMiddleRight
        control={control}
        errors={errors}
        setValue={setValue}
        editConfig={editConfig}
        watch={watch}
      />
    ),

    tabs: [
      {
        name: 'Opciones avanzadas',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab0
            control={control}
            errors={errors}
            setValue={setValue}
            editConfig={editConfig}
            watch={watch}
          />
        ),
      },
    ],
  },
}

export default TaxesConfig
