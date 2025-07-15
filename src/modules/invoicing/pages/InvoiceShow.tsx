import { FormView } from '@/shared/components/view-types/FormView'
import { useModuleItemById } from '@/shared/hooks/useModule'
import useAppStore from '@/store/app/appStore'
import { ViewTypeEnum, ModulesEnum } from '@/shared/shared.types'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import InvoiceIndexConfig from '@/modules/invoicing/views/invoice-index/config'

export const InvoiceShow = () => {
  const { id } = useParams()
  const { setViewType, setFormItem, setFrmLoading, setStats, setConfig } = useAppStore()

  const config = InvoiceIndexConfig

  const { data, isLoading } = useModuleItemById({
    id: id ?? '',
    fncName: config.fnc_name,
    module: ModulesEnum.INVOICING,
  })

  useEffect(() => {
    setViewType(ViewTypeEnum.FORM)
  }, [setViewType])

  useEffect(() => {
    setFrmLoading(isLoading)
  }, [isLoading, setFrmLoading])

  useEffect(() => {
    if (data?.data) {
      setFormItem(data.data)
    }
  }, [data?.data, setFormItem])

  useEffect(() => {
    setConfig(config)
  }, [config, setConfig])

  useEffect(() => {
    if (!data?.stat) return
    const payments = data.stat.payments ?? 0
    const hasPayments = payments !== 0
    if (hasPayments) {
      setStats([data.stat])
      if (config?.formButtons?.[0]) {
        config.formButtons[0].value = payments
      }
    } else {
      setStats([])
    }
  }, [data, isLoading, config?.formButtons, setStats])

  return <FormView item={data?.data} />
}
