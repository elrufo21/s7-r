import { FrmBaseDialog } from '@/shared/components/core'
import useAppStore from '@/store/app/appStore'
import { Button, Typography } from '@mui/material'
import { ListContact } from './ListContact'
import ModalContactConfig from '@/modules/contacts/views/modal-contact/config'
import { ActionTypeEnum } from '@/shared/shared.types'
import { ContactItem } from '../contacts.types'

interface FrmTabAddContactProps {
  watch: any
  idDialog: any
  setValue: any
}

export function FrmTabAddContact({ idDialog, setValue, watch }: FrmTabAddContactProps) {
  const { openDialog, closeDialogWithData } = useAppStore((state) => state)

  const handleClick = () => {
    let getData = () => ({})
    const dialogId = openDialog({
      title: 'Crear contacto',
      parentId: idDialog,

      dialogContent: () => (
        <FrmBaseDialog
          config={ModalContactConfig}
          initialValues={{ partner_id: crypto.randomUUID() }}
          setGetData={(fn: any) => (getData = fn)}
        />
      ),
      buttons: [
        {
          text: 'Guardar y cerrar',
          type: 'confirm',
          onClick: async () => {
            try {
              const formData = getData() // 📌 Obtenemos la data antes de cerrar
              setValue('contacts', [
                ...(watch('contacts') || []),
                {
                  ...formData,
                  action: 'i',
                  partner_id: crypto.randomUUID(),
                  parent_id: null,
                  group_id: null,
                },
              ])
              closeDialogWithData(dialogId, formData, 'contacts')
            } catch (error) {
              console.log(error)
            }
          },
        },
      ],
    })
  }
  const contacts =
    watch('contacts')?.filter((contact: ContactItem) => contact.action !== ActionTypeEnum.DELETE) ??
    []
  return (
    <div className="w-full py-4">
      <Button className="bg-[#e7e9ed] border-[#e7e9ed] text-black px-3" onClick={handleClick}>
        <Typography fontSize={'14.4px'} sx={{ textTransform: 'none', fontWeight: '500' }}>
          Agregar
        </Typography>
      </Button>
      <ListContact
        contactItems={contacts ?? []}
        idDialog={idDialog}
        watch={watch}
        setValue={setValue}
      />
    </div>
  )
}
