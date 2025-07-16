"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Store,
  Package,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  X,
  Palette,
  Settings,
  Shield,
  AlertTriangle,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: Date;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "suspended" | "pending";
  avatar: string;
}

interface StoreData {
  id: string;
  name: string;
  owner: string;
  category: string;
  rating: number;
  totalProducts: number;
  totalSales: number;
  revenue: number;
  status: "active" | "pending" | "suspended";
  joinDate: Date;
}

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "users" | "stores" | "products" | "design"
  >("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Theme customization state
  const [themeColors, setThemeColors] = useState({
    primary: "#000000",
    secondary: "#6B7280",
    accent: "#374151",
    background: "#FFFFFF",
    text: "#1F2937",
  });

  // Mock data - should be moved here to follow hooks rules
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "שרה כהן",
      email: "sarah@email.com",
      phone: "050-1234567",
      joinDate: new Date("2024-01-15"),
      totalOrders: 12,
      totalSpent: 2450,
      status: "active",
      avatar: "👩",
    },
    {
      id: "2",
      name: "דוד לוי",
      email: "david@email.com",
      phone: "052-9876543",
      joinDate: new Date("2024-02-20"),
      totalOrders: 8,
      totalSpent: 1200,
      status: "active",
      avatar: "👨",
    },
    {
      id: "3",
      name: "מיכל רוזן",
      email: "michal@email.com",
      phone: "054-5555555",
      joinDate: new Date("2024-03-10"),
      totalOrders: 3,
      totalSpent: 780,
      status: "pending",
      avatar: "👩‍🦱",
    },
  ]);

  const [stores] = useState<StoreData[]>([
    {
      id: "1",
      name: "בוטיק שרה",
      owner: "שרה כהן",
      category: "אופנת נשים",
      rating: 4.8,
      totalProducts: 156,
      totalSales: 2340,
      revenue: 89000,
      status: "active",
      joinDate: new Date("2024-01-10"),
    },
    {
      id: "2",
      name: "חנות דוד לגברים",
      owner: "דוד לוי",
      category: "אופנת גברים",
      rating: 4.6,
      totalProducts: 98,
      totalSales: 1850,
      revenue: 67000,
      status: "active",
      joinDate: new Date("2024-02-15"),
    },
    {
      id: "3",
      name: "ילדים ובייבי",
      owner: "מיכל רוזן",
      category: "אופנת ילדים",
      rating: 4.9,
      totalProducts: 203,
      totalSales: 3200,
      revenue: 125000,
      status: "pending",
      joinDate: new Date("2024-03-05"),
    },
  ]);

  // Check admin permissions
  useEffect(() => {
    const checkAdminAccess = () => {
      const userType = localStorage.getItem("userType");
      const isAdminUser = userType === "admin" || userType === "store"; // For demo, store owners can also access

      if (!isAdminUser) {
        alert("אין לך הרשאות גישה לעמוד זה");
        router.push("/home");
        return;
      }

      setIsAdmin(true);
      setIsLoading(false);
    };

    checkAdminAccess();
  }, [router]);

  // Save theme colors to localStorage
  const saveThemeColors = () => {
    localStorage.setItem("themeColors", JSON.stringify(themeColors));
    alert("הצבעים נשמרו בהצלחה! העמוד יתרענן כדי להחיל את השינויים.");
    window.location.reload();
  };

  // Load saved theme colors
  useEffect(() => {
    const savedColors = localStorage.getItem("themeColors");
    if (savedColors) {
      setThemeColors(JSON.parse(savedColors));
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">בודק הרשאות...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "active").length,
    totalStores: stores.length,
    activeStores: stores.filter((s) => s.status === "active").length,
    totalRevenue: stores.reduce((sum, store) => sum + store.revenue, 0),
    totalOrders: users.reduce((sum, user) => sum + user.totalOrders, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "suspended":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "פעיל";
      case "pending":
        return "ממתין לאישור";
      case "suspended":
        return "מושעה";
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 min-h-screen overflow-y-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">מערכת ניהול</h1>
            <p className="text-gray-600">ניהול משתמשים, חנויות ומוצרים</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { key: "dashboard", label: "לוח בקרה", icon: TrendingUp },
            { key: "users", label: "משתמשים", icon: Users },
            { key: "stores", label: "חנויות", icon: Store },
            { key: "products", label: "מוצרים", icon: Package },
            { key: "design", label: "עיצוב האתר", icon: Palette },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
                <p className="text-gray-600">סה"כ משתמשים</p>
                <p className="text-sm text-green-600">
                  {stats.activeUsers} פעילים
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{stats.totalStores}</h3>
                <p className="text-gray-600">סה"כ חנויות</p>
                <p className="text-sm text-green-600">
                  {stats.activeStores} פעילות
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  ₪{stats.totalRevenue.toLocaleString()}
                </h3>
                <p className="text-gray-600">סה"כ הכנסות</p>
                <p className="text-sm text-green-600">
                  {stats.totalOrders} הזמנות
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Management */}
      {activeTab === "users" && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">ניהול משתמשים</h2>
            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors">
              <Plus className="w-4 h-4" />
              הוסף משתמש
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="חפש משתמשים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              סינון
            </button>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    משתמש
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    פרטי התקשרות
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    הזמנות
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    סה"כ הוצאה
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    סטטוס
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">
                            הצטרף ב-{user.joinDate.toLocaleDateString("he-IL")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.phone}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium">{user.totalOrders}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium">
                        ₪{user.totalSpent.toLocaleString()}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {getStatusText(user.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stores Management */}
      {activeTab === "stores" && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">ניהול חנויות</h2>
            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors">
              <Plus className="w-4 h-4" />
              הוסף חנות
            </button>
          </div>

          {/* Stores Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div
                key={store.id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">{store.name}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      store.status
                    )}`}
                  >
                    {getStatusText(store.status)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">בעלים: {store.owner}</p>
                  <p className="text-sm text-gray-600">
                    קטגוריה: {store.category}
                  </p>
                  <p className="text-sm text-gray-600">
                    דירוג: {store.rating} ⭐
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-lg font-bold">{store.totalProducts}</p>
                    <p className="text-xs text-gray-600">מוצרים</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-lg font-bold">{store.totalSales}</p>
                    <p className="text-xs text-gray-600">מכירות</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">הכנסות:</p>
                  <p className="text-xl font-bold text-green-600">
                    ₪{store.revenue.toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50">
                    <Eye className="w-4 h-4" />
                    צפה
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 py-2 text-green-600 border border-green-200 rounded-lg hover:bg-green-50">
                    <Edit className="w-4 h-4" />
                    ערוך
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Management */}
      {activeTab === "products" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">ניהול מוצרים</h2>
              <button
                onClick={() => setShowProductModal(true)}
                className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-800"
              >
                <Plus className="w-5 h-5" />
                הוסף מוצר חדש
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="חפש מוצרים..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 pl-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <select className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">כל החנויות</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: "1",
                  name: "חולצה כחולה מעוצבת",
                  store: "זארה",
                  category: "חולצות",
                  price: 89,
                  originalPrice: 120,
                  stock: 15,
                  status: "active",
                  image: "https://via.placeholder.com/300x300?text=חולצה+כחולה",
                  rating: 4.5,
                  reviews: 23,
                },
                {
                  id: "2",
                  name: "מכנסיים שחורים אלגנטיים",
                  store: "זארה",
                  category: "מכנסיים",
                  price: 149,
                  stock: 8,
                  status: "active",
                  image:
                    "https://via.placeholder.com/300x300?text=מכנסיים+שחורים",
                  rating: 4.8,
                  reviews: 12,
                },
                {
                  id: "3",
                  name: "נעליים ספורטיביות",
                  store: "נייקי",
                  category: "נעליים",
                  price: 299,
                  stock: 0,
                  status: "out_of_stock",
                  image:
                    "https://via.placeholder.com/300x300?text=נעליים+ספורט",
                  rating: 4.2,
                  reviews: 8,
                },
              ].map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="relative mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {product.status === "out_of_stock" && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm">
                        אזל מהמלאי
                      </div>
                    )}
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-lg text-sm">
                          מבצע
                        </div>
                      )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      <p className="text-gray-600 text-sm">
                        {product.store} • {product.category}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary-600">
                          ₪{product.price}
                        </span>
                        {product.originalPrice &&
                          product.originalPrice > product.price && (
                            <span className="text-gray-500 line-through text-sm">
                              ₪{product.originalPrice}
                            </span>
                          )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={`font-medium ${
                          product.stock === 0 ? "text-red-600" : "text-gray-900"
                        }`}
                      >
                        מלאי: {product.stock}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === "active"
                            ? "text-green-600 bg-green-100"
                            : "text-red-600 bg-red-100"
                        }`}
                      >
                        {product.status === "active" ? "פעיל" : "לא זמין"}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1">
                        <Eye className="w-4 h-4" />
                        צפה
                      </button>
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowProductModal(true);
                        }}
                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        ערוך
                      </button>
                      <button className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">מציג 1-6 מתוך 156 מוצרים</p>
              <div className="flex gap-2">
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                  הקודם
                </button>
                <button className="px-3 py-2 bg-primary-600 text-white rounded-lg">
                  1
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  הבא
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Design Customization */}
      {activeTab === "design" && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">התאמת עיצוב האתר</h2>
              <p className="text-gray-600">שנה את הצבעים הראשיים של האתר</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Color Customization */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5" />
                הגדרות צבעים
              </h3>

              <div className="space-y-4">
                {Object.entries(themeColors).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                  >
                    <div>
                      <label className="font-medium text-gray-900 block mb-1">
                        {key === "primary" && "צבע ראשי"}
                        {key === "secondary" && "צבע משני"}
                        {key === "accent" && "צבע הדגשה"}
                        {key === "background" && "צבע רקע"}
                        {key === "text" && "צבע טקסט"}
                      </label>
                      <p className="text-sm text-gray-500">{value}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-gray-300"
                        style={{ backgroundColor: value }}
                      />
                      <input
                        type="color"
                        value={value}
                        onChange={(e) =>
                          setThemeColors((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={saveThemeColors}
                  className="flex-1 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 flex items-center justify-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  שמור שינויים
                </button>
                <button
                  onClick={() =>
                    setThemeColors({
                      primary: "#000000",
                      secondary: "#6B7280",
                      accent: "#374151",
                      background: "#FFFFFF",
                      text: "#1F2937",
                    })
                  }
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  איפוס
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Eye className="w-5 h-5" />
                תצוגה מקדימה
              </h3>

              <div
                className="border-2 border-gray-200 rounded-xl p-6 space-y-4"
                style={{
                  backgroundColor: themeColors.background,
                  color: themeColors.text,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg"
                    style={{ backgroundColor: themeColors.primary }}
                  />
                  <h4 className="font-bold text-lg">GetClose</h4>
                </div>

                <p style={{ color: themeColors.secondary }}>
                  זה איך האתר יראה עם הצבעים החדשים
                </p>

                <div className="space-y-2">
                  <button
                    className="w-full py-3 px-4 rounded-lg font-medium text-white"
                    style={{ backgroundColor: themeColors.primary }}
                  >
                    כפתור ראשי
                  </button>
                  <button
                    className="w-full py-3 px-4 rounded-lg font-medium border-2"
                    style={{
                      borderColor: themeColors.accent,
                      color: themeColors.accent,
                    }}
                  >
                    כפתור משני
                  </button>
                </div>

                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: themeColors.accent + "20" }}
                >
                  <h5
                    className="font-medium mb-2"
                    style={{ color: themeColors.accent }}
                  >
                    כרטיס דוגמה
                  </h5>
                  <p
                    className="text-sm"
                    style={{ color: themeColors.secondary }}
                  >
                    זוהי דוגמה לכרטיס עם הצבעים החדשים
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">
                      שימו לב
                    </h4>
                    <p className="text-sm text-yellow-700">
                      השינויים יחולו על כל האתר לאחר השמירה. מומלץ לבדוק את
                      הצבעים לפני השמירה הסופית.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingProduct ? "עריכת מוצר" : "הוספת מוצר חדש"}
                </h2>
                <button
                  onClick={() => {
                    setShowProductModal(false);
                    setEditingProduct(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    שם המוצר
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="הכנס שם מוצר"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">חנות</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">בחר חנות</option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  תיאור המוצר
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="תיאור מפורט של המוצר"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">מחיר</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    מחיר מקורי
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    כמות במלאי
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    קטגוריה
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">בחר קטגוריה</option>
                    <option value="shirts">חולצות</option>
                    <option value="pants">מכנסיים</option>
                    <option value="shoes">נעליים</option>
                    <option value="accessories">אקססוריז</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    סטטוס
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="active">פעיל</option>
                    <option value="inactive">לא פעיל</option>
                    <option value="out_of_stock">אזל מהמלאי</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowProductModal(false);
                  setEditingProduct(null);
                }}
                className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                ביטול
              </button>
              <button className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700">
                {editingProduct ? "עדכן מוצר" : "הוסף מוצר"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
