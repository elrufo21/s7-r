import { AppStoreProps, PointsOfSaleSliceState, SetState } from '@/store/store.types'

const createPos = (
  set: SetState<PointsOfSaleSliceState>,
  get: () => AppStoreProps
): PointsOfSaleSliceState => ({
  cart: [],
  setCart: (cart) => set({ cart }),
  orderCart: [],
  setOrderCart: (orderCart) => set({ orderCart }),
  selectedOrder: '',
  selectedItem: null,
  orderData: [],
  finalCustomer: {},
})

export default createPos
