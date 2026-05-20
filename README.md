# FBLA Member Portal

A polished React web app for FBLA chapter information management — member dashboard, event registration, competition tracking, leaderboards, and achievements.

**Live demo:** Deploy to Vercel (see below) and add your URL here for judges.

## Homepage (`/`)

Full-screen cinematic photo collage hero with cross-fade transitions, headline, and a single **Enter Portal** CTA. Signed-in users return via **Landing Page** in the portal sidebar.

## Themes (saved in browser)

| Theme | Hero headline | Colors | Fonts |
|-------|---------------|--------|-------|
| **FBLA National** | Make · *Your* · Mark | Navy, gold | Oswald + Inter |
| **Marvin Ridge** | Lead · *Your* · Chapter | Royal blue, orange | Barlow Condensed + Inter |

Toggle **FBLA / Marvin Ridge** in the portal sidebar or **Profile → Appearance**.

## Portal UI

Dashboard, Events, Competitions, Achievements, and Profile share a glass-card layout with brand gradients, display typography, and accent tabs — matched to the landing page aesthetic.

## Features

- **Member dashboard** — live stats from your profile, points chart, activity feed
- **Event registration** — one-click signup with points (+50, early bird +25)
- **Competition tracker** — enter events, record placements, chapter leaderboard
- **Achievements** — 15 unlockable badges with progress bars
- **Google SSO** — Firebase Auth with officer/admin roles via env emails
- **localStorage persistence** — member profile per account; chapter events/leaderboard per **browser tab session** (so judges don’t overwrite each other in demo booths)
- **Demo mode** — works without Firebase for local previews (Member / Officer / Admin). Demo roles are for presentation only, not real security.

## Quick Start

```bash
npm install
cp .env.example .env   # add Firebase + your admin email
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

Without Firebase configured, use **Enter Portal** on the landing page (demo member sign-in).

## Firebase Setup (~15 min)

1. [Firebase Console](https://console.firebase.google.com) → Create project
2. **Authentication** → Sign-in method → Enable **Google**
3. **Project settings** → Your apps → Web app → Copy config into `.env`
4. **Authentication** → Settings → Authorized domains → Add `localhost` and your Vercel domain (`*.vercel.app`)
5. Set `VITE_ADMIN_EMAILS` to your Google email for admin tools

## Deploy to Vercel

1. Push this repo to GitHub
2. [vercel.com](https://vercel.com) → Import project
3. Framework preset: **Vite**
4. Add all variables from `.env.example` in **Environment Variables**
5. Deploy → copy your `https://*.vercel.app` URL into this README

Add the Vercel domain to Firebase authorized domains before sharing with judges.

## Demo Script (for judges)

1. Open your live URL (or localhost) → view the collage hero, switch themes in the portal
2. **Enter Portal** (or Sign in with Google)
3. **Dashboard** — note rank, points, and activity feed
4. **Events** → Register for **State Leadership Conference** → +50 points, achievements may unlock
5. **Competitions** → Enter an event, set placement → leaderboard updates with your name
6. **Achievements** — view unlocked badges and point rules
7. **Landing Page** in the sidebar to show the homepage again
8. **Profile** — (admin only) Reset demo data before your presentation

## Tech Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- Firebase Auth (Google)
- localStorage (per-user profile + per-tab-session chapter state)
- Recharts, Radix UI, Sonner

## Project Structure

```
src/
  pages/          HomePage, Dashboard, Events, Competitions, Achievements, Profile
  contexts/       AuthProvider, DataProvider, ThemeProvider
  hooks/          useAuth, useData, useTheme
  lib/            firebase, storage, points, demo-session, themes
  data/seed.ts    Chapter seed data
  components/     layout, HeroCollage, dashboard, branding, ui
  lib/collage.ts  Hero collage image paths
public/branding/  Logos + collage/ (chapter photos)
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_*` | Firebase web app config |
| `VITE_ADMIN_EMAILS` | Comma-separated admin emails |
| `VITE_OFFICER_EMAILS` | Comma-separated officer emails |
| `VITE_CHAPTER_NAME` | Chapter name on landing + sidebar |

## Quality checks

```bash
npm run build
npm run lint
```

Both should pass before sharing with judges.
