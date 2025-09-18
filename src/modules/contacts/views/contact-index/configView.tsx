import { useEffect, useMemo, useState } from 'react'
import {
  ImageInput,
  MultiSelectObject,
  RadioButtonControlled,
  TextControlled,
  SelectControlled,
} from '@/shared/ui'
import { Button, Typography } from '@mui/material'
import useAppStore from '@/store/app/appStore'
import Chip from '@mui/material/Chip'
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup'
import { FrmBaseDialog } from '@/shared/components/core/Dialog/FrmBaseDialog'
import ModalContactConfig from '@/modules/contacts/views/modal-contact/config'
import ContactConfig from '@/modules/contacts/views/modal-contact-index/config'

import ModalPaymentTermConfig from '@/modules/action/views/invoicing/payment-terms/config'
import { listTagColors } from '@/shared/constants'
import AccountBankConfig from '@/modules/action/views/contacts/bank-accounts/config'
import { AccountBank, ContactItem, TypeContactEnum } from '@/modules/contacts/contacts.types'
import { ListContact } from '@/modules/contacts/components/ListContact'
import {
  ActionTypeEnum,
  FormActionEnum,
  ItemStatusTypeEnum,
  ModulesEnum,
} from '@/shared/shared.types'
import { useNavigate } from 'react-router-dom'
import { Column, ColumnDef, Row } from '@tanstack/react-table'
import { toast } from 'sonner'
import { GrTrash } from 'react-icons/gr'
import { address_topTitleOptions } from '@/modules/contacts/constants'
import { frmElementsProps } from '@/shared/shared.types'
import { ModalBase } from '@/shared/components/modals/ModalBase'
import ContactTagsConfig from '@/modules/action/views/contacts/contact-tags/config'
import AddressField from '@/shared/components/extras/AddressField'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'
import { GrDrag } from 'react-icons/gr'
import CompanyField from '@/shared/components/extras/CompanyField'
import IndustriesConfig from '@/modules/action/views/contacts/industries/config'
import { DndTable } from '@/shared/components/table/DndTable'
import { required } from '@/shared/helpers/validators'
import BaseAutocomplete from '@/shared/components/form/base/BaseAutocomplete'
import FormRow from '@/shared/components/form/base/FormRow'
import BaseTextControlled from '@/shared/components/form/base/BaseTextControlled'
export function FrmPhoto({ watch, setValue, control, editConfig }: frmElementsProps) {
  return (
    <div className="o_field_widget o_field_image oe_avatar">
      <ImageInput
        watch={watch}
        setValue={setValue}
        name={'files'}
        control={control}
        editConfig={{ config: editConfig }}
      />
    </div>
  )
}

export function TopTitle({ control, editConfig }: frmElementsProps) {
  const options = [
    { label: 'Persona', value: TypeContactEnum.INDIVIDUAL },
    { label: 'Empresa', value: TypeContactEnum.COMPANY },
  ]

  return (
    <RadioButtonControlled
      name={'type'}
      control={control}
      rules={{}}
      options={options}
      editConfig={{ config: editConfig }}
    />
  )
}

export function FrmTitle({ control, errors, editConfig, watch }: frmElementsProps) {
  return (
    <TextControlled
      name={'name'}
      className={'frm_dsc'}
      placeholder={
        watch('type') === TypeContactEnum.COMPANY
          ? 'por ejemplo, Cervantes Corp'
          : 'por ejemplo, Alberto Cervantes'
      }
      control={control}
      multiline={true}
      rules={required()}
      errors={errors}
      editConfig={{ config: editConfig }}
    />
  )
}

