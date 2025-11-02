'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePet } from '../../../../../hooks/usePets'
import { Button } from '../../../../components/ui/Button'
import { Badge } from '../../../../components/ui/Badge'
import { Skeleton } from '../../../../components/ui/Skeleton'
import { useParams } from 'next/navigation'
import type { ColorData } from '../../../../../lib/data'

export default function ColorDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const colorSlug = params.colorSlug as string
  const { data, isLoading, error } = usePet(slug)
  const [gender, setGender] = useState<'male' | 'female'>('female')

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-8 h-10 w-64" />
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !data?.data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Color Not Found</h1>
          <Link href={`/pets/${slug}`}>
            <Button>Back to Pet</Button>
          </Link>
        </div>
      </div>
    )
  }

  const pet = data.data
  const color = pet.colors.find((c: ColorData) => c.slug === colorSlug)

  if (!color) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Color Not Found</h1>
          <Link href={`/pets/${slug}`}>
            <Button>Back to Pet</Button>
          </Link>
        </div>
      </div>
    )
  }

  const imagePath = gender === 'female' ? color.imagePathFemale : color.imagePathMale

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm">
        <Link href="/pets" className="text-blue-600 hover:underline">
          Pets
        </Link>
        <span className="mx-2 text-gray-500">/</span>
        <Link href={`/pets/${slug}`} className="text-blue-600 hover:underline">
          {pet.name}
        </Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-700">{color.name}</span>
      </nav>

      <div className="mb-8 grid gap-8 md:grid-cols-2">
        {/* Image Section */}
        <div>
          <div className="relative mb-4 aspect-square overflow-hidden rounded-big border-4 border-white bg-gray-50 shadow-neopets-lg">
            <Image
              src={imagePath}
              alt={`${pet.name} ${color.name} (${gender})`}
              fill
              className="object-contain p-4"
              priority
            />
          </div>
          {/* Gender Toggle */}
          <div className="flex justify-center gap-2">
            <Button
              variant={gender === 'female' ? 'primary' : 'outline'}
              onClick={() => setGender('female')}
            >
              Female
            </Button>
            <Button
              variant={gender === 'male' ? 'primary' : 'outline'}
              onClick={() => setGender('male')}
            >
              Male
            </Button>
          </div>
        </div>

        {/* Details Section */}
        <div>
          <h1 className="mb-2 text-5xl font-extrabold text-neopets-blue">
            {pet.name} - {color.name}
          </h1>
          <div className="mb-6 flex items-center gap-2">
            {color.ucExist && <Badge variant="warning">UC Available</Badge>}
          </div>

          <div className="mb-6 space-y-4">
            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-500">Pet Species</h3>
              <Link href={`/pets/${slug}`} className="text-blue-600 hover:underline">
                {pet.name}
              </Link>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-500">Color</h3>
              <p className="text-gray-900">{color.name}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href={`/pets/${slug}`}>
              <Button variant="outline">← Back to {pet.name}</Button>
            </Link>
            <Link href="/pets">
              <Button variant="ghost">All Pets</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Both Gender Images */}
      <div className="mt-12">
        <h2 className="mb-6 text-center text-3xl font-extrabold text-neopets-blue">
          Both Variants
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-big border-4 border-white bg-gray-50 shadow-neopets">
            <Image
              src={color.imagePathFemale}
              alt={`${pet.name} ${color.name} (female)`}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute bottom-2 left-2">
              <Badge variant="primary">Female</Badge>
            </div>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-big border-4 border-white bg-gray-50 shadow-neopets">
            <Image
              src={color.imagePathMale}
              alt={`${pet.name} ${color.name} (male)`}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute bottom-2 left-2">
              <Badge variant="primary">Male</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
