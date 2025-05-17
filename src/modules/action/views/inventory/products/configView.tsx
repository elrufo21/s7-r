import { useEffect, useState } from 'react'
import {
  AutocompleteControlled,
  CheckBoxControlled,
  ImageInput,
  MultiSelectObject,
  TextControlled,
  SelectControlled,
  RadioButtonControlled,
} from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import Chip from '@mui/material/Chip'

import { RiStarLine, RiStarFill } from 'react-icons/ri'

import Stack from '@mui/material/Stack'
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import { FormActionEnum, frmElementsProps, ViewTypeEnum } from '@/shared/shared.types'
import { OptionsType } from '@/shared/ui/inputs/input.types'
import { InvoicePolicyEnum, TaxType, TypeProductEnum } from './products.type'
import { ModalBase } from '@/shared/components/modals/ModalBase'
import modalCategoryConfig from '@/modules/action/views/inventory/products-category/config'

import { useLocation, useNavigate } from 'react-router-dom'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'
import CompanyField from '@/shared/components/extras/CompanyField'

const required = {
  required: { value: false, message: 'Este campo es requerido' },
}

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

export function FrmStar({ setValue }: frmElementsProps) {
  const formItem = useAppStore((state) => state.formItem)
  const setFrmAction = useAppStore((state) => state.setFrmAction)
  const setFrmIsChanged = useAppStore((state) => state.setFrmIsChanged)
  const [isFav, setIsFav] = useState(false)
  const [isDropdownVisible, setDropdownVisible] = useState(
    <RiStarLine color="rgba(55, 65, 81, 0.76)" />
  )

  const handleMouseMove = () => {
    setDropdownVisible(<RiStarFill color="#f3cc00" />)
  }

  const handleMouseLeave = () => {
    setDropdownVisible(<RiStarLine color="rgba(55, 65, 81, 0.76)" />)
  }

  const handleClick = () => {
    setValue('is_favorite', formItem?.is_favorite ? false : true)
    setFrmAction(FormActionEnum.UPDATE_FAVORITE)
    setFrmIsChanged(false)
  }

  useEffect(() => {
    if (formItem) {
      setIsFav(formItem?.is_favorite)
    }
  }, [formItem])
  return (
    <div className="o_field_widget o_field_priority mr-3">
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="o_priority"
      >
        {isFav ? <RiStarFill color="#f3cc00" /> : isDropdownVisible}
      </div>
    </div>
  )
}

export function FrmTitle({ control, errors, editConfig }: frmElementsProps) {
  const style = {
    fontSize: 26,
    lineHeight: '38px',
    color: '#111827',
  }
  return (
    <>
      <TextControlled
        name={'name'}
        control={control}
        rules={required}
        errors={errors}
        placeholder={'Por ejemplo, tostada de pan'}
        style={style}
        multiline={true}
        editConfig={{ config: editConfig }}
      />
    </>
  )
}

export function Subtitle({ watch, control, editConfig }: frmElementsProps) {
  const { setHiddenTabs, hiddenTabs, formItem } = useAppStore((state) => state)

  useEffect(() => {
    if (watch('sale_ok')) {
      const newArr = hiddenTabs.filter((tab) => tab !== 'Ventas')
      setHiddenTabs(newArr)
      return
    }
    setHiddenTabs([...hiddenTabs, 'Ventas'])
  }, [watch('sale_ok')])
  useEffect(() => {
    if (watch('purchase_ok')) {
      const newArr = hiddenTabs.filter((tab) => tab !== 'Compras')
      setHiddenTabs(newArr)
      return
    }
    setHiddenTabs([...hiddenTabs, 'Compras'])
  }, [watch('purchase_ok')])
  return (
    <FormControl className="frmControlEx mt-1" component="fieldset" variant="standard">
      <div>
        {formItem?.variants?.map((item: any) => (
          <Chip
            key={item.attribute_value_id}
            label={item.name}
            sx={{
              marginRight: 1,
              background: '#E6DDDD',
              fontSize: '0.65rem',
              height: '20px',
              marginBottom: 1,
              fontWeight: 'bold',
              '& .MuiChip-icon': {
                fontSize: '0.65rem',
              },
              '& .MuiChip-deleteIcon': {
                fontSize: '0.75rem',
              },
            }}
          />
        ))}
      </div>
      <FormGroup>
        <Stack direction="row" className="gap-5">
          <CheckBoxControlled
            dsc={'Se puede vender'}
            name={'sale_ok'}
            className="o_form_label"
            control={control}
            editConfig={{ config: editConfig }}
          />
          <CheckBoxControlled
            dsc={'Se puede comprar'}
            name={'purchase_ok'}
            className="o_form_label"
            control={control}
            editConfig={{ config: editConfig }}
          />
          <CheckBoxControlled
            dsc={'Punto de venta'}
            name={'available_in_pos'}
            className="o_form_label"
            control={control}
            editConfig={{ config: editConfig }}
          />
        </Stack>
      </FormGroup>
    </FormControl>
  )
}