export function Subtitle({
  control,
  errors,
  fnc_name,
  watch,
  setValue,
  editConfig,
}: frmElementsProps) {
  const { formItem, executeFnc } = useAppStore((state) => state)

  return (
    <>
      {watch('type') === TypeContactEnum.INDIVIDUAL && (
        <BaseAutocomplete
          control={control}
          errors={errors}
          setValue={setValue}
          editConfig={{ config: editConfig }}
          formItem={formItem}
          placeholder="Nombre de la empresa ..."
          name={'parent_id'}
          label={'parent_full_name'}
          filters={[[0, 'fequal', 'type', TypeContactEnum.COMPANY]]}
          allowCreateAndEdit={true}
          allowSearchMore={true}
          //añadir para que salgue o no el crear
          config={{
            basePath: '/contacts',
            modalConfig: ContactConfig,
            modalTitle: 'Empresa',
            fncName: 'fnc_partner',
            primaryKey: 'partner_id',
            createDataBuilder: (value: any) => ({
              name: value,
              type: TypeContactEnum.COMPANY,
              state: StatusContactEnum.UNARCHIVE,
            }),
            onCreateAndEditSave: async (getData, helpers, reloadOptions) => {
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
                setValue('parent_id', res.oj_data.partner_id)
                setValue('parent_full_name', formData.name)
                setValue('partner_id_rel', res.oj_data.partner_id, {
                  shouldDirty: true,
                })
                await reloadOptions()

                helpers.close()
              } catch (error) {
                toast.error('Error al crear la contacto')
                console.error(error)
              }
            },
          }}
        />
      )}
    </>
  )
}

export function FrmMiddle({ setValue, watch, control, errors, editConfig }: frmElementsProps) {
  const formItem = useAppStore((state) => state.formItem)
  const ln3_id = watch('ln3_id')
  const type = watch('type')

  useEffect(() => {
    if (type === TypeContactEnum.COMPANY) {
      setValue('address_type', 'AD')
    } else {
      setValue('address_type', 'CO')
    }
  }, [setValue, type])

  useEffect(() => {
    if (!ln3_id) {
      setValue('zip', null)
    }
  }, [ln3_id, setValue])

  return (
    <>
      <FormRow
        label="Número de identificación"
        infoLabel="El número registrado de la empresa. Úselo si es diferente al NIF. Debe ser único para todos los contactos del mismo país."
      >
        <div className="o_field">
          <BaseAutocomplete
            name={'identification_type_id'}
            control={control}
            errors={errors}
            placeholder={'Tipo'}
            editConfig={{ config: editConfig }}
            setValue={setValue}
            formItem={formItem}
            label="identification_type_name"
            filters={[[0, 'fequal', 'state', ItemStatusTypeEnum.ACTIVE]]}
            config={{
              fncName: 'fnc_partner_identification_type',
              primaryKey: 'identification_type_id',
            }}
          />
        </div>
        <div className="o_field">
          <TextControlled
            name={'identification_number'}
            control={control}
            errors={errors}
            placeholder={'Número'}
            editConfig={{ config: editConfig }}
          />
        </div>
      </FormRow>

      <div className="d-sm-contents">
        {type === 'C' ? (
          <div className="o_cell o_wrap_label">
            <label className="o_form_label">Dirección</label>
          </div>
        ) : (
          <div className="o_cell">
            <SelectControlled
              name={'address_type'}
              control={control}
              errors={errors}
              options={address_topTitleOptions}
              className="o_form_label max-w-40"
              editConfig={{ config: editConfig }}
            />
          </div>
        )}
        <AddressField
          control={control}
          errors={errors}
          editConfig={{ config: editConfig }}
          watch={watch}
          setValue={setValue}
        />
      </div>
    </>
  )
}

