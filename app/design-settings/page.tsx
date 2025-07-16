"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  useTheme,
  useThemeColors,
  useThemeGradients,
  PRESET_THEMES,
  TYPOGRAPHY_SETTINGS,
  SPACING_SETTINGS,
  ANIMATION_SETTINGS,
} from "@/src/contexts/ThemeContext";
import {
  IoColorPaletteOutline,
  IoTextOutline,
  IoResizeOutline,
  IoFlashOutline,
  IoEyeOutline,
  IoDownloadOutline,
  IoCloudUploadOutline,
  IoRefreshOutline,
  IoCheckmarkOutline,
  IoCopyOutline,
  IoSparkles,
  IoSettingsOutline,
  IoArrowBackOutline,
  IoMoonOutline,
  IoSunnyOutline,
  IoHeartOutline,
  IoStarOutline,
} from "react-icons/io5";

export default function DesignSettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<
    "themes" | "colors" | "typography" | "spacing" | "animations" | "effects"
  >("themes");
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  const {
    settings,
    updateTheme,
    updateCustomColors,
    updateCustomGradients,
    updateTypography,
    updateSpacing,
    updateAnimations,
    updateEffects,
    resetToDefault,
    exportSettings,
    importSettings,
  } = useTheme();

  const colors = useThemeColors();
  const gradients = useThemeGradients();

  const tabs = [
    { key: "themes", label: "תבניות", icon: IoColorPaletteOutline },
    { key: "colors", label: "צבעים", icon: IoColorPaletteOutline },
    { key: "typography", label: "טיפוגרפיה", icon: IoTextOutline },
    { key: "spacing", label: "רווחים", icon: IoResizeOutline },
    { key: "animations", label: "אנימציות", icon: IoFlashOutline },
    { key: "effects", label: "אפקטים", icon: IoSparkles },
  ];

  const handleColorChange = (colorKey: string, value: string) => {
    updateCustomColors({ [colorKey]: value });
  };

  const handleExport = () => {
    const settingsJson = exportSettings();
    navigator.clipboard.writeText(settingsJson);
    setShowExportModal(true);
  };

  const handleImport = () => {
    try {
      importSettings(importText);
      setShowImportModal(false);
      setImportText("");
      alert("ההגדרות יובאו בהצלחה!");
    } catch (error) {
      alert("שגיאה ביבוא ההגדרות");
    }
  };

  const ColorPicker = ({
    label,
    value,
    onChange,
    description,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    description?: string;
  }) => (
    <div className="p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <div>
          <label className="text-sm font-semibold text-gray-900">{label}</label>
          {description && (
            <p className="text-xs text-gray-600 mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-lg border-2 border-white shadow-lg cursor-pointer"
            style={{ backgroundColor: value }}
            onClick={() => document.getElementById(`color-${label}`)?.click()}
          />
          <input
            id={`color-${label}`}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="opacity-0 w-0 h-0"
          />
        </div>
      </div>
      <div className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
        {value}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300"
              >
                <IoArrowBackOutline className="w-5 h-5" />
                <span>חזור</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <IoSettingsOutline className="w-7 h-7" />
                  הגדרות עיצוב מתקדמות
                </h1>
                <p className="text-gray-600">
                  התאם את המראה והתחושה של האפליקציה
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  showPreview
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <IoEyeOutline className="w-5 h-5" />
                תצוגה מקדימה
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-xl transition-all duration-300"
              >
                <IoDownloadOutline className="w-5 h-5" />
                ייצא הגדרות
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-xl transition-all duration-300"
              >
                <IoCloudUploadOutline className="w-5 h-5" />
                יבא הגדרות
              </button>
              <button
                onClick={resetToDefault}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl transition-all duration-300"
              >
                <IoRefreshOutline className="w-5 h-5" />
                איפוס
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-32">
              <h3 className="font-bold text-lg mb-4 text-gray-900">קטגוריות</h3>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-right ${
                      activeTab === tab.key
                        ? "bg-gray-900 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Themes Tab */}
              {activeTab === "themes" && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                    <IoColorPaletteOutline className="w-6 h-6" />
                    תבניות עיצוב
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(PRESET_THEMES).map(([key, theme]) => (
                      <button
                        key={key}
                        onClick={() =>
                          updateTheme(key as keyof typeof PRESET_THEMES)
                        }
                        className={`p-6 rounded-xl border-2 transition-all duration-300 text-right ${
                          settings.currentTheme === key
                            ? "border-gray-900 bg-gray-50 shadow-lg"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-lg">{theme.name}</h3>
                          {settings.currentTheme === key && (
                            <IoCheckmarkOutline className="w-6 h-6 text-green-600" />
                          )}
                        </div>
                        <div className="flex gap-2 mb-4">
                          <div
                            className="w-8 h-8 rounded-lg border border-gray-300"
                            style={{ backgroundColor: theme.colors.primary }}
                          />
                          <div
                            className="w-8 h-8 rounded-lg border border-gray-300"
                            style={{ backgroundColor: theme.colors.secondary }}
                          />
                          <div
                            className="w-8 h-8 rounded-lg border border-gray-300"
                            style={{ backgroundColor: theme.colors.accent }}
                          />
                          <div
                            className="w-8 h-8 rounded-lg border border-gray-300"
                            style={{ backgroundColor: theme.colors.background }}
                          />
                        </div>
                        <p className="text-sm text-gray-600">
                          {key === "minimal" && "עיצוב נקי ומינימליסטי"}
                          {key === "colorful" && "עיצוב צבעוני ועליז"}
                          {key === "dark" && "עיצוב כהה ומסתורי"}
                          {key === "luxury" && "עיצוב יוקרתי ואלגנטי"}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors Tab */}
              {activeTab === "colors" && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                    <IoColorPaletteOutline className="w-6 h-6" />
                    התאמת צבעים
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ColorPicker
                      label="צבע ראשי"
                      value={colors.primary}
                      onChange={(value) => handleColorChange("primary", value)}
                      description="הצבע הראשי של האפליקציה"
                    />
                    <ColorPicker
                      label="צבע משני"
                      value={colors.secondary}
                      onChange={(value) =>
                        handleColorChange("secondary", value)
                      }
                      description="צבע לאלמנטים משניים"
                    />
                    <ColorPicker
                      label="צבע דגש"
                      value={colors.accent}
                      onChange={(value) => handleColorChange("accent", value)}
                      description="צבע להדגשות ופעולות"
                    />
                    <ColorPicker
                      label="רקע ראשי"
                      value={colors.background}
                      onChange={(value) =>
                        handleColorChange("background", value)
                      }
                      description="רקע העמודים"
                    />
                    <ColorPicker
                      label="רקע משטחים"
                      value={colors.surface}
                      onChange={(value) => handleColorChange("surface", value)}
                      description="רקע כרטיסים ואזורים"
                    />
                    <ColorPicker
                      label="טקסט ראשי"
                      value={colors.text}
                      onChange={(value) => handleColorChange("text", value)}
                      description="צבע הטקסט הראשי"
                    />
                    <ColorPicker
                      label="טקסט משני"
                      value={colors.textSecondary}
                      onChange={(value) =>
                        handleColorChange("textSecondary", value)
                      }
                      description="צבע טקסט משני"
                    />
                    <ColorPicker
                      label="גבולות"
                      value={colors.border}
                      onChange={(value) => handleColorChange("border", value)}
                      description="צבע הגבולות והמסגרות"
                    />
                    <ColorPicker
                      label="הצלחה"
                      value={colors.success}
                      onChange={(value) => handleColorChange("success", value)}
                      description="צבע הודעות הצלחה"
                    />
                  </div>
                </div>
              )}

              {/* Typography Tab */}
              {activeTab === "typography" && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                    <IoTextOutline className="w-6 h-6" />
                    הגדרות טיפוגרפיה
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        משפחת גופנים
                      </label>
                      <select
                        value={settings.typography.fontFamily}
                        onChange={(e) =>
                          updateTypography({ fontFamily: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-xl focus:border-gray-500 focus:outline-none"
                      >
                        {Object.entries(TYPOGRAPHY_SETTINGS.fontFamily).map(
                          ([key, value]) => (
                            <option key={key} value={value}>
                              {key === "primary" && "Inter (ראשי)"}
                              {key === "secondary" && "Heebo (עברית)"}
                              {key === "mono" && "JetBrains Mono (מונו)"}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        גודל גופן בסיסי
                      </label>
                      <select
                        value={settings.typography.fontSize}
                        onChange={(e) =>
                          updateTypography({ fontSize: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-xl focus:border-gray-500 focus:outline-none"
                      >
                        {Object.entries(TYPOGRAPHY_SETTINGS.fontSize).map(
                          ([key, value]) => (
                            <option key={key} value={value}>
                              {key} ({value})
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        עובי גופן
                      </label>
                      <select
                        value={settings.typography.fontWeight}
                        onChange={(e) =>
                          updateTypography({ fontWeight: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-xl focus:border-gray-500 focus:outline-none"
                      >
                        {Object.entries(TYPOGRAPHY_SETTINGS.fontWeight).map(
                          ([key, value]) => (
                            <option key={key} value={value}>
                              {key} ({value})
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Spacing Tab */}
              {activeTab === "spacing" && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                    <IoResizeOutline className="w-6 h-6" />
                    הגדרות רווחים
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        עיגול פינות
                      </label>
                      <select
                        value={settings.spacing.borderRadius}
                        onChange={(e) =>
                          updateSpacing({ borderRadius: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-xl focus:border-gray-500 focus:outline-none"
                      >
                        {Object.entries(SPACING_SETTINGS.borderRadius).map(
                          ([key, value]) => (
                            <option key={key} value={value}>
                              {key} ({value})
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        רווח פנימי בסיסי
                      </label>
                      <select
                        value={settings.spacing.padding}
                        onChange={(e) =>
                          updateSpacing({ padding: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-xl focus:border-gray-500 focus:outline-none"
                      >
                        {Object.entries(SPACING_SETTINGS.spacing).map(
                          ([key, value]) => (
                            <option key={key} value={value}>
                              {key} ({value})
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        רווח חיצוני בסיסי
                      </label>
                      <select
                        value={settings.spacing.margin}
                        onChange={(e) =>
                          updateSpacing({ margin: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-xl focus:border-gray-500 focus:outline-none"
                      >
                        {Object.entries(SPACING_SETTINGS.spacing).map(
                          ([key, value]) => (
                            <option key={key} value={value}>
                              {key} ({value})
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Animations Tab */}
              {activeTab === "animations" && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                    <IoFlashOutline className="w-6 h-6" />
                    הגדרות אנימציות
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          הפעלת אנימציות
                        </h3>
                        <p className="text-sm text-gray-600">
                          הפעל או בטל אנימציות באפליקציה
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          updateAnimations({
                            enabled: !settings.animations.enabled,
                          })
                        }
                        className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                          settings.animations.enabled
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${
                            settings.animations.enabled
                              ? "right-0.5"
                              : "right-7"
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        משך אנימציה
                      </label>
                      <select
                        value={settings.animations.duration}
                        onChange={(e) =>
                          updateAnimations({ duration: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-xl focus:border-gray-500 focus:outline-none"
                      >
                        {Object.entries(ANIMATION_SETTINGS.duration).map(
                          ([key, value]) => (
                            <option key={key} value={value}>
                              {key} ({value})
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        סוג אנימציה
                      </label>
                      <select
                        value={settings.animations.easing}
                        onChange={(e) =>
                          updateAnimations({ easing: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-xl focus:border-gray-500 focus:outline-none"
                      >
                        {Object.entries(ANIMATION_SETTINGS.easing).map(
                          ([key, value]) => (
                            <option key={key} value={value}>
                              {key}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Effects Tab */}
              {activeTab === "effects" && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                    <IoSparkles className="w-6 h-6" />
                    אפקטים ויזואליים
                  </h2>
                  <div className="space-y-4">
                    {Object.entries(settings.effects).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {key === "glassmorphism" && "אפקט זכוכית"}
                            {key === "shadows" && "צללים"}
                            {key === "gradients" && "גרדיאנטים"}
                            {key === "animations" && "אנימציות מתקדמות"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {key === "glassmorphism" && "אפקט שקיפות וטשטוש"}
                            {key === "shadows" && "צללים מתחת לאלמנטים"}
                            {key === "gradients" && "מעברי צבעים"}
                            {key === "animations" && "אנימציות מורכבות"}
                          </p>
                        </div>
                        <button
                          onClick={() => updateEffects({ [key]: !value })}
                          className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                            value ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${
                              value ? "right-0.5" : "right-7"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Section */}
              {showPreview && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                    <IoEyeOutline className="w-6 h-6" />
                    תצוגה מקדימה
                  </h2>
                  <div className="space-y-4">
                    {/* Sample Button */}
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">
                        כפתורים לדוגמה:
                      </p>
                      <div className="flex gap-4 flex-wrap">
                        <button
                          className="px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                          style={{
                            backgroundColor: colors.primary,
                            color: colors.background,
                            borderRadius: settings.spacing.borderRadius,
                          }}
                        >
                          כפתור ראשי
                        </button>
                        <button
                          className="px-6 py-3 rounded-xl font-semibold border-2 transition-all duration-300"
                          style={{
                            borderColor: colors.primary,
                            color: colors.primary,
                            borderRadius: settings.spacing.borderRadius,
                          }}
                        >
                          כפתור משני
                        </button>
                        <button
                          className="px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                          style={{
                            backgroundColor: colors.accent,
                            color: colors.background,
                            borderRadius: settings.spacing.borderRadius,
                          }}
                        >
                          כפתור דגש
                        </button>
                      </div>
                    </div>

                    {/* Sample Cards */}
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">
                        כרטיסים לדוגמה:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          className="p-6 border transition-all duration-300"
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            borderRadius: settings.spacing.borderRadius,
                          }}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <IoHeartOutline
                              className="w-6 h-6"
                              style={{ color: colors.accent }}
                            />
                            <h3
                              className="font-bold"
                              style={{ color: colors.text }}
                            >
                              כותרת כרטיס
                            </h3>
                          </div>
                          <p style={{ color: colors.textSecondary }}>
                            זהו טקסט לדוגמה בכרטיס. הטקסט מציג את הצבעים
                            והגופנים שנבחרו.
                          </p>
                        </div>
                        <div
                          className="p-6 border transition-all duration-300"
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            borderRadius: settings.spacing.borderRadius,
                          }}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <IoStarOutline
                              className="w-6 h-6"
                              style={{ color: colors.primary }}
                            />
                            <h3
                              className="font-bold"
                              style={{ color: colors.text }}
                            >
                              כרטיס נוסף
                            </h3>
                          </div>
                          <p style={{ color: colors.textSecondary }}>
                            עוד דוגמה לתצוגה מקדימה של העיצוב החדש.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">הגדרות יוצאו בהצלחה!</h3>
            <p className="text-gray-600 mb-4">
              ההגדרות הועתקו ללוח העתקות שלך.
            </p>
            <button
              onClick={() => setShowExportModal(false)}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300"
            >
              סגור
            </button>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">יבא הגדרות</h3>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="הדבק כאן את הגדרות ה-JSON..."
              className="w-full h-32 p-3 border border-gray-300 rounded-xl resize-none focus:border-gray-500 focus:outline-none mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleImport}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300"
              >
                יבא
              </button>
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
