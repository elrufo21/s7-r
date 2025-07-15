import { useEffect, useState } from 'react'
import useAppStore from '@/store/app/appStore'
import { Tooltip } from '@mui/material'
import { frmElementsProps, TypeContactEnum } from '@/shared/shared.types'
import { TextControlled } from '@/shared/ui'
import CompanyField from '@/shared/components/extras/CompanyField'
import ModalBankAccount from '@/modules/action/views/contacts/bank-accounts/config'
import { ContactAutocomplete } from '@/shared/components/form/base/ContactAutocomplete'
import Cf_date from '@/shared/components/extras/Cf_date'

import BaseAutocomplete from '@/shared/components/form/base/BaseAutocomplete'
import FormRow from '@/shared/components/form/base/FormRow'
import ModalPaymentTermConfig1 from '@/modules/action/views/invoicing/diaries/config'
import BaseTextControlled from '@/shared/components/form/base/BaseTextControlled'
import { StatusInvoiceEnum } from '../../invoice.types'
import { useLocation } from 'react-router-dom'

export function FrmTitle({ watch }: frmElementsProps) {
  return (
    <h1 className="text-[28px] font-[400] mb-0 text-gray-900">
      <span>{watch('name') || 'Borrador'}</span>
    </h1>
  )
}

export function FrmMiddle({ control, errors, editConfig, setValue }: frmElementsProps) {
  const { formItem } = useAppStore()

  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Cliente</label>
        </div>
        <div className="o_cell">
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
            type={TypeContactEnum.INDIVIDUAL}
          />

          <div className="flex flex-col mt-1">
            <span>Jiron Palma 7548</span>
            <span>El Tambo</span>
            <span>Huancayo</span>
            <span>Junin</span>
            <span>20557634968</span>
          </div>
        </div>
      </div>

      {/* {watch('state') === StatusInvoiceEnum.BORRADOR && ( */}
      <FormRow label={'Tipo de operación'} editConfig={editConfig} fieldName={'c51_id'}>
        <BaseAutocomplete
          name={'c51_id'}
          control={control}
          errors={errors}
          placeholder={''}
          editConfig={editConfig}
          setValue={setValue}
          formItem={formItem}
          label="c51_name"
          filters={
            [
              // [0, 'flike', 'process_lower', '["|C|"]'],
              //['s2', '[]', '', 'code_description'],
            ]
          }
          allowSearchMore={true}
          config={{
            fncName: 'fnc_electronic_catalog',
            primaryKey: 'line_id',
            modalConfig: ModalPaymentTermConfig1,
            modalTitle: 'Tipo de operación',
          }}
        />
      </FormRow>
      {/* )} */}
    </>
  )
}

