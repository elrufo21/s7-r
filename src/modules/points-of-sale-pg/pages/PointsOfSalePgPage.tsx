import PointsOfSaleConfig from '../views/points-of-sale/config'
import { Route, Routes } from 'react-router-dom'
import useAppStore from '@/store/app/appStore'
import { useEffect } from 'react'
import { PointOfSaleMeatIndex } from './PointsOfSalePgIndex'

const PointOfSaleMeatPage = () => {
  const { config: configApp, setConfig, setDinamicModule } = useAppStore()
  const config = PointsOfSaleConfig

  useEffect(() => {
    /*  if (!configApp || configApp.module !== config.module) {
      setConfig(config)
    }*/
    setDinamicModule(config.module)
    setConfig(config)
    localStorage.setItem('module', config.module)
  }, [config, setConfig])

  if (!configApp || !Object.keys(configApp).length) {
    return <div className="flex items-center justify-center h-64">Cargando...</div>
  }

  return (
    <Routes>
      <Route index element={<PointOfSaleMeatIndex />} />
    </Routes>
  )
}

export default PointOfSaleMeatPage
