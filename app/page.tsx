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
        <div className="mb-6">
          <span className="text-6xl">🐉</span>
          <span className="mx-4 text-6xl">🦄</span>
          <span className="text-6xl">🐉</span>
        </div>
        <h1 className="text-neopets-gradient mb-4 text-6xl font-extrabold md:text-7xl">
          Neopets Tribute
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-2xl font-bold text-gray-800">
          A nostalgic journey through all Neopets, colors, and avatars from the classic Neopets
          game. Relive your childhood memories!
        </p>
        <Link href="/pets">
          <Button size="lg" className="px-8 py-4 text-xl">
            ✨ Explore All Pets ✨
          </Button>
        </Link>
      </section>

      {/* Stats Section */}
      <section className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-neopets-blue">
          <CardHeader>
            <h3 className="text-lg font-extrabold uppercase text-neopets-blue">🐾 Pet Species</h3>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="bg-gradient-to-r from-neopets-blue to-neopets-lightBlue bg-clip-text text-5xl font-extrabold text-transparent">
                {stats?.totalPets || 0}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-neopets-pink">
          <CardHeader>
            <h3 className="text-lg font-extrabold uppercase text-neopets-pink">
              🎨 Color Combinations
            </h3>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="bg-gradient-to-r from-neopets-pink to-neopets-lightPink bg-clip-text text-5xl font-extrabold text-transparent">
                {stats?.totalColors || 0}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-neopets-yellow">
          <CardHeader>
            <h3 className="text-lg font-extrabold uppercase text-orange-600">🖼️ Total Images</h3>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="bg-gradient-to-r from-neopets-yellow to-neopets-lightYellow bg-clip-text text-5xl font-extrabold text-transparent">
                {stats?.totalImages || 0}
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="text-center">
        <h2 className="text-neopets-gradient mb-8 text-4xl font-extrabold">
          ✨ What You Can Explore ✨
        </h2>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="border-neopets-green hover:rotate-1">
            <CardHeader>
              <h3 className="mb-2 text-2xl font-extrabold text-neopets-green">
                🐾 All Pet Species
              </h3>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-gray-700">
                Browse through all 55+ Neopet species, from classic favorites like Kacheek and
                Shoyru to rare species like Lutari and Draik!
              </p>
            </CardContent>
          </Card>

          <Card className="border-neopets-purple hover:rotate-1">
            <CardHeader>
              <h3 className="mb-2 text-2xl font-extrabold text-neopets-purple">🎨 Color Gallery</h3>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-gray-700">
                See every color combination available for each pet, from basic colors to rare paint
                brush colors and lab ray zaps!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
