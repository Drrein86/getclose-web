import { NextRequest, NextResponse } from 'next/server'
import { getProducts, getStores } from '@/src/lib/database'

export async function GET(request: NextRequest) {
  try {
    // קבלת חנויות מובילות (עם דירוג גבוה)
    const trendingStores = await getStores({
      limit: 3
    })

    // יצירת נתוני טרנדים שבועיים
    const weeklyTrends = [
      {
        id: 'trend1',
        title: 'חולצות קיץ',
        subtitle: 'הטרנד החם של השבוע',
        description: 'חולצות קיצה קלילות וצבעוניות',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
        products: [] as any[],
        trendScore: 95,
        weeklyViews: '12.4K',
        colors: ['#FF6B6B', '#FFE66D'],
      },
      {
        id: 'trend2',
        title: 'נעלי ספורט רטרו',
        subtitle: 'חזרה לשנות ה-90',
        description: 'נעלי ספורט בסגנון רטרו עם נגיעה מודרנית',
        image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop',
        products: [] as any[],
        trendScore: 88,
        weeklyViews: '8.7K',
        colors: ['#4ECDC4', '#96CEB4'],
      },
      {
        id: 'trend3', 
        title: 'תיקי יד קטנים',
        subtitle: 'הטרנד האלגנטי',
        description: 'תיקי יד קטנים ואלגנטיים לכל אירוע',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
        products: [] as any[],
        trendScore: 82,
        weeklyViews: '6.2K',
        colors: ['#A8E6CF', '#88D8C0'],
      },
    ]

    // קבלת מוצרים לכל טרנד
    for (const trend of weeklyTrends) {
      const products = await getProducts({
        limit: 2,
        search: trend.title.split(' ')[0] // חיפוש לפי מילה ראשונה
      })
      trend.products = products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0] || '',
        store: product.store?.name || 'חנות לא ידועה',
      }))
    }

    // יצירת נתוני חנויות מובילות עם פרטים נוספים
    const formattedTrendingStores = trendingStores.map((store, index) => ({
      id: store.id,
      name: store.name,
      description: store.description || 'חנות איכותית',
      logo: store.logo || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop',
      rating: store.rating || 4.5,
      followers: 1000 + index * 500,
      weeklyGrowth: `+${20 - index * 3}%`,
      specialOffer: index === 0 ? '30% הנחה על כל הקולקציה' : index === 1 ? 'משלוח חינם על כל הזמנה' : 'קנה 2 קבל 1 במתנה',
      gradient: [
        ['#FF6B6B', '#FF8E53'],
        ['#4ECDC4', '#44A08D'],
        ['#F7B733', '#FC4A1A']
      ][index] || ['#667eea', '#764ba2'],
      isHot: index < 2,
    }))

    return NextResponse.json({
      success: true,
      data: {
        trendingStores: formattedTrendingStores,
        weeklyTrends: weeklyTrends
      }
    })
  } catch (error) {
    console.error('Error fetching trending data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trending data' },
      { status: 500 }
    )
  }
} 