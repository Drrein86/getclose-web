import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
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
import storesService from "../services/storesService";
import { Store } from "../types";

const { width } = Dimensions.get("window");

interface StoresScreenProps {
  onNavigate: (route: string, params?: any) => void;
}

export default function StoresScreen({ onNavigate }: StoresScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { state, loadStores } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("הכל");
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [sortBy, setSortBy] = useState("rating");
  const [storeCategories, setStoreCategories] = useState<string[]>(["הכל"]);

  // טעינת נתונים ראשונית
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // טען חנויות
        await loadStores();

        // טען קטגוריות - אם השרת לא זמין, השתמש בקטגוריות בסיסיות
        try {
          const categories = await storesService.getStoreCategories();
          setStoreCategories(["הכל", ...categories]);
        } catch (error) {
          console.log("Failed to load categories from server, using defaults");
          setStoreCategories([
            "הכל",
            "אופנה נשית",
            "אופנה גברית",
            "נעליים",
            "אביזרים",
          ]);
        }
      } catch (error) {
        console.error("Error loading stores data:", error);
      }
    };

    loadInitialData();
  }, []);

  // עדכון החנויות הפילטרות כאשר הנתונים משתנים
  useEffect(() => {
    if (state.stores.length > 0) {
      filterStores();
    }
  }, [state.stores, searchQuery, selectedCategory, sortBy]);

  const filterStores = () => {
    if (!state.stores || state.stores.length === 0) {
      setFilteredStores([]);
      return;
    }

    let filtered = [...state.stores];

    // סינון לפי חיפוש
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (store: Store) =>
          store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          store.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          store.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          store.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // סינון לפי קטגוריה
    if (selectedCategory !== "הכל") {
      filtered = filtered.filter(
        (store: Store) => store.category === selectedCategory
      );
    }

    // מיון
    switch (sortBy) {
      case "rating":
        filtered.sort((a: Store, b: Store) => b.rating - a.rating);
        break;
      case "name":
        filtered.sort((a: Store, b: Store) =>
          a.name.localeCompare(b.name, "he")
        );
        break;
      case "products":
        filtered.sort(
          (a: Store, b: Store) => b.productsCount - a.productsCount
        );
        break;
      case "followers":
        filtered.sort((a: Store, b: Store) => b.followers - a.followers);
        break;
    }

    setFilteredStores(filtered);
  };

  const toggleFollow = (storeId: string) => {
    setFilteredStores((prev: Store[]) =>
      prev.map((store: Store) =>
        store.id === storeId
          ? {
              ...store,
              isFollowing: !store.isFollowing,
              followers: store.isFollowing
                ? store.followers - 1
                : store.followers + 1,
            }
          : store
      )
    );
  };

  const StoreCard = ({ store }: { store: Store }) => (
    <TouchableOpacity
      style={[styles.storeCard, { backgroundColor: colors.surface }]}
      onPress={() => onNavigate("/store", { id: store.id })}
    >
      {/* תמונת רקע */}
      <View style={styles.storeImageContainer}>
        <Image source={{ uri: store.image }} style={styles.storeImage} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.storeImageOverlay}
        />

        {/* לוגו החנות */}
        <View style={styles.storeLogoContainer}>
          <Image source={{ uri: store.logo }} style={styles.storeLogo} />
        </View>

        {/* כפתור מעקב */}
        <TouchableOpacity
          style={[
            styles.followButton,
            {
              backgroundColor: store.isFollowing
                ? colors.primary
                : "rgba(255,255,255,0.9)",
            },
          ]}
          onPress={() => toggleFollow(store.id)}
        >
          <Ionicons
            name={store.isFollowing ? "heart" : "heart-outline"}
            size={16}
            color={store.isFollowing ? "white" : colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* פרטי החנות */}
      <View style={styles.storeInfo}>
        <View style={styles.storeHeader}>
          <Text
            style={[styles.storeName, { color: colors.text }]}
            numberOfLines={1}
          >
            {store.name}
          </Text>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Text style={[styles.categoryBadgeText, { color: colors.primary }]}>
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

        {/* דירוג ומיקום */}
        <View style={styles.storeStats}>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={[styles.ratingText, { color: colors.text }]}>
              {store.rating}
            </Text>
            <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
              ({store.reviewCount})
            </Text>
          </View>

          <View style={styles.location}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text
              style={[styles.locationText, { color: colors.textSecondary }]}
            >
              {store.location}
            </Text>
          </View>
        </View>

        {/* סטטיסטיקות */}
        <View style={styles.storeMetrics}>
          <View style={styles.metric}>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {store.productsCount}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              מוצרים
            </Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metric}>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {store.followers.toLocaleString()}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              עוקבים
            </Text>
          </View>
        </View>

        {/* תגיות */}
        <View style={styles.storeTags}>
          {store.tags.slice(0, 3).map((tag: string, index: number) => (
            <View
              key={index}
              style={[styles.tag, { backgroundColor: colors.background }]}
            >
              <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const FeaturedStores = () => {
    const featuredStores = state.stores
      .filter((store: Store) => store.rating >= 4.5)
      .slice(0, 3);

    return (
      <View style={styles.featuredSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          חנויות מומלצות
        </Text>

        {featuredStores.length > 0 ? (
          <FlatList
            data={featuredStores}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.featuredStore,
                  { backgroundColor: colors.surface },
                ]}
                onPress={() => onNavigate("/store", { id: item.id })}
              >
                <LinearGradient
                  colors={[
                    item.gradient.includes("red")
                      ? "#EF4444"
                      : item.gradient.includes("blue")
                      ? "#3B82F6"
                      : item.gradient.includes("orange")
                      ? "#F97316"
                      : "#7C3AED",
                    item.gradient.includes("red")
                      ? "#DC2626"
                      : item.gradient.includes("blue")
                      ? "#1D4ED8"
                      : item.gradient.includes("orange")
                      ? "#EA580C"
                      : "#5B21B6",
                  ]}
                  style={styles.featuredBackground}
                >
                  <Image
                    source={{ uri: item.logo }}
                    style={styles.featuredLogo}
                  />
                  <Text style={styles.featuredName}>{item.name}</Text>
                  <View style={styles.featuredRating}>
                    <Ionicons name="star" size={12} color="white" />
                    <Text style={styles.featuredRatingText}>{item.rating}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={[{ color: colors.textSecondary }]}>
              אין חנויות מומלצות כרגע
            </Text>
          </View>
        )}
      </View>
    );
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
          חנויות ({filteredStores.length})
        </Text>

        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="options-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchSection, { backgroundColor: colors.surface }]}>
        <View
          style={[styles.searchBar, { backgroundColor: colors.background }]}
        >
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="חפש חנויות..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Categories Filter */}
        <FlatList
          data={storeCategories}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryFilter,
                {
                  backgroundColor:
                    selectedCategory === item
                      ? colors.primary
                      : colors.background,
                },
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryFilterText,
                  {
                    color:
                      selectedCategory === item
                        ? colors.background
                        : colors.text,
                  },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />

        {/* Sort Options */}
        <View style={styles.sortSection}>
          <Text style={[styles.sortLabel, { color: colors.textSecondary }]}>
            מיון לפי:
          </Text>
          <View style={styles.sortOptions}>
            {[
              { key: "rating", label: "דירוג" },
              { key: "name", label: "שם" },
              { key: "products", label: "מוצרים" },
              { key: "followers", label: "עוקבים" },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortOption,
                  {
                    backgroundColor:
                      sortBy === option.key
                        ? colors.primary + "20"
                        : "transparent",
                  },
                ]}
                onPress={() => setSortBy(option.key)}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    {
                      color:
                        sortBy === option.key
                          ? colors.primary
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Featured Stores */}
        <FeaturedStores />

        {/* All Stores */}
        <View style={styles.allStoresSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              כל החנויות
            </Text>
            <Text
              style={[styles.resultsCount, { color: colors.textSecondary }]}
            >
              {filteredStores.length} תוצאות
            </Text>
          </View>

          {state.loading.stores ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={[{ color: colors.textSecondary }]}>
                טוען חנויות...
              </Text>
            </View>
          ) : filteredStores.length > 0 ? (
            <View style={styles.storesList}>
              {filteredStores.map((store: Store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </View>
          ) : (
            <View style={{ padding: 40, alignItems: "center" }}>
              <Text
                style={[
                  {
                    color: colors.textSecondary,
                    fontSize: 16,
                    textAlign: "center",
                  },
                ]}
              >
                {state.errors.stores
                  ? `שגיאה בטעינת חנויות: ${state.errors.stores}`
                  : state.stores.length === 0
                  ? "אין חנויות זמינות כרגע"
                  : "לא נמצאו חנויות התואמות לחיפוש"}
              </Text>
            </View>
          )}
        </View>

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
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    textAlign: "right",
  },
  categoriesContainer: {
    paddingRight: 20,
    marginBottom: 15,
  },
  categoryFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryFilterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  sortSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  sortOptions: {
    flexDirection: "row",
    gap: 8,
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  sortOptionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  featuredSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  featuredList: {
    paddingRight: 20,
  },
  featuredStore: {
    width: 120,
    height: 120,
    borderRadius: 16,
    marginRight: 12,
    overflow: "hidden",
  },
  featuredBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  featuredLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  featuredName: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  featuredRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  featuredRatingText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  allStoresSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 14,
  },
  storesList: {
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
    bottom: 12,
    left: 12,
  },
  storeLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },
  followButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
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
  storeName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
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
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
  },
  reviewCount: {
    fontSize: 12,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 12,
  },
  storeMetrics: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  metric: {
    flex: 1,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E5E7EB",
  },
  storeTags: {
    flexDirection: "row",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
  },
});
