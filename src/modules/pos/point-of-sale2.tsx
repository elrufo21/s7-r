import '../../pos2.css'
import { CartProvider } from './context/CartContext'
import { SearchProvider } from './context/SearchContext'
import { CalculatorProvider } from './context/CalculatorContext'
import Header from './components/Header'
import { ScreenProvider } from './context/ScreenContext'
import Screens from './components/Screens'

const PointOfSale = () => {
  return (
    <SearchProvider>
      <CartProvider>
        <CalculatorProvider>
          <Header />
          <div className="pos-content">
            <ScreenProvider>
              <Screens />
            </ScreenProvider>
          </div>
        </CalculatorProvider>
      </CartProvider>
    </SearchProvider>
  )
}

export default PointOfSale
