import "./globals.css";
import { Assistant } from "next/font/google";
import BottomNav from "@/src/components/BottomNav";
import DesktopNav from "@/src/components/DesktopNav";
import { ThemeProvider } from "@/src/contexts/ThemeContext";
import { UserProvider } from "@/src/contexts/UserContext";

const assistant = Assistant({ subsets: ["hebrew"] });

export const metadata = {
  title: "GetClose - חנות האופנה שלך",
  description: "חנות בגדים ונעליים מודרנית - שחור, לבן, אלגנטי",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={`${assistant.className} min-h-screen bg-white text-gray-900 overflow-x-hidden font-medium`}
      >
        <ThemeProvider>
          <UserProvider>
            {/* Desktop Side Navigation - מוצג רק במסכים גדולים */}
            <div className="hidden lg:block">
              <DesktopNav />
            </div>

            {/* Main Content */}
            <main className="pb-24 lg:pb-0 lg:pr-72 min-h-screen w-full bg-gradient-to-br from-gray-50 to-white">
              <div className="min-h-screen">{children}</div>
            </main>

            {/* Mobile Bottom Navigation - מוצג רק במסכים קטנים */}
            <div className="lg:hidden">
              <BottomNav />
            </div>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
