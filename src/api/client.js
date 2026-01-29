import axios from 'axios';

const DEFAULT_BASE = process.env.REACT_APP_API_BASE_URL || ''; // setupProxy ile relative istek kullanılacak

const instance = axios.create({
  baseURL: DEFAULT_BASE || undefined,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor: token ekle + log
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  // console.debug('API Request:', config.method?.toUpperCase(), config.url);
  return config;
}, (err) => Promise.reject(err));

// Response interceptor: daha açıklayıcı hata
instance.interceptors.response.use(
  (resp) => resp,
  (err) => {
    if (!err.response) {
      // Network/CORS gibi durumlar
      const e = new Error('Network Error: sunucuya ulaşılamıyor veya CORS engeli var. Konsol Network sekmesini kontrol edin.');
      e.original = err;
      return Promise.reject(e);
    }
    return Promise.reject(err);
  }
);

// Basit requestWithRetry (GET cache yok, direkt forward)
export async function requestWithRetry(config, retries = 3) {
  try {
    return await instance.request(config);
  } catch (err) {
    // 429 handling
    if (err.response && err.response.status === 429 && retries > 0) {
      const wait = 500 * Math.pow(2, 3 - retries);
      await new Promise((r) => setTimeout(r, wait));
      return requestWithRetry(config, retries - 1);
    }
    throw err;
  }
}

export { instance as axiosClient };
export default instance;