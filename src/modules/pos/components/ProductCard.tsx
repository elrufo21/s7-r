import type { Product } from '../types'
import useAppStore from '@/store/app/appStore'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addProductToOrder, getProductQuantityInOrder, selectedOrder } = useAppStore()
  const quantity = getProductQuantityInOrder(selectedOrder, product.product_id)

  /* const fnc_open_product_info = async (product: Product) => {
    const dialog = openDialog({
      title: product.name,
      dialogContent: () => (
        <FrmBaseDialog config={ProductInfoConfig} values={product} initialValues={product} />
      ),
    })
    console.log(dialog)
  }
*/
  return (
    <>
      <article
        className="card_article"
        onClick={() => {
          addProductToOrder(selectedOrder, product, 1)
        }}
      >
        {/*
        <div className="product-information-tag">
          <FaInfo
            className="product-information-tag-logo"
            onClick={(e) => {
              e.stopPropagation()
              fnc_open_product_info(product)
            }}
          />
        </div>
        */}

        {product?.files?.[0]?.publicUrl && (
          <div className="product-img">
            <img src={product?.files?.[0]?.publicUrl} alt={product.name} />
          </div>
        )}

        <div className="product-content">
          <div className={`pos-product-name  ${product?.files?.[0]?.publicUrl ? '' : 'no-image'}`}>
            {product.name}
          </div>
        </div>

        <div className="product-category-color"></div>
        {quantity !== 0 && <div className="product-cart-qty">{quantity}</div>}
      </article>
    </>
  )
}
