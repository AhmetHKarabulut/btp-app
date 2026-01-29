/**
 * API Module Index
 * Tüm API servislerini ve yardımcı fonksiyonları export eder.
 * 
 * Kullanım örneği:
 * import { authService, apiClient, API_BASE_URL } from './api';
 * 
 * // Login
 * const result = await authService.login({ email, password });
 * 
 * // Diğer API çağrıları
 * const response = await apiClient.get('/api/AgeRanges/GetList');
 */

// API Client ve Konfigürasyon
export { default as apiClient, API_BASE_URL } from './config';

// Storage fonksiyonları
export {
  saveToken,
  getToken,
  removeToken,
  saveRefreshToken,
  getRefreshToken,
  removeRefreshToken,
  saveUser,
  getUser,
  removeUser,
  clearAllAuthData,
} from './storage';

// Servisler
export { default as authService } from './services/authService';
export * from './services/authService';
