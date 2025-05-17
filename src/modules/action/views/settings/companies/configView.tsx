import { useEffect, useRef, useState } from 'react'
import { AutocompleteControlled, ImageInput, TextControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import { frmElementsProps } from '@/shared/shared.types'
import AddressField from '@/shared/components/extras/AddressField'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { GrDrag } from 'react-icons/gr'
import { Chip } from '@mui/material'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import clsx from 'clsx'
import Sortable from 'sortablejs'
import { FrmBaseDialog } from '@/shared/components/core'
import companyConfig from '@/modules/action/views/settings/modal-company/config'

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

export function FrmTab1() {
  const tableRef = useRef<HTMLTableSectionElement | null>(null)
  const { formItem, openDialog, closeDialogWithData, executeFnc, newAppDialogs } = useAppStore()

  const [data, setData] = useState([])
  const [setModifyData] = useState<boolean>(false)
  const sortableRef = useRef<Sortable | null>(null)
  useEffect(() => {
    setData(formItem?.companies)
  }, [formItem])

  useEffect(() => {
    if (tableRef.current) {
      if (sortableRef.current) {
        sortableRef.current.destroy()
      }

      sortableRef.current = Sortable.create(tableRef.current, {
        animation: 150,
        handle: '.drag-handle',
        ghostClass: 'bg-white',
        onEnd: (event) => {
          const oldIndex = event.oldIndex!
          const newIndex = event.newIndex!
          setData((prevData: any) => {
            const newData = [...prevData]
            const [movedItem] = newData.splice(oldIndex, 1)
            newData.splice(newIndex, 0, movedItem)
            return newData.map((item) => ({
              ...item,
            }))
          })
          setModifyData(true)
        },
      })
    }
  }, [data])
  console.log('newAppDialogs', newAppDialogs)
  const columns = [
    {
      id: `drag`,
      size: 10,
      header: '',
      cell: () => (
        <div className="flex" key={`drag-${crypto.randomUUID()}`}>
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
        <div className="flex flex-col gap-2">{row.original.name}</div>
      ),
    },
    {
      header: 'Contacto',
      accessorKey: 'name',
      size: 100,
      cell: ({ row }: { row: any; column: any }) => (
        <div className="flex flex-col gap-2 ">{row.original.name}</div>
      ),
    },
    {
      header: 'Sucursales',
      accessorKey: 'companies',
      size: 100,
      cell: ({ row }: { row: any; column: any }) => (
        <div className="flex flex-col gap-2 ">
          {row.original?.companies?.map((company) => (
            <>
              <Chip key={company.company_id} label={company.name} size="small" className="ml-1" />
            </>
          ))}
        </div>
      ),
    },
  ]
  const addRow = () => {
    let getData = () => ({})
    console.log(getData)
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
              //const formData = getData()
              console.log('newAppDialogs', newAppDialogs)
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

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: 'onEnd',
    columnResizeDirection: 'ltr',
    enableColumnResizing: true,
  })

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
    <div className="flex flex-col gap-4 py-4 ">
      <div className="flex flex-col gap-4">
        <table className="w-full border-[#BBB] border relative">
          <thead className="h-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`text-left font-bold relative ${
                      header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                    }`}
                    style={{ width: header.getSize() }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div
                      className={clsx(
                        'flex items-center gap-2',
                        header.column.getIsSorted() && 'justify-between'
                      )}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <FaChevronUp />,
                        desc: <FaChevronDown />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                    <div
                      {...{
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`,
                      }}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody ref={tableRef}>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.original?.company_id}
                className="h-10 border-y-[#BBB] border-y-[1px] cursor-pointer"
                onClick={() => fnc_open_company_modal(row.original.company_id)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={columns[0].id}
                    style={{ width: row.getVisibleCells()[0].column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-4 pb-4 pl-4">
          <button type="button" className="text-[#017e84] hover:text-[#017e84]/80" onClick={addRow}>
            Agregar línea
          </button>
        </div>
      </div>
    </div>
  )
}
