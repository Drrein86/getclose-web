"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MyStorePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">החנות שלי</h1>
          <p className="text-gray-600">דף ניהול החנות - בפיתוח</p>

          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            חזרה
          </button>
        </div>
      </div>
    </div>
  );
}
