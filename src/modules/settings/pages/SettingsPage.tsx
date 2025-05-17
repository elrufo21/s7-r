import settingsIndexConfig from '@/modules/settings/views/general-settings/config'
import { Route, Routes } from 'react-router-dom'
import useAppStore from '@/store/app/appStore'
import { useEffect } from 'react'
import { SettingsIndex } from './SettingsIndex'
import { ModulesEnum } from '@/shared/shared.types'

const SettingsPage = () => {
  const { config: configApp, setConfig } = useAppStore()
  const config = settingsIndexConfig

  useEffect(() => {
    const module = localStorage.getItem('module') as ModulesEnum
    config.module = module || ModulesEnum.SETTINGS
    setConfig(config)
  }, [config, setConfig])
  if (!Object.keys(configApp).length) return <></>

  return (
    <Routes>
      <Route index element={<SettingsIndex />} />
    </Routes>
  )
}

export default SettingsPage