export function FrmMiddleRight({ control, errors, editConfig, setValue, watch }: frmElementsProps) {
  const formItem = useAppStore((state) => state.formItem)
  const { pathname } = useLocation()
  const [isPaymentTerm, setIsPaymentTerm] = useState(false)

  // customer - start
  /*
  const loadCurrency = async () => {
    let lDivisas = await createOptions({
      fnc_name: 'fnc_currency',
      action: 's2',
    })
    setDivisas(lDivisas)
  }
  */

  /*
  const createAndEditCurrency = async () => {
    const dialogId = openDialog({
      title: 'Crear contacto',
      dialogContent: () => <FrmBaseDialog config={modalContactConfig} />,
      buttons: [
        {
          text: 'Guardar y cerrar',
          type: 'confirm',
          onClick: () => {
            console.log('Guardar y cerrar')
          },
        },
        {
          text: 'Descartar',
          type: 'cancel',
          onClick: () => {
            closeDialogWithData(dialogId, {})
          },
        },
      ],
    })
  }
  */

  // customer - end

  // PaymentTerm - start
  /*
  const loadPaymentTerms = async () => {
    let lCondicionesPago = await createOptions({
      fnc_name: 'fnc_payment_term',
      action: 's2',
    })
    setCondicionesPago(lCondicionesPago)
  }
  */

  //fnc_enlace={() => navigate(`/action/613/detail/${formItem['payment_term_id']}`)}

  /*
  const createAndEditPaymentTerm = async () => {
    const dialogId = openDialog({
      title: 'Crear contacto',
      dialogContent: () => <FrmBaseDialog config={Frm_613_config} />,
      buttons: [
        {
          text: 'Guardar y cerrar',
          type: 'confirm',
          onClick: () => {
            console.log('Guardar y cerrar')
          },
        },
        {
          text: 'Descartar',
          type: 'cancel',
          onClick: () => {
            closeDialogWithData(dialogId, {})
          },
        },
      ],
    })
  }
  */

  /*
  const fnc_create_edit_PaymentTerm = async (data: string) => {
    let getData = () => ({})
    const dialogId = openDialog({
      title: 'Crear término de pago',
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
                  return contact.action !== 'd'
                })
                formData.contacts = newContacts
              }
              const res = await executeFnc(
                fnc_name ?? '',
                formData.partner_id ? 'u' : 'i',
                formData
              )

              setValue('partner_id', res.oj_data.partner_id, {
                shouldDirty: true,
              })

              const options = await createOptions({
                fnc_name: 'fnc_partner',
                filters: [{ column: 'state', value: 'A' }],
                action: 's2',
              })

              //setCompanies(options)
              setCustomer(options)

              closeDialogWithData(dialogId, formData, 'modalData')
            } catch (error) {
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
  */

  // PaymentTerm - end

  useEffect(() => {
    if (formItem && formItem['payment_term_id']) {
      setIsPaymentTerm(true)
    }
  }, [formItem])

  return (
    <>
      <Cf_date
        control={control}
        errors={errors}
        fieldName={'invoice_date'}
        editConfig={editConfig}
        watch={watch}
        setValue={setValue}
        labelName="Fecha de factura"
        startToday
      />

      <Cf_date
        control={control}
        errors={errors}
        fieldName={'invoice_date_due'}
        editConfig={editConfig}
        watch={watch}
        setValue={setValue}
        labelName={!isPaymentTerm ? 'Fecha de vencimiento' : 'Término de pago'}
      />
      {/* 
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">
            {!isPaymentTerm ? 'Fecha de vencimiento' : 'Término de pago'}
          </label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <div className="w-full flex">
              {!isPaymentTerm && (
                <>
                  <div className="w-2/6">
                    <DatepickerControlled
                      control={control}
                      errors={errors}
                      name={'invoice_date_due'}
                      rules={{}}
                      startToday
                      editConfig={editConfig }
                    />
                  </div>
                  {formItem?.state !== StatusInvoiceEnum.PUBLICADO && (
                    <span className="grow-0 o_form_label mx-3 oe_edit_only">o</span>
                  )}
                </>
              )}

              <div className="w-4/6">
                <BaseAutocomplete
                  name={'payment_term_id'}
                  control={control}
                  errors={errors}
                  placeholder={'Termino de pago'}
                  editConfig={editConfig }
                  setValue={setValue}
                  formItem={formItem}
                  label="payment_term_name"
                  filters={[]}
                  allowSearchMore={true}
                  config={{
                    fncName: 'fnc_payment_term',
                    primaryKey: 'payment_term_id',
                    modalConfig: ModalPaymentTermConfig1,
                    modalTitle: 'Término de pago',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
       */}
      <FormRow label="Moneda" editConfig={editConfig} fieldName={'currency_id'}>
        <BaseAutocomplete
          name={'currency_id'}
          control={control}
          errors={errors}
          placeholder={''}
          editConfig={editConfig}
          setValue={setValue}
          formItem={formItem}
          label="currency_name"
          filters={[]}
          rulers={watch('state') === StatusInvoiceEnum.BORRADOR ? true : false}
          allowSearchMore={true}
          config={{
            fncName: 'fnc_currency',
            basePath: '/action/613',
            primaryKey: 'currency_id',
            modalConfig: ModalPaymentTermConfig1,
            modalTitle: 'Moneda',
          }}
        />
      </FormRow>

      <FormRow label="Diario" editConfig={editConfig} fieldName={'journal_id'}>
        <BaseAutocomplete
          name={'journal_id'}
          control={control}
          errors={errors}
          placeholder={''}
          editConfig={editConfig}
          setValue={setValue}
          formItem={formItem}
          label="journal_name"
          filters={[[0, 'fequal', 'type', 'SA']]}
          allowSearchMore={true}
          rulers={
            watch('state') === StatusInvoiceEnum.BORRADOR || pathname.includes('new') ? true : false
          }
          config={{
            fncName: 'fnc_journal',
            primaryKey: 'journal_id',
            modalConfig: ModalPaymentTermConfig1,
            modalTitle: 'Diario',
          }}
        />
      </FormRow>

      {/* desarrollo_hoy */}

      {/* {watch('state') === StatusInvoiceEnum.BORRADOR && ( */}
      {/* <> */}
      <FormRow label="Tipo de Documento" editConfig={editConfig} fieldName={'document_type_id'}>
        <BaseAutocomplete
          name={'document_type_id'}
          control={control}
          errors={errors}
          placeholder={''}
          editConfig={editConfig}
          setValue={setValue}
          formItem={formItem}
          label="document_type_name"
          filters={[
            [0, 'flike', 'process_lower', '["|C|"]'],
            ['s2', '[]', '', 'code_name'],
          ]}
          allowSearchMore={true}
          config={{
            fncName: 'fnc_document_type',
            primaryKey: 'document_type_id',
            modalConfig: ModalPaymentTermConfig1,
            modalTitle: 'Diario',
          }}
        />
      </FormRow>

      <BaseTextControlled
        label="Número de documento"
        name={'document_number'}
        control={control}
        errors={errors}
        editConfig={editConfig}
        placeholder={''}
      />
      {/* </> */}
      {/* )} */}
    </>
  )
}

