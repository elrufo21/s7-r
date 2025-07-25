import PointsOfSaleConfig from '../views/points-of-sale/config'
import { Route, Routes } from 'react-router-dom'
import useAppStore from '@/store/app/appStore'
import { useEffect } from 'react'
import { PointOfSaleIndex } from './PointsOfSaleIndex'

const PointOfSalePage = () => {
  const { config: configApp, setConfig } = useAppStore()
  const config = PointsOfSaleConfig

  useEffect(() => {
    if (!configApp || configApp.module !== config.module) {
      setConfig(config)
    }
  }, [])

  if (!configApp || !Object.keys(configApp).length) {
    return <div className="flex items-center justify-center h-64">Cargando...</div>
  }

  return (
    <Routes>
      <Route index element={<PointOfSaleIndex />} />
    </Routes>
  )
}

export default PointOfSalePage
