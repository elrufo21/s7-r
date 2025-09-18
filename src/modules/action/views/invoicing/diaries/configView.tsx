import { useCallback, useMemo, useEffect, useState, useRef, memo } from 'react'
import Custom_field_currency from '@/shared/components/extras/custom_field_currency'
import { ActionTypeEnum, FormActionEnum, frmElementsProps } from '@/shared/shared.types'
import {
  AutocompleteControlled,
  AutocompleteTable,
  CheckBoxControlled,
  SelectControlled,
  TextControlled,
} from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import { TypeDiaryEnum, TypePrefixEnum } from './DiariesTypes'
import { ColumnDef } from '@tanstack/react-table'
import { GrDrag } from 'react-icons/gr'
import { GrTrash } from 'react-icons/gr'
import { DndTable } from '@/shared/components/table/DndTable'
import { required } from '@/shared/helpers/validators'
import { useLocation } from 'react-router-dom'
import { SwitchableTextField } from '@/shared/components/table/drag-editable-table/base-components/inputs'
import useUserStore from '@/store/persist/persistStore'
import CfCompany from '@/shared/components/extras/Cf_company'
export function FrmTitle({ control, errors, editConfig }: frmElementsProps) {
  return (
    <TextControlled
      name={'name'}
      className={'frm_dsc'}
      placeholder={'Seleccione un tipo'}
      multiline={true}
      control={control}
      rules={required()}
      errors={errors}
      editConfig={{ config: editConfig }}
    />
  )
}

