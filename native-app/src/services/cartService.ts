import apiClient, { ApiResponse, PaginatedResponse, handleApiError } from '../config/api';
import { CartItem, Order } from '../types';

export interface AddToCartData {
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  notes?: string;
}

export interface UpdateCartItemData {
  cartItemId: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface CreateOrderData {
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: 'credit_card' | 'paypal' | 'cash_on_delivery';
  paymentDetails?: any;
  notes?: string;
  promoCode?: string;
}

export interface OrdersQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  storeId?: string;
  startDate?: string;
  endDate?: string;
}

class CartService {
  // הוספת מוצר לעגלה
  async addToCart(addData: AddToCartData): Promise<CartItem> {
    try {
      const response = await apiClient.post('/cart/add', addData);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת תוכן העגלה
  async getCart(): Promise<CartItem[]> {
    try {
      const response = await apiClient.get('/cart');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // עדכון פריט בעגלה
  async updateCartItem(updateData: UpdateCartItemData): Promise<CartItem> {
    try {
      const { cartItemId, ...data } = updateData;
      const response = await apiClient.put(`/cart/item/${cartItemId}`, data);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // הסרת פריט מהעגלה
  async removeFromCart(cartItemId: string): Promise<void> {
    try {
      await apiClient.delete(`/cart/item/${cartItemId}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // ניקוי עגלה
  async clearCart(): Promise<void> {
    try {
      await apiClient.delete('/cart/clear');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // בדיקת קוד הנחה
  async validatePromoCode(promoCode: string): Promise<{
    isValid: boolean;
    discountAmount: number;
    discountType: 'percentage' | 'fixed';
    minimumAmount?: number;
    description?: string;
  }> {
    try {
      const response = await apiClient.post('/cart/validate-promo', { promoCode });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // חישוב סה"כ עגלה (כולל משלוח ומיסים)
  async calculateCartTotal(promoCode?: string): Promise<{
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
    items: CartItem[];
  }> {
    try {
      const response = await apiClient.post('/cart/calculate', { promoCode });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // יצירת הזמנה
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      const response = await apiClient.post('/orders', orderData);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת הזמנות המשתמש
  async getUserOrders(params: OrdersQueryParams = {}): Promise<PaginatedResponse<Order>> {
    try {
      const response = await apiClient.get('/orders/my-orders', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת הזמנה יחידה
  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // ביטול הזמנה
  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    try {
      const response = await apiClient.post(`/orders/${orderId}/cancel`, { reason });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // אישור קבלת הזמנה
  async confirmReceived(orderId: string): Promise<Order> {
    try {
      const response = await apiClient.post(`/orders/${orderId}/confirm-received`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // החזרת הזמנה
  async returnOrder(orderId: string, returnData: {
    reason: string;
    description: string;
    items: Array<{
      productId: string;
      quantity: number;
      reason: string;
    }>;
  }): Promise<any> {
    try {
      const response = await apiClient.post(`/orders/${orderId}/return`, returnData);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // מעקב אחרי הזמנה
  async trackOrder(orderId: string): Promise<{
    status: string;
    estimatedDelivery: string;
    trackingNumber?: string;
    trackingUrl?: string;
    history: Array<{
      status: string;
      date: string;
      description: string;
      location?: string;
    }>;
  }> {
    try {
      const response = await apiClient.get(`/orders/${orderId}/tracking`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת שיטות תשלום זמינות
  async getPaymentMethods(): Promise<Array<{
    id: string;
    name: string;
    type: string;
    isEnabled: boolean;
    icon: string;
    description?: string;
  }>> {
    try {
      const response = await apiClient.get('/orders/payment-methods');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת אפשרויות משלוח
  async getShippingOptions(address: {
    city: string;
    postalCode: string;
  }): Promise<Array<{
    id: string;
    name: string;
    price: number;
    estimatedDays: number;
    description: string;
  }>> {
    try {
      const response = await apiClient.post('/orders/shipping-options', address);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // עדכון כתובת משלוח
  async updateShippingAddress(orderId: string, address: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  }): Promise<Order> {
    try {
      const response = await apiClient.put(`/orders/${orderId}/shipping-address`, address);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // הוספת ביקורת על הזמנה
  async addOrderReview(orderId: string, reviewData: {
    productId: string;
    rating: number;
    comment: string;
    images?: string[];
  }): Promise<any> {
    try {
      const response = await apiClient.post(`/orders/${orderId}/review`, reviewData);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת קודי הנחה זמינים
  async getAvailablePromoCodes(): Promise<Array<{
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minimumAmount?: number;
    expiryDate: string;
    isActive: boolean;
  }>> {
    try {
      const response = await apiClient.get('/cart/promo-codes');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // שמירת פרטי הזמנה לשימוש עתידי
  async saveOrderDraft(orderData: Partial<CreateOrderData>): Promise<void> {
    try {
      await apiClient.post('/orders/save-draft', orderData);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת טיוטת הזמנה שמורה
  async getOrderDraft(): Promise<Partial<CreateOrderData> | null> {
    try {
      const response = await apiClient.get('/orders/draft');
      return response.data.data;
    } catch (error) {
      return null; // אם אין טיוטה, החזר null
    }
  }

  // חישוב זמן אספקה מוערך
  async getEstimatedDelivery(address: {
    city: string;
    postalCode: string;
  }): Promise<{
    minDays: number;
    maxDays: number;
    estimatedDate: string;
  }> {
    try {
      const response = await apiClient.post('/orders/estimate-delivery', address);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // בדיקת מלאי לפני הזמנה
  async checkStockAvailability(): Promise<Array<{
    productId: string;
    available: number;
    requested: number;
    isAvailable: boolean;
  }>> {
    try {
      const response = await apiClient.get('/cart/check-stock');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new CartService(); 