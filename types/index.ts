/**
 * Shared TypeScript types for the application
 */

export type PetCategory = 'standard' | 'limited_edition' | 'premium'

export type ColorType = 'STANDARD' | 'PAINT_BRUSH' | 'LAB_RAY' | 'LIMITED_EDITION' | 'SPECIAL'

export type Rarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'ULTRA_RARE' | 'LIMITED_EDITION'

export type AvatarCategory =
  | 'BATTLE'
  | 'GAME'
  | 'RANDOM_EVENT'
  | 'SHOP'
  | 'SITE_EVENT'
  | 'PET_COLOR'
  | 'PET_SPECIES'
  | 'MISCELLANEOUS'

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'VERY_HARD' | 'RETIRED'

export interface PetSpecies {
  id: string
  name: string
  slug: string
  category: PetCategory | null
  description: string | null
  imagePath: string
  totalColors: number
  popularityScore: number
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Color {
  id: string
  petSpeciesId: string
  name: string
  slug: string
  type: ColorType
  rarity: Rarity
  imagePathFemale: string
  imagePathMale: string
  releaseDate: Date | null
  costNp: number | null
  costNc: number | null
  obtainMethod: string | null
  isAvailable: boolean
  description: string | null
  tags: string[]
  metadata: Record<string, any> | null
  createdAt: Date
  updatedAt: Date
}

export interface Avatar {
  id: string
  name: string
  slug: string
  imageUrl: string
  category: AvatarCategory
  difficulty: Difficulty
  isAvailable: boolean
  requirements: string
  guide: string | null
  releaseDate: Date | null
  tips: string | null
  rarityScore: number
  tags: string[]
  metadata: Record<string, any> | null
  createdAt: Date
  updatedAt: Date
}

export interface PetFilters {
  page?: number
  pageSize?: number
  category?: string
  sortBy?: 'name' | 'popularity' | 'colors'
  order?: 'asc' | 'desc'
  search?: string
}
