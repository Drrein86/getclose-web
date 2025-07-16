import { 
  Store, Product, StoreCategory, OrderStatus
} from '@/types';

// קטגוריות חנויות
export const storeCategories: StoreCategory[] = [
  { id: '1', name: 'אופנה', icon: '👗', color: '#FF6B6B' },
  { id: '2', name: 'נעליים', icon: '👟', color: '#4ECDC4' },
  { id: '3', name: 'בריאות ויופי', icon: '💄', color: '#45B7D1' },
  { id: '4', name: 'מכולת', icon: '🛒', color: '#96CEB4' },
  { id: '5', name: 'אלקטרוניקה', icon: '📱', color: '#FFEAA7' },
  { id: '6', name: 'בית וגן', icon: '🏠', color: '#DDA0DD' },
  { id: '7', name: 'ספורט', icon: '⚽', color: '#FFB347' },
];

// חנויות מדומות
export const mockStores: Store[] = [
  {
    id: '1',
    name: 'זארא',
    description: 'אופנת נשים וגברים מעוצבת במחירים משתלמים',
    category: storeCategories[0],
    rating: 4.3,
    reviewCount: 245,
    images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&auto=format'],
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&auto=format',
    coordinates: { lat: 32.0853, lng: 34.7818 },
    address: {
      id: '1',
      label: 'חנות ראשית',
      street: 'דיזנגוף 123',
      city: 'תל אביב',
      postalCode: '6473424',
      coordinates: { lat: 32.0853, lng: 34.7818 },
      isDefault: true
    },
    contact: {
      phone: '03-1234567',
      email: 'info@zara.co.il',
      website: 'https://zara.co.il'
    },
    hours: {
      sunday: { open: '10:00', close: '22:00', isClosed: false },
      monday: { open: '10:00', close: '22:00', isClosed: false },
      tuesday: { open: '10:00', close: '22:00', isClosed: false },
      wednesday: { open: '10:00', close: '22:00', isClosed: false },
      thursday: { open: '10:00', close: '22:00', isClosed: false },
      friday: { open: '09:00', close: '15:00', isClosed: false },
      saturday: { open: '20:00', close: '23:00', isClosed: false },
    },
    deliveryInfo: {
      minOrderAmount: 150,
      deliveryFee: 25,
      freeDeliveryThreshold: 300,
      estimatedTime: { min: 30, max: 45 },
      deliveryRadius: 15
    },
    isOpen: true,
    products: [],
    promotions: [],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Nike',
    description: 'נעלי ספורט ובגדי ספורט איכותיים',
    category: storeCategories[1],
    rating: 4.5,
    reviewCount: 189,
    images: ['https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=600&fit=crop&auto=format'],
    logo: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200&h=200&fit=crop&auto=format',
    coordinates: { lat: 32.0879, lng: 34.7831 },
    address: {
      id: '2',
      label: 'חנות ראשית',
      street: 'אבן גבירול 85',
      city: 'תל אביב',
      postalCode: '6473425',
      coordinates: { lat: 32.0879, lng: 34.7831 },
      isDefault: true
    },
    contact: {
      phone: '03-2345678',
      email: 'info@nike.co.il',
      website: 'https://nike.co.il'
    },
    hours: {
      sunday: { open: '10:00', close: '21:00', isClosed: false },
      monday: { open: '10:00', close: '21:00', isClosed: false },
      tuesday: { open: '10:00', close: '21:00', isClosed: false },
      wednesday: { open: '10:00', close: '21:00', isClosed: false },
      thursday: { open: '10:00', close: '21:00', isClosed: false },
      friday: { open: '09:00', close: '14:00', isClosed: false },
      saturday: { open: '20:00', close: '23:00', isClosed: false },
    },
    deliveryInfo: {
      minOrderAmount: 200,
      deliveryFee: 30,
      freeDeliveryThreshold: 400,
      estimatedTime: { min: 25, max: 40 },
      deliveryRadius: 20
    },
    isOpen: true,
    products: [],
    promotions: [],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date()
  }
];

// פונקציות עזר
export const getStoreById = (id: string): Store | undefined => {
  return mockStores.find(store => store.id === id);
};

export const formatPrice = (price: number): string => {
  return `₪${price.toLocaleString('he-IL')}`;
};

export const getOrderStatusText = (status: OrderStatus): string => {
  const statusTexts = {
    [OrderStatus.PENDING]: 'ממתין לאישור',
    [OrderStatus.CONFIRMED]: 'אושר',
    [OrderStatus.PREPARING]: 'בהכנה',
    [OrderStatus.READY_FOR_PICKUP]: 'מוכן לאיסוף',
    [OrderStatus.OUT_FOR_DELIVERY]: 'יצא למשלוח',
    [OrderStatus.DELIVERED]: 'נמסר',
    [OrderStatus.CANCELLED]: 'בוטל',
    [OrderStatus.REFUNDED]: 'הוחזר'
  };
  return statusTexts[status];
};

// Second Hand Data
export const secondHandItems = [
  {
    id: '1',
    title: 'חולצת זארה כמו חדשה',
    description: 'חולצה יפהפייה בצבע כחול, נקנתה לפני חודש ולא הייתה הזדמנות ללבוש. מידה M.',
    price: 45,
    originalPrice: 89,
    condition: 'כמו חדש' as const,
    category: 'חולצות',
    size: 'M',
    brand: 'זארה',
    seller: {
      id: '1',
      name: 'שרה כהן',
      rating: 4.8,
      totalSales: 23,
      avatar: '👩',
      location: 'תל אביב',
      joinDate: new Date('2023-05-15'),
      verified: true,
      responseTime: 'תוך שעה'
    },
    images: ['👕', '📸', '📸'],
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    views: 45,
    likes: 8,
    isLiked: false,
    tags: ['זארה', 'כחול', 'כותנה'],
    negotiable: true,
    status: 'active' as const,
    location: 'תל אביב',
    meetingOptions: ['פגישה אישית', 'משלוח']
  },
  {
    id: '2',
    title: 'נעלי נייקי ספורט',
    description: 'נעלי ריצה מעולות, נלבשו מעט. מידה 42. מתאימות לספורט ולהליכה יומיומית.',
    price: 180,
    originalPrice: 350,
    condition: 'מצב טוב' as const,
    category: 'נעליים',
    size: '42',
    brand: 'נייקי',
    seller: {
      id: '2',
      name: 'דוד לוי',
      rating: 4.9,
      totalSales: 67,
      avatar: '👨',
      location: 'חיפה',
      joinDate: new Date('2023-03-20'),
      verified: true,
      responseTime: 'תוך 3 שעות'
    },
    images: ['👟', '📸', '📸'],
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    views: 89,
    likes: 15,
    isLiked: true,
    tags: ['נייקי', 'ספורט', 'ריצה'],
    negotiable: false,
    status: 'active' as const,
    location: 'חיפה',
    meetingOptions: ['פגישה אישית', 'איסוף עצמי']
  }
];

export const getSecondHandItemById = (id: string) => {
  return secondHandItems.find(item => item.id === id);
};