import { ViewTypeEnum, FormConfig, ModulesEnum } from '@/shared/shared.types'
import { FrmPhoto, FrmTab0, FrmTab1, FrmTitle } from './configView'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'
import { Chip } from '@mui/material'

const CompaniesConfig: FormConfig = {
  fnc_name: 'fnc_company',
  title: 'Empresas',
  module: ModulesEnum.SETTINGS,
  dsc: 'Nombre de la empresa',
  dsc_view: 'name',
  views: [ViewTypeEnum.KANBAN, ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  new_url: '/action/4/detail/new',
  module_url: '/action/4',
  item_url: '/action/4/detail',
  visibility_columns: {},

  fnc_valid: (data: any) => {
    /**
     * 
    const flattenBranches = (branches: any[], result: any[] = []) => {
      branches.forEach((branch) => {
        const { branches: childBranches, ...branchData } = branch

        result.push(branchData)

        if (childBranches?.length) {
          flattenBranches(childBranches, result)
        }
      })

      return result
    }
    const newDataToSend = {
      partner_id: data.partner_id,
      name: data.name,
      data_image: data.image,
      email: data.email,
      company: {
        company_id: data.company_id,
        name: data.name,
        street: data.street,
        street_2: data.street_2,
        ln1_id: data.ln1_id,
        ln2_id: data.ln2_id,
        ln3_id: data.ln3_id,
        ln4_id: data.ln4_id,
        telf: data.telf,
        movil: data.movil,
        email: data.email,
        web: data.web,
        branches: flattenBranches(formItem.branches),
      },
    }
     */
    return data
  },

  default_values: {
    company_id: 'N1-1',
    parent_id: null,
    level: 1,
    state: StatusContactEnum.UNARCHIVE,
    data_img: null,
    nif: '',
    currency_id: null,
    name: '',
    branches: [],
    street: '',
    street_2: '',
    ln1_id: null,
    ln2_id: null,
    ln3_id: null,
    zip: '',
    telf: '',
    movil: '',
    email: '',
    web: '',
  },

  grid: {
    isDragable: true,
    idRow: 'partner_id',
    col_name: 'name',

    list: {
      columns: [
        {
          header: 'Nombre de la empresa',
          accessorKey: 'name',
          align: 'left',
          size: 120,
        },
        {
          header: 'Contacto',
          accessorKey: 'full_name',
          align: 'left',
          size: 120,
        },
        {
          header: 'Sucursales',
          accessorKey: 'companies',
          cell: (row: any) => {
            return row.row.original?.['companies'].map((company: any) => (
              <Chip key={company.company_id} label={company.name} size="small" className="ml-1" />
            ))
          },
          align: 'left',
          size: 150,
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

export default CompaniesConfig
