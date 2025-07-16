"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/contexts/UserContext";
import {
  Store,
  Recycle,
  ShoppingBag,
  TrendingUp,
  Package,
  CreditCard,
  Users,
  BarChart3,
  Camera,
  MessageCircle,
  Star,
  MapPin,
  Clock,
  Shield,
  ChevronRight,
  Settings,
  Crown,
  Palette,
} from "lucide-react";

export default function UserTypePage() {
  const router = useRouter();
  const { setUserType } = useUser();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showAdminOption, setShowAdminOption] = useState(false);

  // Show admin option after 3 clicks on the header
  const [headerClicks, setHeaderClicks] = useState(0);
  const handleHeaderClick = () => {
    setHeaderClicks((prev) => prev + 1);
    if (headerClicks >= 2) {
      setShowAdminOption(true);
    }
  };

  const userTypes = [
    {
      id: "store",
      title: "בעל חנות",
      subtitle: "נהל את החנות שלך ומכור מוצרים",
      icon: Store,
      color: "from-blue-500 to-blue-600",
      features: [
        { icon: Package, text: "ניהול מלאי מתקדם" },
        { icon: TrendingUp, text: "דוחות מכירות ואנליטיקה" },
        { icon: Users, text: "ניהול לקוחות" },
        { icon: CreditCard, text: "מערכת תשלומים מאובטחת" },
        { icon: BarChart3, text: "מעקב ביצועים" },
        { icon: MapPin, text: "ניהול מיקום ומשלוחים" },
      ],
      route: "/my-store",
    },
    {
      id: "secondhand",
      title: "מוכר יד שנייה",
      subtitle: "מכור פריטים משומשים בקלות",
      icon: Recycle,
      color: "from-green-500 to-green-600",
      features: [
        { icon: Camera, text: "העלאת תמונות מהירה" },
        { icon: Star, text: "מערכת דירוגים ומוניטין" },
        { icon: MessageCircle, text: "צ'אט ישיר עם קונים" },
        { icon: Shield, text: "מכירה מאובטחת" },
        { icon: Clock, text: "פרסום מיידי" },
        { icon: TrendingUp, text: "מעקב אחר המכירות" },
      ],
      route: "/secondhand",
    },
    {
      id: "customer",
      title: "לקוח",
      subtitle: "קנה מוצרים מחנויות ומוכרים פרטיים",
      icon: ShoppingBag,
      color: "from-purple-500 to-purple-600",
      features: [
        { icon: Store, text: "גישה לכל החנויות" },
        { icon: Recycle, text: "שוק יד שנייה" },
        { icon: Star, text: "ביקורות ודירוגים" },
        { icon: MapPin, text: "חיפוש לפי מיקום" },
        { icon: CreditCard, text: "תשלום מאובטח" },
        { icon: Package, text: "מעקב הזמנות" },
      ],
      route: "/home",
    },
    {
      id: "admin",
      title: "מנהל מערכת",
      subtitle: "ניהול מלא של האתר והמערכת",
      icon: Crown,
      color: "from-red-500 to-pink-600",
      features: [
        { icon: Users, text: "ניהול כל המשתמשים" },
        { icon: Store, text: "פיקוח על חנויות" },
        { icon: Settings, text: "הגדרות מערכת" },
        { icon: Palette, text: "התאמת עיצוב האתר" },
        { icon: BarChart3, text: "דוחות מפורטים" },
        { icon: Shield, text: "הרשאות ואבטחה" },
      ],
      route: "/admin",
      isAdmin: true,
    },
  ];

  const handleContinue = () => {
    if (!selectedType) return;

    const userType = userTypes.find((type) => type.id === selectedType);
    if (userType) {
      // שמירת סוג המשתמש ב-localStorage
      setUserType(selectedType as any); // עדכון דרך הקונטקסט
      router.push(userType.route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div
            className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 cursor-pointer hover:scale-105 transition-transform"
            onClick={handleHeaderClick}
          >
            <Store className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ברוכים הבאים ל-GetClose
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            בחר את סוג החשבון שלך כדי להתחיל ליהנות מכל הפיצ'רים המותאמים עבורך
          </p>
          {showAdminOption && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl max-w-md mx-auto">
              <p className="text-sm text-red-700">
                🔓 מצב מנהל מערכת נפתח! עכשיו תוכל לבחור באפשרות "מנהל מערכת"
              </p>
            </div>
          )}
        </div>

        {/* User Type Cards */}
        <div
          className={`grid grid-cols-1 ${
            showAdminOption ? "lg:grid-cols-4" : "lg:grid-cols-3"
          } gap-8 mb-12`}
        >
          {userTypes
            .filter((type) => !type.isAdmin || showAdminOption)
            .map((type) => {
              const IconComponent = type.icon;
              const isSelected = selectedType === type.id;

              return (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`relative bg-white rounded-3xl shadow-xl p-8 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    isSelected
                      ? "ring-4 ring-purple-500 shadow-2xl"
                      : "hover:shadow-2xl"
                  }`}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="text-center mb-8">
                    <div
                      className={`w-20 h-20 bg-gradient-to-r ${type.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                    >
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {type.title}
                    </h3>
                    <p className="text-gray-600">{type.subtitle}</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    {type.features.map((feature, index) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center`}
                          >
                            <FeatureIcon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-gray-700 font-medium">
                            {feature.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Selection Button */}
                  <div className="mt-8">
                    <button
                      className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                        isSelected
                          ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {isSelected ? "נבחר" : "בחר אפשרות זו"}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Continue Button */}
        {selectedType && (
          <div className="text-center">
            <button
              onClick={handleContinue}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-12 py-4 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              המשך
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p>תוכל לשנות את סוג החשבון בכל עת דרך ההגדרות</p>
        </div>
      </div>
    </div>
  );
}
