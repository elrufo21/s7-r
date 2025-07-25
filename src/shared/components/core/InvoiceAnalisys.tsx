import { BiCaretDown, BiPieChart, BiTrendingUp } from 'react-icons/bi'
import IndexChart from '@/shared/ui/charts/IndexChart'
import { LuBarChart3 } from 'react-icons/lu'
import { BsActivity, BsDatabase } from 'react-icons/bs'
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa'
import { Box, Menu, MenuItem, Typography } from '@mui/material'
import { useState } from 'react'
const InvoiceAnalisys = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedOption, setSelectedOption] = useState<string>()
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')

  const open = Boolean(anchorEl)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const menuItems = [
    { key: 'cantidad', label: 'Cantidad de producto' },
    { key: 'importe', label: 'Importe sin impuestos en moneda' },
    { key: 'margen', label: 'Margen' },
    { key: 'precio', label: 'Precio promedio' },
    { key: 'subtotal', label: 'Subtotal' },
    { key: 'total', label: 'Total' },
    { key: 'totalMoneda', label: 'Total en moneda' },
    { key: 'valorInventario', label: 'Valor del inventario' },
  ]
  const [chartType, setChartType] = useState('bar')
  return (
    <>
      <div className="d-flex d-print-none gap-1 flex-shrink-0 mt-2 mx-3 mb-3 overflow-x-auto">
        <div className="btn-group" role="toolbar" aria-label="Main actions">
          <button
            className="btn btn-primary o-dropdown dropdown-toggle dropdown"
            aria-expanded="false"
            onClick={handleClick}
          >
            Medidas{' '}
            <i className="fa fa-caret-down ms-1">
              <BiCaretDown />
            </i>
          </button>
        </div>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: 260,
              maxHeight: 400,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              border: '1px solid #ddd',
              borderRadius: '4px',
              '& .MuiList-root': {
                padding: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        >
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.key}
              onClick={() => setSelectedOption(item.key)} // Solo uno seleccionado
              sx={{
                py: 1.5,
                px: 2,
                borderBottom: index < menuItems.length - 1 ? '1px solid #f0f0f0' : 'none',
                '&:hover': {
                  backgroundColor: '#f8f8f8',
                },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                  color: '#333',
                  fontWeight: 400,
                  flex: 1,
                }}
              >
                {item.label}
              </Typography>

              {/* Check simple - solo aparece si está seleccionado */}
              {selectedOption === item.key && (
                <Box
                  sx={{
                    color: '#4caf50',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    ml: 1,
                  }}
                >
                  ✓
                </Box>
              )}
            </MenuItem>
          ))}

          {/* Separador */}
          <Box
            sx={{
              borderTop: '1px solid #e0e0e0',
              mt: 0.5,
            }}
          />
        </Menu>
        <div className="inline-flex" role="toolbar" aria-label="Change graph">
          <button
            className={`inline-flex items-center justify-center w-9 h-8 text-sm border border-gray-300 hover:bg-gray-50   ${
              chartType === 'bar'
                ? 'bg-gray-300 text-gray-800 border-gray-400'
                : 'bg-gray-100 text-gray-600'
            }`}
            title="Gráfico de barras"
            onClick={() => setChartType('bar')}
          >
            <LuBarChart3 className="w-4 h-4" />
          </button>

          <button
            className={`inline-flex items-center justify-center w-9 h-8 text-sm border-t border-b border-r border-gray-300 hover:bg-gray-50   ${
              chartType === 'line'
                ? 'bg-gray-300 text-gray-800 border-gray-400'
                : 'bg-gray-100 text-gray-600'
            }`}
            title="Gráfico de línea"
            onClick={() => setChartType('line')}
          >
            <BiTrendingUp className="w-4 h-4" />
          </button>

          <button
            className={`inline-flex items-center justify-center w-9 h-8 text-sm border border-gray-300 hover:bg-gray-50   ${
              chartType === 'pie'
                ? 'bg-gray-300 text-gray-800 border-gray-400'
                : 'bg-gray-100 text-gray-600'
            }`}
            title="Gráfico circular"
            onClick={() => setChartType('pie')}
          >
            <BiPieChart className="w-4 h-4" />
          </button>
        </div>
        <div className="inline-flex" role="toolbar" aria-label="Change graph">
          <button
            className={`inline-flex items-center justify-center w-9 h-8 text-sm border border-gray-300 hover:bg-gray-50   ${
              chartType === 'basssr'
                ? 'bg-gray-300 text-gray-800 border-gray-400'
                : 'bg-gray-100 text-gray-600'
            }`}
            title="Gráfico de barras"
          >
            <BsActivity className="w-4 h-4" />
          </button>
          <button
            className={`inline-flex items-center justify-center w-9 h-8 text-sm border border-gray-300 hover:bg-gray-50   ${
              chartType === 'basssr'
                ? 'bg-gray-300 text-gray-800 border-gray-400'
                : 'bg-gray-100 text-gray-600'
            }`}
            title="Gráfico de barras"
          >
            <BsDatabase className="w-4 h-4" />
          </button>
        </div>
        <div className="inline-flex" role="toolbar" aria-label="Change graph">
          <button
            className={`inline-flex items-center justify-center w-9 h-8 text-sm border border-gray-300 hover:bg-gray-50   ${
              chartType === 'baaar'
                ? 'bg-gray-300 text-gray-800 border-gray-400'
                : 'bg-gray-100 text-gray-600'
            }`}
            title="Gráfico de barras"
            onClick={() => setOrder('desc')}
          >
            <FaSortAmountDown className="w-4 h-4" />
          </button>
          <button
            className={`inline-flex items-center justify-center w-9 h-8 text-sm border border-gray-300 hover:bg-gray-50   ${
              chartType === 'baaar'
                ? 'bg-gray-300 text-gray-800 border-gray-400'
                : 'bg-gray-100 text-gray-600'
            }`}
            title="Gráfico de barras"
            onClick={() => setOrder('asc')}
          >
            <FaSortAmountUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className=" o_graph_canvas_container flex-grow-1 position-relative px-3 pb-3 h-[400px] flex justify-center items-center">
        <IndexChart chartType={chartType} order={order} />
      </div>
    </>
  )
}

export default InvoiceAnalisys
