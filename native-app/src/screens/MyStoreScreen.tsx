import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "../contexts/ThemeContext";
import { useData } from "../contexts/DataContext";

interface MyStoreScreenProps {
  onNavigate: (route: string, params?: any) => void;
}

// נתוני החנות לדוגמה
const myStore = {
  id: "1",
  name: "החנות שלי",
  description: "חנות אופנה מובילה עם מוצרים איכותיים",
  logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop",
  image:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
  rating: 4.7,
  reviewCount: 234,
  followers: 1250,
  productsCount: 45,
  ordersCount: 156,
  revenue: 12580,
  isOpen: true,
  openingHours: "א'-ו' 9:00-21:00",
  phone: "050-123-4567",
  address: "רחוב דיזנגוף 100, תל אביב",
};

// מוצרי החנות יגיעו מה-API
const myProducts: any[] = [];

// הזמנות אחרונות
const recentOrders = [
  {
    id: "ORD001",
    customerName: "שרה כהן",
    items: 2,
    total: 245,
    status: "pending",
    date: "2024-01-20",
    products: ["חולצת כותנה", "ג'ינס סקיני"],
  },
  {
    id: "ORD002",
    customerName: "דוד לוי",
    items: 1,
    total: 450,
    status: "shipped",
    date: "2024-01-19",
    products: ["נעלי ספורט"],
  },
  {
    id: "ORD003",
    customerName: "מיכל אברהם",
    items: 3,
    total: 389,
    status: "delivered",
    date: "2024-01-18",
    products: ["שמלה", "תיק יד", "נעליים"],
  },
];

