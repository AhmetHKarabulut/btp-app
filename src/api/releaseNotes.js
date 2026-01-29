import { requestWithRetry } from './client';

const NEWEST_PATH = '/api/ReleaseNotes/GetNewestReleaseNotes';

export async function getNewestReleaseNotes(limit = 5) {
  const resp = await requestWithRetry({ url: NEWEST_PATH, method: 'get', params: { count: limit } });
  return resp.data || [];
}