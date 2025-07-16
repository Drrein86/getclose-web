"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    // פנייה ישירה לדף בחירת סוג המשתמש
    router.replace("/user-type");
  }, [router]);

  // מציג טעינה בזמן הפנייה
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">טוען...</p>
      </div>
    </div>
  );
}
