import ProductCard from './ProductCard'
import useAppStore from '@/store/app/appStore'

export default function ProductGrid() {
  const { products } = useAppStore()

  if (products.length <= 0) {
    return (
      <div className="flex items-center justify-center text-center ">
        <p>
          No se encontraron productos para <b>{/*searchTerm*/}</b> en esta categoría
        </p>
      </div>
    )
  }
  return (
    <div className="pos-product-list">
      {products.map((product) => (
        <ProductCard key={product.product_template_id} product={product} />
      ))}
    </div>
  )
}
