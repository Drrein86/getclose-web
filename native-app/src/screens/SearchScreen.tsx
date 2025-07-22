import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Modal,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "../contexts/ThemeContext";
import { useData } from "../contexts/DataContext";
import { SearchFilters } from "../types";

const { width } = Dimensions.get("window");

// פילטרים לחיפוש
const priceRanges = [
  { label: "הכל", min: 0, max: 9999 },
  { label: "עד ₪100", min: 0, max: 100 },
  { label: "₪100-₪200", min: 100, max: 200 },
  { label: "₪200-₪300", min: 200, max: 300 },
  { label: "₪300-₪500", min: 300, max: 500 },
  { label: "מעל ₪500", min: 500, max: 9999 },
];

const sortOptions = [
  { label: "הכי רלוונטי", value: "relevance" },
  { label: "מחיר: נמוך לגבוה", value: "price_asc" },
  { label: "מחיר: גבוה לנמוך", value: "price_desc" },
  { label: "הכי חדש", value: "newest" },
  { label: "הכי פופולרי", value: "popular" },
  { label: "דירוג גבוה", value: "rating" },
];

interface SearchScreenProps {
  onNavigate: (route: string, params?: any) => void;
}

export default function SearchScreen({ onNavigate }: SearchScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { state, searchProducts } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(
    state.featuredProducts || []
  );
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    "חולצות קיץ",
    "נעלי ספורט",
    "ג'ינסים",
    "שמלות ערב",
  ]);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, filters]);

  const filterProducts = () => {
    let filtered = [...(state.featuredProducts || [])];

    // סינון לפי חיפוש
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.store.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // סינון לפי קטגוריה
    if (filters.category && filters.category !== "הכל") {
      filtered = filtered.filter(
        (product) => product.category === filters.category
      );
    }

    // סינון לפי מחיר
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      filtered = filtered.filter(
        (product) =>
          product.price >= filters.minPrice! &&
          product.price <= filters.maxPrice!
      );
    }

    // סינון לפי דירוג
    if (filters.rating) {
      filtered = filtered.filter(
        (product) => product.rating >= filters.rating!
      );
    }

    // סינון לפי מבצע
    if (filters.isOnSale) {
      filtered = filtered.filter((product) => product.isOnSale);
    }

    // סינון לפי חדש
    if (filters.isNew) {
      filtered = filtered.filter((product) => product.isNew);
    }

    // מיון
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price_asc":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        case "popular":
          filtered.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
      }
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && !recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev.slice(0, 4)]);
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  const ProductCard = ({ product }: { product: any }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: colors.surface }]}
      onPress={() => onNavigate("/product", { id: product.id })}
    >
      <View style={styles.productImage}>
        <LinearGradient
          colors={["#f0f0f0", "#e0e0e0"]}
          style={styles.imagePlaceholder}
        >
          <Ionicons name="image-outline" size={40} color="#ccc" />
        </LinearGradient>

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
      </View>
    </TouchableOpacity>
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
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View
            style={[styles.searchBar, { backgroundColor: colors.background }]}
          >
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="חפש מוצרים, חנויות או מותגים..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearch}
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
        </View>

        {/* Filter Controls */}
        <View style={styles.filterControls}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              { backgroundColor: colors.background },
            ]}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="filter" size={18} color={colors.text} />
            <Text style={[styles.filterButtonText, { color: colors.text }]}>
              פילטרים
            </Text>
            {Object.keys(filters).length > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>
                  {Object.keys(filters).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              { backgroundColor: colors.background },
            ]}
            onPress={() => setShowSort(true)}
          >
            <Ionicons name="swap-vertical" size={18} color={colors.text} />
            <Text style={[styles.filterButtonText, { color: colors.text }]}>
              מיון
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Searches */}
      {!searchQuery && (
        <View style={styles.recentSearches}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            חיפושים אחרונים
          </Text>
          <View style={styles.searchTags}>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.searchTag, { backgroundColor: colors.surface }]}
                onPress={() => setSearchQuery(search)}
              >
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={[styles.searchTagText, { color: colors.text }]}>
                  {search}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Results */}
      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <Text style={[styles.resultsCount, { color: colors.text }]}>
            {filteredProducts.length} תוצאות
          </Text>
          {Object.keys(filters).length > 0 && (
            <TouchableOpacity onPress={clearFilters}>
              <Text style={[styles.clearFilters, { color: colors.primary }]}>
                נקה פילטרים
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => <ProductCard product={item} />}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
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
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              פילטרים
            </Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={[styles.modalAction, { color: colors.primary }]}>
                נקה
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Categories */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
                קטגוריות
              </Text>
              <View style={styles.filterOptions}>
                {[
                  "הכל",
                  ...(state.categories || []).map((cat: any) => cat.name),
                ].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterOption,
                      {
                        backgroundColor:
                          filters.category === category
                            ? colors.primary
                            : colors.surface,
                      },
                    ]}
                    onPress={() =>
                      setFilters((prev) => ({
                        ...prev,
                        category: category === "הכל" ? undefined : category,
                      }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        {
                          color:
                            filters.category === category
                              ? colors.background
                              : colors.text,
                        },
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
                טווח מחירים
              </Text>
              <View style={styles.filterOptions}>
                {priceRanges.map((range) => (
                  <TouchableOpacity
                    key={range.label}
                    style={[
                      styles.filterOption,
                      {
                        backgroundColor:
                          filters.minPrice === range.min &&
                          filters.maxPrice === range.max
                            ? colors.primary
                            : colors.surface,
                      },
                    ]}
                    onPress={() =>
                      setFilters((prev) => ({
                        ...prev,
                        minPrice: range.min,
                        maxPrice: range.max,
                      }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        {
                          color:
                            filters.minPrice === range.min &&
                            filters.maxPrice === range.max
                              ? colors.background
                              : colors.text,
                        },
                      ]}
                    >
                      {range.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Special Filters */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
                מסננים מיוחדים
              </Text>

              <TouchableOpacity
                style={[
                  styles.switchOption,
                  { backgroundColor: colors.surface },
                ]}
                onPress={() =>
                  setFilters((prev) => ({
                    ...prev,
                    isOnSale: !prev.isOnSale,
                  }))
                }
              >
                <Text style={[styles.switchOptionText, { color: colors.text }]}>
                  רק במבצע
                </Text>
                <Ionicons
                  name={filters.isOnSale ? "checkbox" : "square-outline"}
                  size={24}
                  color={
                    filters.isOnSale ? colors.primary : colors.textSecondary
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.switchOption,
                  { backgroundColor: colors.surface },
                ]}
                onPress={() =>
                  setFilters((prev) => ({
                    ...prev,
                    isNew: !prev.isNew,
                  }))
                }
              >
                <Text style={[styles.switchOptionText, { color: colors.text }]}>
                  רק חדשים
                </Text>
                <Ionicons
                  name={filters.isNew ? "checkbox" : "square-outline"}
                  size={24}
                  color={filters.isNew ? colors.primary : colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowFilters(false)}
          >
            <Text
              style={[styles.applyButtonText, { color: colors.background }]}
            >
              החל פילטרים
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal
        visible={showSort}
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
            <TouchableOpacity onPress={() => setShowSort(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              מיון
            </Text>
            <View style={{ width: 50 }} />
          </View>

          <View style={styles.modalContent}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[styles.sortOption, { backgroundColor: colors.surface }]}
                onPress={() => {
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: option.value as any,
                  }));
                  setShowSort(false);
                }}
              >
                <Text style={[styles.sortOptionText, { color: colors.text }]}>
                  {option.label}
                </Text>
                {filters.sortBy === option.value && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
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
    paddingHorizontal: 20,
    paddingBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
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
  filterControls: {
    flexDirection: "row",
    gap: 10,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
    position: "relative",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  filterBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  recentSearches: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  searchTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  searchTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  searchTagText: {
    fontSize: 14,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: "600",
  },
  clearFilters: {
    fontSize: 14,
    fontWeight: "600",
  },
  productsList: {
    paddingBottom: 100,
  },
  row: {
    justifyContent: "space-between",
  },
  productCard: {
    width: (width - 50) / 2,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    height: 120,
    position: "relative",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalAction: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 30,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterOption: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  switchOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  switchOptionText: {
    fontSize: 16,
    fontWeight: "600",
  },
  applyButton: {
    marginHorizontal: 20,
    marginBottom: 40,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  sortOptionText: {
    fontSize: 16,
  },
});
