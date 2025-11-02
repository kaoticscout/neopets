'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import type { ColorData } from '../../../lib/data'
import {
  getColorRarity,
  getRarityLabel,
  getRarityBadgeColor,
  getRarityBorderColor,
} from '../../../lib/rarity'

interface ColorCardProps {
  petSlug: string
  color: ColorData
}

export function ColorCard({ petSlug, color }: ColorCardProps) {
  const [gender, setGender] = useState<'male' | 'female'>('female')
  const imagePath = gender === 'female' ? color.imagePathFemale : color.imagePathMale
  const rarityTier = getColorRarity(color.name)
  const rarityLabel = getRarityLabel(rarityTier)
  const rarityColorClass = getRarityBadgeColor(rarityTier)
  const rarityBorderClass = getRarityBorderColor(rarityTier)

  return (
    <Link href={`/pets/${petSlug}/colors/${color.slug}`}>
      <Card className={`relative h-full cursor-pointer border-2 ${rarityBorderClass}`}>
        {/* Rarity Badge - positioned outside card */}
        <div className="absolute -right-2 -top-2 z-20">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold ${rarityColorClass} shadow-lg`}
          >
            {rarityLabel}
          </span>
        </div>
        <div className="relative aspect-square w-full bg-gray-50">
          <Image
            src={imagePath}
            alt={`${color.name} (${gender})`}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardContent>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{color.name}</h3>
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setGender('female')
                }}
                className={`rounded px-2 py-1 text-xs ${
                  gender === 'female' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                ♀
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setGender('male')
                }}
                className={`rounded px-2 py-1 text-xs ${
                  gender === 'male' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                ♂
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {color.ucExist && (
              <Badge variant="warning" className="text-xs">
                UC Available
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
