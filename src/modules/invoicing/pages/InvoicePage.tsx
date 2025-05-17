import invoiceIndexConfig from '@/modules/invoicing/views/invoice-index/config'
import useAppStore from '@/store/app/appStore'
import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { InvoiceNew } from '@/modules/invoicing/pages/InvoiceNew'
import { InvoiceShow } from '@/modules/invoicing/pages/InvoiceShow'
import { InvoiceIndex } from '@/modules/invoicing/pages/InvoiceIndex'

const InvoicePage = () => {
  const { setConfig, config: configApp, setDinamicModule } = useAppStore()
  const config = invoiceIndexConfig

  useEffect(() => {
    setDinamicModule(config.module)
    setConfig(config)
    localStorage.setItem('module', config.module)
  }, [config, setConfig])

  if (!Object.keys(configApp).length) return <></>
  return (
    <Routes>
      <Route index element={<InvoiceIndex />} />
      <Route path=":id/*" element={<InvoiceShow />} />
      <Route path="/new/*" element={<InvoiceNew />} />
    </Routes>
  )
}

export default InvoicePage
