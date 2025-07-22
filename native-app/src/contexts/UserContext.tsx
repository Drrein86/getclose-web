import React, { createContext, useContext, useState, useEffect } from "react";
import { UserType } from "../types";
import {
  getUserType as getStorageUserType,
  setSecondhandStoreStatus,
} from "../utils/userPermissions";

interface UserContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  toggleSecondhandStore: () => void;
  refreshUserType: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userType, setUserTypeState] = useState<UserType>("");

  // טעינה ראשונית של סוג המשתמש
  useEffect(() => {
    const loadUserType = async () => {
      const currentUserType = await getStorageUserType();
      setUserTypeState(currentUserType);
    };
    loadUserType();
  }, []);

  // פונקציה לעדכון סוג המשתמש
  const setUserType = async (type: UserType) => {
    try {
      const { default: AsyncStorage } = await import(
        "@react-native-async-storage/async-storage"
      );
      await AsyncStorage.setItem("userType", type);
      setUserTypeState(type);
    } catch (error) {
      console.error("Error setting user type:", error);
    }
  };

  // פונקציה להפעלה/כיבוי חנות יד שנייה
  const toggleSecondhandStore = async () => {
    try {
      const { default: AsyncStorage } = await import(
        "@react-native-async-storage/async-storage"
      );
      const currentStatus =
        (await AsyncStorage.getItem("hasSecondhandStore")) === "true";
      const newStatus = !currentStatus;
      await setSecondhandStoreStatus(newStatus);

      // עדכון מיידי של סוג המשתמש
      const currentUserType = await getStorageUserType();
      setUserTypeState(currentUserType);
    } catch (error) {
      console.error("Error toggling secondhand store:", error);
    }
  };

  // פונקציה לרענון סוג המשתמש (לשימוש חיצוני)
  const refreshUserType = async () => {
    const currentUserType = await getStorageUserType();
    setUserTypeState(currentUserType);
  };

  return (
    <UserContext.Provider
      value={{
        userType,
        setUserType,
        toggleSecondhandStore,
        refreshUserType,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook לשימוש ב-context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Hook נוח לקבלת סוג המשתמש בלבד
export const useUserType = () => {
  const { userType } = useUser();
  return userType;
};
