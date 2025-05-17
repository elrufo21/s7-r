import { ViewTypeEnum } from '@/shared/shared.types'
import { useEffect } from 'react'
import { FormView } from '@/shared/components/view-types/FormView'
import useAppStore from '@/store/app/appStore'
import contactIndexConfig from '@/modules/contacts/views/contact-index/config'
import { KanbanLaoder } from '@/shared/components/loaders/KanbanLoader'

export const ContactNew = () => {
  const { setViewType, config: configStore, setConfig } = useAppStore()
  const config = contactIndexConfig
  useEffect(() => {
    setViewType(ViewTypeEnum.FORM)
  }, [setViewType])
  useEffect(() => {
    setConfig(config)
  }, [config, setConfig])

  if (!Object.keys(configStore).length) return <KanbanLaoder />
  return <FormView item={config.default_values} />
}
