import { useEffect, useState } from 'react'
import { useSearch } from '../context/SearchContext'
import ProductCard from './ProductCard'
import { Product } from '../types'
import { useCart } from '../context/CartContext'

export default function ProductGrid() {
  const [data, setData] = useState<Product[]>([])
  const { filteredProducts, searchTerm } = useSearch()
  useEffect(() => {
    setData(filteredProducts)
  }, [filteredProducts])
  if (filteredProducts.length <= 0) {
    return (
      <div className="flex items-center justify-center text-center ">
        <p>
          No se encontraron productos para <b>{searchTerm}</b> en esta categoría
        </p>
      </div>
    )
  }
  return (
    <div className="pos-product-list">
      {data.map((product) => (
        <ProductCard key={product.product_template_id} product={product} />
      ))}
    </div>
  )
}
