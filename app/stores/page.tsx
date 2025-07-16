"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, Star, Clock, MapPin, ChevronLeft } from "lucide-react";

interface Store {
  id: number;
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  distance: string;
  isOpen: boolean;
  image?: string;
  description?: string;
}

// Import mock data from our centralized data file
import { mockStores as importedStores, storeCategories } from "@/lib/mockData";

const mockStores = importedStores.map((store) => ({
  id: parseInt(store.id),
  name: store.name,
  category: store.category.name,
  rating: store.rating,
  deliveryTime: `${store.deliveryInfo.estimatedTime.min}-${store.deliveryInfo.estimatedTime.max} דק`,
  distance: '0.8 ק"מ', // This would be calculated based on user location
  isOpen: store.isOpen,
  description: store.description,
}));

const categories = [
  "הכל",
  "מכולת",
  "אופנה",
  "בריאות ויופי",
  "שירותים",
  "אלקטרוניקה",
  "בית וגן",
];

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>(mockStores);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("הכל");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("distance"); // distance, rating, delivery_time
  const router = useRouter();

  useEffect(() => {
    // Filter and sort stores
    let filteredStores = mockStores.filter((store) => {
      const matchesSearch =
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "הכל" || store.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort stores
    switch (sortBy) {
      case "rating":
        filteredStores.sort((a, b) => b.rating - a.rating);
        break;
      case "delivery_time":
        filteredStores.sort((a, b) => {
          const aTime = parseInt(a.deliveryTime.split("-")[0]);
          const bTime = parseInt(b.deliveryTime.split("-")[0]);
          return aTime - bTime;
        });
        break;
      case "distance":
      default:
        filteredStores.sort((a, b) => {
          const aDistance = parseFloat(a.distance.split(" ")[0]);
          const bDistance = parseFloat(b.distance.split(" ")[0]);
          return aDistance - bDistance;
        });
        break;
    }

    setStores(filteredStores);
  }, [searchQuery, selectedCategory, sortBy]);

  const handleStoreClick = (storeId: number) => {
    router.push(`/stores/${storeId}`);
  };

  const handleBackToMap = () => {
    router.push("/map");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBackToMap}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">חנויות בקרבתך</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Filter className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="חפש חנויות..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <div className="py-4">
              <h3 className="font-medium text-gray-800 mb-3">קטגוריות</h3>
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

            <div className="py-4 border-t border-gray-100">
              <h3 className="font-medium text-gray-800 mb-3">מיון לפי</h3>
              <div className="flex gap-2">
                {[
                  { value: "distance", label: "מרחק" },
                  { value: "rating", label: "דירוג" },
                  { value: "delivery_time", label: "זמן משלוח" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      sortBy === option.value
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categories Scrollable */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex gap-3 overflow-x-auto">
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

      {/* Results Count */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <p className="text-gray-600 text-sm">נמצאו {stores.length} חנויות</p>
      </div>

      {/* Stores List */}
      <div className="p-4">
        {stores.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">לא נמצאו חנויות</p>
            <p className="text-gray-400 text-sm">
              נסה לשנות את הפילטרים או החיפוש
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {stores.map((store) => (
              <div
                key={store.id}
                onClick={() => handleStoreClick(store.id)}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  {/* Store Image Placeholder */}
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {store.name.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Store Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">
                          {store.name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {store.category}
                        </p>
                      </div>
                      {!store.isOpen && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                          סגור
                        </span>
                      )}
                    </div>

                    {store.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {store.description}
                      </p>
                    )}

                    {/* Store Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{store.rating}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{store.deliveryTime}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{store.distance}</span>
                        </div>
                      </div>

                      {store.isOpen && (
                        <span className="text-primary-600 font-medium text-sm">
                          זמין להזמנה
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
