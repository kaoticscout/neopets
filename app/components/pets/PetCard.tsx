'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import type { PetData } from '../../../lib/data'
import {
  getPetRarity,
  getRarityLabel,
  getRarityBadgeColor,
  getRarityBorderColor,
} from '../../../lib/rarity'

interface PetCardProps {
  pet: PetData
}

export function PetCard({ pet }: PetCardProps) {
  const rarityTier = getPetRarity(pet.slug)
  const rarityLabel = getRarityLabel(rarityTier)
  const rarityColorClass = getRarityBadgeColor(rarityTier)
  const rarityBorderClass = getRarityBorderColor(rarityTier)

  return (
    <Link href={`/pets/${pet.slug}`} className="block overflow-visible">
      <Card
        className={`comic-card group relative h-full cursor-pointer border-2 transition-transform duration-300 hover:-rotate-1 hover:scale-105 ${rarityBorderClass}`}
      >
        {/* Rarity Badge - positioned outside card bounds */}
        <div className="absolute -right-3 -top-3 z-20">
          <span
            className={`rarity-sticker ${rarityColorClass} rounded-full px-2.5 py-1 font-comic text-xs font-bold shadow-lg`}
          >
            {rarityLabel}
          </span>
        </div>

        {/* Comic Book Cover Frame - this section can have overflow-hidden */}
        <div className="relative aspect-square w-full overflow-hidden rounded-t-[12px] bg-gradient-to-br from-gray-50 via-white to-gray-50 p-3">
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

        <CardContent className="rounded-b-[12px] border-t-2 border-gray-200 bg-white">
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
