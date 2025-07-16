"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Clock, Star } from "lucide-react";

// Mock data for stores
const mockStores = [
  {
    id: 1,
    name: "זאירה",
    category: "אופנה",
    rating: 4.3,
    deliveryTime: "30-45 דק",
    distance: '0.8 ק"מ',
    isOpen: true,
    lat: 32.0853,
    lng: 34.7818,
  },
  {
    id: 2,
    name: "Pull and Bear",
    category: "אופנה",
    rating: 4.1,
    deliveryTime: "25-40 דק",
    distance: '1.2 ק"מ',
    isOpen: true,
    lat: 32.0863,
    lng: 34.7828,
  },
  {
    id: 3,
    name: "שירותי השלמה",
    category: "שירותים",
    rating: 4.5,
    deliveryTime: "15-30 דק",
    distance: '0.5 ק"מ',
    isOpen: true,
    lat: 32.0843,
    lng: 34.7808,
  },
  {
    id: 4,
    name: "איסוף והשלמה",
    category: "שירותים",
    rating: 4.2,
    deliveryTime: "20-35 דק",
    distance: '0.9 ק"מ',
    isOpen: false,
    lat: 32.0873,
    lng: 34.7838,
  },
];

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to Tel Aviv
          setUserLocation({ lat: 32.0853, lng: 34.7818 });
        }
      );
    }
  }, []);

  const filteredStores = mockStores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStoreSelect = (storeId: number) => {
    router.push(`/stores/${storeId}`);
  };

  const handleViewStores = () => {
    router.push("/stores");
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto scrollbar-thin">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="חפש חנויות או קטגוריות..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-96 bg-gray-200">
        {/* Map Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-primary-500 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">מפה תוצג כאן</p>
            <p className="text-gray-400 text-sm">Google Maps API נדרש</p>
          </div>
        </div>

        {/* Location indicator */}
        <div className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg">
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
          <button className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-50">
            <span className="text-xl font-bold text-gray-600">+</span>
          </button>
          <button className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-50">
            <span className="text-xl font-bold text-gray-600">-</span>
          </button>
        </div>
      </div>

      {/* Store List */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">חנויות בקרבתך</h2>
          <button
            onClick={handleViewStores}
            className="text-primary-600 font-medium hover:text-primary-700"
          >
            הצג הכל
          </button>
        </div>

        <div className="space-y-3">
          {filteredStores.slice(0, 4).map((store) => (
            <div
              key={store.id}
              onClick={() => handleStoreSelect(store.id)}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-800">
                      {store.name}
                    </h3>
                    {!store.isOpen && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        סגור
                      </span>
                    )}
                  </div>

                  <p className="text-gray-500 text-sm mb-2">{store.category}</p>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{store.rating}</span>
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
                </div>

                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary-500 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">לא נמצאו חנויות</p>
            <p className="text-gray-400 text-sm">נסה לחפש משהו אחר</p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={handleViewStores}
          className="w-full bg-primary-600 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg hover:bg-primary-700 transition-colors"
        >
          הצג את כל החנויות
        </button>
      </div>
    </div>
  );
}
