import { ViewTypeEnum } from '@/shared/shared.types'
import SaleChart from '@/shared/ui/charts/salesChart'
import useAppStore from '@/store/app/appStore'
import { Box, Divider, Grid, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { useState } from 'react'
import { FaCog, FaEllipsisV, FaStar } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'
const Kanbanchart = () => {
  const { setBreadcrumb } = useAppStore()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const { pathname } = useLocation()

  const handleNewInvoice = () => {
    setBreadcrumb([
      {
        title: 'Tablero',
        url: pathname,
        viewType: ViewTypeEnum.KANBAN,
        diary: { value: 1, title: 'Ventas' },
      },
    ])
    navigate('/invoicing/new')
  }

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuAction = (action: any) => {
    console.log(`Acción seleccionada: ${action}`)
    handleClose()
  }
  return (
    <>
      <div className="oe_kanban_details ">
        <div className="o_kanban_record_top mb-0 ">
          <div className="o_kanban_record_headings">
            <strong className="o_kanban_record_title">
              <span>
                <a href="">Ventas</a>
              </span>
            </strong>
          </div>
        </div>
        <div className="row g-0 pb-4 ms-2 mt-auto">
          <div className="col-6 d-flex flex-wrap align-items-center gap-3">
            <button
              className="btn btn-primary oe_kanban_action"
              onClick={() => {
                handleNewInvoice()
              }}
            >
              Nuevo
            </button>
          </div>
          <div className="col-auto">
            <div className="row">
              <div className="col overflow-hidden text-start">
                <a className="oe_kanban_action" href="#" type="object">
                  <span title="Facturas por validar">2 Por validar</span>
                </a>
              </div>
              <div className="col-auto text-end">
                <span dir="ltr">S/&nbsp;0,00</span>
              </div>
            </div>

            <div className="row">
              <div className="col overflow-hidden text-start">
                <a className="oe_kanban_action" href="#" type="object">
                  <span>4 Sin pagar</span>
                </a>
              </div>
              <div className="col-auto text-end">
                <span dir="ltr">S/&nbsp;3.575,40</span>
              </div>
            </div>

            <div className="row">
              <div className="col overflow-hidden text-start">
                <a className="oe_kanban_action" href="#" type="object">
                  <span title="Facturas atrasadas" id="account_dashboard_invoices_late">
                    2 Atrasado
                  </span>
                </a>
              </div>
              <div className="col-auto text-end">
                <span dir="ltr">S/&nbsp;3.540,00</span>
              </div>
            </div>
          </div>
        </div>
        <SaleChart />
        <div className="o_dropdown_kanban bg-transparent position-absolute end-0 top-0 w-auto">
          <IconButton
            aria-label="more"
            id="dropdown-button"
            aria-haspopup="true"
            onClick={handleClick}
            size="small"
            sx={{
              color: '#6c757d',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <FaEllipsisV />
          </IconButton>

          {/* Material-UI Menu */}
          <Menu
            id="dropdown-menu"
            MenuListProps={{
              'aria-labelledby': 'dropdown-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                minWidth: 400,
                maxWidth: 450,
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {/* Layout de columnas usando Box y Grid */}
            <Box sx={{ p: 2 }}>
              <Grid container spacing={3}>
                {/* Columna Ver */}
                <Grid item xs={4}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 'bold', mb: 1, fontSize: '14px' }}
                  >
                    Ver
                  </Typography>
                  <Box>
                    <MenuItem
                      onClick={() => handleMenuAction('facturas')}
                      sx={{
                        p: 0.5,
                        fontSize: '13px',
                        minHeight: 'auto',
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                      }}
                    >
                      Facturas
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleMenuAction('notas-credito')}
                      sx={{
                        p: 0.5,
                        fontSize: '13px',
                        minHeight: 'auto',
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                      }}
                    >
                      Notas de crédito
                    </MenuItem>
                  </Box>
                </Grid>

                {/* Columna Nuevo */}
                <Grid item xs={4}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 'bold', mb: 1, fontSize: '14px' }}
                  >
                    Nuevo
                  </Typography>
                  <Box>
                    <MenuItem
                      onClick={() => handleMenuAction('nueva-factura')}
                      sx={{
                        p: 0.5,
                        fontSize: '13px',
                        minHeight: 'auto',
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                      }}
                    >
                      Factura
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleMenuAction('nueva-nota-credito')}
                      sx={{
                        p: 0.5,
                        fontSize: '13px',
                        minHeight: 'auto',
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                      }}
                    >
                      Nota de crédito
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleMenuAction('subir-facturas')}
                      sx={{
                        p: 0.5,
                        fontSize: '13px',
                        minHeight: 'auto',
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                      }}
                    >
                      Subir facturas
                    </MenuItem>
                  </Box>
                </Grid>

                {/* Columna Reportes */}
                <Grid item xs={4}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 'bold', mb: 1, fontSize: '14px' }}
                  >
                    Reportes
                  </Typography>
                  <Box>
                    <MenuItem
                      onClick={() => handleMenuAction('cuentas-cobrar')}
                      sx={{
                        p: 0.5,
                        fontSize: '13px',
                        minHeight: 'auto',
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                      }}
                    >
                      Cuentas por cobrar vencidas
                    </MenuItem>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Fila inferior con acciones adicionales */}
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
              <MenuItem
                onClick={() => handleMenuAction('quitar-favoritos')}
                sx={{
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                }}
              >
                <FaStar style={{ marginRight: '8px', fontSize: '12px' }} />
                Quitar de favoritos
              </MenuItem>
              <MenuItem
                onClick={() => handleMenuAction('configuracion')}
                sx={{
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                }}
              >
                <FaCog style={{ marginRight: '8px', fontSize: '12px' }} />
                Configuración
              </MenuItem>
            </Box>
          </Menu>
        </div>
      </div>
    </>
  )
}

export default Kanbanchart
