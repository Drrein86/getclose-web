"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MapPin,
  Phone,
  RotateCcw,
  Star,
  ChevronLeft,
  Loader2,
  ShoppingBag,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { getUserOrders } from "@/src/lib/database";
import { Order } from "@/src/types";

interface OrderWithDetails {
  id: string;
  userId: string;
  storeId: string;
  status: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  store?: {
    name: string;
    phone?: string;
  };
  orderItems?: Array<{
    id: string;
    quantity: number;
    pricePerItem: number;
    product: {
      id: string;
      name: string;
      images: string[];
      category?: {
        name: string;
      };
    };
  }>;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      // בשלב זה אנחנו נשתמש במשתמש קבוע עד שתהיה מערכת התחברות
      const userOrders = await getUserOrders("1");
      setOrders(userOrders as OrderWithDetails[]);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "בהכנה";
      case "CONFIRMED":
        return "אושר";
      case "SHIPPED":
        return "נשלח";
      case "DELIVERED":
        return "נמסר";
      case "CANCELLED":
        return "בוטל";
      default:
        return status;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return Clock;
      case "CONFIRMED":
        return CheckCircle;
      case "SHIPPED":
        return Truck;
      case "DELIVERED":
        return Package;
      case "CANCELLED":
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const formatPrice = (price: number) => {
    return `₪${price.toFixed(2)}`;
  };

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "active")
      return ["PENDING", "CONFIRMED", "SHIPPED"].includes(order.status);
    if (activeFilter === "completed") return order.status === "DELIVERED";
    if (activeFilter === "cancelled") return order.status === "CANCELLED";
    return true;
  });

  const OrderCard = ({ order }: { order: OrderWithDetails }) => {
    const StatusIcon = getOrderStatusIcon(order.status);

    return (
      <div
        className="card hover-lift cursor-pointer"
        onClick={() => router.push(`/order-tracking?id=${order.id}`)}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              הזמנה #{order.id}
            </h3>
            <p className="text-sm text-gray-600">
              {new Date(order.createdAt).toLocaleDateString("he-IL")} •{" "}
              {order.store?.name || "חנות"}
            </p>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(
              order.status
            )}`}
          >
            <StatusIcon className="w-4 h-4" />
            {getOrderStatusText(order.status)}
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-2 mb-4">
          {order.orderItems?.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                {item.product.images?.[0] ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <ShoppingBag className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.product.name}</p>
                <p className="text-sm text-gray-600">
                  כמות: {item.quantity} • {formatPrice(item.pricePerItem)}
                </p>
              </div>
            </div>
          ))}
          {(order.orderItems?.length || 0) > 2 && (
            <p className="text-sm text-gray-500 text-center">
              +{(order.orderItems?.length || 0) - 2} פריטים נוספים
            </p>
          )}
        </div>

        {/* Order Total */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {order.orderItems?.length || 0} פריטים
          </div>
          <div className="text-lg font-bold text-gray-900">
            {formatPrice(order.totalAmount)}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/order-tracking?id=${order.id}`);
            }}
            className="flex-1 btn-secondary text-sm py-2"
          >
            מעקב הזמנה
          </button>
          {order.status === "DELIVERED" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: navigate to review page
              }}
              className="flex-1 btn-primary text-sm py-2"
            >
              כתוב ביקורת
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gray-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">טוען הזמנות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full opacity-10 animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full opacity-10 animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full opacity-5 animate-pulse-custom" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-4 animate-bounce-custom">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">ההזמנות שלי</h1>
          <p className="text-gray-600 text-lg">
            מעקב אחר כל ההזמנות שלך במקום אחד
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center p-4 animate-slideIn">
            <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
            <p className="text-sm text-gray-600">סה"כ הזמנות</p>
          </div>
          <div
            className="card text-center p-4 animate-slideIn"
            style={{ animationDelay: "0.1s" }}
          >
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">
              {
                orders.filter((o) =>
                  ["PENDING", "CONFIRMED", "SHIPPED"].includes(o.status)
                ).length
              }
            </p>
            <p className="text-sm text-gray-600">בתהליך</p>
          </div>
          <div
            className="card text-center p-4 animate-slideIn"
            style={{ animationDelay: "0.2s" }}
          >
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">
              {orders.filter((o) => o.status === "DELIVERED").length}
            </p>
            <p className="text-sm text-gray-600">הושלמו</p>
          </div>
          <div
            className="card text-center p-4 animate-slideIn"
            style={{ animationDelay: "0.3s" }}
          >
            <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">
              {orders
                .reduce((sum, order) => sum + order.totalAmount, 0)
                .toFixed(0)}
              ₪
            </p>
            <p className="text-sm text-gray-600">סה"כ הוצאה</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div
          className="card mb-8 animate-slideIn"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "הכל", count: orders.length },
              {
                id: "active",
                label: "פעילות",
                count: orders.filter((o) =>
                  ["PENDING", "CONFIRMED", "SHIPPED"].includes(o.status)
                ).length,
              },
              {
                id: "completed",
                label: "הושלמו",
                count: orders.filter((o) => o.status === "DELIVERED").length,
              },
              {
                id: "cancelled",
                label: "בוטלו",
                count: orders.filter((o) => o.status === "CANCELLED").length,
              },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeFilter === filter.id
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
                {filter.count > 0 && (
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      activeFilter === filter.id
                        ? "bg-white text-black"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="card text-center py-12 animate-fadeIn">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeFilter === "all"
                ? "אין הזמנות עדיין"
                : "אין הזמנות בקטגוריה זו"}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeFilter === "all"
                ? "התחל לקנות כדי לראות את ההזמנות שלך כאן"
                : "נסה לבחור קטגוריה אחרת או התחל לקנות"}
            </p>
            <button onClick={() => router.push("/")} className="btn-primary">
              התחל לקנות
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <div
                key={order.id}
                className="animate-slideIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <OrderCard order={order} />
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <button
              onClick={() => router.push("/order-tracking")}
              className="card p-6 text-center hover-lift cursor-pointer animate-slideIn"
              style={{ animationDelay: "0.5s" }}
            >
              <Truck className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                מעקב הזמנות
              </h3>
              <p className="text-gray-600 text-sm">
                מעקב מפורט אחר הזמנות פעילות
              </p>
            </button>

            <button
              onClick={() => router.push("/support")}
              className="card p-6 text-center hover-lift cursor-pointer animate-slideIn"
              style={{ animationDelay: "0.6s" }}
            >
              <Phone className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                תמיכה
              </h3>
              <p className="text-gray-600 text-sm">
                צריך עזרה? אנחנו כאן בשבילך
              </p>
            </button>
          </div>
        )}

        {/* Footer */}
        <div
          className="text-center mt-12 animate-fadeIn"
          style={{ animationDelay: "0.7s" }}
        >
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Package className="w-4 h-4 text-gray-500" />
            תודה על הקנייה! אנחנו שמחים לשרת אותך
          </p>
        </div>
      </div>
    </div>
  );
}
