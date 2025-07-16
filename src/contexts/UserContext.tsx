"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserType,
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
    const currentUserType = getStorageUserType();
    setUserTypeState(currentUserType);
  }, []);

  // פונקציה לעדכון סוג המשתמש
  const setUserType = (type: UserType) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userType", type);
      setUserTypeState(type);
    }
  };

  // פונקציה להפעלה/כיבוי חנות יד שנייה
  const toggleSecondhandStore = () => {
    if (typeof window !== "undefined") {
      const currentStatus =
        localStorage.getItem("hasSecondhandStore") === "true";
      const newStatus = !currentStatus;
      setSecondhandStoreStatus(newStatus);

      // עדכון מיידי של סוג המשתמש
      const currentUserType = getStorageUserType();
      setUserTypeState(currentUserType);
    }
  };

  // פונקציה לרענון סוג המשתמש (לשימוש חיצוני)
  const refreshUserType = () => {
    const currentUserType = getStorageUserType();
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
