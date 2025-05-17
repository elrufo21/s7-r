import { createContext, useState, useContext, type ReactNode, useEffect } from 'react'
import type { Product } from '../types'
import useAppStore from '@/store/app/appStore'

interface SearchContextType {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedNavbarMenu: string
  setSelectedNavbarMenu: (category: string) => void
  filteredProducts: Product[]
  screen: string
  setScreen: (screen: string) => void
}

const SearchContext = createContext<SearchContextType | null>(null)

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [screen, setScreen] = useState('product')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedNavbarMenu, setSelectedNavbarMenu] = useState<string>('')

  const { executeFnc } = useAppStore()

  useEffect(() => {
    setSelectedNavbarMenu('R')
    const fetchProducts = async () => {
      try {
        const { oj_data } = await executeFnc('fnc_product_template', 's', [
          [
            1,
            'fcon',
            ['Disponible en PdV'],
            '2',
            [{ key: '2.1', key_db: 'available_in_pos', value: '1' }],
          ],
          [1, 'pag', 1],
        ])
        setProducts(oj_data)
        setFilteredProducts(oj_data) // Carga inicial
      } catch (err) {
        console.error('Error al obtener productos:', err)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let result = [...products]

    if (selectedCategory) {
      result = result.filter((product) => product.category_id === selectedCategory)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(term) || product.size?.toLowerCase().includes(term)
      )
    }

    setFilteredProducts(result)
  }, [searchTerm, selectedCategory, products])

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        selectedNavbarMenu,
        setSelectedNavbarMenu,
        filteredProducts,
        screen,
        setScreen,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}
