import {
  IoHomeOutline,
  IoPersonOutline,
  IoSettingsOutline,
  IoNotificationsOutline,
  IoChatbubbleOutline,
  IoStorefrontOutline,
  IoShirtOutline,
  IoBagOutline,
  IoHeartOutline,
  IoStatsChartOutline,
  IoAnalyticsOutline,
  IoAddCircleOutline,
  IoClipboardOutline,
  IoRefreshOutline,
} from "react-icons/io5";

export type UserType = "customer" | "store" | "secondhand" | "hybrid" | "";

export interface MenuItem {
  icon: any;
  label: string;
  path: string;
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

// הגדרת תפריטי ניווט תחתון לפי סוג משתמש
export const getBottomNavItems = (userType: UserType): NavItem[] => {
  const allItems: NavItem[] = [
    {
      path: "/home",
      label: "בית",
      icon: IoHomeOutline,
      activeIcon: IoHomeOutline,
      gradient: "from-blue-500 to-purple-600",
      glow: "shadow-blue-500/25",
      allowedFor: ["customer", "store", "secondhand", "hybrid"],
    },
    {
      path: "/search",
      label: "חיפוש",
      icon: IoHomeOutline,
      activeIcon: IoHomeOutline,
      gradient: "from-emerald-500 to-teal-600",
      glow: "shadow-emerald-500/25",
      allowedFor: ["customer", "hybrid"],
    },
    {
      path: "/stores",
      label: "חנויות",
      icon: IoStorefrontOutline,
      activeIcon: IoStorefrontOutline,
      gradient: "from-orange-500 to-red-600",
      glow: "shadow-orange-500/25",
      allowedFor: ["customer", "hybrid"],
    },
    {
      path: "/my-store",
      label: "החנות שלי",
      icon: IoStorefrontOutline,
      activeIcon: IoStorefrontOutline,
      gradient: "from-purple-500 to-pink-600",
      glow: "shadow-purple-500/25",
      allowedFor: ["store", "hybrid"],
    },
    {
      path: "/admin",
      label: "ניהול",
      icon: IoAnalyticsOutline,
      activeIcon: IoAnalyticsOutline,
      gradient: "from-gray-600 to-gray-800",
      glow: "shadow-gray-500/25",
      allowedFor: ["store", "secondhand", "hybrid"],
    },
    {
      path: "/favorites",
      label: "מועדפים",
      icon: IoHeartOutline,
      activeIcon: IoHeartOutline,
      gradient: "from-pink-500 to-rose-600",
      glow: "shadow-pink-500/25",
      allowedFor: ["customer", "hybrid"],
    },
    {
      path: "/cart",
      label: "עגלה",
      icon: IoBagOutline,
      activeIcon: IoBagOutline,
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
    { icon: IoHomeOutline, label: "דף הבית", path: "/home" },
    { icon: IoPersonOutline, label: "פרופיל אישי", path: "/profile" },
    { icon: IoNotificationsOutline, label: "התראות", path: "/notifications" },
    { icon: IoChatbubbleOutline, label: "צ'אט", path: "/chat" },
    { icon: IoSettingsOutline, label: "הגדרות", path: "/settings" },
  ];

  const customerItems: MenuItem[] = [
    ...commonItems,
    { icon: IoBagOutline, label: "ההזמנות שלי", path: "/orders", description: "מעקב אחר הזמנות" },
    { icon: IoHeartOutline, label: "המועדפים שלי", path: "/favorites", description: "פריטים שאהבתי" },
    { icon: IoStorefrontOutline, label: "חנויות שאני עוקב", path: "/stores", description: "החנויות המועדפות" },
  ];

  const storeOwnerItems: MenuItem[] = [
    { icon: IoHomeOutline, label: "דף הבית", path: "/home" },
    { icon: IoPersonOutline, label: "פרופיל החנות", path: "/profile" },
    { icon: IoStorefrontOutline, label: "ניהול החנות", path: "/my-store", description: "פרטי החנות" },
    { icon: IoShirtOutline, label: "ניהול מוצרים", path: "/admin", description: "הוספה ועריכה", badge: "חדש" },
    { icon: IoClipboardOutline, label: "הזמנות נכנסות", path: "/orders", description: "הזמנות לקוחות" },
    { icon: IoStatsChartOutline, label: "סטטיסטיקות מכירות", path: "/analytics", description: "דוחות ונתונים" },
    { icon: IoNotificationsOutline, label: "התראות", path: "/notifications" },
    { icon: IoChatbubbleOutline, label: "צ'אט עם לקוחות", path: "/chat", description: "תמיכה ושירות" },
    { icon: IoSettingsOutline, label: "הגדרות החנות", path: "/settings" },
  ];

  const secondhandItems: MenuItem[] = [
    { icon: IoHomeOutline, label: "דף הבית", path: "/home" },
    { icon: IoPersonOutline, label: "פרופיל אישי", path: "/profile" },
    { icon: IoRefreshOutline, label: "ניהול חנות יד שנייה", path: "/secondhand", description: "המוצרים שלי" },
    { icon: IoAddCircleOutline, label: "הוספת מוצר למכירה", path: "/secondhand/sell", description: "מכירת פריט", isNew: true },
    { icon: IoClipboardOutline, label: "המכירות שלי", path: "/orders", description: "פריטים שמכרתי" },
    { icon: IoStatsChartOutline, label: "סטטיסטיקות מכירות", path: "/analytics", description: "רווחים ונתונים" },
    { icon: IoNotificationsOutline, label: "התראות", path: "/notifications" },
    { icon: IoChatbubbleOutline, label: "צ'אט", path: "/chat" },
    { icon: IoSettingsOutline, label: "הגדרות", path: "/settings" },
  ];

  const hybridItems: MenuItem[] = [
    ...commonItems,
    // פריטים של לקוח
    { icon: IoBagOutline, label: "ההזמנות שלי", path: "/orders", description: "הזמנות שביצעתי" },
    { icon: IoHeartOutline, label: "המועדפים שלי", path: "/favorites", description: "פריטים שאהבתי" },
    // פריטים של מוכר יד שנייה
    { icon: IoRefreshOutline, label: "ניהול חנות יד שנייה", path: "/secondhand", description: "המוצרים שלי למכירה" },
    { icon: IoAddCircleOutline, label: "הוספת מוצר למכירה", path: "/secondhand/sell", description: "מכירת פריט חדש", isNew: true },
    { icon: IoStatsChartOutline, label: "סטטיסטיקות מכירות", path: "/analytics", description: "רווחים ונתונים" },
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
export const getUserType = (): UserType => {
  if (typeof window === "undefined") return "";
  
  const userType = localStorage.getItem("userType") || "";
  const hasSecondhandStore = localStorage.getItem("hasSecondhandStore") === "true";
  
  // אם הוא לקוח וגם יש לו חנות יד שנייה
  if (userType === "customer" && hasSecondhandStore) {
    return "hybrid";
  }
  
  return userType as UserType;
};

// פונקציה לעדכון סטטוס חנות יד שנייה
export const setSecondhandStoreStatus = (hasStore: boolean) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("hasSecondhandStore", hasStore.toString());
  }
}; 