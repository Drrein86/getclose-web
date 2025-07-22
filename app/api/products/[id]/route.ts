import { NextRequest, NextResponse } from 'next/server'
import { getProductById } from '@/src/lib/database'
import { prisma } from '@/src/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await getProductById(id)
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      inStock,
      isOnSale,
      saleEndDate
    } = body

    const product = await prisma.product.update({
      where: { id: id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        images,
        brand,
        tags,
        stockQuantity: stockQuantity ? parseInt(stockQuantity) : undefined,
        inStock,
        isOnSale,
        saleEndDate: saleEndDate ? new Date(saleEndDate) : undefined,
        updatedAt: new Date(),
      },
      include: {
        store: {
          include: {
            category: true,
          }
        },
        category: true,
        sizes: true,
        colors: true,
      }
    })

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Soft delete - just mark as inactive
    const product = await prisma.product.update({
      where: { id: id },
      data: {
        isActive: false,
        updatedAt: new Date(),
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
} 