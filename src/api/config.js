/**
 * API Konfigürasyon Dosyası
 * Bu dosya axios instance'ını ve API yapılandırmasını içerir.
 */

import axios from 'axios';
import { getToken, removeToken } from './storage';

// Base API URL
export const API_BASE_URL = 'https://marie-ment-presentations-reports.trycloudflare.com';

// Türkçe hata mesajları
const ERROR_MESSAGES = {
  'network_error': 'İnternet bağlantınızı kontrol edin',
  'timeout': 'Sunucu yanıt vermedi, lütfen tekrar deneyin',
  'server_error': 'Sunucu hatası, lütfen daha sonra tekrar deneyin',
  'unauthorized': 'Oturum süreniz doldu, lütfen tekrar giriş yapın',
  'default': 'Bir hata oluştu, lütfen tekrar deneyin',
};

/**
 * Backend hata mesajını parse et
 * Backend "BusinessException: Kullanıcı bulunmuyor." şeklinde mesaj dönüyor
 */
const parseErrorMessage = (responseData) => {
  if (!responseData) return null;
  
  // String response kontrolü
  if (typeof responseData === 'string') {
    // "BusinessException: Kullanıcı bulunmuyor." formatını parse et
    const businessExceptionMatch = responseData.match(/BusinessException:\s*([^.]+)/);
    if (businessExceptionMatch) {
      return businessExceptionMatch[1].trim();
    }
    
    // Satır satır kontrol et (ilk satırda hata mesajı olabilir)
    const lines = responseData.split('\n');
    if (lines.length > 0) {
      const firstLine = lines[0];
      // Exception mesajını bul
      const exceptionMatch = firstLine.match(/Exception[^:]*:\s*(.+)/);
      if (exceptionMatch) {
        return exceptionMatch[1].trim();
      }
    }
    
    // Eğer kısa bir mesajsa direkt döndür
    if (responseData.length < 200 && !responseData.includes('at ')) {
      return responseData;
    }
  }
  
  // Object response kontrolü
  if (typeof responseData === 'object') {
    // Standart hata formatları
    if (responseData.message) return responseData.message;
    if (responseData.title) return responseData.title;
    if (responseData.error) return responseData.error;
    if (responseData.errors) {
      // Validation hataları
      const errors = Object.values(responseData.errors).flat();
      if (errors.length > 0) return errors[0];
    }
  }
  
  return null;
};

// Axios instance oluşturma
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 saniye timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - Her istekte token ekle
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Token alınamadı, devam et
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Hata yönetimi
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized hatası - Token geçersiz
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Token'ı temizle
      await removeToken();
      
      // İsteği yeniden dene (bu durumda login sayfasına yönlendirme yapılabilir)
      return Promise.reject({
        ...error,
        message: ERROR_MESSAGES.unauthorized,
        status: 401,
      });
    }

    // Hata mesajını belirle
    let errorMessage = ERROR_MESSAGES.default;

    // Network hatası
    if (error.message === 'Network Error' || !error.response) {
      errorMessage = ERROR_MESSAGES.network_error;
    }
    // Timeout hatası
    else if (error.code === 'ECONNABORTED') {
      errorMessage = ERROR_MESSAGES.timeout;
    }
    // HTTP hata response'u var
    else if (error.response) {
      const status = error.response.status;
      const responseData = error.response.data;

      // Backend'den gelen hata mesajını parse et
      const backendMessage = parseErrorMessage(responseData);
      
      if (backendMessage) {
        errorMessage = backendMessage;
      } else if (status >= 500) {
        errorMessage = ERROR_MESSAGES.server_error;
      } else if (status === 401) {
        errorMessage = ERROR_MESSAGES.unauthorized;
      } else if (status === 400) {
        errorMessage = 'Geçersiz istek, lütfen bilgilerinizi kontrol edin';
      } else if (status === 404) {
        errorMessage = 'İstenen kaynak bulunamadı';
      } else if (status === 403) {
        errorMessage = 'Bu işlem için yetkiniz yok';
      }
    }

    return Promise.reject({
      ...error,
      message: errorMessage,
      status: error.response?.status,
    });
  }
);

export default apiClient;
