import PointsOfSaleConfig from '../views/pos/config'
import { Route, Routes } from 'react-router-dom'
import useAppStore from '@/store/app/appStore'
import { useEffect } from 'react'
import PointOfSale from '../point-of-sale2'

const PointOfSaleMeatPage = () => {
  const { config: configApp, setConfig } = useAppStore()
  const config = PointsOfSaleConfig
  useEffect(() => {
    setConfig(config)
  }, [config, setConfig])
  /*
  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const { oj_data } = await executeFnc('fnc_pos_order', 's_pos', [
        [0, 'fequal', 'point_id', pointId],
      ])
      setOrderCart(oj_data || [])
    } catch (err) {
      console.error('Error al obtener facturas:', err)
      setOrderCart([])
    }
  }
*/
  if (!Object.keys(configApp).length) return <></>

  return (
    <Routes>
      <Route index element={<PointOfSale />} />
      <Route path=":pointId" element={<PointOfSale />} />
    </Routes>
  )
}

export default PointOfSaleMeatPage
