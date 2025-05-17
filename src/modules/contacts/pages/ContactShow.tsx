import { useParams } from 'react-router-dom'
import useAppStore from '@/store/app/appStore'
import { useEffect } from 'react'
import { ViewTypeEnum } from '@/shared/shared.types'
import { useContactById } from '@/modules/contacts/hooks/useContacts'
import { FormView } from '@/shared/components/view-types/FormView'

export const ContactShow = () => {
  const { id } = useParams()
  const { setFrmLoading } = useAppStore()
  const { data: contact, isLoading } = useContactById(id ?? '')
  const { setViewType, setFormItem } = useAppStore()

  useEffect(() => {
    setFrmLoading(isLoading)
  }, [isLoading, setFrmLoading])

  useEffect(() => {
    setViewType(ViewTypeEnum.FORM)
  }, [setViewType])

  useEffect(() => {
    if (contact) {
      setFormItem(contact)
    }
  }, [contact, setFormItem])

  return <FormView item={contact} />
}
