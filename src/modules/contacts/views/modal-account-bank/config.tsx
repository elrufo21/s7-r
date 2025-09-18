import { FormConfig, ModulesEnum, ViewTypeEnum } from '@/shared/shared.types'
import { FrmMiddle, FrmMiddleRight } from './configView'

const ModalAccountBankConfig: FormConfig = {
  title: 'Cuentas bancarias',
  dsc: 'Contactos y dirección',
  views: [],
  view_default: ViewTypeEnum.FORM,
  module: ModulesEnum.CONTACTS,
  fnc_name: 'fnc_partner',
  new_url: '',
  dsc_view: '',
  filters: [],
  filters_columns: [],
  item_url: '',
  module_url: '',
  visibility_columns: {},

  fnc_valid: (data: any) => {
    if (data['type'] === 'C') {
      data['partner_id_rel'] = null
    }
    if (!data['name']) {
      return null
    }
    return data
  },

  default_values: {
    bank_id: null,
    bank_account_id: null,
    company_id: null,
    partner_id: null,
    currency_id: null,
    state: '',
    company_name: '',
    name: '',
    currency_name: '',
    bank_name: '',
    number: '',
  },

  grid: {
    idRow: 'partner_id',
    col_name: 'name',
  },

  configControls: {},

  form_inputs: {
    imagenFields: ['files'],
    auditoria: true,
    preserveTagPlaceholder: false,
    frm_middle: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmMiddle
        setValue={setValue}
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
      />
    ),
    frm_middle_right: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <FrmMiddleRight
        setValue={setValue}
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
      />
    ),
  },
}

export default ModalAccountBankConfig
