'use client';

import { useState } from 'react';
import { CreditCard, MapPin, Truck } from 'lucide-react';

type DeliveryMethod = 'standard' | 'express';
type PaymentMethod = 'credit' | 'bit' | 'paypal';

export default function CheckoutPage() {
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');

  const cartItems = [
    {
      id: 1,
      name: 'חולצת טי קלאסית',
      price: 99.90,
      size: 'M',
      color: 'שחור',
      quantity: 2,
      store: 'זארה'
    },
    {
      id: 2,
      name: 'נעלי ספורט נייקי',
      price: 399.90,
      size: '42',
      color: 'לבן',
      quantity: 1,
      store: 'נייקי'
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCost = deliveryMethod === 'standard' ? 29.90 : 49.90;
  const total = subtotal + deliveryCost;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">תשלום</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* טופס תשלום */}
        <div className="space-y-6">
          {/* פרטי משלוח */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <MapPin className="w-6 h-6 ml-3 text-primary-600" />
              <h2 className="text-xl font-semibold">פרטי משלוח</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">שם מלא</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-xl"
                  placeholder="ישראל ישראלי"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">טלפון</label>
                <input
                  type="tel"
                  className="w-full p-3 border rounded-xl"
                  placeholder="050-1234567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">כתובת</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-xl"
                  placeholder="רחוב, מספר בית, עיר"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">דירה/כניסה (אופציונלי)</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-xl"
                  placeholder="דירה 5, כניסה א'"
                />
              </div>
            </div>
          </div>

          {/* שיטת משלוח */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Truck className="w-6 h-6 ml-3 text-primary-600" />
              <h2 className="text-xl font-semibold">שיטת משלוח</h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setDeliveryMethod('standard')}
                className={`w-full p-4 rounded-xl border transition-colors text-right ${
                  deliveryMethod === 'standard'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">משלוח רגיל</p>
                    <p className="text-sm text-gray-500">3-5 ימי עסקים</p>
                  </div>
                  <span className="font-medium">₪29.90</span>
                </div>
              </button>

              <button
                onClick={() => setDeliveryMethod('express')}
                className={`w-full p-4 rounded-xl border transition-colors text-right ${
                  deliveryMethod === 'express'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">משלוח מהיר</p>
                    <p className="text-sm text-gray-500">1-2 ימי עסקים</p>
                  </div>
                  <span className="font-medium">₪49.90</span>
                </div>
              </button>
            </div>
          </div>

          {/* אמצעי תשלום */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <CreditCard className="w-6 h-6 ml-3 text-primary-600" />
              <h2 className="text-xl font-semibold">אמצעי תשלום</h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setPaymentMethod('credit')}
                className={`w-full p-4 rounded-xl border transition-colors text-right ${
                  paymentMethod === 'credit'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <p className="font-medium">כרטיס אשראי</p>
              </button>

              <button
                onClick={() => setPaymentMethod('bit')}
                className={`w-full p-4 rounded-xl border transition-colors text-right ${
                  paymentMethod === 'bit'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <p className="font-medium">Bit</p>
              </button>

              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`w-full p-4 rounded-xl border transition-colors text-right ${
                  paymentMethod === 'paypal'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <p className="font-medium">PayPal</p>
              </button>

              {paymentMethod === 'credit' && (
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">מספר כרטיס</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-xl"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">תוקף</label>
                      <input
                        type="text"
                        className="w-full p-3 border rounded-xl"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV</label>
                      <input
                        type="text"
                        className="w-full p-3 border rounded-xl"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* סיכום הזמנה */}
        <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
          <h2 className="text-xl font-semibold mb-6">סיכום הזמנה</h2>

          <div className="space-y-4 mb-6">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-start pb-4 border-b last:border-0">
                <div>
                  <p className="text-sm text-gray-500">{item.store}</p>
                  <p className="font-medium">{item.name}</p>
                  <div className="text-sm text-gray-600 mt-1">
                    <span>מידה: {item.size}</span>
                    <span className="mx-2">|</span>
                    <span>צבע: {item.color}</span>
                    <span className="mx-2">|</span>
                    <span>כמות: {item.quantity}</span>
                  </div>
                </div>
                <p className="font-bold">₪{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 py-4 border-y">
            <div className="flex justify-between">
              <span className="text-gray-600">סכום ביניים</span>
              <span>₪{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">משלוח</span>
              <span>₪{deliveryCost.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 mb-6">
            <span className="text-lg font-medium">סה"כ לתשלום</span>
            <span className="text-2xl font-bold">₪{total.toFixed(2)}</span>
          </div>

          <button
            onClick={() => console.log('Processing payment...')}
            className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition-colors"
          >
            אישור תשלום
          </button>

          <p className="text-sm text-gray-500 text-center mt-4">
            באישור התשלום אני מסכימ/ה ל
            <button className="text-primary-600 hover:underline mr-1">תנאי השימוש</button>
            ול
            <button className="text-primary-600 hover:underline mr-1">מדיניות הפרטיות</button>
          </p>
        </div>
      </div>
    </div>
  );
} 