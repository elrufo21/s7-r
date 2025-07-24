import ProductCard from './ProductCard'
import useAppStore from '@/store/app/appStore'

function hasCategoryRecursive(categories: any[], selectedId: number): boolean {
  for (const cat of categories) {
    if (!cat) continue
    if (cat.category_id === selectedId) return true

    let parent = cat.parent
    while (parent) {
      if (Array.isArray(parent)) {
        parent = parent[0]
      }

      if (parent?.category_id == selectedId) return true
      parent = parent?.parent
    }
  }

  return false
}

export default function ProductGrid() {
  const { products, searchTerm, selectedCategory } = useAppStore()

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      !selectedCategory || hasCategoryRecursive(product.categories, Number(selectedCategory))

    return matchesSearch && matchesCategory
  })

  if (filteredProducts.length === 0) {
    return (
      <div className="flex items-center justify-center text-center h-full">
        <p>
          No se encontraron productos para <b>{searchTerm}</b> en esta categoría
        </p>
      </div>
    )
  }

  return (
    <div className="pos-product-list">
      {filteredProducts.map((product) => (
        <ProductCard key={product.product_template_id} product={product} />
      ))}
    </div>
  )
}
