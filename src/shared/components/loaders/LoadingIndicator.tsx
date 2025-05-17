import useAppStore from '@/store/app/appStore'

export const LoadingIndicator = () => {
  const frmLoading = useAppStore((state) => state.frmLoading)

  return (
    <>
      {frmLoading && (
        <div className="loading btn-primary">
          <span>Cargando ...</span>
        </div>
      )}
    </>
  )
}
