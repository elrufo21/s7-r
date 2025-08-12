import { useEffect, useState } from 'react'
import { offlineCache } from '@/lib/offlineCache'
import type { Product } from '../types'
import useAppStore from '@/store/app/appStore'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addProductToOrder, getProductQuantityInOrder, selectedOrder } = useAppStore()
  const quantity = getProductQuantityInOrder(selectedOrder, product.product_id)

  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    let url: string | null = null
    let isMounted = true

    async function loadImage() {
      // Intenta obtener la imagen offline
      const blob = await offlineCache.getProductImage(product.product_id)
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
        addProductToOrder(selectedOrder, product, 1)
      }}
    >
      {imageUrl && (
        <div className="product-img">
          <img src={imageUrl} alt={product.name} />
        </div>
      )}

      <div className="product-content">
        <div className={`pos-product-name  ${imageUrl ? '' : 'no-image'}`}>{product.name}</div>
      </div>

      <div className="product-category-color"></div>
      {quantity !== 0 && <div className="product-cart-qty">{quantity}</div>}
    </article>
  )
}
