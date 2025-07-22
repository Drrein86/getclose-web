"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  X,
  Star,
  MapPin,
  Clock,
  Tag,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { mockStores, storeCategories } from "@/src/lib/mockData";
import { SearchFilters, Store, Product } from "@/src/types";

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState<"all" | "stores" | "products">(
    "all"
  );
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const [filters, setFilters] = useState<SearchFilters>({
    category: "",
    priceRange: { min: 0, max: 1000 },
    sizes: [],
    colors: [],
    brands: [],
    rating: 0,
    distance: 10,
    isOnSale: false,
    inStock: true,
  });

  // AI suggestions based on search query
  const generateAISuggestions = (query: string) => {
    const suggestions = [
      "חולצות כותנה בצבע כחול",
      "נעלי ספורט נייקי מידה 42",
      "שמלות ערב אלגנטיות",
      "ג'ינס סקיני בהנחה",
      "מעילי חורף חמים",
      "תיקי יד מעור איכותי",
    ];

    return suggestions
      .filter((s) => query.length > 2 && s.includes(query.substring(0, 3)))
      .slice(0, 3);
  };

  // Smart search with AI-like filtering
  const performSearch = () => {
    setIsLoading(true);

    // Simulate AI search delay
    setTimeout(() => {
      let results: any[] = [];

      if (searchType === "all" || searchType === "stores") {
        const storeResults = mockStores.filter(
          (store) =>
            store.name.includes(searchQuery) ||
            (store.description || "").includes(searchQuery) ||
            (store.category?.name || "").includes(searchQuery)
        );
        results = [
          ...results,
          ...storeResults.map((store) => ({ ...store, type: "store" })),
        ];
      }

      if (searchType === "all" || searchType === "products") {
        // Mock product search results
        const mockProducts = [
          {
            id: "1",
            name: "חולצה כחולה",
            price: 120,
            store: "זארה",
            type: "product",
            image: "👕",
          },
          {
            id: "2",
            name: "נעלי ספורט",
            price: 450,
            store: "נייקי",
            type: "product",
            image: "👟",
          },
          {
            id: "3",
            name: "שמלה שחורה",
            price: 280,
            store: "זארה",
            type: "product",
            image: "👗",
          },
        ];

        const productResults = mockProducts.filter(
          (product) =>
            product.name.includes(searchQuery) ||
            product.store.includes(searchQuery)
        );
        results = [...results, ...productResults];
      }

      setSearchResults(results);
      setAiSuggestions(generateAISuggestions(searchQuery));
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    if (searchQuery.length > 2) {
      performSearch();
    } else {
      setSearchResults([]);
      setAiSuggestions([]);
    }
  }, [searchQuery, searchType]);

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen overflow-y-auto">
      {/* Search Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="חפש מוצרים, חנויות, מותגים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Search Type Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { key: "all", label: "הכל", icon: "🔍" },
            { key: "stores", label: "חנויות", icon: "🏪" },
            { key: "products", label: "מוצרים", icon: "👕" },
          ].map((type) => (
            <button
              key={type.key}
              onClick={() => setSearchType(type.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                searchType === type.key
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">
                הצעות חכמות
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(suggestion)}
                  className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 hover:bg-gray-50 border border-gray-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  טווח מחירים
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="מ-"
                    value={filters.priceRange?.min}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: {
                          ...prev.priceRange!,
                          min: Number(e.target.value),
                        },
                      }))
                    }
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="עד"
                    value={filters.priceRange?.max}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: {
                          ...prev.priceRange!,
                          max: Number(e.target.value),
                        },
                      }))
                    }
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  דירוג מינימלי
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, rating: star }))
                      }
                      className={`p-1 ${
                        star <= (filters.rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  מרחק מקסימלי: {filters.distance} ק"מ
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={filters.distance}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      distance: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isOnSale}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        isOnSale: e.target.checked,
                      }))
                    }
                    className="ml-2"
                  />
                  <span className="text-sm">רק מוצרים במבצע</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        inStock: e.target.checked,
                      }))
                    }
                    className="ml-2"
                  />
                  <span className="text-sm">רק מוצרים במלאי</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-500">מחפש...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                נמצאו {searchResults.length} תוצאות
              </p>
            </div>

            {searchResults.map((result, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                {result.type === "store" ? (
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => router.push(`/stores/${result.id}`)}
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                      🏪
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{result.name}</h3>
                      <p className="text-gray-600 text-sm">
                        {result.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{result.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{result.distance}km</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{result.deliveryTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => router.push(`/product/${result.id}`)}
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                      {result.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{result.name}</h3>
                      <p className="text-gray-600 text-sm">מ-{result.store}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xl font-bold text-primary-600">
                          ₪{result.price}
                        </span>
                        <div className="flex items-center gap-1">
                          <Tag className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600">זמין</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        ) : searchQuery.length > 2 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">לא נמצאו תוצאות</p>
            <p className="text-gray-400 text-sm">
              נסה מילות חיפוש אחרות או שנה את הפילטרים
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