export function FrmMiddleRight({ setValue, control, errors, watch, editConfig }: frmElementsProps) {
  const formItem = useAppStore((state) => state.formItem)
  const setFrmIsChanged = useAppStore((state) => state.setFrmIsChanged)

  const createOptions = useAppStore((state) => state.createOptions)
  const setNewAppDialogs = useAppStore((state) => state.setNewAppDialogs)
  const openDialog = useAppStore((state) => state.openDialog)
  const executeFnc = useAppStore((state) => state.executeFnc)
  const frmCreater = useAppStore((state) => state.frmCreater)
  const [tags, setTags] = useState<any[]>([])
  const [popup, setPopup] = useState(null)
  const [openPopup, setOpenPopup] = useState(false)
  const [tagSelected, setTagSelected] = useState<Record<string, any>>([null])

  const loadTags = async () => {
    setTags(
      await createOptions({
        fnc_name: 'fnc_partner_category',
        filters: [],
        action: 's2',
      })
    )
  }

  const fnc_createTag = async (data: any) => {
    const ndata = data[data.length - 1]
    await frmCreater(
      'fnc_partner_category',
      { name: ndata?.value, state: 'A' },
      'category_id',
      async (res: any) => {
        const ntags = await createOptions({
          fnc_name: 'fnc_partner_category',
          action: 's2',
        })
        const ntag = ntags.find((tag) => tag['category_id'] === res)
        data[data.length - 1] = ntag
        setValue('categories', data, { shouldDirty: true })
      }
    )
  }

  const onChipClick = (e: any, option: any) => {
    setPopup(popup ? null : e.currentTarget)
    setOpenPopup(!openPopup)
    setTagSelected(option)
  }

  const changeColorTag = (color: string) => {
    let ntag = tagSelected
    ntag['color'] = color
    //actualizar registro
    executeFnc('fnc_partner_category', 'u', ntag)
    let listTags = watch('categories')
    let nlistTags = listTags.map((tag: any) => (tag.value === ntag.value ? ntag : tag))
    setValue('categories', nlistTags)
    setOpenPopup(false)
  }

  const fnc_renderTags = (value: any, getTagProps: any) => {
    //solo muestra paleta de colores si el estado no es vista
    let fn_click = (e: any, option: any) => {
      onChipClick(e, option)
    }

    return value.map((option: any, index: number) => (
      <Chip
        {...getTagProps({ index })}
        key={index}
        size="small"
        className="text-gray-100"
        label={option['full_name']}
        onClick={(e: any) => fn_click(e, option)}
        style={{ backgroundColor: option?.['color'] }}
      />
    ))
  }

  //const [Ctis, setCtis] = useState<{ label: string; value: string; hasParents?: string }[]>([])

  const loadData = () => {}

  const handleSearchOpt = () => {
    let selectedData: any[] = []

    const handleCategorySelection = (categories: any[], newCategories: any[]) => {
      const existingCategoryIds = categories.map((cat: any) => cat.category_id)

      return newCategories
        .filter((cat) => !existingCategoryIds.includes(cat.category_id))
        .map((cat) => ({
          label: cat.full_name,
          value: cat.category_id,
          ...cat,
        }))
    }

    const updateCategories = (newCategories: any[]) => {
      const actualCategories = watch('categories')
      const updatedCategories = [
        ...actualCategories,
        ...handleCategorySelection(actualCategories, newCategories),
      ]

      setValue('categories', updatedCategories)
      setNewAppDialogs([])
      setFrmIsChanged(true)
    }

    openDialog({
      title: 'Etiquetas de contacto',
      dialogContent: () => (
        <ModalBase
          config={ContactTagsConfig}
          multiple={true}
          onRowClick={async (option) => {
            if (option.category_id) {
              updateCategories([option])
            }
          }}
          onModalSelectionChange={(_, rowsData) => {
            selectedData = rowsData
          }}
        />
      ),
      buttons: [
        {
          text: 'Seleccionar',
          type: 'confirm',
          onClick: () => updateCategories(selectedData),
        },
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => setNewAppDialogs([]),
        },
      ],
    })
  }

  useEffect(() => {
    if (formItem) {
      loadData()
    }
  }, [formItem])

  return (
    <>
      <BasePopup open={openPopup} anchor={popup}>
        <div className="border max-w-40 mt-1 border-gray-500 outlined bg-gray-100 rounded-md p-1 text-xs">
          <div className="flex flex-wrap ">
            {listTagColors.map((color, index) => (
              <div
                key={index}
                onClick={() => changeColorTag(color)}
                className="cursor-pointer outlined w-4 h-4 m-1"
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        </div>
      </BasePopup>

      {watch('type') === 'I' && (
        <BaseTextControlled
          name={'workstation'}
          placeholder={'por ejemplo, director de ventas'}
          control={control}
          errors={errors}
          multiline={true}
          editConfig={{ config: editConfig }}
          label="Puesto de trabajo"
        />
      )}
      <BaseTextControlled
        name={'phone'}
        //type="text"
        control={control}
        errors={errors}
        placeholder={''}
        editConfig={{ config: editConfig }}
        label="Teléfono"
      />

      {/*
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Móvil</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'mobile'}
              type="text"
              control={control}
              errors={errors}
              placeholder={''}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
      */}
      <BaseTextControlled
        name={'email'}
        control={control}
        errors={errors}
        placeholder={''}
        editConfig={{ config: editConfig }}
        label="Correo electrónico"
      />

      <BaseTextControlled
        name={'website'}
        control={control}
        errors={errors}
        placeholder={'por ejemplo, https://www.system.com'}
        editConfig={{ config: editConfig }}
        label="Sitio web"
      />

      {/*
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Título</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <AutocompleteControlled
              name={'title_id'}
              placeholder={'por ejemplo, Señor'}
              control={control}
              errors={errors}
              options={Ctis}
              fnc_loadOptions={loadData_Ctis}
              editConfig={{ config: editConfig }}
              rules={{}}
            />
          </div>
        </div>
      </div>
      */}

      <FormRow label="Etiquetas">
        <MultiSelectObject
          name={'categories'}
          control={control}
          options={tags}
          errors={errors}
          placeholder={
            (watch('categories') || []).length ? '' : 'por ejemplo, "Mayorista", "Minorista", ...'
          }
          fnc_loadOptions={loadTags}
          renderTags={fnc_renderTags}
          fnc_create={fnc_createTag}
          createOpt={true}
          searchOpt={true}
          editConfig={{ config: editConfig }}
          handleSearchOpt={handleSearchOpt}
        />
      </FormRow>
    </>
  )
}

export function FrmTab0({ watch, setValue }: { watch: any; setValue: any }) {
  const { frmAction, setFrmIsChanged, openDialog, closeDialogWithData } = useAppStore(
    (state) => state
  )
  const formItem = useAppStore((state) => state.formItem)
  const [contacts, setContacts] = useState([])
  const [isChange, setIsChange] = useState(false)

  useEffect(() => {
    if (watch('contacts') && formItem)
      setContacts(watch('contacts').filter((c: any) => c.action !== ActionTypeEnum.DELETE))
  }, [watch('contacts')])

  useEffect(() => {
    if (frmAction === FormActionEnum.UNDO || formItem) {
      setContacts(watch('contacts'))
    }
  }, [formItem, setValue, frmAction])
  useEffect(() => {
    if (isChange) {
      setContacts(watch('contacts'))
      setFrmIsChanged(true)
      setIsChange(false)
    }
  }, [watch('contacts')])

  const addContact = () => {
    let getData = () => ({})
    const dialogId = openDialog({
      title: 'Crear Contacto',

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
                  action: ActionTypeEnum.INSERT,
                  partner_id: crypto.randomUUID(),
                  parent_id: null,
                  group_id: null,
                },
              ])
              setIsChange(true)
              closeDialogWithData(dialogId, formData, 'contacts')
            } catch (error) {
              console.log(error)
            }
          },
        },
      ],
    })
  }

  return (
    <div className="w-full py-4">
      <Button className="bg-[#e7e9ed] border-[#e7e9ed] text-black px-3" onClick={addContact}>
        <Typography fontSize={'14.4px'} sx={{ textTransform: 'none', fontWeight: '500' }}>
          Agregar
        </Typography>
      </Button>
      <ListContact
        contactItems={contacts ?? []}
        idDialog=""
        watch={watch}
        setValue={setValue}
        isChange={isChange}
        setIsChange={setIsChange}
      />
    </div>
  )
}

