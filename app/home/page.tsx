"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Star,
  Heart,
  ShoppingBag,
  MapPin,
  Clock,
  Tag,
  TrendingUp,
  Flame,
  Users,
  Shirt,
  ShoppingCart,
  Sparkles,
  Crown,
  Zap,
  Gift,
  Eye,
  ArrowRight,
  Percent,
  BadgeCheck,
  Store,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import { mockStores, storeCategories } from "@/src/lib/mockData";

// Hero Slider Data
const heroSlides = [
  {
    id: 1,
    title: "קולקציית חורף 2024",
    subtitle: "אופנה חמה לעונה הקרה",
    description: "גלו את המעילים והסוודרים הכי מתקדמים",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    cta: "קנו עכשיו",
    overlay: "from-black/70 to-black/30",
  },
  {
    id: 2,
    title: "נעליים בעיצוב חדשני",
    subtitle: "נוחות ללא פשרות",
    description: "הנעליים הנוחות והיפות ביותר לכל יום",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=2112&q=80",
    cta: "גלו עוד",
    overlay: "from-gray-900/80 to-gray-600/40",
  },
  {
    id: 3,
    title: "אביזרי אופנה מיוחדים",
    subtitle: "השלימו את הלוק",
    description: "תיקים, תכשיטים ואביזרים שיהפכו כל לוק למושלם",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    cta: "צפו בקולקציה",
    overlay: "from-black/60 to-transparent",
  },
];

// Enhanced mock data with real fashion images
const mainCategories = [
  {
    id: 1,
    name: "נשים",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gradient: "from-gray-800 to-black",
    count: 245,
    description: "אופנה נשית מובילה",
  },
  {
    id: 2,
    name: "גברים",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gradient: "from-gray-700 to-gray-900",
    count: 189,
    description: "סטייל גברי עכשווי",
  },
  {
    id: 3,
    name: "ילדים",
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gradient: "from-gray-600 to-gray-800",
    count: 156,
    description: "אופנה צעירה ונוחה",
  },
  {
    id: 4,
    name: "תינוקות",
    image:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gradient: "from-gray-500 to-gray-700",
    count: 89,
    description: "בגדים רכים ובטוחים",
  },
  {
    id: 5,
    name: "אביזרים",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gradient: "from-gray-900 to-black",
    count: 167,
    description: "אקססוריז מושלמים",
  },
  {
    id: 6,
    name: "ספורט",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gradient: "from-black to-gray-900",
    count: 134,
    description: "ביגוד ספורט מתקדם",
  },
];

