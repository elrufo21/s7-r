import { useEffect, useState } from 'react'
import { offlineCache } from '@/lib/offlineCache'
import { Product } from '../types'
import useAppStore from '@/store/app/appStore'
import { Operation } from '../context/CalculatorContext'
import CalculatorPanel from './modal/components/ModalCalculatorPanel'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    selectedOrderPg,
    getProductQuantityInProductsPg,
    openDialog,
    closeDialogWithData,
    changePricePg,
    setPrevWeight,
    setTemporaryProductPg,
    setTemporaryProductByPositionPg,
    orderDataPg,
    temporaryListPg,
  } = useAppStore()
  /*
  const quantity =
    PC_multipleSimilarProducts || isWeightMode
      ? 0
      : getProductQuantityInOrder(selectedOrder, product.product_id || '')
*/
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  useEffect(() => {
    let url: string | null = null
    let isMounted = true

    async function loadImage() {
      const blob = await offlineCache.getProductImage(Number(product.product_id) || 0)
      if (blob && isMounted) {
        url = URL.createObjectURL(blob)
        setImageUrl(url)
      } else if (isMounted) {
        setImageUrl(product?.files?.[0]?.publicUrl || null)
      }
    }

    loadImage()

    return () => {
      isMounted = false
      if (url) URL.revokeObjectURL(url)
    }
  }, [product.product_id, product?.files])

  const openCalculatorModal = ({ operation }: { operation: Operation }) => {
    const dialogId = openDialog({
      title: product.name,
      dialogContent: () => (
        <CalculatorPanel product={product} selectedField={operation} dialogId={dialogId} />
      ),
      buttons: [
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => {
            closeDialogWithData(dialogId, {})
          },
        },
      ],
    })
  }
  const order = orderDataPg.find((o) => o.order_id === selectedOrderPg)
  return (
    <article
      className={`card_article 
        ${temporaryListPg.find((t) => t.product_id === product.product_id) && 'border-1 .border-red-600 .shadow-[0_0_18px_rgba(250,21,21)]  rounded-md'}`}
      onClick={async () => {
        if (changePricePg) {
          openCalculatorModal({ operation: Operation.CHANGE_PRICE })
          return
        }
        if (product.product_id) {
          setTemporaryProductPg(product, 0)
          setTemporaryProductByPositionPg(order.position_pg, order.payment_state, product)
          //     addProductToOrderPg(selectedOrderPg, product as any, prevWeight)
          setPrevWeight(0)
        }
      }}
    >
      {/* #714b67 */}
      {/* <div className="absolute top-1 right-[85px] z-10"> */}
      <div className="absolute top-1 left-1 z-1">
        {/* <div className="product-price  bg-green-600 text-white rounded-full px-1.5 py-0.5 text-[12px] whitespace-nowrap font-bold"> */}
        <div className="product-price bg-[#714b67] text-white rounded-full px-1.5 py-0.5 text-[12px] whitespace-nowrap font-bold">
          {`S/. ${product.sale_price || product.price || 0}`}
        </div>
      </div>
      {imageUrl && (
        <div className="product-img">
          <img src={imageUrl} alt={product.name} />
        </div>
      )}

      <div className="product-content mt-4">
        <div className={`pos-product-name uppercase  ${imageUrl ? '' : 'no-image'}`}>
          {product.name}
        </div>
      </div>

      <div className="product-category-color"></div>
      <div className="product-cart-qty">
        {getProductQuantityInProductsPg(product.product_id || '', selectedOrderPg) === 0
          ? ''
          : getProductQuantityInProductsPg(product.product_id || '', selectedOrderPg)}
      </div>
    </article>
  )
}
