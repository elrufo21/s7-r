import React, { useEffect, useRef } from 'react'
import { Column, Row } from '@tanstack/react-table'

interface InputTextTableProps {
  row: Row<any>
  column: Column<any>
  placeholder?: string
  className?: string
  onBlur: (data: { rowId: number; columnId: string; option: string; row?: Row<any> }) => void
  type?: 'number' | 'text'
}

export const InputTextTable = (props: InputTextTableProps) => {
  const { row, column, onBlur, className = '' } = props
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Asegurar que el contenido refleje el valor actual
    if (contentRef.current) {
      contentRef.current.textContent = row.original[column.id] || ''
    }
  }, [row.original, column.id])

  const handleBlur = () => {
    if (contentRef.current) {
      const value = contentRef.current.textContent || ''
      onBlur({ rowId: row.index, columnId: column.id, option: value, row })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (contentRef.current) {
        const value = contentRef.current.textContent || ''
        onBlur({ rowId: row.index, columnId: column.id, option: value, row })
        contentRef.current.blur()
      }
    }
  }

  return (
    <div
      ref={contentRef}
      contentEditable
      suppressContentEditableWarning
      className={`input-text-table w-full p-1 outline-none border-b border-transparent ${className}`}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      {row.original[column.id]}
    </div>
  )
}
