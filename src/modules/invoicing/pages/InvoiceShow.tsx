import { FormView } from '@/shared/components/view-types/FormView'
import { useModuleItemById } from '@/shared/hooks/useModule'
import useAppStore from '@/store/app/appStore'
import { ViewTypeEnum, ModulesEnum } from '@/shared/shared.types'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export const InvoiceShow = () => {
  const { id } = useParams()

  const { setViewType, setFormItem, setFrmLoading, config } = useAppStore()
  const { data: invoice, isLoading } = useModuleItemById({
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
    if (invoice) {
      setFormItem(invoice)
    }
  }, [invoice, setFormItem])

  //if (isLoading) return <KanbanLaoder />
  //if (!invoice) return <>esta factura no existe</>
  return <FormView item={invoice} />
}
