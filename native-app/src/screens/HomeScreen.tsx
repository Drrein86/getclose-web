import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  FlatList,
  Animated,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "../contexts/ThemeContext";
import { useData } from "../contexts/DataContext";

const { width, height } = Dimensions.get("window");

// נתוני Hero Slider
const heroSlides = [
  {
    id: 1,
    title: "קולקציית חורף 2024",
    subtitle: "אופנה חמה לעונה הקרה",
    description: "גלו את המעילים והסוודרים הכי מתקדמים",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    cta: "קנו עכשיו",
  },
  {
    id: 2,
    title: "נעליים בעיצוב חדשני",
    subtitle: "נוחות ללא פשרות",
    description: "הנעליים הנוחות והיפות ביותר לכל יום",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=2112&q=80",
    cta: "גלו עוד",
  },
  {
    id: 3,
    title: "אביזרי אופנה מיוחדים",
    subtitle: "השלימו את הלוק",
    description: "תיקים, תכשיטים ואביזרים שיהפכו כל לוק למושלם",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    cta: "צפו בקולקציה",
  },
];

// קטגוריות ראשיות
const mainCategories = [
  {
    id: 1,
    name: "נשים",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    count: 245,
    description: "אופנה נשית מובילה",
  },
  {
    id: 2,
    name: "גברים",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    count: 189,
    description: "סטייל גברי עכשווי",
  },
  {
    id: 3,
    name: "ילדים",
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    count: 156,
    description: "אופנה צעירה ונוחה",
  },
  {
    id: 4,
    name: "תינוקות",
    image:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    count: 89,
    description: "בגדים רכים ובטוחים",
  },
  {
    id: 5,
    name: "אביזרים",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    count: 167,
    description: "אקססוריז מושלמים",
  },
  {
    id: 6,
    name: "ספורט",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    count: 134,
    description: "ביגוד ספורט מתקדם",
  },
];

// מוצרים מובילים
const featuredProducts = [
  {
    id: 1,
    name: "חולצת כותנה בייסיק",
    price: 89,
    originalPrice: 129,
    store: "זארה",
    storeId: "1",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&auto=format",
    rating: 4.5,
    reviews: 234,
    isNew: false,
    isOnSale: true,
    discount: 30,
    category: "חולצות",
    badge: "מבצע חם",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
  },
  {
    id: 2,
    name: "נעלי ספורט אייר מקס",
    price: 450,
    originalPrice: 550,
    store: "נייקי",
    storeId: "2",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop&auto=format",
    rating: 4.8,
    reviews: 189,
    isNew: true,
    isOnSale: true,
    discount: 18,
    category: "נעליים",
    badge: "חדש",
    colors: ["#000000", "#FFFFFF", "#FF0000"],
  },
  {
    id: 3,
    name: "ג'ינס סקיני כחול",
    price: 199,
    originalPrice: 299,
    store: "ליוויס",
    storeId: "1",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop&auto=format",
    rating: 4.3,
    reviews: 156,
    isNew: false,
    isOnSale: true,
    discount: 33,
    category: "מכנסיים",
    badge: "פופולרי",
    colors: ["#1E3A8A", "#3B82F6", "#60A5FA"],
  },
];

