import { ModulesEnum } from '@/shared/shared.types'
import { ContactData } from '@/shared/components/view-types/viewTypes.types'
import { fncExecute } from '@/data'
import { ActionTypeEnum, FiltersDataType } from '@/shared/shared.types'
import { UseQueryResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

type ModuleListType = {
  filters: FiltersDataType
  fncName: string
  module: ModulesEnum
  id?: string
}
interface ModuleItemType {
  id: string
  fncName: string
}
interface UseModuleItemType extends ModuleItemType {
  module: ModulesEnum
}

const getModuleFilterList = async ({
  filters,
  fncName,
}: {
  filters: FiltersDataType
  fncName: string
}) => {
  const res = await fncExecute({
    fnc_name: fncName,
    caccion: 's',
    form: filters,
  })
  return res.data[0]
}

export const useModuleFilterList = ({ filters = [], fncName, module, id = '' }: ModuleListType) => {
  return useQuery({
    queryKey: [`${module}-index`, id, JSON.stringify(filters)],
    queryFn: () => getModuleFilterList({ filters, fncName }),
  })
}

const getModuleItemById = async ({ id, fncName }: ModuleItemType): Promise<ContactData> => {
  const res = await fncExecute({
    caccion: 's1',
    fnc_name: fncName,
    form: [id],
  })
  return {
    data: res.data?.[0]?.oj_data?.[0] ?? null,
    stat: res.data?.[0]?.oj_stat ?? null,
  }
}

export const useModuleItemById = ({
  id,
  fncName,
  module,
}: UseModuleItemType): UseQueryResult<ContactData, Error> => {
  return useQuery({
    queryKey: [`${module}-${id}`],
    queryFn: () => getModuleItemById({ id, fncName }),
    staleTime: 0,
  })
}

type actionContactType = {
  fnc_name: string
  action: ActionTypeEnum
  filters: string[]
}
const actionModule = async ({ fnc_name, action, filters = [] }: actionContactType) => {
  const res = await fncExecute({
    fnc_name,
    caccion: action,
    form: filters,
  })
  console.log('Filters', filters)
  return res.data[0].oj_data
}
export const useActionModule = ({
  filters,
  module,
  fncName,
  id,
}: {
  filters: FiltersDataType
  module: ModulesEnum
  fncName: string
  id: string
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: actionModule,
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [`${module}-index`, id, fncName, JSON.stringify(filters)],
      })
      await queryClient.refetchQueries({
        queryKey: [`${module}-index`, '', JSON.stringify(filters)],
      })
    },
  })
}
const getModuleList = async ({
  filters,
  fncName,
}: {
  filters: FiltersDataType
  fncName: string
}) => {
  if (!fncName) return
  const res = await fncExecute({
    fnc_name: fncName,
    caccion: 's',
    form: filters,
  })
  console.log('Filters', JSON.stringify(filters))
  return res.data[0]
}
export const useModuleList = ({ filters = [], fncName, module, id = '' }: ModuleListType) => {
  console.log('Filters', JSON.stringify(filters))
  return useQuery({
    queryKey: [`${module}-index`, id, fncName, JSON.stringify(filters)],
    queryFn: () => getModuleList({ filters, fncName }),
  })
}