export function FrmTab1({ control, errors, editConfig, setValue, watch }: frmElementsProps) {
  const formItem = useAppStore((state) => state.formItem)

  return (
    <div className="o_group mt-4">
      <div className="lg:w-1/2">
        <div className="o_inner_group grid">
          <div className="g-col-sm-2">
            <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
              Factura
            </div>
          </div>

          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Referencia del cliente</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <TextControlled
                  name={'reference'}
                  control={control}
                  errors={errors}
                  placeholder={''}
                />
              </div>
            </div>
          </div>

          {/* 
          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Vendedor</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <AutocompleteControlled
                  name={'seller_id'}
                  control={control}
                  errors={errors}
                  placeholder={''}
                  options={sellers}
                  createAndEditItem={createAndEditSeller}
                  fnc_loadOptions={() => loadSellers()}
                  editConfig={editConfig }
                  loadMoreResults={fnc_search_sellers}
                />
              </div>
            </div>
          </div>
          */}

          {/* <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Equipo de ventas</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <AutocompleteControlled
                  name={'team_id'}
                  control={control}
                  errors={errors}
                  placeholder={''}
                  options={[]}
                  fnc_loadOptions={() => {}}
                  editConfig={editConfig }
                  loadMoreResults={fnc_search_teams}
                />
              </div>
            </div>
          </div> */}
          <FormRow label="Banco receptor" editConfig={editConfig} fieldName={'operation_type'}>
            <></>
            {/*
            <BaseAutocomplete
              name={'operation_type'}
              control={control}
              errors={errors}
              placeholder={''}
              editConfig={editConfig}
              setValue={setValue}
              formItem={formItem}
              label="operation_type_name"
              filters={[]}
              allowSearchMore={true}
              config={{
                fncName: 'fnc_partner_bank_accounts',
                primaryKey: 'operation_type',
                modalConfig: ModalBankAccount,
                modalTitle: 'Banco receptor',
              }}
            />
            */}
          </FormRow>

          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Referencia de pago</label>
              <Tooltip arrow title="Referencia de pago apra establecer apuntes contables.">
                <sup className="text-info p-1">?</sup>
              </Tooltip>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <TextControlled
                  name={'payment_reference'}
                  control={control}
                  errors={errors}
                  placeholder={''}
                  editConfig={editConfig}
                />
              </div>
            </div>
          </div>

          <Cf_date
            control={control}
            errors={errors}
            fieldName={'delivery_date'}
            editConfig={editConfig}
            watch={watch}
            setValue={setValue}
            labelName="Fecha de entrega"
            startToday
          />
        </div>
      </div>

      <div className="lg:w-1/2">
        <div className="o_inner_group grid">
          <div className="g-col-sm-2">
            <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
              Contabilidad
            </div>
          </div>

          {
            <CompanyField
              control={control}
              errors={errors}
              editConfig={editConfig}
              setValue={setValue}
              watch={watch}
            />
          }

          <FormRow label="Posición fiscal" editConfig={editConfig} fieldName={'fiscal_position_id'}>
            <BaseAutocomplete
              name={'fiscal_position_id'}
              control={control}
              errors={errors}
              placeholder={''}
              editConfig={editConfig}
              setValue={setValue}
              formItem={formItem}
              label="fiscal_position_name"
              filters={[]}
              allowSearchMore={true}
              config={{
                fncName: 'fnc_fiscal_position',
                primaryKey: 'fiscal_position_id',
                modalConfig: ModalBankAccount,
                modalTitle: 'Posición fiscal',
              }}
            />
          </FormRow>
        </div>
      </div>
    </div>
  )
}

