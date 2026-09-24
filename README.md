# 🎉 UNWIND UNISON — Interactive Night Experience

A cinematic, premium React web experience for the UNWIND UNISON Annual Party.

## Tech Stack

- **React + Vite** — Fast modern frontend
- **GSAP + ScrollTrigger** — Cinematic scroll animations
- **Lenis** — Ultra-smooth scroll
- **React Three Fiber + Drei** — 3D hero scene
- **SCSS** — Modular design system
- **Google Sheets + Apps Script** — Zero-backend CMS

## Getting Started

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Environment Variables

```bash
cp .env.example .env.local
# Then add: VITE_EVENT_API_URL=https://script.google.com/macros/s/YOUR_ID/exec
```

> Without this, the app uses fallback demo data (great for development).

## Deploying to Vercel

1. Push to GitHub
2. Import at [vercel.com](https://vercel.com)
3. Add env variable: `VITE_EVENT_API_URL`
4. Deploy — no server config needed.

## Content Management

See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for the full guide on managing all event content via Google Sheets — no code changes required.
