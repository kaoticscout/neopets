'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import type { PetData } from '../../../lib/data'

interface PetCardProps {
  pet: PetData
}

export function PetCard({ pet }: PetCardProps) {
  return (
    <Link href={`/pets/${pet.slug}`}>
      <Card className="h-full cursor-pointer">
        <div className="relative aspect-square w-full bg-gradient-to-br from-neopets-lightBlue via-neopets-lightPink to-neopets-lightYellow">
          <Image
            src={pet.defaultColorPath}
            alt={pet.name}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardContent className="bg-gradient-to-br from-white to-gray-50">
          <h3 className="mb-3 text-xl font-extrabold text-gray-900">{pet.name}</h3>
          <div className="flex items-center justify-center">
            <Badge variant="primary" className="px-4 py-1.5 text-base">
              ✨ {pet.totalColors} Colors ✨
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
