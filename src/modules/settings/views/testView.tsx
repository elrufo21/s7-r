import { useLocation, useNavigate } from 'react-router-dom'
import SettingSideBar from './SettingSideBar'
import SettingSection from './SettingSection'
import CheckboxSetting from './CheckboxSetting'
import { AutocompleteControlled } from '@/shared/ui'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import useAppStore from '@/store/app/appStore'
import modalTaxConfig from '@/modules/action/views/invoicing/taxes/config'
import {
  InputBase,
  Paper,
  // Tooltip
} from '@mui/material'
import { IoSearch } from 'react-icons/io5'
import { ModalBase } from '@/shared/components/modals/ModalBase'
// import { TbArrowNarrowRight } from 'react-icons/tb'
import { ViewTypeEnum } from '@/shared/shared.types'

const tabs = [
  {
    key: 'general_settings',
    href: '#general_settings',
    img: '/images/modules/settings.png',
    label: 'Ajustes generales',
  },
  // {
  //   key: 'sale_management',
  //   href: '#sale_management',
  //   img: '/images/modules/trace.svg',
  //   label: 'Ventas',
  // },
  { key: 'stock', href: '#stock', img: '/images/modules/inventory.png', label: 'Inventario' },
  {
    key: 'account',
    href: '#invoicing',
    img: '/images/modules/invoicing.png',
    label: 'Facturación',
  },
  {
    key: 'points-of-sale',
    href: '#points-of-sale',
    img: '/images/modules/POS.png',
    label: 'Puntos de venta',
  },
]

