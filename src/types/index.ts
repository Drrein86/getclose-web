import { 
  User as PrismaUser,
  Store as PrismaStore,
  Product as PrismaProduct,
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  Review as PrismaReview,
  CartItem as PrismaCartItem,
  FavoriteProduct as PrismaFavoriteProduct,
  SecondhandProduct as PrismaSecondhandProduct,
  StoreCategory as PrismaStoreCategory,
  ProductCategory as PrismaProductCategory,
  Address as PrismaAddress,
  UserType,
  OrderStatus,
  SecondhandCondition,
  SecondhandStatus,
  SizeType
} from '@prisma/client'

// Extended types with relations
export type User = PrismaUser & {
  addresses?: Address[]
  ownedStores?: Store[]
  orders?: Order[]
  reviews?: Review[]
  favorites?: FavoriteProduct[]
  cartItems?: CartItem[]
  secondhandProducts?: SecondhandProduct[]
}

export type Store = PrismaStore & {
  owner?: User
  category?: StoreCategory
  addresses?: Address[]
  storeHours?: StoreHours[]
  products?: Product[]
  orders?: Order[]
  reviews?: Review[]
}

export type Product = PrismaProduct & {
  store?: Store
  category?: ProductCategory
  sizes?: ProductSize[]
  colors?: ProductColor[]
  orderItems?: OrderItem[]
  reviews?: Review[]
  favorites?: FavoriteProduct[]
  cartItems?: CartItem[]
}

export type Order = PrismaOrder & {
  user?: User
  store?: Store
  deliveryAddress?: Address
  items?: OrderItem[]
}

export type OrderItem = PrismaOrderItem & {
  order?: Order
  product?: Product
}

export type Review = PrismaReview & {
  user?: User
  product?: Product
  store?: Store
  storeResponse?: StoreResponse
}

export type CartItem = PrismaCartItem & {
  user?: User
  product?: Product
}

export type FavoriteProduct = PrismaFavoriteProduct & {
  user?: User
  product?: Product
}

export type SecondhandProduct = PrismaSecondhandProduct & {
  seller?: User
}

// Basic types
export type StoreCategory = PrismaStoreCategory
export type ProductCategory = PrismaProductCategory
export type Address = PrismaAddress

// Additional types for UI components
export interface StoreHours {
  id: string
  storeId: string
  dayOfWeek: number
  openTime?: string
  closeTime?: string
  isClosed: boolean
}

export interface ProductSize {
  id: string
  productId: string
  name: string
  type: SizeType
  isAvailable: boolean
}

export interface ProductColor {
  id: string
  productId: string
  name: string
  hexCode: string
  isAvailable: boolean
}

export interface StoreResponse {
  id: string
  reviewId: string
  message: string
  createdAt: Date
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  total?: number
}

// Search and filter types
export interface SearchFilters {
  category?: string
  priceRange?: {
    min: number
    max: number
  }
  sizes?: string[]
  colors?: string[]
  brands?: string[]
  rating?: number
  distance?: number
  isOnSale?: boolean
  inStock?: boolean
}

export interface PaginationOptions {
  limit?: number
  offset?: number
  page?: number
}

// UI specific types
export interface ProductWithVariants extends Product {
  selectedSize?: string
  selectedColor?: string
  quantity?: number
}

export interface CartSummary {
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  itemCount: number
}

export interface OrderSummary {
  id: string
  orderNumber: string
  status: OrderStatus
  totalAmount: number
  itemCount: number
  storeName: string
  estimatedDelivery?: Date
  createdAt: Date
}

export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalCustomers: number
  pendingOrders: number
  completedOrders: number
  averageOrderValue: number
  topSellingProducts: Product[]
}

// Form types
export interface CreateStoreForm {
  name: string
  description?: string
  categoryId: string
  phone?: string
  email?: string
  website?: string
  address: {
    label: string
    street: string
    city: string
    postalCode?: string
    latitude?: number
    longitude?: number
  }
}

export interface CreateProductForm {
  name: string
  description?: string
  price: number
  originalPrice?: number
  images: string[]
  brand?: string
  tags: string[]
  stockQuantity: number
  categoryId: string
  sizes: Array<{
    name: string
    type: SizeType
  }>
  colors: Array<{
    name: string
    hexCode: string
  }>
}

export interface UserRegistrationForm {
  email: string
  password: string
  name: string
  phone?: string
  userType: UserType
}

export interface LoginForm {
  email: string
  password: string
}

// Navigation types
export interface NavItem {
  id: string
  label: string
  icon: string
  href: string
  badge?: string | number
  description?: string
  isActive?: boolean
}

export interface UserTypeInfo {
  label: string
  description: string
  color: string
  features: string[]
}

// Export enums for easier use
export { UserType, OrderStatus, SecondhandCondition, SecondhandStatus, SizeType }

// Legacy types for backward compatibility (to be removed gradually)
export interface Coordinates {
  lat: number
  lng: number
}

export interface UserPreferences {
  favoriteCategories: string[]
  maxDeliveryDistance: number
  notifications: {
    orders: boolean
    promotions: boolean
    newStores: boolean
  }
  language: 'he' | 'en' | 'ar'
}

export interface DeliveryInfo {
  minOrderAmount: number
  deliveryFee: number
  freeDeliveryThreshold: number
  estimatedTime: {
    min: number
    max: number
  }
  deliveryRadius: number
}

export interface ContactInfo {
  phone?: string
  email?: string
  website?: string
} 