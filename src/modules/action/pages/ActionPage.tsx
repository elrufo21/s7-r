import { Route, Routes } from 'react-router-dom'
import { ActionShowPage } from './ActionShowPage'

const ActionPage = () => {
  return (
    <Routes>
      <Route index element={<></>} />
      <Route path=":idAction/*" element={<ActionShowPage />} />
    </Routes>
  )
}

export default ActionPage
