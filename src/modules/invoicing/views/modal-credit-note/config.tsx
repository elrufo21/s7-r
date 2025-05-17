import { ViewTypeEnum, FormConfig, ModulesEnum } from '@/shared/shared.types'
import { FrmMiddle } from './configView'

const PaymentTermsConfig: FormConfig = {
  fnc_name: 'fnc_credit_note',
  title: 'Nota de crédito',
  dsc: 'Nota de crédito',
  dsc_view: 'name',
  module: ModulesEnum.INVOICING,
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '',
  item_url: '',
  new_url: '',
  isFavoriteColumn: false,
  formTitle: '',

  fnc_valid: (data) => {
    if (!data['name']) {
      return null
    }
    return data
  },

  default_values: {
    date: '',
    name: '',
    payment_method: '',
    customer: '',
    import: '',
    state: '',
  },
  grid: {
    idRow: 'payment_id',
    col_name: 'name',
  },

  visibility_columns: {},

  filters: [],

  filters_columns: [],

  group_by: [],

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
