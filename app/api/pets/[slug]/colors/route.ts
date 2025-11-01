import { NextResponse } from 'next/server'
import { getPetColors } from '../../../../../lib/data'

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const colors = await getPetColors(params.slug)

    return NextResponse.json({
      data: colors,
      meta: {
        total: colors.length,
      },
    })
  } catch (error) {
    console.error('Error fetching colors:', error)
    return NextResponse.json({ error: 'Failed to fetch colors' }, { status: 500 })
  }
}
