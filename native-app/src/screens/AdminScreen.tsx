import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "../contexts/ThemeContext";

interface AdminScreenProps {
  onNavigate: (route: string, params?: any) => void;
}

// נתונים לדוגמה למנהל המערכת
const systemStats = {
  totalUsers: 15240,
  totalStores: 1856,
  totalProducts: 45789,
  totalOrders: 12567,
  monthlyRevenue: 2456780,
  activeUsers: 8934,
  pendingStores: 23,
  reportedItems: 8,
  systemHealth: 98.5,
};

const recentActivities = [
  {
    id: 1,
    type: "user_registration",
    description: "משתמש חדש נרשם: שרה כהן",
    timestamp: "2024-01-20 14:30",
    severity: "info",
  },
  {
    id: 2,
    type: "store_approval",
    description: "חנות חדשה ממתינה לאישור: חנות האופנה",
    timestamp: "2024-01-20 13:45",
    severity: "warning",
  },
  {
    id: 3,
    type: "report",
    description: "דווח על מוצר בעייתי: חולצה מזויפת",
    timestamp: "2024-01-20 12:15",
    severity: "error",
  },
  {
    id: 4,
    type: "payment",
    description: "תשלום גדול בוצע: ₪2,450",
    timestamp: "2024-01-20 11:20",
    severity: "success",
  },
  {
    id: 5,
    type: "system",
    description: "עדכון מערכת הושלם בהצלחה",
    timestamp: "2024-01-20 10:00",
    severity: "info",
  },
];

const pendingApprovals = [
  {
    id: "ST001",
    type: "store",
    name: "חנות האופנה החדשה",
    owner: "דוד לוי",
    category: "אופנה נשית",
    submittedDate: "2024-01-18",
    documents: 3,
  },
  {
    id: "PR001",
    type: "product",
    name: "נעלי ספורט מיוחדות",
    store: "חנות הספורט",
    category: "נעליים",
    submittedDate: "2024-01-19",
    images: 5,
  },
  {
    id: "US001",
    type: "user_report",
    description: "דיווח על מוצר מזויף",
    reporter: "מיכל אברהם",
    reportedItem: "תיק יד מעצב",
    submittedDate: "2024-01-20",
    severity: "high",
  },
];

