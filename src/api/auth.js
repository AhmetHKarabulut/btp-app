import { requestWithRetry } from './client';

const LOGIN_PATH = '/api/Auth/Login';
const LOGOUT_PATH = '/api/Auth/Logout';

export async function login({ username, password }) {
  const resp = await requestWithRetry({
    url: LOGIN_PATH,
    method: 'post',
    data: { username, password },
  });
  const data = resp.data || {};
  const token = data.token || data.accessToken || data.access_token;
  if (token) localStorage.setItem('auth_token', token);
  return data;
}

export async function logout() {
  try {
    await requestWithRetry({ url: LOGOUT_PATH, method: 'post' });
  } catch (e) {
    // ignore
  }
  localStorage.removeItem('auth_token');
}