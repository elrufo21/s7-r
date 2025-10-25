import { useEffect, useState } from 'react'
import { offlineCache } from '@/lib/offlineCache'
import { Product } from '../types'
import useAppStore from '@/store/app/appStore'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    addProductToOrderPg,
    //getProductQuantityInOrder,
    selectedOrderPg,
    //PC_multipleSimilarProducts,
    // isWeightMode,
    getProductQuantityInProductsPg,
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

  return (
    <article
      className="card_article"
      onClick={async () => {
        if (product.product_id) {
          addProductToOrderPg(selectedOrderPg, product as any, 1)
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
        <div className={`pos-product-name  ${imageUrl ? '' : 'no-image'}`}>{product.name}</div>
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
