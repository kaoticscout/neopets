'use client'

import { useState } from 'react'
import { PetGrid } from '../components/pets/PetGrid'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export default function PetsPage() {
  const [search, setSearch] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(search)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="mb-6 text-center">
          <h1 className="mb-4 font-comic text-5xl font-extrabold text-neopets-blue">
            The Complete Collection
          </h1>
          <p className="mb-2 text-xl font-bold text-gray-700">
            Browse through every Neopet species in your collection
          </p>
          <p className="text-sm italic text-gray-500">
            Each one a collectible waiting to be discovered
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-4 max-w-md">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search pets..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
            <Button type="submit">Search</Button>
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setSearch('')
                  setSearchQuery('')
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </form>

        {searchQuery && (
          <p className="mb-4 text-sm text-gray-600">
            Showing results for &quot;{searchQuery}&quot;
          </p>
        )}
      </div>

      <PetGrid search={searchQuery} />
    </div>
  )
}
