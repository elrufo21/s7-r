import { toast } from 'sonner'
import { AppStoreProps, FrmSliceState, SetState } from '@/store/store.types'
import { ActionTypeEnum, FormActionEnum } from '@/shared/shared.types'

const createFrmSlice = (set: SetState<FrmSliceState>, get: () => AppStoreProps): FrmSliceState => ({
  frmError: null,
  frmLoading: false,
  setFrmLoading: (frmloading) => set({ frmLoading: frmloading }),
  frmIsChanged: false,
  setFrmIsChanged: (frmIsChanged) => set({ frmIsChanged: frmIsChanged }),
  frmIsChangedItem: false,
  setFrmIsChangedItem: (frmIsChangedItem) => set({ frmIsChangedItem }),
  formItem: null,
  formsBranches: [],
  setFormsBranches: (formsBranches) => set({ formsBranches }),
  setFormItem: (formItem, formIsChanged = false) => set({ formItem, frmIsChanged: formIsChanged }),
  setFrmItemSelected: async (config, toDialog = false, updateFromSubItems = false, data = {}) => {
    if (updateFromSubItems) {
      const contacts = data?.list_contacts ?? []
      const isThereContacts = contacts.some(
        (contact: any) =>
          typeof contact.partner_id === 'string' ||
          contact.accion === ActionTypeEnum.DELETE ||
          contact.accion === ActionTypeEnum.UPDATE
      )
      return set({ formItem: data, frmIsChangedItem: isThereContacts })
    }

    if (!config) {
      set({ formItem: null })
      return
    }
    const { fnc_name, value } = config
    set({ frmError: null })
    try {
      const res = await get().executeFnc(fnc_name, 's1', [value])
      if (res) {
        if (toDialog) {
          return res
        }
        set({ formItem: res })
      }
    } catch (e) {
      set({ frmError: e as Error })
    }
  },
  frmConfigControls: null,
  setFrmConfigControls: (frmConfigControls) => set({ frmConfigControls: frmConfigControls }),
  frmAction: FormActionEnum.BASE,
  setFrmAction: (frmAction) => set({ frmAction: frmAction }),
  frmCreater: async (fnc_name, data, idfield, callback) => {
    set({ frmError: null })
    try {
      const res = await get().executeFnc(fnc_name, 'i', data)
      console.log(res)
      const { oj_data } = res
      if (oj_data?.[idfield]) {
        await callback(oj_data[idfield])
      } else {
        toast.error('Error al crear registro')
      }
      set({ frmIsChangedItem: true })
    } catch (e) {
      toast.error('Error al crear registro')
      set({ frmError: e as Error })
    }
  },
})
export default createFrmSlice
