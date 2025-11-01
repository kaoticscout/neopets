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
          <span className="mb-4 block text-5xl">🐾</span>
          <h1 className="text-neopets-gradient mb-4 text-5xl font-extrabold">All Neopets</h1>
          <p className="text-xl font-bold text-gray-700">
            Browse through all available Neopet species and their colors!
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
