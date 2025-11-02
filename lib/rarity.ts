/**
 * Rarity utilities for pets and colors
 * Client-safe version that works in both server and client components
 */

import rarityData from '../data/rarity-distribution.json'

export type RarityTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

interface RarityDistribution {
  petRarity: {
    pets: {
      [key in RarityTier]: string[]
    }
  }
  colorRarity: {
    colors: {
      [key in RarityTier]: string[]
    }
  }
  rarityTiers: {
    [key in RarityTier]: {
      level: number
      color: string
      description: string
    }
  }
}

const distribution = rarityData as RarityDistribution

/**
 * Get rarity tier for a pet by slug
 */
export function getPetRarity(petSlug: string): RarityTier {
  const slug = petSlug.toLowerCase()

  // Check each tier from highest to lowest
  if (distribution.petRarity.pets.legendary.includes(slug)) return 'legendary'
  if (distribution.petRarity.pets.epic.includes(slug)) return 'epic'
  if (distribution.petRarity.pets.rare.includes(slug)) return 'rare'
  if (distribution.petRarity.pets.uncommon.includes(slug)) return 'uncommon'
  return 'common'
}

/**
 * Get rarity tier for a color by name
 */
export function getColorRarity(colorName: string): RarityTier {
  const name = colorName.toLowerCase()

  // Check each tier from highest to lowest
  if (distribution.colorRarity.colors.legendary.includes(name)) return 'legendary'
  if (distribution.colorRarity.colors.epic.includes(name)) return 'epic'
  if (distribution.colorRarity.colors.rare.includes(name)) return 'rare'
  if (distribution.colorRarity.colors.uncommon.includes(name)) return 'uncommon'
  return 'common'
}

/**
 * Get rarity display label
 */
export function getRarityLabel(tier: RarityTier): string {
  const labels: Record<RarityTier, string> = {
    common: 'Common',
    uncommon: 'Uncommon',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary',
  }
  return labels[tier]
}

/**
 * Get rarity color class for styling
 */
export function getRarityColorClass(tier: RarityTier): string {
  const colors: Record<RarityTier, string> = {
    common: 'bg-gray-500',
    uncommon: 'bg-green-500',
    rare: 'bg-blue-500',
    epic: 'bg-purple-500',
    legendary: 'bg-yellow-500',
  }
  return colors[tier]
}

/**
 * Get rarity badge color (more vibrant colors for badges)
 */
export function getRarityBadgeColor(tier: RarityTier): string {
  const colors: Record<RarityTier, string> = {
    common: 'bg-gray-400 text-white',
    uncommon: 'bg-green-500 text-white',
    rare: 'bg-blue-500 text-white',
    epic: 'bg-purple-600 text-white',
    legendary: 'bg-amber-500 text-white font-bold shadow-[0_0_8px_rgba(245,158,11,0.8)]',
  }
  return colors[tier]
}

/**
 * Get rarity border color for cards and borders
 */
export function getRarityBorderColor(tier: RarityTier): string {
  const colors: Record<RarityTier, string> = {
    common: 'border-gray-400',
    uncommon: 'border-green-500',
    rare: 'border-blue-500',
    epic: 'border-purple-600',
    legendary: 'border-amber-500',
  }
  return colors[tier]
}
