"use client";

import { useState } from "react";
import {
  Bell,
  Settings,
  X,
  Check,
  Star,
  Package,
  Heart,
  Tag,
  Store,
  TrendingUp,
  MessageCircle,
  CheckCircle,
} from "lucide-react";

interface Notification {
  id: string;
  type:
    | "order"
    | "deal"
    | "price_drop"
    | "back_in_stock"
    | "review"
    | "store"
    | "trend"
    | "message"
    | "promotion"
    | "system";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  image?: string;
  priority: "low" | "medium" | "high";
  icon: any;
  color: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "order",
      title: "הזמנה חדשה התקבלה",
      message: "הזמנה #12345 התקבלה בהצלחה ובדרך אליך",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      isRead: false,
      actionUrl: "/orders",
      image: "📦",
      priority: "high",
      icon: Package,
      color: "bg-blue-500",
    },
    {
      id: "2",
      type: "message",
      title: "הודעה חדשה",
      message: "קיבלת הודעה חדשה מחנות זארה",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      isRead: false,
      priority: "medium",
      icon: MessageCircle,
      color: "bg-green-500",
    },
    {
      id: "3",
      type: "promotion",
      title: "מבצע מיוחד!",
      message: "50% הנחה על כל הנעליים - רק היום!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isRead: true,
      priority: "high",
      icon: Tag,
      color: "bg-red-500",
    },
    {
      id: "4",
      type: "review",
      title: "ביקורת חדשה",
      message: "קיבלת ביקורת של 5 כוכבים על המוצר שלך",
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      isRead: true,
      priority: "low",
      icon: Star,
      color: "bg-yellow-500",
    },
    {
      id: "5",
      type: "system",
      title: "עדכון מערכת",
      message: "המערכת עודכנה עם פיצ'רים חדשים",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: true,
      priority: "low",
      icon: Bell,
      color: "bg-purple-500",
    },
  ]);

  const [filter, setFilter] = useState<"all" | "unread" | "deals" | "orders">(
    "all"
  );
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    deals: true,
    priceDrops: true,
    backInStock: true,
    orders: true,
    reviews: false,
    trends: true,
    stores: true,
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="w-5 h-5" />;
      case "deal":
        return <Tag className="w-5 h-5" />;
      case "price_drop":
        return <TrendingUp className="w-5 h-5 rotate-180" />;
      case "back_in_stock":
        return <Package className="w-5 h-5" />;
      case "review":
        return <Star className="w-5 h-5" />;
      case "store":
        return <Store className="w-5 h-5" />;
      case "trend":
        return <TrendingUp className="w-5 h-5" />;
      case "message":
        return <MessageCircle className="w-5 h-5" />;
      case "promotion":
        return <Tag className="w-5 h-5" />;
      case "system":
        return <Bell className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getIconColor = (type: string, priority: string) => {
    if (priority === "high") return "text-red-600 bg-red-100";
    if (priority === "medium") return "text-blue-600 bg-blue-100";
    return "text-gray-600 bg-gray-100";
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.isRead;
    if (filter === "deals")
      return notification.type === "deal" || notification.type === "price_drop";
    if (filter === "orders") return notification.type === "order";
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `לפני ${minutes} דקות`;
    if (hours < 24) return `לפני ${hours} שעות`;
    return `לפני ${days} ימים`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-8 h-8 text-primary-600" />
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">התראות</h1>
              <p className="text-gray-600">{unreadCount} התראות לא נקראו</p>
            </div>
          </div>

          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>סמן הכל כנקרא</span>
              </button>
            )}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { key: "all", label: "הכל", count: notifications.length },
            { key: "unread", label: "לא נקראו", count: unreadCount },
            {
              key: "deals",
              label: "מבצעים",
              count: notifications.filter(
                (n) => n.type === "deal" || n.type === "price_drop"
              ).length,
            },
            {
              key: "orders",
              label: "הזמנות",
              count: notifications.filter((n) => n.type === "order").length,
            },
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                filter === filterOption.key
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filterOption.label}
              <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                {filterOption.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              אין התראות
            </h3>
            <p className="text-gray-500">כל ההתראות שלך יופיעו כאן</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-2xl shadow-lg p-4 transition-all hover:shadow-xl ${
                !notification.isRead ? "border-r-4 border-primary-600" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-2 rounded-lg ${getIconColor(
                    notification.type,
                    notification.priority
                  )}`}
                >
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3
                        className={`font-medium ${
                          !notification.isRead ? "font-bold" : ""
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {notification.message}
                      </p>
                    </div>

                    {notification.image && (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl ml-4">
                        {notification.image}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {formatTime(notification.timestamp)}
                    </span>

                    <div className="flex items-center gap-2">
                      {notification.actionUrl && (
                        <button className="text-primary-600 text-sm hover:underline">
                          צפה
                        </button>
                      )}

                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-gray-500 hover:text-primary-600 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">הגדרות התראות</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-3">סוגי התראות</h3>
                <div className="space-y-3">
                  {[
                    { key: "deals", label: "מבצעים והנחות", icon: "🏷️" },
                    { key: "priceDrops", label: "ירידות מחיר", icon: "📉" },
                    { key: "backInStock", label: "חזרה למלאי", icon: "📦" },
                    { key: "orders", label: "עדכוני הזמנות", icon: "🚚" },
                    { key: "reviews", label: "בקשות לביקורת", icon: "⭐" },
                    { key: "trends", label: "טרנדים חדשים", icon: "🔥" },
                    { key: "stores", label: "עדכוני חנויות", icon: "🏪" },
                  ].map((setting) => (
                    <label
                      key={setting.key}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{setting.icon}</span>
                        <span className="text-sm">{setting.label}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={
                          notificationSettings[
                            setting.key as keyof typeof notificationSettings
                          ]
                        }
                        onChange={(e) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            [setting.key]: e.target.checked,
                          }))
                        }
                        className="rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-3">אמצעי התראה</h3>
                <div className="space-y-3">
                  {[
                    {
                      key: "pushNotifications",
                      label: "התראות דחיפה",
                      icon: "📱",
                    },
                    {
                      key: "emailNotifications",
                      label: "התראות במייל",
                      icon: "📧",
                    },
                    {
                      key: "smsNotifications",
                      label: "התראות SMS",
                      icon: "📲",
                    },
                  ].map((method) => (
                    <label
                      key={method.key}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{method.icon}</span>
                        <span className="text-sm">{method.label}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={
                          notificationSettings[
                            method.key as keyof typeof notificationSettings
                          ]
                        }
                        onChange={(e) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            [method.key]: e.target.checked,
                          }))
                        }
                        className="rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 transition-colors"
                >
                  שמור הגדרות
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
