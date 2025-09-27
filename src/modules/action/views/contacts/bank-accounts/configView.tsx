import { useEffect, useState } from 'react'
import { AutocompleteControlled, TextControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import { frmElementsProps, TypeContactEnum, ViewTypeEnum } from '@/shared/shared.types'
import { ModalBase } from '@/shared/components/modals/ModalBase'
import ModalBank from '@/modules/action/views/contacts/banks/config'
import CompanyField from '@/shared/components/extras/CompanyField'
import { useLocation, useNavigate } from 'react-router-dom'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'
import { ContactAutocomplete } from '@/shared/components/form/base/ContactAutocomplete'
import { required } from '@/shared/helpers/validators'
import FormRow from '@/shared/components/form/base/FormRow'
import Custom_field_currency from '@/shared/components/extras/custom_field_currency'
import BaseTextControlled from '@/shared/components/form/base/BaseTextControlled'

export function FrmTitle({ control, errors, editConfig }: frmElementsProps) {
  return (
    <TextControlled
      name={'number'}
      className={'frm_dsc'}
      placeholder={''}
      multiline={true}
      control={control}
      rules={required()}
      errors={errors}
      editConfig={{ config: editConfig }}
    />
  )
}

export function FrmMiddle({ control, errors, editConfig, setValue, watch }: frmElementsProps) {
  const createOptions = useAppStore((state) => state.createOptions)
  const { openDialog, setNewAppDialogs, closeDialogWithData, setFrmIsChanged } = useAppStore(
    (state) => state
  )

  // const formItem = useAppStore((state) => state.formItem)
  const { frmCreater, formItem, newAppDialogs, setBreadcrumb, breadcrumb } = useAppStore()

  const { pathname } = useLocation()
  const navigate = useNavigate()

  // bank - start
  const [banks, setBanks] = useState<{ label: string; value: string }[]>([])
  const fnc_load_data_bank = async () => {
    const options = await createOptions({
      fnc_name: 'fnc_bank',
      filters: [{ column: 'state', value: 'A' }],
      action: 's2',
    })
    if (!formItem) {
      return setBanks(options)
    }
    setBanks([...options])
  }
  const fnc_navigate_bank = (value: number) => {
    if (newAppDialogs?.length > 0) return
    setBreadcrumb([
      ...breadcrumb,
      {
        title: formItem.number,
        url: pathname,
        viewType: ViewTypeEnum.FORM,
      },
    ])
    navigate(`/action/109/detail/${value}`)
  }
  const fnc_create_bank = async (value: number) => {
    let fnc_name = 'fnc_bank'
    await frmCreater(
      fnc_name ?? '',
      { name: value, state: StatusContactEnum.UNARCHIVE },
      'bank_id',
      async (res: number) => {
        await fnc_load_data_bank()
        setValue('bank_id', res)
      }
    )
  }
  const fnc_search_bank = async () => {
    const dialogId = openDialog({
      title: 'Buscar: Banco',
      dialogContent: () => (
        <ModalBase
          config={ModalBank}
          multiple={false}
          onRowClick={async (option) => {
            setValue('bank_id', option.bank_id)
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

  const fnc_navigate_contact = (value: number) => {
    if (newAppDialogs?.length > 0) return
    setBreadcrumb([
      ...breadcrumb,
      {
        title: formItem.number,
        url: pathname,
        viewType: ViewTypeEnum.FORM,
      },
    ])
    navigate(`/contacts/${value}`)
  }

  useEffect(() => {
    if (formItem?.['bank_id'] || watch('bank_id')) {
      setBanks([
        {
          value: watch('bank_id') ?? formItem['bank_id'],
          label: watch('bank_name') ?? formItem['bank_name'],
        },
      ])
    }
  }, [formItem])

  return (
    <>
      <FormRow label={'Banco'}>
        {' '}
        <AutocompleteControlled
          name={'bank_id'}
          control={control}
          errors={errors}
          editConfig={{ config: editConfig }}
          handleOnChanged={(data) => setValue('bank_name', data.name)}
          options={banks}
          fnc_loadOptions={fnc_load_data_bank}
          fnc_enlace={fnc_navigate_bank}
          createItem={fnc_create_bank}
          loadMoreResults={fnc_search_bank}
        />
      </FormRow>

      <BaseTextControlled
        name={'clearing_number'}
        placeholder={''}
        control={control}
        errors={errors}
        editConfig={{ config: editConfig }}
        label={'Número de compensación'}
      />

      <FormRow label={'Titular de la cuenta'}>
        {!pathname.includes('contacts') ? (
          <ContactAutocomplete
            name={'partner_id'}
            control={control}
            errors={errors}
            setValue={setValue}
            formItem={formItem}
            editConfig={editConfig}
            fnc_name={'fnc_partner'}
            idField={'partner_id'}
            nameField={'partner_name'}
            type={TypeContactEnum.COMPANY}
            rulers={true}
          />
        ) : (
          <TextControlled
            control={control}
            errors={errors}
            name={'partner_name'}
            rules={{}}
            editConfig={{ config: editConfig }}
            navigateLink={() => fnc_navigate_contact}
            disabled={true}
          />
        )}
      </FormRow>
    </>
  )
}

export function FrmMiddleRight({ control, errors, editConfig, watch, setValue }: frmElementsProps) {
  return (
    <>
      <CompanyField
        control={control}
        errors={errors}
        editConfig={editConfig}
        watch={watch}
        setValue={setValue}
        isEdit={true}
      />

      <Custom_field_currency
        control={control}
        errors={errors}
        editConfig={editConfig}
        watch={watch}
        setValue={setValue}
      />
    </>
  )
}

export function FrmMiddleBottom({ control, errors, editConfig }: frmElementsProps) {
  return (
    <>
      <div className="o_inner_group grid">
        <div className="g-col-sm-2">
          <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
            NOTAS
          </div>
        </div>
      </div>

      <div className="w-full">
        <TextControlled
          name={'internal_notes'}
          placeholder={'Notas internas'}
          control={control}
          errors={errors}
          multiline={true}
          className={'InputNoLineEx w-full'}
          editConfig={{ config: editConfig }}
        />
      </div>
    </>
  )
}
