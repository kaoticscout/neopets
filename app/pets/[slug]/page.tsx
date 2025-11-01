'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePet } from '../../../hooks/usePets'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { useParams } from 'next/navigation'
import { cn } from '../../../lib/utils'
import type { ColorData } from '../../../lib/data'

export default function PetDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { data, isLoading, error } = usePet(slug)
  const [selectedColor, setSelectedColor] = useState<ColorData | null>(null)
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('female')

  // Set default color when pet data loads
  useEffect(() => {
    if (data?.data?.colors && data.data.colors.length > 0 && !selectedColor) {
      // Prefer 'blue' if available, otherwise first color
      const defaultColor =
        data.data.colors.find((c: ColorData) => c.slug === 'blue') || data.data.colors[0]
      setSelectedColor(defaultColor)
    }
  }, [data, selectedColor])

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
          <div className="relative mb-4 aspect-square overflow-hidden rounded-big border-4 border-white bg-gradient-to-br from-neopets-lightBlue via-neopets-lightPink to-neopets-lightYellow shadow-neopets-lg">
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
          {selectedColor && (
            <div className="text-center">
              <Badge variant="success" className="px-4 py-2 text-base">
                🎨 {selectedColor.name}
              </Badge>
            </div>
          )}
        </div>

        <div>
          <h1 className="text-neopets-gradient mb-4 text-5xl font-extrabold">{pet.name}</h1>
          <div className="mb-6 flex items-center gap-4">
            <Badge variant="primary" className="px-6 py-3 text-lg">
              ✨ {pet.totalColors} Colors Available ✨
            </Badge>
          </div>
          <p className="mb-6 font-semibold text-gray-700">
            Explore all available color combinations for {pet.name}, from classic colors to rare
            paint brush and lab ray variants. Select a color below to see it!
          </p>

          {/* Quick Color Selector */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-bold text-gray-800">Quick Color Select:</h3>
            <div className="flex max-h-64 flex-wrap gap-2 overflow-y-auto rounded-bubble bg-white/50 p-2">
              {pet.colors.map((color: ColorData) => (
                <button
                  key={color.slug}
                  onClick={() => {
                    setSelectedColor(color)
                    // Scroll to top to see the main image
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-bold transition-all duration-200',
                    selectedColor?.slug === color.slug
                      ? 'scale-110 bg-gradient-to-r from-neopets-blue to-neopets-lightBlue text-white shadow-neopets'
                      : 'border-[2px] border-neopets-blue bg-white text-neopets-blue hover:scale-105'
                  )}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          <Link href="/pets">
            <Button variant="outline">← Back to All Pets</Button>
          </Link>
        </div>
      </div>

      {/* Colors Section */}
      <div>
        <h2 className="text-neopets-gradient mb-6 text-center text-3xl font-extrabold">
          🎨 All Colors 🎨
        </h2>
        <p className="mb-4 text-center font-semibold text-gray-700">
          Click any color card below to view it in the display above!
        </p>
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          onClick={(e) => {
            // Handle clicks on color cards to update selection
            const target = (e.target as HTMLElement).closest('[data-color-slug]')
            if (target) {
              const colorSlug = target.getAttribute('data-color-slug')
              if (colorSlug) {
                const color = pet.colors.find((c: ColorData) => c.slug === colorSlug)
                if (color) {
                  setSelectedColor(color)
                  // Scroll to top to see the main image
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }
            }
          }}
        >
          {pet.colors.map((color: ColorData) => {
            const isSelected = selectedColor?.slug === color.slug
            const imagePath =
              selectedGender === 'female' ? color.imagePathFemale : color.imagePathMale

            return (
              <div
                key={color.slug}
                data-color-slug={color.slug}
                className={cn(
                  'bubble cursor-pointer overflow-hidden rounded-big transition-all duration-300',
                  isSelected
                    ? 'scale-105 shadow-neopets-lg ring-4 ring-neopets-yellow'
                    : 'hover:scale-105'
                )}
              >
                <div className="relative aspect-square w-full bg-gradient-to-br from-neopets-lightBlue via-neopets-lightPink to-neopets-lightYellow">
                  <Image
                    src={imagePath}
                    alt={`${pet.name} ${color.name} (${selectedGender})`}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="bg-gradient-to-br from-white to-gray-50 p-3">
                  <h3
                    className={cn(
                      'mb-2 text-center text-lg font-extrabold',
                      isSelected ? 'text-neopets-blue' : 'text-gray-900'
                    )}
                  >
                    {color.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1">
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
                      ♀
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
                      ♂
                    </button>
                    {color.ucExist && (
                      <Badge variant="warning" className="ml-1 text-xs">
                        UC
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
