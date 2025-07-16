"use client";

import { useState } from "react";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Camera,
  Filter,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  date: string;
  productName: string;
  size?: string;
  color?: string;
  storeResponse?: {
    message: string;
    date: string;
  };
}

export default function ReviewsPage() {
  const [filter, setFilter] = useState<"all" | "verified" | "with-photos">(
    "all"
  );
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest" | "helpful"
  >("newest");
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    comment: "",
    images: [] as string[],
  });

  const mockReviews: Review[] = [
    {
      id: "1",
      userName: "שרה כהן",
      userAvatar: "👩",
      rating: 5,
      title: "איכות מעולה!",
      comment:
        "החולצה הגיעה מהר והאיכות מצוינת. הבד רך ונעים ומתאים בדיוק למידה שהזמנתי. בהחלט אזמין שוב!",
      images: ["📸", "📸"],
      isVerifiedPurchase: true,
      helpfulCount: 12,
      notHelpfulCount: 1,
      date: "2024-01-15",
      productName: "חולצת כותנה כחולה",
      size: "M",
      color: "כחול",
      storeResponse: {
        message: "תודה על הביקורת החיובית! אנחנו שמחים שאת מרוצה מהרכישה.",
        date: "2024-01-16",
      },
    },
    {
      id: "2",
      userName: "דוד לוי",
      userAvatar: "👨",
      rating: 4,
      title: "טוב אבל יכול להיות יותר טוב",
      comment:
        "הנעליים נוחות ויפות, אבל הגיעו קצת מאוחר מהמתוכנן. בסך הכל מרוצה.",
      images: ["📸"],
      isVerifiedPurchase: true,
      helpfulCount: 8,
      notHelpfulCount: 2,
      date: "2024-01-10",
      productName: "נעלי ספורט נייקי",
      size: "42",
      color: "שחור",
    },
    {
      id: "3",
      userName: "מיכל אברהם",
      userAvatar: "👩",
      rating: 3,
      title: "בסדר אבל לא מה שציפיתי",
      comment: "השמלה יפה אבל הצבע קצת שונה ממה שראיתי באתר. האיכות סבירה.",
      images: [],
      isVerifiedPurchase: false,
      helpfulCount: 5,
      notHelpfulCount: 3,
      date: "2024-01-08",
      productName: "שמלה שחורה",
      size: "S",
      color: "שחור",
    },
  ];

  const filteredReviews = mockReviews.filter((review) => {
    if (filter === "verified") return review.isVerifiedPurchase;
    if (filter === "with-photos") return review.images.length > 0;
    return true;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      case "helpful":
        return b.helpfulCount - a.helpfulCount;
      default:
        return 0;
    }
  });

  const averageRating =
    mockReviews.reduce((sum, review) => sum + review.rating, 0) /
    mockReviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(
    (rating) => mockReviews.filter((review) => review.rating === rating).length
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">ביקורות לקוחות</h1>
          <button
            onClick={() => setShowWriteReview(true)}
            className="bg-primary-600 text-white px-6 py-2 rounded-xl hover:bg-primary-700 transition-colors"
          >
            כתוב ביקורת
          </button>
        </div>

        {/* Rating Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= averageRating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600">מתוך {mockReviews.length} ביקורות</p>
          </div>

          <div className="space-y-2">
            {ratingDistribution.map((count, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm w-8">{5 - index}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${(count / mockReviews.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              כל הביקורות
            </button>
            <button
              onClick={() => setFilter("verified")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === "verified"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              רכישה מאומתת
            </button>
            <button
              onClick={() => setFilter("with-photos")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === "with-photos"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              עם תמונות
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm"
          >
            <option value="newest">החדשות ביותר</option>
            <option value="oldest">הישנות ביותר</option>
            <option value="highest">דירוג גבוה</option>
            <option value="lowest">דירוג נמוך</option>
            <option value="helpful">הכי מועילות</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                {review.userAvatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{review.userName}</h3>
                  {review.isVerifiedPurchase && (
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <CheckCircle className="w-3 h-3" />
                      <span>רכישה מאומתת</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {review.productName} • {review.size && `מידה ${review.size}`}{" "}
                  • {review.color}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">{review.title}</h4>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>

            {review.images.length > 0 && (
              <div className="flex gap-2 mb-4">
                {review.images.map((image, index) => (
                  <div
                    key={index}
                    className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-2xl"
                  >
                    {image}
                  </div>
                ))}
              </div>
            )}

            {review.storeResponse && (
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                    🏪
                  </div>
                  <span className="font-medium text-blue-800">תגובת החנות</span>
                  <span className="text-sm text-blue-600">
                    {review.storeResponse.date}
                  </span>
                </div>
                <p className="text-blue-700">{review.storeResponse.message}</p>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <button className="flex items-center gap-1 hover:text-green-600 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span>מועיל ({review.helpfulCount})</span>
              </button>
              <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
                <ThumbsDown className="w-4 h-4" />
                <span>לא מועיל ({review.notHelpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {showWriteReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">כתוב ביקורת</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  דירוג
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setNewReview((prev) => ({ ...prev, rating: star }))
                      }
                      className={`p-1 ${
                        star <= newReview.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  כותרת
                </label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) =>
                    setNewReview((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="תן כותרת לביקורת..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  הביקורת שלך
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="ספר לנו על החוויה שלך..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  הוסף תמונות
                </label>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Camera className="w-4 h-4" />
                  <span>הוסף תמונות</span>
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowWriteReview(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  ביטול
                </button>
                <button
                  onClick={() => {
                    // Handle review submission
                    setShowWriteReview(false);
                    setNewReview({
                      rating: 0,
                      title: "",
                      comment: "",
                      images: [],
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  פרסם ביקורת
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
