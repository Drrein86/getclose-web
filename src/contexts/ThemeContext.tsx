"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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

// הגדרות טיפוגרפיה
export const TYPOGRAPHY_SETTINGS = {
  fontFamily: {
    primary: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    secondary: "Heebo, -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "JetBrains Mono, Consolas, monospace",
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
  },
  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },
};

// הגדרות רווחים ועיגולים
export const SPACING_SETTINGS = {
  borderRadius: {
    none: "0",
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  },
};

// הגדרות אנימציות
export const ANIMATION_SETTINGS = {
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
    slower: "700ms",
  },
  easing: {
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

// ממשק להגדרות הנושא
export interface ThemeSettings {
  currentTheme: keyof typeof PRESET_THEMES;
  customColors: typeof PRESET_THEMES.minimal.colors;
  customGradients: typeof PRESET_THEMES.minimal.gradients;
  typography: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
  };
  spacing: {
    borderRadius: string;
    padding: string;
    margin: string;
  };
  animations: {
    enabled: boolean;
    duration: string;
    easing: string;
  };
  effects: {
    glassmorphism: boolean;
    shadows: boolean;
    gradients: boolean;
    animations: boolean;
  };
}

// ממשק ה-Context
interface ThemeContextType {
  settings: ThemeSettings;
  updateTheme: (theme: keyof typeof PRESET_THEMES) => void;
  updateCustomColors: (
    colors: Partial<typeof PRESET_THEMES.minimal.colors>
  ) => void;
  updateCustomGradients: (
    gradients: Partial<typeof PRESET_THEMES.minimal.gradients>
  ) => void;
  updateTypography: (typography: Partial<ThemeSettings["typography"]>) => void;
  updateSpacing: (spacing: Partial<ThemeSettings["spacing"]>) => void;
  updateAnimations: (animations: Partial<ThemeSettings["animations"]>) => void;
  updateEffects: (effects: Partial<ThemeSettings["effects"]>) => void;
  resetToDefault: () => void;
  exportSettings: () => string;
  importSettings: (settingsJson: string) => void;
  getCurrentColors: () => typeof PRESET_THEMES.minimal.colors;
  getCurrentGradients: () => typeof PRESET_THEMES.minimal.gradients;
}

// יצירת ה-Context
const ThemeContext = createContext<ThemeContextType | null>(null);

// הגדרות ברירת מחדל
const DEFAULT_SETTINGS: ThemeSettings = {
  currentTheme: "minimal",
  customColors: PRESET_THEMES.minimal.colors,
  customGradients: PRESET_THEMES.minimal.gradients,
  typography: {
    fontFamily: TYPOGRAPHY_SETTINGS.fontFamily.primary,
    fontSize: TYPOGRAPHY_SETTINGS.fontSize.base,
    fontWeight: TYPOGRAPHY_SETTINGS.fontWeight.normal,
  },
  spacing: {
    borderRadius: SPACING_SETTINGS.borderRadius.lg,
    padding: SPACING_SETTINGS.spacing.md,
    margin: SPACING_SETTINGS.spacing.md,
  },
  animations: {
    enabled: true,
    duration: ANIMATION_SETTINGS.duration.normal,
    easing: ANIMATION_SETTINGS.easing.easeInOut,
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

  // טעינת הגדרות מ-localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("theme-settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error("Error loading theme settings:", error);
      }
    }
  }, []);

  // שמירת הגדרות ל-localStorage
  useEffect(() => {
    localStorage.setItem("theme-settings", JSON.stringify(settings));
    applyThemeToDocument(settings);
  }, [settings]);

  // החלת הנושא על המסמך
  const applyThemeToDocument = (themeSettings: ThemeSettings) => {
    const root = document.documentElement;
    const colors = getCurrentColors();
    const gradients = getCurrentGradients();

    // הגדרת משתני CSS
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    Object.entries(gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${key}`, value);
    });

    // הגדרת טיפוגרפיה
    root.style.setProperty(
      "--font-family",
      themeSettings.typography.fontFamily
    );
    root.style.setProperty("--font-size", themeSettings.typography.fontSize);
    root.style.setProperty(
      "--font-weight",
      themeSettings.typography.fontWeight
    );

    // הגדרת רווחים
    root.style.setProperty(
      "--border-radius",
      themeSettings.spacing.borderRadius
    );
    root.style.setProperty("--padding", themeSettings.spacing.padding);
    root.style.setProperty("--margin", themeSettings.spacing.margin);

    // הגדרת אנימציות
    root.style.setProperty(
      "--animation-duration",
      themeSettings.animations.duration
    );
    root.style.setProperty(
      "--animation-easing",
      themeSettings.animations.easing
    );
  };

  const updateTheme = (theme: keyof typeof PRESET_THEMES) => {
    setSettings((prev) => ({
      ...prev,
      currentTheme: theme,
      customColors: PRESET_THEMES[theme].colors,
      customGradients: PRESET_THEMES[theme].gradients,
    }));
  };

  const updateCustomColors = (
    colors: Partial<typeof PRESET_THEMES.minimal.colors>
  ) => {
    setSettings((prev) => ({
      ...prev,
      customColors: { ...prev.customColors, ...colors },
    }));
  };

  const updateCustomGradients = (
    gradients: Partial<typeof PRESET_THEMES.minimal.gradients>
  ) => {
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
      : PRESET_THEMES[settings.currentTheme].colors;
  };

  const getCurrentGradients = () => {
    return settings.currentTheme === "minimal"
      ? settings.customGradients
      : PRESET_THEMES[settings.currentTheme].gradients;
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
