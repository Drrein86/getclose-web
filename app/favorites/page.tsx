'use client';

import { useState } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

type FavoriteItem = {
  id: number;
  name: string;
  price: number;
  store: string;
  image: string;
  sizes: string[];
  colors: string[];
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([
    {
      id: 1,
      name: 'חולצת טי קלאסית',
      price: 99.90,
      store: 'זארה',
      image: '/shirt.jpg',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['שחור', 'לבן', 'אפור']
    },
    {
      id: 2,
      name: 'נעלי ספורט נייקי',
      price: 399.90,
      store: 'נייקי',
      image: '/shoes.jpg',
      sizes: ['40', '41', '42', '43', '44'],
      colors: ['לבן', 'שחור']
    },
    {
      id: 3,
      name: 'מכנסי ג׳ינס',
      price: 199.90,
      store: 'קסטרו',
      image: '/jeans.jpg',
      sizes: ['28', '30', '32', '34', '36'],
      colors: ['כחול כהה', 'כחול בהיר', 'שחור']
    }
  ]);

  const removeFromFavorites = (id: number) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const addToCart = (item: FavoriteItem) => {
    // כאן תהיה הלוגיקה להוספה לעגלה
    console.log('Adding to cart:', item);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">המועדפים שלי</h1>
        <div className="flex items-center">
          <Heart className="w-6 h-6 text-primary-600 fill-current" />
          <span className="mr-2 text-lg font-medium">{favorites.length} פריטים</span>
        </div>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative pb-[100%]">
                <div className="absolute inset-0 bg-gray-200" />
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-gray-500">{item.store}</p>
                    <h3 className="font-semibold">{item.name}</h3>
                  </div>
                  <button
                    onClick={() => removeFromFavorites(item.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-primary-600 font-bold mb-4">₪{item.price.toFixed(2)}</p>

                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">מידות זמינות</p>
                    <div className="flex flex-wrap gap-2">
                      {item.sizes.map(size => (
                        <span
                          key={size}
                          className="px-2 py-1 text-sm bg-gray-100 rounded-lg"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">צבעים</p>
                    <div className="flex flex-wrap gap-2">
                      {item.colors.map(color => (
                        <span
                          key={color}
                          className="px-2 py-1 text-sm bg-gray-100 rounded-lg"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(item)}
                  className="w-full flex items-center justify-center space-x-2 space-x-reverse bg-primary-600 text-white py-2 rounded-xl hover:bg-primary-700 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>הוסף לעגלה</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">אין לך עדיין פריטים מועדפים</h2>
          <p className="text-gray-500 mb-6">שמור את הפריטים האהובים עליך לצפייה מאוחרת</p>
          <button
            onClick={() => window.location.href = '/stores'}
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            המשך לקניות
          </button>
        </div>
      )}
    </div>
  );
} 