import { useSearch } from '../context/SearchContext'
import CartPanel from './CartPanel'
import CategorySelector from './CategorySelector'
import ProductGrid from './ProductGrid'
import { OrderList } from './OrderList'
import { useCart } from '../context/CartContext'
import CartItem from './CartItem'
import { useEffect, useState } from 'react'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import Payment from './Payment'
import Invoice from './Invoice'

const Screens = () => {
  const [total, setTotal] = useState(0)
  const { screen } = useSearch()
  const { cart, getTaxAmount, getTotalPrice } = useCart()
  useEffect(() => {
    setTotal(getTotalPrice().toFixed(2))
  }, [cart])

  switch (screen) {
    case 'product':
      return (
        <div className="product-screen">
          <div className="leftpanel">
            <CartPanel />
          </div>

          <div className="rightpanel">
            <div className="rightpanel-sub-1">
              <CategorySelector />
              <ProductGrid />
            </div>
          </div>
        </div>
      )
    case 'ticket':
      return (
        <div className="ticket-screen h-full">
          <div className="screen-full-width d-flex w-100 h-100">
            <div className="rightpane pane-border d-flex flex-column flex-grow-1 w-100 h-100 h-lg-100 pe-lg-0 bg-view border-end overflow-y-auto">
              <OrderList />
            </div>

            <div className="leftpane d-flex flex-column flex-grow-1 gap-2 w-100 h-100 h-lg-100 bg-view h-full">
              <div className="d-flex flex-column flex-grow-1 overflow-hidden">
                <div className="order-container d-flex flex-column flex-grow-1 overflow-y-auto text-start">
                  <div>
                    {cart.map((item) => (
                      <div key={crypto.randomUUID()}>
                        <CartItem item={item} maxDecimals={2} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="order-summary d-flex flex-column gap-1 p-2 border-bottom fw-bolder lh-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Impuestos</span>
                    <span>S/ {getTaxAmount().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-1">
                    <span>Total</span>
                    <span>S/ {total}</span>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2 m-2 mt-0 h-[100px]">
                <button className="back-button btn btn-secondary btn-lg lh-lg">
                  <MdKeyboardArrowLeft style={{ fontSize: '36px' }} />
                </button>
                <button className="button validation load-order-button w-100 btn btn-lg btn-primary py-3">
                  <span className="d-block">Cargar orden</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    case 'payment':
      return <Payment />
    case 'invoice':
      return <Invoice />
    default:
      return <></>
  }
}

export default Screens
