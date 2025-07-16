"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  MapPin,
  Clock,
  Star,
  Heart,
  ShoppingBag,
  User,
  Tag,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SecondHandItem {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  condition: "כמו חדש" | "מצב טוב" | "מצב סביר" | "נזקים קלים";
  category: string;
  size?: string;
  brand?: string;
  seller: {
    id: string;
    name: string;
    rating: number;
    totalSales: number;
    avatar: string;
    location: string;
  };
  images: string[];
  postedDate: Date;
  views: number;
  likes: number;
  isLiked: boolean;
  tags: string[];
  negotiable: boolean;
}

export default function SecondHandPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("הכל");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    "הכל",
    "חולצות",
    "מכנסיים",
    "שמלות",
    "נעליים",
    "תיקים",
    "אביזרים",
    "מעילים",
    "תחתונים",
  ];

  const [items] = useState<SecondHandItem[]>([
    {
      id: "1",
      title: "חולצת זארה כמו חדשה",
      description:
        "חולצה יפהפייה בצבע כחול, נקנתה לפני חודש ולא הייתה הזדמנות ללבוש. מידה M.",
      price: 45,
      originalPrice: 89,
      condition: "כמו חדש",
      category: "חולצות",
      size: "M",
      brand: "זארה",
      seller: {
        id: "1",
        name: "שרה כהן",
        rating: 4.8,
        totalSales: 23,
        avatar: "👩",
        location: "תל אביב",
      },
      images: ["👕", "📸", "📸"],
      postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      views: 45,
      likes: 8,
      isLiked: false,
      tags: ["זארה", "כחול", "כותנה"],
      negotiable: true,
    },
    {
      id: "2",
      title: "נעלי נייקי ספורט",
      description:
        "נעלי ריצה מעולות, נלבשו מעט. מידה 42. מתאימות לספורט ולהליכה יומיומית.",
      price: 180,
      originalPrice: 350,
      condition: "מצב טוב",
      category: "נעליים",
      size: "42",
      brand: "נייקי",
      seller: {
        id: "2",
        name: "דוד לוי",
        rating: 4.9,
        totalSales: 67,
        avatar: "👨",
        location: "חיפה",
      },
      images: ["👟", "📸", "📸"],
      postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      views: 89,
      likes: 15,
      isLiked: true,
      tags: ["נייקי", "ספורט", "ריצה"],
      negotiable: false,
    },
    {
      id: "3",
      title: "שמלת ערב אלגנטית",
      description:
        "שמלה שחורה יפהפייה לאירועים מיוחדים. נלבשה פעם אחת בלבד לחתונה.",
      price: 120,
      originalPrice: 280,
      condition: "כמו חדש",
      category: "שמלות",
      size: "S",
      brand: "H&M",
      seller: {
        id: "3",
        name: "מיכל אברהם",
        rating: 4.6,
        totalSales: 12,
        avatar: "👩",
        location: "ירושלים",
      },
      images: ["👗", "📸", "📸"],
      postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
      views: 32,
      likes: 6,
      isLiked: false,
      tags: ["שחור", "אלגנטי", "אירועים"],
      negotiable: true,
    },
    {
      id: "4",
      title: "תיק יד מעור איכותי",
      description:
        'תיק יד מעור אמיתי בצבע חום. קנוי בחו"ל, איכות מעולה. מצב טוב מאוד.',
      price: 85,
      originalPrice: 180,
      condition: "מצב טוב",
      category: "תיקים",
      brand: "ללא מותג",
      seller: {
        id: "4",
        name: "רחל מזרחי",
        rating: 4.7,
        totalSales: 34,
        avatar: "👩",
        location: "רמת גן",
      },
      images: ["👜", "📸", "📸"],
      postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      views: 67,
      likes: 12,
      isLiked: false,
      tags: ["עור", "חום", "איכותי"],
      negotiable: true,
    },
  ]);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "כמו חדש":
        return "text-green-600 bg-green-100";
      case "מצב טוב":
        return "text-blue-600 bg-blue-100";
      case "מצב סביר":
        return "text-yellow-600 bg-yellow-100";
      case "נזקים קלים":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `לפני ${diffInHours} שעות`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `לפני ${diffInDays} ימים`;
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.includes(searchQuery) ||
      item.description.includes(searchQuery) ||
      item.tags.some((tag) => tag.includes(searchQuery));
    const matchesCategory =
      selectedCategory === "הכל" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 min-h-screen overflow-y-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">יד שנייה</h1>
              <p className="text-gray-600">מצא מוצרים משומשים במחירים מעולים</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/secondhand/sell")}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            מכור מוצר
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="חפש מוצרים יד שנייה..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            פילטרים
          </button>
          <p className="text-gray-600">נמצאו {filteredItems.length} מוצרים</p>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="newest">הכי חדשים</option>
          <option value="price_low">מחיר נמוך לגבוה</option>
          <option value="price_high">מחיר גבוה לנמוך</option>
          <option value="popular">הכי פופולריים</option>
        </select>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Image */}
            <div className="relative">
              <div className="h-48 bg-gray-100 flex items-center justify-center text-6xl">
                {item.images[0]}
              </div>
              <button className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                <Heart
                  className={`w-4 h-4 ${
                    item.isLiked ? "text-red-500 fill-current" : "text-gray-400"
                  }`}
                />
              </button>
              <div className="absolute top-3 right-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(
                    item.condition
                  )}`}
                >
                  {item.condition}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg line-clamp-2">{item.title}</h3>
                {item.negotiable && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    ניתן להתמקח
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex gap-1 mb-3 flex-wrap">
                {item.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl font-bold text-green-600">
                  ₪{item.price}
                </span>
                {item.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ₪{item.originalPrice}
                  </span>
                )}
                {item.originalPrice && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                    -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                  </span>
                )}
              </div>

              {/* Seller Info */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                  {item.seller.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.seller.name}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span>{item.seller.rating}</span>
                    <span>•</span>
                    <span>{item.seller.totalSales} מכירות</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>{item.seller.location}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo(item.postedDate)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{item.views} צפיות</span>
                  <span>{item.likes} לייקים</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/secondhand/${item.id}`)}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  צפה במוצר
                </button>
                <button className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            לא נמצאו מוצרים
          </h3>
          <p className="text-gray-500 mb-4">
            נסה לשנות את מילות החיפוש או הפילטרים
          </p>
          <button
            onClick={() => router.push("/secondhand/sell")}
            className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors"
          >
            היה הראשון למכור
          </button>
        </div>
      )}
    </div>
  );
}
