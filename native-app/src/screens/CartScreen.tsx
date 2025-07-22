import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  StatusBar,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "../contexts/ThemeContext";
import { useData } from "../contexts/DataContext";

interface CartScreenProps {
  onNavigate: (route: string, params?: any) => void;
}

// פריטי עגלה יגיעו מה-API
const cartItems: any[] = [];

export default function CartScreen({ onNavigate }: CartScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { state } = useData();

  const [items, setItems] = useState(state.cartItems || []);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    Alert.alert("הסר פריט", "האם אתה בטוח שברצונך להסיר פריט זה מהעגלה?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "הסר",
        style: "destructive",
        onPress: () => {
          setItems((prevItems) =>
            prevItems.filter((item) => item.id !== itemId)
          );
        },
      },
    ]);
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save20") {
      setDiscount(0.2);
      Alert.alert("קוד הנחה", "קוד ההנחה הוחל בהצלחה! 20% הנחה");
    } else if (promoCode.toLowerCase() === "firsttime") {
      setDiscount(0.15);
      Alert.alert("קוד הנחה", "קוד ההנחה הוחל בהצלחה! 15% הנחה");
    } else {
      Alert.alert("שגיאה", "קוד הנחה לא תקין");
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = subtotal * discount;
  const shipping = subtotal > 200 ? 0 : 25;
  const tax = (subtotal - discountAmount) * 0.17;
  const total = subtotal - discountAmount + shipping + tax;

  const CartItem = ({ item }: { item: (typeof cartItems)[0] }) => (
    <View style={[styles.cartItem, { backgroundColor: colors.surface }]}>
      <View style={styles.itemContent}>
        {/* תמונת מוצר */}
        <View style={styles.itemImage}>
          <Image
            source={{ uri: item.product.images[0] }}
            style={styles.productImage}
          />
          {item.product.isOnSale && (
            <View style={[styles.saleBadge, { backgroundColor: "#EF4444" }]}>
              <Text style={styles.saleBadgeText}>
                -{item.product.discount}%
              </Text>
            </View>
          )}
        </View>

        {/* פרטי מוצר */}
        <View style={styles.itemDetails}>
          <TouchableOpacity
            onPress={() => onNavigate("/product", { id: item.product.id })}
          >
            <Text
              style={[styles.productName, { color: colors.text }]}
              numberOfLines={2}
            >
              {item.product.name}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onNavigate("/store", { id: item.product.storeId })}
          >
            <Text style={[styles.storeName, { color: colors.primary }]}>
              {item.product.store.name}
            </Text>
          </TouchableOpacity>

          {/* אפשרויות שנבחרו */}
          <View style={styles.selectedOptions}>
            <View style={styles.optionItem}>
              <Text
                style={[styles.optionLabel, { color: colors.textSecondary }]}
              >
                גודל:
              </Text>
              <Text style={[styles.optionValue, { color: colors.text }]}>
                {item.size}
              </Text>
            </View>

            <View style={styles.optionItem}>
              <Text
                style={[styles.optionLabel, { color: colors.textSecondary }]}
              >
                צבע:
              </Text>
              <View
                style={[styles.colorPreview, { backgroundColor: item.color }]}
              />
            </View>
          </View>

          {/* מחיר */}
          <View style={styles.priceSection}>
            <Text style={[styles.currentPrice, { color: colors.text }]}>
              ₪{item.product.price}
            </Text>
            {item.product.originalPrice && (
              <Text
                style={[styles.originalPrice, { color: colors.textSecondary }]}
              >
                ₪{item.product.originalPrice}
              </Text>
            )}
          </View>
        </View>

        {/* כפתורי פעולה */}
        <View style={styles.itemActions}>
          <TouchableOpacity
            onPress={() => removeItem(item.id)}
            style={[
              styles.removeButton,
              { backgroundColor: colors.background },
            ]}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>

          {/* בורר כמות */}
          <View
            style={[
              styles.quantitySelector,
              { backgroundColor: colors.background },
            ]}
          >
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
              style={styles.quantityButton}
            >
              <Ionicons name="remove" size={16} color={colors.text} />
            </TouchableOpacity>

            <Text style={[styles.quantityText, { color: colors.text }]}>
              {item.quantity}
            </Text>

            <TouchableOpacity
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
              style={styles.quantityButton}
            >
              <Ionicons name="add" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* מחיר סה"כ */}
          <Text style={[styles.itemTotal, { color: colors.text }]}>
            ₪{item.product.price * item.quantity}
          </Text>
        </View>
      </View>
    </View>
  );

  const SummarySection = () => (
    <View style={[styles.summarySection, { backgroundColor: colors.surface }]}>
      <Text style={[styles.summaryTitle, { color: colors.text }]}>
        סיכום הזמנה
      </Text>

      <View style={styles.summaryItem}>
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
          סכום ביניים ({items.length} פריטים)
        </Text>
        <Text style={[styles.summaryValue, { color: colors.text }]}>
          ₪{subtotal.toFixed(2)}
        </Text>
      </View>

      {discount > 0 && (
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.success }]}>
            הנחה ({Math.round(discount * 100)}%)
          </Text>
          <Text style={[styles.summaryValue, { color: colors.success }]}>
            -₪{discountAmount.toFixed(2)}
          </Text>
        </View>
      )}

      <View style={styles.summaryItem}>
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
          משלוח
        </Text>
        <Text style={[styles.summaryValue, { color: colors.text }]}>
          {shipping === 0 ? "חינם" : `₪${shipping}`}
        </Text>
      </View>

      <View style={styles.summaryItem}>
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
          מע"מ (17%)
        </Text>
        <Text style={[styles.summaryValue, { color: colors.text }]}>
          ₪{tax.toFixed(2)}
        </Text>
      </View>

      <View
        style={[styles.summaryDivider, { backgroundColor: colors.border }]}
      />

      <View style={styles.summaryItem}>
        <Text style={[styles.totalLabel, { color: colors.text }]}>סך הכל</Text>
        <Text style={[styles.totalValue, { color: colors.text }]}>
          ₪{total.toFixed(2)}
        </Text>
      </View>

      {shipping > 0 && (
        <View
          style={[styles.shippingNote, { backgroundColor: colors.background }]}
        >
          <Ionicons name="information-circle" size={16} color={colors.info} />
          <Text
            style={[styles.shippingNoteText, { color: colors.textSecondary }]}
          >
            הוסף עוד ₪{(200 - subtotal).toFixed(2)} לקבלת משלוח חינם
          </Text>
        </View>
      )}
    </View>
  );

  const PromoCodeSection = () => (
    <View style={[styles.promoSection, { backgroundColor: colors.surface }]}>
      <Text style={[styles.promoTitle, { color: colors.text }]}>קוד הנחה</Text>

      <View style={styles.promoInputContainer}>
        <View
          style={[styles.promoInput, { backgroundColor: colors.background }]}
        >
          <Ionicons
            name="pricetag-outline"
            size={20}
            color={colors.textSecondary}
          />
          <TextInput
            style={[styles.promoTextInput, { color: colors.text }]}
            placeholder="הכנס קוד הנחה..."
            placeholderTextColor={colors.textSecondary}
            value={promoCode}
            onChangeText={setPromoCode}
          />
        </View>

        <TouchableOpacity
          style={[styles.promoButton, { backgroundColor: colors.primary }]}
          onPress={applyPromoCode}
        >
          <Text style={[styles.promoButtonText, { color: colors.background }]}>
            החל
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.promoCodes}>
        <Text style={[styles.promoCodesTitle, { color: colors.textSecondary }]}>
          קודי הנחה זמינים:
        </Text>
        <TouchableOpacity onPress={() => setPromoCode("SAVE20")}>
          <Text style={[styles.promoCodeExample, { color: colors.primary }]}>
            SAVE20 - 20% הנחה
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPromoCode("FIRSTTIME")}>
          <Text style={[styles.promoCodeExample, { color: colors.primary }]}>
            FIRSTTIME - 15% הנחה
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />

        <View
          style={[
            styles.header,
            { backgroundColor: colors.surface, paddingTop: insets.top + 10 },
          ]}
        >
          <TouchableOpacity onPress={() => onNavigate("/home")}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            עגלת קניות
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.emptyCart}>
          <View
            style={[styles.emptyCartIcon, { backgroundColor: colors.surface }]}
          >
            <Ionicons
              name="bag-outline"
              size={80}
              color={colors.textSecondary}
            />
          </View>
          <Text style={[styles.emptyCartTitle, { color: colors.text }]}>
            העגלה שלך ריקה
          </Text>
          <Text style={[styles.emptyCartText, { color: colors.textSecondary }]}>
            הוסף מוצרים לעגלה כדי להתחיל לקנות
          </Text>
          <TouchableOpacity
            style={[
              styles.continueShoppingButton,
              { backgroundColor: colors.primary },
            ]}
            onPress={() => onNavigate("/home")}
          >
            <Text
              style={[
                styles.continueShoppingText,
                { color: colors.background },
              ]}
            >
              המשך לקנות
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, paddingTop: insets.top + 10 },
        ]}
      >
        <TouchableOpacity onPress={() => onNavigate("/home")}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          עגלת קניות ({items.length})
        </Text>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="heart-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* פריטי עגלה */}
        <View style={styles.cartItems}>
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </View>

        {/* קוד הנחה */}
        <PromoCodeSection />

        {/* סיכום */}
        <SummarySection />

        {/* מרווח תחתון */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* כפתור תשלום */}
      <View style={[styles.checkoutBar, { backgroundColor: colors.surface }]}>
        <View style={styles.checkoutInfo}>
          <Text style={[styles.checkoutTotal, { color: colors.text }]}>
            ₪{total.toFixed(2)}
          </Text>
          <Text style={[styles.checkoutItems, { color: colors.textSecondary }]}>
            {items.length} פריטים
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.checkoutButton, { backgroundColor: colors.primary }]}
          onPress={() => onNavigate("/checkout", { items, total })}
        >
          <Ionicons name="card" size={20} color={colors.background} />
          <Text
            style={[styles.checkoutButtonText, { color: colors.background }]}
          >
            לתשלום
          </Text>
        </TouchableOpacity>
      </View>
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
  cartItems: {
    padding: 20,
    gap: 15,
  },
  cartItem: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    flexDirection: "row",
    padding: 16,
  },
  itemImage: {
    position: "relative",
    marginRight: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    resizeMode: "cover",
  },
  saleBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
  },
  saleBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  itemDetails: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 22,
  },
  storeName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  selectedOptions: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  optionLabel: {
    fontSize: 12,
  },
  optionValue: {
    fontSize: 12,
    fontWeight: "600",
  },
  colorPreview: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  priceSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
  },
  itemActions: {
    alignItems: "flex-end",
    gap: 12,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    minWidth: 30,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
  },
  promoSection: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  promoInputContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  promoInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  promoTextInput: {
    flex: 1,
    fontSize: 16,
    textAlign: "right",
  },
  promoButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: "center",
  },
  promoButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  promoCodes: {
    gap: 4,
  },
  promoCodesTitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  promoCodeExample: {
    fontSize: 12,
    fontWeight: "600",
  },
  summarySection: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  summaryDivider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  shippingNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  shippingNoteText: {
    fontSize: 12,
    flex: 1,
  },
  checkoutBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  checkoutInfo: {
    flex: 1,
  },
  checkoutTotal: {
    fontSize: 20,
    fontWeight: "bold",
  },
  checkoutItems: {
    fontSize: 12,
  },
  checkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyCartIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyCartText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  continueShoppingButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueShoppingText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
