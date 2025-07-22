import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Animated,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors, useTheme } from "../contexts/ThemeContext";
import { useUser, useUserType } from "../contexts/UserContext";
import { getSideMenuItems, getUserTypeInfo } from "../utils/userPermissions";

const { width } = Dimensions.get("window");

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string, params?: any) => void;
}

export default function SideNav({ isOpen, onClose, onNavigate }: SideNavProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { settings, updateTheme } = useTheme();
  const { userType, setUserType, toggleSecondhandStore } = useUser();

  const [slideAnim] = useState(new Animated.Value(-width));
  const [overlayAnim] = useState(new Animated.Value(0));

  const menuItems = getSideMenuItems(userType);
  const userInfo = getUserTypeInfo(userType);

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  const handleMenuItemPress = (path: string) => {
    onNavigate(path);
    onClose();
  };

  const UserTypeSelector = () => (
    <View
      style={[styles.userTypeSelector, { backgroundColor: colors.surface }]}
    >
      <Text style={[styles.selectorTitle, { color: colors.text }]}>
        סוג המשתמש
      </Text>

      <View style={styles.userTypeOptions}>
        {(["customer", "store", "secondhand"] as const).map((type) => {
          const typeInfo = getUserTypeInfo(type);
          return (
            <TouchableOpacity
              key={type}
              style={[
                styles.userTypeOption,
                {
                  backgroundColor:
                    userType === type ? colors.primary : colors.background,
                },
              ]}
              onPress={() => setUserType(type)}
            >
              <Text
                style={[
                  styles.userTypeOptionText,
                  {
                    color: userType === type ? colors.background : colors.text,
                  },
                ]}
              >
                {typeInfo.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {userType === "customer" && (
        <TouchableOpacity
          style={[
            styles.secondhandToggle,
            { backgroundColor: colors.background },
          ]}
          onPress={toggleSecondhandStore}
        >
          <View style={styles.secondhandToggleContent}>
            <View>
              <Text
                style={[styles.secondhandToggleTitle, { color: colors.text }]}
              >
                הפעל חנות יד שנייה
              </Text>
              <Text
                style={[
                  styles.secondhandToggleDesc,
                  { color: colors.textSecondary },
                ]}
              >
                מכור פריטים משלך
              </Text>
            </View>
            <Ionicons name="toggle" size={32} color={colors.primary} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );

  const ThemeSelector = () => (
    <View style={[styles.themeSelector, { backgroundColor: colors.surface }]}>
      <Text style={[styles.selectorTitle, { color: colors.text }]}>
        בחר תמה
      </Text>

      <View style={styles.themeOptions}>
        {Object.entries({
          minimal: { name: "מינימליסטי", color: "#000000" },
          colorful: { name: "צבעוני", color: "#7C3AED" },
          dark: { name: "כהה", color: "#111827" },
          luxury: { name: "יוקרתי", color: "#B8860B" },
        }).map(([key, theme]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.themeOption,
              {
                backgroundColor:
                  settings.currentTheme === key
                    ? theme.color
                    : colors.background,
              },
            ]}
            onPress={() => {
              // @ts-ignore
              updateTheme(key);
            }}
          >
            <View
              style={[styles.themePreview, { backgroundColor: theme.color }]}
            />
            <Text
              style={[
                styles.themeOptionText,
                {
                  color: settings.currentTheme === key ? "white" : colors.text,
                },
              ]}
            >
              {theme.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Side Menu */}
      <Animated.View
        style={[
          styles.sideMenu,
          {
            backgroundColor: colors.background,
            transform: [{ translateX: slideAnim }],
            paddingTop: insets.top + 20,
          },
        ]}
      >
        <ScrollView
          style={styles.menuContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header */}
          <View style={styles.menuHeader}>
            <View style={styles.headerContent}>
              <View style={styles.userAvatar}>
                <LinearGradient
                  colors={[colors.primary, colors.accent]}
                  style={styles.avatarGradient}
                >
                  <Ionicons name="person" size={32} color="white" />
                </LinearGradient>
              </View>

              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: colors.text }]}>
                  משתמש GetClose
                </Text>
                <View
                  style={[
                    styles.userBadge,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <Text
                    style={[styles.userBadgeText, { color: colors.primary }]}
                  >
                    {userInfo.label}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* User Stats */}
          <View style={[styles.userStats, { backgroundColor: colors.surface }]}>
            <LinearGradient
              colors={[colors.primary + "20", colors.accent + "10"]}
              style={styles.statsBackground}
            >
              <View style={styles.statsRow}>
                {Object.entries(userInfo.stats).map(([key, value], index) => (
                  <View key={key} style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.text }]}>
                      {value}
                    </Text>
                    <Text
                      style={[
                        styles.statLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {key === "orders"
                        ? "הזמנות"
                        : key === "products"
                        ? "מוצרים"
                        : key === "revenue"
                        ? "הכנסות"
                        : key === "favorites"
                        ? "מועדפים"
                        : key === "sold"
                        ? "נמכר"
                        : key === "listed"
                        ? "רשום"
                        : key === "earned"
                        ? "הרווח"
                        : key === "saved"
                        ? "חסכון"
                        : key === "visits"
                        ? "ביקורים"
                        : key === "items"
                        ? "פריטים"
                        : key === "time"
                        ? "זמן"
                        : key}
                    </Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              תפריט ראשי
            </Text>

            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.path}
                style={[styles.menuItem, { backgroundColor: colors.surface }]}
                onPress={() => handleMenuItemPress(item.path)}
              >
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemLeft}>
                    <View
                      style={[
                        styles.menuItemIcon,
                        { backgroundColor: colors.primary + "20" },
                      ]}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={colors.primary}
                      />
                    </View>

                    <View style={styles.menuItemText}>
                      <View style={styles.menuItemTitle}>
                        <Text
                          style={[styles.menuItemLabel, { color: colors.text }]}
                        >
                          {item.label}
                        </Text>
                        {item.badge && (
                          <View
                            style={[
                              styles.menuItemBadge,
                              { backgroundColor: colors.accent },
                            ]}
                          >
                            <Text style={styles.menuItemBadgeText}>
                              {item.badge}
                            </Text>
                          </View>
                        )}
                        {item.isNew && (
                          <View
                            style={[
                              styles.newBadge,
                              { backgroundColor: "#10B981" },
                            ]}
                          >
                            <Text style={styles.newBadgeText}>חדש</Text>
                          </View>
                        )}
                      </View>
                      {item.description && (
                        <Text
                          style={[
                            styles.menuItemDescription,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {item.description}
                        </Text>
                      )}
                    </View>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.textSecondary}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* User Type Selector */}
          <UserTypeSelector />

          {/* Theme Selector */}
          <ThemeSelector />

          {/* Quick Actions */}
          <View style={styles.menuSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              פעולות מהירות
            </Text>

            <View style={styles.quickActions}>
              <TouchableOpacity
                style={[
                  styles.quickAction,
                  { backgroundColor: colors.surface },
                ]}
                onPress={() => {}}
              >
                <Ionicons name="moon" size={20} color={colors.primary} />
                <Text style={[styles.quickActionText, { color: colors.text }]}>
                  מצב לילה
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.quickAction,
                  { backgroundColor: colors.surface },
                ]}
                onPress={() => {}}
              >
                <Ionicons name="language" size={20} color={colors.primary} />
                <Text style={[styles.quickActionText, { color: colors.text }]}>
                  שפה
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.quickAction,
                  { backgroundColor: colors.surface },
                ]}
                onPress={() => {}}
              >
                <Ionicons name="help-circle" size={20} color={colors.primary} />
                <Text style={[styles.quickActionText, { color: colors.text }]}>
                  עזרה
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.menuFooter}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              GetClose v1.0.0
            </Text>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              חנות האופנה של העתיד
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  overlayTouchable: {
    flex: 1,
  },
  sideMenu: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.85,
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userAvatar: {
    marginRight: 15,
  },
  avatarGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  closeButton: {
    padding: 5,
  },
  userStats: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  statsBackground: {
    padding: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  menuSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  menuItem: {
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  menuItemBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  menuItemBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  newBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  menuItemDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  userTypeSelector: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  userTypeOptions: {
    gap: 8,
  },
  userTypeOption: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  userTypeOptionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  secondhandToggle: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  secondhandToggleContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  secondhandToggleTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  secondhandToggleDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  themeSelector: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
  },
  themeOptions: {
    gap: 8,
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  themePreview: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  themeOptionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  quickActions: {
    flexDirection: "row",
    marginHorizontal: 20,
    gap: 8,
  },
  quickAction: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    gap: 4,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  menuFooter: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
  },
});
