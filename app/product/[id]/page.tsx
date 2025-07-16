"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  IoArrowBackOutline,
  IoStarOutline,
  IoStar,
  IoHeartOutline,
  IoHeart,
  IoShareOutline,
  IoBagOutline,
  IoAddOutline,
  IoRemoveOutline,
  IoCarOutline,
  IoShieldCheckmarkOutline,
  IoRefreshOutline,
  IoInformationCircleOutline,
  IoFlashOutline,
  IoTrophyOutline,
  IoTimeOutline,
  IoLocationOutline,
  IoCameraOutline,
  IoSparklesOutline,
  IoThumbsUpOutline,
  IoChatbubbleOutline,
  IoEyeOutline,
  IoGiftOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoExpandOutline,
} from "react-icons/io5";

// Enhanced mock product data
const mockProduct = {
  id: "1",
  storeId: "1",
  name: "חולצת טי שירט בסיסית פרימיום",
  description:
    "חולצת טי שירט נוחה ואיכותית מכותנה 100% אורגנית. מושלמת לשימוש יומיומי, עם גזרה רגילה ונוחה. החולצה עשויה מכותנה איכותית שנותנת תחושה רכה ונעימה על העור. עיצוב מינימליסטי וקלאסי שמתאים לכל סגנון.",
  price: 89,
  originalPrice: 120,
  images: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop",
    "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&h=600&fit=crop",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop",
    "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=500&h=600&fit=crop",
  ],
  category: { id: "1", name: "חולצות", icon: "👕" },
  brand: "זארא",
  sizes: [
    {
      id: "xs",
      name: "XS",
      available: true,
      stock: 3,
    },
    {
      id: "s",
      name: "S",
      available: true,
      stock: 8,
    },
    {
      id: "m",
      name: "M",
      available: true,
      stock: 12,
    },
    {
      id: "l",
      name: "L",
      available: true,
      stock: 5,
    },
    {
      id: "xl",
      name: "XL",
      available: false,
      stock: 0,
    },
  ],
  colors: [
    { id: "black", name: "שחור", hex: "#000000", available: true },
    { id: "white", name: "לבן", hex: "#FFFFFF", available: true },
    { id: "navy", name: "כחול כהה", hex: "#1B2951", available: true },
    { id: "gray", name: "אפור", hex: "#808080", available: false },
  ],
  store: {
    id: "1",
    name: "זארא תל אביב",
    rating: 4.8,
    reviews: 1234,
    address: "דיזנגוף 50, תל אביב",
    phone: "03-1234567",
    deliveryTime: "2-3 ימי עסקים",
    deliveryPrice: 15,
    freeDeliveryThreshold: 150,
  },
  rating: 4.7,
  reviews: [
    {
      id: 1,
      user: "שרה כהן",
      rating: 5,
      date: "לפני שבוע",
      comment: "איכות מעולה! החולצה נוחה מאוד ומתאימה בדיוק למידה.",
      verified: true,
      likes: 8,
    },
    {
      id: 2,
      user: "דני לוי",
      rating: 4,
      date: "לפני שבועיים",
      comment: "חולצה יפה, אבל קצת קטנה מהצפוי. כדאי להזמין מידה גדולה יותר.",
      verified: true,
      likes: 3,
    },
    {
      id: 3,
      user: "מיכל רוזן",
      rating: 5,
      date: "לפני 3 שבועות",
      comment: "בדיוק מה שחיפשתי! איכות מעולה ומחיר הוגן.",
      verified: false,
      likes: 12,
    },
  ],
  totalReviews: 156,
  features: [
    {
      icon: IoShieldCheckmarkOutline,
      title: "איכות מובטחת",
      description: "כותנה 100% אורגנית",
    },
    { icon: IoCarOutline, title: "משלוח מהיר", description: "עד 3 ימי עסקים" },
    { icon: IoRefreshOutline, title: "החזרה חינם", description: "עד 30 יום" },
    {
      icon: IoTrophyOutline,
      title: "מוצר מומלץ",
      description: "בחירת העורכים",
    },
  ],
  relatedProducts: [
    {
      id: 2,
      name: "מכנסי ג'ינס קלאסיים",
      price: 159,
      originalPrice: 199,
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=250&fit=crop",
      store: "זארא",
      rating: 4.5,
    },
    {
      id: 3,
      name: "סניקרס לבנים",
      price: 299,
      originalPrice: 399,
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=250&fit=crop",
      store: "נייקי",
      rating: 4.8,
    },
    {
      id: 4,
      name: "תיק גב מודרני",
      price: 129,
      originalPrice: 169,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=250&fit=crop",
      store: "איסטפק",
      rating: 4.6,
    },
  ],
};

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const [product] = useState(mockProduct);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("black");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "description" | "reviews" | "related"
  >("description");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [zoomedImageIndex, setZoomedImageIndex] = useState(0);

  useEffect(() => {
    if (product.sizes[2]?.available) {
      setSelectedSize(product.sizes[2].id);
    }
  }, [product]);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("אנא בחר מידה");
      return;
    }

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      image: product.images[0],
      store: product.store.name,
    };

    console.log("Adding to cart:", cartItem);
    alert("המוצר נוסף לעגלה!");
  };

  const calculateDiscount = () => {
    return Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
  };

  const getSelectedSizeStock = () => {
    const size = product.sizes.find((s) => s.id === selectedSize);
    return size?.stock || 0;
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fadeIn">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
          >
            <IoArrowBackOutline className="w-6 h-6" />
            <span className="font-medium">חזור</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            >
              {isFavorite ? (
                <IoHeart className="w-5 h-5 text-red-500" />
              ) : (
                <IoHeartOutline className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <button className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <IoShareOutline className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="animate-slideIn">
            {/* Main Image */}
            <div className="relative mb-4 group">
              <div className="aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={product.images[activeImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />

                {/* Image Navigation */}
                <button
                  onClick={prevImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
                >
                  <IoChevronBackOutline className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
                >
                  <IoChevronForwardOutline className="w-5 h-5" />
                </button>

                {/* Zoom Button */}
                <button
                  onClick={() => {
                    setZoomedImageIndex(activeImageIndex);
                    setShowImageModal(true);
                  }}
                  className="absolute top-4 left-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
                >
                  <IoExpandOutline className="w-5 h-5" />
                </button>

                {/* Discount Badge */}
                {calculateDiscount() > 0 && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full font-bold text-sm animate-pulse-custom">
                    -{calculateDiscount()}%
                  </div>
                )}
              </div>

              {/* Image Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === activeImageIndex
                        ? "bg-purple-600 scale-125"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`aspect-square bg-white rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    index === activeImageIndex
                      ? "border-purple-500 scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="animate-slideIn" style={{ animationDelay: "0.2s" }}>
            {/* Store Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold">
                {product.store.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  {product.store.name}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <IoStar className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">
                      {product.store.rating}
                    </span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">
                    {product.store.reviews} ביקורות
                  </span>
                </div>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <IoStar
                    key={star}
                    className={`w-5 h-5 ${
                      star <= product.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="font-bold text-gray-900 mr-2">
                  {product.rating}
                </span>
              </div>
              <span className="text-gray-600">
                ({product.totalReviews} ביקורות)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-purple-600">
                ₪{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">
                  ₪{product.originalPrice}
                </span>
              )}
              {calculateDiscount() > 0 && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  חסכת ₪{product.originalPrice - product.price}
                </div>
              )}
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">מידה</h3>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                  מדריך מידות
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => size.available && setSelectedSize(size.id)}
                    disabled={!size.available}
                    className={`p-3 border-2 rounded-xl font-medium transition-all duration-200 ${
                      selectedSize === size.id
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : size.available
                        ? "border-gray-200 hover:border-gray-300 text-gray-700"
                        : "border-gray-100 text-gray-400 bg-gray-50 cursor-not-allowed"
                    }`}
                  >
                    {size.name}
                    {size.stock <= 3 && size.stock > 0 && (
                      <div className="text-xs text-orange-500 mt-1">
                        נותרו {size.stock}
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="text-sm text-gray-600 mt-2">
                  במלאי: {getSelectedSizeStock()} יחידות
                </p>
              )}
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3">צבע</h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() =>
                      color.available && setSelectedColor(color.id)
                    }
                    disabled={!color.available}
                    className={`relative w-12 h-12 rounded-xl border-2 transition-all duration-200 ${
                      selectedColor === color.id
                        ? "border-purple-500 scale-110"
                        : color.available
                        ? "border-gray-200 hover:border-gray-300"
                        : "border-gray-100 cursor-not-allowed opacity-50"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {selectedColor === color.id && (
                      <IoCheckmarkOutline className="w-6 h-6 text-white absolute inset-0 m-auto drop-shadow-lg" />
                    )}
                    {!color.available && (
                      <IoCloseOutline className="w-6 h-6 text-gray-400 absolute inset-0 m-auto" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {product.colors.find((c) => c.id === selectedColor)?.name}
              </p>
            </div>

            {/* Quantity Selection */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3">כמות</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <IoRemoveOutline className="w-5 h-5" />
                  </button>
                  <span className="px-4 py-3 font-bold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= getSelectedSizeStock()}
                    className="p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <IoAddOutline className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-gray-600">
                  יחידות זמינות: {getSelectedSizeStock()}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || getSelectedSizeStock() === 0}
              className="w-full bg-gradient-primary text-white font-bold py-4 px-6 rounded-2xl hover-scale disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 flex items-center justify-center gap-3"
            >
              <IoBagOutline className="w-6 h-6" />
              הוסף לעגלה - ₪{(product.price * quantity).toLocaleString()}
            </button>

            {/* Delivery Info */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <IoCarOutline className="w-5 h-5 text-green-600" />
                <span className="font-bold text-green-800">משלוח</span>
              </div>
              <p className="text-green-700">
                {product.store.deliveryPrice > 0 ? (
                  <>
                    משלוח ₪{product.store.deliveryPrice} • משלוח חינם מעל ₪
                    {product.store.freeDeliveryThreshold}
                  </>
                ) : (
                  "משלוח חינם!"
                )}
              </p>
              <p className="text-green-600 text-sm mt-1">
                זמן אספקה: {product.store.deliveryTime}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {product.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm"
                >
                  <feature.icon className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {feature.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      {feature.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div
          className="mt-12 animate-fadeIn"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-8">
              {[
                {
                  key: "description",
                  label: "תיאור",
                  icon: IoInformationCircleOutline,
                },
                { key: "reviews", label: "ביקורות", icon: IoStarOutline },
                {
                  key: "related",
                  label: "מוצרים דומים",
                  icon: IoSparklesOutline,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium transition-all duration-200 ${
                    activeTab === tab.key
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.description}
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="card">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <IoInformationCircleOutline className="w-5 h-5 text-purple-600" />
                      פרטים נוספים
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">מותג:</span>
                        <span className="font-medium">{product.brand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">קטגוריה:</span>
                        <span className="font-medium">
                          {product.category.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">חומר:</span>
                        <span className="font-medium">כותנה 100%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">מקור:</span>
                        <span className="font-medium">טורקיה</span>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <IoShieldCheckmarkOutline className="w-5 h-5 text-green-600" />
                      הוראות טיפול
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• כביסה במכונה עד 30°C</p>
                      <p>• אל תשתמשו במלבין</p>
                      <p>• ייבוש בטמפרטורה נמוכה</p>
                      <p>• גיהוץ בטמפרטורה בינונית</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Reviews Summary */}
                <div className="card">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        {product.rating}
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <IoStar
                            key={star}
                            className={`w-5 h-5 ${
                              star <= product.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-gray-600">
                        {product.totalReviews} ביקורות
                      </div>
                    </div>

                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div
                          key={stars}
                          className="flex items-center gap-3 mb-1"
                        >
                          <span className="text-sm w-8">{stars}</span>
                          <IoStar className="w-4 h-4 text-yellow-400 fill-current" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{
                                width: `${Math.random() * 80 + 10}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-12">
                            {Math.floor(Math.random() * 30 + 5)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="card">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                            {review.user.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{review.user}</span>
                              {review.verified && (
                                <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                  <IoCheckmarkOutline className="w-3 h-3" />
                                  קנייה מאומתת
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <IoStar
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= review.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {review.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{review.comment}</p>

                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors">
                          <IoThumbsUpOutline className="w-4 h-4" />
                          <span className="text-sm">{review.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors">
                          <IoChatbubbleOutline className="w-4 h-4" />
                          <span className="text-sm">השב</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "related" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.relatedProducts.map((relatedProduct) => (
                  <div
                    key={relatedProduct.id}
                    className="card hover-lift cursor-pointer"
                    onClick={() => router.push(`/product/${relatedProduct.id}`)}
                  >
                    <div className="aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden mb-4">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <h3 className="font-bold text-gray-900 mb-2">
                      {relatedProduct.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-purple-600">
                        ₪{relatedProduct.price}
                      </span>
                      {relatedProduct.originalPrice > relatedProduct.price && (
                        <span className="text-gray-500 line-through">
                          ₪{relatedProduct.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        {relatedProduct.store}
                      </span>
                      <div className="flex items-center gap-1">
                        <IoStar className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">
                          {relatedProduct.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">מדריך מידות</h2>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <IoCloseOutline className="w-6 h-6" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-3">מידה</th>
                      <th className="text-right py-3">חזה (ס"מ)</th>
                      <th className="text-right py-3">אורך (ס"מ)</th>
                      <th className="text-right py-3">כתפיים (ס"מ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3">XS</td>
                      <td>86-90</td>
                      <td>66</td>
                      <td>42</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">S</td>
                      <td>90-94</td>
                      <td>68</td>
                      <td>44</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">M</td>
                      <td>94-98</td>
                      <td>70</td>
                      <td>46</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">L</td>
                      <td>98-102</td>
                      <td>72</td>
                      <td>48</td>
                    </tr>
                    <tr>
                      <td className="py-3">XL</td>
                      <td>102-106</td>
                      <td>74</td>
                      <td>50</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h3 className="font-bold text-blue-900 mb-2">
                  טיפים למדידה נכונה:
                </h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• מדדו עם סרט מדידה על גוף חשוף או בגדים דקים</li>
                  <li>• החזה נמדד בנקודה הרחבה ביותר</li>
                  <li>• האורך נמדד מנקודת הכתף העליונה</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
            >
              <IoCloseOutline className="w-6 h-6" />
            </button>

            <img
              src={product.images[zoomedImageIndex]}
              alt={product.name}
              className="w-full h-full object-contain"
            />

            {product.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setZoomedImageIndex(
                      (prev) =>
                        (prev - 1 + product.images.length) %
                        product.images.length
                    )
                  }
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <IoChevronBackOutline className="w-6 h-6" />
                </button>
                <button
                  onClick={() =>
                    setZoomedImageIndex(
                      (prev) => (prev + 1) % product.images.length
                    )
                  }
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <IoChevronForwardOutline className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
