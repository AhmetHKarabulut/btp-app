import { requestWithRetry } from './client';
import { simpatizanlar as demoSimpatizan, teskilat as demoTeskilat } from '../data/people';

const SEMPATIZAN_PATH = process.env.REACT_APP_API_SEMPATIZAN_ENDPOINT || '/api/Party/Sympathizers';
const TESKILAT_PATH = process.env.REACT_APP_API_TESKILAT_ENDPOINT || '/api/Party/Members';

async function tryGet(path) {
  try {
    const resp = await requestWithRetry({ url: path, method: 'get' });
    if (!resp || !resp.data) return [];
    return resp.data;
  } catch (err) {
    console.warn(`API get failed for ${path}, falling back to demo data`, err?.message || err);
    return null;
  }
}

export async function getSempatizanlar() {
  const result = await tryGet(SEMPATIZAN_PATH);
  return result === null ? demoSimpatizan : result;
}

export async function getTeskilat() {
  const result = await tryGet(TESKILAT_PATH);
  return result === null ? demoTeskilat : result;
}

export async function getPersonById(id) {
  const PATH_BY_ID = `/api/Party/Person/${encodeURIComponent(id)}`;
  try {
    const resp = await requestWithRetry({ url: PATH_BY_ID, method: 'get' });
    return resp.data;
  } catch (err) {
    const all = (await getSempatizanlar()).concat(await getTeskilat());
    return all.find((p) => p.id === id) || null;
  }
}

/**
 * updatePerson: backend'de hangi route/metod olduğunu tespit edene kadar
 * birkaç yaygın yolu dener. Hata durumunda ayrıntılı hata fırlatır.
 */
export async function updatePerson(id, payload) {
  const attempts = [
    { url: `/api/Party/Person/${encodeURIComponent(id)}`, method: 'put' },
    { url: `/api/Party/Person/${encodeURIComponent(id)}`, method: 'patch' },
    { url: `/api/Party/Person/${encodeURIComponent(id)}/Update`, method: 'post' },
    { url: `/api/Party/Person/Update`, method: 'post', data: { id, ...payload } },
  ];

  let lastErr = null;

  for (const attempt of attempts) {
    try {
      const config = {
        url: attempt.url,
        method: attempt.method,
        data: attempt.data || payload,
      };
      const resp = await requestWithRetry(config);
      if (resp && resp.status >= 200 && resp.status < 300) {
        if (resp.data && Object.keys(resp.data).length) return resp.data;
        return { id, ...payload };
      }
    } catch (err) {
      lastErr = err;
      console.warn(`Attempt failed ${attempt.method} ${attempt.url}:`, err?.response?.status, err?.response?.data || err.message);
      // Eğer network/CORS ise response olmayabilir; bu durumda doğrudan fırlatabiliriz
      if (!err.response) {
        throw new Error('Network Error: sunucuya ulaşılamıyor veya CORS engeli var. Konsol Network sekmesini kontrol edin.');
      }
      // continue to try next attempt for other routes/methods
    }
  }

  const serverMessage = lastErr?.response?.data?.message
    || lastErr?.response?.data
    || lastErr?.message
    || 'Unknown error';

  const status = lastErr?.response?.status || 'no-status';
  const error = new Error(`Update failed (status ${status}): ${typeof serverMessage === 'string' ? serverMessage : JSON.stringify(serverMessage)}`);
  error.response = lastErr?.response;
  throw error;
}