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
  const { productsPg, searchProductPg, selectedCategoryPg } = useAppStore()
  const products = productsPg.filter((p) => p.main_in_pos)

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchProductPg.toLowerCase())

    const matchesCategory =
      !selectedCategoryPg || hasCategoryRecursive(product.categories, Number(selectedCategoryPg))

    return matchesSearch && matchesCategory
  })

  // 👉 ORDENAR por position (ascendente o descendente)
  const sortedProducts = [...filteredProducts].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0)
  )

  if (sortedProducts.length === 0) {
    return (
      <div className="flex items-center justify-center text-center ">
        <p>
          No se encontraron productos para <b>{searchProductPg}</b> en esta categoría
        </p>
      </div>
    )
  }

  return (
    <div className="pos-product-list">
      {sortedProducts.map((product) => (
        <ProductCard key={product.product_template_id} product={product} />
      ))}
    </div>
  )
}

