import { useAutocompleteField } from '@/shared/components/form/hooks/useAutocompleteField'
import modalContactConfig from '@/modules/contacts/views/modal-contact-index/config'
import { AutocompleteControlled } from '@/shared/ui/inputs/AutocompleteControlled'
import { ActionTypeEnum, TypeContactEnum, ViewTypeEnum } from '@/shared/shared.types'
import { useNavigate, useLocation } from 'react-router-dom'
import useAppStore from '@/store/app/appStore'
import { ContactItem } from '@/modules/contacts/contacts.types'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'
import { FrmBaseDialog } from '@/shared/components/core/Dialog/FrmBaseDialog'
import { ModalBase } from '@/shared/components/modals/ModalBase'
import { toast } from 'sonner'

export const CompanyAutocomplete = ({
  control,
  errors,
  setValue,
  formItem,
  editConfig,
  placeholder,
  name,
  fnc_name,
  idField,
  nameField,
  type,
}: {
  control: any
  errors: any
  setValue: any
  formItem: any
  editConfig: any
  placeholder?: string
  name: string
  fnc_name: string
  idField: string
  nameField: string
  type: TypeContactEnum
}) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const {
    openDialog,
    closeDialogWithData,
    setNewAppDialogs,
    setFrmIsChanged,
    breadcrumb,
    setBreadcrumb,
    frmCreater,
    executeFnc,
  } = useAppStore()

  // Usar el hook para manejar el campo de autocompletado
  const { options, loadOptions, reloadOptions } = useAutocompleteField({
    fncName: 'fnc_partner',
    idField,
    nameField,
    formItem,
  })

  const fncEnlace = (value: string) => {
    navigate(`/contacts/${value}`)

    setBreadcrumb([
      ...breadcrumb,
      { title: formItem.name, url: pathname, viewType: ViewTypeEnum.FORM },
    ])
  }

  const fnc_create = async (value: string) => {
    await frmCreater(
      fnc_name ?? '',
      { name: value, type, state: StatusContactEnum.UNARCHIVE },
      idField,
      async (res: string) => {
        await reloadOptions()
        setValue(idField, res)
      }
    )
  }

  const fnc_create_edit = async (data: string) => {
    let getData = () => ({})
    const dialogId = openDialog({
      title: 'Crear empresa relacionada',
      dialogContent: () => (
        <FrmBaseDialog
          config={modalContactConfig}
          setGetData={(fn: any) => (getData = fn)}
          initialValues={{ name: data }}
          idDialog={dialogId}
        />
      ),

      buttons: [
        {
          text: 'Guardar',
          type: 'confirm',
          onClick: async () => {
            try {
              const formData = getData() as ContactItem
              let newContacts = []
              if (formData.partner_id && formData.contacts) {
                newContacts = formData.contacts.map((contact) => {
                  if (contact.partner_id) return contact
                  return {
                    ...contact,
                    action:
                      contact.action === ActionTypeEnum.INSERT
                        ? ActionTypeEnum.INSERT
                        : contact.action,
                    parent_id: formData.partner_id,
                  }
                })
                formData.contacts = newContacts
              } else if (formData.contacts) {
                newContacts = formData.contacts.filter((contact) => {
                  return contact.action !== ActionTypeEnum.DELETE
                })
                formData.contacts = newContacts
              }
              const res = await executeFnc(
                fnc_name ?? '',
                formData.partner_id ? ActionTypeEnum.UPDATE : ActionTypeEnum.INSERT,
                formData
              )

              setValue(idField, res.oj_data.partner_id)
              setValue(nameField, formData.name)
              setValue('partner_id_rel', res.oj_data.partner_id, {
                shouldDirty: true,
              })
              await reloadOptions()

              closeDialogWithData(dialogId, formData, 'modalData')
            } catch (error) {
              toast.error('Error al crear la contacto')
              console.error(error)
            }
          },
        },
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialogId, {}),
        },
      ],
    })
  }

  const fnc_search = () => {
    const dialogId = openDialog({
      title: 'Empresa relacionada',
      dialogContent: () => (
        <ModalBase
          config={modalContactConfig}
          multiple={false}
          onRowClick={async (option) => {
            if (option[idField]) {
              setValue(idField, option[idField])
            }
            setFrmIsChanged(true)
            setNewAppDialogs([])
          }}
        />
      ),
      buttons: [
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialogId, {}),
        },
      ],
    })
  }

  return (
    <AutocompleteControlled
      name={name}
      control={control}
      errors={errors}
      options={options}
      fnc_loadOptions={loadOptions}
      loadMoreResults={fnc_search}
      createItem={fnc_create}
      createAndEditItem={fnc_create_edit}
      editConfig={{ config: editConfig }}
      placeholder={placeholder}
      fnc_enlace={fncEnlace}
    />
  )
}