export function FrmTab2({ control, errors, editConfig }: frmElementsProps) {
  /*const createOptions = useAppStore((state) => state.createOptions)
  const formItem = useAppStore((state) => state.formItem)
  const { openDialog, closeDialogWithData } = useAppStore()

  const [banks, setBanks] = useState<{ value: string; label: string }[]>([])
  
  const loadBanks = async () => {
    let banksDB = await createOptions({
      fnc_name: 'fnc_partner_bank_accounts',
      filters: [{ column: 'state', value: 'A' }],
      action: 's2',
    })
    setBanks(banksDB)
  }

  const loadData = useCallback(() => {}, [formItem])*/

  /* const fnc_search_bank_accounts = async () => {
    const dialogId = openDialog({
      title: 'Equipo de ventas ',
      dialogContent: () => (
        <ModalBase
          config={ModalBankAccount}
          multiple={false}
          onRowClick={async (option) => {
            setValue('bank_account_id', option.bank_account_id)
            closeDialogWithData(dialogId, {})
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
  }*/
  /*
  useEffect(() => {
    loadData()
  }, [loadData])
*/
  return (
    <div className="o_group mt-4">
      <div className="w-full mt-2">
        <div className="o_inner_group grid">
          {/*
          <div className="g-col-sm-2">
            <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
              Factura
            </div>
          </div>
          */}

          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Motivo de cancelación</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <TextControlled name={''} control={control} errors={errors} placeholder={''} />
              </div>
            </div>
          </div>

          <FormRow
            label="Motivo del crédito"
            editConfig={editConfig}
            fieldName={'bank_account_id2'}
          >
            <></>
            {/*
            <AutocompleteControlled
              name={'bank_account_id2'}
              control={control}
              errors={errors}
              placeholder={''}
              options={banks}
              fnc_loadOptions={() => loadBanks()}
              editConfig={editConfig}
              loadMoreResults={fnc_search_bank_accounts}
            />
            */}
          </FormRow>

          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Código de leyenda</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <TextControlled name={''} control={control} errors={errors} placeholder={''} />
              </div>
            </div>
          </div>

          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Leyenda</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <TextControlled name={''} control={control} errors={errors} placeholder={''} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
