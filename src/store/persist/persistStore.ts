import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { UserStoreProps } from '../store.types'
import createUserSlice from './slices/user_slice'
import { createFiltersSlice } from './slices/filters_slice'

const useUserStore = create<UserStoreProps>()(
  devtools(
    persist(
      (set, get) => ({
        ...createUserSlice(set, get),
        ...createFiltersSlice(set),
      }),
      { name: 'session-store' }
    )
  )
)

export default useUserStore
