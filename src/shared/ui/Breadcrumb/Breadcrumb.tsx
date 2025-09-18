import useAppStore from '@/store/app/appStore'
import { NavigationLinks } from './NavigationLinks'

export const Breadcrumb = () => {
  const { breadcrumb } = useAppStore()

  return <NavigationLinks links={breadcrumb} />
}
