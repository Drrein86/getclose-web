import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// בדיקה אם זה development או production
const isDevelopment = __DEV__;

// URL הבסיס של ה-API - מתחבר לאותו אתר עם Railway DB
export const API_BASE_URL = 'https://getclose-web-production.up.railway.app/api';

// יצירת instance של axios עם הגדרות בסיס
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// הוספת interceptor לטיפול ב-authentication
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// הוספת interceptor לטיפול ב-responses
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // אם יש שגיאת authentication, נקה את הטוקן ונעביר למסך התחברות
      await AsyncStorage.removeItem('auth_token');
      // כאן אפשר להוסיף ניווט למסך התחברות
    }
    
    // הדפסת שגיאות מפורטת עבור debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    
    return Promise.reject(error);
  }
);

export default apiClient;

// Types עבור API responses
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Helper function לטיפול ב-API errors
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'שגיאה לא צפויה. אנא נסה שוב.';
};

// Helper function לבדיקת חיבור לאינטרנט
export const checkInternetConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      mode: 'no-cors',
    });
    return true;
  } catch {
    return false;
  }
}; 