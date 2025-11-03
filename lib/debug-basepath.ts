/**
 * Debug utility to help troubleshoot basePath issues
 * Can be temporarily added to pages to log basePath detection
 */

import { getBasePath, getUrl } from './utils-basepath'

export function logBasePathInfo() {
  if (typeof window === 'undefined') {
    console.log('[BasePath Debug] Running on server')
    return
  }

  const detectedBasePath = getBasePath()
  const testUrl = getUrl('/data/aisha.json')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nextData = (window as any).__NEXT_DATA__ as
    | { basePath?: string; assetPrefix?: string }
    | undefined

  console.log('[BasePath Debug]', {
    detectedBasePath,
    testUrl,
    pathname: window.location.pathname,
    hostname: window.location.hostname,
    href: window.location.href,
    __NEXT_DATA__: nextData,
    // @ts-expect-error - NEXT_PUBLIC_ env vars are embedded at build time by Next.js
    envBasePath: typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_BASE_PATH : 'N/A',
  })
}