export default function MyStoreScreen({ onNavigate }: MyStoreScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { state } = useData();

  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "orders" | "analytics"
  >("overview");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [storeData, setStoreData] = useState(myStore);

  const toggleStoreStatus = () => {
    Alert.alert(
      storeData.isOpen ? "סגור חנות" : "פתח חנות",
      `האם אתה בטוח שברצונך ${storeData.isOpen ? "לסגור" : "לפתוח"} את החנות?`,
      [
        { text: "ביטול", style: "cancel" },
        {
          text: storeData.isOpen ? "סגור" : "פתח",
          onPress: () => {
            setStoreData((prev) => ({ ...prev, isOpen: !prev.isOpen }));
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#F59E0B";
      case "shipped":
        return "#3B82F6";
      case "delivered":
        return "#10B981";
      case "cancelled":
        return "#EF4444";
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "ממתין";
      case "shipped":
        return "נשלח";
      case "delivered":
        return "נמסר";
      case "cancelled":
        return "בוטל";
      default:
        return status;
    }
  };

  const StoreHeader = () => (
    <View style={[styles.storeHeader, { backgroundColor: colors.surface }]}>
      <View style={styles.storeImageContainer}>
        <Image source={{ uri: storeData.image }} style={styles.storeImage} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.storeImageOverlay}
        />

        <View style={styles.storeLogoContainer}>
          <Image source={{ uri: storeData.logo }} style={styles.storeLogo} />
        </View>

        <TouchableOpacity
          style={[
            styles.storeStatusButton,
            { backgroundColor: storeData.isOpen ? "#10B981" : "#EF4444" },
          ]}
          onPress={toggleStoreStatus}
        >
          <Ionicons
            name={storeData.isOpen ? "checkmark-circle" : "close-circle"}
            size={16}
            color="white"
          />
          <Text style={styles.storeStatusText}>
            {storeData.isOpen ? "פתוח" : "סגור"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.storeInfo}>
        <View style={styles.storeNameRow}>
          <Text style={[styles.storeName, { color: colors.text }]}>
            {storeData.name}
          </Text>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="create-outline" size={16} color="white" />
          </TouchableOpacity>
        </View>

        <Text
          style={[styles.storeDescription, { color: colors.textSecondary }]}
        >
          {storeData.description}
        </Text>

        {/* סטטיסטיקות מהירות */}
        <View style={styles.quickStats}>
          <View style={styles.quickStat}>
            <Text style={[styles.quickStatValue, { color: colors.text }]}>
              {storeData.rating}
            </Text>
            <View style={styles.quickStatLabel}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text
                style={[styles.quickStatText, { color: colors.textSecondary }]}
              >
                דירוג
              </Text>
            </View>
          </View>

          <View style={styles.quickStat}>
            <Text style={[styles.quickStatValue, { color: colors.text }]}>
              {storeData.followers}
            </Text>
            <View style={styles.quickStatLabel}>
              <Ionicons name="people" size={12} color={colors.textSecondary} />
              <Text
                style={[styles.quickStatText, { color: colors.textSecondary }]}
              >
                עוקבים
              </Text>
            </View>
          </View>

          <View style={styles.quickStat}>
            <Text style={[styles.quickStatValue, { color: colors.text }]}>
              {storeData.productsCount}
            </Text>
            <View style={styles.quickStatLabel}>
              <Ionicons name="bag" size={12} color={colors.textSecondary} />
              <Text
                style={[styles.quickStatText, { color: colors.textSecondary }]}
              >
                מוצרים
              </Text>
            </View>
          </View>

          <View style={styles.quickStat}>
            <Text style={[styles.quickStatValue, { color: colors.text }]}>
              ₪{storeData.revenue.toLocaleString()}
            </Text>
            <View style={styles.quickStatLabel}>
              <Ionicons
                name="trending-up"
                size={12}
                color={colors.textSecondary}
              />
              <Text
                style={[styles.quickStatText, { color: colors.textSecondary }]}
              >
                הכנסות
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const TabNavigation = () => (
    <View style={[styles.tabNavigation, { backgroundColor: colors.surface }]}>
      {[
        { key: "overview", label: "סקירה", icon: "analytics" },
        { key: "products", label: "מוצרים", icon: "bag" },
        { key: "orders", label: "הזמנות", icon: "receipt" },
        { key: "analytics", label: "נתונים", icon: "bar-chart" },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            activeTab === tab.key && { backgroundColor: colors.primary + "20" },
          ]}
          onPress={() => setActiveTab(tab.key as any)}
        >
          <Ionicons
            name={tab.icon as any}
            size={20}
            color={
              activeTab === tab.key ? colors.primary : colors.textSecondary
            }
          />
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === tab.key ? colors.primary : colors.textSecondary,
              },
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const OverviewTab = () => (
    <View style={styles.tabContent}>
      {/* כרטיסי סטטיסטיקות */}
      <View style={styles.statsCards}>
        <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
          <LinearGradient
            colors={["#10B981", "#059669"]}
            style={styles.statsCardGradient}
          >
            <View style={styles.statsCardHeader}>
              <Ionicons name="trending-up" size={24} color="white" />
              <Text style={styles.statsCardValue}>
                ₪{storeData.revenue.toLocaleString()}
              </Text>
            </View>
            <Text style={styles.statsCardLabel}>הכנסות החודש</Text>
            <Text style={styles.statsCardChange}>+12.5% מהחודש שעבר</Text>
          </LinearGradient>
        </View>

        <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
          <LinearGradient
            colors={["#3B82F6", "#1D4ED8"]}
            style={styles.statsCardGradient}
          >
            <View style={styles.statsCardHeader}>
              <Ionicons name="receipt" size={24} color="white" />
              <Text style={styles.statsCardValue}>{storeData.ordersCount}</Text>
            </View>
            <Text style={styles.statsCardLabel}>הזמנות חדשות</Text>
            <Text style={styles.statsCardChange}>+8 היום</Text>
          </LinearGradient>
        </View>
      </View>

      {/* הזמנות אחרונות */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            הזמנות אחרונות
          </Text>
          <TouchableOpacity onPress={() => setActiveTab("orders")}>
            <Text style={[styles.sectionLink, { color: colors.primary }]}>
              צפה בכל ההזמנות
            </Text>
          </TouchableOpacity>
        </View>

        {recentOrders.slice(0, 3).map((order) => (
          <View
            key={order.id}
            style={[styles.orderItem, { backgroundColor: colors.background }]}
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderInfo}>
                <Text style={[styles.orderCustomer, { color: colors.text }]}>
                  {order.customerName}
                </Text>
                <Text style={[styles.orderId, { color: colors.textSecondary }]}>
                  #{order.id}
                </Text>
              </View>
              <View
                style={[
                  styles.orderStatus,
                  { backgroundColor: getStatusColor(order.status) + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.orderStatusText,
                    { color: getStatusColor(order.status) },
                  ]}
                >
                  {getStatusText(order.status)}
                </Text>
              </View>
            </View>

            <Text
              style={[styles.orderProducts, { color: colors.textSecondary }]}
            >
              {order.products.join(", ")}
            </Text>

            <View style={styles.orderFooter}>
              <Text style={[styles.orderTotal, { color: colors.text }]}>
                ₪{order.total}
              </Text>
              <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
                {order.date}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* פעולות מהירות */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          פעולות מהירות
        </Text>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: colors.primary }]}
            onPress={() => setShowAddProduct(true)}
          >
            <Ionicons name="add-circle" size={24} color="white" />
            <Text style={styles.quickActionText}>הוסף מוצר</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: colors.accent }]}
            onPress={() => setActiveTab("orders")}
          >
            <Ionicons name="notifications" size={24} color="white" />
            <Text style={styles.quickActionText}>הזמנות חדשות</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: "#10B981" }]}
            onPress={() => {}}
          >
            <Ionicons name="chatbubbles" size={24} color="white" />
            <Text style={styles.quickActionText}>הודעות</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: "#F59E0B" }]}
            onPress={() => setActiveTab("analytics")}
          >
            <Ionicons name="analytics" size={24} color="white" />
            <Text style={styles.quickActionText}>דוחות</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const ProductsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.productsHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          המוצרים שלי ({myProducts.length})
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowAddProduct(true)}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addButtonText}>הוסף מוצר</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.productsList}>
        {myProducts.map((product: any) => (
          <View
            key={product.id}
            style={[styles.productItem, { backgroundColor: colors.surface }]}
          >
            <Image
              source={{ uri: product.images[0] }}
              style={styles.productItemImage}
            />

            <View style={styles.productItemInfo}>
              <Text
                style={[styles.productItemName, { color: colors.text }]}
                numberOfLines={2}
              >
                {product.name}
              </Text>

              <View style={styles.productItemDetails}>
                <Text style={[styles.productItemPrice, { color: colors.text }]}>
                  ₪{product.price}
                </Text>
                <Text
                  style={[
                    styles.productItemStock,
                    { color: colors.textSecondary },
                  ]}
                >
                  מלאי: {product.stock}
                </Text>
                <Text
                  style={[
                    styles.productItemSales,
                    { color: colors.textSecondary },
                  ]}
                >
                  נמכר: {product.sales}
                </Text>
              </View>

              <View style={styles.productItemStatus}>
                <View
                  style={[
                    styles.productStatusIndicator,
                    {
                      backgroundColor: product.isActive ? "#10B981" : "#EF4444",
                    },
                  ]}
                >
                  <Text style={styles.productStatusText}>
                    {product.isActive ? "פעיל" : "לא פעיל"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.productItemActions}>
              <TouchableOpacity
                style={[
                  styles.productAction,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Ionicons name="create" size={16} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.productAction,
                  { backgroundColor: colors.accent },
                ]}
              >
                <Ionicons name="analytics" size={16} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.productAction, { backgroundColor: "#EF4444" }]}
              >
                <Ionicons name="trash" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const OrdersTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        כל ההזמנות ({recentOrders.length})
      </Text>

      <View style={styles.ordersList}>
        {recentOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={[styles.orderCard, { backgroundColor: colors.surface }]}
            onPress={() => {}}
          >
            <View style={styles.orderCardHeader}>
              <View style={styles.orderCardInfo}>
                <Text
                  style={[styles.orderCardCustomer, { color: colors.text }]}
                >
                  {order.customerName}
                </Text>
                <Text
                  style={[styles.orderCardId, { color: colors.textSecondary }]}
                >
                  הזמנה #{order.id}
                </Text>
              </View>

              <View
                style={[
                  styles.orderCardStatus,
                  { backgroundColor: getStatusColor(order.status) + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.orderCardStatusText,
                    { color: getStatusColor(order.status) },
                  ]}
                >
                  {getStatusText(order.status)}
                </Text>
              </View>
            </View>

            <View style={styles.orderCardContent}>
              <Text
                style={[
                  styles.orderCardProducts,
                  { color: colors.textSecondary },
                ]}
              >
                {order.items} פריטים: {order.products.join(", ")}
              </Text>

              <View style={styles.orderCardFooter}>
                <Text style={[styles.orderCardTotal, { color: colors.text }]}>
                  ₪{order.total}
                </Text>
                <Text
                  style={[
                    styles.orderCardDate,
                    { color: colors.textSecondary },
                  ]}
                >
                  {order.date}
                </Text>
              </View>
            </View>

            <View style={styles.orderCardActions}>
              <TouchableOpacity
                style={[
                  styles.orderAction,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.orderActionText}>עדכן סטטוס</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.orderAction, { backgroundColor: colors.accent }]}
              >
                <Text style={styles.orderActionText}>צור קשר</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const AnalyticsTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        נתונים ואנליטיקה
      </Text>

      {/* גרפים וסטטיסטיקות מתקדמות */}
      <View style={[styles.analyticsCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.analyticsTitle, { color: colors.text }]}>
          ביצועים השבוע
        </Text>

        <View style={styles.analyticsGrid}>
          <View style={styles.analyticsItem}>
            <Text style={[styles.analyticsValue, { color: "#10B981" }]}>
              ₪2,450
            </Text>
            <Text
              style={[styles.analyticsLabel, { color: colors.textSecondary }]}
            >
              מכירות
            </Text>
          </View>
          <View style={styles.analyticsItem}>
            <Text style={[styles.analyticsValue, { color: "#3B82F6" }]}>
              23
            </Text>
            <Text
              style={[styles.analyticsLabel, { color: colors.textSecondary }]}
            >
              הזמנות
            </Text>
          </View>
          <View style={styles.analyticsItem}>
            <Text style={[styles.analyticsValue, { color: "#F59E0B" }]}>
              45
            </Text>
            <Text
              style={[styles.analyticsLabel, { color: colors.textSecondary }]}
            >
              צפיות
            </Text>
          </View>
          <View style={styles.analyticsItem}>
            <Text style={[styles.analyticsValue, { color: "#EF4444" }]}>8</Text>
            <Text
              style={[styles.analyticsLabel, { color: colors.textSecondary }]}
            >
              עוקבים חדשים
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.comingSoon, { color: colors.textSecondary }]}>
        גרפים מתקדמים יתווספו בקרוב...
      </Text>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "products":
        return <ProductsTab />;
      case "orders":
        return <OrdersTab />;
      case "analytics":
        return <AnalyticsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            paddingTop: insets.top + 10,
          },
        ]}
      >
        <TouchableOpacity onPress={() => onNavigate("/home")}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          החנות שלי
        </Text>

        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <StoreHeader />
        <TabNavigation />
        {renderTabContent()}

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Product Modal */}
      <Modal
        visible={showAddProduct}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <View
            style={[styles.modalHeader, { backgroundColor: colors.surface }]}
          >
            <TouchableOpacity onPress={() => setShowAddProduct(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              הוסף מוצר חדש
            </Text>
            <TouchableOpacity>
              <Text style={[styles.modalSave, { color: colors.primary }]}>
                שמור
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={[styles.modalSectionTitle, { color: colors.text }]}>
              פרטי מוצר בסיסיים
            </Text>

            <View
              style={[styles.inputGroup, { backgroundColor: colors.surface }]}
            >
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                שם המוצר
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  { color: colors.text, borderColor: colors.border },
                ]}
                placeholder="הכנס שם מוצר..."
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View
              style={[styles.inputGroup, { backgroundColor: colors.surface }]}
            >
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                תיאור
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  { color: colors.text, borderColor: colors.border },
                ]}
                placeholder="תאר את המוצר..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputRow}>
              <View
                style={[
                  styles.inputGroup,
                  { backgroundColor: colors.surface, flex: 1 },
                ]}
              >
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  מחיר
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { color: colors.text, borderColor: colors.border },
                  ]}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>

              <View style={{ width: 12 }} />

              <View
                style={[
                  styles.inputGroup,
                  { backgroundColor: colors.surface, flex: 1 },
                ]}
              >
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  מלאי
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { color: colors.text, borderColor: colors.border },
                  ]}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={[styles.modalNote, { color: colors.textSecondary }]}>
              ניתן להוסיף תמונות ופרטים נוספים לאחר השמירה הראשונית
            </Text>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  storeHeader: {
    margin: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  storeImageContainer: {
    height: 120,
    position: "relative",
  },
  storeImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  storeImageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  storeLogoContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
  },
  storeLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "white",
  },
  storeStatusButton: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  storeStatusText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  storeInfo: {
    padding: 20,
  },
  storeNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  storeName: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  storeDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  quickStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickStat: {
    alignItems: "center",
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  quickStatLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  quickStatText: {
    fontSize: 12,
  },
  tabNavigation: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  statsCards: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  statsCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  statsCardGradient: {
    padding: 20,
  },
  statsCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statsCardValue: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  statsCardLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    marginBottom: 4,
  },
  statsCardChange: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  orderItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderInfo: {
    flex: 1,
  },
  orderCustomer: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  orderId: {
    fontSize: 12,
  },
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  orderProducts: {
    fontSize: 14,
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orderDate: {
    fontSize: 12,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickAction: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  quickActionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  productsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  productsList: {
    gap: 16,
  },
  productItem: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productItemInfo: {
    flex: 1,
  },
  productItemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  productItemDetails: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 6,
  },
  productItemPrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
  productItemStock: {
    fontSize: 12,
  },
  productItemSales: {
    fontSize: 12,
  },
  productItemStatus: {
    flexDirection: "row",
  },
  productStatusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  productStatusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  productItemActions: {
    flexDirection: "row",
    gap: 8,
  },
  productAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  ordersList: {
    gap: 16,
  },
  orderCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderCardInfo: {
    flex: 1,
  },
  orderCardCustomer: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  orderCardId: {
    fontSize: 14,
  },
  orderCardStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  orderCardStatusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  orderCardContent: {
    marginBottom: 16,
  },
  orderCardProducts: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  orderCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderCardTotal: {
    fontSize: 18,
    fontWeight: "bold",
  },
  orderCardDate: {
    fontSize: 14,
  },
  orderCardActions: {
    flexDirection: "row",
    gap: 12,
  },
  orderAction: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  orderActionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  analyticsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  analyticsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  analyticsItem: {
    width: "48%",
    alignItems: "center",
    padding: 16,
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 14,
  },
  comingSoon: {
    textAlign: "center",
    fontSize: 16,
    fontStyle: "italic",
    marginTop: 40,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalSave: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputGroup: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  inputRow: {
    flexDirection: "row",
  },
  modalNote: {
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
  },
});
