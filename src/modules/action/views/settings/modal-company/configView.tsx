import { useEffect, useMemo, useState } from 'react'
import { AutocompleteControlled, ImageInput, TextControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import { frmElementsProps } from '@/shared/shared.types'
import AddressField from '@/shared/components/extras/AddressField'
import { ColumnDef } from '@tanstack/react-table'
import { GrDrag } from 'react-icons/gr'
import { Chip } from '@mui/material'
import { FrmBaseDialog } from '@/shared/components/core'
import companyConfig from '@/modules/action/views/settings/modal-company/config'
import { DndTable } from '@/shared/components/table/DndTable'

export function FrmPhoto({ watch, setValue, control, editConfig }: frmElementsProps) {
  return (
    <div className="o_field_widget o_field_image oe_avatar">
      <ImageInput
        watch={watch}
        setValue={setValue}
        name={'data_img'}
        control={control}
        editConfig={{ config: editConfig }}
      />
    </div>
  )
}

export function FrmTitle({ control, errors, editConfig }: frmElementsProps) {
  const style = {
    fontSize: 26,
    lineHeight: '38px',
    color: '#111827',
  }
  return (
    <>
      <TextControlled
        name={'name'}
        control={control}
        errors={errors}
        placeholder={'por ejemplo, Mi empresa'}
        style={style}
        multiline={true}
        editConfig={{ config: editConfig }}
      />
    </>
  )
}

export function FrmTab0({ control, errors, editConfig, setValue, watch }: frmElementsProps) {
  const createOptions = useAppStore((state) => state.createOptions)
  const formItem = useAppStore((state) => state.formItem)

  const [Divisas, setDivisas] = useState<{ label: string; value: string }[]>([])
  const cargaData_Divisas = async () => {
    let lDivisas = await createOptions({
      fnc_name: 'fnc_currency',
      action: 's2',
    })
    setDivisas(lDivisas)
  }

  //Ubicar descripciones a campos con valor
  const cargaData = () => {
    if (formItem['currency_id']) {
      setDivisas([
        {
          value: formItem['currency_id'],
          label: formItem['currency_name'],
        },
      ])
    }
  }

  useEffect(() => {
    if (formItem) {
      cargaData()
    }
  }, [formItem])
  return (
    <div className="o_group mt-4">
      <div className="lg:w-1/2">
        <div className="o_inner_group grid">
          <div className="d-sm-contents">
            {/* <div className="o_cell o_wrap_label"> */}
            <div className="o_cell">
              <label className="o_form_label">Dirección</label>
            </div>
            <AddressField
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
              watch={watch}
              setValue={setValue}
            />
          </div>

          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Código de tipo de dirección</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <TextControlled
                  name={'cod_tdir'}
                  control={control}
                  errors={errors}
                  multiline={true}
                  placeholder={''}
                  editConfig={{ config: editConfig }}
                />
              </div>
            </div>
          </div>
          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">NIF</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <TextControlled
                  name={'nif'}
                  control={control}
                  errors={errors}
                  placeholder={''}
                  editConfig={{ config: editConfig }}
                />
              </div>
            </div>
          </div>

          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Moneda</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <AutocompleteControlled
                  name={'currency_id'}
                  placeholder={''}
                  control={control}
                  errors={errors}
                  options={Divisas}
                  // fnc_create={fnc_create}
                  // createOpt={true}
                  // editOpt={true}
                  // frmSearch={() => (<FrmSearch />)}
                  fnc_loadOptions={cargaData_Divisas}
                  // enlace={true}
                  // fnc_enlace={fnc_enlace}
                  editConfig={{ config: editConfig }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-1/2">
        <div className="o_inner_group grid">
          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Teléfono</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <TextControlled
                  name={'phone'}
                  control={control}
                  errors={errors}
                  multiline={true}
                  placeholder={''}
                  editConfig={{ config: editConfig }}
                />
              </div>
            </div>
          </div>
          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Móvil</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <TextControlled
                  name={'mobile'}
                  control={control}
                  errors={errors}
                  placeholder={''}
                  editConfig={{ config: editConfig }}
                />
              </div>
            </div>
          </div>
          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Correo electrónico</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <TextControlled
                  name={'email'}
                  control={control}
                  errors={errors}
                  placeholder={''}
                  editConfig={{ config: editConfig }}
                />
              </div>
            </div>
          </div>
          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Sitio web</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <TextControlled
                  name={'website'}
                  control={control}
                  errors={errors}
                  placeholder={'p. ej. https://www.system.com'}
                  editConfig={{ config: editConfig }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FrmTab1({ watch }: frmElementsProps) {
  const { openDialog, closeDialogWithData, executeFnc, newAppDialogs } = useAppStore()

  const [data, setData] = useState([])
  useEffect(() => {
    setData(watch('companies'))
  }, [watch('companies')])

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: `drag`,
        size: 40,
        header: '',
        cell: () => (
          <div className="flex justify-center items-center" key={`drag-${crypto.randomUUID()}`}>
            <span className="drag-handle cursor-grab">
              <GrDrag />
            </span>
          </div>
        ),
      },
      {
        header: 'Nombre de la empresa',
        accessorKey: 'name',
        size: 100,
        cell: ({ row }: { row: any; column: any }) => (
          <div
            className="flex flex-col gap-2 "
            onClick={() => {
              fnc_open_company_modal(row.original.company_id)
            }}
          >
            {row.original.name}
          </div>
        ),
      },
      {
        header: 'Contacto',
        accessorKey: 'name',
        size: 100,
        cell: ({ row }: { row: any; column: any }) => (
          <div
            className="flex flex-col gap-2 "
            onClick={() => {
              fnc_open_company_modal(row.original.company_id)
            }}
          >
            {row.original.name}
          </div>
        ),
      },
      {
        header: 'Sucursales',
        accessorKey: 'companies',
        size: 100,
        cell: ({ row }: { row: any; column: any }) => (
          <div
            className="flex flex-col gap-2 "
            onClick={() => {
              fnc_open_company_modal(row.original.company_id)
            }}
          >
            {row.original?.companies?.map((company: any) => (
              <>
                <Chip key={company.company_id} label={company.name} size="small" className="ml-1" />
              </>
            ))}
          </div>
        ),
      },
    ],
    [data]
  )
  const addRow = () => {
    let getData = () => ({})
    const dialogId = openDialog({
      title: 'Crear compañia',
      parentId: crypto.randomUUID(),
      dialogContent: () => (
        <FrmBaseDialog config={companyConfig} setGetData={(fn: any) => (getData = fn)} />
      ),
      buttons: [
        {
          text: 'Guardar y cerrar',
          type: 'confirm',
          onClick: async () => {
            try {
              const formData = getData()
              console.log('newAppDialogs', newAppDialogs, formData)
              //  setData([...data, formData])
              closeDialogWithData(dialogId, {})
            } catch (error) {
              console.error(error)
            }
          },
        },
      ],
    })
  }

  const fnc_open_company_modal = async (company_id: number) => {
    const { oj_data } = await executeFnc('fnc_company', 's1', [String(company_id)])

    let getData = () => ({})
    console.log(getData)

    const dialogId = openDialog({
      title: 'Company',
      dialogContent: () => (
        <FrmBaseDialog
          config={companyConfig}
          initialValues={oj_data[0]}
          setGetData={(fn: any) => (getData = fn)}
        />
      ),
      buttons: [
        {
          text: 'Guardar y cerrar',
          type: 'confirm',
          onClick: async () => {
            try {
              //const formData = getData()
              // const response = await executeFnc('fnc_company', 'i', formData)
              // const company_id = response.oj_data?.company_id
              console.log('newAppDialogs', newAppDialogs)
              closeDialogWithData(dialogId, {})
            } catch (error) {
              console.error(error)
            }
          },
        },
      ],
    })
  }

  return (
    <DndTable data={data} setData={setData} columns={columns} id="company_id">
      {(table) => (
        <tr
          style={{ height: '42px' }}
          className="group list-tr options border-gray-300 hover:bg-gray-200 border-t-black border-t-[1px]"
        >
          <td></td>
          <td
            colSpan={
              table.getRowModel().rows[0]
                ? table.getRowModel().rows[0]?.getVisibleCells().length - 1
                : 10
            }
            className="w-full"
          >
            <div className="flex gap-4">
              <button
                type="button"
                className="text-[#017e84] hover:text-[#017e84]/80"
                onClick={addRow}
              >
                Agregar línea
              </button>
            </div>
          </td>
        </tr>
      )}
    </DndTable>
  )
}
