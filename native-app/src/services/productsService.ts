import apiClient, { ApiResponse, PaginatedResponse, handleApiError } from '../config/api';
import { Product, SearchFilters } from '../types';

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  storeId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  isOnSale?: boolean;
  isNew?: boolean;
  inStock?: boolean;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  storeId: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

class ProductsService {
  // קבלת כל המוצרים עם פילטרים
  async getProducts(params: ProductsQueryParams = {}): Promise<PaginatedResponse<Product>> {
    try {
      const response = await apiClient.get('/products', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת מוצר יחיד לפי ID
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // חיפוש מוצרים מתקדם
  async searchProducts(filters: SearchFilters, page = 1, limit = 20): Promise<PaginatedResponse<Product>> {
    try {
      const params: ProductsQueryParams = {
        page,
        limit,
        search: filters.query,
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        isOnSale: filters.isOnSale,
        isNew: filters.isNew,
        sortBy: filters.sortBy?.split('_')[0],
        sortOrder: filters.sortBy?.includes('desc') ? 'desc' : 'asc',
      };

      const response = await apiClient.get('/products/search', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת מוצרים מומלצים/חמים
  async getFeaturedProducts(limit = 10): Promise<Product[]> {
    try {
      const response = await apiClient.get('/products/featured', { 
        params: { limit } 
      });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת מוצרים לפי חנות
  async getProductsByStore(storeId: string, page = 1, limit = 20): Promise<PaginatedResponse<Product>> {
    try {
      const response = await apiClient.get(`/products/store/${storeId}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת מוצרים לפי קטגוריה
  async getProductsByCategory(category: string, page = 1, limit = 20): Promise<PaginatedResponse<Product>> {
    try {
      const response = await apiClient.get(`/products/category/${category}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // יצירת מוצר חדש (לבעלי חנויות)
  async createProduct(productData: CreateProductData): Promise<Product> {
    try {
      const response = await apiClient.post('/products', productData);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // עדכון מוצר (לבעלי חנויות)
  async updateProduct(productData: UpdateProductData): Promise<Product> {
    try {
      const { id, ...updateData } = productData;
      const response = await apiClient.put(`/products/${id}`, updateData);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // מחיקת מוצר (לבעלי חנויות)
  async deleteProduct(id: string): Promise<void> {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // הוספה/הסרה ממועדפים
  async toggleFavorite(productId: string): Promise<boolean> {
    try {
      const response = await apiClient.post(`/products/${productId}/favorite`);
      return response.data.data.isFavorite;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת מוצרים מועדפים של המשתמש
  async getFavoriteProducts(page = 1, limit = 20): Promise<PaginatedResponse<Product>> {
    try {
      const response = await apiClient.get('/products/favorites', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // עדכון מלאי מוצר
  async updateStock(productId: string, stock: number): Promise<Product> {
    try {
      const response = await apiClient.patch(`/products/${productId}/stock`, { stock });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // הוספת ביקורת למוצר
  async addReview(productId: string, reviewData: {
    rating: number;
    comment: string;
  }): Promise<any> {
    try {
      const response = await apiClient.post(`/products/${productId}/reviews`, reviewData);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת ביקורות של מוצר
  async getProductReviews(productId: string, page = 1, limit = 10): Promise<any> {
    try {
      const response = await apiClient.get(`/products/${productId}/reviews`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // העלאת תמונות למוצר
  async uploadProductImages(productId: string, images: FormData): Promise<string[]> {
    try {
      const response = await apiClient.post(`/products/${productId}/images`, images, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data.images;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת מוצרים דומים
  async getSimilarProducts(productId: string, limit = 6): Promise<Product[]> {
    try {
      const response = await apiClient.get(`/products/${productId}/similar`, {
        params: { limit }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת טרנדים וחנויות מובילות
  async getTrendingData(): Promise<{
    trendingStores: any[];
    weeklyTrends: any[];
  }> {
    try {
      const response = await apiClient.get('/products/trending');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new ProductsService(); 