export function FrmTab1({ control, errors, editConfig, watch, setValue }: frmElementsProps) {
  const formItem = useAppStore((state) => state.formItem)

  // const [Ldps, setLdps] = useState<{ label: string; value: string }[]>([])

  // const load_Ldps = async () => {
  //   setLdps(
  //     await createOptions({
  //       fnc_name: 'fnc_ve_ct_ldp',
  //     })
  //   )
  // }

  // industry - start

  // industry - end

  return (
    <>
      <div className="o_group mt-4">
        <div className="lg:w-1/2">
          <div className="o_inner_group grid">
            <div className="g-col-sm-2">
              <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
                Venta
              </div>
            </div>

            {/* <div className="d-sm-contents">
              <div className="o_cell o_wrap_label">
                <label className="o_form_label">Vendedor</label>
              </div>
              <div className="o_cell">
                <div className="o_field">
                  <AutocompleteControlled
                    name={'supplier_payment_term_id'}
                    labelName="supplier_payment_term_name"
                    setValue={setValue}
                    placeholder={''}
                    control={control}
                    errors={errors}
                    options={Cdps_supplier}
                    fnc_loadOptions={carga_Cdps_supplier}
                    loadMoreResults={() => fnc_search('supplier_payment_term_id')}
                    editConfig={{ config: editConfig }}
                  />
                </div>
              </div>
            </div> */}
            <FormRow label="Término de pago">
              <BaseAutocomplete
                name={'customer_payment_term_id'}
                control={control}
                errors={errors}
                placeholder={''}
                editConfig={{ config: editConfig }}
                setValue={setValue}
                formItem={formItem}
                label="customer_payment_term_name"
                filters={[]}
                allowSearchMore={true}
                config={{
                  fncName: 'fnc_payment_term',
                  primaryKey: 'payment_term_id',
                  basePath: '/action/613/detail',
                  modalConfig: ModalPaymentTermConfig,
                  modalTitle: 'Término de pago',
                }}
              />
            </FormRow>

            {/* <div className="d-sm-contents">
              <div className="o_cell o_wrap_label">
                <label className="o_form_label">Lista de precios</label>
              </div>
              <div className="o_cell">
                <div className="o_field">
                  <AutocompleteControlled
                    name={'price_list_id'}
                    placeholder={''}
                    control={control}
                    errors={errors}
                    options={Ldps}
                    fnc_loadOptions={load_Ldps}
                    loadMoreResults={() => fnc_search('price_list_id')}
                    editConfig={{ config: editConfig }}
                  />
                </div>
              </div>
            </div>
            */}
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="o_inner_group grid">
            <div className="g-col-sm-2">
              <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
                Compra
              </div>
            </div>

            {/* 
            <div className="d-sm-contents">
              <div className="o_cell o_wrap_label">
                <label className="o_form_label">Comprador</label>
              </div>
              <div className="o_cell">
                <div className="o_field">
                  <AutocompleteControlled
                    name={'supplier_payment_term_id'}
                    labelName="supplier_payment_term_name"
                    setValue={setValue}
                    placeholder={''}
                    control={control}
                    errors={errors}
                    options={Cdps_supplier}
                    fnc_loadOptions={carga_Cdps_supplier}
                    loadMoreResults={() => fnc_search('supplier_payment_term_id')}
                    editConfig={{ config: editConfig }}
                  />
                </div>
              </div>
            </div>
            */}
            <FormRow label="Término de pago">
              <BaseAutocomplete
                name={'supplier_payment_term_id'}
                control={control}
                errors={errors}
                placeholder={''}
                editConfig={{ config: editConfig }}
                setValue={setValue}
                formItem={formItem}
                label="supplier_payment_term_name"
                filters={[{ column: 'state', value: 'A' }]}
                allowSearchMore={true}
                config={{
                  fncName: 'fnc_payment_term',
                  primaryKey: 'payment_term_id',
                  modalConfig: ModalPaymentTermConfig,
                  modalTitle: 'Término de pago',
                }}
              />
            </FormRow>
          </div>
        </div>
      </div>

      <div className="o_group mt-4">
        <div className="lg:w-1/2">
          <div className="o_inner_group grid">
            <div className="g-col-sm-2">
              <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
                Punto de venta
              </div>
            </div>
            <BaseTextControlled
              name={'barcode'}
              control={control}
              errors={errors}
              placeholder={''}
              editConfig={{ config: editConfig }}
              label="Código de barras"
            />
          </div>
        </div>

        <div className="lg:w-1/2"></div>
      </div>

      <div className="o_group mt-4">
        <div className="lg:w-1/2">
          <div className="o_inner_group grid">
            <div className="g-col-sm-2">
              <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
                Varios
              </div>
            </div>
            <BaseTextControlled
              name={'reference'}
              control={control}
              errors={errors}
              placeholder={''}
              editConfig={{ config: editConfig }}
              label="Referencia"
            />

            {
              <CompanyField
                control={control}
                errors={errors}
                setValue={setValue}
                editConfig={{ config: editConfig }}
                watch={watch}
              />
            }

            <FormRow label="Industria">
              <BaseAutocomplete
                name={'industry_id'}
                control={control}
                errors={errors}
                editConfig={{ config: editConfig }}
                setValue={setValue}
                formItem={formItem}
                label="industry_name"
                filters={[{ column: 'state', value: 'A' }]}
                allowSearchMore={true}
                config={{
                  fncName: 'fnc_partner_industry',
                  primaryKey: 'industry_id',
                  modalConfig: IndustriesConfig,
                  basePath: '/action/103/detail',
                }}
              />
            </FormRow>
          </div>
        </div>
        <div className="lg:w-1/2"></div>
      </div>
    </>
  )
}

