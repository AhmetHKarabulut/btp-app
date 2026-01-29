// Basit search-records "API" - demo amaçlı localStorage kullanır.
// Üretimde bunu gerçek backend endpoint'lerine yönlendirebilirsiniz.

const STORAGE_KEY = 'btp_search_records_v1';

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to read search records', e);
    return [];
  }
}

function writeAll(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to write search records', e);
  }
}

function makeId() {
  return 'r_' + Math.random().toString(36).slice(2, 9);
}

export async function getSearchRecords() {
  // fake async
  return new Promise((res) => setTimeout(() => res(readAll()), 80));
}

/**
 * record = {
 *   personId, personName, searcherName, notes, date (optional)
 * }
 */
export async function addSearchRecord(record) {
  if (!record || !record.personId) throw new Error('Invalid record');
  const items = readAll();
  const toSave = {
    id: makeId(),
    personId: record.personId,
    personName: record.personName || '',
    searcherName: record.searcherName || '',
    notes: record.notes || '',
    date: record.date || new Date().toISOString(),
  };
  items.unshift(toSave);
  writeAll(items);
  return new Promise((res) => setTimeout(() => res(toSave), 120));
}

export async function deleteSearchRecord(id) {
  const items = readAll();
  const filtered = items.filter((x) => x.id !== id);
  writeAll(filtered);
  return new Promise((res) => setTimeout(() => res(true), 80));
}