import { useQuery } from '@tanstack/react-query'

interface PetFilters {
  search?: string
  page?: number
  pageSize?: number
}

export function usePets(filters: PetFilters = {}) {
  return useQuery({
    queryKey: ['pets', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.search) params.set('search', filters.search)
      if (filters.page) params.set('page', filters.page.toString())
      if (filters.pageSize) params.set('pageSize', filters.pageSize.toString())

      const res = await fetch(`/api/pets?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch pets')
      return res.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function usePet(slug: string) {
  return useQuery({
    queryKey: ['pet', slug],
    queryFn: async () => {
      const res = await fetch(`/api/pets/${slug}`)
      if (!res.ok) throw new Error('Failed to fetch pet')
      return res.json()
    },
    enabled: !!slug,
  })
}
