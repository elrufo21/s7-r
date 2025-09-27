import { ViewTypeEnum, FormConfig, ModulesEnum, ItemStatusTypeEnum } from '@/shared/shared.types'
import {
  FrmMiddle,
  FrmMiddleRight,
  FrmTab0,
  FrmTab1,
  FrmTab2,
  FrmTab3,
  FrmTitle,
} from './configView'
import { BsBook } from 'react-icons/bs'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'

const JournalConfig: FormConfig = {
  fnc_name: 'fnc_journal',
  title: 'Diarios',
  dsc: 'Nombre del diario',
  dsc_view: 'name',
  module: ModulesEnum.INVOICING,
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '/action/622',
  item_url: '/action/622/detail',
  new_url: '/action/622/detail/new',
  isFavoriteColumn: false,
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
  formButtons: [
    {
      icon: BsBook,
      text: 'Asientos contables',
      value: '5',
      onClick: () => {
        console.log('asientos contables')
      },
    },
  ],

  fnc_valid: (data) => {
    // Asegurar que los arrays existen y son válidos
    const paymentMethodsIn = Array.isArray(data.payment_methods_in) ? data.payment_methods_in : []
    const paymentMethodsOut = Array.isArray(data.payment_methods_out)
      ? data.payment_methods_out
      : []

    // Asignar order_id si hay elementos
    data.payment_methods_in =
      paymentMethodsIn.length > 0
        ? paymentMethodsIn.map((item: any, index: number) => ({
            ...item,
            order_id: index + 1,
          }))
        : []

    data.payment_methods_out =
      paymentMethodsOut.length > 0
        ? paymentMethodsOut.map((item: any, index: number) => ({
            ...item,
            order_id: index + 1,
          }))
        : []

    // Crear el nuevo objeto combinando ambos arrays
    const newData = {
      ...data,
      payment_methods: [
        ...data.payment_methods_in.map((item: any) => ({
          ...item,
          payment_type: 'I',
        })),
        ...data.payment_methods_out.map((item: any) => ({
          ...item,
          payment_type: 'O',
        })),
      ],
    }

    return newData
  },

  default_values: {
    journal_id: null,
    group_id: null,
    state: ItemStatusTypeEnum.ACTIVE,
    name: '',
    use_documents: false,
    code: '',
    refund_sequence: false,
    debit_sequence: false,
    currency_id: null,
    reference_type: '',
    reference_model: '',
    document_type: '',
    payment_sequence: true,
  },
  grid: {
    idRow: 'journal_id',
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
          header: 'Nombre del diario',
          accessorKey: 'name',
          className: '!w-auto text-left',
        },
        {
          header: 'Tipo',
          accessorKey: 'type_description',
          className: '!w-auto text-left',
        },
        {
          header: 'Prefijo de secuencia',
          accessorKey: 'code',
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
    frm_title: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmTitle
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
        watch={watch}
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
    frm_middle_right: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmMiddleRight
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        setValue={setValue}
      />
    ),
    tabs: [
      {
        name: 'Asientos contables',
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

      {
        name: 'Pagos Entrantes',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab2
            watch={watch}
            control={control}
            errors={errors}
            setValue={setValue}
            editConfig={editConfig}
          />
        ),
      },
      {
        name: 'Pagos Salientes',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab3
            watch={watch}
            control={control}
            errors={errors}
            setValue={setValue}
            editConfig={editConfig}
          />
        ),
      },
      {
        name: 'Ajustes avanzados',
        content: ({ watch, control, errors, editConfig = {}, setValue }) => (
          <FrmTab1
            watch={watch}
            control={control}
            errors={errors}
            setValue={setValue}
            editConfig={editConfig}
          />
        ),
      },
    ],
  },
}

export default JournalConfig
