import { prisma } from './prisma'
import { UserType, OrderStatus, SecondhandCondition, SecondhandStatus } from '@prisma/client'

// User operations
export async function createUser(data: {
  email: string
  password: string
  name: string
  phone?: string
  userType?: UserType
}) {
  return await prisma.user.create({
    data,
  })
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      addresses: true,
      ownedStores: true,
    }
  })
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      addresses: true,
      ownedStores: {
        include: {
          category: true,
          addresses: true,
        }
      },
    }
  })
}

// Store operations
export async function createStore(data: {
  name: string
  description?: string
  ownerId: string
  categoryId: string
  phone?: string
  email?: string
  website?: string
}) {
  return await prisma.store.create({
    data,
    include: {
      owner: true,
      category: true,
      addresses: true,
    }
  })
}

export async function getStores(options?: {
  category?: string
  search?: string
  limit?: number
  offset?: number
}) {
  const where: any = {
    isActive: true,
  }

  if (options?.category && options.category !== 'הכל') {
    where.category = {
      name: options.category
    }
  }

  if (options?.search) {
    where.OR = [
      { name: { contains: options.search, mode: 'insensitive' } },
      { description: { contains: options.search, mode: 'insensitive' } },
    ]
  }

  return await prisma.store.findMany({
    where,
    include: {
      category: true,
      addresses: true,
      owner: true,
    },
    take: options?.limit || 20,
    skip: options?.offset || 0,
    orderBy: {
      rating: 'desc'
    }
  })
}

export async function getStoreById(id: string) {
  return await prisma.store.findUnique({
    where: { id },
    include: {
      category: true,
      addresses: true,
      owner: true,
      storeHours: true,
      products: {
        where: { isActive: true },
        include: {
          category: true,
          sizes: true,
          colors: true,
        }
      },
      reviews: {
        include: {
          user: true,
          storeResponse: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })
}

// Product operations
export async function createProduct(data: {
  name: string
  description?: string
  price: number
  originalPrice?: number
  images: string[]
  brand?: string
  tags: string[]
  stockQuantity: number
  storeId: string
  categoryId: string
}) {
  return await prisma.product.create({
    data,
    include: {
      store: true,
      category: true,
    }
  })
}

export async function getProducts(options?: {
  storeId?: string
  category?: string
  search?: string
  limit?: number
  offset?: number
  onSale?: boolean
}) {
  const where: any = {
    isActive: true,
    inStock: true,
  }

  if (options?.storeId) {
    where.storeId = options.storeId
  }

  if (options?.category && options.category !== 'הכל') {
    where.category = {
      name: options.category
    }
  }

  if (options?.search) {
    where.OR = [
      { name: { contains: options.search, mode: 'insensitive' } },
      { description: { contains: options.search, mode: 'insensitive' } },
      { brand: { contains: options.search, mode: 'insensitive' } },
    ]
  }

  if (options?.onSale) {
    where.isOnSale = true
  }

  return await prisma.product.findMany({
    where,
    include: {
      store: {
        include: {
          category: true,
        }
      },
      category: true,
      sizes: true,
      colors: true,
    },
    take: options?.limit || 20,
    skip: options?.offset || 0,
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      store: {
        include: {
          category: true,
          addresses: true,
          storeHours: true,
        }
      },
      category: true,
      sizes: true,
      colors: true,
      reviews: {
        include: {
          user: true,
          storeResponse: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })
}

// Category operations
export async function getStoreCategories() {
  return await prisma.storeCategory.findMany({
    orderBy: {
      name: 'asc'
    }
  })
}

export async function getProductCategories() {
  return await prisma.productCategory.findMany({
    orderBy: {
      name: 'asc'
    }
  })
}

export async function createStoreCategory(data: {
  name: string
  icon: string
  color: string
}) {
  return await prisma.storeCategory.create({
    data
  })
}

export async function createProductCategory(data: {
  name: string
  icon: string
}) {
  return await prisma.productCategory.create({
    data
  })
}

// Order operations
export async function createOrder(data: {
  userId: string
  storeId: string
  deliveryAddressId: string
  items: Array<{
    productId: string
    quantity: number
    price: number
    selectedSize?: string
    selectedColor?: string
  }>
  totalAmount: number
  deliveryFee?: number
  discountAmount?: number
  notes?: string
}) {
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  return await prisma.order.create({
    data: {
      orderNumber,
      userId: data.userId,
      storeId: data.storeId,
      deliveryAddressId: data.deliveryAddressId,
      totalAmount: data.totalAmount,
      deliveryFee: data.deliveryFee || 0,
      discountAmount: data.discountAmount || 0,
      notes: data.notes,
      items: {
        create: data.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.price * item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        }))
      }
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              store: true,
              category: true,
            }
          }
        }
      },
      store: true,
      deliveryAddress: true,
    }
  })
}

