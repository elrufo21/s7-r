import PointsOfSaleConfig from '../views/points-of-sale/config'
import { Route, Routes } from 'react-router-dom'
import useAppStore from '@/store/app/appStore'
import { useEffect } from 'react'
import { PointOfSaleIndex } from './PointsOfSaleIndex'

const PointOfSalePage = () => {
  const { config: configApp, setConfig } = useAppStore()
  const config = PointsOfSaleConfig

  useEffect(() => {
    setConfig(config)
  }, [config, setConfig])
  if (!Object.keys(configApp).length) return <></>

  return (
    <Routes>
      <Route index element={<PointOfSaleIndex />} />
    </Routes>
  )
}

export default PointOfSalePage
