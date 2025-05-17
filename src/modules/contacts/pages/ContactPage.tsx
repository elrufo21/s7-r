import contactIndexConfig from '@/modules/contacts/views/contact-index/config'
import { ContactIndex } from '@/modules/contacts/pages/ContactIndex'
import { ContactShow } from '@/modules/contacts/pages/ContactShow'
import { ContactNew } from '@/modules/contacts/pages/ContactNew'
import { Route, Routes } from 'react-router-dom'
import useAppStore from '@/store/app/appStore'
import { useEffect } from 'react'

const ContactPage = () => {
  const { config: configApp, setConfig } = useAppStore()
  const config = contactIndexConfig
  useEffect(() => {
    setConfig(config)
  }, [config, setConfig])
  if (!Object.keys(configApp).length) return <></>

  return (
    <Routes>
      <Route index element={<ContactIndex />} />
      <Route path=":id/*" element={<ContactShow />} />
      <Route path="/new/*" element={<ContactNew />} />
    </Routes>
  )
}

export default ContactPage
