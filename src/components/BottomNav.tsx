"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  IoHomeOutline,
  IoHome,
  IoSearchOutline,
  IoSearch,
  IoStorefrontOutline,
  IoStorefront,
  IoHeartOutline,
  IoHeart,
  IoBagOutline,
  IoBag,
  IoMenuOutline,
  IoSparkles,
  IoAnalyticsOutline,
} from "react-icons/io5";
import SideNav from "./SideNav";
import { useThemeColors, useThemeSettings } from "../contexts/ThemeContext";
import { getBottomNavItems, UserType } from "../utils/userPermissions";
import { useUserType } from "../contexts/UserContext";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  // שימוש בתימה דינמית
  const colors = useThemeColors();
  const themeSettings = useThemeSettings();

  // קבלת סוג המשתמש הנוכחי מה-context
  const userType = useUserType();

  // קבלת פריטי הניווט לפי סוג המשתמש
  const navItems = getBottomNavItems(userType).map((item) => ({
    ...item,
    activeIcon: item.icon, // נשתמש באותו איקון לפעיל ולא פעיל
  }));

  // Auto-hide navbar on scroll
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  // Update active index based on pathname
  useEffect(() => {
    const currentIndex = navItems.findIndex((item) => item.path === pathname);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  const handleNavClick = (path: string, e: React.MouseEvent, index: number) => {
    e.preventDefault();

    // אם הדף כבר פעיל, נוסיף אפקט ויזואלי מיוחד
    if (isActive(path)) {
      const target = e.currentTarget as HTMLElement;
      target.classList.add("animate-pulse-special");

      // Create sparkle effect
      for (let i = 0; i < 6; i++) {
        const sparkle = document.createElement("div");
        sparkle.innerHTML = "✨";
        sparkle.className =
          "absolute text-yellow-400 pointer-events-none animate-sparkle";
        sparkle.style.left = Math.random() * 100 + "%";
        sparkle.style.top = Math.random() * 100 + "%";
        target.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 1000);
      }

      setTimeout(() => {
        target.classList.remove("animate-pulse-special");
      }, 800);
      return;
    }

    setActiveIndex(index);
    router.push(path);
  };

  return (
    <>
      {/* Mobile Side Navigation */}
      <SideNav isOpen={sideNavOpen} onClose={() => setSideNavOpen(false)} />

      {/* Bottom Navigation - Premium Design */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-[99999] lg:hidden pointer-events-auto transition-all duration-500 ease-in-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
        style={{ zIndex: 99999 }}
      >
        {/* Ambient glow background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

        {/* Main Navigation Container */}
        <div className="relative mx-3 mb-6">
          {/* Floating shadow layers */}
          <div className="absolute -inset-4 bg-gradient-to-r from-gray-900/20 via-black/30 to-gray-900/20 rounded-3xl blur-2xl opacity-60" />
          <div className="absolute -inset-2 bg-gradient-to-r from-gray-800/40 via-gray-900/50 to-gray-800/40 rounded-2xl blur-xl opacity-80" />

          {/* Dynamic background based on theme */}
          <div
            className="absolute inset-0 backdrop-blur-2xl border shadow-2xl"
            style={{
              backgroundColor: `${colors.surface}f0`, // 94% opacity
              borderColor: colors.border,
              borderRadius: themeSettings.spacing.borderRadius,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${colors.surface}e6, ${colors.background}cc)`,
              borderRadius: themeSettings.spacing.borderRadius,
            }}
          />

          {/* Dynamic inner glow */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${colors.border}80, transparent)`,
              borderRadius: themeSettings.spacing.borderRadius,
            }}
          />

          {/* Additional contrast layer */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: `${colors.background}d9`, // 85% opacity
              borderRadius: themeSettings.spacing.borderRadius,
            }}
          />

          {/* Dynamic active indicator track */}
          <div
            className="absolute top-3 left-3 right-3 bottom-3"
            style={{ borderRadius: themeSettings.spacing.borderRadius }}
          >
            <div
              className="absolute w-[calc(20%-8px)] h-full shadow-xl transition-all duration-500 ease-out"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                borderRadius: themeSettings.spacing.borderRadius,
                transform: `translateX(${activeIndex * 100}%)`,
                marginLeft: "4px",
                marginRight: "4px",
                transitionDuration: themeSettings.animations.duration,
                transitionTimingFunction: themeSettings.animations.easing,
              }}
            >
              {/* Dynamic shimmer effect */}
              {themeSettings.effects.animations && (
                <div
                  className="absolute inset-0 -skew-x-12 animate-shimmer"
                  style={{
                    background: `linear-gradient(to right, transparent, ${colors.background}33, transparent)`,
                    borderRadius: themeSettings.spacing.borderRadius,
                  }}
                />
              )}
            </div>
          </div>

          {/* Navigation Content */}
          <div className="relative flex items-center justify-between px-3 py-3 rounded-2xl">
            {navItems.map((item, index) => {
              const active = isActive(item.path);
              const IconComponent = active ? item.activeIcon : item.icon;

              return (
                <button
                  key={item.path}
                  onClick={(e) => handleNavClick(item.path, e, index)}
                  className={`relative flex flex-col items-center justify-center p-3 transition-all group min-w-0 flex-1 transform ${
                    active
                      ? "scale-110 -translate-y-1"
                      : "hover:scale-105 hover:-translate-y-0.5"
                  }`}
                  style={{
                    borderRadius: themeSettings.spacing.borderRadius,
                    transitionDuration: themeSettings.animations.duration,
                    transitionTimingFunction: themeSettings.animations.easing,
                  }}
                >
                  {/* Hover magnetic effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100/0 via-gray-200/30 to-gray-100/0 rounded-xl scale-0 group-hover:scale-110 transition-all duration-300 group-hover:rotate-1" />

                  {/* Icon container with advanced effects */}
                  <div className="relative z-10">
                    {/* Background glow for active state */}
                    {active && (
                      <div className="absolute -inset-2 bg-white/60 rounded-full blur-md animate-pulse-slow" />
                    )}

                    <div className="relative">
                      <IconComponent
                        className={`w-6 h-6 transition-all scale-110`}
                        style={{
                          color: active ? colors.background : colors.text,
                          filter: active
                            ? "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                            : "none",
                          transitionDuration: themeSettings.animations.duration,
                          transitionTimingFunction:
                            themeSettings.animations.easing,
                        }}
                      />

                      {/* Premium badge with glow */}
                      {item.badge && (
                        <div className="absolute -top-3 -right-3 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 border border-white/50 animate-pulse-custom">
                          <span className="text-white text-xs font-bold drop-shadow-sm">
                            {item.badge > 9 ? "9+" : item.badge}
                          </span>
                          {/* Badge glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full scale-150 opacity-30 animate-ping" />
                        </div>
                      )}

                      {/* Floating sparkles for active state */}
                      {active && (
                        <>
                          <IoSparkles className="absolute -top-1 -left-1 w-3 h-3 text-yellow-400 animate-bounce-slow opacity-80" />
                          <IoSparkles className="absolute -bottom-1 -right-1 w-2 h-2 text-blue-400 animate-bounce-slow delay-300 opacity-60" />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Premium label with gradient */}
                  <span
                    className="relative z-10 text-xs font-semibold mt-1 transition-all"
                    style={{
                      color: active ? colors.background : colors.textSecondary,
                      filter: active
                        ? "drop-shadow(0 1px 2px rgba(0,0,0,0.2))"
                        : "none",
                      transform: active ? "scale(1.05)" : "scale(1)",
                      transitionDuration: themeSettings.animations.duration,
                      transitionTimingFunction: themeSettings.animations.easing,
                    }}
                  >
                    {item.label}
                  </span>

                  {/* Advanced ripple effect */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200/50 via-white/30 to-gray-200/50 opacity-0 group-active:opacity-100 transition-opacity duration-200 rounded-xl scale-0 group-active:scale-100" />
                  </div>

                  {/* Micro interactions */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              );
            })}

            {/* Dynamic Menu Button */}
            <button
              onClick={() => setSideNavOpen(true)}
              className="relative flex flex-col items-center justify-center p-3 transition-all group min-w-0 flex-1 hover:scale-105 hover:-translate-y-0.5"
              style={{
                borderRadius: themeSettings.spacing.borderRadius,
                transitionDuration: themeSettings.animations.duration,
                transitionTimingFunction: themeSettings.animations.easing,
              }}
            >
              {/* Hover magnetic effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100/0 via-gray-200/30 to-gray-100/0 rounded-xl scale-0 group-hover:scale-110 transition-all duration-300 group-hover:-rotate-1" />

              {/* Icon container */}
              <div className="relative z-10">
                <IoMenuOutline
                  className="w-6 h-6 transition-all group-hover:scale-110 group-hover:rotate-90"
                  style={{
                    color: colors.text,
                    transitionDuration: themeSettings.animations.duration,
                    transitionTimingFunction: themeSettings.animations.easing,
                  }}
                />

                {/* Menu indicator dots */}
                <div className="absolute -top-1 -right-1 flex space-x-0.5">
                  <div className="w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse delay-100" />
                  <div className="w-1 h-1 bg-gradient-to-r from-green-500 to-teal-600 rounded-full animate-pulse delay-200" />
                  <div className="w-1 h-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-full animate-pulse delay-300" />
                </div>
              </div>

              {/* Label */}
              <span
                className="relative z-10 text-xs font-semibold mt-1 transition-all"
                style={{
                  color: colors.textSecondary,
                  transitionDuration: themeSettings.animations.duration,
                  transitionTimingFunction: themeSettings.animations.easing,
                }}
              >
                תפריט
              </span>

              {/* Advanced ripple effect */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200/50 via-gray-300/40 to-gray-200/50 opacity-0 group-active:opacity-100 transition-opacity duration-200 rounded-xl scale-0 group-active:scale-100" />
              </div>

              {/* Micro interactions */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent rounded-full" />
        </div>

        {/* iPhone safe area with solid background */}
        <div className="h-6 bg-gradient-to-t from-white/95 to-white/85 backdrop-blur-sm" />
      </nav>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        @keyframes pulse-special {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes pulse-custom {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        @keyframes sparkle {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1) rotate(180deg);
            opacity: 0.8;
          }
          100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-pulse-special {
          animation: pulse-special 0.8s ease-in-out;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
        .animate-pulse-custom {
          animation: pulse-custom 2s infinite;
        }
        .animate-sparkle {
          animation: sparkle 1s ease-out forwards;
        }
      `}</style>
    </>
  );
}
