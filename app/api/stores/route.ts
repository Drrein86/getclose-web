import { NextRequest, NextResponse } from 'next/server'
import { getStores, createStore } from '@/src/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    const options = {
      category: category || undefined,
      search: search || undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    }

    const stores = await getStores(options)
    
    return NextResponse.json({
      success: true,
      data: stores,
      total: stores.length
    })
  } catch (error) {
    console.error('Error fetching stores:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stores' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, ownerId, categoryId, phone, email, website } = body

    // Validate required fields
    if (!name || !ownerId || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, ownerId, categoryId' },
        { status: 400 }
      )
    }

    const store = await createStore({
      name,
      description,
      ownerId,
      categoryId,
      phone,
      email,
      website,
    })

    return NextResponse.json({
      success: true,
      data: store
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating store:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create store' },
      { status: 500 }
    )
  }
} 