import React from 'react'

interface HighlightMatchProps {
  text: string
  query: string
}

export function HighlightMatch({ text, query }: HighlightMatchProps) {
  if (!query.trim()) {
    return <>{text}</>
  }

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, index) => {
        // Verificar si esta parte coincide con la búsqueda (ignorando mayúsculas/minúsculas)
        const isMatch = part.toLowerCase() === query.toLowerCase()

        return isMatch ? (
          <span key={index} className="bg-yellow-200 font-medium">
            {part}
          </span>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      })}
    </>
  )
}
