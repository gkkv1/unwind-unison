# 🎉 UNWIND UNISON 2.0 — ADMIN SETUP GUIDE

This guide explains how to manage the event without touching any code.

---

## Architecture Overview

```
Google Sheet (CMS)  ←→  Google Apps Script (API)  ←→  React App (Vercel)
```

- You edit content in **Google Sheets**
- The React app reads it via **Google Apps Script**
- No code changes needed to update content
- Reload the website to see new changes

---

## STEP 1: Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new spreadsheet
3. Copy the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[YOUR_SHEET_ID]/edit
   ```
4. Create the following sheets (tabs):

---

### Sheet 1: `EventConfig`

| key | value |
|-----|-------|
| eventName | UNWIND UNISON |
| eventDate | 15 December 2026 |
| eventDay | Saturday |
| startTime | 7:00 PM |
| endTime | 11:00 PM |
| venueName | The Grand Ballroom |
| venueAddress | 123 Event Street, Building 4 |
| location | Hyderabad, India |
| mapsUrl | https://maps.google.com/?q=... |
| price | 500 |
| dressCode | Smart Casual |
| tagline | One Night. One Crew. Unwind in Unison. |
| heroTitle | UNWIND UNISON |
| heroSubtitle | ONE NIGHT. ONE CREW. UNWIND IN UNISON. |
| registrationEnabled | TRUE |
| lastUpdated | (auto-updated) |

---

### Sheet 2: `Menu`

| id | category | subCategory | name | description | type | enabled | sortOrder |
|----|----------|-------------|------|-------------|------|---------|-----------|
| v1 | veg | Starters | Paneer Tikka | Marinated cottage cheese | food | TRUE | 1 |
| nv1 | nonVeg | Starters | Chicken Tikka | Tandoor chicken | food | TRUE | 1 |
| d1 | drinks | Cocktails | Purple Rain | Vodka, elderflower | alcoholic | TRUE | 1 |
| d5 | drinks | Mocktails | Berry Bliss | Mixed berries, mint | nonAlcoholic | TRUE | 5 |

**category values:** `veg` | `nonVeg` | `drinks`  
**type values:** `food` | `alcoholic` | `nonAlcoholic`

---

### Sheet 3: `Timeline`

| order | time | title | description | enabled |
|-------|------|-------|-------------|---------|
| 1 | 7:00 PM | Doors Open | Welcome to the night | TRUE |
| 2 | 7:30 PM | Welcome Toast | The team comes together | TRUE |
| 3 | 8:00 PM | Dinner Service | Curated menu | TRUE |

---

### Sheet 4: `Media`

| id | type | url | caption | year | enabled | sortOrder |
|----|------|-----|---------|------|---------|-----------|
| m1 | image | https://... | Last year's energy | 2025 | TRUE | 1 |
| m2 | video | https://... | Dance floor | 2025 | TRUE | 2 |

**type values:** `image` | `video`

---

### Sheet 5: `RSVP`

**Leave this sheet empty with only these headers (row 1):**

| timestamp | name | contact |

RSVP submissions will be automatically appended here.

---

## STEP 2: Set Up Google Apps Script

1. Open your Google Sheet
2. Click **Extensions → Apps Script**
3. Delete any existing code
4. Paste the contents of `google-apps-script/Code.gs`
5. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Sheet ID
6. Click **Save** (💾)

---

## STEP 3: Deploy the Script

1. Click **Deploy → New Deployment**
2. Click the gear icon → **Web App**
3. Set:
   - **Description:** UNWIND UNISON API
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. **Authorize** the script when prompted
6. **Copy the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```

---

## STEP 4: Configure Vercel

1. Go to your Vercel project
2. **Settings → Environment Variables**
3. Add:
   ```
   VITE_EVENT_API_URL = https://script.google.com/macros/s/YOUR_ID/exec
   ```
4. **Redeploy** the project

---

## How to Change Content (No Code Needed!)

### Change event name / date / venue:
→ Google Sheet → `EventConfig` tab → edit the value → Save

### Add / remove menu items:
→ Google Sheet → `Menu` tab → edit rows → set `enabled = FALSE` to hide

### Change timeline:
→ Google Sheet → `Timeline` tab → edit / reorder rows

### Add media (photos/videos):
→ Google Sheet → `Media` tab → add a new row with the image/video URL

### Disable RSVP:
→ Google Sheet → `EventConfig` → `registrationEnabled` → change to `FALSE`

### View RSVPs:
→ Google Sheet → `RSVP` tab → all submissions appear here

---

## After Making Changes

The website will pick up new data the **next time someone loads the page**.

If you need instant refresh:
1. Go to the Vercel dashboard
2. Click **Redeploy** (uses cached build — fast)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Website shows placeholder data | Check that `VITE_EVENT_API_URL` is set in Vercel |
| RSVP not saving | Re-deploy the Apps Script as a new version |
| Images not showing | Ensure image URLs are publicly accessible |
| Menu not updating | Check that `enabled = TRUE` in the Menu sheet |

---

## Security Notes

- The Google Sheet URL is not exposed in the frontend
- The Apps Script URL only accepts GET (read config) and POST (submit RSVP)
- No sensitive credentials are stored in the React code
- The RSVP sheet is only accessible by the Google Sheet owner