export default function AdminScreen({ onNavigate }: AdminScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "users" | "stores" | "products" | "reports" | "settings"
  >("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"approve" | "reject" | "settings">(
    "approve"
  );
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "success":
        return "#10B981";
      case "warning":
        return "#F59E0B";
      case "error":
        return "#EF4444";
      case "info":
        return "#3B82F6";
      default:
        return colors.textSecondary;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "success":
        return "checkmark-circle";
      case "warning":
        return "warning";
      case "error":
        return "alert-circle";
      case "info":
        return "information-circle";
      default:
        return "ellipse";
    }
  };

  const AdminHeader = () => (
    <View style={[styles.adminHeader, { backgroundColor: colors.surface }]}>
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        style={styles.adminHeaderGradient}
      >
        <View style={styles.adminHeaderContent}>
          <View style={styles.adminTitleSection}>
            <Ionicons name="shield-checkmark" size={32} color="white" />
            <View style={styles.adminTitleText}>
              <Text style={styles.adminTitle}>מרכז ניהול</Text>
              <Text style={styles.adminSubtitle}>GetClose Admin Panel</Text>
            </View>
          </View>

          <View style={styles.systemHealth}>
            <Text style={styles.systemHealthLabel}>תקינות המערכת</Text>
            <Text style={styles.systemHealthValue}>
              {systemStats.systemHealth}%
            </Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStatsGrid}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>
              {systemStats.totalUsers.toLocaleString()}
            </Text>
            <Text style={styles.quickStatLabel}>משתמשים</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>
              {systemStats.totalStores.toLocaleString()}
            </Text>
            <Text style={styles.quickStatLabel}>חנויות</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>
              {systemStats.totalProducts.toLocaleString()}
            </Text>
            <Text style={styles.quickStatLabel}>מוצרים</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>
              ₪{(systemStats.monthlyRevenue / 1000).toFixed(0)}K
            </Text>
            <Text style={styles.quickStatLabel}>הכנסות חודשיות</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const TabNavigation = () => (
    <View
      style={[styles.adminTabNavigation, { backgroundColor: colors.surface }]}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { key: "dashboard", label: "לוח בקרה", icon: "speedometer" },
          { key: "users", label: "משתמשים", icon: "people" },
          { key: "stores", label: "חנויות", icon: "storefront" },
          { key: "products", label: "מוצרים", icon: "bag" },
          { key: "reports", label: "דוחות", icon: "flag" },
          { key: "settings", label: "הגדרות", icon: "settings" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.adminTab,
              activeTab === tab.key && {
                backgroundColor: colors.primary + "20",
              },
            ]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Ionicons
              name={tab.icon as any}
              size={18}
              color={
                activeTab === tab.key ? colors.primary : colors.textSecondary
              }
            />
            <Text
              style={[
                styles.adminTabText,
                {
                  color:
                    activeTab === tab.key
                      ? colors.primary
                      : colors.textSecondary,
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const DashboardTab = () => (
    <View style={styles.tabContent}>
      {/* Alert Cards */}
      <View style={styles.alertCards}>
        <View style={[styles.alertCard, { backgroundColor: "#F59E0B" }]}>
          <View style={styles.alertCardContent}>
            <Ionicons name="warning" size={24} color="white" />
            <View style={styles.alertCardText}>
              <Text style={styles.alertCardTitle}>
                {systemStats.pendingStores} חנויות ממתינות לאישור
              </Text>
              <Text style={styles.alertCardDescription}>
                דורש תשומת לב מיידית
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.alertCardAction}
            onPress={() => setActiveTab("stores")}
          >
            <Text style={styles.alertCardActionText}>בדוק עכשיו</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.alertCard, { backgroundColor: "#EF4444" }]}>
          <View style={styles.alertCardContent}>
            <Ionicons name="flag" size={24} color="white" />
            <View style={styles.alertCardText}>
              <Text style={styles.alertCardTitle}>
                {systemStats.reportedItems} דיווחים חדשים
              </Text>
              <Text style={styles.alertCardDescription}>
                פריטים שדווחו על ידי משתמשים
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.alertCardAction}
            onPress={() => setActiveTab("reports")}
          >
            <Text style={styles.alertCardActionText}>טפל בדיווחים</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* System Overview Cards */}
      <View style={styles.overviewCards}>
        <View
          style={[styles.overviewCard, { backgroundColor: colors.surface }]}
        >
          <LinearGradient
            colors={["#10B981", "#059669"]}
            style={styles.overviewCardGradient}
          >
            <View style={styles.overviewCardHeader}>
              <Ionicons name="people" size={24} color="white" />
              <Text style={styles.overviewCardValue}>
                {systemStats.activeUsers.toLocaleString()}
              </Text>
            </View>
            <Text style={styles.overviewCardLabel}>משתמשים פעילים</Text>
            <Text style={styles.overviewCardChange}>+12.5% השבוע</Text>
          </LinearGradient>
        </View>

        <View
          style={[styles.overviewCard, { backgroundColor: colors.surface }]}
        >
          <LinearGradient
            colors={["#3B82F6", "#1D4ED8"]}
            style={styles.overviewCardGradient}
          >
            <View style={styles.overviewCardHeader}>
              <Ionicons name="bag" size={24} color="white" />
              <Text style={styles.overviewCardValue}>
                {systemStats.totalOrders.toLocaleString()}
              </Text>
            </View>
            <Text style={styles.overviewCardLabel}>הזמנות החודש</Text>
            <Text style={styles.overviewCardChange}>+8.3% מהחודש שעבר</Text>
          </LinearGradient>
        </View>
      </View>

      {/* Recent Activities */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            פעילות אחרונה
          </Text>
          <TouchableOpacity>
            <Text style={[styles.sectionLink, { color: colors.primary }]}>
              צפה בכל הפעילויות
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activitiesList}>
          {recentActivities.map((activity) => (
            <View
              key={activity.id}
              style={[
                styles.activityItem,
                { backgroundColor: colors.background },
              ]}
            >
              <View
                style={[
                  styles.activityIcon,
                  {
                    backgroundColor: getSeverityColor(activity.severity) + "20",
                  },
                ]}
              >
                <Ionicons
                  name={getSeverityIcon(activity.severity) as any}
                  size={16}
                  color={getSeverityColor(activity.severity)}
                />
              </View>

              <View style={styles.activityContent}>
                <Text
                  style={[styles.activityDescription, { color: colors.text }]}
                >
                  {activity.description}
                </Text>
                <Text
                  style={[
                    styles.activityTimestamp,
                    { color: colors.textSecondary },
                  ]}
                >
                  {activity.timestamp}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Pending Approvals */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          ממתין לאישור ({pendingApprovals.length})
        </Text>

        <View style={styles.approvalsList}>
          {pendingApprovals.map((item) => (
            <View
              key={item.id}
              style={[
                styles.approvalItem,
                { backgroundColor: colors.background },
              ]}
            >
              <View style={styles.approvalContent}>
                <View style={styles.approvalHeader}>
                  <Text
                    style={[styles.approvalType, { color: colors.primary }]}
                  >
                    {item.type === "store"
                      ? "חנות חדשה"
                      : item.type === "product"
                      ? "מוצר חדש"
                      : "דיווח משתמש"}
                  </Text>
                  <Text
                    style={[
                      styles.approvalDate,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {item.submittedDate}
                  </Text>
                </View>

                <Text style={[styles.approvalName, { color: colors.text }]}>
                  {item.name || item.description}
                </Text>

                <Text
                  style={[
                    styles.approvalDetails,
                    { color: colors.textSecondary },
                  ]}
                >
                  {item.type === "store"
                    ? `בעל החנות: ${item.owner}`
                    : item.type === "product"
                    ? `חנות: ${item.store}`
                    : `מדווח: ${(item as any).reporter}`}
                </Text>
              </View>

              <View style={styles.approvalActions}>
                <TouchableOpacity
                  style={[
                    styles.approvalAction,
                    { backgroundColor: "#10B981" },
                  ]}
                  onPress={() => {
                    setSelectedItem(item);
                    setModalType("approve");
                    setShowModal(true);
                  }}
                >
                  <Ionicons name="checkmark" size={16} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.approvalAction,
                    { backgroundColor: "#EF4444" },
                  ]}
                  onPress={() => {
                    setSelectedItem(item);
                    setModalType("reject");
                    setShowModal(true);
                  }}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const UsersTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        ניהול משתמשים
      </Text>

      <View style={styles.userStats}>
        <View
          style={[styles.userStatCard, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.userStatValue, { color: colors.text }]}>
            {systemStats.totalUsers.toLocaleString()}
          </Text>
          <Text style={[styles.userStatLabel, { color: colors.textSecondary }]}>
            סך כל המשתמשים
          </Text>
        </View>

        <View
          style={[styles.userStatCard, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.userStatValue, { color: colors.text }]}>
            {systemStats.activeUsers.toLocaleString()}
          </Text>
          <Text style={[styles.userStatLabel, { color: colors.textSecondary }]}>
            פעילים השבוע
          </Text>
        </View>
      </View>

      <Text style={[styles.comingSoon, { color: colors.textSecondary }]}>
        כלי ניהול משתמשים מתקדמים בפיתוח...
      </Text>
    </View>
  );

  const StoresTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        ניהול חנויות
      </Text>

      <View style={styles.storeStats}>
        <View
          style={[styles.storeStatCard, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.storeStatValue, { color: colors.text }]}>
            {systemStats.totalStores.toLocaleString()}
          </Text>
          <Text
            style={[styles.storeStatLabel, { color: colors.textSecondary }]}
          >
            חנויות פעילות
          </Text>
        </View>

        <View
          style={[styles.storeStatCard, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.storeStatValue, { color: "#F59E0B" }]}>
            {systemStats.pendingStores}
          </Text>
          <Text
            style={[styles.storeStatLabel, { color: colors.textSecondary }]}
          >
            ממתינות לאישור
          </Text>
        </View>
      </View>

      <Text style={[styles.comingSoon, { color: colors.textSecondary }]}>
        מערכת ניהול חנויות מתקדמת בפיתוח...
      </Text>
    </View>
  );

  const SettingsTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        הגדרות מערכת
      </Text>

      <View
        style={[styles.settingsSection, { backgroundColor: colors.surface }]}
      >
        <Text style={[styles.settingsTitle, { color: colors.text }]}>
          הגדרות כלליות
        </Text>

        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>
            מצב תחזוקה
          </Text>
          <Switch value={false} onValueChange={() => {}} />
        </View>

        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>
            הודעות אוטומטיות
          </Text>
          <Switch value={true} onValueChange={() => {}} />
        </View>

        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>
            אישורים אוטומטיים
          </Text>
          <Switch value={false} onValueChange={() => {}} />
        </View>
      </View>

      <Text style={[styles.comingSoon, { color: colors.textSecondary }]}>
        הגדרות נוספות יתווספו בקרוב...
      </Text>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />;
      case "users":
        return <UsersTab />;
      case "stores":
        return <StoresTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            paddingTop: insets.top + 10,
          },
        ]}
      >
        <TouchableOpacity onPress={() => onNavigate("/home")}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          מרכז ניהול
        </Text>

        <TouchableOpacity onPress={() => Alert.alert("יציאה", "האם אתה בטוח?")}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <AdminHeader />
        <TabNavigation />
        {renderTabContent()}

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Action Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <View
            style={[styles.modalHeader, { backgroundColor: colors.surface }]}
          >
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {modalType === "approve" ? "אישור פריט" : "דחיית פריט"}
            </Text>
            <TouchableOpacity>
              <Text style={[styles.modalSave, { color: colors.primary }]}>
                שלח
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={[styles.modalDescription, { color: colors.text }]}>
              {modalType === "approve"
                ? "האם אתה בטוח שברצונך לאשר פריט זה?"
                : "האם אתה בטוח שברצונך לדחות פריט זה?"}
            </Text>

            <TextInput
              style={[
                styles.modalTextArea,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                },
              ]}
              placeholder={
                modalType === "approve"
                  ? "הערות לאישור (אופציונלי)"
                  : "סיבת הדחייה"
              }
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  adminHeader: {
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  adminHeaderGradient: {
    padding: 24,
  },
  adminHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  adminTitleSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  adminTitleText: {
    marginLeft: 12,
  },
  adminTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  adminSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  systemHealth: {
    alignItems: "center",
  },
  systemHealthLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  systemHealthValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  quickStatsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickStatItem: {
    alignItems: "center",
  },
  quickStatValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  quickStatLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  adminTabNavigation: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
  },
  adminTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
    gap: 6,
  },
  adminTabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  alertCards: {
    gap: 16,
    marginBottom: 24,
  },
  alertCard: {
    borderRadius: 16,
    padding: 20,
  },
  alertCardContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  alertCardText: {
    marginLeft: 12,
    flex: 1,
  },
  alertCardTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  alertCardDescription: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  alertCardAction: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
  },
  alertCardActionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  overviewCards: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  overviewCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  overviewCardGradient: {
    padding: 20,
  },
  overviewCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  overviewCardValue: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  overviewCardLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    marginBottom: 4,
  },
  overviewCardChange: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  activitiesList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    marginBottom: 2,
  },
  activityTimestamp: {
    fontSize: 12,
  },
  approvalsList: {
    gap: 16,
  },
  approvalItem: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
  },
  approvalContent: {
    flex: 1,
  },
  approvalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  approvalType: {
    fontSize: 12,
    fontWeight: "600",
  },
  approvalDate: {
    fontSize: 12,
  },
  approvalName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  approvalDetails: {
    fontSize: 14,
  },
  approvalActions: {
    flexDirection: "row",
    gap: 8,
  },
  approvalAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  userStats: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  userStatCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  userStatValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userStatLabel: {
    fontSize: 14,
  },
  storeStats: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  storeStatCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  storeStatValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  storeStatLabel: {
    fontSize: 14,
  },
  settingsSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  settingLabel: {
    fontSize: 16,
  },
  comingSoon: {
    textAlign: "center",
    fontSize: 16,
    fontStyle: "italic",
    marginTop: 40,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalSave: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  modalTextArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
});
