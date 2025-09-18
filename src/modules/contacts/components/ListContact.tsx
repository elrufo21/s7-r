import { FrmBaseDialog } from '@/shared/components/core'

import useAppStore from '@/store/app/appStore'
import { ContactImage } from './contact-image'

import { GrTrash } from 'react-icons/gr'
import ModalContactConfig from '@/modules/contacts/views/modal-contact/config'
import { ActionTypeEnum } from '@/shared/shared.types'
import { ContactItem } from '../contacts.types'

interface ListContactProps {
  contactItems: ContactItem[]
  idDialog: string
  watch: any
  setValue?: any
  isChange?: boolean | null
  setIsChange?: any | null
}

export const ListContact = ({
  contactItems,
  idDialog,
  watch,
  setValue,
  isChange,
  setIsChange,
}: ListContactProps) => {
  const { openDialog, closeDialogWithData } = useAppStore((state) => state)

  const onDeleteFromCard = async (contactItem: ContactItem) => {
    setValue(
      'contacts',
      watch('contacts')?.map((contact: ContactItem) =>
        contact.partner_id === contactItem.partner_id
          ? { ...contact, action: ActionTypeEnum.DELETE }
          : contact
      )
    )
    if (isChange != null) setIsChange(true)
  }
  const handleClick = (contactItem: ContactItem) => {
    let getData = () => ({})
    const dialogId = openDialog({
      title: 'Editar contacto',
      parentId: idDialog,

      dialogContent: () => (
        <FrmBaseDialog
          config={ModalContactConfig}
          setGetData={(fn: any) => (getData = fn)}
          initialValues={contactItem}
          idDialog={dialogId}
        />
      ),
      buttons: [
        {
          text: 'Guardar y cerrar',
          type: 'confirm',
          onClick: async () => {
            try {
              const formData = getData()
              const newContacts = watch('contacts')?.map((contact: any) => {
                if (contact.partner_id === contactItem.partner_id) {
                  return {
                    ...formData,
                    action:
                      contact.action === ActionTypeEnum.INSERT
                        ? ActionTypeEnum.INSERT
                        : ActionTypeEnum.UPDATE,
                    parent_id: contact.parent_id,
                  }
                } else {
                  return contact
                }
              })
              setValue('contacts', newContacts)
              if (isChange != null) setIsChange(true)
              closeDialogWithData(dialogId, formData, 'contacts')
            } catch (error) {
              console.log(error)
            }
          },
        },
      ],
    })
  }
  const showContactItems = () => {
    return contactItems.filter(
      (contactItem) =>
        contactItem.action !== ActionTypeEnum.DELETE && contactItem.stateTemp !== 'update'
    )
  }
  return (
    <div className="flex flex-wrap gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 py-4">
      {showContactItems().map((contactItem) => (
        <div
          key={contactItem.partner_id}
          className="relative border border-[#d8dadd] flex gap-4 p-2 cursor-pointer w-full"
          onClick={() => handleClick(contactItem)}
        >
          <ContactImage contactItem={contactItem} />
          <div className="flex flex-col gap-1 overflow-hidden">
            {contactItem.name && <span>{contactItem.name}</span>}
            {contactItem.workstation && <span>{contactItem.workstation}</span>}
            {contactItem.email && (
              <span className="text-[#017e84] hover:text-[#017e84] text-truncate">
                {contactItem.email}
              </span>
            )}
            {contactItem.dsc_ubigeo && <span>{contactItem.dsc_ubigeo}</span>}
            {contactItem.phone && <span>Teléfono: +51 {contactItem.phone}</span>}
            {contactItem.mobile && <span>Celular: +51 {contactItem.mobile}</span>}
          </div>
          <div
            className="absolute p-2 rounded-full cursor-pointer right-0 bottom-0.5 group pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation()
              onDeleteFromCard(contactItem)
            }}
          >
            <GrTrash style={{ fontSize: '14px' }} className="group-hover:text-red-400" />
          </div>
        </div>
      ))}
    </div>
  )
}
