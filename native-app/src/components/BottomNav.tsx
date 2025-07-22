import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors, useThemeSettings } from "../contexts/ThemeContext";
import { getBottomNavItems } from "../utils/userPermissions";
import { useUserType } from "../contexts/UserContext";

const { width } = Dimensions.get("window");

interface BottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export default function BottomNav({
  currentRoute,
  onNavigate,
}: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const themeSettings = useThemeSettings();
  const userType = useUserType();

  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedValue] = useState(new Animated.Value(0));

  // קבלת פריטי הניווט לפי סוג המשתמש
  const navItems = getBottomNavItems(userType);

  // עדכון אינדקס פעיל על בסיס הנתיב הנוכחי
  useEffect(() => {
    const currentIndex = navItems.findIndex(
      (item) => item.path === currentRoute
    );
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);

      // אנימציה של האינדיקטור הפעיל
      Animated.spring(animatedValue, {
        toValue: currentIndex,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [currentRoute, navItems]);

  const isActive = (path: string) => currentRoute === path;

  const handleNavClick = (path: string, index: number) => {
    if (isActive(path)) {
      // אפקט ויזואלי מיוחד אם הדף כבר פעיל
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: index + 0.2,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: index,
          duration: 100,
          useNativeDriver: false,
        }),
      ]).start();
      return;
    }

    setActiveIndex(index);
    onNavigate(path);
  };

  const indicatorWidth = width / (navItems.length + 1); // +1 עבור כפתור התפריט

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}
    >
      {/* רקע מטושטש */}
      <View style={styles.backdrop} />

      {/* מכל הניווט הראשי */}
      <View style={styles.navContainer}>
        {/* שכבות צל */}
        <View style={styles.shadowLayer1} />
        <View style={styles.shadowLayer2} />

        {/* רקע דינמי */}
        <LinearGradient
          colors={[colors.surface + "f0", colors.background + "cc"]}
          style={styles.backgroundGradient}
        />

        {/* אינדיקטור פעיל דינמי */}
        <Animated.View
          style={[
            styles.activeIndicator,
            {
              width: indicatorWidth - 8,
              transform: [
                {
                  translateX: animatedValue.interpolate({
                    inputRange: [0, navItems.length],
                    outputRange: [4, navItems.length * indicatorWidth + 4],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            style={styles.activeIndicatorGradient}
          />
        </Animated.View>

        {/* תוכן הניווט */}
        <View style={styles.navContent}>
          {navItems.map((item, index) => {
            const active = isActive(item.path);
            const iconName = active ? item.activeIcon : item.icon;

            return (
              <TouchableOpacity
                key={item.path}
                onPress={() => handleNavClick(item.path, index)}
                style={[styles.navButton, active && styles.navButtonActive]}
                activeOpacity={0.7}
              >
                {/* אפקט זוהר עבור מצב פעיל */}
                {active && <View style={styles.glowEffect} />}

                {/* מכל האייקון */}
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={iconName as any}
                    size={24}
                    color={active ? colors.background : colors.text}
                    style={[styles.icon, active && styles.iconActive]}
                  />

                  {/* תג עבור פריטים עם badge */}
                  {item.badge && (
                    <View style={styles.badgeContainer}>
                      <LinearGradient
                        colors={["#EF4444", "#EC4899"]}
                        style={styles.badge}
                      >
                        <Text style={styles.badgeText}>
                          {item.badge > 9 ? "9+" : item.badge}
                        </Text>
                      </LinearGradient>
                    </View>
                  )}
                </View>

                {/* תווית */}
                <Text
                  style={[
                    styles.label,
                    {
                      color: active ? colors.background : colors.textSecondary,
                    },
                    active && styles.labelActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* כפתור תפריט */}
          <TouchableOpacity
            onPress={() => onNavigate("/menu")}
            style={styles.navButton}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="menu-outline"
                size={24}
                color={colors.text}
                style={styles.icon}
              />

              {/* נקודות אינדיקטור */}
              <View style={styles.menuIndicators}>
                <View
                  style={[styles.menuDot, { backgroundColor: "#3B82F6" }]}
                />
                <View
                  style={[styles.menuDot, { backgroundColor: "#10B981" }]}
                />
                <View
                  style={[styles.menuDot, { backgroundColor: "#F59E0B" }]}
                />
              </View>
            </View>

            <Text style={[styles.label, { color: colors.textSecondary }]}>
              תפריט
            </Text>
          </TouchableOpacity>
        </View>

        {/* קו מבטא תחתון */}
        <View style={styles.accentLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 99999,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  navContainer: {
    marginHorizontal: 12,
    marginBottom: 24,
    borderRadius: 24,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  shadowLayer1: {
    position: "absolute",
    top: -16,
    left: -16,
    right: -16,
    bottom: -16,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 32,
    opacity: 0.6,
  },
  shadowLayer2: {
    position: "absolute",
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 28,
    opacity: 0.8,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
  },
  activeIndicator: {
    position: "absolute",
    top: 12,
    left: 0,
    right: 0,
    bottom: 12,
    borderRadius: 20,
    overflow: "hidden",
  },
  activeIndicatorGradient: {
    flex: 1,
    borderRadius: 20,
  },
  navContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  navButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 20,
    minHeight: 60,
  },
  navButtonActive: {
    transform: [{ scale: 1.1 }, { translateY: -4 }],
  },
  glowEffect: {
    position: "absolute",
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 24,
    opacity: 0.6,
  },
  iconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginBottom: 4,
  },
  iconActive: {
    transform: [{ scale: 1.1 }],
  },
  badgeContainer: {
    position: "absolute",
    top: -12,
    right: -12,
    zIndex: 1,
  },
  badge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  labelActive: {
    transform: [{ scale: 1.05 }],
  },
  menuIndicators: {
    position: "absolute",
    top: -4,
    right: -4,
    flexDirection: "row",
    gap: 2,
  },
  menuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  accentLine: {
    position: "absolute",
    bottom: 0,
    left: 24,
    right: 24,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 1,
  },
});
