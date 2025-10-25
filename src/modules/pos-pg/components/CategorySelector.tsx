import { listTagColors } from '@/shared/constants'
import useAppStore from '@/store/app/appStore'
import { useState } from 'react'
import { AiTwotoneHome } from 'react-icons/ai'

export default function CategorySelector() {
  const { categoriesPg, selectedCategoryPg, setSelectedCategoryPg } = useAppStore()
  const [currentPath, setCurrentPath] = useState<number[]>([])
  const getVisibleCategories = () => {
    const visible: any[] = []
    let current = categoriesPg

    visible.push({ isHome: true })

    for (const id of currentPath) {
      const parent = current.find((cat) => cat.category_id === id)
      if (parent) {
        visible.push({ ...parent, isBack: true })
        if (parent.children) current = parent.children
      } else {
        break
      }
    }

    visible.push(...current)
    return visible
  }

  const handleCategoryClick = (category: any) => {
    if (category.isBack) {
      setCurrentPath(currentPath.slice(0, -1))
      setSelectedCategoryPg(category.category_id)
    } else if (category.isHome) {
      setCurrentPath([])
      setSelectedCategoryPg('')
    } else {
      setSelectedCategoryPg(category.category_id)
      if (category.children && category.children.length > 0) {
        setCurrentPath([...currentPath, category.category_id])
      }
    }
  }

  return (
    <div>
      <div className="category-list d-flex flex-wrap gap-2">
        {getVisibleCategories().map((category: any, index: number) => {
          const isSelected = selectedCategoryPg === category.category_id
          const baseClass =
            'category-button p-1 btn d-flex justify-content-center align-items-center rounded-3'

          if (category.isHome) {
            return (
              <button
                key="home"
                className={`${baseClass} btn-outline-primary`}
                onClick={() => handleCategoryClick(category)}
              >
                <AiTwotoneHome
                  style={{ fontSize: '30px' }}
                  className="text-gray-500 hover:text-gray-700"
                />
              </button>
            )
          }

          if (category.isBack) {
            return (
              <button
                key={`back-${index}`}
                className={`${baseClass} btn-secondary`}
                onClick={() => handleCategoryClick(category)}
              >
                {category.name}
              </button>
            )
          }

          return (
            <button
              key={category.category_id}
              className={`${baseClass} btn-light ${isSelected ? 'border border-primary' : ''} `}
              style={{
                backgroundColor: category.color && `${listTagColors[category.color]}`,
              }}
              onClick={() => handleCategoryClick(category)}
            >
              <img
                className="category-img-thumb h-100 rounded-3 object-fit-cover max-w-[60px] max-h-[40px]"
                alt=""
                src={category.files ? category?.files[0]?.publicUrl : ''}
              />
              <span className="px-2 text-center text-wrap-categ fs-5">{category.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
