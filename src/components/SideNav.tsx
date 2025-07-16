"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  IoLogOutOutline,
  IoCloseOutline,
  IoStarOutline,
  IoTrophyOutline,
  IoWalletOutline,
} from "react-icons/io5";
import {
  getSideMenuItems,
  getUserTypeInfo,
  UserType,
} from "../utils/userPermissions";
import { useUser } from "../contexts/UserContext";

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideNav({ isOpen, onClose }: SideNavProps) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // שימוש ב-UserContext
  const { userType, setUserType } = useUser();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
    // במובייל - סוגר את התפריט, בדסקטופ - לא
    if (isClient && window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleLogout = () => {
    if (confirm("האם אתה בטוח שברצונך להתנתק?")) {
      localStorage.removeItem("userType");
      localStorage.removeItem("hasSecondhandStore");
      setUserType(""); // עדכון ה-context
      router.push("/user-type");
      if (isClient && window.innerWidth < 1024) {
        onClose();
      }
    }
  };

  // קבלת מידע המשתמש ורשימת התפריט הדינמית
  const userInfo = getUserTypeInfo(userType);
  const menuItems = getSideMenuItems(userType);

  // מונע הבדלים בין server ו-client
  if (!isClient) {
    return null;
  }

  // במובייל - תפריט overlay, בדסקטופ - תפריט קבוע
  const isDesktop = window.innerWidth >= 1024;
  const showOverlay = !isDesktop && isOpen;
  const showSidebar = isDesktop || isOpen;

  if (!showSidebar) return null;

  return (
    <>
      {/* Overlay רק במובייל */}
      {showOverlay && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9990] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Side Navigation */}
      <div
        className={`
        fixed top-0 right-0 h-full w-72 bg-white/98 backdrop-blur-xl border-l border-gray-200/80 z-[9995] shadow-2xl
        transform transition-all duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto lg:shadow-none lg:border-gray-200
        ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Elegant Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 to-white/50" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black via-gray-600 to-black" />

        <div className="relative h-full flex flex-col">
          {/* Close Button - רק במובייל */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:text-black transition-all duration-200 lg:hidden z-10"
          >
            <IoCloseOutline className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="p-6 pt-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-black mb-1">GetClose</h2>
              <p className="text-sm text-gray-600">חנות האופנה שלך</p>
            </div>

            {/* User Info Card */}
            <div
              className={`p-5 rounded-2xl bg-gradient-to-r ${userInfo.color} ${userInfo.textColor} mb-6 shadow-lg relative overflow-hidden`}
            >
              {/* Elegant pattern overlay */}
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12" />

              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-2 ring-white/30">
                    <IoStarOutline className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">ישראל שמואלי</h3>
                    <p className="text-white/80 text-sm">{userInfo.label}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(userInfo.stats).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-lg font-bold">{value}</div>
                      <div className="text-xs text-white/70 capitalize">
                        {key}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-6">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl text-right hover:bg-gray-100 transition-all duration-200 group relative overflow-hidden"
                >
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-black/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right rounded-xl" />

                  <item.icon className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors relative z-10" />

                  <div className="flex-1 text-right relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-medium">
                            {item.badge}
                          </span>
                        )}
                        {item.isNew && (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
                            חדש
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-gray-800 group-hover:text-black transition-colors">
                        {item.label}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Elegant hover indicator */}
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-black rounded-l-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                </button>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-4 rounded-xl text-right hover:bg-red-50 transition-all duration-200 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-red-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right rounded-xl" />

              <IoLogOutOutline className="w-5 h-5 text-red-600 relative z-10" />
              <span className="font-medium text-red-600 relative z-10">
                התנתקות
              </span>
            </button>

            {/* Branding */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                עוצב עם ❤️ עבור חובבי האופנה
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
