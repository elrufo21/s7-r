import { forms } from '@/modules/action/views'
import { KanbanLaoder } from '@/shared/components/loaders/KanbanLoader'
import { FormView } from '@/shared/components/view-types/FormView'
import useAppStore from '@/store/app/appStore'
import { ViewTypeEnum } from '@/shared/shared.types'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export const DetailNew = () => {
  const { setViewType, config: configStore, setConfig } = useAppStore()

  const { idAction } = useParams()
  const config = forms[`Frm_${idAction}_config`]

  useEffect(() => {
    setViewType(ViewTypeEnum.FORM)
  }, [setViewType])
  useEffect(() => {
    setConfig(config)
  }, [config, setConfig])

  if (!Object.keys(configStore).length) return <KanbanLaoder />
  return <FormView item={config.default_values} />
}
