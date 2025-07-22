import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // קבלת קטגוריות חנויות מהדאטאבייס
    const categories = await prisma.storeCategory.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    // אם אין קטגוריות, נחזיר קטגוריות דיפולטיביות
    if (categories.length === 0) {
      const defaultCategories = [
        'הכל',
        'אופנה נשית',
        'אופנה גברית',
        'נעליים',
        'תיקים ותכשיטים',
        'בגדי ילדים',
        'ספורט ופנויים',
        'יד שנייה',
      ]
      
      return NextResponse.json({
        success: true,
        data: defaultCategories
      })
    }

    // המרת קטגוריות למפת שמות
    const categoryNames = ['הכל', ...categories.map(cat => cat.name)]

    return NextResponse.json({
      success: true,
      data: categoryNames
    })
  } catch (error) {
    console.error('Error fetching store categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch store categories' },
      { status: 500 }
    )
  }
} 