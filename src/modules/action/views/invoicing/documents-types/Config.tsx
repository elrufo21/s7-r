import { ViewTypeEnum, FormConfig, ModulesEnum, ItemStatusTypeEnum } from '@/shared/shared.types'
import { FrmMiddle } from './ConfigView'

const PaymentTermsConfig: FormConfig = {
  fnc_name: 'fnc_document_type',
  title: 'Tipos de documentos',
  dsc: 'Tipos de documentos',
  dsc_view: 'name',
  module: ModulesEnum.INVOICING,
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '/action/746',
  item_url: '',
  new_url: '',
  isFavoriteColumn: false,

  fnc_valid: (data) => {
    if (!data['name']) {
      return null
    }
    return data
  },

  default_values: {
    code: null,
    name: '',
    country_id: null,
    state: ItemStatusTypeEnum.ACTIVE,
    code_prefix: '',
    reports_name: '',
    internal_type: '',
  },
  grid: {
    idRow: 'document_type_id',
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
          header: 'Código',
          accessorKey: 'code',
          className: '!w-auto text-left',
        },
        {
          header: 'Nombre',
          accessorKey: 'name',
          className: '!w-auto text-left',
        },
        {
          header: 'Prefijo del código de documento',
          accessorKey: 'doc_code_prefix',
          className: '!w-auto text-left',
        },
        {
          header: 'Nombre en reportes',
          accessorKey: 'report_name',
          className: '!w-auto text-left',
        },
        {
          header: 'Tipo interno',
          accessorKey: 'internal_type',
          className: '!w-auto text-left',
        },
        {
          header: 'País',
          accessorKey: 'ln1_name',
          className: '!w-auto text-left',
        },
        {
          header: 'Activo',
          accessorKey: 'state',
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
      dsc: 'Términos de pago',
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

export default PaymentTermsConfig
