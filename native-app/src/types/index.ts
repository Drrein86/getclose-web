// סוגי נתונים בסיסיים של האפליקציה
export type UserType = "customer" | "store" | "secondhand" | "hybrid" | "";

export interface User {
  id: string;
  name: string;
  email: string;
  userType: UserType;
  avatar?: string;
  phone?: string;
  address?: string;
}

export interface Store {
  id: string;
  name: string;
  description: string;
  image: string;
  logo: string;
  rating: number;
  reviewCount: number;
  category: string;
  location: string;
  productsCount: number;
  followers: number;
  isFollowing: boolean;
  tags: string[];
  gradient: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  category: string;
  images: string[];
  colors: string[];
  sizes: string[];
  isFavorite: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  store: Store;
  storeId: string;
  stock: number;
  sales?: number;
  isActive?: boolean;
  addedToFavorites?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  productCount: number;
}

export interface MenuItem {
  path: string;
  label: string;
  icon: string;
  description?: string;
  badge?: string;
  isNew?: boolean;
}

export interface NavItem {
  path: string;
  label: string;
  icon: any;
  activeIcon: any;
  gradient: string;
  glow: string;
  allowedFor: UserType[];
  badge?: number;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeGradients {
  primary: string;
  secondary: string;
  accent: string;
  hero: string;
}

export interface ThemeSettings {
  currentTheme: string;
  customColors?: {
    primary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    text?: string;
  };
  gradients?: string[];
  typography?: {
    fontFamily?: string;
    fontSize?: number;
  };
  spacing?: {
    baseUnit?: number;
  };
  animations?: {
    duration?: number;
    easing?: string;
  };
  effects?: {
    shadows?: boolean;
    blur?: boolean;
    glow?: boolean;
  };
}

export interface Order {
  id: string;
  date: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  trackingNumber?: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

export interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  avatar: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
  addedAt: string;
}

export interface Notification {
  id: string;
  type: "order" | "promotion" | "system" | "message";
  title: string;
  message: string;
  date: string;
  read: boolean;
  image?: string;
  actionUrl?: string;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  isOnSale?: boolean;
  isNew?: boolean;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating';
}

export interface UserStats {
  orders?: number;
  products?: number;
  revenue?: number;
  favorites?: number;
  sold?: number;
  listed?: number;
  earned?: number;
  saved?: number;
  visits?: number;
  items?: number;
  time?: string;
}

export interface UserInfo {
  label: string;
  stats: UserStats;
} 