import useAppStore from '@/store/app/appStore'
import { useSearch } from '../context/SearchContext'

export default function CategorySelector() {
  const { selectedCategory, setSelectedCategory } = useSearch()
  const { categories } = useAppStore()

  return (
    <div className="category-list">
      {categories.map((category) => (
        <button
          key={category.category_id}
          className={`category-button p-1 btn btn-light d-flex justify-content-center align-items-center rounded-3 ${
            selectedCategory === category.category_id
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() =>
            setSelectedCategory(
              selectedCategory === category.category_id ? '' : category.category_id
            )
          }
        >
          <img
            className="category-img-thumb h-100 rounded-3 object-fit-cover"
            alt=""
            src={'/images/UpperBody.png'}
          />
          <span className="px-2 text-center text-wrap-categ fs-5">{category.name}</span>
        </button>
      ))}
    </div>

    // <div className="category-list">
    //   {data.map((category) => (
    //     <button
    //       key={category.category_id}
    //       className={`flex flex-col items-center p-1 rounded-md min-w-[100px] flex-shrink-0 ${
    //         selectedCategory === category.category_id
    //           ? 'bg-blue-100 text-blue-800'
    //           : 'bg-gray-100 hover:bg-gray-200'
    //       }`}
    //       onClick={() =>
    //         setSelectedCategory(
    //           selectedCategory === category.category_id ? '' : category.category_id
    //         )
    //       }
    //     >
    //       <img src={'/images/UpperBody.png'} alt="" className="w-12 h-12" />
    //       <span>{category.name}</span>
    //     </button>
    //   ))}
    // </div>
  )
}