export function FrmTab0({
  watch,
  control,
  errors,
  editConfig,
  setValue,
  fnc_name,
}: frmElementsProps) {
  const createOptions = useAppStore((state) => state.createOptions)
  const executeFnc = useAppStore((state) => state.executeFnc)
  const {
    newAppDialogs,
    setBreadcrumb,
    frmCreater,
    breadcrumb,
    openDialog,
    setNewAppDialogs,
    closeDialogWithData,
  } = useAppStore()
  const formItem = useAppStore((state) => state.formItem)
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([])
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // hoy_
  // category - start
  const fnc_load_data_category = async () => {
    const options = await createOptions({
      fnc_name: 'fnc_product_category',
      filters: [{ column: 'state', value: 'A' }],
      action: 's2',
    })
    if (!formItem) {
      return setCategories(options)
    }
    setCategories([...options])
  }

  const fnc_navigate_category = (value: number) => {
    if (newAppDialogs.length > 0) return

    setBreadcrumb([
      ...breadcrumb,
      {
        title: formItem.name,
        url: pathname,
        viewType: ViewTypeEnum.FORM,
      },
    ])
    navigate(`/action/180/detail/${value}`)
  }

  const fnc_create_category = async (value: number) => {
    await frmCreater(
      fnc_name ?? '',
      { name: value, state: StatusContactEnum.UNARCHIVE },
      'category_id',
      async (res: number) => {
        await fnc_load_data_category()
        setValue('category_id', res)
      }
    )
  }

  // category - end

  const [companies, setCompanies] = useState<{ label: string; value: string }[]>([])
  /*const loadDataCompanies = async () => {
    setCompanies(
      await createOptions({
        fnc_name: 'fnc_company',
        action: 's2',
      })
    )
  }*/
  console.log(companies)
  const [uom, setUom] = useState<{ label: string; value: string }[]>([])

  const [costUnit, setCostUnit] = useState<string>('')
  const loadDataUom = async () => {
    let resultUom = await createOptions({
      fnc_name: 'fnc_uom',
      action: 's2',
    })
    setUom(resultUom)
  }

  const [taxPurchase, setTaxPurchase] = useState<OptionsType[]>([])
  const [taxSale, setTaxSale] = useState<OptionsType[]>([])
  const [priceWithTax, setPriceWithTax] = useState<any>([])
  const [timer, setTimer] = useState<any>(null)

  const loadTaxes = async (type: TaxType) => {
    const taxes = await createOptions({
      fnc_name: 'fnc_tax',
      action: 's2',
    })
    const newTaxes = taxes
      .map((imp: any) => ({
        label: imp['name'],
        value: imp['tax_id'],
        type: imp['type'],
      }))
      .filter((tax: any) => tax.type === type)

    if (TaxType.PURCHASE === type) {
      setTaxPurchase(newTaxes)
    } else {
      setTaxSale(newTaxes)
    }
  }

  const fnc_renderImps = (value: any, getProps: any) => {
    return value.map((option: any, index: number) => (
      <Chip
        {...getProps({ index })}
        key={index}
        className="text-red-100"
        label={option['label']}
        size="small"
      />
    ))
  }

  const loadData = () => {
    if (formItem?.['uom_id']) {
      setUom([
        {
          value: formItem['uom_id'],
          label: formItem['uom_name'],
        },
      ])
      setCostUnit(formItem['uom_name'])
    }

    if (formItem?.['company_id']) {
      setCompanies([
        {
          value: formItem['company_id'],
          label: formItem['company_name'],
        },
      ])
    }

    if (formItem?.['category_id']) {
      setCategories([
        {
          value: formItem['category_id'],
          label: formItem['category_name'],
        },
      ])
    }
    if (formItem?.['taxes_sale']) {
      const taxPrice = async () => {
        const rs = await getSalePriceWhitTax(taxSale.map((tax: any) => tax.value))
        setPriceWithTax(rs)
      }
      taxPrice()
    }
  }

  useEffect(() => {
    loadData()
  }, [formItem])

  const onChangeUom = (value: { label: string; value: string; [key: string]: any }) => {
    setCostUnit(value.label)
  }
  const getSalePriceWhitTax = async (data: any) => {
    const result = await executeFnc('fnc_tax', 'get_sale_price_tax', data)
    return result.oj_data
  }
  const handleGetSalePrice = async (value: any) => {
    if (timer) {
      clearTimeout(timer)
    }
    const newTimer = setTimeout(async () => {
      if (watch('taxes_sale').length === 0 || value === '' || value === '0') {
        setPriceWithTax([])
        return
      }
      const data = [
        {
          sale_price: value,
          taxes: watch('taxes_sale').map((tax: any) => tax.value != undefined && tax.value),
        },
      ]

      const res = await executeFnc('fnc_tax', 'get_sale_price_tax', data)
      setPriceWithTax(res.oj_data)
    }, 400)

    setTimer(newTimer)
  }

  const handleGetSalePriceWhitTax = async (value: any) => {
    let taxId: number[] = []
    taxId = value.map((tax: any) => tax.value != undefined && tax.value)
    if (taxId.length === 0 || watch('sale_price') === '' || watch('sale_price') === '0') {
      setPriceWithTax([])
      return
    }
    const data = [
      {
        sale_price: formItem['sale_price'],
        taxes: taxId,
      },
    ]
    const res = await executeFnc('fnc_tax', 'get_sale_price_tax', data)
    setPriceWithTax(res.oj_data)
  }

  const fnc_search = () => {
    const dialogId = openDialog({
      title: 'Productos',
      dialogContent: () => (
        <ModalBase
          config={modalCategoryConfig}
          multiple={false}
          onRowClick={async (option) => {
            if (option.partner_id) {
              setValue('parent_id', option.partner_id)
            }
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
    <>
      <div className="o_group mt-4">
        <div className="lg:w-1/2">
          <div className="o_inner_group grid ">
            <div className="d-sm-contents">
              <div className="o_cell o_wrap_label ">
                <label className="o_form_label">Tipo de producto</label>
              </div>
              <div className="o_cell">
                <div className="o_field">
                  <div className="w-full flex">
                    <RadioButtonControlled
                      name={'type'}
                      control={control}
                      rules={{}}
                      options={[
                        { label: 'Bienes', value: TypeProductEnum.GOODS },
                        { label: 'Servicios', value: TypeProductEnum.SERVICES },
                        { label: 'Combo', value: TypeProductEnum.COMBO },
                      ]}
                      editConfig={{ config: editConfig }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="d-sm-contents">
              <div className="o_cell o_wrap_label">
                <label className="o_form_label">Rastrear inventario</label>
              </div>
              <div className="o_cell">
                <div className="o_field">
                  <div className="w-full flex">
                    <CheckBoxControlled
                      className="mr-0 ml-0"
                      name={'is_storable'}
                      control={control}
                      editConfig={{ config: editConfig }}
                    />
                    <SelectControlled
                      name={'uom_id'}
                      control={control}
                      editConfig={{ config: editConfig }}
                      options={[]}
                      errors={errors}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="d-sm-contents">
              <div className="o_cell o_wrap_label">
                <label className="o_form_label">Politica de Facturación</label>
              </div>
              <div className="o_cell">
                <div className="o_field">
                  <div className="flex align-top">
                    <SelectControlled
                      name={'invoice_policy'}
                      control={control}
                      rules={{}}
                      options={[
                        { label: 'Cantidad ordenada', value: InvoicePolicyEnum.CUANTITY_ORDERED },
                        {
                          label: 'Cantidades entregadas',
                          value: InvoicePolicyEnum.CUANTITY_DELIVERED,
                        },
                      ]}
                      editConfig={{ config: editConfig }}
                      errors={errors}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="d-sm-contents">
              <div className="o_cell o_wrap_label"></div>
              <div className="o_cell o_wrap_label">
                {watch('invoice_policy') === InvoicePolicyEnum.CUANTITY_ORDERED ? (
                  <span className="o_field_widget o_readonly_modifier o_field_char fst-italic text-muted">
                    Puede facturar los bienes antes de entregarlos.
                  </span>
                ) : (
                  <span className="o_field_widget o_readonly_modifier o_field_char fst-italic text-muted">
                    Factura después de la entrega, según las cantidades entregadas, no en las
                    órdenes.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2">
          <div className="o_inner_group grid">
            <div className="d-sm-contents">
              <div className="o_cell o_wrap_label">
                <label className="o_form_label mr-2 ">Precio de venta</label>
              </div>
              <div className="o_cell">
                <div className="o_field">
                  <div className="w-full flex">
                    <>
                      <span className="div_simbol text-gray-600">{formItem?.currency_symbol}</span>
                      <div className="w-2/6 ">
                        <TextControlled
                          name={'sale_price'}
                          control={control}
                          errors={errors}
                          placeholder={''}
                          editConfig={{ config: editConfig }}
                          handleChange={handleGetSalePrice}
                        />
                      </div>
                    </>
                    {watch('type') !== TypeProductEnum.COMBO && (
                      <>
                        <span className="div_simbol text-gray-600 font-semibold">Por</span>

                        <div className="w-4/6">
                          <div className="o_field">
                            <AutocompleteControlled
                              name={'uom_id'}
                              placeholder={''}
                              control={control}
                              errors={errors}
                              options={uom}
                              createAndEditItem={true}
                              fnc_loadOptions={loadDataUom}
                              enlace={true}
                              editConfig={{ config: editConfig }}
                              handleOnChanged={onChangeUom}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {watch('type') !== TypeProductEnum.COMBO && watch('purchase_ok') === true ? (
              <div className="d-sm-contents">
                <div className="o_cell o_wrap_label">
                  <label className="o_form_label">Impuestos de ventas</label>
                </div>
                <div className="flex items-center flex-grow">
                  <div className="w-full flex items-center">
                    <MultiSelectObject
                      name={'taxes_sale'}
                      control={control}
                      options={taxSale}
                      errors={errors}
                      placeholder={''}
                      fnc_loadOptions={() => loadTaxes(TaxType.SALE)}
                      renderTags={fnc_renderImps}
                      createOpt={true}
                      searchOpt={true}
                      editConfig={{ config: editConfig }}
                      handleOnChanged={handleGetSalePriceWhitTax}
                    />
                    <div className="w-full">
                      {priceWithTax?.map((price: any, index: number) => (
                        <span className="flex w-auto text-gray-600" key={index}>
                          (={`${formItem?.currency_symbol} ${price.price} ${price.description}`})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {(formItem?.attributes?.length === 0 || !formItem?.attributes) && (
              <>
                <div className="d-sm-contents">
                  <div className="o_cell o_wrap_label">
                    <label className="o_form_label">Costo</label>
                  </div>
                  <div className="o_cell">
                    <div className="o_field">
                      <div className="w-full flex">
                        <span className="div_simbol text-gray-600">
                          {formItem?.currency_symbol}
                        </span>
                        <div className="w-36 pr-7">
                          <TextControlled
                            name="cost"
                            control={control}
                            errors={errors}
                            placeholder=""
                            editConfig={{ config: editConfig }}
                          />
                        </div>
                        <div className="o_field_widget o_label_importe font-semibold">
                          <span className="div_simbol text-gray-600 font-semibold">Por</span>
                          <span>{costUnit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-sm-contents">
                  <div className="o_cell o_wrap_label">
                    <label className="o_form_label">Referencia interna</label>
                  </div>
                  <div className="o_cell">
                    <div className="o_field">
                      <TextControlled
                        name="internal_code"
                        control={control}
                        errors={errors}
                        placeholder=""
                        editConfig={{ config: editConfig }}
                      />
                    </div>
                  </div>
                </div>

                <div className="d-sm-contents">
                  <div className="o_cell o_wrap_label">
                    <label className="o_form_label">Código de barras</label>
                  </div>
                  <div className="o_cell">
                    <div className="o_field">
                      <TextControlled
                        name="barcode"
                        control={control}
                        errors={errors}
                        placeholder=""
                        editConfig={{ config: editConfig }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {watch('type') !== TypeProductEnum.COMBO && watch('purchase_ok') === true ? (
              <div className="d-sm-contents">
                <div className="o_cell o_wrap_label">
                  <label className="o_form_label">Impuestos de compras</label>
                </div>
                <div className="o_cell">
                  <div className="o_field">
                    <MultiSelectObject
                      name={'taxes_purchase'}
                      control={control}
                      options={taxPurchase}
                      errors={errors}
                      placeholder={''}
                      fnc_loadOptions={() => loadTaxes(TaxType.PURCHASE)}
                      renderTags={fnc_renderImps}
                      createOpt={true}
                      searchOpt={true}
                      editConfig={{ config: editConfig }}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <div className="d-sm-contents">
              <div className="o_cell o_wrap_label">
                <label className="o_form_label">Categoría</label>
              </div>
              <div className="o_cell">
                <div className="o_field">
                  <AutocompleteControlled
                    name={'category_id'}
                    control={control}
                    errors={errors}
                    editConfig={{ config: editConfig }}
                    enlace={true}
                    options={categories}
                    fnc_loadOptions={fnc_load_data_category}
                    fnc_enlace={fnc_navigate_category}
                    createItem={fnc_create_category}
                    //createAndEditItem={true}
                    //createAndEditItem={(data: string) => fnc_create_edit_customer(data)}

                    loadMoreResults={fnc_search}
                    //loadMoreResults={fnc_search_customer}
                  />
                </div>
              </div>
            </div>
            <CompanyField
              control={control}
              errors={errors}
              setValue={setValue}
              editConfig={{ config: editConfig }}
              watch={watch}
            />
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="o_inner_group grid">
          <div className="g-col-sm-2">
            <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
              NOTAS INTERNAS
            </div>
          </div>
        </div>

        <div className="w-full">
          <TextControlled
            name={'internal_notes'}
            control={control}
            errors={errors}
            multiline={true}
            className={'InputNoLineEx w-full'}
            placeholder={'Esta nota es solo para fines internos'}
            editConfig={{ config: editConfig }}
          />
        </div>
      </div>
    </>
  )
}

export function FrmTab1({ control, errors, editConfig }: frmElementsProps) {
  return (
    <>
      {/* <div className="o_group mt-4"> */}
      <div className="o_group">
        <div className="lg:w-1/2">
          <div className="o_inner_group grid">
            <div className="g-col-sm-2">
              <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
                DESCRIPCIÓN DE LA COTIZACIÓN
              </div>
            </div>
          </div>

          <div className="w-full">
            <TextControlled
              name={'description_sale'}
              control={control}
              errors={errors}
              multiline={true}
              className={'InputNoLineEx w-full'}
              placeholder={'Esta nota se agrega a las órdenes de ventas y facturas.'}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export function FrmTab2({ control, errors, editConfig }: frmElementsProps) {
  /*
  const createOptions = useAppStore((state) => state.createOptions)
  const formItem = useAppStore((state) => state.formItem)
  const [purchaseUom, setPurchaseUom] = useState<{ label: string; value: string }[]>([])
  const loadDataPurchaseUpm = async () => {
    let lUdms = await createOptions({
      fnc_name: 'fnc_uom',
      action: 's2',
    })
    setPurchaseUom(lUdms)
  }
  const loadData = () => {
    if (formItem?.['purchase_uom_id']) {
      setPurchaseUom([{ value: formItem['purchase_uom_id'], label: formItem['purchase_uom_name'] }])
    }
  }
  useEffect(() => {
    loadData()
  }, [formItem])
*/
  return (
    <>
      {/* <div className="o_group mt-4"> */}
      <div className="o_group">
        <div className="lg:w-1/2">
          <div className="o_inner_group grid">
            <div className="g-col-sm-2">
              <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
                Descripción de compra
              </div>
            </div>
          </div>

          <div className="w-full">
            <TextControlled
              name={'description_purchase'}
              control={control}
              errors={errors}
              multiline={true}
              className={'InputNoLineEx w-full'}
              placeholder={'Esta nota se agrega a las órdenes de compra.'}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export function FrmTab3({ control, errors, editConfig }: frmElementsProps) {
  const { formItem } = useAppStore((state) => state)
  return (
    <>
      <div className="o_group mt-4">
        <div className="lg:w-1/2"></div>

        {formItem?.attributes && formItem?.attributes.length === 0 && (
          <div className="lg:w-1/2">
            <div className="o_inner_group grid">
              <div className="d-sm-contents ">
                <div className="o_cell o_wrap_label">
                  <label className="o_form_label">Peso </label>
                </div>
                <div className="o_cell">
                  <div className="o_field">
                    <div className="w-full flex">
                      <div className="w-1/2">
                        <TextControlled
                          name={'weight'}
                          control={control}
                          errors={errors}
                          placeholder={''}
                          editConfig={{ config: editConfig }}
                        />
                      </div>
                      <span className="text-gray-400 ml-2">Kg</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-sm-contents">
                <div className="o_cell o_wrap_label">
                  <label className="o_form_label mr-2 whitespace-nowrap">Volumen </label>
                </div>
                <div className="o_cell">
                  <div className="o_field">
                    <div className="w-full flex">
                      <div className="w-1/2">
                        <TextControlled
                          name={'volume'}
                          control={control}
                          errors={errors}
                          placeholder={''}
                          editConfig={{ config: editConfig }}
                        />
                      </div>
                      <span className="text-gray-400 ml-2">m3</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-sm-contents">
                <label className="o_form_label ">Plazo de entrega del cliente</label>
                <div className="o_cell">
                  <div className="o_field">
                    <div className="w-full flex">
                      <div className="w-1/2">
                        <TextControlled
                          name={'description_pickingout'}
                          control={control}
                          errors={errors}
                          placeholder={''}
                          editConfig={{ config: editConfig }}
                        />
                      </div>

                      <span className="text-gray-400 ml-2">dias</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="o_group mt-4">
        <div className="lg:w-1/2">
          <div className="o_inner_group grid">
            <div className="g-col-sm-2">
              <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
                Descripción para recepciones
              </div>
            </div>
          </div>

          <div className="w-full">
            <TextControlled
              name={'description_pickingin'}
              control={control}
              errors={errors}
              multiline={true}
              className={'InputNoLineEx w-full'}
              placeholder={
                'Esta nota se agrega a las órdenes de recepción (por ejemplo, dónde guardar el producto dentro del almacén).'
              }
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="o_inner_group grid">
            <div className="g-col-sm-2">
              <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
                Descripción para órdenes de entrega
              </div>
            </div>
          </div>

          <div className="w-full">
            <TextControlled
              name={'description_pickingout'}
              className={'InputNoLineEx w-full'}
              placeholder={'Esta nota se agrega a las órdenes de entrega.'}
              multiline={true}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export function FrmTab4({ control, errors, editConfig }: frmElementsProps) {
  const createOptions = useAppStore((state) => state.createOptions)
  const formItem = useAppStore((state) => state.formItem)

  const [unspscCode, setUnspscCode] = useState<{ label: string; value: string }[]>([])
  const loadDataUnspscCode = async () => {
    setUnspscCode(
      await createOptions({
        fnc_name: 'fnc_con_peru_ct_25',
        action: 's2',
      })
    )
  }

  const loadData = () => {
    if (formItem?.['unspsc_code_id']) {
      setUnspscCode([
        {
          value: formItem['unspsc_code_id'],
          label: formItem['cod_unspsc__dsc_unspsc'],
        },
      ])
    }
  }

  useEffect(() => {
    loadData()
  }, [formItem])

  return (
    <>
      <div className="o_group mt-4">
        <div className="lg:w-1/2">
          <div className="o_inner_group grid">
            <div className="g-col-sm-2">
              <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
                UNSPSC
              </div>
            </div>

            <div className="d-sm-contents">
              <div className="o_cell o_wrap_label">
                <label className="o_form_label">Categoría UNSPSC</label>
              </div>
              <div className="o_cell">
                <div className="o_field">
                  <AutocompleteControlled
                    name={'unspsc_code_id'}
                    placeholder={''}
                    control={control}
                    errors={errors}
                    options={unspscCode}
                    fnc_loadOptions={loadDataUnspscCode}
                    rules={required}
                    editConfig={{ config: editConfig }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
