import apiClient, { ApiResponse, PaginatedResponse, handleApiError } from '../config/api';
import { Store } from '../types';

export interface StoresQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  location?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minRating?: number;
  isFollowing?: boolean;
}

export interface CreateStoreData {
  name: string;
  description: string;
  category: string;
  location: string;
  phone?: string;
  address?: string;
  openingHours?: string;
  image: string;
  logo: string;
}

export interface UpdateStoreData extends Partial<CreateStoreData> {
  id: string;
}

class StoresService {
  // קבלת כל החנויות עם פילטרים
  async getStores(params: StoresQueryParams = {}): Promise<PaginatedResponse<Store>> {
    try {
      const response = await apiClient.get('/stores', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת חנות יחידה לפי ID
  async getStoreById(id: string): Promise<Store> {
    try {
      const response = await apiClient.get(`/stores/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // חיפוש חנויות
  async searchStores(
    query: string, 
    category?: string, 
    page = 1, 
    limit = 20
  ): Promise<PaginatedResponse<Store>> {
    try {
      const params: StoresQueryParams = {
        page,
        limit,
        search: query,
        category,
      };

      const response = await apiClient.get('/stores/search', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת חנויות מובילות
  async getTrendingStores(limit = 10): Promise<Store[]> {
    try {
      const response = await apiClient.get('/stores/trending', { 
        params: { limit } 
      });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת חנויות לפי קטגוריה
  async getStoresByCategory(category: string, page = 1, limit = 20): Promise<PaginatedResponse<Store>> {
    try {
      const response = await apiClient.get(`/stores/category/${category}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // יצירת חנות חדשה
  async createStore(storeData: CreateStoreData): Promise<Store> {
    try {
      const response = await apiClient.post('/stores', storeData);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // עדכון חנות
  async updateStore(storeData: UpdateStoreData): Promise<Store> {
    try {
      const { id, ...updateData } = storeData;
      const response = await apiClient.put(`/stores/${id}`, updateData);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // מחיקת חנות
  async deleteStore(id: string): Promise<void> {
    try {
      await apiClient.delete(`/stores/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // מעקב/ביטול מעקב אחרי חנות
  async toggleFollow(storeId: string): Promise<boolean> {
    try {
      const response = await apiClient.post(`/stores/${storeId}/follow`);
      return response.data.data.isFollowing;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת חנויות שהמשתמש עוקב אחריהן
  async getFollowedStores(page = 1, limit = 20): Promise<PaginatedResponse<Store>> {
    try {
      const response = await apiClient.get('/stores/following', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת החנות של המשתמש הנוכחי (לבעלי חנויות)
  async getMyStore(): Promise<Store> {
    try {
      const response = await apiClient.get('/stores/my-store');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // עדכון סטטוס פתוח/סגור של החנות
  async updateStoreStatus(storeId: string, isOpen: boolean): Promise<Store> {
    try {
      const response = await apiClient.patch(`/stores/${storeId}/status`, { isOpen });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת סטטיסטיקות החנות
  async getStoreAnalytics(storeId: string, period = '30d'): Promise<any> {
    try {
      const response = await apiClient.get(`/stores/${storeId}/analytics`, {
        params: { period }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // העלאת תמונות לחנות
  async uploadStoreImages(storeId: string, images: FormData): Promise<{
    image?: string;
    logo?: string;
  }> {
    try {
      const response = await apiClient.post(`/stores/${storeId}/images`, images, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת הזמנות החנות
  async getStoreOrders(storeId: string, page = 1, limit = 20, status?: string): Promise<any> {
    try {
      const response = await apiClient.get(`/stores/${storeId}/orders`, {
        params: { page, limit, status }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // עדכון סטטוס הזמנה
  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    try {
      const response = await apiClient.patch(`/orders/${orderId}/status`, { status });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת קטגוריות חנויות
  async getStoreCategories(): Promise<string[]> {
    try {
      const response = await apiClient.get('/stores/categories');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // בקשת אישור לחנות חדשה
  async requestStoreApproval(storeData: CreateStoreData & {
    documents: FormData;
  }): Promise<any> {
    try {
      const response = await apiClient.post('/stores/request-approval', storeData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת חנויות ממתינות לאישור (למנהלים)
  async getPendingStores(page = 1, limit = 20): Promise<PaginatedResponse<any>> {
    try {
      const response = await apiClient.get('/stores/pending', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // אישור/דחייה של חנות (למנהלים)
  async approveStore(storeId: string, approved: boolean, reason?: string): Promise<any> {
    try {
      const response = await apiClient.post(`/stores/${storeId}/approve`, {
        approved,
        reason
      });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new StoresService(); 