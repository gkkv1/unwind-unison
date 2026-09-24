// ============================================================
// ODC PARTY — EVENT API SERVICE
// Fetches live config from Google Apps Script / Google Sheets
// Falls back to local data when unavailable
// ============================================================

import {
  fallbackEventConfig,
  fallbackMenu,
  fallbackTimeline,
  fallbackMedia,
} from '../data/fallbackEvent';

const API_URL = import.meta.env.VITE_EVENT_API_URL;
const TIMEOUT_MS = 5000;

// ---- Helper: fetch with timeout ----
async function fetchWithTimeout(url, options = {}, ms = TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return response;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

// ---- Fetch all event data ----
async function fetchEventData() {
  if (!API_URL) {
    console.info('[ODC] No API URL configured. Using fallback data.');
    return null;
  }

  try {
    const response = await fetchWithTimeout(`${API_URL}?action=getAll`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('[ODC] Remote data unavailable, using fallback:', err.message);
    return null;
  }
}

// ---- Cache ----
let _cached = null;
let _cacheTime = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getRemoteData() {
  const now = Date.now();
  if (_cached && _cacheTime && now - _cacheTime < CACHE_TTL) {
    return _cached;
  }
  const data = await fetchEventData();
  if (data) {
    _cached = data;
    _cacheTime = now;
  }
  return data;
}

// ---- Public API ----

export async function getEventConfig() {
  const data = await getRemoteData();
  if (data?.event) return { data: data.event, isRemote: true };
  return { data: fallbackEventConfig, isRemote: false };
}

export async function getMenu() {
  const data = await getRemoteData();
  if (data?.menu?.length > 0) return { data: data.menu, isRemote: true };
  return { data: fallbackMenu, isRemote: false };
}

export async function getTimeline() {
  const data = await getRemoteData();
  if (data?.timeline?.length > 0) return { data: data.timeline, isRemote: true };
  return { data: fallbackTimeline, isRemote: false };
}

export async function getMedia() {
  const data = await getRemoteData();
  if (data?.media?.length > 0) return { data: data.media, isRemote: true };
  return { data: fallbackMedia, isRemote: false };
}

export async function submitRSVP(formData) {
  if (!API_URL) {
    console.warn('[ODC] No API URL — RSVP not submitted remotely.');
    // In dev mode simulate success
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, _dev: true }), 1500)
    );
  }

  const response = await fetchWithTimeout(
    API_URL,
    {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'submitRSVP', ...formData }),
    },
    10000
  );

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
