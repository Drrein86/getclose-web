"use client";

import { useState } from "react";
import {
  Camera,
  MapPin,
  Tag,
  DollarSign,
  Package,
  Upload,
  Save,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  Heart,
  MessageCircle,
  Star,
  Search,
  Filter,
} from "lucide-react";
import { SecondHandItem, SecondHandSeller } from "@/src/types";

export default function SellSecondHandPage() {
  const [activeTab, setActiveTab] = useState<"sell" | "my-items" | "analytics">(
    "sell"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "sold" | "draft"
  >("all");

  // נתוני המוכר
  const seller: SecondHandSeller = {
    id: "seller-1",
    name: "שרה כהן",
    rating: 4.8,
    totalSales: 45,
    avatar: "👩",
    location: "תל אביב",
    joinDate: new Date("2023-01-15"),
    verified: true,
    responseTime: "תוך שעה",
  };

  // מוצרים יד שנייה
  const [myItems, setMyItems] = useState<SecondHandItem[]>([
    {
      id: "1",
      title: "חולצה כחולה מעוצבת",
      description: "חולצה איכותית עשויה כותנה 100%, נלבשה מעט",
      price: 89,
      originalPrice: 120,
      condition: "כמו חדש",
      category: "חולצות",
      size: "M",
      brand: "זארה",
      seller,
      images: ["https://via.placeholder.com/300x300?text=חולצה+כחולה"],
      postedDate: new Date("2024-01-15"),
      views: 156,
      likes: 23,
      isLiked: false,
      tags: ["כותנה", "נוח", "יום יום"],
      negotiable: true,
      status: "active",
      location: "תל אביב",
      meetingOptions: ["איסוף עצמי", "משלוח", "פגישה במקום ציבורי"],
    },
    {
      id: "2",
      title: "מכנסיים שחורים אלגנטיים",
      description: "מכנסיים אלגנטיים למשרד, במצב מעולה",
      price: 149,
      condition: "מצב טוב",
      category: "מכנסיים",
      size: "32",
      brand: "מנגו",
      seller,
      images: ["https://via.placeholder.com/300x300?text=מכנסיים+שחורים"],
      postedDate: new Date("2024-02-01"),
      views: 89,
      likes: 12,
      isLiked: true,
      tags: ["אלגנטי", "משרד", "פורמלי"],
      negotiable: false,
      status: "sold",
      location: "תל אביב",
      meetingOptions: ["איסוף עצמי", "משלוח"],
    },
    {
      id: "3",
      title: "נעליים ספורטיביות",
      description: "נעליים ספורטיביות במצב מעולה, נלבשו מעט",
      price: 199,
      originalPrice: 350,
      condition: "כמו חדש",
      category: "נעליים",
      size: "42",
      brand: "נייקי",
      seller,
      images: ["https://via.placeholder.com/300x300?text=נעליים+ספורט"],
      postedDate: new Date("2024-02-10"),
      views: 234,
      likes: 34,
      isLiked: false,
      tags: ["ספורט", "נוח", "ריצה"],
      negotiable: true,
      status: "active",
      location: "תל אביב",
      meetingOptions: ["איסוף עצמי", "פגישה במקום ציבורי"],
    },
  ]);

  // טופס הוספת מוצר
  const [itemForm, setItemForm] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    condition: "",
    category: "",
    size: "",
    brand: "",
    tags: "",
    images: [] as string[],
    negotiable: false,
    meetingOptions: [] as string[],
  });

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<SecondHandItem | null>(null);

  const categories = [
    "חולצות",
    "מכנסיים",
    "שמלות",
    "נעליים",
    "תיקים",
    "אקססוריז",
    "בגדי ילדים",
    "ספורט",
    "הלבשה תחתונה",
    "מעילים",
    "אחר",
  ];

  const conditions = ["כמו חדש", "מצב טוב", "מצב סביר", "נזקים קלים"];
  const meetingOptionsList = ["איסוף עצמי", "משלוח", "פגישה במקום ציבורי"];

  const handleSaveItem = () => {
    if (
      !itemForm.title ||
      !itemForm.price ||
      !itemForm.condition ||
      !itemForm.category
    ) {
      alert("אנא מלא את כל השדות הנדרשים");
      return;
    }

    const newItem: SecondHandItem = {
      id: editingItem?.id || Date.now().toString(),
      title: itemForm.title,
      description: itemForm.description,
      price: parseFloat(itemForm.price),
      originalPrice: itemForm.originalPrice
        ? parseFloat(itemForm.originalPrice)
        : undefined,
      condition: itemForm.condition as any,
      category: itemForm.category,
      size: itemForm.size,
      brand: itemForm.brand,
      seller,
      images:
        itemForm.images.length > 0
          ? itemForm.images
          : ["https://via.placeholder.com/300x300?text=" + itemForm.title],
      postedDate: new Date(),
      views: 0,
      likes: 0,
      isLiked: false,
      tags: itemForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      negotiable: itemForm.negotiable,
      status: "active",
      location: "תל אביב",
      meetingOptions: itemForm.meetingOptions,
    };

    if (editingItem) {
      setMyItems(
        myItems.map((item) => (item.id === editingItem.id ? newItem : item))
      );
    } else {
      setMyItems([...myItems, newItem]);
    }

    // איפוס הטופס
    setItemForm({
      title: "",
      description: "",
      price: "",
      originalPrice: "",
      condition: "",
      category: "",
      size: "",
      brand: "",
      tags: "",
      images: [],
      negotiable: false,
      meetingOptions: [],
    });
    setShowForm(false);
    setEditingItem(null);
  };

  const handleEditItem = (item: SecondHandItem) => {
    setEditingItem(item);
    setItemForm({
      title: item.title,
      description: item.description,
      price: item.price.toString(),
      originalPrice: item.originalPrice?.toString() || "",
      condition: item.condition,
      category: item.category,
      size: item.size || "",
      brand: item.brand || "",
      tags: item.tags.join(", "),
      images: item.images,
      negotiable: item.negotiable,
      meetingOptions: item.meetingOptions,
    });
    setShowForm(true);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm("האם אתה בטוח שברצונך למחוק את המוצר?")) {
      setMyItems(myItems.filter((item) => item.id !== itemId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "sold":
        return "text-blue-600 bg-blue-100";
      case "draft":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "פעיל";
      case "sold":
        return "נמכר";
      case "draft":
        return "טיוטה";
      default:
        return status;
    }
  };

  const filteredItems = myItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalItems: myItems.length,
    activeItems: myItems.filter((item) => item.status === "active").length,
    soldItems: myItems.filter((item) => item.status === "sold").length,
    totalViews: myItems.reduce((sum, item) => sum + item.views, 0),
    totalLikes: myItems.reduce((sum, item) => sum + item.likes, 0),
    totalRevenue: myItems
      .filter((item) => item.status === "sold")
      .reduce((sum, item) => sum + item.price, 0),
  };

  return (
    <div className="max-w-7xl mx-auto p-4 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">מכירה ביד שנייה</h1>
              <p className="text-gray-600">נהל את המוצרים שלך ביד השנייה</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setActiveTab("sell");
            }}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            הוסף מוצר
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { key: "sell", label: "הוסף מוצר", icon: Plus },
            { key: "my-items", label: "המוצרים שלי", icon: Package },
            { key: "analytics", label: "סטטיסטיקות", icon: Eye },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sell Tab - Form */}
      {(activeTab === "sell" || showForm) && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {editingItem ? "עריכת מוצר" : "הוסף מוצר חדש"}
            </h2>
            {showForm && (
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Fields */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  כותרת המוצר *
                </label>
                <input
                  type="text"
                  value={itemForm.title}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="לדוגמה: חולצה כחולה מעוצבת"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  תיאור המוצר
                </label>
                <textarea
                  value={itemForm.description}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="תאר את המוצר, מצבו, ופרטים נוספים..."
                />
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    מחיר מבוקש *
                  </label>
                  <input
                    type="number"
                    value={itemForm.price}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, price: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    מחיר מקורי
                  </label>
                  <input
                    type="number"
                    value={itemForm.originalPrice}
                    onChange={(e) =>
                      setItemForm({
                        ...itemForm,
                        originalPrice: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Category and Condition */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    קטגוריה *
                  </label>
                  <select
                    value={itemForm.category}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">בחר קטגוריה</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    מצב המוצר *
                  </label>
                  <select
                    value={itemForm.condition}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, condition: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">בחר מצב</option>
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Size and Brand */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">מידה</label>
                  <input
                    type="text"
                    value={itemForm.size}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, size: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="S, M, L או 36, 37, 38"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">מותג</label>
                  <input
                    type="text"
                    value={itemForm.brand}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, brand: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="שם המותג"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">תגיות</label>
                <input
                  type="text"
                  value={itemForm.tags}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, tags: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="תגיות מופרדות בפסיק: כותנה, נוח, יום יום"
                />
              </div>

              {/* Meeting Options */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  אפשרויות מסירה
                </label>
                <div className="space-y-2">
                  {meetingOptionsList.map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={itemForm.meetingOptions.includes(option)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setItemForm({
                              ...itemForm,
                              meetingOptions: [
                                ...itemForm.meetingOptions,
                                option,
                              ],
                            });
                          } else {
                            setItemForm({
                              ...itemForm,
                              meetingOptions: itemForm.meetingOptions.filter(
                                (o) => o !== option
                              ),
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Negotiable */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={itemForm.negotiable}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, negotiable: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span>ניתן למיקוח</span>
                </label>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                תמונות המוצר
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  העלה תמונות המוצר
                </h3>
                <p className="text-gray-500 mb-4">
                  גרור ושחרר תמונות כאן או לחץ לבחירה
                </p>
                <button
                  type="button"
                  className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700"
                >
                  בחר תמונות
                </button>
              </div>

              {itemForm.images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {itemForm.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`תמונה ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() =>
                          setItemForm({
                            ...itemForm,
                            images: itemForm.images.filter(
                              (_, i) => i !== index
                            ),
                          })
                        }
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              ביטול
            </button>
            <button
              onClick={handleSaveItem}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editingItem ? "עדכן מוצר" : "פרסם מוצר"}
            </button>
          </div>
        </div>
      )}

      {/* My Items Tab */}
      {activeTab === "my-items" && !showForm && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{stats.totalItems}</h3>
                  <p className="text-gray-600">סה"כ מוצרים</p>
                  <p className="text-sm text-green-600">
                    {stats.activeItems} פעילים
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">₪{stats.totalRevenue}</h3>
                  <p className="text-gray-600">סה"כ הכנסות</p>
                  <p className="text-sm text-green-600">
                    {stats.soldItems} מכירות
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{stats.totalViews}</h3>
                  <p className="text-gray-600">סה"כ צפיות</p>
                  <p className="text-sm text-green-600">
                    {stats.totalLikes} לייקים
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="חפש במוצרים שלי..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex gap-2">
                {[
                  { key: "all", label: "הכל" },
                  { key: "active", label: "פעילים" },
                  { key: "sold", label: "נמכרו" },
                  { key: "draft", label: "טיוטות" },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setFilterStatus(filter.key as any)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      filterStatus === filter.key
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-6">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-24 h-24 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {getStatusText(item.status)}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>₪{item.price}</span>
                        {item.originalPrice && (
                          <span className="line-through text-gray-400">
                            ₪{item.originalPrice}
                          </span>
                        )}
                      </div>
                      <span>•</span>
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>{item.condition}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{item.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{item.likes}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 px-2 py-1 rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button className="p-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  אין מוצרים
                </h3>
                <p className="text-gray-500 mb-4">
                  {filterStatus === "all"
                    ? "עדיין לא הוספת מוצרים"
                    : `אין מוצרים עם סטטוס "${getStatusText(filterStatus)}"`}
                </p>
                <button
                  onClick={() => {
                    setShowForm(true);
                    setActiveTab("sell");
                  }}
                  className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-colors"
                >
                  הוסף מוצר ראשון
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && !showForm && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">מוצרים פופולריים</h3>
              <div className="space-y-3">
                {myItems
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-600">₪{item.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{item.views}</p>
                        <p className="text-sm text-gray-600">צפיות</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">ביצועים</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">מוצרים פעילים</span>
                  <span className="font-medium">{stats.activeItems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">מוצרים שנמכרו</span>
                  <span className="font-medium">{stats.soldItems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">אחוז המכירות</span>
                  <span className="font-medium">
                    {stats.totalItems > 0
                      ? Math.round((stats.soldItems / stats.totalItems) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">ממוצע צפיות למוצר</span>
                  <span className="font-medium">
                    {stats.totalItems > 0
                      ? Math.round(stats.totalViews / stats.totalItems)
                      : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