interface HomeScreenProps {
  onNavigate: (route: string, params?: any) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { state } = useData();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);

  const slideAnimatedValue = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // אוטו-סלייד אפקט
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % heroSlides.length;

        // אנימציה של המעבר
        Animated.timing(slideAnimatedValue, {
          toValue: nextSlide,
          duration: 500,
          useNativeDriver: false,
        }).start();

        return nextSlide;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const ProductCard = ({ product }: { product: any }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => onNavigate("/product", { id: product.id })}
      activeOpacity={0.9}
    >
      {/* תמונת מוצר */}
      <View style={styles.productImageContainer}>
        <Image source={{ uri: product.image }} style={styles.productImage} />

        {/* תגיות */}
        <View style={styles.productBadges}>
          {product.isNew && (
            <LinearGradient
              colors={["#10B981", "#059669"]}
              style={styles.badge}
            >
              <Ionicons name="sparkles" size={12} color="white" />
              <Text style={styles.badgeText}>חדש</Text>
            </LinearGradient>
          )}
          {product.isOnSale && (
            <LinearGradient
              colors={["#EF4444", "#DC2626"]}
              style={styles.badge}
            >
              <Ionicons name="pricetag" size={12} color="white" />
              <Text style={styles.badgeText}>-{product.discount}%</Text>
            </LinearGradient>
          )}
        </View>

        {/* כפתור מועדפים */}
        <TouchableOpacity
          onPress={() => toggleFavorite(product.id)}
          style={[
            styles.favoriteButton,
            favorites.includes(product.id) && styles.favoriteButtonActive,
          ]}
        >
          <Ionicons
            name={favorites.includes(product.id) ? "heart" : "heart-outline"}
            size={20}
            color={favorites.includes(product.id) ? "white" : colors.text}
          />
        </TouchableOpacity>

        {/* אפשרויות צבע */}
        <View style={styles.colorOptions}>
          {product.colors.slice(0, 3).map((color: string, index: number) => (
            <View
              key={index}
              style={[styles.colorDot, { backgroundColor: color }]}
            />
          ))}
        </View>
      </View>

      {/* פרטי מוצר */}
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={[styles.storeName, { color: colors.textSecondary }]}>
            {product.store}
          </Text>
          <View
            style={[styles.productBadge, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.productBadgeText}>{product.badge}</Text>
          </View>
        </View>

        <Text
          style={[styles.productName, { color: colors.text }]}
          numberOfLines={2}
        >
          {product.name}
        </Text>

        <View style={styles.productRating}>
          <Ionicons name="star" size={16} color="#F59E0B" />
          <Text style={[styles.ratingText, { color: colors.text }]}>
            {product.rating}
          </Text>
          <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
            ({product.reviews} ביקורות)
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
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons name="bag-add" size={16} color={colors.background} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Slider */}
        <View style={styles.heroContainer}>
          <Animated.View style={styles.heroSlider}>
            {heroSlides.map((slide, index) => (
              <Animated.View
                key={slide.id}
                style={[
                  styles.heroSlide,
                  {
                    opacity: slideAnimatedValue.interpolate({
                      inputRange: [index - 1, index, index + 1],
                      outputRange: [0, 1, 0],
                      extrapolate: "clamp",
                    }),
                  },
                ]}
              >
                <Image source={{ uri: slide.image }} style={styles.heroImage} />

                {/* רקע כהה */}
                <LinearGradient
                  colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.3)"]}
                  style={styles.heroOverlay}
                />

                {/* תוכן הסליידר */}
                <View style={styles.heroContent}>
                  <Text style={styles.heroSubtitle}>{slide.subtitle}</Text>
                  <Text style={styles.heroTitle}>{slide.title}</Text>
                  <Text style={styles.heroDescription}>
                    {slide.description}
                  </Text>

                  {/* חיפוש */}
                  <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                      <Ionicons
                        name="search"
                        size={20}
                        color="rgba(255,255,255,0.7)"
                      />
                      <TextInput
                        style={styles.searchInput}
                        placeholder="חפש מוצרים, חנויות או מותגים..."
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                      />
                      <TouchableOpacity style={styles.searchButton}>
                        <Text style={styles.searchButtonText}>חפש</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.heroButton}>
                    <Text style={styles.heroButtonText}>{slide.cta}</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </Animated.View>

          {/* אינדיקטורי סליידר */}
          <View style={styles.slideIndicators}>
            {heroSlides.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentSlide(index)}
                style={[
                  styles.slideIndicator,
                  index === currentSlide && styles.slideIndicatorActive,
                ]}
              />
            ))}
          </View>

          {/* סטטיסטיקות מהירות */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1,200+</Text>
              <Text style={styles.statLabel}>מוצרים</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>150+</Text>
              <Text style={styles.statLabel}>חנויות</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50,000+</Text>
              <Text style={styles.statLabel}>לקוחות</Text>
            </View>
          </View>
        </View>

        {/* קטגוריות פופולריות */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              קטגוריות פופולריות
            </Text>
            <TouchableOpacity onPress={() => onNavigate("/categories")}>
              <Text style={[styles.sectionLink, { color: colors.primary }]}>
                צפה בכל הקטגוריות
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={mainCategories}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => onNavigate("/category", { id: item.id })}
              >
                <View style={styles.categoryImageContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.categoryImage}
                  />
                  <LinearGradient
                    colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.4)"]}
                    style={styles.categoryOverlay}
                  />
                  <Text style={styles.categoryName}>{item.name}</Text>
                </View>
                <Text
                  style={[
                    styles.categoryDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {item.description}
                </Text>
                <Text style={[styles.categoryCount, { color: colors.text }]}>
                  {item.count} מוצרים
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        {/* מוצרים חמים */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View
                style={[
                  styles.sectionIcon,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Ionicons
                  name="trending-up"
                  size={20}
                  color={colors.background}
                />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                מוצרים חמים
              </Text>
            </View>
            <TouchableOpacity onPress={() => onNavigate("/products")}>
              <Text style={[styles.sectionLink, { color: colors.primary }]}>
                צפה בכל המוצרים
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={state.featuredProducts || []}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
            renderItem={({ item }) => <ProductCard product={item} />}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        {/* חנויות מובילות השבוע */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View
                style={[styles.sectionIcon, { backgroundColor: colors.accent }]}
              >
                <Ionicons
                  name="storefront"
                  size={20}
                  color={colors.background}
                />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                חנויות מובילות השבוע
              </Text>
            </View>
            <TouchableOpacity onPress={() => onNavigate("/stores")}>
              <Text style={[styles.sectionLink, { color: colors.primary }]}>
                צפה בכל החנויות
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={state.trendingStores}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.trendingStoreCard}
                onPress={() => onNavigate("/store", { id: item.id })}
              >
                <LinearGradient
                  colors={[item.gradient[0], item.gradient[1]]}
                  style={styles.trendingStoreGradient}
                >
                  {item.isHot && (
                    <View style={styles.hotBadge}>
                      <Ionicons name="flame" size={12} color="white" />
                      <Text style={styles.hotBadgeText}>חם</Text>
                    </View>
                  )}

                  <Image
                    source={{ uri: item.logo }}
                    style={styles.trendingStoreLogo}
                  />

                  <Text style={styles.trendingStoreName}>{item.name}</Text>
                  <Text style={styles.trendingStoreDescription}>
                    {item.description}
                  </Text>

                  <View style={styles.trendingStoreStats}>
                    <View style={styles.trendingStoreStat}>
                      <Ionicons name="star" size={14} color="white" />
                      <Text style={styles.trendingStoreStatText}>
                        {item.rating}
                      </Text>
                    </View>
                    <View style={styles.trendingStoreStat}>
                      <Ionicons name="people" size={14} color="white" />
                      <Text style={styles.trendingStoreStatText}>
                        {item.followers}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.trendingStoreGrowth}>
                    <Text style={styles.trendingStoreGrowthText}>
                      {item.weeklyGrowth}
                    </Text>
                  </View>

                  {item.specialOffer && (
                    <View style={styles.trendingStoreOffer}>
                      <Text style={styles.trendingStoreOfferText}>
                        {item.specialOffer}
                      </Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        {/* טרנדים שבועיים */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View
                style={[styles.sectionIcon, { backgroundColor: "#F59E0B" }]}
              >
                <Ionicons name="trending-up" size={20} color="white" />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                טרנדים שבועיים
              </Text>
            </View>
            <TouchableOpacity onPress={() => onNavigate("/search")}>
              <Text style={[styles.sectionLink, { color: colors.primary }]}>
                צפה בעוד טרנדים
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={state.weeklyTrends}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.trendCard}
                onPress={() => onNavigate("/search", { trend: item.id })}
              >
                <View style={styles.trendImageContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.trendImage}
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.7)"]}
                    style={styles.trendImageOverlay}
                  />

                  <View style={styles.trendScore}>
                    <LinearGradient
                      colors={[item.colors[0], item.colors[1]]}
                      style={styles.trendScoreGradient}
                    >
                      <Text style={styles.trendScoreText}>
                        {item.trendScore}
                      </Text>
                    </LinearGradient>
                  </View>

                  <View style={styles.trendViews}>
                    <Ionicons name="eye" size={12} color="white" />
                    <Text style={styles.trendViewsText}>
                      {item.weeklyViews}
                    </Text>
                  </View>
                </View>

                <View style={styles.trendContent}>
                  <Text style={[styles.trendTitle, { color: colors.text }]}>
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.trendSubtitle,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {item.subtitle}
                  </Text>
                  <Text
                    style={[
                      styles.trendDescription,
                      { color: colors.textSecondary },
                    ]}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>

                  <View style={styles.trendProducts}>
                    {item.products
                      .slice(0, 2)
                      .map((product: any, index: number) => (
                        <View key={index} style={styles.trendProduct}>
                          <Image
                            source={{ uri: product.image }}
                            style={styles.trendProductImage}
                          />
                          <View style={styles.trendProductInfo}>
                            <Text
                              style={[
                                styles.trendProductName,
                                { color: colors.text },
                              ]}
                              numberOfLines={1}
                            >
                              {product.name}
                            </Text>
                            <View style={styles.trendProductPrice}>
                              <Text
                                style={[
                                  styles.trendProductPriceText,
                                  { color: colors.text },
                                ]}
                              >
                                ₪{product.price}
                              </Text>
                              {product.originalPrice && (
                                <Text
                                  style={[
                                    styles.trendProductOriginalPrice,
                                    { color: colors.textSecondary },
                                  ]}
                                >
                                  ₪{product.originalPrice}
                                </Text>
                              )}
                            </View>
                          </View>
                        </View>
                      ))}
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        {/* באנר מבצעים מיוחדים */}
        <View style={styles.section}>
          <LinearGradient
            colors={["#7C3AED", "#EC4899"]}
            style={styles.specialOfferBanner}
          >
            <View style={styles.bannerContent}>
              <View style={styles.bannerHeader}>
                <Ionicons name="gift" size={32} color="white" />
                <Text style={styles.bannerTitle}>מבצעים מיוחדים</Text>
              </View>
              <Text style={styles.bannerDescription}>
                הצטרף לניוזלטר שלנו וקבל 20% הנחה על הרכישה הראשונה
              </Text>
              <View style={styles.newsletterContainer}>
                <TextInput
                  style={styles.newsletterInput}
                  placeholder="כתובת אימייל"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                />
                <TouchableOpacity style={styles.newsletterButton}>
                  <Text style={styles.newsletterButtonText}>הירשם עכשיו</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    height: height * 0.8,
    position: "relative",
  },
  heroSlider: {
    flex: 1,
  },
  heroSlide: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heroSubtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 10,
    textAlign: "center",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
    textAlign: "center",
  },
  heroDescription: {
    fontSize: 20,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 30,
    textAlign: "center",
    lineHeight: 28,
  },
  searchContainer: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 30,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  searchButton: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchButtonText: {
    color: "black",
    fontWeight: "600",
  },
  heroButton: {
    backgroundColor: "white",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 15,
  },
  heroButtonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  slideIndicators: {
    position: "absolute",
    bottom: 150,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  slideIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  slideIndicatorActive: {
    backgroundColor: "white",
  },
  quickStats: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  statItem: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  statLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  sectionLink: {
    fontSize: 16,
    fontWeight: "600",
  },
  categoriesContainer: {
    paddingRight: 20,
  },
  categoryCard: {
    marginRight: 15,
    width: 120,
  },
  categoryImageContainer: {
    height: 120,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 10,
    position: "relative",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  categoryOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  categoryDescription: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: "center",
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  productsContainer: {
    paddingRight: 20,
  },
  productCard: {
    width: 200,
    marginRight: 15,
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productImageContainer: {
    height: 150,
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  productBadges: {
    position: "absolute",
    top: 10,
    left: 10,
    gap: 5,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButtonActive: {
    backgroundColor: "#EF4444",
  },
  colorOptions: {
    position: "absolute",
    bottom: 10,
    left: 10,
    flexDirection: "row",
    gap: 4,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
  },
  productInfo: {
    padding: 15,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  storeName: {
    fontSize: 14,
    fontWeight: "600",
  },
  productBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  productBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    lineHeight: 22,
  },
  productRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
  },
  reviewCount: {
    fontSize: 12,
  },
  productPricing: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
  },
  addToCartButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  specialOfferBanner: {
    borderRadius: 20,
    padding: 25,
  },
  bannerContent: {
    alignItems: "center",
  },
  bannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 15,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  bannerDescription: {
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 26,
  },
  newsletterContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    maxWidth: 300,
  },
  newsletterInput: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: "white",
    fontSize: 16,
  },
  newsletterButton: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  newsletterButtonText: {
    color: "#7C3AED",
    fontWeight: "bold",
    fontSize: 16,
  },
  // סטיילים לחנויות מובילות
  trendingStoreCard: {
    width: 180,
    marginRight: 15,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  trendingStoreGradient: {
    padding: 20,
    minHeight: 220,
    justifyContent: "space-between",
  },
  hotBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  hotBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  trendingStoreLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "white",
    alignSelf: "center",
    marginBottom: 12,
  },
  trendingStoreName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  trendingStoreDescription: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 20,
  },
  trendingStoreStats: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 12,
  },
  trendingStoreStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  trendingStoreStatText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  trendingStoreGrowth: {
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  trendingStoreGrowthText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  trendingStoreOffer: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  trendingStoreOfferText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  // סטיילים לטרנדים שבועיים
  trendCard: {
    width: 280,
    marginRight: 15,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  trendImageContainer: {
    height: 140,
    position: "relative",
  },
  trendImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  trendImageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  trendScore: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  trendScoreGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  trendScoreText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  trendViews: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendViewsText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  trendContent: {
    padding: 16,
  },
  trendTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  trendSubtitle: {
    fontSize: 14,
    marginBottom: 6,
  },
  trendDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  trendProducts: {
    gap: 8,
  },
  trendProduct: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  trendProductImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  trendProductInfo: {
    flex: 1,
  },
  trendProductName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  trendProductPrice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trendProductPriceText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  trendProductOriginalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
  },
});
