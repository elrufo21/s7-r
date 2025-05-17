import { address_topTitleOptions } from '@/modules/contacts/constants'
import { FormConfig, ModulesEnum, ViewTypeEnum } from '@/shared/shared.types'
import { Frm_Top_Title, Frm_Middle_Left, Frm_Middle_Right, Frm_Middle_Bottom } from './configView'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'

const ModalContactConfig: FormConfig = {
  title: 'Contactos y dirección',
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
    company_id: null,
    state: StatusContactEnum.UNARCHIVE,
    type: 'C',
    name: '',
    files: null,
    identification_type_id: null,
    identification_number: '',
    partner_id_rel: null,
    address_type: 'CO',
    street: '',
    street_2: '',
    location_sl1_id: null,
    location_sl2_id: null,
    location_sl3_id: null,
    location_l3_name: null,
    location_sl2_name: null,
    location_sl3_name: null,
    dsc_ubigeo: null,
    zip: '',
    location_country_id: null,
    workstation: '',
    phone: '',
    mobile: '',
    email: '',
    website: '',
    title_id: null,
    categories: [],
    list_contacts: [],
    customer_payment_term_id: null,
    price_list_id: null,
    supplier_payment_term_id: null,
    barcode: '',
    fiscal_position_id: null,
    reference: '',
    industry_id: null,
    internal_notes: '',
  },

  grid: {
    idRow: 'partner_id',
    col_name: 'name',
  },

  configControls: {},

  form_inputs: {
    auditoria: false,
    imagenFields: [],
    frm_top_title: ({ control, editConfig = {}, frmState }) => (
      <Frm_Top_Title
        control={control}
        editConfig={editConfig}
        options={address_topTitleOptions}
        frmState={frmState}
      />
    ),
    frm_middle: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <Frm_Middle_Left
        setValue={setValue}
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
      />
    ),
    frm_middle_right: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <Frm_Middle_Right
        setValue={setValue}
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
      />
    ),
    frm_middle_bottom: ({ watch, control, errors, editConfig = {}, setValue }) => (
      <Frm_Middle_Bottom
        control={control}
        errors={errors}
        editConfig={editConfig}
        watch={watch}
        setValue={setValue}
      />
    ),
  },
}

export default ModalContactConfig
