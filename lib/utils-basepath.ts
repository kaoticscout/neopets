/**
 * Utility to get the basePath for static assets
 * Works with Next.js basePath configuration for static export
 */

/**
 * Get the base path for static assets
 * This reads from Next.js's __NEXT_DATA__ which includes the basePath
 */
export function getBasePath(): string {
  if (typeof window === 'undefined') return ''

  // Next.js stores basePath in __NEXT_DATA__
  if (typeof window !== 'undefined') {
    const nextData = (window as any).__NEXT_DATA__
    if (nextData?.assetPrefix) {
      return nextData.assetPrefix.replace(/\/$/, '')
    }
    // Also check basePath directly in __NEXT_DATA__
    if (nextData?.basePath) {
      return nextData.basePath.replace(/\/$/, '')
    }
  }

  return ''
}

/**
 * Create a URL that respects the basePath
 * Use this for fetch() calls and manual URL construction
 */
export function getUrl(path: string): string {
  const basePath = getBasePath()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const cleanBasePath = basePath.replace(/\/$/, '')
  return `${cleanBasePath}${normalizedPath}`
}
