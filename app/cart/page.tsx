"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Heart,
  Truck,
  Tag,
  Gift,
  CreditCard,
  Shield,
  Clock,
  Star,
  Check,
  X,
  Sparkles,
  Zap,
  AlertCircle,
  MapPin,
  Package,
} from "lucide-react";

// Enhanced mock cart data
const mockCartItems = [
  {
    id: "1",
    productId: "1",
    product: {
      id: "1",
      name: "חולצת טי שירט בסיסית פרימיום",
      price: 89,
      originalPrice: 120,
      images: ["👕"],
      category: { id: "1", name: "חולצות", icon: "👕" },
      brand: "זארא",
      inStock: true,
      isOnSale: true,
      rating: 4.8,
      reviews: 234,
    },
    quantity: 2,
    selectedSize: { id: "m", name: "M", type: "clothing", isAvailable: true },
    selectedColor: {
      id: "black",
      name: "שחור",
      hexCode: "#000000",
      isAvailable: true,
    },
    price: 89,
    addedAt: new Date("2024-01-16T10:00:00"),
    storeId: "1",
    storeName: "זארא",
    storeRating: 4.6,
    estimatedDelivery: "2-3 ימי עסקים",
  },
  {
    id: "2",
    productId: "2",
    product: {
      id: "2",
      name: "ג'ינס סקיני דנים כחול",
      price: 199,
      originalPrice: 299,
      images: ["👖"],
      category: { id: "2", name: "מכנסיים", icon: "👖" },
      brand: "ליוויס",
      inStock: true,
      isOnSale: true,
      rating: 4.3,
      reviews: 156,
    },
    quantity: 1,
    selectedSize: { id: "s", name: "S", type: "clothing", isAvailable: true },
    selectedColor: {
      id: "blue",
      name: "כחול",
      hexCode: "#3B82F6",
      isAvailable: true,
    },
    price: 199,
    addedAt: new Date("2024-01-16T10:15:00"),
    storeId: "2",
    storeName: "ליוויס",
    storeRating: 4.7,
    estimatedDelivery: "1-2 ימי עסקים",
  },
  {
    id: "3",
    productId: "3",
    product: {
      id: "3",
      name: "נעלי ספורט אייר מקס",
      price: 450,
      originalPrice: 550,
      images: ["👟"],
      category: { id: "3", name: "נעליים", icon: "👟" },
      brand: "נייקי",
      inStock: true,
      isOnSale: true,
      rating: 4.9,
      reviews: 189,
    },
    quantity: 1,
    selectedSize: { id: "42", name: "42", type: "shoes", isAvailable: true },
    selectedColor: {
      id: "white",
      name: "לבן",
      hexCode: "#FFFFFF",
      isAvailable: true,
    },
    price: 450,
    addedAt: new Date("2024-01-16T10:30:00"),
    storeId: "3",
    storeName: "נייקי",
    storeRating: 4.8,
    estimatedDelivery: "3-5 ימי עסקים",
  },
];

