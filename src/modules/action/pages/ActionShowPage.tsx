import { Route, Routes, useParams } from 'react-router-dom'
import { ActionShow } from '@/modules/action/components/pages/ActionShow'
import { DetailShow } from '@/modules/action/components/pages/DetailShow'
import { DetailNew } from '@/modules/action/components/pages/DetailNew'
import { useEffect } from 'react'
import useAppStore from '@/store/app/appStore'
import { forms } from '@/modules/action/views'

export const ActionShowPage = () => {
  const { idAction } = useParams()
  const { config: configApp, setConfig } = useAppStore()

  const config = forms[`Frm_${idAction}_config`]

  useEffect(() => {
    setConfig(config)
  }, [config, setConfig, idAction])

  if (!Object.keys(configApp).length) return <></>

  return (
    <Routes>
      <Route index element={<ActionShow />} />
      <Route path="detail/:id/*" element={<DetailShow />} />
      <Route path="detail/new/*" element={<DetailNew />} />
    </Routes>
  )
}
