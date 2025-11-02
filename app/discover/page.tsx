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
import type { PetData, ColorData } from '../../lib/data'
import {
  getPetRarity,
  getColorRarity,
  getRarityLabel,
  getRarityBadgeColor,
  getRarityBorderColorValue,
  getRarityGlowColor,
  type RarityTier,
} from '../../lib/rarity'

interface PetWithColor {
  pet: PetData
  color: ColorData
}

/**
 * Calculate combined rarity percentage based on pet and color rarity
 * Uses probability: (pet_count / total_pets) * (color_count / total_colors) * 100
 * Lower percentage = rarer combination
 */
function calculateCombinedRarityPercentage(petRarity: RarityTier, colorRarity: RarityTier): number {
  // Distribution counts from rarity-distribution.json
  const petDistribution = {
    legendary: 4,
    epic: 6,
    rare: 9,
    uncommon: 14,
    common: 22,
  }
  const colorDistribution = {
    legendary: 5,
    epic: 10,
    rare: 18,
    uncommon: 28,
    common: 53,
  }
  const totalPets = 55
  const totalColors = 112

  const petProbability = petDistribution[petRarity] / totalPets
  const colorProbability = colorDistribution[colorRarity] / totalColors

  // Combined probability as percentage (rounded to 2 decimal places)
  const combinedProbability = petProbability * colorProbability * 100
  return Math.round(combinedProbability * 100) / 100
}

function getRandomPetsWithColors(pets: PetData[], count: number): PetWithColor[] {
  const shuffled = [...pets].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((pet) => {
    // Filter to only colors that have image paths
    const colorsWithImages = pet.colors.filter((c) => {
      return c.imagePathFemale && c.imagePathFemale.trim() !== ''
    })
    const availableColors = colorsWithImages.length > 0 ? colorsWithImages : pet.colors

    // Weight colors by rarity for better odds of higher rarity
    // Rarity weights: legendary: 100, epic: 50, rare: 20, uncommon: 5, common: 1
    const rarityWeights: Record<string, number> = {
      legendary: 100,
      epic: 50,
      rare: 20,
      uncommon: 5,
      common: 1,
    }

    // Create weighted array where each color appears multiple times based on rarity
    const weightedColors: ColorData[] = []
    availableColors.forEach((color) => {
      const rarity = getColorRarity(color.name)
      const weight = rarityWeights[rarity] || 1
      // Add the color to the weighted array 'weight' number of times
      for (let i = 0; i < weight; i++) {
        weightedColors.push(color)
      }
    })

    // Select random color from weighted array
    const randomColor =
      weightedColors[Math.floor(Math.random() * weightedColors.length)] ||
      availableColors[Math.floor(Math.random() * availableColors.length)] ||
      pet.colors.find((c) => c.imagePathFemale) ||
      pet.colors[0]

    return {
      pet,
      color: randomColor,
    }
  })
}