const TestView = () => {
  const { control, setValue } = useForm()
  const hash = useLocation().hash
  const [taxesSale, setTaxesSale] = useState([])
  const [taxesPurchase, setTaxesPurchase] = useState([])
  // const [currency, setCurrency] = useState([])
  const {
    createOptions,
    setNewAppDialogs,
    openDialog,
    closeDialogWithData,
    setBreadcrumb,
    setSettingsBreadcrumb,
  } = useAppStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  useEffect(() => {
    setSettingsBreadcrumb(false)
  }, [])

  const loadTaxes = async (type: string) => {
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
    if (type === 'sales') {
      setTaxesSale(newTaxes)
    } else {
      setTaxesPurchase(newTaxes)
    }
  }

  const fnc_search_taxes = async () => {
    const dialogId = openDialog({
      title: 'Buscar: Impuesto',
      dialogContent: () => (
        <ModalBase
          config={modalTaxConfig}
          multiple={false}
          onRowClick={async (option) => {
            if (option) {
              setValue('', option.tax_id)
              //setValue('partner_name', option.full_name)
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

  const fnc_navigate_tax = (value: number) => {
    setBreadcrumb([
      {
        title: 'Ajustes',
        url: pathname + hash,
        viewType: modalTaxConfig.view_default,
      },
    ])
    navigate(`/action/616/detail/${value}`)
  }

  /*
  const loadCurrency = async () => {
    const options = await createOptions({
      fnc_name: 'fnc_currency',
      filters: [{ column: 'state', value: 'A' }],
      action: 's2',
    })
    setCurrency(options)
  }
  */

  //const fnc_search_currency = async () => {}

  /*
  const fnc_navigate_currency = () => {
    setSettingsBreadcrumb(true)
    setBreadcrumb([
      {
        title: 'Ajustes',
        url: pathname + hash,
        viewType: ViewTypeEnum.LIST,
      },
    ])
    navigate(`/action/619`)
  }
  */

  const fnc_navigate_units_measure = () => {
    setSettingsBreadcrumb(true)
    setBreadcrumb([
      {
        title: 'Ajustes',
        url: pathname + hash,
        viewType: ViewTypeEnum.LIST,
      },
    ])
    navigate(`/action/91`)
  }

  const fnc_navigate_attributes = () => {
    setSettingsBreadcrumb(true)
    setBreadcrumb([
      {
        title: 'Ajustes',
        url: pathname + hash,
        viewType: ViewTypeEnum.LIST,
      },
    ])
    navigate(`/action/177`)
  }

  return (
    <>
      <div
        className="o_control_panel d-flex flex-column gap-3 gap-lg-1 px-4 pt-2 pb-4"
        data-command-category="actions"
      >
        <div className="o_control_panel_main d-flex flex-wrap flex-lg-nowrap justify-content-between align-items-lg-start gap-3 flex-grow-1">
          <div className="o_control_panel_breadcrumbs d-flex align-items-center gap-1 order-0 h-lg-100">
            <div className="o_control_panel_main_buttons d-flex gap-1 d-empty-none d-print-none">
              <div className="d-inline-flex gap-1"></div>
            </div>
            <div className="o_breadcrumb d-flex gap-1 text-truncate">
              <div className="o_last_breadcrumb_item active d-flex fs-4 min-w-0 align-items-center">
                <div className="text-gray-800 text-base text-truncate">Ajustes</div>
              </div>
              <div className="o_control_panel_breadcrumbs_actions d-inline-flex"></div>
            </div>
            <div className="o_form_buttons_edit d-flex gap-1 order-first w-auto">
              <button type="button" className="btn btn-primary o_form_button_save" data-hotkey="s">
                Guardar
              </button>
              <button
                type="button"
                className="btn btn-secondary o_form_button_cancel"
                data-hotkey="j"
              >
                Descartar
              </button>
            </div>
            <div className="me-auto"></div>
          </div>
          <div className="o_control_panel_actions d-empty-none d-flex align-items-center justify-content-start justify-content-lg-around order-2 order-lg-1 w-100 w-lg-auto">
            <Paper variant="outlined" className="w-full flex">
              <div
                className="w-full flex"
                style={{
                  paddingLeft: '5px',
                  paddingRight: '10px',
                  paddingTop: '5px',
                  paddingBottom: '4px',
                }}
              >
                <IoSearch className="self-center mr-1" size={18} />
                <div className="w-full flex items-center InputSearchEx">
                  <InputBase
                    sx={{ flex: 1 }}
                    placeholder="Buscar ..."
                    inputProps={{ 'aria-label': 'buscar ...' }}
                    fullWidth
                  />
                </div>
              </div>
            </Paper>
          </div>
          <div className="o_control_panel_navigation d-flex flex-wrap flex-md-nowrap justify-content-end gap-1 gap-xl-3 order-1 order-lg-2 flex-grow-1">
            <button
              className="o_knowledge_icon_search btn opacity-trigger-hover"
              type="button"
              title="Buscar en artículos de información"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
                className="o_ui_app_icon oi oi-fw"
              >
                <path
                  fill="var(--oi-color, #1AD3BB)"
                  d="M21 0c-2 0-4 2-4 3.99V12h18v20.071l5.428 3.748A1 1 0 0 0 42 35.001V0H21Z"
                  className="opacity-50 opacity-100-hover"
                />
                <path
                  fill="var(--oi-color, #985184)"
                  d="M8 17.99C8 16 10 14 12 14h21v35a1 1 0 0 1-1.572.82L23 44c-1.5-1-3.5-1-5 0l-8.428 5.82A1 1 0 0 1 8 49V17.99Z"
                />
                <path
                  fill="var(--oi-color, #005E7A)"
                  d="M33 30.658 32 30c-1.5-1-3.5-1-5 0l-8.428 5.82A1 1 0 0 1 17 35V14h16v16.658Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/*content */}
      <main className="o_content">
        <div className="o_form_renderer o_form_editable d-block min-h-screen">
          <div className="o_setting_container ">
            <SettingSideBar tabs={tabs} />
            <div className="settings ">
              {hash === '#general_settings' || hash === '' ? (
                <div className="app_settings_block " data-key="general_settings">
                  <SettingSection
                    title="Certificados y claves"
                    id_component="invite_users"
                    right_panes={[]}
                    left_panes={[]}
                  />
                </div>
              ) : null}
              {/* 
              {hash === '#sale_management' ? (
                <div className="app_settings_block " data-key="sale_management">
                  <div id="">
                    <h2>
                      <span>Precios</span>
                    </h2>
                    <div className="row mt-4 o_settings_container">
                      <CheckboxSetting
                        title="Descuentos"
                        description="Ofrezca descuentos en las líneas de las órdenes de venta"
                      />
                      <CheckboxSetting
                        title="Listas de precios"
                        description="Establezca varios precios por producto, descuentos automáticos, etc."
                        buttonDescription="Listas de precios"
                        fnc_navigate={fnc_navigate_units_measure}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
               */}
              {hash === '#stock' ? (
                <div className="app_settings_block " data-key="stock">
                  <div id="">
                    <h2>
                      <span>Productos</span>
                    </h2>
                    <div className="row mt-4 o_settings_container">
                      <CheckboxSetting
                        title="Variantes"
                        description="Establecer los atributos del producto (por ejemplo, color, tamaño) para administrar las variantes"
                        buttonDescription="Atributos"
                        fnc_navigate={fnc_navigate_attributes}
                      />
                      <CheckboxSetting
                        title="Unidades de medida y embalajes"
                        description="Venda y compre productos en diferentes unidades de medida o embalajes"
                        buttonDescription="Unidades y embalajes"
                        fnc_navigate={fnc_navigate_units_measure}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {hash === '#invoicing' ? (
                <div className="app_settings_block " data-key="stock">
                  <div id="">
                    <h2>
                      <span>Impuestos</span>
                    </h2>
                    <div className="row mt-6 o_settings_container">
                      <div className="o_setting_box col-12 col-lg-6 o_searchable_setting mt-4">
                        <div className="o_setting_left_pane"></div>
                        <div className="o_setting_right_pane mt-1">
                          <span className="o_form_label">Impuestos predeterminados</span>
                          <div className="text-muted">
                            Impuestos predeterminados aplicados al crear nuevos productos.
                          </div>
                          <div className="mt16">
                            <div className="content-group">
                              <div>
                                <label className="o_form_label text-muted">Impuesto de venta</label>
                                <div className="o_field_widget o_field_many2one_tax_tags o_field_many2one">
                                  <div className="o_field_many2one_selection mx-2">
                                    <AutocompleteControlled
                                      name={'tax_sale'}
                                      control={control}
                                      errors={{}}
                                      options={taxesSale}
                                      fnc_loadOptions={() => loadTaxes('sale')}
                                      editConfig={{ config: {} }}
                                      handleOnChanged={() => {}}
                                      fnc_enlace={fnc_navigate_tax}
                                      enlace={true}
                                      loadMoreResults={() => fnc_search_taxes('sale')}
                                    />
                                  </div>
                                </div>
                              </div>
                              <label className="o_form_label text-muted">Impuesto de compra</label>
                              <div className="o_field_widget o_field_many2one_tax_tags o_field_many2one">
                                <div className="o_field_many2one_selection mx-2">
                                  <AutocompleteControlled
                                    name={'taxes_purchase'}
                                    control={control}
                                    errors={{}}
                                    options={taxesPurchase}
                                    fnc_loadOptions={() => loadTaxes('purchase')}
                                    editConfig={{ config: {} }}
                                    handleOnChanged={() => {}}
                                    enlace={true}
                                    fnc_enlace={fnc_navigate_tax}
                                    loadMoreResults={() => fnc_search_taxes('purchase')}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*
                  <div id="">
                    <h2>
                      <span>Monedas</span>
                    </h2>
                    <div className="row mt-4 o_settings_container">
                      <div className="o_setting_box col-12 col-lg-6 o_searchable_setting mt-4">
                        <div className="o_setting_left_pane"></div>
                        <div className="o_setting_right_pane mt-4">
                          <label className="o_form_label">Moneda principal</label>
                          <div className="text-muted">Moneda principal de su empresa</div>
                          <div>
                            <label className="o_form_label text-muted mt-3">Moneda</label>
                            <div className="o_field_widget o_field_many2one_tax_tags o_field_many2one">
                              <div className="o_field_many2one_selection mx-2">
                                <AutocompleteControlled
                                  name={'currency_id'}
                                  control={control}
                                  errors={{}}
                                  options={currency}
                                  fnc_loadOptions={loadCurrency}
                                  editConfig={{ config: {} }}
                                  handleOnChanged={() => {}}
                                  loadMoreResults={fnc_search_currency}
                                />
                              </div>
                            </div>
                            <div className="d-flex mt-2">
                              <div
                                className="text-teal-600 cursor-pointer font-semibold justify-center"
                                onClick={fnc_navigate_currency}
                              >
                                <Tooltip title="Ver producto" placement="bottom">
                                  <button type="button" className="cursor-pointer ml-1 w-fit flex">
                                    <TbArrowNarrowRight className="w-5 h-6 text-gray-500 hover:text-teal-600" />
                                    Monedas
                                  </button>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  */}
                </div>
              ) : null}
              {hash === '#points-of-sale' ? (
                <div className="app_settings_block " data-key="points-of-sale">
                  <div id="">
                    <h2>
                      <span>Puntos de venta</span>
                    </h2>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default TestView
