import { FiltersSliceState, SetState } from '@/store/store.types'

export const createFiltersSlice = (set: SetState<FiltersSliceState>): FiltersSliceState => ({
  filters: [],
  setFilters: (filters, actualCurrentPage) => {
    const filtersClear = filters.map((item) => (typeof item[0] === 'number' ? item.slice(1) : item))
    const addPagination = filtersClear.some((elem) => elem[0] === 'gby' || elem[0] === 'pag')
      ? filters
      : [...filters, ['pag', actualCurrentPage]]

    const clearOBy = addPagination.reduce((acc, item) => {
      if (item[0] === 'oby') {
        acc = acc.filter((i: any) => i[0] !== 'oby')
        acc.push(item)
      } else {
        acc.push(item)
      }
      return acc
    }, [])

    const newFilters = clearOBy.map((filter: any, index: number) =>
      typeof filter[0] === 'number' ? filter : [index + 1, ...filter]
    )
    set({ filters: newFilters })
  },
})
