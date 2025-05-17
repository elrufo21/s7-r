import PointsOfSaleConfig from '../views/pos/config'
import { Route, Routes } from 'react-router-dom'
import useAppStore from '@/store/app/appStore'
import { useEffect } from 'react'
import PointOfSale from '../point-of-sale2'

const PointOfSalePage = () => {
  const { config: configApp, setConfig, orderCart, setOrderCart, executeFnc } = useAppStore()
  const config = PointsOfSaleConfig

  useEffect(() => {
    setConfig(config)
  }, [config, setConfig])
  useEffect(() => {
    fetchInvoices()
  }, [])
  const fetchInvoices = async () => {
    try {
      const { oj_data } = await executeFnc('fnc_account_move', 's_pos', [])
      setOrderCart(oj_data || [])
    } catch (err) {
      console.error('Error al obtener facturas:', err)
      setOrderCart([])
    }
  }
  console.log('orderCart ssss', orderCart)
  if (!Object.keys(configApp).length) return <></>

  return (
    <Routes>
      <Route index element={<PointOfSale />} />
    </Routes>
  )
}

export default PointOfSalePage
