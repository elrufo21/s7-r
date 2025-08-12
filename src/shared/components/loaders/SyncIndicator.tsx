import useAppStore from '@/store/app/appStore'

export const SyncIndicator = () => {
  const syncLoading = useAppStore((state) => state.syncLoading)

  if (!syncLoading) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <span className="text-lg font-medium text-gray-700">Sincronizando datos...</span>
        <span className="text-sm text-gray-500 mt-2">Por favor, no cierre la aplicación</span>
      </div>
    </div>
  )
}