export async function getUserOrders(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      store: {
        include: {
          category: true,
        }
      },
      items: {
        include: {
          product: {
            include: {
              category: true,
            }
          }
        }
      },
      deliveryAddress: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function getStoreOrders(storeId: string) {
  return await prisma.order.findMany({
    where: { storeId },
    include: {
      user: true,
      items: {
        include: {
          product: {
            include: {
              category: true,
            }
          }
        }
      },
      deliveryAddress: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  return await prisma.order.update({
    where: { id: orderId },
    data: { 
      status,
      deliveredAt: status === OrderStatus.DELIVERED ? new Date() : undefined
    },
    include: {
      user: true,
      store: true,
      items: {
        include: {
          product: true
        }
      }
    }
  })
}

// Cart operations
export async function addToCart(data: {
  userId: string
  productId: string
  quantity: number
  selectedSize?: string
  selectedColor?: string
}) {
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId_selectedSize_selectedColor: {
        userId: data.userId,
        productId: data.productId,
        selectedSize: data.selectedSize || '',
        selectedColor: data.selectedColor || '',
      }
    }
  })

  if (existingItem) {
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + data.quantity
      },
      include: {
        product: {
          include: {
            store: true,
            category: true,
          }
        }
      }
    })
  }

  return await prisma.cartItem.create({
    data,
    include: {
      product: {
        include: {
          store: true,
          category: true,
        }
      }
    }
  })
}

export async function getUserCart(userId: string) {
  return await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          store: true,
          category: true,
          sizes: true,
          colors: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function removeFromCart(cartItemId: string) {
  return await prisma.cartItem.delete({
    where: { id: cartItemId }
  })
}

export async function clearCart(userId: string) {
  return await prisma.cartItem.deleteMany({
    where: { userId }
  })
}

// Review operations
export async function createReview(data: {
  userId: string
  productId?: string
  storeId?: string
  rating: number
  title?: string
  comment?: string
  images?: string[]
  isVerifiedPurchase?: boolean
}) {
  return await prisma.review.create({
    data,
    include: {
      user: true,
      product: true,
      store: true,
    }
  })
}

export async function getProductReviews(productId: string) {
  return await prisma.review.findMany({
    where: { productId },
    include: {
      user: true,
      storeResponse: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function getStoreReviews(storeId: string) {
  return await prisma.review.findMany({
    where: { storeId },
    include: {
      user: true,
      storeResponse: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

// Favorite operations
export async function addToFavorites(userId: string, productId: string) {
  return await prisma.favoriteProduct.create({
    data: {
      userId,
      productId
    },
    include: {
      product: {
        include: {
          store: true,
          category: true,
        }
      }
    }
  })
}

export async function removeFromFavorites(userId: string, productId: string) {
  return await prisma.favoriteProduct.delete({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  })
}

export async function getUserFavorites(userId: string) {
  return await prisma.favoriteProduct.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          store: true,
          category: true,
          sizes: true,
          colors: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

// Secondhand operations
export async function createSecondhandProduct(data: {
  title: string
  description?: string
  price: number
  condition: SecondhandCondition
  category: string
  images: string[]
  sellerId: string
}) {
  return await prisma.secondhandProduct.create({
    data,
    include: {
      seller: true
    }
  })
}

export async function getSecondhandProducts(options?: {
  sellerId?: string
  category?: string
  condition?: SecondhandCondition
  search?: string
  limit?: number
  offset?: number
}) {
  const where: any = {
    isActive: true,
    status: SecondhandStatus.ACTIVE,
  }

  if (options?.sellerId) {
    where.sellerId = options.sellerId
  }

  if (options?.category && options.category !== 'הכל') {
    where.category = options.category
  }

  if (options?.condition) {
    where.condition = options.condition
  }

  if (options?.search) {
    where.OR = [
      { title: { contains: options.search, mode: 'insensitive' } },
      { description: { contains: options.search, mode: 'insensitive' } },
    ]
  }

  return await prisma.secondhandProduct.findMany({
    where,
    include: {
      seller: true
    },
    take: options?.limit || 20,
    skip: options?.offset || 0,
    orderBy: {
      createdAt: 'desc'
    }
  })
}

// Address operations
export async function createAddress(data: {
  label: string
  street: string
  city: string
  postalCode?: string
  latitude?: number
  longitude?: number
  userId?: string
  storeId?: string
  isDefault?: boolean
}) {
  return await prisma.address.create({
    data
  })
}

export async function getUserAddresses(userId: string) {
  return await prisma.address.findMany({
    where: { userId },
    orderBy: {
      isDefault: 'desc'
    }
  })
}

// Utility functions
export function formatPrice(price: number): string {
  return `₪${price.toFixed(0)}`
}

export function getOrderStatusText(status: OrderStatus): string {
  const statusMap: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'ממתין לאישור',
    [OrderStatus.CONFIRMED]: 'אושר',
    [OrderStatus.PREPARING]: 'בהכנה',
    [OrderStatus.READY_FOR_DELIVERY]: 'מוכן למשלוח',
    [OrderStatus.OUT_FOR_DELIVERY]: 'יצא למשלוח',
    [OrderStatus.DELIVERED]: 'נמסר',
    [OrderStatus.CANCELLED]: 'בוטל',
  }
  return statusMap[status] || 'לא ידוע'
} 