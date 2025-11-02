import { useQuery } from '@tanstack/react-query'
import { getAllPets, getPetBySlug, searchPets, type PetData } from '../lib/data-client'

interface PetFilters {
  search?: string
  page?: number
  pageSize?: number
}

export function usePets(filters: PetFilters = {}) {
  return useQuery({
    queryKey: ['pets', filters],
    queryFn: async () => {
      let pets: PetData[]

      if (filters.search) {
        pets = await searchPets(filters.search)
      } else {
        pets = await getAllPets()
      }

      // Pagination
      const page = filters.page || 1
      const pageSize = filters.pageSize || 24
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const paginatedPets = pets.slice(start, end)

      return {
        data: paginatedPets,
        meta: {
          total: pets.length,
          page,
          pageSize,
          totalPages: Math.ceil(pets.length / pageSize),
        },
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function usePet(slug: string) {
  return useQuery({
    queryKey: ['pet', slug],
    queryFn: async () => {
      const pet = await getPetBySlug(slug)
      if (!pet) throw new Error('Pet not found')
      return { data: pet }
    },
    enabled: !!slug,
  })
}
