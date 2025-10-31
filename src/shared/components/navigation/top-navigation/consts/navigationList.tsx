import { ModulesEnum } from '@/shared/shared.types'
import { MenuItemType } from '@/shared/components/navigation/navigation.types'
import Frm_894_config from '@/modules/action/views/point-of-sale/order-detail-modal/config'
import PosReportSessionConfig from '@/modules/action/views/point-of-sale/report-session-modal/config'
import { generateExcel } from '@/modules/pos-carnes/views/modal-payment-list/components/ExcelReport'
import * as XLSX from 'xlsx'
import { downloadAccountsReportPDF } from '@/modules/invoicing/components/AcountsReport'
import { downloadCustomerAccountsReportPDF } from '@/modules/invoicing/components/customerAccountStatementReport'
import { Type_pos_payment_origin, TypeStateOrder, TypeStatePayment } from '@/modules/pos-pg/types'
import { transformOrders, transformOrdersWithPayments } from '@/shared/helpers/helpers'
import { CustomToast } from '@/components/toast/CustomToast'

export const navigationList: Record<ModulesEnum, MenuItemType | null> = {
  [ModulesEnum.BASE]: null,
  [ModulesEnum.ACTION]: null,
  [ModulesEnum.CONTACTS]: {
    title: 'Contactos',
    key: 'Contactos',
    items: [
      {
        title: 'Contactos',
        key: 'Contactos-contacts',
        path: '/contacts',
      },
      {
        title: 'Configuración',
        key: 'Configuración-contacts',
        items: [
          {
            title: 'Etiquetas de contacto',
            key: 'Etiquetas-de-contacto-contacts',
            path: '/action/101',
          },
          {
            title: 'Industrias',
            key: 'Industrias-contacts',
            path: '/action/103',
          },
          /*
          {
            title: 'Títulos de contacto',
            key: 'Títulos-de-contacto-contacts',
            path: '/action/102',
          },
          */
          /*
          {
            title: 'Localización',
            key: 'localización-contacts',
            items: [
              {
                title: 'Países',
                key: 'countries-contacts',
                path: '/action/160',
              },
              {
                title: 'Departamentos',
                key: 'departaments-contacts',
                path: '/action/161',
              },
              {
                title: 'Provincias',
                key: 'departaments-contacts',
                path: '/action/162',
              },
              {
                title: 'Distritos',
                key: 'departaments-contacts',
                path: '/action/163',
              },
            ],
          },
          */
          {
            title: 'Cuentas bancarias',
            key: 'Cuentas-bancarias-contacts',
            items: [
              {
                title: 'Bancos',
                key: 'Bancos-contacts',
                path: '/action/109',
              },
              {
                title: 'Cuentas bancarias',
                key: 'Cuentas-bancarias-contacts',
                path: '/action/110',
              },
            ],
          },
          {
            title: 'Tipos de identificación',
            key: 'Tipo-de-Identificación-contacts',
            path: '/action/111',
          },
        ],
      },
    ],
  },
  [ModulesEnum.INVOICING]: {
    title: 'Facturación',
    key: 'facturacion',
    items: [
      {
        title: 'Tablero',
        key: 'fac-tablero',
        path: '/action/187',
      },
      {
        title: 'Clientes',
        key: 'clientes-fac',
        items: [
          {
            title: 'Facturas',
            key: 'facturas-fac-clientes',
            path: '/invoicing',
          },
          {
            title: 'Notas de crédito',
            key: 'notas-de-credito-fac-clientes',
            path: '',
          },
          {
            title: 'Pagos',
            key: 'pagos-fac-clientes',
            path: '/action/742',
          },
          {
            title: 'Productos',
            key: 'productos-fac-clientes',
            path: '/action/302',
          },
          {
            title: 'Clientes',
            key: 'sub-clientes-fac-clientes',
            path: '/action/605',
          },
        ],
      },
      /*
      {
        title: 'Proveedores',
        key: 'proveedores-fac',
        items: [
          {
            title: 'Facturas',
            key: 'facturas-fac-proveedor',
            path: '',
          },
          {
            title: 'Reembolsos',
            key: 'reembolsos-fac',
            path: '',
          },
          {
            title: 'Importes a pagar',
            key: 'importes-a-pagar-fac',
            path: '',
          },
          {
            title: 'Pagos',
            key: 'pagos-fac',
            path: '',
          },
          {
            title: 'Cuentas bancarias',
            key: 'cuentas-bancarias-fac',
            path: '/action/112',
          },
          {
            title: 'Productos',
            key: 'productos-fac-proveedores',
            path: '/action/302',
          },
          {
            title: 'Proveedores',
            key: 'sub-proveedores-fac',
            path: '/action/606',
          },
        ],
      },
      */
      {
        title: 'Reportes',
        key: 'reportes-rep',
        items: [
          {
            title: 'Gestión',
            key: 'sub-gestion-rep',
            items: [
              {
                title: 'Análisis de facturas',
                key: 'analisis-de-facturas-rep',
                path: '/action/667',
              },
            ],
          },
        ],
      },
      {
        title: 'Configuración',
        key: 'configuracion-rep',
        items: [
          {
            title: 'Ajustes',
            key: 'ajustes-rep',
            path: '/settings#invoicing',
          },
          {
            title: 'Contabilidad',
            key: 'contabilidad-rep',
            items: [
              {
                title: 'Impuestos',
                key: 'impuestos-rep',
                path: '/action/616',
              },
              {
                title: 'Diarios',
                key: 'diarios-rep',
                path: '/action/622',
              },
              /*
              {
                title: 'Monedas',
                key: 'divisas-rep',
                path: '/action/619',
              },
              */
              /*
              {
                title: 'Posiciones fiscales',
                key: 'posiciones-fiscales-rep',
                path: '',
              },
              */
              /*
              {
                title: 'Grupos de diarios',
                key: 'grupos-de-diarios-rep',
                path: '',
              },
              */
              {
                title: 'Tipos de documentos',
                key: 'tipos-de-documentos-rep',
                path: '/action/746',
              },
            ],
          },
          {
            title: 'Facturación',
            key: 'facturacion-rep',
            items: [
              {
                title: 'Términos de pago',
                key: 'condiciones-de-pago-rep',
                path: '/action/613',
              },
              {
                title: 'Categorías de productos',
                key: 'categorias-de-productos-rep',
                path: '/action/181',
              },
              /*
              {
                title: 'Incoterms',
                key: 'incoterms-rep',
                path: '',
              },
              */
            ],
          },
          /*
          {
            title: 'Bancos',
            key: 'bancos-rep',
            items: [
              {
                title: 'Agregar una cuenta bancaria',
                key: 'agregar-una-cuenta-bancaria-rep',
                path: '',
              },
            ],
          },
          */
          {
            title: 'Pagos en línea',
            key: 'pagos-en-linea-rep',
            items: [
              {
                title: 'Proveedores de pago',
                key: 'proveedores-de-pago-rep',
                path: '',
              },
              {
                title: 'Métodos de pago',
                key: 'metodos-de-pago-rep',
                path: '/action/621',
              },
            ],
          },
          /*
          {
            title: 'Gestion',
            key: 'gestion-rep',
            items: [
              {
                title: 'Unidades y embalajes',
                key: 'Unidades-y-embalajes-rep',
                path: '/action/92',
              },
            ],
          },
          */
          {
            title: 'Perú',
            key: 'peru-rep',
            items: [
              {
                title: 'Certificados',
                key: 'certificados-rep',
                path: '',
              },
            ],
          },
        ],
      },
    ],
  },

  [ModulesEnum.SALES]: {
    title: 'ventas',
    key: 'ventas-ven',
    items: [
      {
        title: 'Órdenes',
        key: 'órdenes-ven',
        items: [
          {
            title: 'Cotizaciones',
            key: 'cotizaciones-ven',
            path: '',
          },
          {
            title: 'Órdenes',
            key: 'sub-ordenes-ven',
            path: '',
          },
          {
            title: 'Equipos de ventas',
            key: 'equipos-de-ventas-ven-ordenes',
            path: '',
          },
          {
            title: 'Clientes',
            key: 'clientes-ven-order',
            path: '/web?menu=3&config=101',
          },
        ],
      },
      {
        title: 'Por facturar',
        key: 'por-facturar-ven',
        items: [
          {
            title: 'Órdenes a facturar',
            key: 'órdenes-a-facturar-ven',
            path: '',
          },
          {
            title: 'Órdenes para crear ventas adicionales',
            key: 'órdenes-para-crear-ventas-adicionales-ven',
            path: '',
          },
        ],
      },
      {
        title: 'Productos',
        key: 'productos-ven-sales',
        items: [
          {
            title: 'Productos',
            key: 'sub-productos-ven',
            path: '',
          },
          {
            title: 'Variantes de producto',
            key: 'variantes-de-producto-ven',
            path: '',
          },
          {
            title: 'Listas de precios',
            key: 'listas-de-precios-ven',
            path: '',
          },
        ],
      },
      {
        title: 'Reportes',
        key: 'reportes-ven',
        items: [
          {
            title: 'Ventas',
            key: 'ventas-ven-report',
            path: '',
          },
          {
            title: 'Vendedores',
            key: 'vendedores-ven',
            path: '',
          },
          {
            title: 'Productos',
            key: 'productos-ven-report',
            path: '',
          },
          {
            title: 'Clientes',
            key: 'clientes-ven-report',
            path: '',
          },
        ],
      },
      {
        title: 'Configuración',
        key: 'configuración-ven',
        items: [
          {
            title: 'Ajustes',
            key: 'ajustes-ven',
            path: '/settings#stock',
          },
          {
            title: 'Equipos de ventas',
            key: 'equipos-de-ventas-ven-configuration',
            path: '',
          },
          {
            title: 'Órdenes de venta',
            key: 'órdenes-de-venta-ven',
            items: [
              {
                title: 'Etiquetas',
                key: 'etiquetas-ven',
                path: '',
              },
            ],
          },
          {
            title: 'Productos',
            key: 'productos-ven-configuration',
            items: [
              {
                title: 'Atributos',
                key: 'atributos-ven',
                path: '',
              },
              {
                title: 'Categorías de producto',
                key: 'categorías-de-producto-ven',
                path: '',
              },
            ],
          },
          {
            title: 'Pagos en línea',
            key: 'pagos-en-línea-ven',
            items: [
              {
                title: 'Proveedores de pago',
                key: 'proveedores-de-pago-ven',
                path: '',
              },
              {
                title: 'Métodos de pago',
                key: 'métodos-de-pago-ven',
                path: '',
              },
            ],
          },
          {
            title: 'Unidades de medida',
            key: 'unidades-de-medida-ven',
            items: [
              {
                title: 'Categorías de las unidades de medida',
                key: 'categorías-de-las-unidades-de-medida-ven',
                path: '',
              },
            ],
          },
          {
            title: 'Planes de actividades',
            key: 'planes-de-actividades-ven',
            path: '',
          },
        ],
      },
    ],
  },
  [ModulesEnum.SETTINGS]: {
    title: 'Ajustes',
    key: 'Ajustes-settings',
    items: [
      {
        title: 'Ajustes generales',
        key: 'ajustes-generales-settings',
      },
      {
        title: 'Configuración',
        key: 'Configuración-settings',
        items: [
          {
            title: 'Usuarios',
            key: 'Usuarios-settings',
            path: '/action/2',
          },

          {
            title: 'Empresas',
            key: 'Empresas-settings',
            path: '/action/4',
          },
        ],
      },
    ],
  },
  [ModulesEnum.INVENTORY]: {
    title: 'Inventario',
    key: 'Inventario-inventory',
    items: [
      /*
      {
        title: 'Información general',
        key: 'Información general-inventory',
        path: '/inventory',
      },
      {
        title: 'Operaciones',
        key: 'Operaciones-inventory',
        items: [
          {
            title: 'Traslados',
            key: 'Traslados-inventory',
            items: [
              {
                title: 'Recepciones',
                key: 'Recepciones-inventory',
                path: '',
              },
              {
                title: 'Entregas',
                key: 'Entregas-inventory',
                path: '',
              },
            ],
          },
          {
            title: 'Ajustes',
            key: 'Ajustes-inventory',
            items: [
              {
                title: 'Inventario físico',
                key: 'Inventario físico-inventory',
                path: '',
              },
              {
                title: 'Desechar',
                key: 'Desechar-inventory',
                path: '',
              },
            ],
          },
          {
            title: 'Aprovisionamiento',
            key: 'Aprovisionamiento-inventory',
            items: [
              {
                title: 'Reabastecimiento',
                key: 'Reabastecimiento-inventory',
                path: '',
              },
            ],
          },
        ],
      },
      */
      {
        title: 'Productos',
        key: 'Productos-inventory',
        items: [
          {
            title: 'Productos',
            key: 'sub-Productos-inventory',
            path: '/action/301',
          },
          {
            title: 'Variantes del producto',
            key: 'Variantes del producto-inventory',
            path: '/action/303',
          },
        ],
      },
      /*
      {
        title: 'Reportes',
        key: 'Reportes-inventory',
        items: [
          {
            title: 'Existencias',
            key: 'Existencias-inventory',
            path: '',
          },
          {
            title: 'Historial de movimientos',
            key: 'Historial de movimientos-inventory',
            path: '',
          },
          {
            title: 'Análisis de movimientos',
            key: 'Análisis de movimientos-inventory',
            path: '',
          },
          {
            title: 'Valoración',
            key: 'Valoración-inventory',
            path: '',
          },
        ],
      },
      */
      {
        title: 'Configuración',
        key: 'Configuración-inventory',
        items: [
          {
            title: 'Ajustes',
            key: 'sub-Ajustes-inventory',
            path: '/settings#stock',
          },
          /*
          {
            title: 'Gestión de almacén',
            key: 'Gestión de almacén-inventory',
            items: [
              {
                title: 'Almacenes',
                key: 'Almacenes-inventory',
                path: '/action/156',
              },
              {
                title: 'Tipos de operaciones',
                key: 'Tipos de operaciones-inventory',
                path: '/action/195',
              },
            ],
          },
          */
          {
            title: 'Productos',
            key: 'Productos-inventory-config',
            items: [
              {
                title: 'Categorías',
                key: 'Categorías-inventory',
                path: '/action/180',
              },
              {
                title: 'Atributos',
                key: 'Atributos-inventory',
                path: '/action/177',
              },
              {
                title: 'Unidades y embalajes',
                key: 'Unidades-y-embalajes-inventory',
                path: '/action/91',
              },
            ],
          },
        ],
      },
    ],
  },
  [ModulesEnum.POINTS_OF_SALE]: {
    title: 'Puntos de venta',
    key: 'Puntos de venta-contacts',
    items: [
      {
        title: 'Tablero',
        key: 'Puntos de venta-pos',
        path: '/points-of-sale',
      },
      {
        title: 'Órdenes',
        key: 'ordenes-menu',
        items: [
          { title: 'Sesiones', key: 'sesiones', path: '/action/889' },
          { title: 'Órdenes', key: 'ordenes', path: '/action/888' },
          { title: 'Pagos', key: 'pagos', path: '/action/890' },
          /*
          {
            title: 'Preparation Display',
            key: 'preparation-display',
            path: '/preparation-display',
          },
          */
          { title: 'Clientes', key: 'clientes', path: '/action/895' },
        ],
      },

      /*
      {
        title: 'Herramientas',
        key: 'tools-menu',
        items: [
          {
            title: 'Pagar recibos',
            key: 'pagar-recibos',
            path: '/action/930',
            openAsModal: true,
            modalConfig: {
              initialValues: {
                fncName: 'fnc_pos_order',
                action: 's',
                data: [[1, 'pag', 1]],
              },
              size: 'medium',
              title: 'Pagar recibo',
              config: Frm_830_config,
            },
          },
        ],
      },
      */

      {
        title: 'Productos',
        key: 'productos-menu',
        items: [
          { title: 'Productos', key: 'productos', path: '/action/898' },
          { title: 'Variantes de producto', key: 'variantes-producto', path: '/action/899' },
          // { title: 'Opciones de los combos', key: 'opciones-combos', path: '/combo-options' },
          // { title: 'Listas de precios', key: 'listas-precios', path: '/price-lists' },
        ],
      },
      {
        title: 'Reportes',
        key: 'reportes-menu',
        items: [
          { title: 'Órdenes', key: 'ordenes', path: '/action/893' },
          {
            title: 'Detalles de las ventas',
            key: 'sesiones',
            path: '/action/894',
            openAsModal: true,
            modalConfig: {
              size: 'medium',
              title: 'Detalle de la Sesión',
              config: Frm_894_config,
              customButtons: [
                {
                  text: 'Imprimir PDF',
                  type: 'confirm',
                  onClick: () => {
                    import('@/modules/invoicing/components/SalesReportPDF').then((module) => {
                      const SalesReportPDF = module.default

                      import('@react-pdf/renderer').then((pdfModule) => {
                        const { pdf } = pdfModule
                        pdf(SalesReportPDF())
                          .toBlob()
                          .then((blob) => {
                            const url = URL.createObjectURL(blob)
                            const link = document.createElement('a')
                            link.href = url
                            link.download = 'detalle-ventas.pdf'
                            link.click()
                            URL.revokeObjectURL(url)
                          })
                      })
                    })
                  },
                },
              ],
            },
          },
          {
            title: 'Reporte de la sesión',
            key: 'pagos',
            path: '#',
            openAsModal: true,
            modalConfig: {
              size: 'medium',
              title: 'Reporte de la sesión',
              config: PosReportSessionConfig,
              customButtons: [
                {
                  text: 'Imprimir',
                  type: 'confirm',
                  onClick: () => {
                    import('@/modules/invoicing/components/SessionReportPDF').then((module) => {
                      const SessionReportPDF = module.default

                      import('@react-pdf/renderer').then((pdfModule) => {
                        const { pdf } = pdfModule
                        pdf(SessionReportPDF())
                          .toBlob()
                          .then((blob) => {
                            const url = URL.createObjectURL(blob)
                            const link = document.createElement('a')
                            link.href = url
                            link.download = 'reporte-sesion.pdf'
                            link.click()
                            URL.revokeObjectURL(url)
                          })
                      })
                    })
                  },
                },
              ],
            },
          },
          // { title: 'Tiempo de preparación', key: 'clientes', path: '#' },
        ],
      },
      {
        title: 'Configuración',
        key: 'configuracion-menu',
        items: [
          { title: 'Ajustes', key: 'ajustes', path: '/settings#points-of-sale' },
          { title: 'Métodos de pago', key: 'metodos-pago', path: '/action/891' },
          {
            title: 'Monedas/billetes',
            key: 'monedas-billetes',
            path: '/action/896',
          },
          { title: 'Punto de venta', key: 'punto-venta', path: '/action/892' },
          { title: 'Modelos de nota', key: 'modelos-nota', path: '/configuracion/modelos-nota' },
          { title: 'Dispositivos', key: 'weighing-scale', path: '/action/901' },
          /*
          {
            title: 'Pricer',
            key: 'pricer-submenu',
            items: [
              {
                title: 'Tiendas Pricer',
                key: 'tiendas-pricer',
                path: '/configuracion/pricer/tiendas',
              },
              {
                title: 'Etiquetas de Pricer',
                key: 'etiquetas-pricer',
                path: '/configuracion/pricer/etiquetas',
              },
            ],
          },
          */
          {
            title: 'Productos',
            key: 'productos-submenu',
            items: [
              {
                title: 'Categorías de producto de PdV',
                key: 'categories-pos-inventory',
                path: '/action/93',
              },
              { title: 'Atributos', key: 'atributos', path: '/action/897' },
              { title: 'Contenedor', key: 'Contenedor', path: '/action/900' },
              /*  {
                title: 'Etiquetas de producto',
                key: 'etiquetas-producto',
                path: '/configuracion/productos/etiquetas',
              }*/
            ],
          },
        ],
      },
    ],
  },
  [ModulesEnum.POINTS_OF_SALE_MEAT]: {
    title: 'Puntos de venta',
    key: 'Puntos de venta-contacts',
    items: [
      {
        title: 'Tablero',
        key: 'Puntos de venta-pos',
        path: '/points-of-sale-meat',
      },
      {
        title: 'Órdenes',
        key: 'ordenes-menu',
        items: [
          { title: 'Sesiones', key: 'sesiones', path: '/action/200' },
          { title: 'Órdenes', key: 'ordenes', path: '/action/201' },
          { title: 'Pagos', key: 'pagos', path: '/action/202' },
          /*
          {
            title: 'Preparation Display',
            key: 'preparation-display',
            path: '/preparation-display',
          },
          */
          { title: 'Clientes', key: 'clientes', path: '/action/203' },

          /*
          {
            title: 'Pagar recibos',
            key: 'pagar-recibos',
            path: '/action/930',
            openAsModal: true,
            modalConfig: {
              initialValues: {
                fncName: 'fnc_pos_order',
                action: 's',
                data: [[1, 'pag', 1]],
              },
              size: 'medium',
              title: 'Pagar recibo',
              config: Frm_830_config,
            },
          },
          */
        ],
      },

      /*
      {
        title: 'Herramientas',
        key: 'tools-menu',
        items: [
          {
            title: 'Pagar recibos',
            key: 'pagar-recibos',
            path: '/action/930',
            openAsModal: true,
            modalConfig: {
              initialValues: {
                fncName: 'fnc_pos_order',
                action: 's',
                data: [[1, 'pag', 1]],
              },
              size: 'medium',
              title: 'Pagar recibo',
              config: Frm_830_config,
            },
          },
        ],
      },
      */

      {
        title: 'Productos',
        key: 'productos-menu',
        items: [
          { title: 'Productos', key: 'productos', path: '/action/204' },
          { title: 'Variantes de producto', key: 'variantes-producto', path: '/action/205' },
          // { title: 'Opciones de los combos', key: 'opciones-combos', path: '/combo-options' },
          // { title: 'Listas de precios', key: 'listas-precios', path: '/price-lists' },
        ],
      },
      {
        title: 'Reportes',
        key: 'reportes-menu',
        items: [
          { title: 'Órdenes', key: 'ordenes', path: '/action/893' },
          {
            title: 'Detalles de las ventas',
            key: 'sesiones',
            path: '/action/894',
            openAsModal: true,
            modalConfig: {
              size: 'medium',
              title: 'Detalle de la Sesión',
              config: Frm_894_config,
              customButtons: [
                {
                  text: 'Descargar PDF',
                  type: 'confirm',
                  onClick: async (id, close, fncExecute) => {
                    const { oj_data } = await fncExecute('fnc_pos_order ', 's', [
                      [2, 'list_select_all'],
                      [0, 'fequal', 'state', 'R'],
                    ])

                    import(
                      '@/modules/pos-carnes/views/modal-payment-list/components/SalesByClientPDF.tsx'
                    ).then((module) => {
                      const OrdersReportPDF = module.default

                      import('@react-pdf/renderer').then((pdfModule) => {
                        const { pdf } = pdfModule

                        const orders = oj_data

                        import('react').then((React) => {
                          pdf(React.createElement(OrdersReportPDF, { orders }))
                            .toBlob()
                            .then((blob) => {
                              const url = URL.createObjectURL(blob)
                              const link = document.createElement('a')
                              link.href = url
                              link.download = 'detalle-ventas.pdf'
                              link.click()
                              URL.revokeObjectURL(url)
                            })
                        })
                      })
                    })
                  },
                },
                {
                  text: 'Descargar Excel',
                  type: 'confirm',
                  onClick: async (id, close, fncExecute) => {
                    const { oj_data } = await fncExecute('fnc_pos_order ', 's', [
                      [2, 'list_select_all'],
                    ])

                    const wb = generateExcel(oj_data)
                    XLSX.writeFile(wb, `pedido_123.xlsx`)
                  },
                },
              ],
            },
          },
          {
            title: 'Reporte de la sesión',
            key: 'pagos',
            path: '#',
            openAsModal: true,
            modalConfig: {
              size: 'medium',
              title: 'Reporte de la sesión',
              config: PosReportSessionConfig,
              customButtons: [
                {
                  text: 'Descargar PDF',
                  type: 'confirm',
                  onClick: () => {
                    import('@/modules/invoicing/components/SessionReportPDF').then((module) => {
                      const SessionReportPDF = module.default

                      import('@react-pdf/renderer').then((pdfModule) => {
                        const { pdf } = pdfModule
                        pdf(SessionReportPDF())
                          .toBlob()
                          .then((blob) => {
                            const url = URL.createObjectURL(blob)
                            const link = document.createElement('a')
                            link.href = url
                            link.download = 'reporte-sesion.pdf'
                            link.click()
                            URL.revokeObjectURL(url)
                          })
                      })
                    })
                  },
                },
              ],
            },
          },
          // { title: 'Tiempo de preparación', key: 'clientes', path: '#' },
        ],
      },
      {
        title: 'Configuración',
        key: 'configuracion-menu',
        items: [
          { title: 'Ajustes', key: 'ajustes', path: '/settings#points-of-sale' },
          { title: 'Métodos de pago', key: 'metodos-pago', path: '/action/206' },
          {
            title: 'Monedas/billetes',
            key: 'monedas-billetes',
            path: '/action/207',
          },
          { title: 'Punto de venta', key: 'punto-venta', path: '/action/209' },
          { title: 'Modelos de nota', key: 'modelos-nota', path: '/configuracion/modelos-nota' },
          { title: 'Dispositivos', key: 'weighing-scale', path: '/action/208' },
          /*
          {
            title: 'Pricer',
            key: 'pricer-submenu',
            items: [
              {
                title: 'Tiendas Pricer',
                key: 'tiendas-pricer',
                path: '/configuracion/pricer/tiendas',
              },
              {
                title: 'Etiquetas de Pricer',
                key: 'etiquetas-pricer',
                path: '/configuracion/pricer/etiquetas',
              },
            ],
          },
          */
          {
            title: 'Productos',
            key: 'productos-submenu',
            items: [
              {
                title: 'Categorías de producto de PdV',
                key: 'categories-pos-inventory',
                path: '/action/210',
              },
              { title: 'Atributos', key: 'atributos', path: '/action/211' },
              { title: 'Contenedor', key: 'Contenedor', path: '/action/212' },
              /*  {
                title: 'Etiquetas de producto',
                key: 'etiquetas-producto',
                path: '/configuracion/productos/etiquetas',
              }*/
            ],
          },
        ],
      },
    ],
  },
  [ModulesEnum.POINTS_OF_SALE_PG]: {
    title: 'Puntos de venta',
    key: 'Puntos de venta-contacts',
    items: [
      {
        title: 'Tablero',
        key: 'Puntos de venta-pos',
        path: '/points-of-sale-pg',
      },
      {
        title: 'Órdenes',
        key: 'ordenes-menu',
        items: [
          { title: 'Sesiones', key: 'sesiones', path: '/action/400' },
          { title: 'Órdenes', key: 'ordenes', path: '/action/401' },
          { title: 'Pagos', key: 'pagos', path: '/action/402' },
          /*
          {
            title: 'Preparation Display',
            key: 'preparation-display',
            path: '/preparation-display',
          },
          */
          { title: 'Clientes', key: 'clientes', path: '/action/403' },

          /*
          {
            title: 'Pagar recibos',
            key: 'pagar-recibos',
            path: '/action/930',
            openAsModal: true,
            modalConfig: {
              initialValues: {
                fncName: 'fnc_pos_order',
                action: 's',
                data: [[1, 'pag', 1]],
              },
              size: 'medium',
              title: 'Pagar recibo',
              config: Frm_830_config,
            },
          },
          */
        ],
      },

      /*
      {
        title: 'Herramientas',
        key: 'tools-menu',
        items: [
          {
            title: 'Pagar recibos',
            key: 'pagar-recibos',
            path: '/action/930',
            openAsModal: true,
            modalConfig: {
              initialValues: {
                fncName: 'fnc_pos_order',
                action: 's',
                data: [[1, 'pag', 1]],
              },
              size: 'medium',
              title: 'Pagar recibo',
              config: Frm_830_config,
            },
          },
        ],
      },
      */

      {
        title: 'Productos',
        key: 'productos-menu',
        items: [
          { title: 'Productos', key: 'productos', path: '/action/404' },
          { title: 'Variantes de producto', key: 'variantes-producto', path: '/action/405' },
          // { title: 'Opciones de los combos', key: 'opciones-combos', path: '/combo-options' },
          // { title: 'Listas de precios', key: 'listas-precios', path: '/price-lists' },
        ],
      },
      {
        title: 'Reportes',
        key: 'reportes-menu',
        items: [
          // { title: 'Órdenes', key: 'ordenes', path: '/action/893' },
          {
            title: 'Detalles de las ventas',
            key: 'sesiones',
            path: '/action/894',
            openAsModal: true,
            modalConfig: {
              size: 'medium',
              title: 'Detalle de la Sesión',
              config: Frm_894_config,
              customButtons: [
                {
                  text: 'Descargar PDF',
                  type: 'confirm',
                  onClick: async (id, close, fncExecute) => {
                    const { oj_data } = await fncExecute('fnc_pos_order ', 's', [
                      [2, 'list_select_all'],
                      [0, 'fequal', 'state', 'R'],
                    ])

                    import(
                      '@/modules/pos-carnes/views/modal-payment-list/components/SalesByClientPDF.tsx'
                    ).then((module) => {
                      const OrdersReportPDF = module.default

                      import('@react-pdf/renderer').then((pdfModule) => {
                        const { pdf } = pdfModule

                        const orders = oj_data

                        import('react').then((React) => {
                          pdf(React.createElement(OrdersReportPDF, { orders }))
                            .toBlob()
                            .then((blob) => {
                              const url = URL.createObjectURL(blob)
                              const link = document.createElement('a')
                              link.href = url
                              link.download = 'detalle-ventas.pdf'
                              link.click()
                              URL.revokeObjectURL(url)
                            })
                        })
                      })
                    })
                  },
                },
                {
                  text: 'Descargar Excel',
                  type: 'confirm',
                  onClick: async (id, close, fncExecute) => {
                    if (!fncExecute) return
                    const { oj_data } = await fncExecute('fnc_pos_order ', 's', [
                      [2, 'list_select_all'],
                    ])

                    const wb = generateExcel(oj_data)
                    XLSX.writeFile(wb, `pedido_123.xlsx`)
                  },
                },
              ],
            },
          },
          {
            title: 'Reporte de pagos',
            key: 'reporte-pagos',
            path: '#',
            onClick: async (navigate, executeFnc) => {
              const { oj_data } = await executeFnc('fnc_pos_customer_debt_report', '', [])
              try {
                await downloadAccountsReportPDF(oj_data[0].details)
              } catch (error) {
                console.error('Error al descargar PDF:', error)
              }
            },
          },
          {
            title: 'Reporte de estado de la cuenta',
            key: 'report-state',

            openAsModal: true,
            modalConfig: {
              size: 'medium',
              title: 'Detalle de la Sesión',
              config: Frm_894_config,
              customButtons: [
                {
                  text: 'Descargar PDF',
                  type: 'confirm',
                  onClick: async (id, close, fncExecute, getData) => {
                    const formData = getData()
                    const errors: { message: string }[] = []
                    if (!formData.partner_id) errors.push({ message: 'Seleccione un cliente.' })
                    if (!formData.date_start)
                      errors.push({ message: 'Seleccione una fecha de inicio.' })
                    if (!formData.date_end)
                      errors.push({ message: 'Seleccione una fecha de finalizacion.' })
                    if (errors.length > 0) {
                      CustomToast({
                        title: 'Falta completar campos',
                        items: errors,
                        type: 'error',
                      })
                      return null
                    }
                    const { oj_data } = await fncExecute('fnc_pos_order ', 's_pos', [
                      [
                        0,
                        'fbetween',
                        'order_date',
                        formData.date_start.toLocaleString(),
                        formData.date_end.toLocaleString(),
                      ],
                      [0, 'fequal', 'partner_id', formData.partner_id],
                      [0, 'fequal', 'state', TypeStateOrder.REGISTERED],
                      [2, 'list_select_all'],
                    ])
                    const { oj_data: payments } = await fncExecute('fnc_pos_payment', 's', [
                      [
                        0,
                        'fbetween',
                        'date',
                        formData.date_start.toLocaleString(),
                        formData.date_end.toLocaleString(),
                      ],
                      [0, 'fequal', 'report_partner_id', formData.partner_id],
                      [0, 'fequal', 'state', TypeStateOrder.REGISTERED],
                      [
                        0,
                        'multi_filter_in',
                        [
                          { key_db: 'origin', value: Type_pos_payment_origin.DOCUMENT },
                          { key_db: 'origin', value: Type_pos_payment_origin.PAY_DEBT },
                        ],
                      ],
                    ])

                    downloadCustomerAccountsReportPDF({
                      data: {
                        customer: {
                          name: formData.partner_name,
                          document: 'DNI 45879632',
                          date: `${formData.date_start.toLocaleString().split(',')[0]} A ${formData.date_end.toLocaleString().split(',')[0]}`,
                        },
                        records: transformOrdersWithPayments(oj_data, payments),
                      },
                    })
                    /* import(
                      '@/modules/pos-carnes/views/modal-payment-list/components/SalesByClientPDF.tsx'
                    ).then((module) => {
                      const OrdersReportPDF = module.default

                      import('@react-pdf/renderer').then((pdfModule) => {
                        const { pdf } = pdfModule

                        const orders = oj_data

                        import('react').then((React) => {
                          pdf(React.createElement(OrdersReportPDF, { orders }))
                            .toBlob()
                            .then((blob) => {
                              const url = URL.createObjectURL(blob)
                              const link = document.createElement('a')
                              link.href = url
                              link.download = 'detalle-ventas.pdf'
                              link.click()
                              URL.revokeObjectURL(url)
                            })
                        })
                      })
                    })*/
                  },
                },
                {
                  text: 'Descargar Excel',
                  type: 'confirm',
                  onClick: async (id, close, fncExecute) => {
                    if (!fncExecute) return
                    const { oj_data } = await fncExecute('fnc_pos_order ', 's', [
                      [2, 'list_select_all'],
                    ])

                    const wb = generateExcel(oj_data)
                    XLSX.writeFile(wb, `pedido_123.xlsx`)
                  },
                },
              ],
            },
          },
          /*
          {
            title: 'Reporte de la sesión',
            key: 'pagos',
            path: '#',
            openAsModal: true,
            modalConfig: {
              size: 'medium',
              title: 'Reporte de la sesión',
              config: PosReportSessionConfig,
              customButtons: [
                {
                  text: 'Descargar PDF',
                  type: 'confirm',
                  onClick: () => {
                    import('@/modules/invoicing/components/SessionReportPDF').then((module) => {
                      const SessionReportPDF = module.default

                      import('@react-pdf/renderer').then((pdfModule) => {
                        const { pdf } = pdfModule
                        pdf(SessionReportPDF())
                          .toBlob()
                          .then((blob) => {
                            const url = URL.createObjectURL(blob)
                            const link = document.createElement('a')
                            link.href = url
                            link.download = 'reporte-sesion.pdf'
                            link.click()
                            URL.revokeObjectURL(url)
                          })
                      })
                    })
                  },
                },
              ],
            },
          },
          */
        ],
      },
      {
        title: 'Configuración',
        key: 'configuracion-menu',
        items: [
          { title: 'Ajustes', key: 'ajustes', path: '/settings#points-of-sale' },
          { title: 'Métodos de pago', key: 'metodos-pago', path: '/action/406' },
          {
            title: 'Monedas/billetes',
            key: 'monedas-billetes',
            path: '/action/407',
          },
          { title: 'Punto de venta', key: 'punto-venta', path: '/action/409' },
          { title: 'Modelos de nota', key: 'modelos-nota', path: '/configuracion/modelos-nota' },
          { title: 'Dispositivos', key: 'weighing-scale', path: '/action/408' },
          /*
          {
            title: 'Pricer',
            key: 'pricer-submenu',
            items: [
              {
                title: 'Tiendas Pricer',
                key: 'tiendas-pricer',
                path: '/configuracion/pricer/tiendas',
              },
              {
                title: 'Etiquetas de Pricer',
                key: 'etiquetas-pricer',
                path: '/configuracion/pricer/etiquetas',
              },
            ],
          },
          */
          {
            title: 'Productos',
            key: 'productos-submenu',
            items: [
              {
                title: 'Categorías de producto de PdV',
                key: 'categories-pos-inventory',
                path: '/action/410',
              },
              { title: 'Atributos', key: 'atributos', path: '/action/411' },
              { title: 'Contenedor', key: 'Contenedor', path: '/action/412' },
              /*  {
                title: 'Etiquetas de producto',
                key: 'etiquetas-producto',
                path: '/configuracion/productos/etiquetas',
              }*/
            ],
          },
        ],
      },
    ],
  },
  [ModulesEnum.POS]: null,
}
