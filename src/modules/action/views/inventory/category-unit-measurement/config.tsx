import { ViewTypeEnum, FormConfig, ModulesEnum, ItemStatusTypeEnum } from '@/shared/shared.types'
import { FrmMiddle, FrmTab1 } from './configView'
import { Chip } from '@mui/material'
import { Row } from '@tanstack/react-table'
import { RowData, Unit } from './unitMeasurement.type'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'

const UnitMeasurementConfig: FormConfig = {
  fnc_name: 'fnc_uom_category',
  title: 'Categorías de las unidades de medida',
  dsc: 'Categoría de unidades de medida',
  dsc_view: 'name',
  module: ModulesEnum.INVOICING,
  views: [ViewTypeEnum.LIST],
  view_default: ViewTypeEnum.LIST,
  module_url: '/action/90',
  item_url: '/action/90/detail',
  new_url: '/action/90/detail/new',
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
    //const hasErrors = data.units.some((unit: any) => !unit.name || !unit.factor || !unit.rounding)

    const processedUnits = data.units.map(({ ...unit }: Unit) => ({
      ...unit,
      state: unit.state ? ItemStatusTypeEnum.ACTIVE : ItemStatusTypeEnum.INACTIVE,
      group_id: null,
    }))

    const {
      copy_id,
      copied_id,
      creation_date,
      creation_user,
      modification_date,
      modification_user,
      ...filteredData
    } = {
      ...data,
      state: data.state ? ItemStatusTypeEnum.ACTIVE : ItemStatusTypeEnum.INACTIVE,
      units: processedUnits,
      group_id: null,
    }
    return filteredData
  },

  default_values: {
    category_id: null,
    name: '',
    units: [],
    state: 'A',
  },
  grid: {
    idRow: 'category_id',
    col_name: 'name',
    isDragable: false,
    list: {
      columns: [
        {
          header: 'Categoría de unidad de medida',
          accessorKey: 'name',
          meta: { align: 'text-center' },
        },
        {
          header: 'Unidad de medida',
          accessorKey: 'units',
          cell: ({ row }: { row: Row<RowData> }) => {
            return (
              <div className="flex">
                {row.original.units.map((unit: Unit) => (
                  <div>
                    <Chip
                      key={unit.value}
                      label={unit.label}
                      size="small"
                      sx={{ backgroundColor: unit.type === '1' ? '#89e1db' : '' }}
                      className="ml-1"
                    />{' '}
                  </div>
                ))}
              </div>
            )
          },
        },
      ],
    },
  },
  visibility_columns: {},
  filters: [],
  group_by: [],
  filters_columns: [],
  configControls: {},
  form_inputs: {
    imagenFields: [],
    auditoria: false,
    frm_title: ({ control, errors, watch, setValue, editConfig = {} }) => (
      <FrmMiddle
        setValue={setValue}
        watch={watch}
        control={control}
        errors={errors}
        editConfig={editConfig}
      />
    ),
    tabs: [
      {
        name: 'Unidades de medida',
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
    ],
  },
}

export default UnitMeasurementConfig
