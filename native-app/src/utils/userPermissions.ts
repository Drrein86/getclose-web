import { Ionicons } from '@expo/vector-icons';
import { UserType, MenuItem, NavItem } from '../types';

// הגדרת תפריטי ניווט תחתון לפי סוג משתמש
export const getBottomNavItems = (userType: UserType): NavItem[] => {
  const allItems: NavItem[] = [
    {
      path: "/home",
      label: "בית",
      icon: "home-outline",
      activeIcon: "home",
      gradient: "from-blue-500 to-purple-600",
      glow: "shadow-blue-500/25",
      allowedFor: ["customer", "store", "secondhand", "hybrid"],
    },
    {
      path: "/search",
      label: "חיפוש",
      icon: "search-outline",
      activeIcon: "search",
      gradient: "from-emerald-500 to-teal-600",
      glow: "shadow-emerald-500/25",
      allowedFor: ["customer", "hybrid"],
    },
    {
      path: "/stores",
      label: "חנויות",
      icon: "storefront-outline",
      activeIcon: "storefront",
      gradient: "from-orange-500 to-red-600",
      glow: "shadow-orange-500/25",
      allowedFor: ["customer", "hybrid"],
    },
    {
      path: "/my-store",
      label: "החנות שלי",
      icon: "storefront-outline",
      activeIcon: "storefront",
      gradient: "from-purple-500 to-pink-600",
      glow: "shadow-purple-500/25",
      allowedFor: ["store", "hybrid"],
    },
    {
      path: "/admin",
      label: "ניהול",
      icon: "analytics-outline",
      activeIcon: "analytics",
      gradient: "from-gray-600 to-gray-800",
      glow: "shadow-gray-500/25",
      allowedFor: ["store", "secondhand", "hybrid"],
    },
    {
      path: "/favorites",
      label: "מועדפים",
      icon: "heart-outline",
      activeIcon: "heart",
      gradient: "from-pink-500 to-rose-600",
      glow: "shadow-pink-500/25",
      allowedFor: ["customer", "hybrid"],
    },
    {
      path: "/cart",
      label: "עגלה",
      icon: "bag-outline",
      activeIcon: "bag",
      gradient: "from-indigo-500 to-blue-600",
      glow: "shadow-indigo-500/25",
      allowedFor: ["customer", "hybrid"],
      badge: 3,
    },
  ];

  return allItems.filter(item => 
    item.allowedFor.includes(userType) || userType === ""
  );
};

// הגדרת תפריטי צד לפי סוג משתמש
export const getSideMenuItems = (userType: UserType): MenuItem[] => {
  const commonItems: MenuItem[] = [
    { icon: "home-outline", label: "דף הבית", path: "/home" },
    { icon: "person-outline", label: "פרופיל אישי", path: "/profile" },
    { icon: "notifications-outline", label: "התראות", path: "/notifications" },
    { icon: "chatbubble-outline", label: "צ'אט", path: "/chat" },
    { icon: "settings-outline", label: "הגדרות", path: "/settings" },
  ];

  const customerItems: MenuItem[] = [
    ...commonItems,
    { icon: "bag-outline", label: "ההזמנות שלי", path: "/orders", description: "מעקב אחר הזמנות" },
    { icon: "heart-outline", label: "המועדפים שלי", path: "/favorites", description: "פריטים שאהבתי" },
    { icon: "storefront-outline", label: "חנויות שאני עוקב", path: "/stores", description: "החנויות המועדפות" },
  ];

  const storeOwnerItems: MenuItem[] = [
    { icon: "home-outline", label: "דף הבית", path: "/home" },
    { icon: "person-outline", label: "פרופיל החנות", path: "/profile" },
    { icon: "storefront-outline", label: "ניהול החנות", path: "/my-store", description: "פרטי החנות" },
    { icon: "shirt-outline", label: "ניהול מוצרים", path: "/admin", description: "הוספה ועריכה", badge: "חדש" },
    { icon: "clipboard-outline", label: "הזמנות נכנסות", path: "/orders", description: "הזמנות לקוחות" },
    { icon: "stats-chart-outline", label: "סטטיסטיקות מכירות", path: "/analytics", description: "דוחות ונתונים" },
    { icon: "notifications-outline", label: "התראות", path: "/notifications" },
    { icon: "chatbubble-outline", label: "צ'אט עם לקוחות", path: "/chat", description: "תמיכה ושירות" },
    { icon: "settings-outline", label: "הגדרות החנות", path: "/settings" },
  ];

  const secondhandItems: MenuItem[] = [
    { icon: "home-outline", label: "דף הבית", path: "/home" },
    { icon: "person-outline", label: "פרופיל אישי", path: "/profile" },
    { icon: "refresh-outline", label: "ניהול חנות יד שנייה", path: "/secondhand", description: "המוצרים שלי" },
    { icon: "add-circle-outline", label: "הוספת מוצר למכירה", path: "/secondhand/sell", description: "מכירת פריט", isNew: true },
    { icon: "clipboard-outline", label: "המכירות שלי", path: "/orders", description: "פריטים שמכרתי" },
    { icon: "stats-chart-outline", label: "סטטיסטיקות מכירות", path: "/analytics", description: "רווחים ונתונים" },
    { icon: "notifications-outline", label: "התראות", path: "/notifications" },
    { icon: "chatbubble-outline", label: "צ'אט", path: "/chat" },
    { icon: "settings-outline", label: "הגדרות", path: "/settings" },
  ];

  const hybridItems: MenuItem[] = [
    ...commonItems,
    // פריטים של לקוח
    { icon: "bag-outline", label: "ההזמנות שלי", path: "/orders", description: "הזמנות שביצעתי" },
    { icon: "heart-outline", label: "המועדפים שלי", path: "/favorites", description: "פריטים שאהבתי" },
    // פריטים של מוכר יד שנייה
    { icon: "refresh-outline", label: "ניהול חנות יד שנייה", path: "/secondhand", description: "המוצרים שלי למכירה" },
    { icon: "add-circle-outline", label: "הוספת מוצר למכירה", path: "/secondhand/sell", description: "מכירת פריט חדש", isNew: true },
    { icon: "stats-chart-outline", label: "סטטיסטיקות מכירות", path: "/analytics", description: "רווחים ונתונים" },
  ];

  switch (userType) {
    case "customer":
      return customerItems;
    case "store":
      return storeOwnerItems;
    case "secondhand":
      return secondhandItems;
    case "hybrid":
      return hybridItems;
    default:
      return commonItems;
  }
};

