'use client'

import Link from 'next/link'
import { Button } from './components/ui/Button'
import { Card, CardContent, CardHeader } from './components/ui/Card'
import { useStats } from '../hooks/useStats'
import { Skeleton } from './components/ui/Skeleton'

export default function Home() {
  const { data: statsData, isLoading } = useStats()
  const stats = statsData?.data

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <div className="relative inline-block">
          <h1 className="mb-4 font-comic text-6xl leading-tight text-neopets-blue md:text-7xl">
            Neopets
            <br />
            <span className="text-neopets-pink">Collector&apos;s</span>
            <br />
            <span className="text-neopets-yellow">Archive</span>
          </h1>
          <div className="absolute -right-4 -top-4">
            <div className="comic-speech px-4 py-2 text-sm font-bold text-neopets-blue">
              Rare Finds!
            </div>
          </div>
        </div>
        <p className="mx-auto mb-6 max-w-2xl text-xl font-bold text-gray-800">
          Hunt for rare colors, discover limited editions, and build your ultimate Neopets
          collection!
        </p>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
          Every pet, every color, every variant—documented like precious comic books. The thrill of
          discovery awaits.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/pets">
            <Button size="lg" className="px-8 py-4 text-xl font-bold">
              Start Your Collection
            </Button>
          </Link>
          <Link href="/roster">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-xl font-bold">
              My Roster
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="comic-card relative border-neopets-blue">
          <div className="absolute -right-3 -top-3 z-20">
            <span className="rarity-sticker rounded-full bg-neopets-blue px-2.5 py-1 font-comic text-xs font-bold text-white shadow-lg">
              #{stats?.totalPets || '?'}
            </span>
          </div>
          <CardHeader>
            <h3 className="font-comic text-lg font-extrabold uppercase text-neopets-blue">
              Species Catalog
            </h3>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="font-comic text-5xl font-extrabold text-neopets-blue">
                {stats?.totalPets || 0}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="comic-card relative border-neopets-pink">
          <div className="absolute -right-3 -top-3 z-20">
            <span className="rarity-sticker rounded-full bg-neopets-pink px-2.5 py-1 font-comic text-xs font-bold text-white shadow-lg">
              Rare!
            </span>
          </div>
          <CardHeader>
            <h3 className="font-comic text-lg font-extrabold uppercase text-neopets-pink">
              Color Variants
            </h3>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="font-comic text-5xl font-extrabold text-neopets-pink">
                {stats?.totalColors || 0}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="comic-card relative border-neopets-yellow">
          <div className="absolute -right-3 -top-3 z-20">
            <span className="rarity-sticker rounded-full bg-neopets-yellow px-2.5 py-1 font-comic text-xs font-bold text-gray-800 shadow-lg">
              Mint!
            </span>
          </div>
          <CardHeader>
            <h3 className="font-comic text-lg font-extrabold uppercase text-orange-600">
              Total Cards
            </h3>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="font-comic text-5xl font-extrabold text-neopets-yellow">
                {stats?.totalImages || 0}
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="text-center">
        <h2 className="mb-4 font-comic text-5xl font-extrabold text-neopets-blue">
          Your Collection Awaits
        </h2>
        <p className="mb-8 text-lg text-gray-600">
          Like rare comic books, each Neopet is a collectible waiting to be discovered
        </p>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="comic-card relative border-neopets-green hover:rotate-1">
            <div className="absolute -right-3 -top-3 z-20">
              <span className="rarity-sticker rounded-full bg-neopets-green px-2.5 py-1 font-comic text-xs font-bold text-white shadow-lg">
                55+
              </span>
            </div>
            <CardHeader>
              <h3 className="mb-2 font-comic text-2xl font-extrabold text-neopets-green">
                Complete Species Set
              </h3>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-gray-700">
                Hunt for every Neopet species—from beloved classics like Kacheek and Shoyru to
                ultra-rare finds like Lutari and Draik. Each one a collectible gem!
              </p>
            </CardContent>
          </Card>

          <Card className="comic-card relative border-neopets-purple hover:rotate-1">
            <div className="absolute -right-3 -top-3 z-20">
              <span className="rarity-sticker rounded-full bg-neopets-purple px-2.5 py-1 font-comic text-xs font-bold text-white shadow-lg">
                Rare!
              </span>
            </div>
            <CardHeader>
              <h3 className="mb-2 font-comic text-2xl font-extrabold text-neopets-purple">
                Premium Color Vault
              </h3>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-gray-700">
                Collect every color variant—from basic colors to legendary paint brush exclusives
                and mysterious lab ray transformations. The hunt never ends!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
