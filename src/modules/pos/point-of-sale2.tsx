import '../../pos2.css'
import { CartProvider } from './context/CartContext'
import { SearchProvider } from './context/SearchContext'
import { CalculatorProvider } from './context/CalculatorContext'
import Header from './components/Header'
import { ScreenProvider } from './context/ScreenContext'
import Screens from './components/Screens'
import useAppStore from '@/store/app/appStore'
import { useEffect } from 'react'

const PointOfSale = () => {
  const { setOrderData, executeFnc, setProducts, setCategories, setSelectedOrder, setCustomers } =
    useAppStore()

  useEffect(() => {
    const fetchInvoices = async () => {
      const { oj_data } = await executeFnc('fnc_account_move', 's_pos', [])
      setOrderData(oj_data || [])
      setSelectedOrder(oj_data[0]?.move_id)
    }
    const fetchProducts = async () => {
      try {
        const { oj_data } = await executeFnc('fnc_product_template', 's', [
          [
            1,
            'fcon',
            ['Disponible en PdV'],
            '2',
            [{ key: '2.1', key_db: 'available_in_pos', value: '1' }],
          ],
          [1, 'pag', 1],
        ])
        setProducts(oj_data)
      } catch (err) {
        console.error('Error al obtener productos:', err)
      }
    }
    const fetchCategories = async () => {
      const { oj_data } = await executeFnc('fnc_product_category', 's', [[1, 'pag', 1]])
      setCategories(oj_data)
    }
    const fetchCustomers = async () => {
      const { oj_data } = await executeFnc('fnc_partner', 's', [[1, 'pag', 1]])
      setCustomers(oj_data)
    }
    fetchCategories()
    fetchInvoices()
    fetchProducts()
    fetchCustomers()
  }, [])

  return (
    <SearchProvider>
      <CartProvider>
        <CalculatorProvider>
          <Header />
          <div className="pos-content">
            <ScreenProvider>
              <Screens />
            </ScreenProvider>
          </div>
        </CalculatorProvider>
      </CartProvider>
    </SearchProvider>
  )
}

export default PointOfSale