// פונקציה לבדיקת הרשאות
export const hasPermission = (userType: UserType, requiredPermission: UserType[]): boolean => {
  return requiredPermission.includes(userType) || userType === "";
};

// פונקציה לקבלת מידע על המשתמש
export const getUserTypeInfo = (userType: UserType) => {
  switch (userType) {
    case "store":
      return {
        label: "בעל חנות",
        description: "ניהול חנות מקצועית",
        color: "from-gray-900 to-black",
        textColor: "text-white",
        stats: { orders: 156, products: 89, revenue: "₪12,450" },
        features: ["ניהול מוצרים", "הזמנות נכנסות", "סטטיסטיקות מכירות"],
      };
    case "secondhand":
      return {
        label: "מוכר יד שנייה",
        description: "מכירת פריטים יד שנייה",
        color: "from-gray-700 to-gray-900",
        textColor: "text-white",
        stats: { sold: 23, listed: 12, earned: "₪1,890" },
        features: ["מכירת פריטים", "ניהול מלאי", "מעקב רווחים"],
      };
    case "customer":
      return {
        label: "לקוח",
        description: "קניות ומעקב הזמנות",
        color: "from-gray-800 to-black",
        textColor: "text-white",
        stats: { orders: 8, favorites: 24, saved: "₪340" },
        features: ["רכישת מוצרים", "מעקב הזמנות", "רשימת מועדפים"],
      };
    case "hybrid":
      return {
        label: "לקוח ומוכר",
        description: "לקוח וגם מוכר יד שנייה",
        color: "from-purple-600 to-blue-800",
        textColor: "text-white",
        stats: { orders: 8, sold: 5, favorites: 18 },
        features: ["קניות", "מכירות יד שנייה", "ניהול כפול"],
      };
    default:
      return {
        label: "אורח",
        description: "גישה מוגבלת",
        color: "from-gray-600 to-gray-800",
        textColor: "text-white",
        stats: { visits: 1, items: 0, time: "חדש" },
        features: ["צפייה בבסיסית"],
      };
  }
};

// פונקציה לזיהוי משתמש היברידי
export const getUserType = async (): Promise<UserType> => {
  try {
    const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
    const userType = await AsyncStorage.getItem("userType") || "";
    const hasSecondhandStore = await AsyncStorage.getItem("hasSecondhandStore") === "true";
    
    // אם הוא לקוח וגם יש לו חנות יד שנייה
    if (userType === "customer" && hasSecondhandStore) {
      return "hybrid";
    }
    
    return userType as UserType;
  } catch (error) {
    return "";
  }
};

// פונקציה לעדכון סטטוס חנות יד שנייה
export const setSecondhandStoreStatus = async (hasStore: boolean) => {
  try {
    const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
    await AsyncStorage.setItem("hasSecondhandStore", hasStore.toString());
  } catch (error) {
    console.error("Error setting secondhand store status:", error);
  }
};

// פונקציה לשמירת סוג משתמש
export const setUserType = async (userType: UserType) => {
  try {
    const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
    await AsyncStorage.setItem("userType", userType);
  } catch (error) {
    console.error("Error setting user type:", error);
  }
}; 