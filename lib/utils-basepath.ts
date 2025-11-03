/**
 * Utility to get the basePath for static assets
 * Works with Next.js basePath configuration for static export
 */

/**
 * Get the base path for static assets
 * Tries multiple methods to detect the basePath reliably
 */
export function getBasePath(): string {
  if (typeof window === 'undefined') return ''

  // Method 1: Check __NEXT_DATA__ which Next.js uses for client-side routing
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nextData = (window as any).__NEXT_DATA__ as
      | { basePath?: string; assetPrefix?: string }
      | undefined
    if (nextData) {
      // Next.js stores basePath in __NEXT_DATA__
      if (nextData.basePath) {
        return String(nextData.basePath).replace(/\/$/, '')
      }
      // Sometimes it's in assetPrefix
      if (nextData.assetPrefix) {
        return String(nextData.assetPrefix).replace(/\/$/, '')
      }
    }
  } catch {
    // Ignore errors
  }

  // Method 2: Check embedded environment variable (NEXT_PUBLIC_ vars are embedded at build time)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof process !== 'undefined' && (process as any).env?.NEXT_PUBLIC_BASE_PATH) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const envPath = String((process as any).env.NEXT_PUBLIC_BASE_PATH)
      if (envPath) {
        return envPath.replace(/\/$/, '')
      }
    }
  } catch {
    // Ignore errors
  }

  // Method 3: Derive from current pathname (fallback)
  // This works by detecting if we're in a subdirectory
  try {
    const pathname = window.location.pathname
    const hostname = window.location.hostname

    // For GitHub Pages: if hostname is username.github.io and pathname starts with /repo-name
    // then /repo-name is the basePath
    if (pathname && pathname !== '/' && pathname !== '') {
      const parts = pathname.split('/').filter(Boolean)
      if (parts.length > 0) {
        const firstPart = parts[0]
        // Check if first part is NOT a known route (likely basePath)
        const knownRoutes = ['pets', 'roster', 'discover', '_next', 'data', 'neopets']
        if (!knownRoutes.includes(firstPart) && firstPart !== '') {
          // Additional check: if we're on GitHub Pages subdirectory (not root)
          // and the first part isn't a known route, it's likely the repo name (basePath)
          if (hostname.includes('github.io')) {
            return `/${firstPart}`
          }
        }
      }
    }

    // If we're at root (/), check if base tag exists
    if ((!pathname || pathname === '/') && typeof document !== 'undefined') {
      const baseTag = document.querySelector('base')
      if (baseTag?.href) {
        const baseUrl = new URL(baseTag.href)
        const basePath = baseUrl.pathname.replace(/\/$/, '')
        if (basePath && basePath !== '/') {
          return basePath
        }
      }
    }
  } catch {
    // Ignore errors
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
