// מערכת משתמשים
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  label: string; // בית, עבודה, אחר
  street: string;
  city: string;
  postalCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isDefault: boolean;
}

export interface UserPreferences {
  favoriteCategories: string[];
  maxDeliveryDistance: number; // בק"מ
  notifications: {
    orders: boolean;
    promotions: boolean;
    newStores: boolean;
  };
  language: 'he' | 'en' | 'ar';
}

// מערכת חנויות
export interface Store {
  id: string;
  name: string;
  description: string;
  category: StoreCategory;
  rating: number;
  reviewCount: number;
  images: string[];
  logo?: string; // תמונת לוגו של החנות
  coordinates: {
    lat: number;
    lng: number;
  };
  address: Address;
  contact: {
    phone: string;
    email?: string;
    website?: string;
  };
  hours: StoreHours;
  deliveryInfo: DeliveryInfo;
  isOpen: boolean;
  products: Product[];
  promotions: Promotion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface StoreHours {
  [key: string]: {
    open: string;
    close: string;
    isClosed: boolean;
  };
}

export interface DeliveryInfo {
  minOrderAmount: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  estimatedTime: {
    min: number;
    max: number;
  };
  deliveryRadius: number; // בק"מ
}

// מערכת מוצרים
export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // למבצעים
  images: string[];
  category: ProductCategory;
  subcategory?: string;
  brand?: string;
  sizes: Size[];
  colors: Color[];
  tags: string[];
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  isOnSale: boolean;
  saleEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategory {
  id: string;
  name: string;
  parentId?: string;
  icon: string;
}

export interface Size {
  id: string;
  name: string; // S, M, L, XL או 36, 37, 38
  type: 'clothing' | 'shoes';
  isAvailable: boolean;
}

export interface Color {
  id: string;
  name: string;
  hexCode: string;
  isAvailable: boolean;
}

// מערכת עגלת קניות
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: Size;
  selectedColor?: Color;
  price: number; // מחיר בזמן הוספה לעגלה
  addedAt: Date;
}

export interface Cart {
  id: string;
  userId?: string; // null למשתמש אנונימי
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  storeId: string; // עגלה לחנות אחת בלבד
  createdAt: Date;
  updatedAt: Date;
}

// מערכת הזמנות
export interface Order {
  id: string;
  userId: string;
  storeId: string;
  store: Store;
  items: OrderItem[];
  status: OrderStatus;
  statusHistory: OrderStatusHistory[];
  totalAmount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  paymentMethod: PaymentMethod;
  deliveryAddress: Address;
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: Size;
  selectedColor?: Color;
  price: number;
  totalPrice: number;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY_FOR_PICKUP = 'ready_for_pickup',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
}

export interface PaymentMethod {
  type: 'cash' | 'card' | 'digital_wallet';
  details?: {
    cardLast4?: string;
    walletType?: string;
  };
}

// מערכת מבצעים
export interface Promotion {
  id: string;
  storeId: string;
  title: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'buy_x_get_y';
  value: number;
  minOrderAmount?: number;
  applicableProducts?: string[]; // product IDs
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  code?: string; // קוד קופון
}

// מערכת ביקורות
export interface Review {
  id: string;
  userId: string;
  user: User;
  storeId?: string;
  productId?: string;
  orderId: string;
  rating: number; // 1-5
  comment?: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// מערכת התראות
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any; // מידע נוסף (order ID, product ID וכו')
  isRead: boolean;
  createdAt: Date;
}

export enum NotificationType {
  ORDER_CONFIRMED = 'order_confirmed',
  ORDER_PREPARING = 'order_preparing',
  ORDER_READY = 'order_ready',
  ORDER_DELIVERED = 'order_delivered',
  PROMOTION = 'promotion',
  NEW_STORE = 'new_store',
  PRICE_DROP = 'price_drop',
  BACK_IN_STOCK = 'back_in_stock'
}

// מערכת חיפוש
export interface SearchFilters {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  sizes?: string[];
  colors?: string[];
  brands?: string[];
  rating?: number;
  distance?: number;
  isOnSale?: boolean;
  inStock?: boolean;
}

export interface SearchResult {
  products: Product[];
  stores: Store[];
  totalResults: number;
  filters: SearchFilters;
}

// מערכת מועדפים
export interface Favorite {
  id: string;
  userId: string;
  itemType: 'product' | 'store';
  itemId: string;
  createdAt: Date;
}

// מערכת מפה
export interface MapLocation {
  id: string;
  type: 'store' | 'user';
  coordinates: {
    lat: number;
    lng: number;
  };
  title: string;
  description?: string;
  icon?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Second Hand System Types
export interface SecondHandItem {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  condition: 'כמו חדש' | 'מצב טוב' | 'מצב סביר' | 'נזקים קלים';
  category: string;
  size?: string;
  brand?: string;
  seller: SecondHandSeller;
  images: string[];
  postedDate: Date;
  views: number;
  likes: number;
  isLiked: boolean;
  tags: string[];
  negotiable: boolean;
  status: 'active' | 'sold' | 'draft' | 'pending';
  location: string;
  meetingOptions: string[];
}

export interface SecondHandSeller {
  id: string;
  name: string;
  rating: number;
  totalSales: number;
  avatar: string;
  location: string;
  joinDate: Date;
  verified: boolean;
  responseTime: string; // e.g., "תוך שעה"
}

export interface SecondHandStore {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  items: SecondHandItem[];
  totalSales: number;
  totalViews: number;
  totalLikes: number;
  rating: number;
  createdAt: Date;
  isActive: boolean;
}

// Admin System Types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: Date;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'suspended' | 'pending';
  avatar: string;
  lastLogin?: Date;
  addresses: Address[];
  preferences: UserPreferences;
}

export interface AdminStore {
  id: string;
  name: string;
  owner: string;
  category: string;
  rating: number;
  totalProducts: number;
  totalSales: number;
  revenue: number;
  status: 'active' | 'pending' | 'suspended';
  joinDate: Date;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  businessLicense?: string;
  taxId?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalStores: number;
  activeStores: number;
  totalRevenue: number;
  totalOrders: number;
  secondHandItems: number;
  pendingApprovals: number;
} 