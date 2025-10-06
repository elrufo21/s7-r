import {
  ActionTypeEnum,
  FormConfig,
  ItemStatusTypeEnum,
  ModulesEnum,
  ViewTypeEnum,
} from '@/shared/shared.types'
import {
  FrmPhoto,
  FrmTab0,
  FrmTitle,
  Subtitle,
} from '@/modules/action/views/settings/users/configView'
import { Chip } from '@mui/material'
import { Row } from '@tanstack/react-table'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'

const UsersConfig: FormConfig = {
  fnc_name: 'fnc_user',
  title: 'Usuarios',
  dsc: 'Nombre',
  dsc_view: 'name',
  views: [ViewTypeEnum.KANBAN, ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  item_url: '/action/903/detail',
  module_url: '/action/903',
  visibility_columns: {},
  module: ModulesEnum.POINTS_OF_SALE,
  new_url: '/action/903/detail/new',
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
  fnc_valid: (data) => {
    if (!data['name']) {
      return null
    }
    const newData = {
      partner_id: data.partner_id,
      email: data.email,
      name: data.name,
      data_image: data.data_image,
      group_id: data.group_id,
      state: data.state,
      phone: data.phone,
      user: [
        {
          action: data.partner_id ? ActionTypeEnum.UPDATE : ActionTypeEnum.INSERT,
          user_id: data.user_id,
          email: data.email,
          default_company_id: data.default_company_id,
          group_id: data.group_id,
          state: data.state,
          companies_change: data.companies_change,
          companies: data.companies.map((company: any) => ({
            company_id: company.company_id,
          })),
        },
      ],
    }

    return newData
  },

  default_values: {
    user_id: null,
    group_id: null,
    state: ItemStatusTypeEnum.ACTIVE,
    user_auth_id: null,
    partner_id: null,
    email: '',
    phone: '',
    default_company_id: null,
    user_companies: [],
    companies_change: false,
  },

  grid: {
    isDragable: false,
    idRow: 'partner_id',
    col_name: 'name',

    list: {
      columns: [
        {
          header: 'Nombre',
          accessorKey: 'name',
          align: 'left',
        },
        {
          header: 'Iniciar sesión',
          accessorKey: 'email',
          size: 250,
        },
        {
          header: 'Autenticación más reciente',
          accessorKey: '',
          size: 200,
        },
        {
          header: 'Empresa',
          accessorKey: 'default_company_name',
          size: 200,
        },
        {
          header: 'Estado',
          accessorKey: 'email_status',
          size: 150,
          cell: ({ row }: { row: Row<any> }) => {
            const state = row.original.verified
            const deffineLabel = (state: string) => {
              if (state) return 'Confirmado'
              else return 'Sin confirmar'
            }
            return (
              <div>
                <Chip
                  label={deffineLabel(state)}
                  color={state ? 'primary' : 'error'}
                  size="small"
                  className={`h-auto`}
                />
              </div>
            )
          },
        },
      ],
    },
  },

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

  group_by: [
    {
      list: [
        {
          title: 'Empresa',
          key: 'default_company_name',
          key_gby: 'default_company_id',
        },
      ],
    },
  ],

  filters_columns: [
    {
      dsc: 'Usuario',
      key: 'name',
      default: true,
    },
    {
      dsc: 'Empresa',
      key: 'company',
      default: false,
    },
  ],

  configControls: {},

  form_inputs: {
    imagenFields: ['data_img'],
    auditoria: false,

    frm_photo: ({ watch, control, errors, editConfig = {}, setValue, frmState }) => (
      <FrmPhoto
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
        editConfig={editConfig}
        frmState={frmState}
      />
    ),
    frm_title: ({ watch, control, errors, editConfig = {}, setValue, frmState }) => (
      <FrmTitle
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
        editConfig={editConfig}
        frmState={frmState}
      />
    ),
    frm_sub_title: ({ watch, control, errors, editConfig = {}, setValue, frmState }) => (
      <Subtitle
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
        editConfig={editConfig}
        frmState={frmState}
      />
    ),

    tabs: [
      {
        name: 'Permisos de acceso',
        content: ({ watch, control, errors, editConfig = {}, setValue, frmState }) => (
          <FrmTab0
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            editConfig={editConfig}
            frmState={frmState}
          />
        ),
      },
    ],
  },
}

export default UsersConfig
