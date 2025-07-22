"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserTypeInfo } from "@/src/utils/userPermissions";
import {
  IoNotificationsOutline,
  IoGlobeOutline,
  IoMoonOutline,
  IoSunnyOutline,
  IoResizeOutline,
  IoPersonOutline,
  IoStorefrontOutline,
  IoRefreshOutline,
  IoBagOutline,
  IoSettingsOutline,
  IoColorPaletteOutline,
  IoShieldOutline,
  IoPhonePortraitOutline,
  IoHeartOutline,
  IoStarOutline,
  IoFlashOutline,
  IoTrophyOutline,
  IoDiamondOutline,
} from "react-icons/io5";
import { CgSpinner } from "react-icons/cg";
import { UserType } from "@/src/utils/userPermissions";
import { User } from "@/src/types";
import { getUserById } from "@/src/lib/database";

interface UserSettings {
  notifications: {
    newArrivals: boolean;
    sales: boolean;
    orderUpdates: boolean;
    backInStock: boolean;
  };
  language: string;
  theme: string;
  sizeSystem: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      newArrivals: true,
      sales: true,
      orderUpdates: true,
      backInStock: false,
    },
    language: "he",
    theme: "light",
    sizeSystem: "eu",
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // בשלב זה אנחנו נשתמש במשתמש קבוע עד שתהיה מערכת התחברות
      // בפרויקט אמיתי זה יהיה מ-session או token
      const userData = await getUserById("1"); // משתמש לדוגמא
      if (userData) {
        // המרת UserType מ-Prisma לטיפוס המקומי
        const userTypeMapping: { [key: string]: UserType } = {
          CUSTOMER: "customer",
          STORE_OWNER: "store",
          SECONDHAND_SELLER: "secondhand",
          HYBRID: "hybrid",
          ADMIN: "",
        };

        const mappedUser = {
          ...userData,
          userType: userTypeMapping[userData.userType] || "customer",
        };

        setUser(mappedUser as unknown as User);

        // טעינת הגדרות ברירת מחדל מכיוון שאין settings table עדיין
        setSettings({
          notifications: {
            newArrivals: true,
            sales: true,
            orderUpdates: true,
            backInStock: false,
          },
          language: "he",
          theme: "light",
          sizeSystem: "eu",
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    setSaving(true);
    try {
      // כרגע נשמור רק ב-localStorage עד שתהיה settings table
      const currentSettings = JSON.parse(
        localStorage.getItem("userSettings") || "{}"
      );
      const updatedSettings = { ...currentSettings, ...newSettings };
      localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
      console.log("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const toggleNotification = async (
    key: keyof typeof settings.notifications
  ) => {
    const newNotifications = {
      ...settings.notifications,
      [key]: !settings.notifications[key],
    };
    const newSettings = { ...settings, notifications: newNotifications };
    setSettings(newSettings);
    await saveSettings({ notifications: newNotifications });
  };

  const updateLanguage = async (language: string) => {
    const newSettings = { ...settings, language };
    setSettings(newSettings);
    await saveSettings({ language });
  };

  const updateTheme = async (theme: string) => {
    const newSettings = { ...settings, theme };
    setSettings(newSettings);
    await saveSettings({ theme });
  };

  const updateSizeSystem = async (sizeSystem: string) => {
    const newSettings = { ...settings, sizeSystem };
    setSettings(newSettings);
    await saveSettings({ sizeSystem });
  };

  const getCurrentUserType = () => {
    if (!user) return null;

    const userInfo = getUserTypeInfo(user.userType as UserType);
    return {
      icon: IoPersonOutline,
      label: userInfo.label,
      description: userInfo.description,
      color: `bg-gradient-to-r ${userInfo.color
        .replace("from-", "from-")
        .replace("to-", "to-")}`,
      bgColor: "from-gray-50 to-white",
      features: userInfo.features,
    };
  };

  const handleChangeUserType = () => {
    if (
      confirm(
        "האם אתה בטוח שברצונך לשנות את סוג החשבון? זה יפנה אותך לדף הבחירה."
      )
    ) {
      router.push("/user-type");
    }
  };

  const canShowSecondhandStore = () => {
    return user?.userType === "CUSTOMER" || user?.userType === "HYBRID";
  };

  const hasSecondhandStore = () => {
    return (
      user?.userType === "SECONDHAND_SELLER" || user?.userType === "HYBRID"
    );
  };

  const toggleSecondhandStore = async () => {
    if (!user) return;

    const newUserType = hasSecondhandStore()
      ? user.userType === "HYBRID"
        ? "STORE_OWNER"
        : "CUSTOMER"
      : user.userType === "STORE_OWNER"
      ? "HYBRID"
      : "SECONDHAND_SELLER";

    try {
      // כאן נעדכן את סוג המשתמש במסד הנתונים
      // await updateUserType(user.id, newUserType);

      // עדכון זמני עד שתהיה API function
      setUser({ ...user, userType: newUserType as any });
    } catch (error) {
      console.error("Error toggling secondhand store:", error);
    }
  };

  const ToggleSwitch = ({
    isOn,
    onToggle,
    disabled = false,
  }: {
    isOn: boolean;
    onToggle: () => void;
    disabled?: boolean;
  }) => (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300 ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : isOn
          ? "bg-black"
          : "bg-gray-300"
      }`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 transform ${
          isOn ? "translate-x-7" : "translate-x-0"
        }`}
      >
        <div
          className={`w-full h-full rounded-full ${
            isOn ? "bg-black" : "bg-gray-400"
          } opacity-20`}
        />
      </div>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <CgSpinner className="w-12 h-12 text-gray-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">טוען הגדרות...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">שגיאה בטעינת נתוני המשתמש</p>
          <button
            onClick={() => router.push("/user-type")}
            className="btn-primary"
          >
            התחבר מחדש
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full opacity-10 animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full opacity-10 animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full opacity-5 animate-pulse-custom" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-4 animate-bounce-custom">
            <IoSettingsOutline className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">הגדרות</h1>
          <p className="text-gray-600 text-lg">
            התאם את האפליקציה בדיוק כפי שאתה רוצה
          </p>
          {saving && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <CgSpinner className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="text-blue-600 text-sm">שומר הגדרות...</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* User Type Section */}
          <div className="card animate-slideIn hover-lift">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mr-4 animate-glow">
                <IoPersonOutline className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gradient">סוג החשבון</h2>
                <p className="text-gray-600">נהל את פרופיל המשתמש שלך</p>
              </div>
            </div>

            {getCurrentUserType() && (
              <div
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${
                  getCurrentUserType()!.bgColor
                } p-6 mb-6 border border-gray-200`}
              >
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 ${
                        getCurrentUserType()!.color
                      } rounded-2xl flex items-center justify-center animate-pulse-custom`}
                    >
                      {(() => {
                        const IconComponent = getCurrentUserType()!.icon;
                        return <IconComponent className="w-8 h-8 text-white" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {getCurrentUserType()!.label}
                      </h3>
                      <p className="text-gray-600 flex items-center gap-1 mb-2">
                        <IoTrophyOutline className="w-4 h-4" />
                        {getCurrentUserType()!.description}
                      </p>
                      <div className="text-sm text-gray-500 mb-2">
                        {user.email}
                      </div>
                      {getCurrentUserType()!.features && (
                        <div className="flex flex-wrap gap-1">
                          {getCurrentUserType()!.features.map(
                            (feature, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                              >
                                {feature}
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleChangeUserType}
                    className="btn-primary hover-scale flex items-center gap-2"
                  >
                    <IoDiamondOutline className="w-4 h-4" />
                    שנה סוג חשבון
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Section */}
          <div
            className="card animate-slideIn hover-lift"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mr-4 animate-glow">
                <IoNotificationsOutline className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gradient">התראות</h2>
                <p className="text-gray-600">התאם את ההתראות שלך</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  key: "newArrivals",
                  label: "פריטים חדשים",
                  icon: IoStarOutline,
                  desc: "קבל עדכונים על מוצרים חדשים",
                },
                {
                  key: "sales",
                  label: "מבצעים והנחות",
                  icon: IoFlashOutline,
                  desc: "הודעות על מבצעים מיוחדים",
                },
                {
                  key: "orderUpdates",
                  label: "עדכוני הזמנות",
                  icon: IoBagOutline,
                  desc: "מעקב אחר סטטוס ההזמנות",
                },
                {
                  key: "backInStock",
                  label: "חזרה למלאי",
                  icon: IoHeartOutline,
                  desc: "התראה כשמוצר חוזר למלאי",
                },
              ].map((item, index) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {item.label}
                      </p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    isOn={
                      settings.notifications[
                        item.key as keyof typeof settings.notifications
                      ]
                    }
                    onToggle={() =>
                      toggleNotification(
                        item.key as keyof typeof settings.notifications
                      )
                    }
                    disabled={saving}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Language Section */}
          <div
            className="card animate-slideIn hover-lift"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center mr-4 animate-glow">
                <IoGlobeOutline className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gradient">שפה</h2>
                <p className="text-gray-600">בחר את השפה המועדפת עליך</p>
              </div>
            </div>

            <div className="relative">
              <select
                value={settings.language}
                onChange={(e) => updateLanguage(e.target.value)}
                disabled={saving}
                className="w-full p-4 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:border-gray-500 focus:outline-none transition-all duration-300 text-lg font-medium appearance-none cursor-pointer hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="he">🇮🇱 עברית</option>
                <option value="en">🇺🇸 English</option>
                <option value="ar">🇸🇦 العربية</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Theme Section */}
          <div
            className="card animate-slideIn hover-lift"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center mr-4 animate-glow">
                {settings.theme === "light" ? (
                  <IoSunnyOutline className="w-6 h-6 text-white" />
                ) : (
                  <IoMoonOutline className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gradient">מצב תצוגה</h2>
                <p className="text-gray-600">בחר בין מצב בהיר לכהה</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => updateTheme("light")}
                disabled={saving}
                className={`p-6 rounded-xl border-2 transition-all duration-300 hover-lift disabled:opacity-50 disabled:cursor-not-allowed ${
                  settings.theme === "light"
                    ? "bg-black text-white border-black shadow-lg"
                    : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
              >
                <IoSunnyOutline className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">בהיר</p>
                <p className="text-sm opacity-75">מצב יום</p>
              </button>
              <button
                onClick={() => updateTheme("dark")}
                disabled={saving}
                className={`p-6 rounded-xl border-2 transition-all duration-300 hover-lift disabled:opacity-50 disabled:cursor-not-allowed ${
                  settings.theme === "dark"
                    ? "bg-gray-900 text-white border-gray-700 shadow-lg"
                    : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
              >
                <IoMoonOutline className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">כהה</p>
                <p className="text-sm opacity-75">מצב לילה</p>
              </button>
            </div>
          </div>

          {/* Size System Section */}
          <div
            className="card animate-slideIn hover-lift"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-800 to-black rounded-xl flex items-center justify-center mr-4 animate-glow">
                <IoResizeOutline className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gradient">
                  מערכת מידות
                </h2>
                <p className="text-gray-600">בחר את מערכת המידות המועדפת</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => updateSizeSystem("eu")}
                disabled={saving}
                className={`p-6 rounded-xl border-2 transition-all duration-300 hover-lift disabled:opacity-50 disabled:cursor-not-allowed ${
                  settings.sizeSystem === "eu"
                    ? "bg-black text-white border-black shadow-lg"
                    : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
              >
                <div className="text-2xl mb-2">🇪🇺</div>
                <p className="font-semibold">אירופאי (EU)</p>
                <p className="text-sm opacity-75">מידות אירופאיות</p>
              </button>
              <button
                onClick={() => updateSizeSystem("us")}
                disabled={saving}
                className={`p-6 rounded-xl border-2 transition-all duration-300 hover-lift disabled:opacity-50 disabled:cursor-not-allowed ${
                  settings.sizeSystem === "us"
                    ? "bg-gray-800 text-white border-gray-700 shadow-lg"
                    : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
              >
                <div className="text-2xl mb-2">🇺🇸</div>
                <p className="font-semibold">אמריקאי (US)</p>
                <p className="text-sm opacity-75">מידות אמריקאיות</p>
              </button>
            </div>
          </div>

          {/* Secondhand Store Settings - Only for relevant user types */}
          {canShowSecondhandStore() && (
            <div
              className="card animate-slideIn hover-lift"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-green-700 rounded-xl flex items-center justify-center mr-4 animate-glow">
                  <IoRefreshOutline className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gradient">
                    חנות יד שנייה
                  </h2>
                  <p className="text-gray-600">הפעל מכירת פריטים יד שנייה</p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 p-6 border border-emerald-200">
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        הפעלת מכירות יד שנייה
                      </h3>
                      <p className="text-gray-600 text-sm">
                        התחל למכור פריטים משלך ותרוויח כסף נוסף
                      </p>
                    </div>
                    <ToggleSwitch
                      isOn={hasSecondhandStore()}
                      onToggle={toggleSecondhandStore}
                      disabled={saving}
                    />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <IoStarOutline className="w-4 h-4" />
                    <span>עמלה נמוכה של 5% בלבד</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Settings */}
          <div
            className="card animate-slideIn hover-lift"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl flex items-center justify-center mr-4 animate-glow">
                <IoShieldOutline className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gradient">
                  הגדרות נוספות
                </h2>
                <p className="text-gray-600">אפשרויות מתקדמות</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-gray-100 hover:to-gray-50 transition-all duration-300 cursor-pointer hover-lift border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <IoPhonePortraitOutline className="w-5 h-5 text-gray-700" />
                  <h3 className="font-semibold text-gray-900">הגדרות מובייל</h3>
                </div>
                <p className="text-sm text-gray-600">התאם את חוויית המובייל</p>
              </div>

              <button
                onClick={() => router.push("/design-settings")}
                className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-gray-100 hover:to-gray-50 transition-all duration-300 cursor-pointer hover-lift border border-gray-200 w-full text-right"
              >
                <div className="flex items-center gap-3 mb-2">
                  <IoColorPaletteOutline className="w-5 h-5 text-gray-700" />
                  <h3 className="font-semibold text-gray-900">
                    התאמה אישית מתקדמת
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  צבעים, גופנים ועיצוב מלא
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="text-center mt-12 animate-fadeIn"
          style={{ animationDelay: "0.6s" }}
        >
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <IoHeartOutline className="w-4 h-4 text-gray-500" />
            נוצר עם אהבה עבור המשתמשים שלנו
          </p>
        </div>
      </div>
    </div>
  );
}
