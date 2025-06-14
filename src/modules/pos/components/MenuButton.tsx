import { useState, useRef } from 'react'

export default function MenuButton() {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef(null)

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="ml-4"
        aria-label="Menú"
        onClick={() => setIsOpen(!isOpen)}
        ref={buttonRef}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-full top-0 mt-1 ml-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
          <ul className="py-2 text-sm text-gray-700">
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                Opción 1
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                Opción 2
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                Opción 3
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
