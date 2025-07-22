import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ThemeColors, ThemeGradients, ThemeSettings } from "../types";

// תבניות צבעים מוכנות
export const PRESET_THEMES = {
  minimal: {
    name: "מינימליסטי",
    colors: {
      primary: "#000000",
      secondary: "#6B7280",
      accent: "#374151",
      background: "#FFFFFF",
      surface: "#F9FAFB",
      text: "#1F2937",
      textSecondary: "#6B7280",
      border: "#E5E7EB",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
    gradients: {
      primary: "from-gray-900 to-black",
      secondary: "from-gray-600 to-gray-800",
      accent: "from-gray-100 to-gray-200",
      hero: "from-gray-50 to-white",
    },
  },
  colorful: {
    name: "צבעוני",
    colors: {
      primary: "#7C3AED",
      secondary: "#EC4899",
      accent: "#10B981",
      background: "#FFFFFF",
      surface: "#F8FAFC",
      text: "#1E293B",
      textSecondary: "#64748B",
      border: "#E2E8F0",
      success: "#059669",
      warning: "#D97706",
      error: "#DC2626",
      info: "#0284C7",
    },
    gradients: {
      primary: "from-purple-600 to-purple-800",
      secondary: "from-pink-500 to-rose-600",
      accent: "from-emerald-500 to-teal-600",
      hero: "from-purple-50 to-pink-50",
    },
  },
  dark: {
    name: "כהה",
    colors: {
      primary: "#FFFFFF",
      secondary: "#9CA3AF",
      accent: "#60A5FA",
      background: "#111827",
      surface: "#1F2937",
      text: "#F9FAFB",
      textSecondary: "#D1D5DB",
      border: "#374151",
      success: "#34D399",
      warning: "#FBBF24",
      error: "#F87171",
      info: "#60A5FA",
    },
    gradients: {
      primary: "from-white to-gray-100",
      secondary: "from-gray-400 to-gray-600",
      accent: "from-blue-400 to-blue-600",
      hero: "from-gray-900 to-black",
    },
  },
  luxury: {
    name: "יוקרתי",
    colors: {
      primary: "#B8860B",
      secondary: "#8B4513",
      accent: "#CD853F",
      background: "#FDF6E3",
      surface: "#FAF0E6",
      text: "#2F1B14",
      textSecondary: "#8B4513",
      border: "#DEB887",
      success: "#228B22",
      warning: "#FF8C00",
      error: "#DC143C",
      info: "#4682B4",
    },
    gradients: {
      primary: "from-yellow-600 to-yellow-800",
      secondary: "from-amber-600 to-orange-800",
      accent: "from-orange-400 to-amber-600",
      hero: "from-amber-50 to-orange-50",
    },
  },
};

// ממשק ה-Context
interface ThemeContextType {
  settings: ThemeSettings;
  updateTheme: (theme: keyof typeof PRESET_THEMES) => void;
  updateCustomColors: (colors: Partial<ThemeColors>) => void;
  updateCustomGradients: (gradients: Partial<ThemeGradients>) => void;
  updateTypography: (typography: Partial<ThemeSettings["typography"]>) => void;
  updateSpacing: (spacing: Partial<ThemeSettings["spacing"]>) => void;
  updateAnimations: (animations: Partial<ThemeSettings["animations"]>) => void;
  updateEffects: (effects: Partial<ThemeSettings["effects"]>) => void;
  resetToDefault: () => void;
  exportSettings: () => string;
  importSettings: (settingsJson: string) => void;
  getCurrentColors: () => ThemeColors;
  getCurrentGradients: () => ThemeGradients;
}

// יצירת ה-Context
const ThemeContext = createContext<ThemeContextType | null>(null);

// הגדרות ברירת מחדל
const DEFAULT_SETTINGS: ThemeSettings = {
  currentTheme: "minimal",
  customColors: PRESET_THEMES.minimal.colors,
  customGradients: PRESET_THEMES.minimal.gradients,
  typography: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: "16",
    fontWeight: "400",
  },
  spacing: {
    borderRadius: "8",
    padding: "16",
    margin: "16",
  },
  animations: {
    enabled: true,
    duration: "300",
    easing: "ease-in-out",
  },
  effects: {
    glassmorphism: true,
    shadows: true,
    gradients: true,
    animations: true,
  },
};