export const FrmTab2 = ({ setValue, watch, fnc_name }: frmElementsProps) => {
  const {
    formItem,
    frmAction,
    setFrmIsChanged,
    openDialog,
    closeDialogWithData,
    newAppDialogs,
    executeFnc,
    config,
  } = useAppStore()
  const navigate = useNavigate()
  const [data, setData] = useState<AccountBank[]>([])
  const [modifyData, setModifyData] = useState<boolean>(false)

  const RowDragHandleCell = () => {
    return (
      <div className="flex justify-center items-center">
        <span className="drag-handle cursor-grab">
          <GrDrag />
        </span>
      </div>
    )
  }

  useEffect(() => {
    if (modifyData) {
      setFrmIsChanged(true)
      setModifyData(false)
    }
  }, [modifyData])
  useEffect(() => {
    const dataAccount = watch('bank_accounts')

    if (!dataAccount || !dataAccount.length) {
      return
    }
    setData(dataAccount)
  }, [watch('bank_accounts')])

  useEffect(() => {
    if (frmAction === FormActionEnum.UNDO || formItem) {
      setData(watch('bank_accounts') ?? [])
    }
  }, [formItem, setValue, frmAction])

  const openModal = async (rowData: AccountBank | null = null) => {
    if (!watch('name')) return toast.error('Proporcione un nombre al contacto')

    if (newAppDialogs[0]?.childData?.bank_accounts?.length > 0 || watch('partner_id')) {
      openAddBankAccount(watch('partner_id'), watch('name'), {
        ...rowData,
        bank_account_id: crypto.randomUUID(),
      })
      return
    } else {
      const dataWatch = watch()
      const newContacts = dataWatch?.contacts?.filter((contact: any) => contact?.action !== 'd')
      dataWatch.contacts = newContacts
      const res = await executeFnc(fnc_name ?? '', 'i', dataWatch)
      const data = await executeFnc(fnc_name ?? '', 's1', [res.oj_data.partner_id])
      setValue('partner_id', res.oj_data.partner_id, { shouldDirty: true })
      setValue('contacts', data.oj_data[0].contacts, { shouldDirty: true })
      navigate(
        `${config.module_url.includes(ModulesEnum.ACTION) ? config.item_url : config.module_url}/${res.oj_data.partner_id}`
      )
      openAddBankAccount(res.oj_data.partner_id, watch('name'), rowData)
    }
  }

  const openAddBankAccount = (id: any, name: string, rowData?: any) => {
    let getData = () => ({})
    const dialogId = openDialog({
      title: 'Agregar cuenta bancaria',
      dialogContent: () => (
        <FrmBaseDialog
          config={AccountBankConfig}
          initialValues={{
            ...rowData,
            partner_id: id,
            partner_name: name,
            id: crypto.randomUUID(),
            bank_account_id: crypto.randomUUID(),
          }}
          setGetData={(fn: any) => (getData = fn)}
        />
      ),
      buttons: [
        {
          text: 'Guardar y cerrar',
          type: 'confirm',
          onClick: async () => {
            try {
              const formData = getData() as AccountBank
              setValue('bank_accounts', [
                ...(watch('bank_accounts') || []),
                {
                  ...formData,
                  action: ActionTypeEnum.INSERT,
                  id: crypto.randomUUID(),
                  bank_account_id: crypto.randomUUID(),
                  bank_name: formData.bank_name,
                  company_name: formData.company_name,
                  currency_name: formData.currency_name,
                },
              ])
              setData((prev: any) => [...prev, formData])
              setFrmIsChanged(true)
              closeDialogWithData(dialogId, formData, 'bank_accounts')
            } catch (error) {
              console.log(error)
            }
          },
        },
      ],
    })
  }

  const handleDelete = (id: string | number | null) => {
    if (!id) return
    if (typeof id === 'string') {
      setData((prev) => prev.filter((elem) => elem.bank_account_id !== id))
      setValue('bank_accounts', data, { shouldDirty: true })
      return
    }

    setValue(
      'bank_accounts',
      watch('bank_accounts').map((item: any) =>
        item.bank_account_id === id
          ? { ...item, action: ActionTypeEnum.DELETE, accion: ActionTypeEnum.DELETE }
          : item
      ),
      { shouldDirty: true }
    )
    setFrmIsChanged(true)
  }

  const editBank = ({ rowData }: any) => {
    let getData = () => ({})
    const dialogId = openDialog({
      title: 'Editar cuenta bancaria',
      dialogContent: () => (
        <FrmBaseDialog
          config={AccountBankConfig}
          initialValues={rowData}
          setGetData={(fn: any) => (getData = fn)}
        />
      ),
      buttons: [
        {
          text: 'Guardar y cerrar',
          type: 'confirm',
          onClick: async () => {
            const formData = getData()
            const newBankAccounts = watch('bank_accounts')?.map((bank: AccountBank) => {
              if (bank.bank_account_id === rowData.bank_account_id) {
                return {
                  ...formData,
                  action:
                    bank.action === ActionTypeEnum.INSERT
                      ? ActionTypeEnum.INSERT
                      : ActionTypeEnum.UPDATE,
                }
              } else {
                return bank
              }
            })
            setValue('bank_accounts', newBankAccounts, { shouldDirty: true })
            closeDialogWithData(dialogId, formData, 'bank_accounts')
          },
        },
      ],
    })
  }
  const columns = useMemo<ColumnDef<AccountBank>[]>(
    () => [
      {
        id: 'drag-handle',
        header: '',
        cell: () => <RowDragHandleCell />,
        size: 40,
      },
      {
        header: 'Número',
        accessorKey: 'number',
        size: 100,
        cell: ({ row }: { row: Row<any>; column: Column<any> }) => {
          return (
            <div className="w-full h-full" onClick={() => editBank({ rowData: row.original })}>
              {row.original.number}
            </div>
          )
        },
        meta: {
          flex: 1,
          width: 'auto',
        },
      },
      {
        header: 'Banco',
        accessorKey: 'bank_name',
        size: 180,
        cell: ({ row }: { row: Row<any>; column: Column<any> }) => {
          return (
            <div className="w-full h-full" onClick={() => editBank({ rowData: row.original })}>
              {row.original.bank_name}
            </div>
          )
        },
        meta: {
          flex: 1,
        },
      },
      {
        id: 'config',
        header: '',
        cell: ({ row }) => {
          return (
            <GrTrash
              style={{ fontSize: '14px' }}
              className="hover:text-red-600 cursor-pointer"
              onClick={() => handleDelete(row.original.bank_account_id)}
            />
          )
        },
        size: 80,
      },
    ],
    []
  )

  return (
    <>
      {/*
      <div className="o_group mt-4">
        <div className="lg:w-1/2">
          <div className="o_inner_group grid">
            <div className="g-col-sm-2">
              <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
                Facturas de cliente
              </div>
            </div>
            <div className="d-sm-contents">
              <div className="o_cell o_wrap_label">
                <label className="o_form_label">Envío de facturas</label>
              </div>
              <div className="o_cell">
                <div className="o_field"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2"></div>
      </div>
      */}

      <div className="o_group mt-4">
        <div className="lg:w-1/2">
          {/* <div className="o_inner_group grid"> */}
          <div className="">
            <div className="g-col-sm-2">
              <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
                Cuentas bancarias
              </div>
            </div>

            {/* <div className="d-sm-contents"> */}
            <DndTable
              data={data}
              setData={setData}
              columns={columns}
              id="bank_account_id"
              modifyData={modifyData}
              setModifyData={setModifyData}
            >
              {(table) => (
                <tr
                  style={{ height: '42px' }}
                  className="group list-tr options border-gray-300 hover:bg-gray-200 border-t-black border-t-[1px]"
                >
                  <td></td>
                  <td
                    colSpan={
                      table.getRowModel().rows[0]
                        ? table.getRowModel().rows[0]?.getVisibleCells().length - 1
                        : 10
                    }
                    className="w-full"
                  >
                    <div className="flex gap-4">
                      <button
                        type="button"
                        className="text-[#017E84]"
                        onClick={() =>
                          openModal({
                            bank_id: null,
                            bank_account_id: crypto.randomUUID(),
                            company_id: null,
                            partner_id: null,
                            currency_id: null,
                            state: StatusContactEnum.UNARCHIVE,
                            company_name: '',
                            name: '',
                            currency_name: '',
                            bank_name: '',
                            number: '',
                            action: ActionTypeEnum.INSERT,
                            disabled: false,
                          })
                        }
                      >
                        Agregar línea
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </DndTable>
            {/*
            <div className="">
              <div className="">
                <table className="w-full">
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            style={{ width: header.column.columnDef.size }}
                            className="text-left py-2 px-1 border-b border-gray-300"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody ref={tableRef}>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-100">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="py-2 px-1">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-2">
                  <button
                    type="button"
                    disabled={frmLoading}
                    onClick={() =>
                      openModal({
                        bank_id: null,
                        bank_account_id: crypto.randomUUID(),
                        company_id: null,
                        partner_id: null,
                        currency_id: null,
                        state: StatusContactEnum.UNARCHIVE,
                        company_name: '',
                        name: '',
                        currency_name: '',
                        bank_name: '',
                        number: '',
                        action: ActionTypeEnum.INSERT,
                        disabled: false,
                      })
                    }
                    className="text-[#017E84] py-2 px-4 hover:bg-gray-100 rounded"
                  >
                    Agregar línea
                  </button>
                </div>
              </div>
            </div>
            */}
            {/* </div> */}
          </div>
        </div>
        <div className="lg:w-1/2"></div>
      </div>
    </>
  )
}

export function FrmTab3({ control, errors, editConfig }: frmElementsProps) {
  return (
    <div className="w-full mt-5">
      <TextControlled
        name={'internal_notes'}
        control={control}
        errors={errors}
        multiline={true}
        className={'InputNoLineEx w-full'}
        placeholder={'Notas internas'}
        editConfig={{ config: editConfig }}
      />
    </div>
  )
}
