import { useCallback, useEffect, useState } from 'react'
import useAppStore from '@/store/app/appStore'
import { Tooltip } from '@mui/material'
import { StatusInvoiceEnum } from '@/modules/invoicing/invoice.types'
import { frmElementsProps, TypeContactEnum, ViewTypeEnum } from '@/shared/shared.types'
import { TextControlled, AutocompleteControlled, DatepickerControlled } from '@/shared/ui'
import { useLocation, useNavigate } from 'react-router-dom'
import modalContactConfig from '@/modules/contacts/views/modal-contact-index/config'
import { ModalBase } from '@/shared/components/modals/ModalBase'
import CompanyField from '@/shared/components/extras/CompanyField'
import ModalBankAccount from '@/modules/action/views/contacts/bank-accounts/config'
import { CompanyAutocomplete } from '@/shared/components/form/base/CompanyAutocomplete'

const required = {
  required: { value: true, message: 'Este campo es requerido' },
}

export function FrmTitle({ control, errors, editConfig }: frmElementsProps) {
  const setFrmConfigControls = useAppStore((state) => state.setFrmConfigControls)
  const style = {
    fontSize: 26,
    lineHeight: '38px',
    color: '#111827',
  }
  useEffect(() => {
    return () => {
      setFrmConfigControls({})
    }
  }, [])
  return (
    <TextControlled
      name={'name'}
      control={control}
      rules={required}
      errors={errors}
      placeholder={'Borrador'}
      style={style}
      multiline={true}
      editConfig={{ config: editConfig }}
    />
  )
}

export function FrmMiddle({ control, errors, editConfig, setValue }: frmElementsProps) {
  const { formItem } = useAppStore()

  return (
    <div className="d-sm-contents">
      <div className="o_cell o_wrap_label">
        <label className="o_form_label">Cliente</label>
      </div>
      <div className="o_cell">
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
      </div>
    </div>
  )
}

