import useAppStore from '@/store/app/appStore'

export const CustomHeader = ({ fnc_create_button }: any) => {
  const { searchTerm, setSearchTerm } = useAppStore()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b gap-2 z-[1000]">
      <div className="flex items-center space-x-2">
        <button
          className="btn btn-primary btn-lg lh-lg me-2 rounded-sm"
          onClick={fnc_create_button}
        >
          <span className="font-medium">Crear</span>
        </button>
      </div>
      <div className="relative flex-1 max-w-full sm:max-w-xs sm:mx-4 order-3 sm:order-2 z-50">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar clientes..."
          className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 z-50"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            type="button"
            aria-label="Limpiar búsqueda"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
