import { ViewTypeEnum, FormConfig, ModulesEnum } from '@/shared/shared.types'
import { FrmPhoto, FrmTab0, FrmTab1, FrmTitle } from './configView'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'

const ModalBranchesConfig: FormConfig = {
  fnc_name: 'fnc_company',
  title: 'Empresas',
  module: ModulesEnum.SETTINGS,
  dsc: 'Nombre de la empresa',
  dsc_view: 'company_name',
  views: [ViewTypeEnum.KANBAN, ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  new_url: '/action/4/detail/new',
  module_url: '/action/4',
  item_url: '/action/4/detail',
  visibility_columns: {},

  fnc_valid: (data: any) => {
    if (!data['company_name']) {
      return null
    }
    return data
  },

  default_values: {
    company_id: null,
    state: StatusContactEnum.UNARCHIVE,
    data_img: null,
    cod_tdir: '',
    nif: '',
    currency_id: null,
    name: '',
    calle: '',
    calle2: '',
    location_l3_id: null,
    location_l2_id: null,
    location_l1_id: null,
    cp: '',
    location_country_id: null,
    telf: '',
    movil: '',
    email: '',
    web: '',
  },

  grid: {
    idRow: 'company_id',
    col_name: 'name',
    isDragable: true,

    list: {
      columns: [
        {
          header: 'Nombre de la compañía',
          accessorKey: 'name',
          align: 'left',
        },
        {
          header: 'Sucursales',
          accessorKey: '',
          size: 120,
        },
      ],
    },
  },

  filters: [
    {
      list: [
        {
          group: 'status',
          key: 'status_I',
          title: 'Archivado',
          value: 'I',
          type: 'check',
        },
      ],
    },
  ],

  group_by: [],

  filters_columns: [
    {
      dsc: 'Nombre de la empresa',
      key: 'company_name',
      default: true,
    },
  ],

  configControls: {},

  form_inputs: {
    imagenFields: ['data_img'],
    auditoria: true,

    frm_photo: ({ control, errors, watch, setValue, editConfig = {}, frmState }) => (
      <FrmPhoto
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        frmState={frmState}
        setValue={setValue}
      />
    ),

    frm_title: ({ control, errors, watch, setValue, editConfig = {}, frmState }) => (
      <FrmTitle
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
        frmState={frmState}
        setValue={setValue}
      />
    ),

    tabs: [
      {
        name: 'Información general',
        content: ({ control, errors, watch, setValue, editConfig = {}, frmState }) => (
          <FrmTab0
            watch={watch}
            control={control}
            errors={errors}
            setValue={setValue}
            editConfig={editConfig}
            frmState={frmState}
          />
        ),
      },
      {
        name: 'Sucursales',
        content: ({ control, errors, watch, setValue, editConfig = {}, frmState }) => (
          <FrmTab1
            watch={watch}
            control={control}
            errors={errors}
            setValue={setValue}
            editConfig={editConfig}
            frmState={frmState}
          />
        ),
      },
    ],
  },
}

export default ModalBranchesConfig
