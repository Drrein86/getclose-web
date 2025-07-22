import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/src/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')

    // קבלת מוצרים עם דירוג גבוה או במבצע
    const products = await getProducts({
      limit: limit ? parseInt(limit) : 10,
      onSale: true // מוצרים במבצע
    })

    // אם אין מוצרים במבצע, נקח מוצרים רגילים
    let featuredProducts = products
    if (products.length === 0) {
      featuredProducts = await getProducts({
        limit: limit ? parseInt(limit) : 10
      })
    }

    return NextResponse.json({
      success: true,
      data: featuredProducts
    })
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured products' },
      { status: 500 }
    )
  }
} 