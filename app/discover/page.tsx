'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePets } from '../../hooks/usePets'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card, CardContent } from '../components/ui/Card'
import { Skeleton } from '../components/ui/Skeleton'
import { cn } from '../../lib/utils'
import type { PetData } from '../../lib/data'
import {
  getPetRarity,
  getRarityLabel,
  getRarityBadgeColor,
  getRarityBorderColorValue,
  getRarityGlowColor,
} from '../../lib/rarity'

function getRandomPets(pets: PetData[], count: number): PetData[] {
  const shuffled = [...pets].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export default function DiscoverFriendsPage() {
  const { data, isLoading, error } = usePets({ pageSize: 1000 })
  const [revealed, setRevealed] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [randomPets, setRandomPets] = useState<PetData[]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [targetPositions, setTargetPositions] = useState<Array<{ left: number; top: number }>>([])

  const handleReveal = () => {
    if (data?.data && data.data.length > 0) {
      const pets = getRandomPets(data.data, 5)
      setRandomPets(pets)
      setRevealed(true)
      setIsAnimating(true)
    }
  }

  // Measure grid positions after layout, then animate cards from center
  useEffect(() => {
    if (revealed && randomPets.length > 0 && isAnimating) {
      // Cards are stacked at center, wait for layout then measure target positions
      const timer = setTimeout(() => {
        if (containerRef.current && cardRefs.current.length === randomPets.length) {
          // Get the card container center (where mystery card is)
          const cardContainer = document.getElementById('card-container')
          if (!cardContainer) return

          const cardContainerRect = cardContainer.getBoundingClientRect()
          const containerCenterX = cardContainerRect.left + cardContainerRect.width / 2
          const containerCenterY = cardContainerRect.top + cardContainerRect.height / 2

          // Measure each grid cell's center position
          // Map positions: top card (index 0, z-index 50) goes to leftmost grid position
          // bottom card (index length-1, z-index 46) goes to rightmost grid position
          const positions = cardRefs.current.map((ref, cardIndex) => {
            // Calculate which grid position this card should go to
            // Card 0 (top z-index) → grid position 0 (leftmost)
            // Card (length-1) (bottom z-index) → grid position (length-1) (rightmost)
            const gridPosition = cardIndex

            // Get the ref for the grid cell at this position
            const gridRef = cardRefs.current[gridPosition]
            if (gridRef) {
              const rect = gridRef.getBoundingClientRect()
              const gridCellCenterX = rect.left + rect.width / 2
              const gridCellCenterY = rect.top + rect.height / 2

              return {
                left: gridCellCenterX - containerCenterX,
                top: gridCellCenterY - containerCenterY,
              }
            }
            return { left: 0, top: 0 }
          })

          setTargetPositions(positions)

          // Animate to target positions after a brief delay
          setTimeout(() => {
            setIsAnimating(false)
          }, 50)
        }
      }, 200) // Wait for grid to layout

      return () => clearTimeout(timer)
    }
  }, [revealed, isAnimating, randomPets])

  const handleReset = () => {
    setRevealed(false)
    setIsAnimating(false)
    setRandomPets([])
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Skeleton className="mb-4 h-10 w-48" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="aspect-square w-full max-w-md" />
        </div>
      </div>
    )
  }

  if (error || !data?.data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Error Loading Pets</h1>
          <p className="mb-4 text-gray-600">Please try again later.</p>
          <Link href="/pets">
            <Button>Back to Pets</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-comic text-6xl font-extrabold text-neopets-blue">
          Find New Friends
        </h1>
        <p className="mb-6 text-xl font-bold text-gray-700">
          Discover random Neopets and make new friends!
        </p>
      </div>

      {/* Container for mystery card and revealed cards */}
      <div
        className="relative flex min-h-[50vh] items-center justify-center"
        id="card-container"
        style={{ position: 'relative' }}
      >
        {/* Mystery Card - fades out when revealed */}
        {!revealed && (
          <Card
            className={cn(
              'comic-card group relative w-full max-w-[22.4rem] cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-neopets-lg',
              'border-4 border-dashed border-purple-400',
              isAnimating && 'pointer-events-none opacity-0'
            )}
            style={
              {
                '--rarity-glow-color': 'rgba(147, 51, 234, 0.8)',
                '--rarity-border-color': 'rgb(147, 51, 234)',
              } as React.CSSProperties
            }
            onClick={handleReveal}
          >
            {/* Random Badge */}
            <div className="absolute -right-3 -top-3 z-20">
              <span className="rarity-sticker rounded-full bg-purple-600 px-2.5 py-1 font-comic text-xs font-bold text-white shadow-lg">
                Random
              </span>
            </div>

            {/* Mystery Image Area */}
            <div className="relative aspect-square w-full overflow-hidden rounded-t-[12px] bg-gradient-to-br from-purple-50 via-white to-purple-50 p-3">
              <div className="relative flex h-full w-full items-center justify-center rounded-sm border-2 border-dashed border-purple-300 bg-white">
                <div className="text-center">
                  <div className="mb-4 animate-pulse text-9xl font-bold text-purple-400">?</div>
                  <p className="font-comic text-xl font-bold text-gray-600">Click to Discover</p>
                </div>
              </div>
              {/* Comic book shine effect */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/20" />
            </div>

            <CardContent className="rounded-b-[12px] border-t-2 border-gray-200 bg-white">
              <h3 className="mb-2 text-center font-comic text-xl font-extrabold text-gray-900">
                Mystery Friend
              </h3>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="primary" className="px-3 py-1 text-sm">
                  Random Draw
                </Badge>
              </div>
              <div className="mt-2 text-center">
                <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                  Tap to Reveal 5 Friends
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Revealed Pets - animates from center to grid positions */}
        {revealed && randomPets.length > 0 && (
          <>
            {/* Button */}
            <div className="absolute -bottom-16 left-0 right-0 flex justify-center">
              <Button onClick={handleReset} variant="outline" size="lg">
                🎲 Draw Again
              </Button>
            </div>

            {/* Cards positioned absolutely relative to card-container */}
            {randomPets.map((pet, index) => {
              const rarityTier = getPetRarity(pet.slug)
              const rarityLabel = getRarityLabel(rarityTier)
              const rarityColorClass = getRarityBadgeColor(rarityTier)
              const rarityBorderColor = getRarityBorderColorValue(rarityTier)
              const rarityGlowColor = getRarityGlowColor(rarityTier)

              const targetPos = targetPositions[index] || { left: 0, top: 0 }

              return (
                <div
                  key={pet.slug}
                  className="absolute transition-all duration-700 ease-out"
                  style={{
                    opacity: revealed ? 1 : 0,
                    width: '22.4rem',
                    maxWidth: '22.4rem',
                    left: '50%',
                    top: '50%',
                    transform: isAnimating
                      ? 'translate(-50%, -50%) scale(1)'
                      : targetPositions.length > 0
                        ? `translate(calc(-50% + ${targetPos.left}px), calc(-50% + ${targetPos.top}px)) scale(0.614)`
                        : 'translate(-50%, -50%) scale(1)',
                    pointerEvents: revealed ? 'auto' : 'none',
                    transitionDelay: isAnimating ? '0ms' : `${index * 100 + 300}ms`,
                    zIndex: isAnimating ? 50 - index : 'auto',
                  }}
                >
                  <Link href={`/pets/${pet.slug}`} className="block overflow-visible">
                    <Card
                      className="comic-card group relative h-full cursor-pointer transition-transform duration-300 hover:-rotate-1 hover:scale-105"
                      style={
                        {
                          '--rarity-glow-color': rarityGlowColor,
                          '--rarity-border-color': rarityBorderColor,
                        } as React.CSSProperties
                      }
                    >
                      {/* Rarity Badge */}
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
                </div>
              )
            })}

            {/* Grid for measuring positions only - hidden but used for measurement */}
            <div
              id="cards-container"
              ref={containerRef}
              className="relative mt-8 min-h-[400px] w-full"
              style={{ visibility: 'hidden', position: 'absolute', pointerEvents: 'none' }}
            >
              <div className="grid grid-cols-1 gap-8 overflow-visible sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {randomPets.map((pet, index) => (
                  <div
                    key={`measure-${pet.slug}`}
                    className="relative"
                    ref={(el) => {
                      if (el) cardRefs.current[index] = el
                    }}
                  >
                    <div style={{ width: '22.4rem', height: '22.4rem' }} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
