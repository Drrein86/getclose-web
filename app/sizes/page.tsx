'use client';

import { useState } from 'react';
import { Ruler } from 'lucide-react';

type SizeCategory = 'clothes' | 'shoes';
type SizeSystem = 'eu' | 'us';

export default function SizesPage() {
  const [category, setCategory] = useState<SizeCategory>('clothes');
  const [system, setSystem] = useState<SizeSystem>('eu');

  const clothesSizes = {
    eu: [
      { size: 'XS', chest: '86-90', waist: '70-74', hips: '94-98' },
      { size: 'S', chest: '90-94', waist: '74-78', hips: '98-102' },
      { size: 'M', chest: '94-98', waist: '78-82', hips: '102-106' },
      { size: 'L', chest: '98-102', waist: '82-86', hips: '106-110' },
      { size: 'XL', chest: '102-106', waist: '86-90', hips: '110-114' },
      { size: 'XXL', chest: '106-110', waist: '90-94', hips: '114-118' }
    ],
    us: [
      { size: '2', chest: '86-90', waist: '70-74', hips: '94-98' },
      { size: '4', chest: '90-94', waist: '74-78', hips: '98-102' },
      { size: '6', chest: '94-98', waist: '78-82', hips: '102-106' },
      { size: '8', chest: '98-102', waist: '82-86', hips: '106-110' },
      { size: '10', chest: '102-106', waist: '86-90', hips: '110-114' },
      { size: '12', chest: '106-110', waist: '90-94', hips: '114-118' }
    ]
  };

  const shoesSizes = {
    eu: [
      { eu: '35', foot: '22.5' },
      { eu: '36', foot: '23' },
      { eu: '37', foot: '23.5' },
      { eu: '38', foot: '24' },
      { eu: '39', foot: '24.5' },
      { eu: '40', foot: '25' },
      { eu: '41', foot: '25.5' },
      { eu: '42', foot: '26' },
      { eu: '43', foot: '26.5' },
      { eu: '44', foot: '27' },
      { eu: '45', foot: '27.5' }
    ],
    us: [
      { us: '4', foot: '22.5' },
      { us: '4.5', foot: '23' },
      { us: '5', foot: '23.5' },
      { us: '5.5', foot: '24' },
      { us: '6', foot: '24.5' },
      { us: '6.5', foot: '25' },
      { us: '7', foot: '25.5' },
      { us: '7.5', foot: '26' },
      { us: '8', foot: '26.5' },
      { us: '8.5', foot: '27' },
      { us: '9', foot: '27.5' }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <Ruler className="w-8 h-8 ml-3 text-primary-600" />
        <h1 className="text-3xl font-bold">טבלת מידות</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        {/* בחירת קטגוריה */}
        <div className="flex space-x-4 space-x-reverse mb-6">
          <button
            onClick={() => setCategory('clothes')}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-colors ${
              category === 'clothes'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            בגדים
          </button>
          <button
            onClick={() => setCategory('shoes')}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-colors ${
              category === 'shoes'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            נעליים
          </button>
        </div>

        {/* בחירת מערכת מידות */}
        <div className="flex space-x-4 space-x-reverse mb-8">
          <button
            onClick={() => setSystem('eu')}
            className={`flex-1 py-2 px-4 rounded-xl border font-medium transition-colors ${
              system === 'eu'
                ? 'border-primary-600 bg-primary-50 text-primary-600'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            מידות אירופאיות (EU)
          </button>
          <button
            onClick={() => setSystem('us')}
            className={`flex-1 py-2 px-4 rounded-xl border font-medium transition-colors ${
              system === 'us'
                ? 'border-primary-600 bg-primary-50 text-primary-600'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            מידות אמריקאיות (US)
          </button>
        </div>

        {/* טבלת מידות */}
        {category === 'clothes' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-4 px-6 text-right">מידה</th>
                  <th className="py-4 px-6 text-right">חזה (ס"מ)</th>
                  <th className="py-4 px-6 text-right">מותניים (ס"מ)</th>
                  <th className="py-4 px-6 text-right">ירכיים (ס"מ)</th>
                </tr>
              </thead>
              <tbody>
                {clothesSizes[system].map((item, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-4 px-6 font-medium">{item.size}</td>
                    <td className="py-4 px-6">{item.chest}</td>
                    <td className="py-4 px-6">{item.waist}</td>
                    <td className="py-4 px-6">{item.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-4 px-6 text-right">מידה {system.toUpperCase()}</th>
                  <th className="py-4 px-6 text-right">אורך כף רגל (ס"מ)</th>
                </tr>
              </thead>
              <tbody>
                {shoesSizes[system].map((item, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-4 px-6 font-medium">{system === 'eu' ? item.eu : item.us}</td>
                    <td className="py-4 px-6">{item.foot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
          <p className="mb-2">הערות:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>המידות בטבלה הן מידות מומלצות ועשויות להשתנות בין מותגים שונים</li>
            <li>מומלץ למדוד את עצמך או להתייעץ עם המוכרים בחנות לגבי התאמת המידה</li>
            <li>בבגדים, המידות נמדדות בסנטימטרים מסביב להיקף הגוף</li>
            <li>באורך כף הרגל, המידה נמדדת מקצה הבוהן עד לקצה העקב</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 