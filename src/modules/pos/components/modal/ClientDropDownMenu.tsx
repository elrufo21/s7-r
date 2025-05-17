import { FiEdit, FiDollarSign, FiArchive } from 'react-icons/fi'
import type { Client } from '../data/clients'
import React from 'react'

interface ClientDropdownMenuProps {
  client: Client
  onAction: (action: string, client: Client, e: React.MouseEvent) => void
  openEditModal: (client: Client) => void
}

export function ClientDropdownMenu({ client, onAction, openEditModal }: ClientDropdownMenuProps) {
  return (
    <div className="absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 client-menu-dropdown">
      <div className="py-1" role="menu" aria-orientation="vertical">
        <button
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          onClick={(e) => {
            e.stopPropagation()
            openEditModal(client)
          }}
          role="menuitem"
        >
          <FiEdit className="mr-2" size={14} /> Editar detalles
        </button>
        <button
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          onClick={(e) => onAction('orders', client, e)}
          role="menuitem"
        >
          <FiArchive className="mr-2" size={14} /> Todas las órdenes
        </button>
        <button
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          onClick={(e) => onAction('payment', client, e)}
          role="menuitem"
        >
          <FiDollarSign className="mr-2" size={14} /> Depositar dinero
        </button>
      </div>
    </div>
  )
}
