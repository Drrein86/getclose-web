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
} from "lucide-react";
import { formatPrice, getOrderStatusText } from "@/lib/mockData";
import { Order, OrderStatus } from "@/types";

// הזמנות מדומות
const mockOrders: Order[] = [
  {
    id: "1",
    userId: "user1",
    storeId: "1",
    store: {
      id: "1",
      name: "זארא",
      contact: { phone: "03-1234567" },
      address: {
        id: "1",
        label: "חנות ראשית",
        street: "דיזנגוף 123",
        city: "תל אביב",
        postalCode: "6473424",
        coordinates: { lat: 32.0853, lng: 34.7818 },
        isDefault: true,
      },
    } as any,
    items: [
      {
        id: "1",
        productId: "1",
        product: {
          id: "1",
          name: "חולצת טי שירט בסיסית",
          images: ["/products/tshirt-1.jpg"],
          category: { id: "1", name: "חולצות", icon: "👕" },
        } as any,
        quantity: 2,
        selectedSize: {
          id: "m",
          name: "M",
          type: "clothing",
          isAvailable: true,
        },
        selectedColor: {
          id: "black",
          name: "שחור",
          hexCode: "#000000",
          isAvailable: true,
        },
        price: 89,
        totalPrice: 178,
      },
    ],
    status: OrderStatus.DELIVERED,
    statusHistory: [
      {
        status: OrderStatus.PENDING,
        timestamp: new Date("2024-01-15T10:00:00"),
      },
      {
        status: OrderStatus.CONFIRMED,
        timestamp: new Date("2024-01-15T10:15:00"),
      },
      {
        status: OrderStatus.PREPARING,
        timestamp: new Date("2024-01-15T11:00:00"),
      },
      {
        status: OrderStatus.OUT_FOR_DELIVERY,
        timestamp: new Date("2024-01-15T14:00:00"),
      },
      {
        status: OrderStatus.DELIVERED,
        timestamp: new Date("2024-01-15T15:30:00"),
      },
    ],
    totalAmount: 203,
    subtotal: 178,
    deliveryFee: 25,
    discount: 0,
    paymentMethod: { type: "card", details: { cardLast4: "1234" } },
    deliveryAddress: {
      id: "1",
      label: "בית",
      street: "הרצל 15",
      city: "תל אביב",
      postalCode: "6473427",
      coordinates: { lat: 32.0853, lng: 34.7818 },
      isDefault: true,
    },
    estimatedDeliveryTime: new Date("2024-01-15T15:00:00"),
    actualDeliveryTime: new Date("2024-01-15T15:30:00"),
    notes: "השאירו ליד הדלת",
    createdAt: new Date("2024-01-15T10:00:00"),
    updatedAt: new Date("2024-01-15T15:30:00"),
  },
  {
    id: "2",
    userId: "user1",
    storeId: "1",
    store: {
      id: "1",
      name: "זארא",
      contact: { phone: "03-1234567" },
      address: {
        id: "1",
        label: "חנות ראשית",
        street: "דיזנגוף 123",
        city: "תל אביב",
        postalCode: "6473424",
        coordinates: { lat: 32.0853, lng: 34.7818 },
        isDefault: true,
      },
    } as any,
    items: [
      {
        id: "2",
        productId: "2",
        product: {
          id: "2",
          name: "ג'ינס סקיני",
          images: ["/products/jeans-1.jpg"],
          category: { id: "2", name: "מכנסיים", icon: "👖" },
        } as any,
        quantity: 1,
        selectedSize: {
          id: "s",
          name: "S",
          type: "clothing",
          isAvailable: true,
        },
        selectedColor: {
          id: "blue",
          name: "כחול",
          hexCode: "#0000FF",
          isAvailable: true,
        },
        price: 199,
        totalPrice: 199,
      },
    ],
    status: OrderStatus.OUT_FOR_DELIVERY,
    statusHistory: [
      {
        status: OrderStatus.PENDING,
        timestamp: new Date("2024-01-16T09:00:00"),
      },
      {
        status: OrderStatus.CONFIRMED,
        timestamp: new Date("2024-01-16T09:15:00"),
      },
      {
        status: OrderStatus.PREPARING,
        timestamp: new Date("2024-01-16T10:00:00"),
      },
      {
        status: OrderStatus.OUT_FOR_DELIVERY,
        timestamp: new Date("2024-01-16T13:00:00"),
      },
    ],
    totalAmount: 224,
    subtotal: 199,
    deliveryFee: 25,
    discount: 0,
    paymentMethod: { type: "cash" },
    deliveryAddress: {
      id: "1",
      label: "בית",
      street: "הרצל 15",
      city: "תל אביב",
      postalCode: "6473427",
      coordinates: { lat: 32.0853, lng: 34.7818 },
      isDefault: true,
    },
    estimatedDeliveryTime: new Date("2024-01-16T15:00:00"),
    createdAt: new Date("2024-01-16T09:00:00"),
    updatedAt: new Date("2024-01-16T13:00:00"),
  },
];

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">(
    "all"
  );

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case OrderStatus.CONFIRMED:
      case OrderStatus.PREPARING:
        return <Package className="w-5 h-5 text-blue-500" />;
      case OrderStatus.OUT_FOR_DELIVERY:
        return <Truck className="w-5 h-5 text-orange-500" />;
      case OrderStatus.DELIVERED:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case OrderStatus.CANCELLED:
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case OrderStatus.CONFIRMED:
      case OrderStatus.PREPARING:
        return "bg-blue-100 text-blue-800";
      case OrderStatus.OUT_FOR_DELIVERY:
        return "bg-orange-100 text-orange-800";
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter((order) => {
    switch (activeTab) {
      case "active":
        return ![OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(
          order.status
        );
      case "completed":
        return [OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(
          order.status
        );
      default:
        return true;
    }
  });

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  const handleCancelOrder = (orderId: string) => {
    // לוגיקה לביטול הזמנה
    if (confirm("האם אתה בטוח שברצונך לבטל את ההזמנה?")) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: OrderStatus.CANCELLED }
            : order
        )
      );
      alert("ההזמנה בוטלה בהצלחה");
    }
  };

  const handleReorder = (order: Order) => {
    // לוגיקה להזמנה חוזרת
    console.log("Reordering:", order);
    router.push("/cart");
  };

  const handleContactStore = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-50">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={handleBackToList}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              הזמנה #{selectedOrder.id}
            </h1>
            <div></div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Order Status */}
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(selectedOrder.status)}
                <div>
                  <h3 className="font-bold text-gray-800">
                    {getOrderStatusText(selectedOrder.status)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    הזמנה #{selectedOrder.id}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  selectedOrder.status
                )}`}
              >
                {getOrderStatusText(selectedOrder.status)}
              </span>
            </div>

            {/* Status Timeline */}
            <div className="space-y-3">
              {selectedOrder.statusHistory.map((history, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      history.status === selectedOrder.status
                        ? "bg-primary-600"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {getOrderStatusText(history.status)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(history.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl p-4">
            <h3 className="font-bold text-gray-800 mb-4">פריטים בהזמנה</h3>
            <div className="space-y-4">
              {selectedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">
                      {item.product.category.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">
                      {item.product.name}
                    </h4>
                    <div className="text-sm text-gray-600 mt-1">
                      <span>מידה: {item.selectedSize?.name}</span>
                      <span className="mx-2">|</span>
                      <span>צבע: {item.selectedColor?.name}</span>
                      <span className="mx-2">|</span>
                      <span>כמות: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      {formatPrice(item.totalPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-xl p-4">
            <h3 className="font-bold text-gray-800 mb-4">פרטי משלוח</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-800">
                    {selectedOrder.deliveryAddress.label}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.deliveryAddress.street},{" "}
                    {selectedOrder.deliveryAddress.city}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-800">זמן משלוח משוער</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(selectedOrder.estimatedDeliveryTime)}
                  </p>
                </div>
              </div>
              {selectedOrder.notes && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>הערות:</strong> {selectedOrder.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl p-4">
            <h3 className="font-bold text-gray-800 mb-4">סיכום הזמנה</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">סכום ביניים:</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">משלוח:</span>
                <span>{formatPrice(selectedOrder.deliveryFee)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>הנחה:</span>
                  <span>-{formatPrice(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>סה"כ:</span>
                <span>{formatPrice(selectedOrder.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() =>
                handleContactStore(selectedOrder.store.contact.phone)
              }
              className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
            >
              <Phone className="w-5 h-5" />
              צור קשר עם החנות
            </button>

            {selectedOrder.status === OrderStatus.DELIVERED && (
              <button
                onClick={() => handleReorder(selectedOrder)}
                className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                הזמן שוב
              </button>
            )}

            {[OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(
              selectedOrder.status
            ) && (
              <button
                onClick={() => handleCancelOrder(selectedOrder.id)}
                className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 py-3 rounded-xl font-medium hover:bg-red-50 transition-colors"
              >
                <XCircle className="w-5 h-5" />
                בטל הזמנה
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">ההזמנות שלי</h1>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: "all", label: "הכל" },
              { key: "active", label: "פעילות" },
              { key: "completed", label: "הושלמו" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-800 mb-2">אין הזמנות</h3>
            <p className="text-gray-500 mb-6">עדיין לא ביצעת הזמנות</p>
            <button
              onClick={() => router.push("/stores")}
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
            >
              התחל לקנות
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => handleOrderClick(order)}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="font-bold text-gray-800">
                        הזמנה #{order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.store.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      {formatPrice(order.totalAmount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getOrderStatusText(order.status)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {order.items.length} פריט
                    {order.items.length > 1 ? "ים" : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
