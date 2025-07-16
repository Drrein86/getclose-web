"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Phone,
  Mail,
  Clock,
  Star,
  Package,
  Heart,
  ShoppingBag,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot" | "support";
  content: string;
  timestamp: Date;
  quickActions?: QuickAction[];
  productSuggestion?: ProductSuggestion;
}

interface QuickAction {
  text: string;
  action: string;
}

interface ProductSuggestion {
  id: string;
  name: string;
  price: number;
  image: string;
  store: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "שלום! אני עוזר הקנייה החכם של GetClose 🛍️\nאני כאן לעזור לך למצוא את המוצרים הטובים ביותר, לענות על שאלות ולתת המלצות מותאמות אישית.\n\nבמה אוכל לעזור לך היום?",
      timestamp: new Date(),
      quickActions: [
        { text: "🔍 חפש מוצרים", action: "search" },
        { text: "🏪 מצא חנויות", action: "stores" },
        { text: "📦 עקוב אחר הזמנה", action: "track" },
        { text: "💡 קבל המלצות", action: "recommendations" },
      ],
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState<"bot" | "support">("bot");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();

    // AI-like responses based on keywords
    if (lowerMessage.includes("חולצה") || lowerMessage.includes("חולצות")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "מצאתי כמה חולצות מעולות בשבילך! הנה ההמלצות שלי בהתבסס על הטרנדים הנוכחיים ודירוגי הלקוחות:",
        timestamp: new Date(),
        productSuggestion: {
          id: "1",
          name: "חולצת כותנה פרימיום",
          price: 149,
          image: "👕",
          store: "זארה",
        },
        quickActions: [
          { text: "👀 ראה עוד חולצות", action: "more_shirts" },
          { text: "🎨 שנה צבע", action: "change_color" },
          { text: "📏 מדריך מידות", action: "size_guide" },
        ],
      };
    }

    if (lowerMessage.includes("נעליים") || lowerMessage.includes("נעלי")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "נעליים זה התחום שלי! 👟 איזה סוג נעליים אתה מחפש? ספורט, אלגנטיות, או אולי משהו יומיומי?",
        timestamp: new Date(),
        quickActions: [
          { text: "👟 נעלי ספורט", action: "sport_shoes" },
          { text: "👞 נעליים אלגנטיות", action: "formal_shoes" },
          { text: "👡 נעלי נשים", action: "women_shoes" },
          { text: "🧒 נעלי ילדים", action: "kids_shoes" },
        ],
      };
    }

    if (
      lowerMessage.includes("מחיר") ||
      lowerMessage.includes("זול") ||
      lowerMessage.includes("הנחה")
    ) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "אני מבין שאתה מחפש משהו במחיר טוב! 💰 יש לי כמה טיפים:\n\n• בדוק את המבצעים השבועיים\n• השווה מחירים בין חנויות\n• הירשם להתראות על הנחות\n• חפש קודי הנחה בלעדיים",
        timestamp: new Date(),
        quickActions: [
          { text: "🏷️ מבצעים היום", action: "deals" },
          { text: "🔔 התראות הנחות", action: "notifications" },
          { text: "🎫 קודי הנחה", action: "coupons" },
        ],
      };
    }

    if (lowerMessage.includes("המלצה") || lowerMessage.includes("מה כדאי")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "בהתבסס על ההעדפות שלך וההיסטוריה שלך, הנה ההמלצות הטובות ביותר שלי:\n\n🎯 מותאם במיוחד בשבילך:\n• פריטים שמתאימים לסגנון שלך\n• במחירים שהגדרת\n• מחנויות עם דירוג גבוה",
        timestamp: new Date(),
        quickActions: [
          { text: "✨ המלצות אישיות", action: "personal_recommendations" },
          { text: "🔥 הטרנדים החמים", action: "trending" },
          { text: "⭐ המוצרים המדורגים", action: "top_rated" },
        ],
      };
    }

    if (lowerMessage.includes("משלוח") || lowerMessage.includes("זמן אספקה")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "בנוגע למשלוח, הנה המידע החשוב:\n\n📦 זמני משלוח:\n• משלוח רגיל: 3-5 ימי עסקים\n• משלוח מהיר: 1-2 ימי עסקים\n• איסוף עצמי: זמין באותו יום\n\n🚚 משלוח חינם מעל ₪150",
        timestamp: new Date(),
        quickActions: [
          { text: "📍 נקודות איסוף", action: "pickup_points" },
          { text: "📦 עקוב אחר משלוח", action: "track_delivery" },
        ],
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      type: "bot",
      content:
        "מעניין! 🤔 אני לומד כל הזמן ומשתפר. תוכל לנסח את השאלה שלך בצורה קצת שונה? או שאולי תרצה שאעזור לך עם אחד מהנושאים האלה:",
      timestamp: new Date(),
      quickActions: [
        { text: "🔍 חיפוש מוצרים", action: "search" },
        { text: "🏪 מידע על חנויות", action: "store_info" },
        { text: "💳 תשלום ומשלוח", action: "payment_info" },
        { text: "👤 שירות לקוחות", action: "human_support" },
      ],
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickAction = (action: string) => {
    let responseMessage = "";

    switch (action) {
      case "search":
        responseMessage = "אני רוצה לחפש מוצרים";
        break;
      case "stores":
        responseMessage = "אני מחפש חנויות בקרבתי";
        break;
      case "track":
        responseMessage = "אני רוצה לעקוב אחר ההזמנה שלי";
        break;
      case "recommendations":
        responseMessage = "תן לי המלצות על מוצרים";
        break;
      case "human_support":
        setChatMode("support");
        const supportMessage: Message = {
          id: Date.now().toString(),
          type: "support",
          content:
            "שלום! אני נציג שירות הלקוחות של GetClose 👨‍💼\nאני כאן לעזור לך עם כל שאלה או בעיה. איך אוכל לסייע?",
          timestamp: new Date(),
          quickActions: [
            { text: "📞 בקש שיחה", action: "call_request" },
            { text: "📧 שלח מייל", action: "email_support" },
            { text: "🤖 חזור לבוט", action: "back_to_bot" },
          ],
        };
        setMessages((prev) => [...prev, supportMessage]);
        return;
      default:
        responseMessage = action;
    }

    setInputMessage(responseMessage);
    handleSendMessage();
  };

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="bg-white shadow-lg p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              {chatMode === "bot" ? (
                <Bot className="w-6 h-6 text-white" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h1 className="font-bold text-lg">
                {chatMode === "bot" ? "עוזר הקנייה החכם" : "שירות לקוחות"}
              </h1>
              <p className="text-sm text-gray-500">
                {chatMode === "bot" ? "פעיל 24/7" : "זמין כעת"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setChatMode("bot")}
              className={`p-2 rounded-lg transition-colors ${
                chatMode === "bot"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <Bot className="w-5 h-5" />
            </button>
            <button
              onClick={() => setChatMode("support")}
              className={`p-2 rounded-lg transition-colors ${
                chatMode === "support"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-thin">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.type === "user"
                  ? "bg-primary-600 text-white"
                  : message.type === "support"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800 shadow-md"
              }`}
            >
              <p className="whitespace-pre-line">{message.content}</p>

              {message.productSuggestion && (
                <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                      {message.productSuggestion.image}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">
                        {message.productSuggestion.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        מ-{message.productSuggestion.store}
                      </p>
                      <p className="font-bold text-primary-600">
                        ₪{message.productSuggestion.price}
                      </p>
                    </div>
                  </div>
                  <button className="w-full mt-2 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors">
                    רוצה לראות
                  </button>
                </div>
              )}

              {message.quickActions && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.action)}
                      className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs hover:bg-opacity-30 transition-colors"
                    >
                      {action.text}
                    </button>
                  ))}
                </div>
              )}

              <p className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString("he-IL", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 shadow-md px-4 py-2 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white p-4 border-t">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="הקלד הודעה..."
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="p-3 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestions */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {[
            { text: "👕 חולצות", action: "חולצות טרנדיות" },
            { text: "👟 נעליים", action: "נעלי ספורט" },
            { text: "💰 מבצעים", action: "מה המבצעים היום?" },
            { text: "🚚 משלוח", action: "מידע על משלוח" },
            { text: "📏 מידות", action: "מדריך מידות" },
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(suggestion.action)}
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm whitespace-nowrap hover:bg-gray-200 transition-colors"
            >
              {suggestion.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
