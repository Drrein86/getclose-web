"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowRight,
  Star,
  Clock,
  MapPin,
  Phone,
  Globe,
  Heart,
  Share2,
  Filter,
  Search,
  ShoppingCart,
  Plus,
} from "lucide-react";
import { getStoreById, formatPrice } from "@/lib/mockData";
import { Store, Product } from "@/types";

// מוצרים מדומים לחנות
const mockProducts: Product[] = [
  {
    id: "1",
    storeId: "1",
    name: "חולצת טי שירט בסיסית",
    description: "חולצת טי שירט נוחה ואיכותית מכותנה 100%",
    price: 89,
    originalPrice: 120,
    images: ["/products/tshirt-1.jpg", "/products/tshirt-2.jpg"],
    category: { id: "1", name: "חולצות", icon: "👕" },
    brand: "זארא",
    sizes: [
      { id: "s", name: "S", type: "clothing", isAvailable: true },
      { id: "m", name: "M", type: "clothing", isAvailable: true },
      { id: "l", name: "L", type: "clothing", isAvailable: true },
    ],
    colors: [
      { id: "black", name: "שחור", hexCode: "#000000", isAvailable: true },
      { id: "white", name: "לבן", hexCode: "#FFFFFF", isAvailable: true },
      { id: "blue", name: "כחול", hexCode: "#0000FF", isAvailable: true },
    ],
    tags: ["כותנה", "בסיסי", "נוח"],
    inStock: true,
    stockQuantity: 25,
    rating: 4.2,
    reviewCount: 34,
    isOnSale: true,
    saleEndDate: new Date("2024-12-31"),
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date(),
  },
  {
    id: "2",
    storeId: "1",
    name: "ג'ינס סקיני",
    description: "ג'ינס סקיני מעוצב בגזרה מחמיאה",
    price: 199,
    images: ["/products/jeans-1.jpg", "/products/jeans-2.jpg"],
    category: { id: "2", name: "מכנסיים", icon: "👖" },
    brand: "זארא",
    sizes: [
      { id: "s", name: "S", type: "clothing", isAvailable: true },
      { id: "m", name: "M", type: "clothing", isAvailable: true },
      { id: "l", name: "L", type: "clothing", isAvailable: false },
    ],
    colors: [
      { id: "black", name: "שחור", hexCode: "#000000", isAvailable: true },
      { id: "blue", name: "כחול", hexCode: "#0000FF", isAvailable: true },
    ],
    tags: ["ג'ינס", "סקיני", "מעוצב"],
    inStock: true,
    stockQuantity: 18,
    rating: 4.1,
    reviewCount: 56,
    isOnSale: false,
    createdAt: new Date("2023-08-01"),
    updatedAt: new Date(),
  },
];

export default function StorePage() {
  const router = useRouter();
  const params = useParams();
  const storeId = params?.id as string;

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<"products" | "info" | "reviews">(
    "products"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("הכל");
  const [showFilters, setShowFilters] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // טעינת נתוני החנות
    const storeData = getStoreById(storeId);
    if (storeData) {
      setStore(storeData);
      // טעינת מוצרים של החנות
      const storeProducts = mockProducts.filter(
        (product) => product.storeId === storeId
      );
      setProducts(storeProducts);
    }
  }, [storeId]);

  const handleBack = () => {
    router.back();
  };

  const handleAddToCart = (product: Product) => {
    // לוגיקה להוספה לעגלה
    console.log("Adding to cart:", product);
    // כאן נוסיף את הלוגיקה האמיתית
  };

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "הכל" || product.category.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "הכל",
    ...Array.from(new Set(products.map((p) => p.category.name))),
  ];

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRight className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">{store.name}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Heart
                className={`w-6 h-6 ${
                  isFavorite ? "text-red-500 fill-current" : "text-gray-600"
                }`}
              />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Store Info Banner */}
      <div className="bg-white p-4 border-b border-gray-100">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">
              {store.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {store.name}
            </h2>
            <p className="text-gray-600 text-sm mb-2">{store.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{store.rating}</span>
                <span>({store.reviewCount} ביקורות)</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  {store.deliveryInfo.estimatedTime.min}-
                  {store.deliveryInfo.estimatedTime.max} דק
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>1.2 ק"מ</span>
              </div>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              store.isOpen
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {store.isOpen ? "פתוח" : "סגור"}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex">
          {[
            { key: "products", label: "מוצרים", count: products.length },
            { key: "info", label: "מידע" },
            { key: "reviews", label: "ביקורות", count: store.reviewCount },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.label}
              {tab.count && (
                <span className="mr-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="pb-20">
        {activeTab === "products" && (
          <>
            {/* Search and Filters */}
            <div className="bg-white p-4 border-b border-gray-100">
              <div className="flex gap-3 mb-3">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="חפש מוצרים..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-12 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="p-4">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">לא נמצאו מוצרים</p>
                  <p className="text-gray-400 text-sm">
                    נסה לשנות את החיפוש או הפילטרים
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div
                        className="aspect-square bg-gray-100 relative cursor-pointer"
                        onClick={() => handleProductClick(product.id)}
                      >
                        {product.isOnSale && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            מבצע
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          <span className="text-4xl">
                            {product.category.icon}
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-primary-600">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">
                              {product.rating}
                            </span>
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "info" && (
          <div className="p-4 space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-4">פרטי התקשרות</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{store.contact.phone}</span>
                </div>
                {store.contact.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a
                      href={store.contact.website}
                      className="text-primary-600 hover:underline"
                    >
                      {store.contact.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">
                    {store.address.street}, {store.address.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-4">מידע משלוח</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">הזמנה מינימלית:</span>
                  <span className="font-medium">
                    {formatPrice(store.deliveryInfo.minOrderAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">עלות משלוח:</span>
                  <span className="font-medium">
                    {formatPrice(store.deliveryInfo.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">משלוח חינם מ:</span>
                  <span className="font-medium">
                    {formatPrice(store.deliveryInfo.freeDeliveryThreshold)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">זמן משלוח:</span>
                  <span className="font-medium">
                    {store.deliveryInfo.estimatedTime.min}-
                    {store.deliveryInfo.estimatedTime.max} דק
                  </span>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-4">שעות פתיחה</h3>
              <div className="space-y-2">
                {Object.entries(store.hours).map(([day, hours]) => {
                  const dayNames: { [key: string]: string } = {
                    sunday: "ראשון",
                    monday: "שני",
                    tuesday: "שלישי",
                    wednesday: "רביעי",
                    thursday: "חמישי",
                    friday: "שישי",
                    saturday: "שבת",
                  };

                  return (
                    <div key={day} className="flex justify-between">
                      <span className="text-gray-600">{dayNames[day]}:</span>
                      <span className="font-medium">
                        {hours.isClosed
                          ? "סגור"
                          : `${hours.open} - ${hours.close}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="p-4">
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">ביקורות יבואו בקרוב</p>
              <p className="text-gray-400 text-sm">
                אנחנו עובדים על מערכת ביקורות מתקדמת
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
