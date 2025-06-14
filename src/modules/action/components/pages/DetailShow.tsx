import { forms } from '@/modules/action/views'
import { FormView } from '@/shared/components/view-types/FormView'
import { useModuleItemById } from '@/shared/hooks/useModule'
import useAppStore from '@/store/app/appStore'
import { ViewTypeEnum } from '@/shared/shared.types'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export const DetailShow = () => {
  const { idAction, id } = useParams()
  const { setFormItem, setConfig, setViewType, setFrmLoading } = useAppStore()
  const { module, fnc_name: fncName } = forms[`Frm_${idAction}_config`]
  const { data, isLoading } = useModuleItemById({
    fncName,
    id: id ?? '',
    module,
  })
  const config = forms[`Frm_${idAction}_config`]
  useEffect(() => {
    setViewType(ViewTypeEnum.FORM)
  }, [setViewType])
  useEffect(() => {
    setFormItem(data?.data)
  }, [data?.data, setFormItem])
  useEffect(() => {
    setConfig(config)
  }, [config, setConfig])
  useEffect(() => {
    setFrmLoading(isLoading)
  }, [isLoading, setFrmLoading])
  //if (isLoading) return <KanbanLaoder />

  return <FormView item={data?.data} />
}