const promoCodes = [
  {
    code: "WELCOME20",
    discount: 20,
    minAmount: 200,
    description: "20% הנחה על הרכישה הראשונה",
  },
  {
    code: "SUMMER15",
    discount: 15,
    minAmount: 300,
    description: "15% הנחה לקיץ",
  },
  {
    code: "SAVE10",
    discount: 10,
    minAmount: 150,
    description: "10% הנחה כללית",
  },
];

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [selectedItems, setSelectedItems] = useState<string[]>(
    mockCartItems.map((item) => item.id)
  );
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const updateQuantity = (id: string, change: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, Math.min(10, item.quantity + change)),
            }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
    setSelectedItems((selected) => selected.filter((itemId) => itemId !== id));
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems((selected) =>
      selected.includes(id)
        ? selected.filter((itemId) => itemId !== id)
        : [...selected, id]
    );
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const applyPromoCode = () => {
    const promo = promoCodes.find((p) => p.code === promoCode.toUpperCase());
    if (promo && subtotal >= promo.minAmount) {
      setAppliedPromo(promo);
      setPromoDiscount(promo.discount);
      setShowPromoInput(false);
    } else {
      alert("קוד קופון לא תקין או סכום מינימלי לא מתאים");
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    setPromoCode("");
  };

  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.includes(item.id)
  );
  const subtotal = selectedCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = subtotal * (promoDiscount / 100);
  const shipping = subtotal > 300 ? 0 : 25;
  const total = subtotal - discount + shipping;

  const savings = selectedCartItems.reduce((sum, item) => {
    const originalPrice = item.product.originalPrice || item.price;
    return sum + (originalPrice - item.price) * item.quantity;
  }, 0);

  const handleCheckout = () => {
    if (selectedCartItems.length === 0) {
      alert("אנא בחר פריטים לרכישה");
      return;
    }
    router.push("/checkout");
  };

  const CartItemCard = ({ item }: { item: any }) => (
    <div className="card p-6 animate-fadeIn hover-lift">
      <div className="flex items-start gap-4">
        {/* Selection Checkbox */}
        <button
          onClick={() => toggleItemSelection(item.id)}
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
            selectedItems.includes(item.id)
              ? "bg-gradient-primary border-purple-500"
              : "border-gray-300 hover:border-purple-400"
          }`}
        >
          {selectedItems.includes(item.id) && (
            <Check className="w-4 h-4 text-white" />
          )}
        </button>

        {/* Product Image */}
        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
          {item.product.images[0]}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                {item.product.name}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  {item.product.rating}
                </span>
                <span>מ-{item.storeName}</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  {item.estimatedDelivery}
                </span>
              </div>
            </div>

            <button
              onClick={() => toggleFavorite(item.productId)}
              className={`p-2 rounded-full transition-all duration-300 ${
                favorites.includes(item.productId)
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white"
              }`}
            >
              <Heart
                className="w-4 h-4"
                fill={
                  favorites.includes(item.productId) ? "currentColor" : "none"
                }
              />
            </button>
          </div>

          {/* Size and Color */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">מידה:</span>
              <span className="bg-gray-100 px-2 py-1 rounded-lg text-sm font-medium">
                {item.selectedSize.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">צבע:</span>
              <div className="flex items-center gap-1">
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: item.selectedColor.hexCode }}
                />
                <span className="text-sm">{item.selectedColor.name}</span>
              </div>
            </div>
          </div>

          {/* Price and Quantity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                ₪{item.price}
              </span>
              {item.product.originalPrice &&
                item.product.originalPrice > item.price && (
                  <span className="text-sm text-gray-500 line-through">
                    ₪{item.product.originalPrice}
                  </span>
                )}
              {item.product.isOnSale && (
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                  -
                  {Math.round(
                    ((item.product.originalPrice - item.price) /
                      item.product.originalPrice) *
                      100
                  )}
                  %
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Quantity Controls */}
              <div className="flex items-center border border-gray-200 rounded-xl">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="p-2 hover:bg-gray-50 transition-colors"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 py-2 font-semibold min-w-[40px] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="p-2 hover:bg-gray-50 transition-colors"
                  disabled={item.quantity >= 10}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PromoCodeSection = () => (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Tag className="w-5 h-5 text-purple-600" />
          קוד הנחה
        </h3>
        {!showPromoInput && !appliedPromo && (
          <button
            onClick={() => setShowPromoInput(true)}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            הוסף קוד
          </button>
        )}
      </div>

      {appliedPromo && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">
                {appliedPromo.code} - {appliedPromo.description}
              </span>
            </div>
            <button
              onClick={removePromoCode}
              className="text-green-600 hover:text-green-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {showPromoInput && !appliedPromo && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="הכנס קוד הנחה"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button onClick={applyPromoCode} className="btn-primary px-6">
              החל
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">קודי הנחה זמינים:</p>
            {promoCodes.map((promo) => (
              <div
                key={promo.code}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-sm">{promo.code}</span>
                <span className="text-xs text-gray-600">
                  {promo.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const OrderSummary = () => (
    <div className="card p-6 sticky top-24">
      <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-purple-600" />
        סיכום הזמנה
      </h3>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">
            סכום ביניים ({selectedCartItems.length} פריטים)
          </span>
          <span className="font-semibold">₪{subtotal}</span>
        </div>

        {savings > 0 && (
          <div className="flex justify-between text-green-600">
            <span>חיסכון</span>
            <span className="font-semibold">-₪{savings}</span>
          </div>
        )}

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>הנחת קוד ({appliedPromo?.code})</span>
            <span className="font-semibold">-₪{discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-600">משלוח</span>
          <span
            className={`font-semibold ${
              shipping === 0 ? "text-green-600" : ""
            }`}
          >
            {shipping === 0 ? "חינם" : `₪${shipping}`}
          </span>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>סה"כ לתשלום</span>
            <span className="text-purple-600">₪{total}</span>
          </div>
        </div>
      </div>

      {shipping > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-blue-800">
            <Truck className="w-4 h-4" />
            <span className="text-sm">
              הוסף עוד ₪{300 - subtotal} לקבלת משלוח חינם
            </span>
          </div>
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={selectedCartItems.length === 0}
        className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CreditCard className="w-5 h-5" />
        המשך לתשלום
      </button>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield className="w-4 h-4 text-green-600" />
          <span>תשלום מאובטח ובטוח</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Package className="w-4 h-4 text-blue-600" />
          <span>משלוח מהיר ואמין</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-purple-600" />
          <span>החזרה חופשית עד 30 יום</span>
        </div>
      </div>
    </div>
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="max-w-6xl mx-auto p-4 py-16">
          <div className="text-center animate-fadeIn">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-16 h-16 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              העגלה שלך ריקה
            </h1>
            <p className="text-gray-600 mb-8">
              נראה שעדיין לא הוספת פריטים לעגלה
            </p>
            <button
              onClick={() => router.push("/home")}
              className="btn-primary text-lg px-8 py-4"
            >
              התחל לקנות
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10 animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-10 animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 p-4 border-b border-gray-200">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              חזרה
            </button>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">עגלת קניות</h1>
              <p className="text-gray-600">{cartItems.length} פריטים</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setSelectedItems(
                    selectedItems.length === cartItems.length
                      ? []
                      : cartItems.map((item) => item.id)
                  )
                }
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                {selectedItems.length === cartItems.length
                  ? "בטל הכל"
                  : "בחר הכל"}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Savings Banner */}
              {savings > 0 && (
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-6 rounded-2xl animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    <div>
                      <h3 className="font-bold text-lg">
                        אתה חוסך ₪{savings}!
                      </h3>
                      <p className="opacity-90">על הפריטים שבעגלה שלך</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cart Items List */}
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CartItemCard item={item} />
                  </div>
                ))}
              </div>

              {/* Promo Code Section */}
              <PromoCodeSection />

              {/* Continue Shopping */}
              <div className="card p-6 text-center">
                <h3 className="font-bold text-gray-900 mb-2">רוצה עוד?</h3>
                <p className="text-gray-600 mb-4">
                  המשך לקנות ותגלה עוד מוצרים מעולים
                </p>
                <button
                  onClick={() => router.push("/home")}
                  className="btn-secondary flex items-center gap-2 mx-auto"
                >
                  <ShoppingBag className="w-4 h-4" />
                  המשך קניות
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
