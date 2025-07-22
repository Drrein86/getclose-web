import apiClient, { ApiResponse, handleApiError } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserType } from '../types';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: UserType;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class AuthService {
  // כניסה למערכת
  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/login', loginData);
      const authData = response.data.data;
      
      // שמירת הטוקן ב-AsyncStorage
      await AsyncStorage.setItem('auth_token', authData.token);
      await AsyncStorage.setItem('refresh_token', authData.refreshToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(authData.user));
      
      return authData;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // הרשמה למערכת
  async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/register', registerData);
      const authData = response.data.data;
      
      // שמירת הטוקן ב-AsyncStorage
      await AsyncStorage.setItem('auth_token', authData.token);
      await AsyncStorage.setItem('refresh_token', authData.refreshToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(authData.user));
      
      return authData;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // יציאה מהמערכת
  async logout(): Promise<void> {
    try {
      // קרא לשרת לביטול הטוקן
      await apiClient.post('/auth/logout');
    } catch (error) {
      // גם אם יש שגיאה, נקה את המידע המקומי
      console.warn('Logout error:', error);
    } finally {
      // נקה את כל המידע המקומי
      await AsyncStorage.multiRemove(['auth_token', 'refresh_token', 'user_data']);
    }
  }

  // רענון טוקן
  async refreshToken(): Promise<string> {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post('/auth/refresh', { refreshToken });
      const { token } = response.data.data;
      
      await AsyncStorage.setItem('auth_token', token);
      return token;
    } catch (error) {
      // אם רענון הטוקן נכשל, נקה את המידע ונעביר למסך התחברות
      await this.logout();
      throw new Error(handleApiError(error));
    }
  }

  // שכחתי סיסמה
  async forgotPassword(forgotPasswordData: ForgotPasswordData): Promise<void> {
    try {
      await apiClient.post('/auth/forgot-password', forgotPasswordData);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // איפוס סיסמה
  async resetPassword(resetPasswordData: ResetPasswordData): Promise<void> {
    try {
      await apiClient.post('/auth/reset-password', resetPasswordData);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת פרופיל המשתמש הנוכחי
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get('/auth/me');
      const user = response.data.data;
      
      // עדכן את המידע המקומי
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
      
      return user;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // עדכון פרופיל משתמש
  async updateProfile(updateData: UpdateProfileData): Promise<User> {
    try {
      const response = await apiClient.put('/auth/profile', updateData);
      const user = response.data.data;
      
      // עדכן את המידע המקומי
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
      
      return user;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // שינוי סיסמה
  async changePassword(changePasswordData: ChangePasswordData): Promise<void> {
    try {
      await apiClient.post('/auth/change-password', changePasswordData);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // העלאת תמונת פרופיל
  async uploadAvatar(avatar: FormData): Promise<string> {
    try {
      const response = await apiClient.post('/auth/upload-avatar', avatar, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const avatarUrl = response.data.data.avatar;
      
      // עדכן את המידע המקומי
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        user.avatar = avatarUrl;
        await AsyncStorage.setItem('user_data', JSON.stringify(user));
      }
      
      return avatarUrl;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // אימות אימייל
  async verifyEmail(token: string): Promise<void> {
    try {
      await apiClient.post('/auth/verify-email', { token });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // שליחת אימות אימייל מחדש
  async resendEmailVerification(): Promise<void> {
    try {
      await apiClient.post('/auth/resend-verification');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // שינוי סוג משתמש
  async changeUserType(userType: UserType): Promise<User> {
    try {
      const response = await apiClient.post('/auth/change-user-type', { userType });
      const user = response.data.data;
      
      // עדכן את המידע המקומי
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
      
      return user;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // מחיקת חשבון
  async deleteAccount(password: string): Promise<void> {
    try {
      await apiClient.post('/auth/delete-account', { password });
      // נקה את כל המידע המקומי
      await AsyncStorage.multiRemove(['auth_token', 'refresh_token', 'user_data']);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // בדיקה אם המשתמש מחובר
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) return false;

      // נסה לקבל את פרטי המשתמש לוודא שהטוקן תקין
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }

  // קבלת נתוני משתמש מקומיים
  async getLocalUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  // קבלת טוקן מקומי
  async getLocalToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch {
      return null;
    }
  }

  // התחברות עם Google/Facebook (OAuth)
  async socialLogin(provider: 'google' | 'facebook', token: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(`/auth/${provider}`, { token });
      const authData = response.data.data;
      
      // שמירת הטוקן ב-AsyncStorage
      await AsyncStorage.setItem('auth_token', authData.token);
      await AsyncStorage.setItem('refresh_token', authData.refreshToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(authData.user));
      
      return authData;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // קבלת הרשאות המשתמש
  async getUserPermissions(): Promise<string[]> {
    try {
      const response = await apiClient.get('/auth/permissions');
      return response.data.data.permissions;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new AuthService(); 