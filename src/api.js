// Talks to Harsh's API. If the API is not running, falls back to fake demo data so the UI always works.
import { FAKE_ALERTS, fakeSenior } from './fakeData.js';

const BASE = import.meta.env.VITE_API_URL || '/api';

async function get(path) {
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error('API error ' + res.status);
  return res.json();
}

export async function fetchAlerts() {
  try {
    return { data: await get('/alerts/today?limit=200'), demo: false };
  } catch {
    return { data: FAKE_ALERTS, demo: true };
  }
}

export async function fetchSenior(id, demo) {
  if (demo) return fakeSenior(id);
  try {
    return await get('/senior/' + id);
  } catch {
    return fakeSenior(id);
  }
}
