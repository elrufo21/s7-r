import { GridSliceState, SetState } from '@/store/store.types'

const createGridSlice = (set: SetState<GridSliceState>): GridSliceState => ({
  gridError: null,
  itemsPerPage: 80,
  setItemsPerPage: (itemsPerPage) => set({ itemsPerPage: itemsPerPage }),
  rowSelection: {},
  setRowSelection: (fn, selectAll = false, listGrouped = []) => {
    set((state: any) => {
      const totalItems = fn(state.rowSelection)
      if (!selectAll) {
        ;(Object.keys(totalItems) || []).forEach((elem) => {
          totalItems[elem] = listGrouped.includes(Number(elem))
        })
      }
      return { rowSelection: totalItems }
    })
  },
  kanbanCurrentPage: 1,
  setKanbanCurrentPage: (page) => set({ kanbanCurrentPage: page }),
  table: null,
  setTable: (table) => set({ table: table }),
  listCurrentPage: 1,
  setListCurrentPage: (page) => set({ listCurrentPage: page }),
  listGroupBy: [],
  setListGroupBy: (data) => set({ listGroupBy: data }),
  listFilterBy: [],
  setListFilterBy: (data) => set({ listFilterBy: data }),
})

export default createGridSlice
