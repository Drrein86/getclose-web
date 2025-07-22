import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create store categories
  console.log('📦 Creating store categories...')
  const storeCategories = await Promise.all([
    prisma.storeCategory.upsert({
      where: { name: 'אופנה' },
      update: {},
      create: {
        name: 'אופנה',
        icon: '👗',
        color: '#FF6B6B'
      }
    }),
    prisma.storeCategory.upsert({
      where: { name: 'נעליים' },
      update: {},
      create: {
        name: 'נעליים',
        icon: '👟',
        color: '#4ECDC4'
      }
    }),
    prisma.storeCategory.upsert({
      where: { name: 'בריאות ויופי' },
      update: {},
      create: {
        name: 'בריאות ויופי',
        icon: '💄',
        color: '#45B7D1'
      }
    }),
    prisma.storeCategory.upsert({
      where: { name: 'מכולת' },
      update: {},
      create: {
        name: 'מכולת',
        icon: '🛒',
        color: '#96CEB4'
      }
    }),
    prisma.storeCategory.upsert({
      where: { name: 'אלקטרוניקה' },
      update: {},
      create: {
        name: 'אלקטרוניקה',
        icon: '📱',
        color: '#FFEAA7'
      }
    }),
    prisma.storeCategory.upsert({
      where: { name: 'בית וגן' },
      update: {},
      create: {
        name: 'בית וגן',
        icon: '🏠',
        color: '#DDA0DD'
      }
    }),
    prisma.storeCategory.upsert({
      where: { name: 'ספורט' },
      update: {},
      create: {
        name: 'ספורט',
        icon: '⚽',
        color: '#FFB347'
      }
    })
  ])

  // Create product categories
  console.log('🏷️ Creating product categories...')
  const productCategories = await Promise.all([
    prisma.productCategory.upsert({
      where: { name: 'חולצות' },
      update: {},
      create: {
        name: 'חולצות',
        icon: '👕'
      }
    }),
    prisma.productCategory.upsert({
      where: { name: 'מכנסיים' },
      update: {},
      create: {
        name: 'מכנסיים',
        icon: '👖'
      }
    }),
    prisma.productCategory.upsert({
      where: { name: 'שמלות' },
      update: {},
      create: {
        name: 'שמלות',
        icon: '👗'
      }
    }),
    prisma.productCategory.upsert({
      where: { name: 'נעליים' },
      update: {},
      create: {
        name: 'נעליים',
        icon: '👟'
      }
    }),
    prisma.productCategory.upsert({
      where: { name: 'אקססוריז' },
      update: {},
      create: {
        name: 'אקססוריז',
        icon: '👜'
      }
    }),
    prisma.productCategory.upsert({
      where: { name: 'מעילים' },
      update: {},
      create: {
        name: 'מעילים',
        icon: '🧥'
      }
    })
  ])

  // Create demo admin user
  console.log('👤 Creating demo admin user...')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@getclose.co.il' },
    update: {},
    create: {
      email: 'admin@getclose.co.il',
      password: hashedPassword,
      name: 'Admin GetClose',
      phone: '050-1234567',
      userType: 'ADMIN'
    }
  })

  // Create demo store owner
  console.log('🏪 Creating demo store owner...')
  const storeOwnerPassword = await bcrypt.hash('store123', 10)
  
  const storeOwner = await prisma.user.upsert({
    where: { email: 'store@example.com' },
    update: {},
    create: {
      email: 'store@example.com',
      password: storeOwnerPassword,
      name: 'בעל חנות דמו',
      phone: '052-1234567',
      userType: 'STORE_OWNER'
    }
  })

  // Create demo customer
  console.log('🛍️ Creating demo customer...')
  const customerPassword = await bcrypt.hash('customer123', 10)
  
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      name: 'לקוח דמו',
      phone: '053-1234567',
      userType: 'CUSTOMER'
    }
  })

  // Create address for store owner
  console.log('📍 Creating addresses...')
  const storeAddress = await prisma.address.create({
    data: {
      label: 'כתובת החנות הראשית',
      street: 'דיזנגוף 123',
      city: 'תל אביב',
      postalCode: '6473424',
      latitude: 32.0853,
      longitude: 34.7818,
      isDefault: true
    }
  })

  // Create demo store
  console.log('🏬 Creating demo store...')
  const demoStore = await prisma.store.create({
    data: {
      name: 'חנות הדמו',
      description: 'חנות דמו לבדיקת המערכת - מוצרי אופנה איכותיים',
      ownerId: storeOwner.id,
      categoryId: storeCategories[0].id, // אופנה
      phone: '03-1234567',
      email: 'info@demo-store.co.il',
      website: 'https://demo-store.co.il',
      rating: 4.5,
      reviewCount: 123,
      addresses: {
        connect: { id: storeAddress.id }
      }
    }
  })

  // Create store hours
  console.log('🕐 Creating store hours...')
  const storeHours = [
    { dayOfWeek: 0, openTime: '10:00', closeTime: '22:00', isClosed: false }, // Sunday
    { dayOfWeek: 1, openTime: '10:00', closeTime: '22:00', isClosed: false }, // Monday
    { dayOfWeek: 2, openTime: '10:00', closeTime: '22:00', isClosed: false }, // Tuesday
    { dayOfWeek: 3, openTime: '10:00', closeTime: '22:00', isClosed: false }, // Wednesday
    { dayOfWeek: 4, openTime: '10:00', closeTime: '22:00', isClosed: false }, // Thursday
    { dayOfWeek: 5, openTime: '09:00', closeTime: '15:00', isClosed: false }, // Friday
    { dayOfWeek: 6, openTime: '20:00', closeTime: '23:00', isClosed: false }, // Saturday
  ]

  for (const hours of storeHours) {
    await prisma.storeHours.create({
      data: {
        ...hours,
        storeId: demoStore.id
      }
    })
  }

  // Create demo products
  console.log('🛍️ Creating demo products...')
  const demoProducts = [
    {
      name: 'חולצת טי שירט בסיסית',
      description: 'חולצת טי שירט נוחה ואיכותית מכותנה 100%',
      price: 89,
      originalPrice: 120,
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop',
        'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&h=600&fit=crop'
      ],
      brand: 'דמו ברנד',
      tags: ['כותנה', 'בסיסי', 'נוח'],
      stockQuantity: 25,
      categoryId: productCategories[0].id, // חולצות
      storeId: demoStore.id,
      isOnSale: true
    },
    {
      name: 'ג\'ינס סקיני כחול',
      description: 'ג\'ינס איכותי בגזרת סקיני מבד דנים איכותי',
      price: 199,
      originalPrice: 299,
      images: [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=600&fit=crop'
      ],
      brand: 'דמו ג\'ינס',
      tags: ['דנים', 'סקיני', 'קלאסי'],
      stockQuantity: 15,
      categoryId: productCategories[1].id, // מכנסיים
      storeId: demoStore.id,
      isOnSale: true
    },
    {
      name: 'נעלי ספורט לבנות',
      description: 'נעלי ספורט נוחות לשימוש יומיומי',
      price: 299,
      originalPrice: 399,
      images: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=600&fit=crop'
      ],
      brand: 'ספורט פלוס',
      tags: ['ספורט', 'נוח', 'יומיומי'],
      stockQuantity: 30,
      categoryId: productCategories[3].id, // נעליים
      storeId: demoStore.id,
      isOnSale: false
    }
  ]

  for (const productData of demoProducts) {
    const product = await prisma.product.create({
      data: productData
    })

    // Add sizes for each product
    if (productData.categoryId === productCategories[0].id || productData.categoryId === productCategories[1].id) {
      // Clothing sizes
      const sizes = ['S', 'M', 'L', 'XL']
      for (const size of sizes) {
        await prisma.productSize.create({
          data: {
            productId: product.id,
            name: size,
            type: 'CLOTHING',
            isAvailable: true
          }
        })
      }
    } else if (productData.categoryId === productCategories[3].id) {
      // Shoe sizes
      const sizes = ['40', '41', '42', '43', '44']
      for (const size of sizes) {
        await prisma.productSize.create({
          data: {
            productId: product.id,
            name: size,
            type: 'SHOES',
            isAvailable: true
          }
        })
      }
    }

    // Add colors
    const colors = [
      { name: 'שחור', hexCode: '#000000' },
      { name: 'לבן', hexCode: '#FFFFFF' },
      { name: 'כחול', hexCode: '#0066CC' }
    ]

    for (const color of colors) {
      await prisma.productColor.create({
        data: {
          productId: product.id,
          name: color.name,
          hexCode: color.hexCode,
          isAvailable: true
        }
      })
    }
  }

  console.log('✅ Database seeding completed successfully!')
  console.log('\n📊 Created:')
  console.log(`- ${storeCategories.length} store categories`)
  console.log(`- ${productCategories.length} product categories`)
  console.log('- 3 demo users (admin, store owner, customer)')
  console.log('- 1 demo store with hours')
  console.log(`- ${demoProducts.length} demo products with sizes and colors`)
  console.log('\n🔑 Demo login credentials:')
  console.log('Admin: admin@getclose.co.il / admin123')
  console.log('Store Owner: store@example.com / store123')
  console.log('Customer: customer@example.com / customer123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 