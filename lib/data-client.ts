/**
 * Client-side data service - fetches JSON files from public directory
 * Used for static export (GitHub Pages)
 */

import { getColorImagePaths } from './imagePaths'
import { getUrl } from './utils-basepath'

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

// Known list of pet slugs - we could also generate this dynamically if needed
const KNOWN_PET_SLUGS = [
  'acara',
  'aisha',
  'blumaroo',
  'bori',
  'bruce',
  'buzz',
  'chia',
  'chomby',
  'cybunny',
  'draik',
  'elephante',
  'eyrie',
  'flotsam',
  'gelert',
  'gnorbu',
  'grarrl',
  'grundo',
  'hissi',
  'ixi',
  'jetsam',
  'jubjub',
  'kacheek',
  'kau',
  'kiko',
  'koi',
  'korbat',
  'kougra',
  'krawk',
  'kyrii',
  'lenny',
  'lupe',
  'lutari',
  'meerca',
  'moehog',
  'mynci',
  'nimmo',
  'ogrin',
  'peophin',
  'poogle',
  'pteri',
  'quiggle',
  'ruki',
  'scorchio',
  'shoyru',
  'skeith',
  'techo',
  'tonu',
  'tuskaninny',
  'uni',
  'usul',
  'vandagyre',
  'wocky',
  'xweetok',
  'yurble',
  'zafara',
]

/**
 * Get all pet species from JSON files
 */
export async function getAllPets(): Promise<PetData[]> {
  const pets: PetData[] = []

  // Load pets in parallel (with some batching to avoid overwhelming)
  const batchSize = 10
  for (let i = 0; i < KNOWN_PET_SLUGS.length; i += batchSize) {
    const batch = KNOWN_PET_SLUGS.slice(i, i + batchSize)
    const batchPromises = batch.map((slug) => getPetBySlug(slug))
    const batchResults = await Promise.all(batchPromises)

    for (const pet of batchResults) {
      if (pet) {
        pets.push(pet)
      }
    }
  }

  // Sort alphabetically
  return pets.sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Get a single pet by slug
 */
export async function getPetBySlug(slug: string): Promise<PetData | null> {
  try {
    const url = getUrl(`/data/${slug}.json`)

    // Debug logging (can be removed in production)
    if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
      console.log(`[Data Fetch] Attempting to fetch ${slug} from: ${url}`)
    }

    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`Failed to fetch pet ${slug} from ${url}: ${res.status} ${res.statusText}`)
      // Try fallback without basePath in case basePath detection failed
      if (url.includes('/data/') && url !== `/data/${slug}.json`) {
        console.log(`[Data Fetch] Trying fallback: /data/${slug}.json`)
        const fallbackRes = await fetch(`/data/${slug}.json`)
        if (fallbackRes.ok) {
          const data: PetJsonData = await fallbackRes.json()
          // Process data the same way...
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
      }
      return null
    }

    const data: PetJsonData = await res.json()

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
    // Use getNeopetImagePath to ensure basePath is included
    const defaultColorPath =
      defaultColor?.imagePathFemale ||
      getColorImagePaths(slug, 'blue').female ||
      '/neopets/art/default.png'

    return {
      name: capitalizeFirst(slug),
      slug,
      totalColors: colors.length,
      colors,
      defaultColorPath,
    }
  } catch (error) {
    console.error(`Error fetching pet ${slug}:`, error)
    return null
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
