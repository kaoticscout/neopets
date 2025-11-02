'use client'

import { useRoster } from '../../hooks/useRoster'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card, CardContent } from '../components/ui/Card'
import { getColorRarity, getRarityLabel, getRarityBadgeColor } from '../../lib/rarity'

export default function RosterPage() {
  const { roster, removeFromRoster, clearRoster } = useRoster()

  if (roster.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-6 font-comic text-6xl font-extrabold text-neopets-blue">Top 3</h1>
          <div className="comic-card mx-auto max-w-md border-neopets-blue p-12">
            <p className="mb-4 text-2xl font-bold text-gray-700">Your roster is empty!</p>
            <p className="mb-8 text-gray-600">
              Start building your collection by adding your favorite Neopets to your roster.
            </p>
            <Link href="/pets">
              <Button size="lg" className="px-8 py-4 text-xl font-bold">
                Browse Pets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-comic text-6xl font-extrabold text-neopets-blue">Top 3</h1>
        <p className="mb-2 text-xl font-bold text-gray-700">
          Showcasing your ultimate Neopets collection
        </p>
        <p className="mb-6 text-sm text-gray-500">{roster.length} of 3 slots filled</p>
        {roster.length > 0 && (
          <Button variant="outline" onClick={clearRoster} className="mb-4">
            Clear Roster
          </Button>
        )}
      </div>

      {/* Roster Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {roster.map((pet, index) => (
          <Card
            key={`${pet.petSlug}-${pet.colorSlug}-${pet.gender}`}
            className="comic-card relative"
          >
            {/* Slot Number Badge */}
            <div className="absolute -left-3 -top-3 z-10">
              <span className="rarity-sticker bg-neopets-yellow font-comic text-xs text-gray-800 shadow-[0_0_8px_rgba(255,217,61,0.4)]">
                #{index + 1}
              </span>
            </div>

            {/* Remove Button */}
            <div className="absolute -right-3 -top-3 z-10">
              <button
                onClick={() => removeFromRoster(index)}
                className="rarity-sticker bg-red-500 font-comic text-xs text-white shadow-[0_0_8px_rgba(239,68,68,0.4)] transition-colors hover:bg-red-600"
                title="Remove from roster"
              >
                ✕
              </button>
            </div>

            {/* Pet Image */}
            <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4">
              <div className="relative h-full w-full rounded-sm border-2 border-gray-300 bg-white">
                <Image
                  src={pet.imagePath}
                  alt={`${pet.petName} ${pet.colorName} (${pet.gender})`}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              {/* Comic book shine effect */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/20" />
            </div>

            <CardContent className="border-t-2 border-gray-200 bg-white">
              <h3 className="mb-2 text-center font-comic text-2xl font-extrabold text-gray-900">
                {pet.petName}
              </h3>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" className="px-4 py-2 font-comic text-base">
                    {pet.colorName}
                  </Badge>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${getRarityBadgeColor(getColorRarity(pet.colorName))} shadow-lg`}
                  >
                    {getRarityLabel(getColorRarity(pet.colorName))}
                  </span>
                </div>
                <Badge
                  variant={pet.gender === 'female' ? 'secondary' : 'primary'}
                  className="px-3 py-1 text-sm"
                >
                  {pet.gender === 'female' ? '♀ Female' : '♂ Male'}
                </Badge>
              </div>
              <div className="mt-4 text-center">
                <Link href={`/pets/${pet.petSlug}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty Slot Indicators */}
        {Array.from({ length: 3 - roster.length }).map((_, index) => (
          <Card
            key={`empty-${index}`}
            className="comic-card relative border-4 border-dashed border-gray-300"
          >
            <div className="absolute -left-3 -top-3 z-10">
              <span className="rarity-sticker bg-gray-400 font-comic text-xs text-white shadow-[0_0_8px_rgba(156,163,175,0.4)]">
                #{roster.length + index + 1}
              </span>
            </div>

            <div className="relative flex aspect-square w-full items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="mb-4 text-6xl text-gray-300">+</div>
                <p className="font-bold text-gray-500">Empty Slot</p>
              </div>
            </div>

            <CardContent className="border-t-2 border-gray-200 bg-white py-8 text-center">
              <p className="mb-4 font-semibold text-gray-600">Add a Neopet to fill this slot</p>
              <Link href="/pets">
                <Button variant="outline" size="sm" className="w-full">
                  Browse Pets
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
