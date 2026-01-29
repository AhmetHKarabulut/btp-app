/**
 * Auth Service
 * Kullanıcı kimlik doğrulama işlemleri için API servisi.
 * Swagger API'ye göre oluşturulmuştur.
 */

import apiClient from '../config';
import { 
  saveToken, 
  saveRefreshToken, 
  saveUser, 
  clearAllAuthData,
  getRefreshToken 
} from '../storage';

/**
 * Kullanıcı girişi yapar
 * POST /api/Auth/Login
 * 
 * @param {Object} credentials - Giriş bilgileri
 * @param {string} credentials.email - Kullanıcı email adresi
 * @param {string} credentials.password - Kullanıcı şifresi
 * @param {string} [credentials.authenticatorCode] - İki faktörlü doğrulama kodu (opsiyonel)
 * @returns {Promise<Object>} Login response (token, user bilgileri vb.)
 */
export const login = async ({ email, password, authenticatorCode = null }) => {
  try {
    const response = await apiClient.post('/api/Auth/Login', {
      email,
      password,
      authenticatorCode,
    });

    const { data } = response;

    // Token'ları kaydet (API response yapısına göre ayarlanabilir)
    if (data.accessToken || data.token) {
      await saveToken(data.accessToken || data.token);
    }

    if (data.refreshToken) {
      await saveRefreshToken(data.refreshToken);
    }

    // Kullanıcı bilgilerini kaydet
    if (data.user) {
      await saveUser(data.user);
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    // Hata mesajını interceptor'dan al
    const errorMessage = error.message || 'Giriş yapılırken bir hata oluştu';
    
    return {
      success: false,
      error: errorMessage,
      status: error.status || error.response?.status,
    };
  }
};

/**
 * Yeni kullanıcı kaydı oluşturur
 * POST /api/Auth/Register
 * 
 * @param {Object} registerData - Kayıt bilgileri
 * @returns {Promise<Object>} Register response
 */
export const register = async (registerData) => {
  try {
    const response = await apiClient.post('/api/Auth/Register', registerData);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Kayıt olurken bir hata oluştu',
      status: error.status || error.response?.status,
    };
  }
};

/**
 * Mevcut token'ı yeniler
 * GET /api/Auth/RefreshToken
 * 
 * @returns {Promise<Object>} Yeni token bilgileri
 */
export const refreshToken = async () => {
  try {
    const currentRefreshToken = await getRefreshToken();
    
    const response = await apiClient.get('/api/Auth/RefreshToken', {
      headers: {
        'X-Refresh-Token': currentRefreshToken,
      },
    });

    const { data } = response;

    // Yeni token'ları kaydet
    if (data.accessToken || data.token) {
      await saveToken(data.accessToken || data.token);
    }

    if (data.refreshToken) {
      await saveRefreshToken(data.refreshToken);
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Token yenilenirken bir hata oluştu',
      status: error.status || error.response?.status,
    };
  }
};

/**
 * Belirtilen veya mevcut refresh token'ı iptal eder
 * PUT /api/Auth/RevokeToken
 * 
 * @param {string} [tokenToRevoke] - İptal edilecek refresh token (opsiyonel)
 * @returns {Promise<Object>} Revoke response
 */
export const revokeToken = async (tokenToRevoke = null) => {
  try {
    const token = tokenToRevoke || await getRefreshToken();
    
    const response = await apiClient.put('/api/Auth/RevokeToken', token);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Token iptal edilirken bir hata oluştu',
      status: error.status || error.response?.status,
    };
  }
};

/**
 * Email doğrulayıcıyı etkinleştirir
 * GET /api/Auth/EnableEmailAuthenticator
 * 
 * @returns {Promise<Object>} Enable email authenticator response
 */
export const enableEmailAuthenticator = async () => {
  try {
    const response = await apiClient.get('/api/Auth/EnableEmailAuthenticator');

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Email doğrulayıcı etkinleştirilirken bir hata oluştu',
      status: error.status || error.response?.status,
    };
  }
};

/**
 * OTP doğrulayıcıyı etkinleştirir
 * GET /api/Auth/EnableOtpAuthenticator
 * 
 * @returns {Promise<Object>} Enable OTP authenticator response
 */
export const enableOtpAuthenticator = async () => {
  try {
    const response = await apiClient.get('/api/Auth/EnableOtpAuthenticator');

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'OTP doğrulayıcı etkinleştirilirken bir hata oluştu',
      status: error.status || error.response?.status,
    };
  }
};

/**
 * Email doğrulayıcıyı onaylar
 * GET /api/Auth/VerifyEmailAuthenticator
 * 
 * @param {string} activationKey - Doğrulama anahtarı
 * @returns {Promise<Object>} Verify email authenticator response
 */
export const verifyEmailAuthenticator = async (activationKey) => {
  try {
    const response = await apiClient.get('/api/Auth/VerifyEmailAuthenticator', {
      params: { ActivationKey: activationKey },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Email doğrulanırken bir hata oluştu',
      status: error.status || error.response?.status,
    };
  }
};

/**
 * OTP doğrulayıcıyı onaylar
 * POST /api/Auth/VerifyOtpAuthenticator
 * 
 * @param {string} code - OTP kodu
 * @returns {Promise<Object>} Verify OTP authenticator response
 */
export const verifyOtpAuthenticator = async (code) => {
  try {
    const response = await apiClient.post('/api/Auth/VerifyOtpAuthenticator', code);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'OTP doğrulanırken bir hata oluştu',
      status: error.status || error.response?.status,
    };
  }
};

/**
 * Kullanıcı çıkışı yapar
 * Tüm auth verilerini temizler
 * 
 * @returns {Promise<Object>} Logout response
 */
export const logout = async () => {
  try {
    // Önce token'ı iptal et
    await revokeToken();
    
    // Tüm auth verilerini temizle
    await clearAllAuthData();

    return {
      success: true,
    };
  } catch (error) {
    // Hata olsa bile local verileri temizle
    await clearAllAuthData();
    
    return {
      success: true, // Logout her zaman başarılı sayılır
    };
  }
};

export default {
  login,
  register,
  refreshToken,
  revokeToken,
  enableEmailAuthenticator,
  enableOtpAuthenticator,
  verifyEmailAuthenticator,
  verifyOtpAuthenticator,
  logout,
};
