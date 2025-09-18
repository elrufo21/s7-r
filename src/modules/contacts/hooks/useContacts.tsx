import { ContactData } from '@/shared/components/view-types/viewTypes.types'
import { fncExecute } from '@/data'
import { ActionTypeEnum, FiltersDataType } from '@/shared/shared.types'
import { UseQueryResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const getListContacts = async (filters: FiltersDataType = []) => {
  const res = await fncExecute({
    fnc_name: 'fnc_partner',
    caccion: 's',
    form: filters,
  })
  return res.data[0].oj_data
}

export const useListContacts = (filters: FiltersDataType = []) => {
  return useQuery({
    queryKey: ['contacts-index', JSON.stringify(filters)],
    queryFn: () => getListContacts(filters),
  })
}

const getContactById = async (id: string): Promise<ContactData> => {
  const res = await fncExecute({
    caccion: 's1',
    fnc_name: 'fnc_partner',
    form: [id],
  })
  return res.data[0].oj_data[0]
}

export const useContactById = (id: string): UseQueryResult<ContactData, Error> => {
  return useQuery({
    queryKey: [`contacts-${id}`],
    queryFn: () => getContactById(id),
    staleTime: 0,
  })
}

type actionContactType = {
  action: ActionTypeEnum
  filters: FiltersDataType
}
const accionContact = async ({ action, filters = [] }: actionContactType) => {
  const res = await fncExecute({
    fnc_name: 'fnc_partner',
    caccion: action,
    form: filters,
  })
  return res.data[0].oj_data
}
export const useAccionContact = (id: number, filters: FiltersDataType = []) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accionContact,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['contacts-index', JSON.stringify(filters)] })
      await queryClient.invalidateQueries({ queryKey: [`contact-${id}`] })
    },
  })
}