export default function DiscoverFriendsPage() {
  const { data, isLoading, error } = usePets({ pageSize: 1000 })
  const [revealed, setRevealed] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [randomPets, setRandomPets] = useState<PetWithColor[]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const cardContainerRefs = useRef<(HTMLDivElement | null)[]>([])
  const [targetPositions, setTargetPositions] = useState<Array<{ left: number; top: number }>>([])
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [showDrawAgain, setShowDrawAgain] = useState(false)

  const handleReveal = () => {
    if (data?.data && data.data.length > 0) {
      const petsWithColors = getRandomPetsWithColors(data.data, 5)
      setRandomPets(petsWithColors)
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
          // Map positions:
          // Top card (index 0) → position 1 (0-indexed: 0, leftmost)
          // Card 2 (index 1) → position 2 (0-indexed: 1, second left)
          // Card 3 (index 2) → position 5 (0-indexed: 4, rightmost)
          // Card 4 (index 3) → position 4 (0-indexed: 3, second right)
          // Card 5 (index 4) → position 3 (0-indexed: 2, middle)
          const positionMapping = [0, 1, 4, 3, 2] // Maps card index to grid position
          const positions = cardRefs.current.map((ref, cardIndex) => {
            // Calculate which grid position this card should go to
            const gridPosition = positionMapping[cardIndex] ?? cardIndex

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
            // Wait for animation to complete (700ms duration + 300ms delay for last card + buffer)
            setTimeout(
              () => {
                setAnimationComplete(true)
                // Show draw again button 0.5 seconds after animation completes
                setTimeout(() => {
                  setShowDrawAgain(true)
                }, 500)
              },
              700 + 300 + 100
            ) // duration + max delay + buffer
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
    setAnimationComplete(false)
    setShowDrawAgain(false)
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
            {showDrawAgain && (
              <div className="animate-in fade-in absolute -bottom-16 left-0 right-0 flex justify-center duration-300">
                <Button onClick={handleReset} variant="outline" size="lg">
                  🎲 Draw Again
                </Button>
              </div>
            )}

            {/* Cards positioned absolutely relative to card-container */}
            {randomPets.map((petWithColor, index) => {
              const { pet, color } = petWithColor
              const petRarityTier = getPetRarity(pet.slug)
              const colorRarityTier = getColorRarity(color.name)
              // Use the higher (rarer) of the two rarities for display styling
              const rarityLevels: Record<RarityTier, number> = {
                common: 1,
                uncommon: 2,
                rare: 3,
                epic: 4,
                legendary: 5,
              }
              const displayRarityTier =
                rarityLevels[petRarityTier] > rarityLevels[colorRarityTier]
                  ? petRarityTier
                  : colorRarityTier
              const rarityLabel = getRarityLabel(displayRarityTier)
              const rarityColorClass = getRarityBadgeColor(displayRarityTier)
              const rarityBorderColor = getRarityBorderColorValue(displayRarityTier)
              const rarityGlowColor = getRarityGlowColor(displayRarityTier)
              const combinedRarityPercentage = calculateCombinedRarityPercentage(
                petRarityTier,
                colorRarityTier
              )

              const targetPos = targetPositions[index] || { left: 0, top: 0 }

              return (
                <div
                  key={`${pet.slug}-${color.slug}`}
                  className="group/card absolute transition-all duration-700 ease-out"
                  style={
                    {
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
                      pointerEvents: revealed && animationComplete ? 'auto' : 'none',
                      transitionDelay: isAnimating ? '0ms' : `${index * 100 + 300}ms`,
                      transitionProperty: isAnimating
                        ? 'transform, opacity, width, max-width, left, top'
                        : 'transform, opacity, width, max-width, left, top',
                      zIndex: hoveredCardIndex === index ? 999999 : revealed ? 50 - index : 'auto',
                    } as React.CSSProperties
                  }
                  ref={(el) => {
                    cardContainerRefs.current[index] = el
                  }}
                  onMouseEnter={() => {
                    if (animationComplete) {
                      // Set z-index immediately via DOM to avoid React render delay
                      const container = cardContainerRefs.current[index]
                      if (container) {
                        container.style.zIndex = '999999'
                      }
                      setHoveredCardIndex(index)
                    }
                  }}
                  onMouseLeave={() => {
                    if (animationComplete) {
                      // Reset z-index immediately via DOM
                      const container = cardContainerRefs.current[index]
                      if (container) {
                        container.style.zIndex = revealed ? String(50 - index) : 'auto'
                      }
                      setHoveredCardIndex(null)
                    }
                  }}
                >
                  <Link
                    href={`/pets/${pet.slug}?color=${color.slug}`}
                    className="block overflow-visible"
                  >
                    <Card
                      className={cn(
                        'comic-card group relative h-full cursor-pointer transition-transform duration-300 hover:-rotate-1',
                        animationComplete && 'hover:scale-[1.575]'
                      )}
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
                            src={color.imagePathFemale || pet.defaultColorPath}
                            alt={`${pet.name} - ${color.name}`}
                            fill
                            className="object-contain p-1"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            unoptimized
                            onError={(e) => {
                              // Fallback to default color if image fails to load
                              const target = e.target as HTMLImageElement
                              const defaultPath = pet.defaultColorPath
                              if (!target.src.includes(defaultPath)) {
                                target.src = defaultPath
                              }
                            }}
                          />
                        </div>
                        {/* Comic book shine effect */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/20" />
                      </div>

                      <CardContent className="rounded-b-[12px] border-t-2 border-gray-200 bg-white">
                        <h3 className="mb-2 text-center font-comic text-xl font-extrabold text-gray-900">
                          {color.name.charAt(0).toUpperCase() + color.name.slice(1)} {pet.name}
                        </h3>
                        <div className="mb-2 text-center">
                          <span className="font-comic text-sm font-bold text-gray-600">
                            ({combinedRarityPercentage}%)
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Badge variant="primary" className="px-3 py-1 text-sm">
                            {pet.totalColors} Variants
                          </Badge>
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
                {randomPets.map((petWithColor, index) => (
                  <div
                    key={`measure-${petWithColor.pet.slug}-${petWithColor.color.slug}`}
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