const productCategories = [
  {
    id: 1,
    name: "חולצות",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format",
    trend: "+12%",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
  {
    id: 2,
    name: "מכנסיים",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop&auto=format",
    trend: "+8%",
    color: "text-gray-800",
    bgColor: "bg-gray-50",
  },
  {
    id: 3,
    name: "נעליים",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format",
    trend: "+15%",
    color: "text-black",
    bgColor: "bg-gray-100",
  },
  {
    id: 4,
    name: "שמלות",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&auto=format",
    trend: "+20%",
    color: "text-gray-900",
    bgColor: "bg-gray-50",
  },
  {
    id: 5,
    name: "מעילים",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&auto=format",
    trend: "+5%",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
  {
    id: 6,
    name: "תיקים",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&auto=format",
    trend: "+18%",
    color: "text-gray-800",
    bgColor: "bg-gray-50",
  },
];

const featuredProducts = [
  {
    id: 1,
    name: "חולצת כותנה בייסיק",
    price: 89,
    originalPrice: 129,
    store: "זארה",
    storeId: "1",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&auto=format",
    rating: 4.5,
    reviews: 234,
    isNew: false,
    isOnSale: true,
    discount: 30,
    category: "חולצות",
    badge: "מבצע חם",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
  },
  {
    id: 2,
    name: "נעלי ספורט אייר מקס",
    price: 450,
    originalPrice: 550,
    store: "נייקי",
    storeId: "2",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop&auto=format",
    rating: 4.8,
    reviews: 189,
    isNew: true,
    isOnSale: true,
    discount: 18,
    category: "נעליים",
    badge: "חדש",
    colors: ["#000000", "#FFFFFF", "#FF0000"],
  },
  {
    id: 3,
    name: "ג'ינס סקיני כחול",
    price: 199,
    originalPrice: 299,
    store: "ליוויס",
    storeId: "1",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop&auto=format",
    rating: 4.3,
    reviews: 156,
    isNew: false,
    isOnSale: true,
    discount: 33,
    category: "מכנסיים",
    badge: "פופולרי",
    colors: ["#1E3A8A", "#3B82F6", "#60A5FA"],
  },
  {
    id: 4,
    name: "שמלה אלגנטית שחורה",
    price: 259,
    originalPrice: 359,
    store: "מנגו",
    storeId: "1",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop&auto=format",
    rating: 4.6,
    reviews: 98,
    isNew: true,
    isOnSale: true,
    discount: 28,
    category: "שמלות",
    badge: "מומלץ",
    colors: ["#000000", "#374151", "#6B7280"],
  },
  {
    id: 5,
    name: "תיק יד עור איכותי",
    price: 320,
    originalPrice: 450,
    store: "קוץ'",
    storeId: "1",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&auto=format",
    rating: 4.7,
    reviews: 167,
    isNew: false,
    isOnSale: true,
    discount: 29,
    category: "אביזרים",
    badge: "יוקרה",
    colors: ["#8B4513", "#A0522D", "#D2691E"],
  },
  {
    id: 6,
    name: "מעיל חורף דאון",
    price: 399,
    originalPrice: 599,
    store: "נורת פייס",
    storeId: "2",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop&auto=format",
    rating: 4.4,
    reviews: 203,
    isNew: false,
    isOnSale: true,
    discount: 33,
    category: "מעילים",
    badge: "חורף",
    colors: ["#1F2937", "#374151", "#4B5563"],
  },
];

const trendingStores = [
  {
    id: "1",
    name: "זארה",
    logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&auto=format",
    rating: 4.6,
    products: 1250,
    gradient: "from-red-400 to-pink-500",
  },
  {
    id: "2",
    name: "נייקי",
    logo: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200&h=200&fit=crop&auto=format",
    rating: 4.8,
    products: 890,
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    id: "3",
    name: "מנגו",
    logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&auto=format",
    rating: 4.5,
    products: 756,
    gradient: "from-orange-400 to-red-500",
  },
  {
    id: "4",
    name: "ליוויס",
    logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&auto=format",
    rating: 4.7,
    products: 445,
    gradient: "from-indigo-400 to-purple-500",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const ProductCard = ({ product }: { product: any }) => (
    <div
      className="card hover-lift group cursor-pointer animate-fadeIn"
      onClick={() => router.push(`/product/${product.id}`)}
    >
      <div className="relative overflow-hidden rounded-t-2xl">
        {/* Product Image */}
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden rounded-t-2xl">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {product.isNew && (
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              חדש
            </span>
          )}
          {product.isOnSale && (
            <span className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Percent className="w-3 h-3" />-{product.discount}%
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            favorites.includes(product.id)
              ? "bg-red-500 text-white scale-110"
              : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
          }`}
        >
          <Heart
            className="w-4 h-4"
            fill={favorites.includes(product.id) ? "currentColor" : "none"}
          />
        </button>

        {/* Quick View Button */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <button className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            צפייה מהירה
          </button>
        </div>

        {/* Color Options */}
        <div className="absolute bottom-3 left-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
          {product.colors.map((color: string, index: number) => (
            <div
              key={index}
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <button
            className="text-sm text-gray-600 font-medium hover:text-gray-900 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/stores/${product.storeId}`);
            }}
          >
            {product.store}
          </button>
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {product.badge}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-600">
            {product.reviews} ביקורות
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ₪{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₪{product.originalPrice}
              </span>
            )}
          </div>
          <button className="bg-gradient-primary text-white p-2 rounded-full hover-scale">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full opacity-10 animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full opacity-10 animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full opacity-5 animate-pulse-custom" />
      </div>

      <div className="relative z-10">
        {/* Hero Slider */}
        <div className="relative h-screen overflow-hidden">
          {/* Slider Container */}
          <div className="relative w-full h-full">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />

                {/* Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`}
                />

                {/* Content */}
                <div className="relative z-10 flex items-center justify-center h-full px-4">
                  <div className="max-w-4xl mx-auto text-center text-white">
                    <div className="animate-fadeIn">
                      <h2 className="text-lg md:text-xl font-medium mb-4 opacity-90">
                        {slide.subtitle}
                      </h2>
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slideUp">
                        {slide.title}
                      </h1>
                      <p className="text-xl md:text-2xl mb-8 opacity-80 max-w-2xl mx-auto">
                        {slide.description}
                      </p>

                      {/* Search Bar */}
                      <div className="max-w-2xl mx-auto relative mb-8 animate-slideIn">
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            placeholder="חפש מוצרים, חנויות או מותגים..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all duration-300"
                          />
                          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black px-6 py-2 rounded-xl font-medium hover-scale">
                            חפש
                          </button>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button className="btn-primary bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg animate-bounce-custom">
                        {slide.cta}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white shadow-lg"
                    : "bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          {/* Quick Stats Overlay */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-4xl mx-auto px-4 z-20">
            <div className="grid grid-cols-3 gap-8 text-center text-white">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-2xl md:text-3xl font-bold mb-1">
                  1,200+
                </div>
                <div className="text-white/80 text-sm">מוצרים</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-2xl md:text-3xl font-bold mb-1">150+</div>
                <div className="text-white/80 text-sm">חנויות</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-2xl md:text-3xl font-bold mb-1">
                  50,000+
                </div>
                <div className="text-white/80 text-sm">לקוחות</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Categories Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gradient">
                קטגוריות פופולריות
              </h2>
              <button
                onClick={() => router.push("/categories")}
                className="text-black hover:text-gray-700 font-medium flex items-center gap-2 hover-scale"
              >
                צפה בכל הקטגוריות
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {mainCategories.map((category, index) => (
                <div
                  key={category.id}
                  className="card hover-lift cursor-pointer text-center animate-fadeIn relative overflow-hidden group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() =>
                    router.push(`/categories?category=${category.id}`)
                  }
                >
                  {/* Background Image */}
                  <div className="relative w-full h-32 mb-4 rounded-2xl overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-60 group-hover:opacity-40 transition-opacity duration-300`}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="font-bold text-white text-lg drop-shadow-lg">
                        {category.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-sm text-black font-medium">
                    <span>{category.count}</span>
                    <span>מוצרים</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Trending Products */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gradient">
                  מוצרים חמים
                </h2>
              </div>
              <button className="text-black hover:text-gray-700 font-medium flex items-center gap-2">
                צפה בכל המוצרים
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>

          {/* Trending Stores */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gradient">
                  חנויות מובילות
                </h2>
              </div>
              <button className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-2">
                צפה בכל החנויות
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingStores.map((store, index) => (
                <div
                  key={store.id}
                  className="card hover-lift cursor-pointer text-center animate-slideIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => router.push(`/stores/${store.id}`)}
                >
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${store.gradient} rounded-2xl overflow-hidden mx-auto mb-4 animate-glow`}
                  >
                    <img
                      src={store.logo}
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{store.name}</h3>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{store.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {store.products} מוצרים
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Product Categories Trends */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gradient">
                  טרנדים שבועיים
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {productCategories.map((category, index) => (
                <div
                  key={category.id}
                  className={`${category.bgColor} rounded-2xl p-4 hover-lift cursor-pointer animate-fadeIn group relative overflow-hidden`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-3 rounded-xl overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 text-sm">
                      {category.name}
                    </h3>
                    <div
                      className={`${category.color} font-bold text-xs flex items-center justify-center gap-1`}
                    >
                      <TrendingUp className="w-3 h-3" />
                      {category.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Special Offers Banner */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white text-center animate-fadeIn">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Gift className="w-8 h-8" />
                  <h2 className="text-3xl font-bold">מבצעים מיוחדים</h2>
                </div>
                <p className="text-xl mb-6 opacity-90">
                  הצטרף לניוזלטר שלנו וקבל 20% הנחה על הרכישה הראשונה
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="כתובת אימייל"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-white/20"
                  />
                  <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover-scale">
                    הירשם עכשיו
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
