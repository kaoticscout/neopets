'use client'

import { ColorCard } from './ColorCard'
import { SkeletonCard } from '../ui/Skeleton'
import { usePet } from '../../../hooks/usePets'

interface ColorGridProps {
  petSlug: string
}

export function ColorGrid({ petSlug }: ColorGridProps) {
  const { data, isLoading, error } = usePet(petSlug)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (error || !data?.data) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">Error loading colors. Please try again.</p>
      </div>
    )
  }

  const colors = data.data.colors || []

  if (colors.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600">No colors found for this pet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {colors.map((color: any) => (
        <ColorCard key={color.slug} petSlug={petSlug} color={color} />
      ))}
    </div>
  )
}
