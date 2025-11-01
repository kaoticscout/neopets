import Link from 'next/link'
import { Navigation } from './Navigation'

export function Header() {
  return (
    <header className="bubble mb-4 rounded-none border-b-4 border-b-neopets-blue">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="group flex items-center space-x-3">
            <span className="text-4xl">✨</span>
            <h1 className="text-neopets-gradient text-3xl font-extrabold transition-transform duration-300 group-hover:scale-110">
              Neopets Tribute
            </h1>
            <span className="text-4xl">✨</span>
          </Link>
          <Navigation />
        </div>
      </div>
    </header>
  )
}