// Provider Component
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_SETTINGS);

  // טעינת הגדרות מ-AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { default: AsyncStorage } = await import(
          "@react-native-async-storage/async-storage"
        );
        const savedSettings = await AsyncStorage.getItem("theme-settings");
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        }
      } catch (error) {
        console.error("Error loading theme settings:", error);
      }
    };
    loadSettings();
  }, []);

  // שמירת הגדרות ל-AsyncStorage
  useEffect(() => {
    const saveSettings = async () => {
      try {
        const { default: AsyncStorage } = await import(
          "@react-native-async-storage/async-storage"
        );
        await AsyncStorage.setItem("theme-settings", JSON.stringify(settings));
      } catch (error) {
        console.error("Error saving theme settings:", error);
      }
    };
    saveSettings();
  }, [settings]);

  const updateTheme = (theme: keyof typeof PRESET_THEMES) => {
    setSettings((prev) => ({
      ...prev,
      currentTheme: theme,
      customColors: PRESET_THEMES[theme].colors,
      customGradients: PRESET_THEMES[theme].gradients,
    }));
  };

  const updateCustomColors = (colors: Partial<ThemeColors>) => {
    setSettings((prev) => ({
      ...prev,
      customColors: { ...prev.customColors, ...colors },
    }));
  };

  const updateCustomGradients = (gradients: Partial<ThemeGradients>) => {
    setSettings((prev) => ({
      ...prev,
      customGradients: { ...prev.customGradients, ...gradients },
    }));
  };

  const updateTypography = (
    typography: Partial<ThemeSettings["typography"]>
  ) => {
    setSettings((prev) => ({
      ...prev,
      typography: { ...prev.typography, ...typography },
    }));
  };

  const updateSpacing = (spacing: Partial<ThemeSettings["spacing"]>) => {
    setSettings((prev) => ({
      ...prev,
      spacing: { ...prev.spacing, ...spacing },
    }));
  };

  const updateAnimations = (
    animations: Partial<ThemeSettings["animations"]>
  ) => {
    setSettings((prev) => ({
      ...prev,
      animations: { ...prev.animations, ...animations },
    }));
  };

  const updateEffects = (effects: Partial<ThemeSettings["effects"]>) => {
    setSettings((prev) => ({
      ...prev,
      effects: { ...prev.effects, ...effects },
    }));
  };

  const resetToDefault = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const exportSettings = () => {
    return JSON.stringify(settings, null, 2);
  };

  const importSettings = (settingsJson: string) => {
    try {
      const parsed = JSON.parse(settingsJson);
      setSettings({ ...DEFAULT_SETTINGS, ...parsed });
    } catch (error) {
      console.error("Error importing settings:", error);
      throw new Error("הגדרות לא תקינות");
    }
  };

  const getCurrentColors = () => {
    return settings.currentTheme === "minimal"
      ? settings.customColors
      : PRESET_THEMES[settings.currentTheme as keyof typeof PRESET_THEMES]
          .colors;
  };

  const getCurrentGradients = () => {
    return settings.currentTheme === "minimal"
      ? settings.customGradients
      : PRESET_THEMES[settings.currentTheme as keyof typeof PRESET_THEMES]
          .gradients;
  };

  const value: ThemeContextType = {
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
    getCurrentColors,
    getCurrentGradients,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Hook לשימוש ב-Context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Helper hooks לגישה מהירה
export function useThemeColors() {
  const { getCurrentColors } = useTheme();
  return getCurrentColors();
}

export function useThemeGradients() {
  const { getCurrentGradients } = useTheme();
  return getCurrentGradients();
}

export function useThemeSettings() {
  const { settings } = useTheme();
  return settings;
}
