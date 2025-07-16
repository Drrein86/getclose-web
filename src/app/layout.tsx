import './globals.css';
import { Assistant } from 'next/font/google';
import BottomNav from '@/components/BottomNav';
import SideNav from '@/components/SideNav';

const assistant = Assistant({ subsets: ['hebrew'] });

export const metadata = {
  title: 'GetClose - משלוחים חכמים',
  description: 'פלטפורמת משלוחים חכמה המחברת בין עסקים ללקוחות',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={assistant.className}>
        <div className="flex">
          <SideNav />
          <main className="flex-1 md:mr-64 min-h-screen pb-20 md:pb-0">
            {children}
          </main>
        </div>
        <BottomNav />
      </body>
    </html>
  );
} 