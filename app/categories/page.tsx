"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IoArrowBackOutline,
  IoSearchOutline,
  IoTrendingUpOutline,
  IoHeartOutline,
  IoHeart,
  IoGridOutline,
  IoListOutline,
  IoFilterOutline,
  IoStarOutline,
} from "react-icons/io5";

// קטגוריות ראשיות עם תמונות
const mainCategories = [
  {
    id: 1,
    name: "נשים",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop",
    color: "from-pink-400 to-rose-500",
    count: 1245,
    trending: true,
    subcategories: [
      {
        name: "חולצות",
        count: 234,
        trend: "+15%",
        image:
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop",
      },
      {
        name: "שמלות",
        count: 189,
        trend: "+22%",
        image:
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=200&h=200&fit=crop",
      },
      {
        name: "מכנסיים",
        count: 156,
        trend: "+8%",
        image:
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=200&fit=crop",
      },
      {
        name: "חצאיות",
        count: 98,
        trend: "+12%",
        image:
          "https://images.unsplash.com/photo-1583496661160-fb5886a13d14?w=200&h=200&fit=crop",
      },
      {
        name: "בגדי ים",
        count: 67,
        trend: "+45%",
        image:
          "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=200&h=200&fit=crop",
      },
      {
        name: "הלבשה תחתונה",
        count: 123,
        trend: "+5%",
        image:
          "https://images.unsplash.com/photo-1566479179817-c8e6a0e03e85?w=200&h=200&fit=crop",
      },
    ],
  },
  {
    id: 2,
    name: "גברים",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    color: "from-blue-400 to-indigo-500",
    count: 987,
    trending: true,
    subcategories: [
      {
        name: "חולצות",
        count: 198,
        trend: "+12%",
        image:
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&h=200&fit=crop",
      },
      {
        name: "מכנסיים",
        count: 167,
        trend: "+18%",
        image:
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=200&fit=crop",
      },
      {
        name: "חליפות",
        count: 89,
        trend: "+25%",
        image:
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&h=200&fit=crop",
      },
      {
        name: "ג'קטים",
        count: 134,
        trend: "+8%",
        image:
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop",
      },
      {
        name: "בגדי ספורט",
        count: 156,
        trend: "+30%",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
      },
      {
        name: "הלבשה תחתונה",
        count: 78,
        trend: "+3%",
        image:
          "https://images.unsplash.com/photo-1622445275576-721325763efe?w=200&h=200&fit=crop",
      },
    ],
  },
  {
    id: 3,
    name: "ילדים",
    image:
      "https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=400&h=300&fit=crop",
    color: "from-green-400 to-emerald-500",
    count: 756,
    trending: false,
    subcategories: [
      {
        name: "בנות (2-12)",
        count: 234,
        trend: "+20%",
        image:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
      },
      {
        name: "בנים (2-12)",
        count: 198,
        trend: "+15%",
        image:
          "https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=200&h=200&fit=crop",
      },
      {
        name: "תינוקות (0-2)",
        count: 167,
        trend: "+35%",
        image:
          "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=200&h=200&fit=crop",
      },
      {
        name: "נעליים",
        count: 89,
        trend: "+12%",
        image:
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
      },
      {
        name: "אביזרים",
        count: 68,
        trend: "+8%",
        image:
          "https://images.unsplash.com/photo-1519278625948-7c0e274c5e9e?w=200&h=200&fit=crop",
      },
    ],
  },
  {
    id: 4,
    name: "נעליים",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
    color: "from-purple-400 to-violet-500",
    count: 445,
    trending: true,
    subcategories: [
      {
        name: "נעלי ספורט",
        count: 123,
        trend: "+40%",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
      },
      {
        name: "נעלי עקב",
        count: 98,
        trend: "+25%",
        image:
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=200&fit=crop",
      },
      {
        name: "סניקרס",
        count: 87,
        trend: "+18%",
        image:
          "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop",
      },
      {
        name: "כפכפים",
        count: 67,
        trend: "+15%",
        image:
          "https://images.unsplash.com/photo-1506629905607-d91bd87b799f?w=200&h=200&fit=crop",
      },
      {
        name: "מגפיים",
        count: 70,
        trend: "+22%",
        image:
          "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=200&h=200&fit=crop",
      },
    ],
  },
  {
    id: 5,
    name: "אביזרים",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    color: "from-amber-400 to-orange-500",
    count: 623,
    trending: true,
    subcategories: [
      {
        name: "תיקים",
        count: 189,
        trend: "+28%",
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
      },
      {
        name: "תכשיטים",
        count: 156,
        trend: "+35%",
        image:
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop",
      },
      {
        name: "משקפיים",
        count: 98,
        trend: "+12%",
        image:
          "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&h=200&fit=crop",
      },
      {
        name: "שעונים",
        count: 87,
        trend: "+20%",
        image:
          "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200&h=200&fit=crop",
      },
      {
        name: "כובעים",
        count: 93,
        trend: "+15%",
        image:
          "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=200&h=200&fit=crop",
      },
    ],
  },
  {
    id: 6,
    name: "ספורט",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    color: "from-red-400 to-pink-500",
    count: 534,
    trending: true,
    subcategories: [
      {
        name: "בגדי אימון",
        count: 167,
        trend: "+45%",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
      },
      {
        name: "נעלי ספורט",
        count: 134,
        trend: "+38%",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
      },
      {
        name: "בגדי ים",
        count: 89,
        trend: "+55%",
        image:
          "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=200&h=200&fit=crop",
      },
      {
        name: "ציוד כושר",
        count: 78,
        trend: "+22%",
        image:
          "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=200&h=200&fit=crop",
      },
      {
        name: "אביזרי ספורט",
        count: 66,
        trend: "+18%",
        image:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
      },
    ],
  },
];

