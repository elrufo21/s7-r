import { getDataEmpresa } from '@/data/auth'
import useAppStore from '@/store/app/appStore'
import { SetState, UserStoreProps, UserSliceState } from '@/store/store.types'

export const createUserSlice = (
  set: SetState<UserSliceState>,
  get: () => UserStoreProps
): UserSliceState => ({
  user: null,
  setUserSession: (user) => {
    set({ user })
  },
  userData: null,
  userError: null,
  companies: [],
  setCompanies: (companies) => {
    set((state: any) => ({ companies: (state.companies = companies) }))
  },
  userCiaEmp: [],
  setUserData: async () => {
    try {
      let res = await getDataEmpresa(get().user.id)
      let { data, error } = JSON.parse(res)

      if (data?.[0]) {
        set((state: any) => ({ userData: (state.userData = data[0].oj_data[0]) }))
      } else {
        set((state: any) => ({ userError: (state.userError = error) }))
      }

      let emps = await useAppStore.getState().executeFnc('fnc_get_user_companies', 's', [])
      if (emps) {
        set((state: any) => ({ userCiaEmp: (state.userCiaEmp = emps.oj_data) }))
      } else {
        set((state: any) => ({ userError: (state.userError = error) }))
      }
    } catch (err) {
      set((state: any) => ({ userError: (state.userError = err) }))
    }
  },
  changeEmpPred: (idemp) => {
    set({ userData: { ...get().userData, id_pred: idemp } })
  },
})

export default createUserSlice
