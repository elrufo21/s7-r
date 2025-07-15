// mutations/useOrderMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAppStore from '@/store/app/appStore'

export const useOrderMutation = (pointId?: string) => {
  const queryClient = useQueryClient()
  const { executeFnc } = useAppStore()

  return useMutation({
    mutationFn: async (form: any) => {
      return await executeFnc('fnc_pos_order', 'i', form)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos', pointId] })
    },
  })
}
