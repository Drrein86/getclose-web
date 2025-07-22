"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import {
  getUserById,
  getUserOrders,
  getUserFavorites,
} from "@/src/lib/database";
import { User as UserType } from "@/src/types";
import { UserType as LocalUserType } from "@/src/utils/userPermissions";

interface UserStats {
  ordersCount: number;
  favoritesCount: number;
  reviewsCount: number;
  avgRating: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    ordersCount: 0,
    favoritesCount: 0,
    reviewsCount: 0,
    avgRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: "👤",
    joinDate: "",
    membershipLevel: "Bronze",
    sizes: {
      shirt: "M",
      pants: "32",
      shoes: "42",
    },
    preferences: {
      notifications: true,
      newsletter: false,
      promotions: true,
    },
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // בשלב זה אנחנו נשתמש במשתמש קבוע עד שתהיה מערכת התחברות
      const userData = await getUserById("1");

      if (userData) {
        // המרת UserType מ-Prisma לטיפוס המקומי
        const userTypeMapping: { [key: string]: LocalUserType } = {
          CUSTOMER: "customer",
          STORE_OWNER: "store",
          SECONDHAND_SELLER: "secondhand",
          HYBRID: "hybrid",
          ADMIN: "",
        };

        const mappedUser = {
          ...userData,
          userType: userTypeMapping[userData.userType] || "customer",
        };

        setUser(mappedUser as unknown as UserType);

        // עדכון נתוני הפרופיל
        setProfile({
          name: userData.name,
          email: userData.email,
          phone: userData.phone || "",
          address: userData.addresses?.[0]
            ? `${userData.addresses[0].street}, ${userData.addresses[0].city}`
            : "",
          image: userData.avatar || "👤",
          joinDate: userData.createdAt.toISOString().split("T")[0],
          membershipLevel: getUserMembershipLevel(userData.createdAt),
          sizes: {
            shirt: "M",
            pants: "32",
            shoes: "42",
          },
          preferences: {
            notifications: true,
            newsletter: false,
            promotions: true,
          },
        });

        // טעינת נתונים סטטיסטיים
        await loadUserStats(userData.id);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async (userId: string) => {
    try {
      // ספירת הזמנות, מועדפים וביקורות
      const [orders, favorites] = await Promise.all([
        getUserOrders(userId).catch(() => []),
        getUserFavorites(userId).catch(() => []),
      ]);

      // כרגע אין פונקציית getUserReviews, נשתמש בערך ברירת מחדל
      const reviews: any[] = [];
      const avgRating = 0;

      setUserStats({
        ordersCount: orders.length,
        favoritesCount: favorites.length,
        reviewsCount: reviews.length,
        avgRating: Math.round(avgRating * 10) / 10,
      });
    } catch (error) {
      console.error("Error loading user stats:", error);
    }
  };

  const getUserMembershipLevel = (joinDate: Date) => {
    const monthsSinceJoin = Math.floor(
      (Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    if (monthsSinceJoin >= 12) return "Platinum";
    if (monthsSinceJoin >= 6) return "Gold";
    if (monthsSinceJoin >= 3) return "Silver";
    return "Bronze";
  };

  const getMembershipColor = (level: string) => {
    switch (level) {
      case "Platinum":
        return "from-purple-500 to-pink-500";
      case "Gold":
        return "from-yellow-500 to-orange-500";
      case "Silver":
        return "from-gray-400 to-gray-600";
      default:
        return "from-orange-500 to-red-500";
    }
  };

  const getMembershipIcon = (level: string) => {
    switch (level) {
      case "Platinum":
        return Crown;
      case "Gold":
        return Award;
      case "Silver":
        return Star;
      default:
        return Shield;
    }
  };

  const handleSave = async () => {
    // כאן נעדכן את המשתמש במסד הנתונים
    setEditing(false);
    // TODO: implement user update API call
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gray-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">טוען פרופיל...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">
            שגיאה בטעינת פרופיל המשתמש
          </p>
          <button
            onClick={loadUserData}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full opacity-10 animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full opacity-10 animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full opacity-5 animate-pulse-custom" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold text-gradient mb-2">הפרופיל שלי</h1>
          <p className="text-gray-600 text-lg">נהל את הפרטים האישיים שלך</p>
        </div>

        {/* Profile Card */}
        <div className="card mb-8 animate-slideIn">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
            {/* Profile Image */}
            <div className="relative group">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-6xl animate-bounce-custom">
                {profile.image}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-300 hover-scale">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-right">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  {profile.name}
                </h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="btn-secondary flex items-center gap-2 hover-scale"
                >
                  {editing ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Edit2 className="w-4 h-4" />
                  )}
                  {editing ? "בטל" : "ערוך"}
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-gray-600 flex items-center gap-2 justify-center md:justify-start">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </p>
                <p className="text-gray-600 flex items-center gap-2 justify-center md:justify-start">
                  <Phone className="w-4 h-4" />
                  {profile.phone || "לא הוזן מספר טלפון"}
                </p>
                <p className="text-gray-600 flex items-center gap-2 justify-center md:justify-start">
                  <MapPin className="w-4 h-4" />
                  {profile.address || "לא הוזנה כתובת"}
                </p>
                <p className="text-gray-600 flex items-center gap-2 justify-center md:justify-start">
                  <Calendar className="w-4 h-4" />
                  חבר מאז{" "}
                  {new Date(profile.joinDate).toLocaleDateString("he-IL")}
                </p>
              </div>

              {/* Membership Badge */}
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getMembershipColor(
                  profile.membershipLevel
                )} text-white font-semibold animate-glow`}
              >
                {(() => {
                  const IconComponent = getMembershipIcon(
                    profile.membershipLevel
                  );
                  return <IconComponent className="w-5 h-5" />;
                })()}
                חבר {profile.membershipLevel}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl animate-fadeIn">
              <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">
                {userStats.ordersCount}
              </p>
              <p className="text-sm text-gray-600">הזמנות</p>
            </div>
            <div
              className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl animate-fadeIn"
              style={{ animationDelay: "0.1s" }}
            >
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-500">
                {userStats.favoritesCount}
              </p>
              <p className="text-sm text-gray-600">מועדפים</p>
            </div>
            <div
              className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl animate-fadeIn"
              style={{ animationDelay: "0.2s" }}
            >
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-500">
                {userStats.reviewsCount}
              </p>
              <p className="text-sm text-gray-600">ביקורות</p>
            </div>
            <div
              className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl animate-fadeIn"
              style={{ animationDelay: "0.3s" }}
            >
              <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-500">
                {userStats.avgRating || "—"}
              </p>
              <p className="text-sm text-gray-600">דירוג ממוצע</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="card mb-8 animate-slideIn">
            <h3 className="text-2xl font-bold text-gradient mb-6">
              עריכת פרטים אישיים
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם מלא
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  אימייל
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  טלפון
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  כתובת
                </label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                className="btn-primary flex items-center gap-2 hover-scale"
              >
                <Check className="w-4 h-4" />
                שמור שינויים
              </button>
              <button
                onClick={() => setEditing(false)}
                className="btn-secondary flex items-center gap-2 hover-scale"
              >
                <X className="w-4 h-4" />
                בטל
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center hover-lift cursor-pointer animate-slideIn">
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              המועדפים שלי
            </h3>
            <p className="text-gray-600 text-sm mb-4">כל הפריטים שאהבת</p>
            <button className="btn-secondary w-full">צפה במועדפים</button>
          </div>

          <div
            className="card p-6 text-center hover-lift cursor-pointer animate-slideIn"
            style={{ animationDelay: "0.1s" }}
          >
            <Package className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ההזמנות שלי
            </h3>
            <p className="text-gray-600 text-sm mb-4">מעקב אחר הזמנות</p>
            <button className="btn-secondary w-full">צפה בהזמנות</button>
          </div>

          <div
            className="card p-6 text-center hover-lift cursor-pointer animate-slideIn"
            style={{ animationDelay: "0.2s" }}
          >
            <Settings className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">הגדרות</h3>
            <p className="text-gray-600 text-sm mb-4">נהל את ההעדפות שלך</p>
            <button className="btn-secondary w-full">פתח הגדרות</button>
          </div>
        </div>

        {/* Footer */}
        <div
          className="text-center mt-12 animate-fadeIn"
          style={{ animationDelay: "0.4s" }}
        >
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-gray-500" />
            תודה שאתה חלק מהקהילה שלנו
          </p>
        </div>
      </div>
    </div>
  );
}
