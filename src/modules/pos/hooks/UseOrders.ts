import { useQuery } from '@tanstack/react-query'
import useAppStore from '@/store/app/appStore'

export const useOrders = (pointId?: string) => {
  const { executeFnc } = useAppStore()

  return useQuery({
    queryKey: ['pos', pointId],
    queryFn: async () => {
      if (!pointId) return []
      const res = await executeFnc('fnc_pos_order', 's_pos', [[0, 'fequal', 'point_id', pointId]])
      return res?.oj_data ?? []
    },
    enabled: !!pointId,
  })
}
