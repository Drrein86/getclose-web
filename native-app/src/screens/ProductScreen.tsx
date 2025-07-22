import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  StatusBar,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "../contexts/ThemeContext";
import { useData } from "../contexts/DataContext";

const { width, height } = Dimensions.get("window");

interface ProductScreenProps {
  onNavigate: (route: string, params?: any) => void;
  productId?: string;
}

export default function ProductScreen({
  onNavigate,
  productId = "1",
}: ProductScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { state } = useData();

  // מוצר לדוגמה
  const product = state.featuredProducts?.find(
    (p: any) => p.id === productId
  ) ||
    state.featuredProducts?.[0] || {
      id: productId,
      name: "מוצר לא נמצא",
      price: 0,
      image: "",
      colors: [],
      sizes: [],
    };

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(product.isFavorite);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  // ביקורות לדוגמה
  const reviews = [
    {
      id: 1,
      user: "שרה כהן",
      rating: 5,
      comment: "איכות מעולה! בדיוק כמו בתמונה. הגודל מדויק ונוח מאוד.",
      date: "2024-01-15",
      verified: true,
      helpful: 12,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b1ab?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      user: "דוד לוי",
      rating: 4,
      comment: "מוצר טוב, משלוח מהיר. מומלץ!",
      date: "2024-01-10",
      verified: true,
      helpful: 8,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      user: "מיכל אברהם",
      rating: 5,
      comment: "פשוט מושלם! הצבע יפהפה והחומר איכותי.",
      date: "2024-01-08",
      verified: false,
      helpful: 15,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
  ];

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const ImageCarousel = () => (
    <View style={styles.imageCarousel}>
      <FlatList
        data={product.images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setSelectedImageIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.productImage} />
          </View>
        )}
        keyExtractor={(_: any, index: number) => index.toString()}
      />

      {/* אינדיקטורי תמונה */}
      <View style={styles.imageIndicators}>
        {product.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.imageIndicator,
              {
                backgroundColor:
                  index === selectedImageIndex
                    ? colors.primary
                    : "rgba(255,255,255,0.5)",
              },
            ]}
          />
        ))}
      </View>

      {/* כפתורי פעולה על התמונה */}
      <View style={styles.imageActions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: "rgba(255,255,255,0.9)" },
          ]}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#EF4444" : colors.text}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: "rgba(255,255,255,0.9)" },
          ]}
        >
          <Ionicons name="share-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* תגיות על התמונה */}
      <View style={styles.imagebadges}>
        {product.isNew && (
          <LinearGradient
            colors={["#10B981", "#059669"]}
            style={styles.imageBadge}
          >
            <Ionicons name="sparkles" size={14} color="white" />
            <Text style={styles.imageBadgeText}>חדש</Text>
          </LinearGradient>
        )}
        {product.isOnSale && (
          <LinearGradient
            colors={["#EF4444", "#DC2626"]}
            style={styles.imageBadge}
          >
            <Ionicons name="pricetag" size={14} color="white" />
            <Text style={styles.imageBadgeText}>-{product.discount}%</Text>
          </LinearGradient>
        )}
      </View>
    </View>
  );

  const ProductInfo = () => (
    <View style={[styles.productInfo, { backgroundColor: colors.background }]}>
      {/* כותרת ומחיר */}
      <View style={styles.productHeader}>
        <View style={styles.productTitleSection}>
          <Text style={[styles.productName, { color: colors.text }]}>
            {product.name}
          </Text>
          <TouchableOpacity
            style={[styles.storeBadge, { backgroundColor: colors.surface }]}
            onPress={() => onNavigate("/store", { id: product.storeId })}
          >
            <Ionicons name="storefront" size={16} color={colors.primary} />
            <Text style={[styles.storeName, { color: colors.primary }]}>
              {product.store.name}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.priceSection}>
          <Text style={[styles.currentPrice, { color: colors.text }]}>
            ₪{product.price}
          </Text>
          {product.originalPrice && (
            <Text
              style={[styles.originalPrice, { color: colors.textSecondary }]}
            >
              ₪{product.originalPrice}
            </Text>
          )}
          {product.discount && (
            <View
              style={[styles.discountBadge, { backgroundColor: colors.error }]}
            >
              <Text style={styles.discountText}>
                חסכון ₪{product.originalPrice! - product.price}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* דירוג וביקורות */}
      <View style={styles.ratingSection}>
        <View style={styles.rating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= product.rating ? "star" : "star-outline"}
              size={20}
              color="#F59E0B"
            />
          ))}
          <Text style={[styles.ratingText, { color: colors.text }]}>
            {product.rating}
          </Text>
        </View>
        <TouchableOpacity onPress={() => {}}>
          <Text style={[styles.reviewsLink, { color: colors.primary }]}>
            {product.reviewCount} ביקורות
          </Text>
        </TouchableOpacity>
      </View>

      {/* בחירת צבע */}
      <View style={styles.optionSection}>
        <Text style={[styles.optionTitle, { color: colors.text }]}>
          צבע: <Text style={{ fontWeight: "600" }}>{selectedColor}</Text>
        </Text>
        <View style={styles.colorOptions}>
          {product.colors.map((color: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.colorOption,
                {
                  backgroundColor: color,
                  borderColor:
                    selectedColor === color ? colors.primary : colors.border,
                  borderWidth: selectedColor === color ? 3 : 1,
                },
              ]}
              onPress={() => setSelectedColor(color)}
            >
              {selectedColor === color && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* בחירת גודל */}
      <View style={styles.optionSection}>
        <Text style={[styles.optionTitle, { color: colors.text }]}>
          גודל: <Text style={{ fontWeight: "600" }}>{selectedSize}</Text>
        </Text>
        <View style={styles.sizeOptions}>
          {product.sizes.map((size: any) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeOption,
                {
                  backgroundColor:
                    selectedSize === size ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setSelectedSize(size)}
            >
              <Text
                style={[
                  styles.sizeOptionText,
                  {
                    color:
                      selectedSize === size ? colors.background : colors.text,
                  },
                ]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* כמות */}
      <View style={styles.optionSection}>
        <Text style={[styles.optionTitle, { color: colors.text }]}>כמות</Text>
        <View style={styles.quantitySelector}>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: colors.surface }]}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Ionicons name="remove" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.quantityText, { color: colors.text }]}>
            {quantity}
          </Text>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: colors.surface }]}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Ionicons name="add" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* תיאור */}
      <View style={styles.descriptionSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>תיאור</Text>
        <Text
          style={[styles.description, { color: colors.textSecondary }]}
          numberOfLines={showFullDescription ? undefined : 3}
        >
          {product.description}
        </Text>
        <TouchableOpacity
          onPress={() => setShowFullDescription(!showFullDescription)}
        >
          <Text style={[styles.showMoreText, { color: colors.primary }]}>
            {showFullDescription ? "הראה פחות" : "הראה עוד"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* מלאי */}
      <View style={styles.stockSection}>
        <View style={styles.stockInfo}>
          <Ionicons
            name={product.stock > 10 ? "checkmark-circle" : "alert-circle"}
            size={20}
            color={product.stock > 10 ? "#10B981" : "#F59E0B"}
          />
          <Text style={[styles.stockText, { color: colors.text }]}>
            {product.stock > 10
              ? `${product.stock} יחידות במלאי`
              : `נותרו רק ${product.stock} יחידות!`}
          </Text>
        </View>
      </View>
    </View>
  );

  const ReviewsSection = () => (
    <View style={[styles.reviewsSection, { backgroundColor: colors.surface }]}>
      <View style={styles.reviewsHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          ביקורות ({reviews.length})
        </Text>
        <TouchableOpacity>
          <Text style={[styles.seeAllText, { color: colors.primary }]}>
            צפה בכל הביקורות
          </Text>
        </TouchableOpacity>
      </View>

      {reviews.slice(0, 2).map((review) => (
        <View
          key={review.id}
          style={[styles.reviewItem, { backgroundColor: colors.background }]}
        >
          <View style={styles.reviewHeader}>
            <View style={styles.reviewerInfo}>
              <Image
                source={{ uri: review.avatar }}
                style={styles.reviewerAvatar}
              />
              <View>
                <View style={styles.reviewerName}>
                  <Text
                    style={[styles.reviewerNameText, { color: colors.text }]}
                  >
                    {review.user}
                  </Text>
                  {review.verified && (
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#10B981"
                    />
                  )}
                </View>
                <View style={styles.reviewRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= review.rating ? "star" : "star-outline"}
                      size={14}
                      color="#F59E0B"
                    />
                  ))}
                  <Text
                    style={[styles.reviewDate, { color: colors.textSecondary }]}
                  >
                    {review.date}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={[styles.reviewComment, { color: colors.text }]}>
            {review.comment}
          </Text>

          <View style={styles.reviewActions}>
            <TouchableOpacity style={styles.helpfulButton}>
              <Ionicons
                name="thumbs-up-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text
                style={[styles.helpfulText, { color: colors.textSecondary }]}
              >
                מצליח ({review.helpful})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Header עם שקיפות */}
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            opacity: headerOpacity,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.headerButton,
            { backgroundColor: "rgba(255,255,255,0.9)" },
          ]}
          onPress={() => onNavigate("/home")}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Animated.Text
          style={[
            styles.headerTitle,
            { color: colors.text, opacity: headerOpacity },
          ]}
        >
          {product.name}
        </Animated.Text>

        <TouchableOpacity
          style={[
            styles.headerButton,
            { backgroundColor: "rgba(255,255,255,0.9)" },
          ]}
        >
          <Ionicons name="bag-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <ImageCarousel />
        <ProductInfo />
        <ReviewsSection />
      </Animated.ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            // הוסף לעגלה
            console.log("Added to cart:", {
              product: product.id,
              color: selectedColor,
              size: selectedSize,
              quantity,
            });
          }}
        >
          <Ionicons name="bag-add" size={20} color={colors.background} />
          <Text style={[styles.addToCartText, { color: colors.background }]}>
            הוסף לעגלה • ₪{product.price * quantity}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buyNowButton, { backgroundColor: colors.accent }]}
          onPress={() => {
            // קנה עכשיו
            onNavigate("/checkout", {
              product: product.id,
              color: selectedColor,
              size: selectedSize,
              quantity,
            });
          }}
        >
          <Text style={[styles.buyNowText, { color: colors.background }]}>
            קנה עכשיו
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  imageCarousel: {
    height: height * 0.5,
    position: "relative",
  },
  imageContainer: {
    width,
    height: height * 0.5,
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageIndicators: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  imageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  imageActions: {
    position: "absolute",
    top: 60,
    right: 20,
    gap: 10,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  imagebadges: {
    position: "absolute",
    top: 60,
    left: 20,
    gap: 8,
  },
  imageBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  imageBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  productInfo: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  productHeader: {
    marginBottom: 20,
  },
  productTitleSection: {
    marginBottom: 12,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 32,
    marginBottom: 8,
  },
  storeBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  storeName: {
    fontSize: 14,
    fontWeight: "600",
  },
  priceSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: "bold",
  },
  originalPrice: {
    fontSize: 18,
    textDecorationLine: "line-through",
  },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  reviewsLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  optionSection: {
    marginBottom: 24,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  colorOptions: {
    flexDirection: "row",
    gap: 12,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  sizeOptions: {
    flexDirection: "row",
    gap: 12,
  },
  sizeOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  sizeOptionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "600",
    minWidth: 30,
    textAlign: "center",
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: "600",
  },
  stockSection: {
    marginBottom: 24,
  },
  stockInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stockText: {
    fontSize: 14,
    fontWeight: "600",
  },
  reviewsSection: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  reviewItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewerName: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  reviewerNameText: {
    fontSize: 14,
    fontWeight: "600",
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    marginLeft: 8,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewActions: {
    flexDirection: "row",
  },
  helpfulButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  helpfulText: {
    fontSize: 12,
  },
  bottomBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    gap: 12,
  },
  addToCartButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buyNowButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  buyNowText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
