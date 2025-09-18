import { fnc_user_login } from '@/data/auth'
import useAppStore from '@/store/app/appStore'
import { SetState, UserStoreProps, UserSliceState } from '@/store/store.types'

export const createUserSlice = (
  set: SetState<UserSliceState>,
  get: () => UserStoreProps
): UserSliceState => ({
  messageError: '',
  setMessageError: (messageError) => {
    set({ messageError })
  },
  user: null,
  setUserSession: (user) => {
    set({ user })
  },
  userLoginInfo: {
    email: '',
    password: '',
  },
  setUserLoginInfo: (userLoginInfo) => {
    set({ userLoginInfo })
  },
  userData: null,
  userError: null,
  companies: [],
  setCompanies: (companies) => {
    set((state: any) => ({ companies: (state.companies = companies) }))
  },
  userCiaEmp: [],
  comprobateUser: async (email, password) => {
    let userData = await useAppStore
      .getState()
      .executeFnc('fnc_user_login', 's', { email, password })
    console.log('userData', userData)
  },
  setUserData: async () => {
    try {
      let res = await fnc_user_login(get().userLoginInfo.email, get().userLoginInfo.password)

      if (res.success && res.data) {
        set(() => ({ userData: res.data }))
      } else {
        set(() => ({ userError: 'No se pudo obtener el usuario' }))
      }

      // Obtener compañías
      let emps = await useAppStore.getState().executeFnc('fnc_get_user_companies', 's', [])

      if (emps?.oj_data) {
        set(() => ({ userCiaEmp: emps.oj_data }))
      } else {
        set(() => ({ userError: 'No se pudo obtener compañías' }))
      }
    } catch (err) {
      set(() => ({ userError: err }))
    }
  },

  changeEmpPred: (idemp) => {
    set({ userData: { ...get().userData, id_pred: idemp } })
  },
})

export default createUserSlice
