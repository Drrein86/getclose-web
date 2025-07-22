import { NextRequest, NextResponse } from 'next/server'
import { getProducts, createProduct } from '@/src/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')
    const onSale = searchParams.get('onSale')

    const options = {
      storeId: storeId || undefined,
      category: category || undefined,
      search: search || undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      onSale: onSale === 'true' ? true : undefined,
    }

    const products = await getProducts(options)
    
    return NextResponse.json({
      success: true,
      data: products,
      total: products.length
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      description, 
      price, 
      originalPrice,
      images,
      brand,
      tags,
      stockQuantity,
      storeId,
      categoryId 
    } = body

    // Validate required fields
    if (!name || !price || !storeId || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, price, storeId, categoryId' },
        { status: 400 }
      )
    }

    const product = await createProduct({
      name,
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      images: images || [],
      brand,
      tags: tags || [],
      stockQuantity: parseInt(stockQuantity) || 0,
      storeId,
      categoryId,
    })

    return NextResponse.json({
      success: true,
      data: product
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
} 