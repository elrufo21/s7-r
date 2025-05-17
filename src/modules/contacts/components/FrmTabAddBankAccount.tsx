import { FrmBaseDialog } from '@/shared/components/core'
import useAppStore from '@/store/app/appStore'
import ModalAccountBankConfig from '@/modules/contacts/views/modal-account-bank/config'
import { ActionTypeEnum } from '@/shared/shared.types'
import { Column, ColumnDef, flexRender, Row } from '@tanstack/react-table'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'
import { FaRegTrashAlt } from 'react-icons/fa'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AccountBank } from '../contacts.types'
import { GrDrag } from 'react-icons/gr'
import { toast } from 'sonner'
import Sortable from 'sortablejs'

interface FrmTabAddBankAccountProps {
  watch: any
  idDialog: any
  fnc_name?: string
  setValue?: any
}

export function FrmTabAddBankAccount({
  fnc_name,
  watch,
  idDialog,
  setValue,
}: FrmTabAddBankAccountProps) {
  const [data, setData] = useState([])
  const [wasCreated] = useState(false)
  const tableRef = useRef<HTMLTableSectionElement>(null)
  const sortableRef = useRef<Sortable | null>(null)

  const { frmLoading, openDialog, closeDialogWithData, newAppDialogs, executeFnc } = useAppStore(
    (state) => state
  )

  const RowDragHandleCell = () => {
    return (
      <div className="flex justify-center items-center">
        <span className="drag-handle cursor-grab">
          <GrDrag />
        </span>
      </div>
    )
  }

  const openAddBankAccount = (id: any, name: string, rowData?: any) => {
    let getData = () => ({})
    const dialogId = openDialog({
      title: 'Crear cuenta bancaria',
      parentId: idDialog,
      dialogContent: () => (
        <FrmBaseDialog
          config={ModalAccountBankConfig}
          initialValues={{ ...rowData, partner_id: id, full_name: name, id: crypto.randomUUID() }}
          setGetData={(fn: any) => (getData = fn)}
        />
      ),
      buttons: [
        {
          text: 'Guardar y cerrar',
          type: 'confirm',
          onClick: async () => {
            try {
              const formData = getData() // 📌 Obtenemos la data antes de cerrar
              setValue('bank_accounts', [
                ...(watch('bank_accounts') || []),
                { ...formData, action: 'i', id: crypto.randomUUID() },
              ])
              closeDialogWithData(dialogId, formData, 'bank_accounts')
            } catch (error) {
              console.log(error)
            }
          },
        },
      ],
    })
  }
  const handleClick = async ({ rowData }: any) => {
    if (!watch('name')) return toast.error('Proporcione un nombre al contacto')
    if (newAppDialogs[0].childData?.bank_accounts?.length > 0 || watch('partner_id')) {
      openAddBankAccount(watch('partner_id_rel'), watch('name'), {
        ...rowData,
      })
      return
    } else {
      const dataWatch = watch()
      const newContacts = dataWatch?.contacts?.filter((contact: any) => contact?.action !== 'd')
      dataWatch.contacts = newContacts
      const res = await executeFnc(fnc_name ?? '', 'i', dataWatch)
      const data = await executeFnc(fnc_name ?? '', 's1', [res.oj_data.partner_id])
      setValue('partner_id', res.oj_data.partner_id, { shouldDirty: true })
      setValue('contacts', data.oj_data[0].contacts, { shouldDirty: true })
      openAddBankAccount(res.oj_data.partner_id, watch('name'), rowData)
    }
  }
  const editBank = ({ rowData }: any) => {
    let getData = () => ({})
    const dialogId = openDialog({
      title: 'Editar cuenta bancaria',
      parentId: idDialog,
      dialogContent: () => (
        <FrmBaseDialog
          config={ModalAccountBankConfig}
          initialValues={rowData}
          setGetData={(fn: any) => (getData = fn)}
        />
      ),
      buttons: [
        {
          text: 'Guardar y cerrar',
          type: 'confirm',
          onClick: async () => {
            const formData = getData() // 📌 Obtenemos la data antes de cerrar
            const newBankAccounts = watch('bank_accounts')?.map((bank: AccountBank) => {
              if (bank.id === rowData.id) {
                return { ...formData, action: 'i' }
              } else {
                return bank
              }
            })
            setValue('bank_accounts', newBankAccounts, { shouldDirty: true })
            closeDialogWithData(dialogId, formData, 'bank_accounts')
          },
        },
      ],
    })
  }
  const handleDelete = (row: AccountBank) => {
    setValue(
      'bank_accounts',
      watch('bank_accounts').map((bank: AccountBank) => {
        if (bank.id === row.id) {
          return { ...bank, action: ActionTypeEnum.DELETE }
        } else {
          return bank
        }
      })
    )
  }
  const columns = useMemo<ColumnDef<AccountBank>[]>(
    () => [
      {
        id: 'drag-handle',
        header: '',
        cell: () => <RowDragHandleCell />,
        size: 40,
      },
      {
        header: 'Número',
        accessorKey: 'number',
        cell: ({ row }: { row: Row<any>; column: Column<any> }) => {
          return (
            <div
              className="w-full h-full"
              onClick={() => {
                editBank({ rowData: row.original })
              }}
            >
              {row.original.number}
            </div>
          )
        },
        meta: {
          flex: 1,
          width: 'auto',
        },
      },
      {
        header: 'Banco',
        accessorKey: 'bank_name',
        size: 180,
        cell: ({ row }: { row: Row<any>; column: Column<any> }) => {
          return (
            <div className="w-full h-full" onClick={() => {}}>
              {row.original.bank_name}
            </div>
          )
        },
        meta: {
          flex: 1,
        },
      },
      {
        id: 'config',
        header: '',
        cell: ({ row }) => {
          return (
            <FaRegTrashAlt
              className="hover:text-red-600 cursor-pointer"
              onClick={() => handleDelete(row.original)}
            />
          )
        },
        size: 80,
      },
    ],
    []
  )

  useEffect(() => {
    if (tableRef.current) {
      sortableRef.current = new Sortable(tableRef.current, {
        animation: 150,
        handle: '.drag-handle',
        ghostClass: 'opacity-50',
        onEnd: (evt) => {
          const { oldIndex, newIndex } = evt
          if (oldIndex !== newIndex) {
            setData((prev) => {
              const newData = [...prev]
              const [movedItem] = newData.splice(oldIndex, 1)
              newData.splice(newIndex, 0, movedItem)
              return newData.map((item: AccountBank) => ({
                ...item,
                action:
                  item.action === ActionTypeEnum.INSERT
                    ? ActionTypeEnum.INSERT
                    : ActionTypeEnum.UPDATE,
              }))
            })
          }
        },
      })
    }

    return () => {
      if (sortableRef.current) {
        sortableRef.current.destroy()
      }
    }
  }, [data])
  useEffect(() => {
    setData(watch('bank_accounts')?.filter((item) => item.action !== ActionTypeEnum.DELETE) ?? [])
  }, [newAppDialogs, watch('bank_accounts')])

  return (
    <div className="grid !grid-cols-3 gap-4">
      <div className="col-span-2">
        <table className="w-full">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  style={{ width: column.size }}
                  className="text-left py-2 px-1 border-b border-gray-300"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody ref={tableRef}>
            {data
              ?.filter((item) => !item.disabled && item.action !== ActionTypeEnum.DELETE)
              .map((row) => (
                <tr
                  key={row.bank_account_id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  {columns.map((column) => (
                    <td key={column.id} className="py-2 px-1" style={{ width: column.size }}>
                      {flexRender(column.cell, { row: { original: row } })}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
        <div className="mt-2">
          <button
            type="button"
            disabled={wasCreated || frmLoading}
            onClick={() =>
              handleClick({
                bank_id: null,
                bank_account_id: null,
                company_id: null,
                partner_id: null,
                currency_id: null,
                state: StatusContactEnum.UNARCHIVE,
                company_name: '',
                name: '',
                currency_name: '',
                bank_name: '',
                number: '',
                action: ActionTypeEnum.INSERT,
                disabled: false,
              })
            }
            className="text-[#017E84] py-2 px-4 hover:bg-gray-100 rounded"
          >
            Agregar línea
          </button>
        </div>
      </div>
      <div className="col-span-1"></div>
    </div>
  )
}
