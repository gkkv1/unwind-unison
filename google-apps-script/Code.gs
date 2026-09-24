/**
 * ============================================================
 * ODC PARTY — GOOGLE APPS SCRIPT BACKEND
 * ============================================================
 * Deploy this as a Web App in Google Apps Script.
 * 
 * Steps:
 * 1. Open: https://script.google.com
 * 2. Create a new project
 * 3. Paste this code
 * 4. Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL
 * 6. Set VITE_EVENT_API_URL in Vercel environment variables
 * ============================================================
 */

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; // Replace with your Sheet ID

// ---- Helper: Get sheet by name ----
function getSheet(name) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheetByName(name);
}

// ---- JSON Output Helper ----
function jsonOutput(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---- GET Handler ----
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'getAll';

    if (action === 'getAll') {
      const event = getEventConfig();
      const menu = getMenu();
      const timeline = getTimeline();
      const media = getMedia();

      return jsonOutput({ event, menu, timeline, media });
    }

    return jsonOutput({ error: 'Unknown action' });
  } catch (err) {
    return jsonOutput({ error: err.message });
  }
}

// ---- POST Handler ----
function doPost(e) {
  try {
    const contents = e && e.postData && e.postData.contents;
    const body = contents ? JSON.parse(contents) : {};
    const action = body.action || 'submitRSVP';

    if (action === 'submitRSVP') {
      return jsonOutput(submitRSVP(body));
    }

    return jsonOutput({ success: false, message: 'Unknown action' });
  } catch (err) {
    return jsonOutput({ success: false, message: err.message });
  }
}

// ---- Read EventConfig sheet ----
function getEventConfig() {
  const sheet = getSheet('EventConfig');
  if (!sheet) return {};

  const data = sheet.getDataRange().getValues();
  const config = {};

  for (let i = 1; i < data.length; i++) {
    const key = data[i][0];
    const value = data[i][1];
    if (key) config[key] = value;
  }

  return config;
}

// ---- Read Menu sheet ----
function getMenu() {
  const sheet = getSheet('Menu');
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = [];

  for (let i = 1; i < data.length; i++) {
    const row = {};
    headers.forEach((h, idx) => { row[h] = data[i][idx]; });
    if (row.enabled === true || row.enabled === 'TRUE' || row.enabled === '') {
      rows.push(row);
    }
  }

  return rows.sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));
}

// ---- Read Timeline sheet ----
function getTimeline() {
  const sheet = getSheet('Timeline');
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = [];

  for (let i = 1; i < data.length; i++) {
    const row = {};
    headers.forEach((h, idx) => { row[h] = data[i][idx]; });
    if (row.enabled === true || row.enabled === 'TRUE' || row.enabled === '') {
      rows.push(row);
    }
  }

  return rows.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
}

// ---- Read Media sheet ----
function getMedia() {
  const sheet = getSheet('Media');
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = [];

  for (let i = 1; i < data.length; i++) {
    const row = {};
    headers.forEach((h, idx) => { row[h] = data[i][idx]; });
    if (row.enabled === true || row.enabled === 'TRUE' || row.enabled === '') {
      rows.push(row);
    }
  }

  return rows.sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));
}

// ---- Submit RSVP ----
function submitRSVP(data) {
  const sheet = getSheet('RSVP');
  if (!sheet) return { success: false, message: 'RSVP sheet not found' };

  const timestamp = new Date().toISOString();

  sheet.appendRow([
    timestamp,
    data.name || '',
    data.contact || '',
  ]);

  return { success: true };
}
