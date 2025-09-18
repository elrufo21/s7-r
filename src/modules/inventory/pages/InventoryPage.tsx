import inventoryIndexConfig from '@/modules/inventory/views/inventory-index/config'
import useAppStore from '@/store/app/appStore'
import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { InventoryIndex } from './InventoryIndex'

const InventoryPage = () => {
  const { setConfig, config: configApp, setDinamicModule, setViewType } = useAppStore()
  const config = inventoryIndexConfig
  useEffect(() => {
    setDinamicModule(config.module)
    setConfig(config)
    localStorage.setItem('module', config.module)
    setViewType(config.view_default)
  }, [config, setConfig])

  if (!Object.keys(configApp).length) return <></>
  return (
    <Routes>
      <Route index element={<InventoryIndex />} />
    </Routes>
  )
}

export default InventoryPage