export function FrmMiddleRight({ control, errors, editConfig, setValue }: frmElementsProps) {
  const navigate = useNavigate()
  const createOptions = useAppStore((state) => state.createOptions)
  const formItem = useAppStore((state) => state.formItem)
  const { pathname } = useLocation()
  const {
    newAppDialogs,
    setBreadcrumb,
    breadcrumb,
    openDialog,
    setNewAppDialogs,
    closeDialogWithData,
    setFrmIsChanged,
  } = useAppStore()

  const [Divisas, setDivisas] = useState<{ value: string; label: string }[]>([])
  const [CondicionesPago, setCondicionesPago] = useState<{ value: string; label: string }[]>([])
  const [isPaymentTerm, setIsPaymentTerm] = useState(false)

  const cargaData = useCallback(() => {
    if (formItem['currency_id']) {
      setDivisas([
        {
          value: formItem['currency_id'],
          label: formItem['currency_name'],
        },
      ])
    }

    if (formItem['payment_term_id']) {
      setCondicionesPago([
        {
          value: formItem['payment_term_id'],
          label: formItem['payment_term_name'],
        },
      ])
    }
  }, [formItem])

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
  const fnc_load_data_divisas = async () => {
    const options = await createOptions({
      fnc_name: 'fnc_currency',
      filters: [{ column: 'state', value: 'A' }],
      action: 's2',
    })
    if (!formItem) {
      return setDivisas(options)
    }
    setDivisas([...options])
  }
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
  const fnc_load_data_PaymentTerm = async () => {
    const options = await createOptions({
      fnc_name: 'fnc_payment_term',
      filters: [{ column: 'state', value: 'A' }],
      action: 's2',
    })
    /*
    if (!formItem) {
      return setCondicionesPago(options)
    }
    */
    setCondicionesPago([...options])
  }

  const fnc_navigate_PaymentTerm = (value: number) => {
    if (newAppDialogs.length > 0) return

    setBreadcrumb([
      ...breadcrumb,
      {
        title: formItem.name,
        url: pathname,
        viewType: ViewTypeEnum.FORM,
      },
    ])
    navigate(`/action/613/detail/${value}`)
  }
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

  const fnc_search_PaymentTerm = async () => {
    const dialogId = openDialog({
      title: 'Buscar: Término de pago',
      dialogContent: () => (
        <ModalBase
          config={modalContactConfig}
          multiple={false}
          onRowClick={async (option) => {
            if (option) {
              setValue('payment_term_id', option.payment_term_id)
              //setValue('partner_name', option.full_name)
            }
            setFrmIsChanged(true)
            setNewAppDialogs([])
          }}
        />
      ),
      buttons: [
        {
          text: 'Nuevo',
          type: 'confirm',
          onClick: () => {}, //fnc_create_edit_customer(''),
        },
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialogId, {}),
        },
      ],
    })
  }

  // PaymentTerm - end

  useEffect(() => {
    if (formItem) {
      cargaData()
    }
    if (formItem && formItem['payment_term_id']) {
      setIsPaymentTerm(true)
    }
  }, [formItem, cargaData])

  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Fecha de factura</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <DatepickerControlled
              control={control}
              errors={errors}
              name={'invoice_date'}
              rules={{}}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
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
                      editConfig={{ config: editConfig }}
                    />
                  </div>
                  {formItem?.state !== StatusInvoiceEnum.PUBLICADO && (
                    <span className="grow-0 o_form_label mx-3 oe_edit_only">o</span>
                  )}
                </>
              )}

              <div className="w-4/6">
                <AutocompleteControlled
                  name={'payment_term_id'}
                  placeholder={'Término de pago'}
                  control={control}
                  errors={errors}
                  editConfig={{ config: editConfig }}
                  options={CondicionesPago}
                  fnc_loadOptions={fnc_load_data_PaymentTerm}
                  fnc_enlace={fnc_navigate_PaymentTerm}
                  loadMoreResults={fnc_search_PaymentTerm}
                  handleOnChanged={() => {
                    setIsPaymentTerm(true)
                  }}
                  handleOnBlur={(value) => {
                    setIsPaymentTerm(!!value)
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

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
              rules={required}
              options={Divisas}
              fnc_loadOptions={fnc_load_data_divisas}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export function FrmTab1({ control, errors, editConfig, setValue, watch }: frmElementsProps) {
  const createOptions = useAppStore((state) => state.createOptions)
  const formItem = useAppStore((state) => state.formItem)
  const { openDialog, closeDialogWithData } = useAppStore()

  const [fiscalPosition, setFiscalPosition] = useState<{ label: string; value: string }[]>([])
  const [banks, setBanks] = useState<{ value: string; label: string }[]>([])

  const loadBanks = async () => {
    let banksDB = await createOptions({
      fnc_name: 'fnc_partner_bank_accounts',
      filters: [{ column: 'state', value: 'A' }],
      action: 's2',
    })
    setBanks(banksDB)
  }

  const loadFiscalPos = async () => {
    let FiscalPosBD = await createOptions({
      fnc_name: 'fnc_fiscal_position',
      action: 's2',
    })
    setFiscalPosition(FiscalPosBD)
  }

  const loadData = useCallback(() => {
    if (formItem?.['fiscal_position_id']) {
      setFiscalPosition([
        {
          value: formItem['fiscal_position_id'],
          label: formItem['fiscal_position_name'],
        },
      ])
    }
  }, [formItem])

  const fnc_search_bank_accounts = async () => {
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
  }
  const fnc_search_fiscal_position = async () => {
    const dialogId = openDialog({
      title: 'Equipo de ventas ',
      dialogContent: () => (
        <ModalBase
          config={ModalBankAccount}
          multiple={false}
          onRowClick={async (option) => {
            console.log(option)
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
  }

  useEffect(() => {
    loadData()
  }, [loadData])

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
                  editConfig={{ config: editConfig }}
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
                  editConfig={{ config: editConfig }}
                  loadMoreResults={fnc_search_teams}
                />
              </div>
            </div>
          </div> */}

          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Banco receptor</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <AutocompleteControlled
                  name={'bank_account_id'}
                  control={control}
                  errors={errors}
                  placeholder={''}
                  options={banks}
                  fnc_loadOptions={() => loadBanks()}
                  editConfig={{ config: editConfig }}
                  loadMoreResults={fnc_search_bank_accounts}
                />
              </div>
            </div>
          </div>

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
                  editConfig={{ config: editConfig }}
                />
              </div>
            </div>
          </div>

          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Fecha de entrega</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <DatepickerControlled
                  name={'delivery_date'}
                  control={control}
                  errors={errors}
                  rules={{}}
                  editConfig={{ config: editConfig }}
                />
              </div>
            </div>
          </div>
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

          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Posición fiscal</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <AutocompleteControlled
                  name={'fiscal_position_id'}
                  placeholder={''}
                  control={control}
                  errors={errors}
                  options={fiscalPosition}
                  fnc_loadOptions={loadFiscalPos}
                  editConfig={{ config: editConfig }}
                  loadMoreResults={fnc_search_fiscal_position}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FrmTab2({ control, errors, editConfig, setValue }: frmElementsProps) {
  const createOptions = useAppStore((state) => state.createOptions)
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

  const loadData = useCallback(() => {}, [formItem])

  const fnc_search_bank_accounts = async () => {
    const dialogId = openDialog({
      title: 'Equipo de ventas ',
      dialogContent: () => (
        <ModalBase
          config={ModalBankAccount}
          multiple={false}
          onRowClick={async (option) => {
            console.log(option)
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
  }

  useEffect(() => {
    loadData()
  }, [loadData])

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
                <TextControlled
                  name={'reference2'}
                  control={control}
                  errors={errors}
                  placeholder={''}
                />
              </div>
            </div>
          </div>

          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Motivo del crédito</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <AutocompleteControlled
                  name={'bank_account_id2'}
                  control={control}
                  errors={errors}
                  placeholder={''}
                  options={banks}
                  fnc_loadOptions={() => loadBanks()}
                  editConfig={{ config: editConfig }}
                  loadMoreResults={fnc_search_bank_accounts}
                />
              </div>
            </div>
          </div>

          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Código de leyenda</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <TextControlled
                  name={'reference1'}
                  control={control}
                  errors={errors}
                  placeholder={''}
                />
              </div>
            </div>
          </div>

          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Leyenda</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <TextControlled
                  name={'reference21'}
                  control={control}
                  errors={errors}
                  placeholder={''}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