// מותגים פופולריים
const popularBrands = [
  {
    name: "זארה",
    logo: "Z",
    count: 456,
    color: "bg-black",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop",
  },
  {
    name: "נייקי",
    logo: "✓",
    count: 389,
    color: "bg-orange-500",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
  },
  {
    name: "H&M",
    logo: "H",
    count: 345,
    color: "bg-red-500",
    image:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100&h=100&fit=crop",
  },
  {
    name: "אדידס",
    logo: "⚡",
    count: 298,
    color: "bg-blue-600",
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=100&h=100&fit=crop",
  },
  {
    name: "מנגו",
    logo: "M",
    count: 267,
    color: "bg-yellow-500",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=100&h=100&fit=crop",
  },
  {
    name: "פול אנד בר",
    logo: "P",
    count: 234,
    color: "bg-green-600",
    image:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
  },
];

function CategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const categoryParam = searchParams?.get("category");
    if (categoryParam) {
      const categoryId = parseInt(categoryParam);
      setSelectedCategory(categoryId);
    }
  }, [searchParams]);

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
    router.push(`/categories?category=${categoryId}`);
  };

  const handleSubcategoryClick = (
    categoryName: string,
    subcategoryName: string
  ) => {
    router.push(
      `/search?category=${encodeURIComponent(
        categoryName
      )}&subcategory=${encodeURIComponent(subcategoryName)}`
    );
  };

  const handleBrandClick = (brandName: string) => {
    router.push(`/search?brand=${encodeURIComponent(brandName)}`);
  };

  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
  };

  const filteredCategories = mainCategories.filter(
    (category) =>
      category.name.includes(searchQuery) ||
      category.subcategories.some((sub) => sub.name.includes(searchQuery))
  );

  const selectedCategoryData = selectedCategory
    ? mainCategories.find((cat) => cat.id === selectedCategory)
    : null;

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

      <div className="relative z-10 max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fadeIn">
          {selectedCategory ? (
            <button
              onClick={() => {
                setSelectedCategory(null);
                router.push("/categories");
              }}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
            >
              <IoArrowBackOutline className="w-6 h-6" />
              <span className="font-medium">חזור לקטגוריות</span>
            </button>
          ) : (
            <h1 className="text-3xl font-bold text-gradient">קטגוריות</h1>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            >
              {viewMode === "grid" ? (
                <IoListOutline className="w-5 h-5" />
              ) : (
                <IoGridOutline className="w-5 h-5" />
              )}
            </button>
            <button className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <IoFilterOutline className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 animate-slideIn">
          <IoSearchOutline className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="חפש קטגוריות..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-12 pl-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Selected Category View */}
        {selectedCategoryData ? (
          <div className="animate-fadeIn">
            {/* Category Header */}
            <div className="card mb-8 overflow-hidden">
              <div
                className={`h-32 bg-gradient-to-r ${selectedCategoryData.color} relative`}
              >
                <img
                  src={selectedCategoryData.image}
                  alt={selectedCategoryData.name}
                  className="w-full h-full object-cover mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 right-4 text-white">
                  <h2 className="text-2xl font-bold">
                    {selectedCategoryData.name}
                  </h2>
                  <p className="text-white/80">
                    {selectedCategoryData.count} מוצרים
                  </p>
                </div>
              </div>
            </div>

            {/* Subcategories */}
            <div
              className={`grid gap-4 ${
                viewMode === "grid"
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {selectedCategoryData.subcategories.map((subcategory, index) => (
                <div
                  key={subcategory.name}
                  className="card hover-lift cursor-pointer animate-slideIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() =>
                    handleSubcategoryClick(
                      selectedCategoryData.name,
                      subcategory.name
                    )
                  }
                >
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img
                      src={subcategory.image}
                      alt={subcategory.name}
                      className="w-full h-32 object-cover hover:scale-110 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(
                          `${selectedCategoryData.id}-${subcategory.name}`
                        );
                      }}
                      className="absolute top-2 left-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      {favorites.has(
                        `${selectedCategoryData.id}-${subcategory.name}`
                      ) ? (
                        <IoHeart className="w-4 h-4 text-red-500" />
                      ) : (
                        <IoHeartOutline className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    {subcategory.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      {subcategory.count} מוצרים
                    </span>
                    <div className="flex items-center gap-1 text-green-600">
                      <IoTrendingUpOutline className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {subcategory.trend}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Main Categories View */
          <div>
            {/* Main Categories */}
            <div
              className={`grid gap-6 mb-12 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredCategories.map((category, index) => (
                <div
                  key={category.id}
                  className="card hover-lift cursor-pointer overflow-hidden animate-slideIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="relative">
                    <div
                      className={`h-48 bg-gradient-to-r ${category.color} relative overflow-hidden`}
                    >
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover mix-blend-overlay hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20" />

                      {/* Trending Badge */}
                      {category.trending && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 animate-pulse-custom">
                          <IoTrendingUpOutline className="w-4 h-4" />
                          חם
                        </div>
                      )}

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(`category-${category.id}`);
                        }}
                        className="absolute top-4 left-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                      >
                        {favorites.has(`category-${category.id}`) ? (
                          <IoHeart className="w-5 h-5 text-red-500" />
                        ) : (
                          <IoHeartOutline className="w-5 h-5 text-gray-600" />
                        )}
                      </button>

                      {/* Category Info */}
                      <div className="absolute bottom-4 right-4 text-white">
                        <h3 className="text-2xl font-bold mb-1">
                          {category.name}
                        </h3>
                        <p className="text-white/80">{category.count} מוצרים</p>
                      </div>
                    </div>
                  </div>

                  {/* Subcategories Preview */}
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories
                        .slice(0, 3)
                        .map((sub, subIndex) => (
                          <span
                            key={subIndex}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                          >
                            {sub.name}
                          </span>
                        ))}
                      {category.subcategories.length > 3 && (
                        <span className="px-3 py-1 bg-gradient-primary text-white rounded-full text-sm">
                          +{category.subcategories.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Popular Brands */}
            <div className="animate-slideIn" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-gradient">
                  מותגים פופולריים
                </h2>
                <IoStarOutline className="w-6 h-6 text-yellow-500" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {popularBrands.map((brand, index) => (
                  <div
                    key={brand.name}
                    className="card hover-lift cursor-pointer text-center animate-slideIn"
                    style={{ animationDelay: `${(index + 6) * 0.05}s` }}
                    onClick={() => handleBrandClick(brand.name)}
                  >
                    <div className="relative mb-4">
                      <div
                        className={`w-16 h-16 ${brand.color} rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 hover:scale-110 transition-transform`}
                      >
                        {brand.logo}
                      </div>
                      <img
                        src={brand.image}
                        alt={brand.name}
                        className="w-12 h-12 rounded-lg object-cover mx-auto opacity-80 hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {brand.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {brand.count} מוצרים
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoriesPageWrapper() {
  return (
    <Suspense fallback={<div>טוען...</div>}>
      <CategoriesPage />
    </Suspense>
  );
}

export default CategoriesPageWrapper;
