import React, { useState, useEffect } from "react";
import { StyleSheet, View, StatusBar, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Font from "expo-font";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { UserProvider } from "./src/contexts/UserContext";
import { DataProvider } from "./src/contexts/DataContext";
import HomeScreen from "./src/screens/HomeScreen";
import SearchScreen from "./src/screens/SearchScreen";
import ProductScreen from "./src/screens/ProductScreen";
import CartScreen from "./src/screens/CartScreen";
import StoresScreen from "./src/screens/StoresScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import MyStoreScreen from "./src/screens/MyStoreScreen";
import AdminScreen from "./src/screens/AdminScreen";
import BottomNav from "./src/components/BottomNav";
import SideNav from "./src/components/SideNav";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentRoute, setCurrentRoute] = useState("/home");
  const [sideNavOpen, setSideNavOpen] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          // טעינת פונטים מותאמים (אופציונלי)
        });
      } catch (error) {
        console.warn("Error loading fonts:", error);
      } finally {
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  const handleNavigation = (route: string, params?: any) => {
    console.log(`Navigating to: ${route}`, params);
    if (route === "/menu") {
      setSideNavOpen(true);
    } else {
      setCurrentRoute(route);
    }
    // כאן אפשר להוסיף לוגיקת ניווט מתקדמת יותר
  };

  const renderCurrentScreen = () => {
    switch (currentRoute) {
      case "/home":
        return <HomeScreen onNavigate={handleNavigation} />;
      case "/search":
        return <SearchScreen onNavigate={handleNavigation} />;
      case "/stores":
        return <StoresScreen onNavigate={handleNavigation} />;
      case "/my-store":
        return <MyStoreScreen onNavigate={handleNavigation} />;
      case "/admin":
        return <AdminScreen onNavigate={handleNavigation} />;
      case "/favorites":
        return <FavoritesScreen onNavigate={handleNavigation} />;
      case "/cart":
        return <CartScreen onNavigate={handleNavigation} />;
      case "/menu":
        return (
          <View style={styles.placeholderScreen}>
            <Text style={styles.placeholderText}>תפריט צד - בפיתוח</Text>
          </View>
        );
      case "/product":
        return <ProductScreen onNavigate={handleNavigation} />;
      default:
        return <HomeScreen onNavigate={handleNavigation} />;
    }
  };

  if (!fontsLoaded) {
    // מסך טעינה פשוט
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>טוען...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <DataProvider>
        <UserProvider>
          <ThemeProvider>
            <View style={styles.container}>
              <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

              {/* תוכן הראשי */}
              <View style={styles.content}>{renderCurrentScreen()}</View>

              {/* ניווט תחתון */}
              <BottomNav
                currentRoute={currentRoute}
                onNavigate={handleNavigation}
              />

              {/* תפריט צדדי */}
              <SideNav
                isOpen={sideNavOpen}
                onClose={() => setSideNavOpen(false)}
                onNavigate={handleNavigation}
              />
            </View>
          </ThemeProvider>
        </UserProvider>
      </DataProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    fontSize: 18,
    color: "#333333",
  },
  placeholderScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  placeholderText: {
    fontSize: 20,
    color: "#666666",
    textAlign: "center",
  },
});
