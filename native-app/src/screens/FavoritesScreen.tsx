import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "../contexts/ThemeContext";
import { useData } from "../contexts/DataContext";

const { width } = Dimensions.get("window");

interface FavoritesScreenProps {
  onNavigate: (route: string, params?: any) => void;
}

// מועדפים יגיעו מה-API
const favoriteProducts: any[] = [];
const favoriteStores: any[] = [];

export default function FavoritesScreen({ onNavigate }: FavoritesScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { state } = useData();

  const [activeTab, setActiveTab] = useState<"products" | "stores">("products");
  const [favorites, setFavorites] = useState(favoriteProducts);
  const [favoriteStoresList, setFavoriteStoresList] = useState(favoriteStores);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== productId));
  };

  const toggleFollow = (storeId: string) => {
    setFavoriteStoresList((prev) => prev.filter((item) => item.id !== storeId));
  };

  const ProductCard = ({ product }: { product: any }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: colors.surface }]}
      onPress={() => onNavigate("/product", { id: product.id })}
    >
      <View style={styles.productImageContainer}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.productImage}
        />

        {/* תגיות */}
        {product.isNew && (
          <View style={[styles.badge, { backgroundColor: "#10B981" }]}>
            <Text style={styles.badgeText}>חדש</Text>
          </View>
        )}
        {product.isOnSale && (
          <View style={[styles.badge, { backgroundColor: "#EF4444", top: 35 }]}>
            <Text style={styles.badgeText}>-{product.discount}%</Text>
          </View>
        )}

        {/* כפתור הסרה מהמועדפים */}
        <TouchableOpacity
          onPress={() => toggleFavorite(product.id)}
          style={[styles.favoriteButton, { backgroundColor: "#EF4444" }]}
        >
          <Ionicons name="heart" size={18} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.productInfo}>
        <Text style={[styles.storeName, { color: colors.textSecondary }]}>
          {product.store.name}
        </Text>
        <Text
          style={[styles.productName, { color: colors.text }]}
          numberOfLines={2}
        >
          {product.name}
        </Text>

        <View style={styles.productRating}>
          <Ionicons name="star" size={14} color="#F59E0B" />
          <Text style={[styles.ratingText, { color: colors.text }]}>
            {product.rating}
          </Text>
          <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
            ({product.reviewCount})
          </Text>
        </View>

        <View style={styles.productPricing}>
          <Text style={[styles.price, { color: colors.text }]}>
            ₪{product.price}
          </Text>
          {product.originalPrice && (
            <Text
              style={[styles.originalPrice, { color: colors.textSecondary }]}
            >
              ₪{product.originalPrice}
            </Text>
          )}
        </View>

        <Text style={[styles.addedDate, { color: colors.textSecondary }]}>
          נוסף ב-{product.addedToFavorites}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const StoreCard = ({ store }: { store: any }) => (
    <TouchableOpacity
      style={[styles.storeCard, { backgroundColor: colors.surface }]}
      onPress={() => onNavigate("/store", { id: store.id })}
    >
      <View style={styles.storeImageContainer}>
        <Image source={{ uri: store.image }} style={styles.storeImage} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          style={styles.storeImageOverlay}
        />

        <View style={styles.storeLogoContainer}>
          <Image source={{ uri: store.logo }} style={styles.storeLogo} />
        </View>

        <TouchableOpacity
          onPress={() => toggleFollow(store.id)}
          style={[styles.followButton, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="heart" size={16} color="white" />
          <Text style={styles.followButtonText}>עוקב</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.storeInfo}>
        <View style={styles.storeHeader}>
          <Text style={[styles.storeNameText, { color: colors.text }]}>
            {store.name}
          </Text>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Text style={[styles.categoryText, { color: colors.primary }]}>
              {store.category}
            </Text>
          </View>
        </View>

        <Text
          style={[styles.storeDescription, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {store.description}
        </Text>

        <View style={styles.storeStats}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={[styles.statText, { color: colors.text }]}>
              {store.rating}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons
              name="bag-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={[styles.statText, { color: colors.text }]}>
              {store.productsCount}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons
              name="people-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={[styles.statText, { color: colors.text }]}>
              {store.followers.toLocaleString()}
            </Text>
          </View>
        </View>

        <Text style={[styles.followedDate, { color: colors.textSecondary }]}>
          עוקב מאז {store.followedDate}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = ({ type }: { type: "products" | "stores" }) => (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.surface }]}>
        <Ionicons
          name={type === "products" ? "heart-outline" : "storefront-outline"}
          size={60}
          color={colors.textSecondary}
        />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        אין {type === "products" ? "מוצרים" : "חנויות"} מועדפים
      </Text>
      <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
        {type === "products"
          ? "הוסף מוצרים למועדפים כדי לשמור אותם כאן"
          : "עקוב אחרי חנויות כדי לראות אותן כאן"}
      </Text>
      <TouchableOpacity
        style={[styles.browseButton, { backgroundColor: colors.primary }]}
        onPress={() => onNavigate(type === "products" ? "/search" : "/stores")}
      >
        <Text style={[styles.browseButtonText, { color: colors.background }]}>
          {type === "products" ? "גלה מוצרים" : "גלה חנויות"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const FavoritesStats = () => (
    <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
      <LinearGradient
        colors={[colors.primary + "20", colors.accent + "10"]}
        style={styles.statsBackground}
      >
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {favorites.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              מוצרים מועדפים
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {favoriteStoresList.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              חנויות שאני עוקב
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              ₪
              {favorites.reduce(
                (sum: any, product: any) => sum + product.price,
                0
              )}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              שווי כולל
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

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
          מועדפים
        </Text>

        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="share-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "products" && styles.activeTab,
            {
              borderBottomColor:
                activeTab === "products" ? colors.primary : "transparent",
            },
          ]}
          onPress={() => setActiveTab("products")}
        >
          <Ionicons
            name="heart"
            size={20}
            color={
              activeTab === "products" ? colors.primary : colors.textSecondary
            }
          />
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === "products"
                    ? colors.primary
                    : colors.textSecondary,
              },
            ]}
          >
            מוצרים ({favorites.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "stores" && styles.activeTab,
            {
              borderBottomColor:
                activeTab === "stores" ? colors.primary : "transparent",
            },
          ]}
          onPress={() => setActiveTab("stores")}
        >
          <Ionicons
            name="storefront"
            size={20}
            color={
              activeTab === "stores" ? colors.primary : colors.textSecondary
            }
          />
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === "stores"
                    ? colors.primary
                    : colors.textSecondary,
              },
            ]}
          >
            חנויות ({favoriteStoresList.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <FavoritesStats />

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === "products" ? (
          favorites.length > 0 ? (
            <View style={styles.productsGrid}>
              {favorites.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </View>
          ) : (
            <EmptyState type="products" />
          )
        ) : favoriteStoresList.length > 0 ? (
          <View style={styles.storesList}>
            {favoriteStoresList.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </View>
        ) : (
          <EmptyState type="stores" />
        )}

        {/* Quick Actions */}
        {(favorites.length > 0 || favoriteStoresList.length > 0) && (
          <View
            style={[styles.quickActions, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.quickActionsTitle, { color: colors.text }]}>
              פעולות מהירות
            </Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={() => onNavigate("/cart")}
              >
                <Ionicons name="bag-add" size={20} color={colors.background} />
                <Text
                  style={[
                    styles.actionButtonText,
                    { color: colors.background },
                  ]}
                >
                  הוסף הכל לעגלה
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.accent },
                ]}
                onPress={() => {}}
              >
                <Ionicons name="share" size={20} color={colors.background} />
                <Text
                  style={[
                    styles.actionButtonText,
                    { color: colors.background },
                  ]}
                >
                  שתף רשימה
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
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
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
    borderBottomWidth: 2,
  },
  activeTab: {
    // active styling handled by borderBottomColor
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  statsContainer: {
    margin: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  statsBackground: {
    padding: 20,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  content: {
    flex: 1,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    gap: 15,
  },
  productCard: {
    width: (width - 55) / 2,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImageContainer: {
    height: 120,
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    padding: 12,
  },
  storeName: {
    fontSize: 12,
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    lineHeight: 18,
  },
  productRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
  },
  reviewCount: {
    fontSize: 10,
  },
  productPricing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
  },
  addedDate: {
    fontSize: 10,
  },
  storesList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  storeCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  storeImageContainer: {
    height: 100,
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
    bottom: 12,
    left: 12,
  },
  storeLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "white",
  },
  followButton: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  followButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  storeInfo: {
    padding: 16,
  },
  storeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  storeNameText: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  storeDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  storeStats: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: "600",
  },
  followedDate: {
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  browseButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quickActions: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
