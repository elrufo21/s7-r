import { fncExecute } from '@/data'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const updateStatus = async ({
  filters,
  fncName,
}: {
  filters: Record<string, any>
  fncName: string
}) => {
  const res = await fncExecute({
    fnc_name: fncName,
    caccion: 'us2',
    form: filters,
  })
  return res.data[0]
}
export const useUpdateStatus = ({ filters = [], fncName, module, id = '' }: any) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${module}-index`, id, fncName, JSON.stringify(filters)],
      })
    },
  })
}
