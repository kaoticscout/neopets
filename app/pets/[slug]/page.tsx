'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePet } from '../../../hooks/usePets'
import { useRoster } from '../../../hooks/useRoster'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Card, CardContent } from '../../components/ui/Card'
import { Skeleton } from '../../components/ui/Skeleton'
import { useParams, useSearchParams } from 'next/navigation'
import { cn } from '../../../lib/utils'
import type { ColorData } from '../../../lib/data-client'
import {
  getColorRarity,
  getRarityLabel,
  getRarityBadgeColor,
  getRarityBorderColorValue,
  getRarityGlowColor,
} from '../../../lib/rarity'

export default function PetDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.slug as string
  const { data, isLoading, error } = usePet(slug)
  const { addToRoster, isInRoster, isFull } = useRoster()
  const [selectedColor, setSelectedColor] = useState<ColorData | null>(null)
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('female')
  const [showRosterSuccess, setShowRosterSuccess] = useState(false)

  // Set default color when pet data loads or URL color parameter changes
  useEffect(() => {
    if (data?.data?.colors && data.data.colors.length > 0) {
      // Check if color is specified in URL query params
      const colorSlugFromUrl = searchParams.get('color')
      if (colorSlugFromUrl) {
        const colorFromUrl = data.data.colors.find((c: ColorData) => c.slug === colorSlugFromUrl)
        if (colorFromUrl && selectedColor?.slug !== colorFromUrl.slug) {
          setSelectedColor(colorFromUrl)
          return
        }
      }
      // Only set default if no color is currently selected
      if (!selectedColor) {
        // Prefer 'blue' if available, otherwise first color
        const defaultColor =
          data.data.colors.find((c: ColorData) => c.slug === 'blue') || data.data.colors[0]
        setSelectedColor(defaultColor)
      }
    }
  }, [data, selectedColor, searchParams])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Skeleton className="mb-4 h-10 w-48" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="mb-8 grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !data?.data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Pet Not Found</h1>
          <Link href="/pets">
            <Button>Back to Pets</Button>
          </Link>
        </div>
      </div>
    )
  }

  const pet = data.data

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm">
        <Link href="/pets" className="text-blue-600 hover:underline">
          Pets
        </Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-700">{pet.name}</span>
      </nav>

      {/* Pet Header */}
      <div className="mb-12 grid gap-8 md:grid-cols-2">
        {/* Main Image Display */}
        <div>
          <div className="relative mb-4 aspect-square overflow-hidden rounded-big border-4 border-white bg-gray-50 shadow-neopets-lg">
            {selectedColor ? (
              <Image
                src={
                  selectedGender === 'female'
                    ? selectedColor.imagePathFemale
                    : selectedColor.imagePathMale
                }
                alt={`${pet.name} ${selectedColor.name} (${selectedGender})`}
                fill
                className="object-contain p-4"
                priority
              />
            ) : (
              <Image
                src={pet.defaultColorPath}
                alt={pet.name}
                fill
                className="object-contain p-4"
                priority
              />
            )}
          </div>

          {/* Gender Toggle */}
          <div className="mb-4 flex justify-center gap-3">
            <Button
              variant={selectedGender === 'female' ? 'primary' : 'outline'}
              onClick={() => setSelectedGender('female')}
              className="flex-1"
            >
              ♀ Female
            </Button>
            <Button
              variant={selectedGender === 'male' ? 'primary' : 'outline'}
              onClick={() => setSelectedGender('male')}
              className="flex-1"
            >
              ♂ Male
            </Button>
          </div>

          {/* Current Color Display */}
          {selectedColor && pet && (
            <div className="space-y-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <Badge variant="success" className="px-4 py-2 text-base">
                  {selectedColor.name}
                </Badge>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${getRarityBadgeColor(getColorRarity(selectedColor.name))} shadow-lg`}
                >
                  {getRarityLabel(getColorRarity(selectedColor.name))}
                </span>
              </div>

              {/* Add to Roster Button */}
              {(() => {
                const alreadyInRoster = isInRoster(slug, selectedColor.slug, selectedGender)
                const imagePath =
                  selectedGender === 'female'
                    ? selectedColor.imagePathFemale
                    : selectedColor.imagePathMale

                return (
                  <div>
                    {alreadyInRoster ? (
                      <div className="space-y-2">
                        <Badge variant="warning" className="px-4 py-2 text-base">
                          ✓ Already in Roster
                        </Badge>
                        <Link href="/roster">
                          <Button variant="outline" size="sm" className="w-full">
                            View My Roster
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <Button
                        onClick={() => {
                          const newPet = {
                            petSlug: slug,
                            petName: pet.name,
                            colorSlug: selectedColor.slug,
                            colorName: selectedColor.name,
                            gender: selectedGender,
                            imagePath: imagePath,
                          }

                          // Check if already in roster before adding
                          if (!isInRoster(slug, selectedColor.slug, selectedGender)) {
                            addToRoster(newPet)
                            setShowRosterSuccess(true)
                            setTimeout(() => setShowRosterSuccess(false), 3000)
                          }
                        }}
                        disabled={isFull && !isInRoster(slug, selectedColor.slug, selectedGender)}
                        className="w-full font-comic"
                        size="lg"
                      >
                        {isFull && !isInRoster(slug, selectedColor.slug, selectedGender)
                          ? 'Roster Full (3/3)'
                          : showRosterSuccess
                            ? '✓ Added to Roster!'
                            : '⭐ Add to My Roster'}
                      </Button>
                    )}
                    {showRosterSuccess && (
                      <p className="mt-2 animate-pulse text-sm font-bold text-green-600">
                        Added to roster!
                      </p>
                    )}
                  </div>
                )
              })()}
            </div>
          )}
        </div>

        <div>
          <h1 className="mb-4 font-comic text-5xl font-extrabold text-neopets-blue">{pet.name}</h1>
          <div className="mb-6 flex items-center gap-4">
            <Badge variant="primary" className="px-6 py-3 font-comic text-lg">
              {pet.totalColors} Variants in Collection
            </Badge>
          </div>
          <p className="mb-6 font-semibold text-gray-700">
            Discover every collectible color variant for {pet.name}! From classic editions to
            ultra-rare paint brush exclusives and mysterious lab ray transformations. Each one is a
            gem worth collecting.
          </p>

          {/* Quick Color Selector */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-bold text-gray-800">Quick Color Select:</h3>
            <div className="flex max-h-64 flex-wrap gap-2 overflow-y-auto rounded-bubble bg-white/50 p-2">
              {pet.colors.map((color: ColorData) => {
                const colorRarity = getColorRarity(color.name)
                const rarityBorderColor = getRarityBorderColorValue(colorRarity)
                // Get a simple color for the dot indicator
                const rarityDotColor = {
                  common: 'bg-gray-400',
                  uncommon: 'bg-green-500',
                  rare: 'bg-blue-500',
                  epic: 'bg-purple-600',
                  legendary: 'bg-amber-500',
                }[colorRarity]
                return (
                  <button
                    key={color.slug}
                    onClick={() => {
                      setSelectedColor(color)
                      // Scroll to top to see the main image
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className={cn(
                      'group relative rounded-full border-2 px-3 py-1 text-xs font-bold transition-all duration-200',
                      selectedColor?.slug === color.slug
                        ? 'scale-110 bg-neopets-blue text-white shadow-neopets'
                        : 'bg-white text-neopets-blue hover:scale-105'
                    )}
                    style={{ borderColor: rarityBorderColor } as React.CSSProperties}
                  >
                    {color.name}
                    {/* Rarity indicator dot */}
                    <span
                      className={cn(
                        'absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white shadow-sm',
                        rarityDotColor
                      )}
                    />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/pets">
              <Button variant="outline">← Back to All Pets</Button>
            </Link>
            <Link href="/roster">
              <Button variant="ghost">View My Roster</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Colors Section */}
      <div>
        <h2 className="mb-2 text-center font-comic text-4xl font-extrabold text-neopets-blue">
          Complete Color Collection
        </h2>
        <p className="mb-6 text-center font-semibold text-gray-700">
          Click any color below to view it in your display. Hunt for rare finds!
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {pet.colors.map((color: ColorData) => {
            const isSelected = selectedColor?.slug === color.slug
            const imagePath =
              selectedGender === 'female' ? color.imagePathFemale : color.imagePathMale
            const rarityTier = getColorRarity(color.name)
            const rarityLabel = getRarityLabel(rarityTier)
            const rarityColorClass = getRarityBadgeColor(rarityTier)
            const rarityBorderColor = getRarityBorderColorValue(rarityTier)
            const rarityGlowColor = getRarityGlowColor(rarityTier)

            return (
              <Card
                key={color.slug}
                data-color-slug={color.slug}
                className={cn(
                  'comic-card group relative h-full cursor-pointer transition-transform duration-300',
                  isSelected
                    ? 'scale-105 shadow-neopets-lg ring-4 ring-neopets-yellow'
                    : 'hover:-rotate-1 hover:scale-105'
                )}
                style={
                  {
                    '--rarity-glow-color': rarityGlowColor,
                    '--rarity-border-color': rarityBorderColor,
                  } as React.CSSProperties
                }
                onClick={() => {
                  setSelectedColor(color)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                {/* Rarity Badge - positioned outside card */}
                <div className="absolute -right-3 -top-3 z-20">
                  <span
                    className={`rarity-sticker ${rarityColorClass} rounded-full px-2.5 py-1 font-comic text-xs font-bold shadow-lg`}
                  >
                    {rarityLabel}
                  </span>
                </div>

                {/* Comic Book Cover Frame */}
                <div className="relative aspect-square w-full overflow-hidden rounded-t-[12px] bg-gradient-to-br from-gray-50 via-white to-gray-50 p-3">
                  <div className="relative h-full w-full rounded-sm border-2 border-gray-300 bg-white">
                    <Image
                      src={imagePath}
                      alt={`${pet.name} ${color.name} (${selectedGender})`}
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
                    {color.name}
                  </h3>
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedColor(color)
                        setSelectedGender('female')
                      }}
                      className={cn(
                        'rounded-full px-2 py-1 text-xs font-bold transition-all',
                        selectedColor?.slug === color.slug && selectedGender === 'female'
                          ? 'bg-neopets-pink text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-neopets-lightPink hover:text-white'
                      )}
                    >
                      ♀ Female
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedColor(color)
                        setSelectedGender('male')
                      }}
                      className={cn(
                        'rounded-full px-2 py-1 text-xs font-bold transition-all',
                        selectedColor?.slug === color.slug && selectedGender === 'male'
                          ? 'bg-neopets-blue text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-neopets-lightBlue hover:text-white'
                      )}
                    >
                      ♂ Male
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {color.ucExist && (
                      <Badge variant="warning" className="text-xs">
                        UC Available
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                      Paint Brush
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
