'use client'

import { PetCard } from './PetCard'
import { SkeletonCard } from '../ui/Skeleton'
import { usePets } from '../../../hooks/usePets'

interface PetGridProps {
  search?: string
}

export function PetGrid({ search }: PetGridProps) {
  const { data, isLoading, error } = usePets({ search, pageSize: 100 })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">Error loading pets. Please try again.</p>
      </div>
    )
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600">No pets found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data.data.map((pet: any) => (
        <PetCard key={pet.slug} pet={pet} />
      ))}
    </div>
  )
}
