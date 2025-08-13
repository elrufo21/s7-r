import { useEffect, useState } from 'react'
import { offlineCache } from '@/lib/offlineCache'
import type { Product } from '../types'
import useAppStore from '@/store/app/appStore'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addProductToOrder, getProductQuantityInOrder, selectedOrder } = useAppStore()
  const quantity = getProductQuantityInOrder(selectedOrder, product.product_id || '')

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
      onClick={() => {
        if (product.product_id) {
          addProductToOrder(selectedOrder, product as any, 1)
        }
      }}
    >
      <div className="absolute top-1 right-[85px]  z-10 ">
        <div className="product-price  bg-green-500 text-white rounded-full px-1.5 py-0.5 text-[12px] whitespace-nowrap">
          {`S/. ${product.price_unit || product.price || 0}`}
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
      {quantity !== 0 && <div className="product-cart-qty">{quantity}</div>}
    </article>
  )
}
