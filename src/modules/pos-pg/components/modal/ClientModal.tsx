import React, { useState, useMemo, useCallback, useEffect } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  type ColumnDef,
  flexRender,
  type Row,
} from '@tanstack/react-table'
import { type Client } from '../data/clients'
import { FiMenu } from 'react-icons/fi'
import { ClientDropdownMenu } from './ClientDropDownMenu'
//import { HighlightMatch } from './HighlightMatch'
import clsx from 'clsx'
import useAppStore from '@/store/app/appStore'
import { FaEnvelope } from 'react-icons/fa'

interface ClientModalProps {
  onSelectClient: (client: Client) => void
  data: Client[]
  openEditModal: (client: any) => void
}

export function ClientModal({ onSelectClient, openEditModal }: ClientModalProps) {
  const { searchTerm, setSearchTerm, modalData, setModalData } = useAppStore()
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Cerrar el menú cuando se hace clic en cualquier lugar del documento
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      // Ignorar clics en los botones de menú
      const target = event.target as HTMLElement
      if (target.closest('[aria-haspopup="true"]')) {
        return
      }

      // Cerrar el menú si está abierto y se hace clic fuera de un elemento de menú
      if (openMenuId && !target.closest('.client-menu-dropdown')) {
        setOpenMenuId(null)
      }
    }

    document.addEventListener('mousedown', handleDocumentClick)
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
    }
  }, [openMenuId])

  const handleSelectClient = useCallback(
    (client: Client) => {
      // Update selected state
      const newClients = modalData.map((c) => ({
        ...c,
        selected: c?.selected === true ? false : c.partner_id === client.partner_id,
      }))
      setModalData(newClients)
      onSelectClient(client)
      return client
    },
    [onSelectClient]
  )
  console.log('Selected client:', modalData)

  const handleToggleMenu = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setOpenMenuId((prev) => (prev === id ? null : id))
  }, [])

  // Funciones para manejar las acciones del menú
  const handleMenuAction = useCallback((e: React.MouseEvent, action: string, client: Client) => {
    e.stopPropagation()
    setOpenMenuId(null)

    switch (action) {
      case 'edit':
        console.log('Editar detalles de', client.name)
        break
      case 'orders':
        console.log('Ver órdenes de', client.name)
        break
      case 'payment':
        console.log('Depositar dinero para', client.name)
        break
      default:
        break
    }
  }, [])

  const columns = useMemo<ColumnDef<Client>[]>(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        size: 300,
        header: '',
        cell: ({ row }) => {
          const client = row.original
          return (
            <div className="flex flex-col py-1">
              <div className="font-medium text-gray-800">{client.name}</div>
            </div>
          )
        },
      },
      {
        id: 'contact',
        size: 150,
        header: '',
        cell: ({ row }) => {
          const client = row.original
          if (client.email) {
            return (
              <div className="flex items-center">
                <FaEnvelope className="text-gray-500 mr-2 flex-shrink-0" size={14} />
                <span className="text-sm text-gray-500 truncate max-w-[150px]">{client.email}</span>
              </div>
            )
          }
          return null
        },
      },
      /*  {
        id: '',
        size: 150,
        header: '',
        cell: ({ row }) => {
          const client = row.original
          if (client.total) {
            return (
              <div className="text-right">
                <div className="text-xs text-gray-500 font-medium">Total adeudado:</div>
                <div className="text-sm text-gray-700 font-medium">{client.total}</div>
              </div>
            )
          }
          return null
        },
      },*/
      {
        id: 'actions',
        size: 50,
        header: '',
        cell: ({ row }) => {
          const client = row.original
          const isMenuOpen = openMenuId === client.partner_id

          return (
            <div className="flex justify-center items-center h-full relative">
              <button
                className={clsx(
                  'w-9 h-9 rounded border-[1px] flex items-center justify-center transition-colors',
                  client?.selected
                    ? 'border-green-500 bg-green-50'
                    : isMenuOpen
                      ? 'border-gray-400 bg-gray-100'
                      : 'border-gray-300 hover:bg-gray-50'
                )}
                onClick={(e) => handleToggleMenu(e, client.partner_id)}
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
                title={client?.selected ? 'Cliente seleccionado' : 'Abrir menú'}
              >
                <FiMenu className={isMenuOpen ? 'text-gray-600' : 'text-gray-400'} size={16} />

                {/*
                {client.selected ? (
                  <FaCheck className="text-green-500" size={14} />
                ) : (
                  <FiMenu className={isMenuOpen ? 'text-gray-600' : 'text-gray-400'} size={16} />
                )}
                */}
              </button>

              {/* Menú desplegable */}
              {isMenuOpen && (
                <ClientDropdownMenu
                  client={client}
                  onAction={(action, client, e) => handleMenuAction(e, action, client)}
                  openEditModal={() => openEditModal(client)}
                />
              )}
            </div>
          )
        },
      },
    ],
    [handleToggleMenu, handleMenuAction, openMenuId]
  )

  const table = useReactTable({
    data: modalData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: searchTerm,
    },
    onGlobalFilterChange: setSearchTerm,
  })

  const handleRowClick = useCallback(
    (row: Row<Client>) => {
      // Cierra cualquier menú abierto
      setOpenMenuId(null)
      handleSelectClient(row.original)
    },
    [handleSelectClient]
  )

  return (
    <div className="w-[900px] divide-y divide-gray-200  min-h-[800px]">
      {table.getRowModel().rows.map((row) => {
        return (
          <div
            key={row.id}
            className={clsx(
              'cursor-pointer hover:bg-gray-50 border-b ',
              row.original?.selected && 'bg-green-50'
            )}
            onClick={() => handleRowClick(row)}
          >
            <div className="flex flex-wrap md:flex-nowrap items-start sm:items-center p-3">
              {row.getVisibleCells().map((cell) => {
                // Asignar anchos específicos según el tipo de columna
                let columnClass = ''
                if (cell.column.id === 'name') {
                  columnClass = 'w-full sm:flex-1 pb-2 sm:pb-0 order-1'
                } else if (cell.column.id === 'contact') {
                  columnClass = 'w-full sm:w-auto order-3 sm:order-2 pb-2 sm:pb-0 sm:ml-4'
                } else if (cell.column.id === 'total') {
                  columnClass = 'w-full sm:w-auto order-4 sm:order-3 pb-2 sm:pb-0 sm:ml-4'
                } else if (cell.column.id === 'actions') {
                  columnClass = 'sm:ml-2 order3 sm:order-4 absolute top-3 right-3 sm:static'
                }

                return (
                  <div key={cell.id} className={columnClass}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
