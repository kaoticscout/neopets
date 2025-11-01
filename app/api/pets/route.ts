import { NextResponse } from 'next/server'
import { getAllPets, searchPets } from '../../../lib/data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '24')

  try {
    let pets

    if (search) {
      pets = await searchPets(search)
    } else {
      pets = await getAllPets()
    }

    // Pagination
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedPets = pets.slice(start, end)

    return NextResponse.json({
      data: paginatedPets,
      meta: {
        total: pets.length,
        page,
        pageSize,
        totalPages: Math.ceil(pets.length / pageSize),
      },
    })
  } catch (error) {
    console.error('Error fetching pets:', error)
    return NextResponse.json({ error: 'Failed to fetch pets' }, { status: 500 })
  }
}
