/**
 * Token Storage
 * Bu dosya token saklama işlemlerini yönetir.
 * React Native ve Web için uyumlu storage implementasyonu.
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const TOKEN_KEY = '@btp_auth_token';
const REFRESH_TOKEN_KEY = '@btp_refresh_token';
const USER_KEY = '@btp_user_data';

// Memory fallback storage (React Native için localStorage/AsyncStorage olmadığında)
const memoryStorage = {};

// Platform-aware storage implementasyonu
const storage = {
  getItem: async (key) => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
      } else {
        // Native: try AsyncStorage first
        const val = await AsyncStorage.getItem(key);
        if (val !== null) return val;
      }
      // Fallback to memory
      return memoryStorage[key] || null;
    } catch (error) {
      return memoryStorage[key] || null;
    }
  },
  setItem: async (key, value) => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          const v = typeof value === 'string' ? value : JSON.stringify(value);
          window.localStorage.setItem(key, v);
          return;
        }
      } else {
        const v = typeof value === 'string' ? value : JSON.stringify(value);
        await AsyncStorage.setItem(key, v);
        return;
      }
      memoryStorage[key] = value;
    } catch (error) {
      memoryStorage[key] = value;
    }
  },
  removeItem: async (key) => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
          return;
        }
      } else {
        await AsyncStorage.removeItem(key);
        return;
      }
      delete memoryStorage[key];
    } catch (error) {
      delete memoryStorage[key];
    }
  },
};

/**
 * Access Token'ı kaydet
 * @param {string} token - JWT access token
 */
export const saveToken = async (token) => {
  let value = token;
  if (token && typeof token === 'object') {
    if (token.accessToken) value = token.accessToken;
    else if (token.token) value = token.token;
    else value = JSON.stringify(token);
  }
  await storage.setItem(TOKEN_KEY, value);
};

/**
 * Access Token'ı getir
 * @returns {Promise<string|null>} JWT access token veya null
 */
export const getToken = async () => {
  const v = await storage.getItem(TOKEN_KEY);
  if (!v) return null;
  // If stored value is JSON (stringified object), try to parse and extract token
  try {
    const parsed = JSON.parse(v);
    if (parsed && typeof parsed === 'object') {
      return parsed.accessToken || parsed.token || v;
    }
  } catch (e) {
    // not JSON
  }
  return v;
};

/**
 * Access Token'ı sil
 */
export const removeToken = async () => {
  await storage.removeItem(TOKEN_KEY);
};

/**
 * Refresh Token'ı kaydet
 * @param {string} refreshToken - Refresh token
 */
export const saveRefreshToken = async (refreshToken) => {
  await storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

/**
 * Refresh Token'ı getir
 * @returns {Promise<string|null>} Refresh token veya null
 */
export const getRefreshToken = async () => {
  return await storage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Refresh Token'ı sil
 */
export const removeRefreshToken = async () => {
  await storage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Kullanıcı bilgilerini kaydet
 * @param {Object} user - Kullanıcı bilgileri
 */
export const saveUser = async (user) => {
  await storage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Kullanıcı bilgilerini getir
 * @returns {Promise<Object|null>} Kullanıcı bilgileri veya null
 */
export const getUser = async () => {
  const userData = await storage.getItem(USER_KEY);
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Kullanıcı bilgilerini sil
 */
export const removeUser = async () => {
  await storage.removeItem(USER_KEY);
};

/**
 * Tüm auth verilerini temizle (logout için)
 */
export const clearAllAuthData = async () => {
  await Promise.all([
    removeToken(),
    removeRefreshToken(),
    removeUser(),
  ]);
};