export function FrmMiddle({ control, errors, editConfig, setValue, watch }: frmElementsProps) {
  const { pathname } = useLocation()
  const { setHiddenTabs, formItem, setTabForm, dataListShow, setFrmIsChanged, frmAction } =
    useAppStore()
  /*
  const getTotalByType = async (type: TypeDiaryEnum) => {
    const res = await executeFnc('fnc_journal', 's4', [{ column: 'type', value: type }])
    return res?.oj_data.total
  }*/

  useEffect(() => {
    if (frmAction === FormActionEnum.UNDO) {
      setFrmIsChanged(false)
    }
  }, [frmAction])
  useEffect(() => {
    if (pathname.includes('new')) {
      setHiddenTabs(['Pagos Entrantes', 'Pagos Salientes'])
    }
  }, [])

  const type = watch('type')
  const frmChange = watch('frm_change')
  const methodsIn = watch('payment_methods_in') || formItem?.payment_methods_in
  const methodsOut = watch('payment_methods_out') || formItem?.payment_methods_out
  useEffect(() => {
    const setDefaultDocs = () => {
      setValue('use_documents', true)
      setValue('refund_sequence', false)
      setValue('debit_sequence', false)
      setValue('payment_sequence', false)
    }

    const setDefaultPaymentMethods = (field: 'payment_methods_in' | 'payment_methods_out') => {
      setValue(field, [
        {
          name: 'Pago manual',
          default_extra_price: '',
          payment_method_type_id: 1,
          action: ActionTypeEnum.INSERT,
          payment_method_id: crypto.randomUUID(),
          order_id: 1,
        },
      ])
    }

    switch (type) {
      case TypeDiaryEnum.SALES:
      case TypeDiaryEnum.SHOPPING:
        setHiddenTabs(['Pagos Entrantes', 'Pagos Salientes'])
        if (type !== TypeDiaryEnum.SALES) {
          setHiddenTabs(['Pagos Entrantes', 'Pagos Salientes', 'Ajustes avanzados'])
          setValue('reference_type', null)
          setValue('reference_model', null)
        }
        if ((!pathname.includes('new') && !frmChange) || frmAction === FormActionEnum.UNDO) {
          setValue('use_documents', formItem?.use_documents ?? true)
          setValue('refund_sequence', formItem?.refund_sequence ?? false)
          setValue('debit_sequence', formItem?.debit_sequence ?? false)
          setValue('payment_sequence', formItem?.payment_sequence ?? false)
          setValue('frm_change', true)
          break
        }
        setDefaultDocs()

        setValue('payment_methods_in', [])
        setValue('payment_methods_out', [])
        break

      case TypeDiaryEnum.CASH:
      case TypeDiaryEnum.BANK:
      case TypeDiaryEnum.CREDIT_CARD:
        setHiddenTabs(['Ajustes avanzados'])
        setValue('reference_type', null)
        setValue('reference_model', null)
        setValue('use_documents', false)
        setValue('payment_sequence', true)
        setValue('refund_sequence', false)
        setValue('debit_sequence', false)
        if (
          formItem?.payment_methods_in?.length === 0 ||
          methodsIn?.length === 0 ||
          frmChange ||
          !formItem?.payment_methods_in?.length
        ) {
          setDefaultPaymentMethods('payment_methods_in')
        }
        if (
          formItem?.payment_methods_out?.length === 0 ||
          methodsOut?.length === 0 ||
          frmChange ||
          !formItem?.payment_methods_out?.length
        ) {
          setDefaultPaymentMethods('payment_methods_out')
        }

        break
      case TypeDiaryEnum.SEVERAL:
        setHiddenTabs(['Pagos Entrantes', 'Pagos Salientes', 'Ajustes avanzados'])
        setValue('reference_type', null)
        setValue('reference_model', null)
        setValue('use_documents', false)
        setValue('payment_sequence', false)
        setValue('refund_sequence', false)
        setValue('debit_sequence', false)
        break
    }

    if ([TypeDiaryEnum.SALES, TypeDiaryEnum.SHOPPING, TypeDiaryEnum.SEVERAL].includes(type)) {
      setTabForm(0)
    }

    const prefixMap: Record<TypeDiaryEnum, TypePrefixEnum> = {
      [TypeDiaryEnum.SALES]: TypePrefixEnum.SALES,
      [TypeDiaryEnum.SHOPPING]: TypePrefixEnum.SHOPPING,
      [TypeDiaryEnum.CASH]: TypePrefixEnum.CASH,
      [TypeDiaryEnum.BANK]: TypePrefixEnum.BANK,
      [TypeDiaryEnum.CREDIT_CARD]: TypePrefixEnum.CREDIT_CARD,
      [TypeDiaryEnum.SEVERAL]: TypePrefixEnum.SEVERAL,
    }

    if (type in prefixMap && frmAction !== FormActionEnum.UNDO) {
      const currentCode = watch('code') || formItem?.code
      if (!currentCode) {
        const count = dataListShow.dataShow.filter((item) => item.type === type).length + 1
        setValue('code', `${prefixMap[type]}${count}`)
      } else {
        setValue('code', currentCode)
      }
    }
  }, [type])

  const types = [
    {
      label: 'Ventas',
      value: TypeDiaryEnum.SALES,
    },
    {
      label: 'Compras',
      value: TypeDiaryEnum.SHOPPING,
    },
    {
      label: 'Efectivo',
      value: TypeDiaryEnum.CASH,
    },
    {
      label: 'Banco',
      value: TypeDiaryEnum.BANK,
    },
    {
      label: 'Tarjeta de crédito',
      value: TypeDiaryEnum.CREDIT_CARD,
    },
    {
      label: 'Varios',
      value: TypeDiaryEnum.SEVERAL,
    },
  ]

  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Tipo</label>
        </div>
        <div className="o_cell">
          <SelectControlled
            name={'type'}
            control={control}
            errors={errors}
            editConfig={{ config: editConfig }}
            options={types}
            onChange={(e: string) => {
              setValue('type', e)
              setFrmIsChanged(true)
              if (
                e === TypeDiaryEnum.SALES ||
                e === TypeDiaryEnum.SHOPPING ||
                e === TypeDiaryEnum.SEVERAL
              ) {
                {
                  setHiddenTabs(['Pagos Entrantes', 'Pagos Salientes'])
                }
              } else {
                {
                  setHiddenTabs([])
                }
              }
            }}
            rules={required()}
          />
        </div>
      </div>

      {(watch('type') == TypeDiaryEnum.SALES || watch('type') == TypeDiaryEnum.SHOPPING) && (
        <div className="d-sm-contents">
          <div className="o_cell o_wrap_label">
            <label className="o_form_label">Usa documentos</label>
          </div>
          <div className="o_cell">
            <div className="o_field">
              <CheckBoxControlled
                className="o_CheckBox"
                name={'use_documents'}
                control={control}
                editConfig={{ config: editConfig }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Prefijo de secuencia</label>
        </div>
        <div className="o_cell">
          <TextControlled
            name={'code'}
            control={control}
            errors={errors}
            editConfig={{ config: editConfig }}
            rules={required()}
          />
        </div>
      </div>
    </>
  )
}

export function FrmMiddleRight({ control, errors, editConfig, setValue, watch }: frmElementsProps) {
  return (
    <>
      <CfCompany
        control={control}
        errors={errors}
        setValue={setValue}
        editConfig={{ config: editConfig }}
        label={'Empresa'}
        //idField={'company_id'}
        navigate={true}
        name={watch('name')}
        // isEdit={false}
        //createAndEdit
        watch={watch}
      />
    </>
  )
}

export function FrmTab0({ control, errors, editConfig, setValue, watch }: frmElementsProps) {
  const { companies } = useUserStore((state) => state)
  const createOptions = useAppStore((state) => state.createOptions)
  const formItem = useAppStore((state) => state.formItem)
  const [bankAccounts, setBankAccounts] = useState<{ value: string; label: string }[]>([])
  const [bank, setBank] = useState<{ value: string; label: string }[]>([])
  const loadBanks = async () => {
    let banksDB = await createOptions({
      fnc_name: 'fnc_partner_bank_accounts',
      action: 's2_company',
      // filters: [{ column: 'company_id', value: '4' }],
      filters: [companies[0]],
    })
    setBankAccounts(banksDB)
    if (banksDB.length >= 0) {
      setValue('bank_id', null)
    }
  }

  const loadData = useCallback(() => {
    if (formItem?.['bank_account_id']) {
      setBankAccounts([
        {
          value: formItem['bank_account_id'],
          label: formItem['number_bank'],
        },
      ])
      setBank([
        {
          value: formItem['bank_id'],
          label: formItem['bank_name'],
        },
      ])
    }
  }, [formItem])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <>
      <div className="o_group mt-4">
        <div className="lg:w-1/2">
          <div className="o_inner_group grid">
            {watch('type') == TypeDiaryEnum.SALES || watch('type') == TypeDiaryEnum.SHOPPING ? (
              <>
                <div className="d-sm-contents">
                  {/* <div className="o_cell o_wrap_label"> */}
                  <div className="o_cell">
                    <label className="o_form_label">Secuencia de notas de crédito dedicada</label>
                  </div>
                  <div className="o_cell">
                    <div className="o_field">
                      <div className="frmControlEx">
                        <CheckBoxControlled
                          dsc={''}
                          name={'refund_sequence'}
                          className="align-text-bottom"
                          control={control}
                          editConfig={{ config: editConfig }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-sm-contents">
                  {/* <div className="o_cell o_wrap_label"> */}
                  <div className="o_cell">
                    <label className="o_form_label">Secuencia de notas de débito dedicada</label>
                  </div>
                  <div className="o_cell">
                    <div className="o_field">
                      <div className="frmControlEx">
                        <CheckBoxControlled
                          dsc={''}
                          name={'debit_sequence'}
                          className="align-text-bottom"
                          control={control}
                          editConfig={{ config: editConfig }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {(watch('type') == TypeDiaryEnum.CASH ||
                  watch('type') == TypeDiaryEnum.BANK ||
                  watch('type') == TypeDiaryEnum.CREDIT_CARD) && (
                  <div className="d-sm-contents">
                    {/* <div className="o_cell o_wrap_label"> */}
                    <div className="o_cell">
                      <label className="o_form_label">Secuencia de pago dedicado</label>
                    </div>
                    <div className="o_cell">
                      <div className="o_field">
                        <div className="frmControlEx">
                          <CheckBoxControlled
                            name={'payment_sequence'}
                            control={control}
                            editConfig={{ config: editConfig }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <Custom_field_currency
              control={control}
              errors={errors}
              editConfig={editConfig}
              setValue={setValue}
              watch={watch}
              label={true}
              rules={true}
            />
          </div>
        </div>

        {watch('type') === TypeDiaryEnum.BANK && (
          <div className="lg:w-1/2">
            <div className="o_inner_group grid">
              <div className="d-sm-contents">
                <div className="o_cell o_wrap_label">
                  <label className="o_form_label">Número de cuenta bancaria</label>
                </div>
                <div className="o_cell">
                  <div className="o_field">
                    <AutocompleteControlled
                      name={'bank_account_id'}
                      control={control}
                      errors={errors}
                      placeholder={''}
                      options={bankAccounts}
                      fnc_loadOptions={() => loadBanks()}
                      editConfig={{ config: editConfig }}
                      handleOnChanged={(data) => {
                        setBank([{ value: data.bank_id, label: data.bank_name }])
                        setValue('bank_id', data.bank_id)
                      }}
                      // loadMoreResults={fnc_search_bank_accounts}
                    />
                  </div>
                </div>
              </div>
              <div className="d-sm-contents">
                <div className="o_cell o_wrap_label">
                  <label className="o_form_label">Banco</label>
                </div>
                <div className="o_cell">
                  <div className="o_field">
                    <AutocompleteControlled
                      name={'bank_id'}
                      control={control}
                      errors={errors}
                      placeholder={''}
                      options={bank}
                      fnc_loadOptions={() => {}}
                      editConfig={{ config: editConfig }}
                      is_edit
                      // loadMoreResults={fnc_search_bank_accounts}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export function FrmTab1({ control, errors, setValue }: frmElementsProps) {
  const { setFrmIsChanged } = useAppStore()

  return (
    <div className="o_group mt-4">
      <div className="lg:w-1/2">
        <div className="o_inner_group grid">
          <div className="g-col-sm-2">
            <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
              Comunicaciones de pago
            </div>
          </div>

          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Tipo de comunicación</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <SelectControlled
                  name={'reference_type'}
                  control={control}
                  errors={errors}
                  options={[
                    { label: 'Con base al cliente', value: 'CUSTOMER' },
                    { label: 'Con base a la factura', value: 'INVOICE' },
                  ]}
                  onChange={(e: string) => {
                    setValue('reference_type', e)
                    setFrmIsChanged(true)
                  }}
                />
              </div>
            </div>
          </div>

          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Estándar de comunicación</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <SelectControlled
                  name={'reference_model'}
                  control={control}
                  errors={errors}
                  options={[
                    { label: 'Referencia completa (INV/2024/00001)', value: 'COMPLETE' },
                    { label: 'Europeo (RF83INV202400001)', value: 'EU' },
                    { label: 'Solo números (202400001)', value: 'ONLY_NUMBERS' },
                  ]}
                  onChange={(e: string) => {
                    setValue('reference_model', e)
                    setFrmIsChanged(true)
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FrmTab2({ watch, setValue }: frmElementsProps) {
  const { formItem, frmAction, setFrmIsChangedItem } = useAppStore()
  const [modifyData, setModifyData] = useState<boolean>(false)
  const [data, setData] = useState<any>([])
  const debounceRef = useRef<any>(null)

  useEffect(() => {
    if (modifyData) {
      setValue('payment_methods_in', data)
      setFrmIsChangedItem(true)
      setModifyData(false)
    }
  }, [modifyData])

  useEffect(() => {
    if (watch('payment_methods_in') || formItem?.payment_methods_in) {
      setData(watch('payment_methods_in') ?? formItem.payment_methods_in)
    }
  }, [formItem?.payment_methods_in])

  useEffect(() => {
    if (frmAction === FormActionEnum.UNDO) {
      setData(formItem.payment_methods_in)
    }
  }, [formItem, setValue, frmAction])

  const addRow = useCallback(() => {
    setData((prev: any) => [
      ...prev,
      {
        name: '',
        default_extra_price: '',
        action: ActionTypeEnum.INSERT,
        payment_method_id: crypto.randomUUID(),
      },
    ])
  }, [])

  const handleMethodChange = useCallback((option: any, id: string | number) => {
    setData((prev: any) => {
      const newData = prev.map((item: any) => {
        if (item.payment_method_id === id) {
          return {
            ...item,
            payment_method_type_id: option.value,
            payment_method_type: 'M',
            action: item.action !== ActionTypeEnum.INSERT ? ActionTypeEnum.UPDATE : item.action,
          }
        }
        return item
      })

      if (JSON.stringify(newData) !== JSON.stringify(prev)) {
        setModifyData(true)
        return newData
      }
      return prev
    })
    setModifyData(true)
  }, [])

  const handleDelete = useCallback((id: string | number) => {
    setData((prev: any) =>
      prev.map((item: any) =>
        item.payment_method_id === id ? { ...item, action: ActionTypeEnum.DELETE } : item
      )
    )
    setModifyData(true)
  }, [])

  // HANDLERS ESTABLES con useCallback
  const handleTextChange = useCallback((e: any, id: string | number) => {
    const value = e.target.value

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      setData((prev: any) => {
        const newData = prev.map((item: any) => {
          if (item.payment_method_id === id) {
            return {
              ...item,
              name: value,
              action: item.action !== ActionTypeEnum.INSERT ? ActionTypeEnum.UPDATE : item.action,
            }
          }
          return item
        })

        if (JSON.stringify(newData) !== JSON.stringify(prev)) {
          setModifyData(true)
          return newData
        }

        return prev
      })
    }, 100)
  }, [])

  const handleNameChange = useCallback((option: any, id: string | number) => {
    setData((prev: any) => {
      const newData = prev.map((item: any) => {
        if (item.payment_method_id === id) {
          return {
            ...item,
            name: option.option ?? option.target.value,
            action: item.action !== ActionTypeEnum.INSERT ? ActionTypeEnum.UPDATE : item.action,
          }
        }
        return item
      })

      if (JSON.stringify(newData) !== JSON.stringify(prev)) {
        setModifyData(true)
        return newData
      }
      return prev
    })
    setModifyData(true)
  }, [])

  // COMPONENTE MEMOIZADO para las celdas
  const NameCell = memo(({ item }: { item: any }) => (
    <SwitchableTextField
      key={item.payment_method_id}
      isReadOnly={false}
      value={item.name || ''}
      onBlur={(e) => handleNameChange(e, item.payment_method_id)}
      type="text"
      onChange={(e) => handleTextChange(e, item.payment_method_id)}
      textAlign="left"
    />
  ))

  // COLUMNAS CON DEPENDENCIAS MÍNIMAS
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'drag',
        size: 40,
        header: '',
        cell: () => (
          <div className="flex justify-center items-center">
            <span className="drag-handle cursor-grab">
              <GrDrag />
            </span>
          </div>
        ),
      },
      {
        header: 'Método de pago',
        accessorKey: 'payment_method_type_id',
        cell: ({ row, column }) => (
          <AutocompleteTable
            row={row}
            column={column}
            options={[
              { label: 'Pago Manual', value: 1 },
              { label: 'Pago Online', value: 2 },
            ]}
            onChange={(data) => {
              handleMethodChange(data.option, row.original.payment_method_id)
            }}
          />
        ),
      },
      {
        header: 'Nombre',
        accessorKey: 'name',
        cell: ({ row }) => <NameCell item={row.original} />,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => {
              handleDelete(row.original.payment_method_id)
            }}
          >
            <GrTrash style={{ fontSize: '14px' }} className="hover:text-red-400" />
          </button>
        ),
      },
    ],
    [handleMethodChange, handleDelete] // Solo handlers estables
  )

  return (
    <DndTable
      columns={columns}
      data={data}
      setData={setData}
      modifyData={modifyData}
      setModifyData={setModifyData}
      id="payment_method_id"
    >
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
              <button type="button" className="text-[#017E84]" onClick={addRow}>
                Agregar línea
              </button>
            </div>
          </td>
        </tr>
      )}
    </DndTable>
  )
}
export function FrmTab3({ watch, setValue }: frmElementsProps) {
  const { formItem, frmAction, setFrmIsChangedItem } = useAppStore()
  const [modifyData, setModifyData] = useState<boolean>(false)
  const [data, setData] = useState<any>([])

  useEffect(() => {
    if (modifyData) {
      setValue('payment_methods_out', data)
      setFrmIsChangedItem(true)
      setModifyData(false)
    }
  }, [modifyData])
  useEffect(() => {
    if (watch('payment_methods_out') !== formItem?.payment_methods_out) {
      setData(watch('payment_methods_out') ?? formItem?.payment_methods_out)
    }
  }, [formItem?.payment_methods_out])
  useEffect(() => {
    if (frmAction === FormActionEnum.UNDO) {
      setData(formItem.payment_methods_out)
    }
  }, [formItem, setValue, frmAction])
  const addRow = () => {
    setData((prev: any) => [
      ...prev,
      {
        name: '',
        default_extra_price: '',
        action: ActionTypeEnum.INSERT,
        payment_method_id: crypto.randomUUID(),
      },
    ])
  }
  const handleMethodChange = (option: any, id: string | number) => {
    setData((prev: any) => {
      const newData = prev.map((item: any) => {
        if (item.payment_method_id === id) {
          return {
            ...item,
            payment_method_type_id: option.value,
            payment_method_type: 'M',
            action: item.action !== ActionTypeEnum.INSERT ? ActionTypeEnum.UPDATE : item.action,
          }
        }
        return item
      })

      if (JSON.stringify(newData) !== JSON.stringify(prev)) {
        setModifyData(true)
        return newData
      }
      return prev
    })
    setModifyData(true)
  }

  const handleNameChange = (option: any, id: string | number) => {
    setData((prev: any) => {
      const newData = prev.map((item: any) => {
        if (item.payment_method_id === id) {
          return {
            ...item,
            name: option.option ?? option.target.value,
            action: item.action !== ActionTypeEnum.INSERT ? ActionTypeEnum.UPDATE : item.action,
          }
        }
        return item
      })

      if (JSON.stringify(newData) !== JSON.stringify(prev)) {
        setModifyData(true)
        return newData
      }
      return prev
    })
    setModifyData(true)
  }
  const handleDelete = (id: string | number) => {
    setData((prev: any) =>
      prev.map((item: any) =>
        item.payment_method_id === id ? { ...item, action: ActionTypeEnum.DELETE } : item
      )
    )
    setModifyData(true)
  }
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'drag',
        size: 40,
        header: '',
        cell: () => (
          <div className="flex justify-center items-center">
            <span className="drag-handle cursor-grab">
              <GrDrag />
            </span>
          </div>
        ),
      },
      {
        header: 'Método de pago',
        accessorKey: 'payment_method_type_id',
        cell: ({ row, column }) => (
          <AutocompleteTable
            row={row}
            column={column}
            options={[
              { label: 'Pago Manual', value: 1 },
              { label: 'Pago Online', value: 2 },
            ]}
            onChange={(data) => {
              handleMethodChange(data.option, row.original.payment_method_id)
            }}
          />
        ),
      },
      {
        header: 'Nombre',
        accessorKey: 'name',
        cell: ({ row }) => (
          <SwitchableTextField
            isReadOnly={false}
            onBlur={(data) => {
              handleNameChange(data, row.original.payment_method_id)
            }}
            value={row.original.name}
            type="text"
            onChange={(data) => handleNameChange(data, row.original.payment_method_id)}
            textAlign="left"
          />
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => {
              handleDelete(row.original.payment_method_id)
            }}
          >
            <GrTrash style={{ fontSize: '14px' }} className="hover:text-red-400" />
          </button>
        ),
      },
    ],
    []
  )
  return (
    <DndTable
      columns={columns}
      data={data}
      setData={setData}
      modifyData={modifyData}
      setModifyData={setModifyData}
      id="payment_method_id"
    >
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
                className="text-[#017E84]"
                onClick={() => {
                  addRow()
                }}
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
