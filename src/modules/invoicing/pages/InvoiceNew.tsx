import invoiceIndexConfig from '@/modules/invoicing/views/invoice-index/config'
import { FormView } from '@/shared/components/view-types/FormView'
import useAppStore from '@/store/app/appStore'
import { ViewTypeEnum } from '@/shared/shared.types'
import { useEffect } from 'react'
import { KanbanLaoder } from '@/shared/components/loaders/KanbanLoader'

export const InvoiceNew = () => {
  const { setViewType, setConfig, config: configStore } = useAppStore()
  const config = invoiceIndexConfig

  useEffect(() => {
    setViewType(ViewTypeEnum.FORM)
  }, [setViewType])

  useEffect(() => {
    setConfig(config)
  }, [config, setConfig])

  if (!Object.keys(configStore).length) return <KanbanLaoder />

  return <FormView item={config.default_values} />
}
