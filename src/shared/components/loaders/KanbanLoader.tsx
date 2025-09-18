import ContentLoader from 'react-content-loader'

export const KanbanLaoder = () => {
  return (
    <ContentLoader
      speed={2}
      width="90%"
      height="90%"
      viewBox="0 0 400 160"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      style={{ width: '100%', height: '100%' }}
    >
      <rect x="5%" y="0" rx="3" ry="3" width="90%" height="240" />
    </ContentLoader>
  )
}
