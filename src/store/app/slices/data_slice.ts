import { fncExecute } from '@/data'
import { toast } from 'sonner'
import { AppStoreProps, DataSliceState, SetState } from '@/store/store.types'
import { ItemStatusTypeEnum } from '@/shared/shared.types'
import { OptionsType } from '@/shared/ui/inputs/input.types'

const createDataSlice = (
  set: SetState<DataSliceState>,
  get: () => AppStoreProps
): DataSliceState => ({
  dataError: null,
  attributes: [],
  setAttributes: (attributes) => set({ attributes }),
  values: [],
  setValues: (values) => set({ values }),
  tableData: [],
  setTableData: (tableData) => set({ tableData }),
  location: {
    departamentos: [],
    provincias: [],
    distritos: [],
    paises: [],
  },
  createOptions: async ({ fnc_name, filters = [], action = 's' }) => {
    set({ dataError: null })
    try {
      const { oj_data } = await get().executeFnc(fnc_name, action, filters)
      let res = oj_data

      if (res) {
        for (const f of filters) {
          if (typeof f === 'object' && 'filterBy' in f && 'filterValue' in f) {
            if ('exclude' in f && f.exclude) {
              res = res.filter((item: any) => item[f.filterBy] !== f.filterValue)
            } else {
              res = res.filter((item: any) => item[f.filterBy] === f.filterValue)
            }
          }
        }
        return res as OptionsType[]
      }
      return []
    } catch (e) {
      set({ dataError: e as Error })
      return []
    }
  },
  executeFnc: async (fnc_name: string, action: string, params: any) => {
    const { setFrmLoading } = get()
    setFrmLoading(true)

    try {
      const res = await fncExecute({
        caccion: action,
        fnc_name,
        form:
          action === 's2'
            ? [...params, { column: 'state', value: ItemStatusTypeEnum.ACTIVE }]
            : params,
      })

      const { data, error } = res

      if (error) {
        setFrmLoading(false)
        return set((state: any) => ({ dataError: (state.dataError = error) }))
      }
      setFrmLoading(false)
      return data[0]
    } catch (e) {
      console.log('error', e)
      toast.error('error en la consulta')
    }
  },
})

export default createDataSlice
