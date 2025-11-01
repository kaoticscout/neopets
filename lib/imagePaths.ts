/**
 * Helper utilities for resolving local Neopet image paths
 * Based on the TRD image path structure
 */

export interface ImagePathOptions {
  petSlug: string
  colorName: string // Use actual color name (e.g., "oil paint", "polka dot") to match file names
  gender?: 'male' | 'female'
}

/**
 * Get the local file path for a Neopet image
 * @param options - Pet, color, and gender information
 * @returns Path relative to public directory (e.g., '/neopets/art/acara/female/blue.png')
 * @note colorName should match the JSON color name exactly (spaces preserved)
 */
export function getNeopetImagePath(options: ImagePathOptions): string {
  const { petSlug, colorName, gender = 'female' } = options
  return `/neopets/art/${petSlug}/${gender}/${colorName}.png`
}

/**
 * Get both male and female image paths for a color
 * Note: colorName should match the JSON file color name exactly (e.g., "oil paint", "polka dot")
 */
export function getColorImagePaths(petSlug: string, colorName: string) {
  return {
    female: getNeopetImagePath({ petSlug, colorName, gender: 'female' }),
    male: getNeopetImagePath({ petSlug, colorName, gender: 'male' }),
  }
}

/**
 * Validate that an image file exists (for build-time validation)
 */
export async function validateImageExists(imagePath: string): Promise<boolean> {
  // Implementation for checking file existence
  // Used during build or data import
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs').promises
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path')

    // Remove leading slash and resolve from project root
    const fullPath = path.join(process.cwd(), 'public', imagePath)
    await fs.access(fullPath)
    return true
  } catch {
    return false
  }
}
