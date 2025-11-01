import { NextResponse } from 'next/server'
import { getPetBySlug } from '../../../../lib/data'

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const pet = await getPetBySlug(params.slug)

    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 })
    }

    return NextResponse.json({ data: pet })
  } catch (error) {
    console.error('Error fetching pet:', error)
    return NextResponse.json({ error: 'Failed to fetch pet' }, { status: 500 })
  }
}
