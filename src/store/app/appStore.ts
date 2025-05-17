import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import createAppSlice from './slices/app_slice'
import createGridSlice from './slices/grid_slice'
import createDataSlice from './slices/data_slice'
import createFrmSlice from './slices/frm_slice'
import createFrmDialogSlice from './slices/dialog_slice'
import CreatePosSlice from './slices/pos_slice'
import { AppStoreProps } from '../store.types'

export const useAppStore = create<AppStoreProps>()(
  devtools(
    (set, get) => {
      return {
        ...createAppSlice(set, get),
        ...createGridSlice(set),
        ...createDataSlice(set, get),
        ...CreatePosSlice(set, get),
        ...createFrmSlice(set, get),
        ...createFrmDialogSlice(set),
      }
    },
    { name: 'app-store' }
  )
)

export default useAppStore
