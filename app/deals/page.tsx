"use client";

import { useState, useEffect } from "react";
import {
  Tag,
  Clock,
  Star,
  MapPin,
  Filter,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Deal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  store: string;
  storeId: string;
  category: string;
  image: string;
  expiresAt: Date;
  isFlashDeal: boolean;
  isTodayOnly: boolean;
  stock: number;
  sold: number;
  rating: number;
  distance: number;
}

export default function DealsPage() {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: "1",
      title: "חולצות כותנה פרימיום",
      description: "חולצות כותנה איכותיות במגוון צבעים וגדלים",
      originalPrice: 299,
      discountPrice: 149,
      discountPercentage: 50,
      store: "זארה",
      storeId: "1",
      category: "חולצות",
      image: "👕",
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      isFlashDeal: true,
      isTodayOnly: true,
      stock: 50,
      sold: 32,
      rating: 4.5,
      distance: 2.3,
    },
    {
      id: "2",
      title: "נעלי ספורט נייקי",
      description: "נעלי ריצה מקצועיות עם טכנולוגיה מתקדמת",
      originalPrice: 699,
      discountPrice: 499,
      discountPercentage: 29,
      store: "נייקי",
      storeId: "2",
      category: "נעליים",
      image: "👟",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      isFlashDeal: false,
      isTodayOnly: false,
      stock: 25,
      sold: 8,
      rating: 4.8,
      distance: 1.5,
    },
    {
      id: "3",
      title: "שמלות ערב אלגנטיות",
      description: "שמלות ערב מעוצבות לאירועים מיוחדים",
      originalPrice: 899,
      discountPrice: 539,
      discountPercentage: 40,
      store: "זארה",
      storeId: "1",
      category: "שמלות",
      image: "👗",
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      isFlashDeal: false,
      isTodayOnly: true,
      stock: 15,
      sold: 12,
      rating: 4.3,
      distance: 2.3,
    },
  ]);

  const [filter, setFilter] = useState<"all" | "flash" | "today" | "ending">(
    "all"
  );
  const [sortBy, setSortBy] = useState<
    "discount" | "price" | "rating" | "distance"
  >("discount");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeRemaining = (expiresAt: Date) => {
    const diff = expiresAt.getTime() - currentTime.getTime();
    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  const filteredDeals = deals.filter((deal) => {
    const timeRemaining = getTimeRemaining(deal.expiresAt);
    if (!timeRemaining) return false; // Expired deals

    switch (filter) {
      case "flash":
        return deal.isFlashDeal;
      case "today":
        return deal.isTodayOnly;
      case "ending":
        return timeRemaining.hours < 6;
      default:
        return true;
    }
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    switch (sortBy) {
      case "discount":
        return b.discountPercentage - a.discountPercentage;
      case "price":
        return a.discountPrice - b.discountPrice;
      case "rating":
        return b.rating - a.rating;
      case "distance":
        return a.distance - b.distance;
      default:
        return 0;
    }
  });

  const categories = Array.from(new Set(deals.map((deal) => deal.category)));

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">מבצעים חמים</h1>
            <p className="opacity-90">הזדמנויות שלא תרצה לפספס!</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <div className="text-2xl font-bold">{deals.length}</div>
            <div className="text-sm opacity-80">מבצעים פעילים</div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <div className="text-2xl font-bold">50%</div>
            <div className="text-sm opacity-80">הנחה מקסימלית</div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <div className="text-2xl font-bold">
              {deals.filter((d) => d.isFlashDeal).length}
            </div>
            <div className="text-sm opacity-80">מבצעי בזק</div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <div className="text-2xl font-bold">
              {deals.filter((d) => d.isTodayOnly).length}
            </div>
            <div className="text-sm opacity-80">רק היום</div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex gap-2">
            {[
              { key: "all", label: "כל המבצעים", icon: "🏷️" },
              { key: "flash", label: "מבצעי בזק", icon: "⚡" },
              { key: "today", label: "רק היום", icon: "🔥" },
              { key: "ending", label: "מסתיימים בקרוב", icon: "⏰" },
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filter === filterOption.key
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{filterOption.icon}</span>
                {filterOption.label}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm"
          >
            <option value="discount">מיון לפי הנחה</option>
            <option value="price">מיון לפי מחיר</option>
            <option value="rating">מיון לפי דירוג</option>
            <option value="distance">מיון לפי מרחק</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap hover:bg-gray-200 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedDeals.map((deal) => {
          const timeRemaining = getTimeRemaining(deal.expiresAt);
          const progressPercentage = (deal.sold / deal.stock) * 100;

          return (
            <div
              key={deal.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => router.push(`/product/${deal.id}`)}
            >
              {/* Deal Header */}
              <div className="relative">
                <div className="h-48 bg-gray-100 flex items-center justify-center text-6xl">
                  {deal.image}
                </div>

                {/* Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  {deal.isFlashDeal && (
                    <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      בזק
                    </div>
                  )}
                  {deal.isTodayOnly && (
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      רק היום
                    </div>
                  )}
                </div>

                {/* Discount Badge */}
                <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                  -{deal.discountPercentage}%
                </div>
              </div>

              <div className="p-4">
                {/* Title and Description */}
                <h3 className="font-bold text-lg mb-1">{deal.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{deal.description}</p>

                {/* Store and Rating */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <span>🏪</span>
                    <span>{deal.store}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{deal.rating}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold text-red-600">
                    ₪{deal.discountPrice}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    ₪{deal.originalPrice}
                  </span>
                </div>

                {/* Timer */}
                {timeRemaining && (
                  <div className="bg-red-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">
                        נותרו:
                      </span>
                    </div>
                    <div className="flex gap-2 text-center">
                      <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                        {timeRemaining.hours.toString().padStart(2, "0")}
                      </div>
                      <span className="text-red-600 font-bold">:</span>
                      <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                        {timeRemaining.minutes.toString().padStart(2, "0")}
                      </div>
                      <span className="text-red-600 font-bold">:</span>
                      <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                        {timeRemaining.seconds.toString().padStart(2, "0")}
                      </div>
                    </div>
                  </div>
                )}

                {/* Stock Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">נמכרו: {deal.sold}</span>
                    <span className="text-gray-600">
                      נותרו: {deal.stock - deal.sold}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Distance */}
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{deal.distance} ק"מ ממך</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sortedDeals.length === 0 && (
        <div className="text-center py-12">
          <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            אין מבצעים זמינים
          </h3>
          <p className="text-gray-500">
            נסה לשנות את הפילטרים או חזור מאוחר יותר
          </p>
        </div>
      )}
    </div>
  );
}
