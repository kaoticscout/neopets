import { useQuery } from '@tanstack/react-query'
import { getStats } from '../lib/data-client'

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const stats = await getStats()
      return { data: stats }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
