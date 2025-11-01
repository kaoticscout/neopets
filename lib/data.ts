/**
 * Local data service - reads from JSON files directly
 * No database needed - everything is file-based
 */

import fs from 'fs'
import path from 'path'
import { getColorImagePaths } from './imagePaths'

export interface PetData {
  name: string
  slug: string
  category?: string
  totalColors: number
  colors: ColorData[]
  defaultColorPath: string
}

export interface ColorData {
  name: string
  slug: string
  femaleId?: string
  maleId?: string
  ucExist?: boolean
  imagePathFemale: string
  imagePathMale: string
}

export interface PetJsonData {
  [colorName: string]: {
    female?: string
    male?: string
    UCexist?: boolean
  }
}

const DATA_DIR = path.join(process.cwd(), 'data')

/**
 * Get all pet species from JSON files
 */
export async function getAllPets(): Promise<PetData[]> {
  const files = fs.readdirSync(DATA_DIR)
  const petFiles = files.filter(
    (f) => f.endsWith('.json') && f !== 'allPets.json' && f !== 'codes.json'
  )

  const pets: PetData[] = []

  for (const file of petFiles) {
    const petName = path.basename(file, '.json')
    const filePath = path.join(DATA_DIR, file)
    const rawData = fs.readFileSync(filePath, 'utf-8')
    const data: PetJsonData = JSON.parse(rawData)

    // Get all colors
    const colors: ColorData[] = Object.entries(data).map(([colorName, colorData]) => {
      const slug = colorName.toLowerCase().replace(/\s+/g, '-')
      const paths = getColorImagePaths(petName, colorName)
      return {
        name: colorName,
        slug,
        femaleId: colorData.female,
        maleId: colorData.male,
        ucExist: colorData.UCexist ?? false,
        imagePathFemale: paths.female,
        imagePathMale: paths.male,
      }
    })

    // Use first available color as default (prefer 'blue' if exists)
    const defaultColor = colors.find((c) => c.slug === 'blue') || colors[0]
    const defaultColorPath = defaultColor?.imagePathFemale || '/neopets/art/default.png'

    pets.push({
      name: capitalizeFirst(petName),
      slug: petName,
      totalColors: colors.length,
      colors,
      defaultColorPath,
    })
  }

  // Sort alphabetically
  return pets.sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Get a single pet by slug
 */
export async function getPetBySlug(slug: string): Promise<PetData | null> {
  const filePath = path.join(DATA_DIR, `${slug}.json`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const rawData = fs.readFileSync(filePath, 'utf-8')
  const data: PetJsonData = JSON.parse(rawData)

  const colors: ColorData[] = Object.entries(data).map(([colorName, colorData]) => {
    const colorSlug = colorName.toLowerCase().replace(/\s+/g, '-')
    const paths = getColorImagePaths(slug, colorName)
    return {
      name: colorName,
      slug: colorSlug,
      femaleId: colorData.female,
      maleId: colorData.male,
      ucExist: colorData.UCexist ?? false,
      imagePathFemale: paths.female,
      imagePathMale: paths.male,
    }
  })

  const defaultColor = colors.find((c) => c.slug === 'blue') || colors[0]
  const defaultColorPath = defaultColor?.imagePathFemale || '/neopets/art/default.png'

  return {
    name: capitalizeFirst(slug),
    slug,
    totalColors: colors.length,
    colors,
    defaultColorPath,
  }
}

/**
 * Get colors for a pet
 */
export async function getPetColors(petSlug: string): Promise<ColorData[]> {
  const pet = await getPetBySlug(petSlug)
  return pet?.colors || []
}

/**
 * Get a specific color for a pet
 */
export async function getPetColor(petSlug: string, colorSlug: string): Promise<ColorData | null> {
  const pet = await getPetBySlug(petSlug)
  if (!pet) return null

  return pet.colors.find((c) => c.slug === colorSlug) || null
}

/**
 * Search pets by name
 */
export async function searchPets(query: string): Promise<PetData[]> {
  const allPets = await getAllPets()
  const lowerQuery = query.toLowerCase()

  return allPets.filter((pet) => pet.name.toLowerCase().includes(lowerQuery))
}

/**
 * Get stats for homepage
 */
export async function getStats() {
  const pets = await getAllPets()
  const totalColors = pets.reduce((sum, pet) => sum + pet.totalColors, 0)

  return {
    totalPets: pets.length,
    totalColors,
    totalImages: totalColors * 2, // male + female
  }
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
