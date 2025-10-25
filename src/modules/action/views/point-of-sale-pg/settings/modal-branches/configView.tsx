import { useEffect, useState } from 'react'
import { AutocompleteControlled, ImageInput, TextControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import { frmElementsProps } from '@/shared/shared.types'

import AddressField from '@/shared/components/extras/AddressField'

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

  // const Paises= fnc_em_ct_ubi_pais

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
                  name={'telf'}
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
                  name={'movil'}
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
                  name={'web'}
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
  console.log(watch())
  /**
   *
   * const appDialogs = useAppStore((state) => state.appDialogs)
  const setFrmDialogItem = useAppStore((state) => state.setFrmDialogItem)
  const setFrmDialogAction = useAppStore((state) => state.setFrmDialogAction)
  const setFormItem = useAppStore((state) => state.setFormItem)
  const formItem = useAppStore((state) => state.formItem)
  const [branches, setBranches] = useState<any>([])
  const saveDialogForm = (dialog: Dialog, createOne: boolean) => {
    setFrmDialogItem(null)
    setFrmDialogAction({ action: 'save-temp-branches', dialog })

    setTimeout(() => {
      if (createOne) {
        setAppDialogs([
          {
            title: 'Otro contacto',
            content: (fnClose) => (
              <FrmBaseDialog
                config={ModalBranchesConfig}
                fnClose={fnClose}
                parent_id={`temp-${formItem.branches.length + 1}`}
              />
            ),
            open: true,
            type: 'form',
            afterSave: () => {},
            onConfirm: saveDialogForm,
            onSaveandCreate: saveDialogForm,
            buttonActions: [
              ButtonOptions.SAVE_AND_CLOSE,
              ButtonOptions.SAVE_AND_CREATE,
              ButtonOptions.DISCARD,
            ],
          },
        ])
      }
    }, 100)
  }

  useEffect(() => {
    const company_id = appDialogs[appDialogs.length - 1]?.company_id

    if (formItem?.branches) {
      const findBranches = (branches: any[]): any[] => {
        return branches.flatMap((branch) => {
          if (branch.company_id === company_id) {
            // Filtrar los branches internos con nivel definido
            const filtered = branch.branches?.filter((b: any) => b.level) || []

            // Recursión para buscar más ramas en niveles inferiores
            return [...filtered, ...findBranches(branch.branches || [])]
          }
          return findBranches(branch.branches || [])
        })
      }

      setBranches(findBranches(formItem.branches))
    }
  }, [appDialogs, formItem?.branches])

  const addBranches = () => {
    const idTemporary = crypto.randomUUID()
    const parentId = appDialogs[appDialogs.length - 1]?.company_id

    const newBranch = { company_id: idTemporary, branches: [] }

    const insertBranch = (branches: any) =>
      branches.map((branch: any) =>
        branch.company_id === parentId
          ? { ...branch, branches: [...(branch.branches || []), newBranch] }
          : { ...branch, branches: insertBranch(branch.branches || []) }
      )

    const updatedBranches = parentId
      ? insertBranch(formItem.branches || [])
      : [...(formItem.branches || []), newBranch]

    setFormItem({ ...formItem, branches: updatedBranches })

    setAppDialogs([
      ...appDialogs,
      {
        title: 'Crear Sucursales',
        content: (fnClose) => (
          <FrmBaseDialog
            config={ModalBranchesConfig}
            fnClose={fnClose}
            watch={watch}
            parent_id={parentId}
            values={[]}
          />
        ),
        open: true,
        type: 'form',
        afterSave: () => {},
        company_id: idTemporary,
        onConfirm: saveDialogForm,
        onSaveandCreate: (dialog: Dialog) => saveDialogForm(dialog, true),
        buttonActions: [
          ButtonOptions.SAVE_AND_CLOSE,
          ButtonOptions.SAVE_AND_CREATE,
          ButtonOptions.DISCARD,
        ],
      },
    ])
  }

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre de la empresa',
        size: 200,
        cell: ({ row }: { row: Row<any>; column: Column<any> }) => {
          return (
            <div className="" onClick={() => addBranches()}>
              {row.original.name}
            </div>
          )
        },
      },
      {
        accessorKey: 'telf',
        header: 'Sucursales',
        size: 200,
      },
      {
        id: 'config',
        header: '',
        align: 'right',
        size: 50,
        cell: ({ row }) => {
          return (
            <FaRegTrashAlt
              className="hover:text-red-600 cursor-pointer"
              onClick={() => console.log('ideliminar', row.original.company_id)}
            />
          )
        },
      },
    ],
    []
  )
  return (
    <div className="flex flex-col gap-4">
      <DndTable id="id_cba" data={branches} setData={() => {}} columns={columns}>
        {(table) => (
          <tr
            style={{ height: '42px' }}
            className="group list-tr options border-gray-300 hover:bg-gray-200 border-t-black border-t-[1px]"
          >
            <td
              colSpan={
                table.getRowModel().rows[0]
                  ? table.getRowModel().rows[0]?.getVisibleCells().length - 1
                  : 10
              }
              className="w-full"
            >
              <div className="flex gap-4">
                <button type="button" className="text-[#017E84]" onClick={() => addBranches()}>
                  Agregar línea
                </button>
              </div>
            </td>
          </tr>
        )}
      </DndTable>
    </div>
  )
   */

  return <></>
}
