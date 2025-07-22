import { NextRequest, NextResponse } from 'next/server'
import { getStoreById } from '@/src/lib/database'
import { prisma } from '@/src/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const store = await getStoreById(id)
    
    if (!store) {
      return NextResponse.json(
        { success: false, error: 'Store not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: store
    })
  } catch (error) {
    console.error('Error fetching store:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch store' },
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
    const { name, description, phone, email, website, isOpen } = body

    const store = await prisma.store.update({
      where: { id: id },
      data: {
        name,
        description,
        phone,
        email,
        website,
        isOpen,
        updatedAt: new Date(),
      },
      include: {
        category: true,
        addresses: true,
        owner: true,
      }
    })

    return NextResponse.json({
      success: true,
      data: store
    })
  } catch (error) {
    console.error('Error updating store:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update store' },
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
    const store = await prisma.store.update({
      where: { id: id },
      data: {
        isActive: false,
        updatedAt: new Date(),
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Store deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting store:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete store' },
      { status: 500 }
    )
  }
} 