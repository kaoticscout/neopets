'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import type { PetData } from '../../../lib/data'

interface PetCardProps {
  pet: PetData
}

// Determine rarity based on color count
function getRarityLabel(colorCount: number): string {
  if (colorCount >= 200) return 'Ultra Rare'
  if (colorCount >= 150) return 'Rare'
  if (colorCount >= 100) return 'Uncommon'
  return 'Common'
}

function getRarityColor(colorCount: number): string {
  if (colorCount >= 200) return 'bg-purple-500'
  if (colorCount >= 150) return 'bg-blue-500'
  if (colorCount >= 100) return 'bg-green-500'
  return 'bg-gray-500'
}

export function PetCard({ pet }: PetCardProps) {
  const rarityLabel = getRarityLabel(pet.totalColors)
  const rarityColor = getRarityColor(pet.totalColors)

  return (
    <Link href={`/pets/${pet.slug}`} className="block overflow-visible">
      <Card className="comic-card group relative h-full cursor-pointer transition-transform duration-300 hover:-rotate-1 hover:scale-105">
        {/* Rarity Sticker - positioned outside card bounds */}
        <div className="absolute -right-3 -top-3 z-20">
          <span className={`rarity-sticker ${rarityColor} font-comic text-xs text-white shadow-lg`}>
            {rarityLabel}
          </span>
        </div>

        {/* Comic Book Cover Frame - this section can have overflow-hidden */}
        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 p-3">
          <div className="relative h-full w-full rounded-sm border-2 border-gray-300 bg-white">
            <Image
              src={pet.defaultColorPath}
              alt={pet.name}
              fill
              className="object-contain p-1"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          {/* Comic book shine effect */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/20" />
        </div>

        <CardContent className="border-t-2 border-gray-200 bg-white">
          <h3 className="mb-2 text-center font-comic text-xl font-extrabold text-gray-900">
            {pet.name}
          </h3>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="primary" className="px-3 py-1 text-sm">
              {pet.totalColors} Variants
            </Badge>
          </div>
          <div className="mt-2 text-center">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
              Collector&apos;s Edition
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
