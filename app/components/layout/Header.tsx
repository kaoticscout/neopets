import Link from 'next/link'
import { Navigation } from './Navigation'

export function Header() {
  return (
    <header className="bubble mb-4 rounded-none border-b-4 border-b-neopets-blue">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="group flex items-center">
            <h1 className="font-comic text-3xl font-extrabold text-neopets-blue transition-transform duration-300 group-hover:scale-110">
              Collector&apos;s Archive
            </h1>
          </Link>
          <Navigation />
        </div>
      </div>
    </header>
  )
}
