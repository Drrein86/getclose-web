"use client";

import { useState } from "react";
import {
  Camera,
  Edit2,
  Heart,
  Package,
  Settings,
  Ruler,
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  Award,
  ShoppingBag,
  Clock,
  TrendingUp,
  Gift,
  Crown,
  Sparkles,
  Check,
  X,
  Shield,
  CreditCard,
  Truck,
  RotateCcw,
  Bell,
  Eye,
  Calendar,
  Activity,
  Zap,
} from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "ישראל ישראלי",
    email: "israel@example.com",
    phone: "050-1234567",
    address: "רחוב הרצל 1, תל אביב",
    image: "👤",
    joinDate: "2023-06-15",
    membershipLevel: "Gold",
    sizes: {
      shirt: "M",
      pants: "32",
      shoes: "42",
    },
    preferences: {
      newsletter: true,
      smsNotifications: false,
      emailNotifications: true,
      personalizedOffers: true,
    },
    stats: {
      totalOrders: 24,
      totalSpent: 2850,
      favoriteItems: 12,
      reviewsWritten: 8,
      loyaltyPoints: 1250,
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSizes, setIsEditingSizes] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleSaveSizes = () => {
    setIsEditingSizes(false);
  };

  const updatePreference = (key: string, value: boolean) => {
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
  };

  const recentOrders = [
    {
      id: 1,
      date: "2024-01-15",
      items: 2,
      total: 178,
      status: "delivered",
      image: "👕",
    },
    {
      id: 2,
      date: "2024-01-10",
      items: 1,
      total: 450,
      status: "shipped",
      image: "👟",
    },
    {
      id: 3,
      date: "2024-01-05",
      items: 3,
      total: 267,
      status: "delivered",
      image: "👖",
    },
  ];

  const achievements = [
    {
      id: 1,
      title: "קונה מתחיל",
      description: "הזמנה ראשונה",
      icon: "🎉",
      completed: true,
    },
    {
      id: 2,
      title: "חבר נאמן",
      description: "10 הזמנות",
      icon: "💎",
      completed: true,
    },
    {
      id: 3,
      title: "מבקר מומחה",
      description: "5 ביקורות",
      icon: "⭐",
      completed: true,
    },
    {
      id: 4,
      title: "קונה VIP",
      description: "50 הזמנות",
      icon: "👑",
      completed: false,
    },
  ];

  const getMembershipColor = (level: string) => {
    switch (level) {
      case "Gold":
        return "from-yellow-400 to-orange-500";
      case "Silver":
        return "from-gray-400 to-gray-500";
      case "Bronze":
        return "from-orange-400 to-red-500";
      default:
        return "from-purple-400 to-pink-500";
    }
  };

  const ProfileHeader = () => (
    <div className="card p-8 text-center animate-fadeIn">
      <div className="relative inline-block mb-6">
        <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-6xl text-white animate-pulse-custom">
          {profile.image}
        </div>
        <button className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white hover-scale">
          <Camera className="w-5 h-5" />
        </button>
        <div
          className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r ${getMembershipColor(
            profile.membershipLevel
          )} rounded-full flex items-center justify-center`}
        >
          <Crown className="w-4 h-4 text-white" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
      <p className="text-gray-600 mb-2">{profile.email}</p>
      <div className="flex items-center justify-center gap-2 mb-4">
        <span
          className={`bg-gradient-to-r ${getMembershipColor(
            profile.membershipLevel
          )} text-white px-3 py-1 rounded-full text-sm font-bold`}
        >
          {profile.membershipLevel} Member
        </span>
        <span className="text-gray-500 text-sm">
          מאז {new Date(profile.joinDate).toLocaleDateString("he-IL")}
        </span>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {profile.stats.totalOrders}
          </div>
          <div className="text-sm text-gray-600">הזמנות</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            ₪{profile.stats.totalSpent}
          </div>
          <div className="text-sm text-gray-600">סה"כ קניות</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {profile.stats.loyaltyPoints}
          </div>
          <div className="text-sm text-gray-600">נקודות</div>
        </div>
      </div>

      <button
        onClick={() => setIsEditing(true)}
        className="btn-primary flex items-center gap-2 mx-auto"
      >
        <Edit2 className="w-4 h-4" />
        עריכת פרופיל
      </button>
    </div>
  );

  const PersonalInfo = () => (
    <div className="space-y-6">
      <div className="card p-6 animate-slideIn">
        <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-purple-600" />
          פרטים אישיים
        </h3>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">שם מלא</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">אימייל</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">טלפון</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">כתובת</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                ביטול
              </button>
              <button onClick={handleSave} className="btn-primary px-6 py-3">
                שמור
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Mail className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium">{profile.email}</p>
                <p className="text-sm text-gray-600">כתובת אימייל</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Phone className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">{profile.phone}</p>
                <p className="text-sm text-gray-600">מספר טלפון</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <MapPin className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium">{profile.address}</p>
                <p className="text-sm text-gray-600">כתובת מגורים</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Size Preferences */}
      <div
        className="card p-6 animate-slideIn"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
            <Ruler className="w-5 h-5 text-blue-600" />
            מידות מועדפות
          </h3>
          <button
            onClick={() => setIsEditingSizes(!isEditingSizes)}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            {isEditingSizes ? "ביטול" : "עריכה"}
          </button>
        </div>

        {isEditingSizes ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                מידת חולצה
              </label>
              <select
                value={profile.sizes.shirt}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    sizes: { ...profile.sizes, shirt: e.target.value },
                  })
                }
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                מידת מכנסיים
              </label>
              <select
                value={profile.sizes.pants}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    sizes: { ...profile.sizes, pants: e.target.value },
                  })
                }
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="30">30</option>
                <option value="32">32</option>
                <option value="34">34</option>
                <option value="36">36</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                מידת נעליים
              </label>
              <select
                value={profile.sizes.shoes}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    sizes: { ...profile.sizes, shoes: e.target.value },
                  })
                }
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="40">40</option>
                <option value="41">41</option>
                <option value="42">42</option>
                <option value="43">43</option>
                <option value="44">44</option>
              </select>
            </div>
            <button onClick={handleSaveSizes} className="btn-primary w-full">
              שמור מידות
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl mb-2">👕</div>
              <p className="font-semibold">חולצה</p>
              <p className="text-lg font-bold text-blue-600">
                {profile.sizes.shirt}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl mb-2">👖</div>
              <p className="font-semibold">מכנסיים</p>
              <p className="text-lg font-bold text-green-600">
                {profile.sizes.pants}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl mb-2">👟</div>
              <p className="font-semibold">נעליים</p>
              <p className="text-lg font-bold text-purple-600">
                {profile.sizes.shoes}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Preferences */}
      <div
        className="card p-6 animate-slideIn"
        style={{ animationDelay: "0.2s" }}
      >
        <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-orange-600" />
          העדפות התראות
        </h3>

        <div className="space-y-4">
          {Object.entries(profile.preferences).map(([key, value], index) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div>
                <p className="font-medium">
                  {key === "newsletter" && "ניוזלטר"}
                  {key === "smsNotifications" && "התראות SMS"}
                  {key === "emailNotifications" && "התראות אימייל"}
                  {key === "personalizedOffers" && "הצעות מותאמות אישית"}
                </p>
                <p className="text-sm text-gray-600">
                  {key === "newsletter" &&
                    "קבל עדכונים על מוצרים חדשים ומבצעים"}
                  {key === "smsNotifications" && "התראות SMS על הזמנות ומבצעים"}
                  {key === "emailNotifications" &&
                    "התראות אימייל על פעילות החשבון"}
                  {key === "personalizedOffers" &&
                    "הצעות מותאמות בהתאם להעדפות שלך"}
                </p>
              </div>
              <button
                onClick={() => updatePreference(key, !value)}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                  value ? "bg-gradient-primary" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 transform ${
                    value ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const OrderHistory = () => (
    <div className="space-y-6">
      <div className="card p-6 animate-slideIn">
        <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          הזמנות אחרונות
        </h3>

        <div className="space-y-4">
          {recentOrders.map((order, index) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover-lift"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-2xl">
                  {order.image}
                </div>
                <div>
                  <p className="font-semibold">הזמנה #{order.id}</p>
                  <p className="text-sm text-gray-600">
                    {order.items} פריטים •{" "}
                    {new Date(order.date).toLocaleDateString("he-IL")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">₪{order.total}</p>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "shipped"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status === "delivered"
                    ? "נמסר"
                    : order.status === "shipped"
                    ? "נשלח"
                    : "בטיפול"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div
        className="card p-6 animate-slideIn"
        style={{ animationDelay: "0.1s" }}
      >
        <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-600" />
          הישגים
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                achievement.completed
                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className="font-semibold text-gray-900">
                  {achievement.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {achievement.description}
                </p>
                {achievement.completed && (
                  <div className="mt-2">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AccountSettings = () => (
    <div className="space-y-6">
      <div className="card p-6 animate-slideIn">
        <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          אבטחה וחשבון
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover-lift cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">שנה סיסמה</p>
                <p className="text-sm text-gray-600">
                  עדכן את סיסמת החשבון שלך
                </p>
              </div>
            </div>
            <div className="text-gray-400">
              <Edit2 className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover-lift cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">אמצעי תשלום</p>
                <p className="text-sm text-gray-600">
                  נהל כרטיסי אשראי ואמצעי תשלום
                </p>
              </div>
            </div>
            <div className="text-gray-400">
              <Edit2 className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover-lift cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">כתובות משלוח</p>
                <p className="text-sm text-gray-600">נהל כתובות משלוח</p>
              </div>
            </div>
            <div className="text-gray-400">
              <Edit2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div
        className="card p-6 animate-slideIn"
        style={{ animationDelay: "0.1s" }}
      >
        <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          פעולות חשבון
        </h3>

        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-xl hover:bg-yellow-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-yellow-800">ייצוא נתונים</p>
                <p className="text-sm text-yellow-600">
                  הורד את כל הנתונים שלך
                </p>
              </div>
            </div>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-red-800">מחק חשבון</p>
                <p className="text-sm text-red-600">מחיקה קבועה של החשבון</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

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
        <div className="max-w-6xl mx-auto p-4 py-8">
          {/* Profile Header */}
          <ProfileHeader />

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8 mt-8">
            {[
              { id: "info", label: "פרטים אישיים", icon: User },
              { id: "orders", label: "הזמנות והישגים", icon: Package },
              { id: "settings", label: "הגדרות חשבון", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "info" && <PersonalInfo />}
            {activeTab === "orders" && <OrderHistory />}
            {activeTab === "settings" && <AccountSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}
