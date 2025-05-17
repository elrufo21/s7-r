import { createContext, ReactNode, useContext, useState } from 'react'

const ScreenContext = createContext()

export const ScreenProvider = ({ children }: { children: ReactNode }) => {
  const [screen, setScreen] = useState('product')

  return <ScreenContext.Provider value={{ screen, setScreen }}>{children}</ScreenContext.Provider>
}

export const useScreen = () => {
  const context = useContext(ScreenContext)
  if (!context) {
    throw new Error('useScreen must be used within a ScreenProvider')
  }
  return context
}
