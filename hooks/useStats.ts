import { useQuery } from '@tanstack/react-query'

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats')
      if (!res.ok) throw new Error('Failed to fetch stats')
      return res.json()
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
