import { useEffect, useState } from 'react'
import { AutocompleteControlled, TextControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import { frmElementsProps, TypeContactEnum, ViewTypeEnum } from '@/shared/shared.types'
import { ModalBase } from '@/shared/components/modals/ModalBase'
import ModalBank from '@/modules/action/views/contacts/banks/config'
import CompanyField from '@/shared/components/extras/CompanyField'
import { useLocation, useNavigate } from 'react-router-dom'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'
import { CompanyAutocomplete } from '@/shared/components/form/base/CompanyAutocomplete'

const required = {
  required: { value: true, message: 'Este campo es requerido' },
}

export function FrmTitle({ control, errors, editConfig }: frmElementsProps) {
  return (
    <TextControlled
      name={'number'}
      className={'frm_dsc'}
      placeholder={''}
      multiline={true}
      control={control}
      rules={required}
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
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Banco</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
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
          </div>
        </div>
      </div>

      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Número de compensación</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'clearing_number'}
              placeholder={''}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>

      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Titular de la cuenta</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            {!pathname.includes('contacts') ? (
              <CompanyAutocomplete
                name={'partner_id'}
                control={control}
                errors={errors}
                setValue={setValue}
                formItem={formItem}
                editConfig={editConfig}
                fnc_name={'fnc_partner'}
                idField={'partner_id'}
                nameField={'partner_name'}
                type={TypeContactEnum.INDIVIDUAL}
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
          </div>
        </div>
      </div>
    </>
  )
}

export function FrmMiddleRight({ control, errors, editConfig, watch, setValue }: frmElementsProps) {
  const createOptions = useAppStore((state) => state.createOptions)
  const formItem = useAppStore((state) => state.formItem)

  // currency - start
  const [currency, setCurrency] = useState<{ label: string; value: string }[]>([])
  const fnc_load_data_currency = async () => {
    const options = await createOptions({
      fnc_name: 'fnc_currency',
      filters: [{ column: 'state', value: 'A' }],
      action: 's2',
    })
    if (!formItem) {
      return setCurrency(options)
    }
    setCurrency([...options])
  }
  // currency - end
  useEffect(() => {
    if (formItem?.['currency_id'] || watch('currency_id')) {
      setCurrency([
        {
          value: watch('currency_id') ?? formItem['currency_id'],
          label: watch('currency_name') ?? formItem['currency_name'],
        },
      ])
    }
  }, [formItem])

  return (
    <>
      <CompanyField control={control} errors={errors} editConfig={editConfig} watch={watch} />

      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Moneda</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <AutocompleteControlled
              name={'currency_id'}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
              handleOnChanged={(data) => setValue('currency_name', data.label)}
              options={currency}
              fnc_loadOptions={fnc_load_data_currency}
            />
          </div>
        </div>
      </div>
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
