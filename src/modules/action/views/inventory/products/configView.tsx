import { useEffect, useState, useRef } from 'react'
import {
  AutocompleteControlled,
  CheckBoxControlled,
  ImageInput,
  MultiSelectObject,
  TextControlled,
  RadioButtonControlled,
} from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import ClickAwayListener from '@mui/material/ClickAwayListener'

import { RiStarLine, RiStarFill } from 'react-icons/ri'

import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import { FormActionEnum, frmElementsProps, ItemStatusTypeEnum } from '@/shared/shared.types'
import { OptionsType } from '@/shared/ui/inputs/input.types'
import { TaxType, TypeProductEnum } from './products.type'
import modalCategoryConfig from '@/modules/action/views/inventory/products-category/config'

import CompanyField from '@/shared/components/extras/CompanyField'
import { required } from '@/shared/helpers/validators'
import BaseAutocomplete from '@/shared/components/form/base/BaseAutocomplete'
import FormRow from '@/shared/components/form/base/FormRow'
import uomConfig from '@/modules/action/views/inventory/unit-measurement/config'
import BaseTextControlled from '@/shared/components/form/base/BaseTextControlled'

export const ColorOptions = [
  { label: 'Sin color', value: 0 },
  { label: 'Rojo', value: 1 },
  { label: 'Naranja', value: 2 },
  { label: 'Amarillo', value: 3 },
  { label: 'Cian', value: 4 },
  { label: 'Morado', value: 5 },
  { label: 'Almendra', value: 6 },
  { label: 'Turquesa', value: 7 },
  { label: 'Azul', value: 8 },
  { label: 'Frambuesa', value: 9 },
  { label: 'Verde', value: 10 },
  { label: 'Violeta', value: 11 },
]

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
    <div className="o_field_widget o_field_priority mr-[0.5rem] mt-[2px]">
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
        rules={required()}
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
    <FormControl className="frmControlEx" component="fieldset" variant="standard">
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
        <Stack direction="row" className="gap-5 mt-2 mb-1">
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
  const formItem = useAppStore((state) => state.formItem)

  // hoy_
  // category - start

  // category - end

  /*const loadDataCompanies = async () => {
    setCompanies(
      await createOptions({
        fnc_name: 'fnc_company',
        action: 's2',
      })
    )
  }*/

  const [costUnit, setCostUnit] = useState<string>('')

  const [taxPurchase, setTaxPurchase] = useState<OptionsType[]>([])
  const [taxSale, setTaxSale] = useState<OptionsType[]>([])
  const [priceWithTax, setPriceWithTax] = useState<any>([])
  const [timer, setTimer] = useState<any>(null)

  const loadTaxes = async (type: TaxType) => {
    const taxes = await createOptions({
      fnc_name: 'fnc_tax',
      action: 's2',
      filters: [['s2', ['tax_id', 'name', 'type']]],
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
      setCostUnit(formItem['uom_name'])
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
                  <div className="w-full flex cRadioButton">
                    <RadioButtonControlled
                      name={'type'}
                      control={control}
                      rules={{}}
                      options={[
                        { label: 'Bienes', value: TypeProductEnum.GOODS },
                        { label: 'Servicios', value: TypeProductEnum.SERVICES },
                        // { label: 'Combo', value: TypeProductEnum.COMBO },
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
                  <CheckBoxControlled
                    className="o_CheckBox"
                    name={'is_storable'}
                    control={control}
                    editConfig={{ config: editConfig }}
                  />
                </div>
              </div>
            </div>
            {/*
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
            */}
            {/*
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
             */}
          </div>
        </div>
        <div className="lg:w-1/2">
          <div className="o_inner_group grid">
            <div className="d-sm-contents">
              <div className="o_cell o_wrap_label">
                <label className="o_form_label">Precio de venta</label>
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
                        <span className="text-gray-600 mx-[0.5rem]">por</span>
                        <div className="w-4/6">
                          <div className="o_field">
                            <BaseAutocomplete
                              control={control}
                              errors={errors}
                              setValue={setValue}
                              editConfig={{ config: editConfig }}
                              formItem={formItem}
                              name="uom_id"
                              label="uom_name"
                              rulers={true}
                              filters={[]}
                              allowCreateAndEdit={true}
                              allowSearchMore={true}
                              config={{
                                basePath: '/action/91/detail',
                                modalConfig: uomConfig,
                                modalTitle: 'Unidad de Medida',
                                fncName: 'fnc_uom',
                                primaryKey: 'uom_id',
                                createDataBuilder: (data: any) => ({
                                  name: data,
                                  state: ItemStatusTypeEnum.ACTIVE,
                                }),
                              }}
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
                        <div className="w-2/6">
                          <TextControlled
                            name="cost"
                            control={control}
                            errors={errors}
                            placeholder=""
                            editConfig={{ config: editConfig }}
                          />
                        </div>
                        <span className="text-gray-600 mx-[0.5rem]">por</span>
                        <div className="w-4/6">
                          <div className="o_field">
                            <span className="text-gray-600">{costUnit}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <BaseTextControlled
                  label="Referencia interna"
                  name={'internal_code'}
                  control={control}
                  errors={errors}
                  placeholder={''}
                  editConfig={{ config: editConfig }}
                />

                <BaseTextControlled
                  label="Código de barras"
                  name={'barcode'}
                  control={control}
                  errors={errors}
                  placeholder={''}
                  editConfig={{ config: editConfig }}
                />
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

            <FormRow label="Categoría">
              <BaseAutocomplete
                control={control}
                errors={errors}
                setValue={setValue}
                editConfig={{ config: editConfig }}
                formItem={formItem}
                name={'category_id'}
                label={'category_name'}
                rulers={true}
                filters={[{ column: 'state', value: ItemStatusTypeEnum.ACTIVE }]}
                allowSearchMore={true}
                allowCreateAndEdit={true}
                config={{
                  basePath: '/action/180/detail',
                  modalConfig: modalCategoryConfig,
                  modalTitle: 'Categoría',
                  fncName: fnc_name || 'fnc_create_category',
                  primaryKey: 'category_id',
                  createDataBuilder: (data: any) => ({
                    name: data,
                    state: ItemStatusTypeEnum.ACTIVE,
                  }),
                }}
              />
            </FormRow>

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
        <div className="w-1/2">
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
              className={'InputNoLineEx w-full'}
              placeholder={'Esta nota se agrega a las órdenes de ventas y facturas'}
              multiline={true}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>

        <div className="w-1/2"></div>
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
        <div className="w-1/2">
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
              className={'InputNoLineEx w-full'}
              placeholder={'Esta nota se agrega a las órdenes de compra'}
              multiline={true}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>

        <div className="w-1/2"></div>
      </div>
    </>
  )
}

export function FrmTab3({ control, errors, editConfig }: frmElementsProps) {
  const { formItem } = useAppStore((state) => state)
  return (
    <>
      {formItem?.attributes && formItem?.attributes.length === 0 && (
        <div className="o_group mt-4">
          <div className="w-1/2"></div>
          <div className="w-1/2">
            <div className="o_inner_group grid">
              <div className="d-sm-contents ">
                <div className="o_cell o_wrap_label">
                  <label className="o_form_label">Peso</label>
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
                  <label className="o_form_label mr-2 whitespace-nowrap">Volumen</label>
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
        </div>
      )}

      {/* <div className="o_group mt-4"> */}
      <div className="o_group">
        {/* <div className="lg:w-1/2"> */}
        <div className="w-1/2">
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
                'Esta nota se agrega a las órdenes de recepción (por ejemplo, dónde guardar el producto dentro del almacén)'
              }
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>

        {/* <div className="lg:w-1/2"> */}
        <div className="w-1/2">
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
              placeholder={'Esta nota se agrega a las órdenes de entrega'}
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
      {/* <div className="o_group mt-4"> */}
      <div className="o_group">
        <div className="w-1/2">
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
                    rules={required()}
                    editConfig={{ config: editConfig }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/2"></div>
      </div>
    </>
  )
}
// ----------------------------------

export function FrmTab5({ setValue, control, watch, errors, editConfig }: frmElementsProps) {
  const formItem = useAppStore((state) => state.formItem)
  const createOptions = useAppStore((state) => state.createOptions)
  const executeFnc = useAppStore((state) => state.executeFnc)
  const frmCreater = useAppStore((state) => state.frmCreater)
  const [tags, setTags] = useState<any[]>([])
  const [openPopup, setOpenPopup] = useState(false)
  const [tagSelected, setTagSelected] = useState<Record<string, any>>({})
  const [color, setColor] = useState(0)
  const [popupAnchor, setPopupAnchor] = useState<HTMLElement | null>(null)
  const colorOptionsRef = useRef(null)

  const loadTags = async () => {
    setTags(
      await createOptions({
        fnc_name: 'fnc_product_template_pos_category',
        filters: [['s2', ['category_id', 'full_name']]],
        action: 's2',
      })
    )
  }

  const fnc_createTag = async (data: any) => {
    const ndata = data[data.length - 1]
    await frmCreater(
      'fnc_product_template_pos_category',
      { name: ndata?.value, state: 'A' },
      'category_id',
      async (res: any) => {
        const ntags = await createOptions({
          fnc_name: 'fnc_product_template_pos_category',
          action: 's2',
        })
        const ntag = ntags.find((tag) => tag['category_id'] === res)
        data[data.length - 1] = ntag
        setValue('categories', data, { shouldDirty: true })
      }
    )
  }

  const onChipClick = (e: any, option: any) => {
    setOpenPopup(!openPopup)
    setTagSelected(option)
    setColor(option.color || 0)
    setPopupAnchor(e.currentTarget)
  }

  const changeColorTag = (colorIndex: number) => {
    let ntag = { ...tagSelected }
    ntag['color'] = colorIndex

    //actualizar registro
    executeFnc('fnc_product_template_pos_category', 'u', ntag)
    let listTags = watch('categories')
    let nlistTags = listTags.map((tag: any) => (tag.value === ntag.value ? ntag : tag))
    setValue('categories', nlistTags)
    setColor(colorIndex)
    setOpenPopup(false)
    setPopupAnchor(null)
  }

  const fnc_renderTags = (value: any, getTagProps: any) => {
    const fn_click = (e: any, option: any) => {
      onChipClick(e, option)
    }

    return value.map((option: any, index: number) => (
      <Chip
        {...getTagProps({ index })}
        key={index}
        size="small"
        className={`text-gray-100 ${option?.color || option?.value ? `o_colorlist_item_color_${option.color || option.value}` : ''}`}
        label={option['full_name']}
        onClick={(e: any) => fn_click(e, option)}
      />
    ))
  }

  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpenPopup(false)
      setPopupAnchor(null)
    }
  }

  const handleBlur = () => {
    if (openPopup) {
      setOpenPopup(false)
      setPopupAnchor(null)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])

  const loadData = () => {}

  useEffect(() => {
    if (formItem) {
      loadData()
    }
  }, [formItem])

  return (
    <>
      <div className="o_group">
        <div className="w-1/2">
          <div className="o_inner_group grid">
            <div className="g-col-sm-2">
              <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
                Punto de venta
              </div>
            </div>
          </div>

          <div className="o_inner_group grid">
            <FormRow label="Categoría">
              <MultiSelectObject
                name={'categories'}
                control={control}
                options={tags}
                errors={errors}
                fnc_loadOptions={loadTags}
                renderTags={fnc_renderTags}
                fnc_create={fnc_createTag}
                createOpt={true}
                searchOpt={true}
                editConfig={{ config: editConfig }}
              />
            </FormRow>
          </div>
        </div>

        <div className="w-1/2">
          <div className="o_inner_group grid">
            <div className="g-col-sm-2">
              <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
                Descripción
              </div>
            </div>
          </div>

          <div className="w-full">
            <TextControlled
              name={'description_pickingout'}
              className={'InputNoLineEx w-full'}
              placeholder={'Información sobre su producto'}
              multiline={true}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>

      {openPopup && popupAnchor && (
        <ClickAwayListener onClickAway={handleBlur}>
          <div
            style={{
              position: 'fixed',
              top: popupAnchor.getBoundingClientRect().bottom + 5,
              left: popupAnchor.getBoundingClientRect().left,
              zIndex: 1000,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            <div
              ref={colorOptionsRef}
              className="o_colorlist d-flex flex-wrap align-items-center mw-100 gap-2"
            >
              {ColorOptions.map((option, index) => {
                return (
                  <button
                    key={option.value}
                    onClick={() => changeColorTag(option.value)}
                    type="button"
                    tabIndex={index}
                    title={option.label}
                    className={`btn p-0 rounded-0 o_colorlist_item_color_${
                      option.value
                    } ${color === option.value && 'o_colorlist_selected'}`}
                    style={{
                      width: '24px',
                      height: '24px',
                      border: color === option.value ? '2px solid #000' : '1px solid #ccc',
                    }}
                  ></button>
                )
              })}
            </div>
          </div>
        </ClickAwayListener>
      )}
    </>
  )
}
