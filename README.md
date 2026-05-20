# FBLA Member Portal

A production-quality React web app for FBLA chapter information management — member dashboard, event registration, competition tracking, leaderboards, and achievements.

**Live demo:** Deploy to Vercel (see below) and share your URL with judges.

## Features

- **Member dashboard** — real-time stats, points chart, activity feed
- **Event registration** — one-click signup with points (+50, early bird +25)
- **Competition tracker** — enter events, record placements, chapter leaderboard
- **Achievements** — 15 unlockable badges with progress bars
- **Google SSO** — Firebase Auth with officer/admin roles via env emails
- **localStorage persistence** — data stays on the judge’s device per account
- **Demo mode** — works without Firebase for local previews (Member / Officer / Admin)

## Quick Start

```bash
npm install
cp .env.example .env   # add Firebase + your admin email
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

Without Firebase configured, use **Try Demo** on the landing page.

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
5. Deploy → copy your `https://*.vercel.app` URL

Add the Vercel domain to Firebase authorized domains before sharing with judges.

## Demo Script (for judges)

1. Open your live URL → **Sign in with Google** (or Try Demo)
2. **Dashboard** — note rank, points, and activity feed
3. **Events** → Register for **State Leadership Conference** → +50 points, achievements may unlock
4. **Competitions** → Enter an event, set placement → leaderboard updates with your name
5. **Achievements** — view unlocked badges and point rules
6. **Profile** — (admin only) Reset demo data before your presentation

## Tech Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- Firebase Auth (Google)
- localStorage (per-user + shared chapter state)
- Recharts, Radix UI, Sonner

## Project Structure

```
src/
  pages/          Landing, Dashboard, Events, Competitions, Achievements, Profile
  contexts/       AuthContext, DataContext
  lib/            firebase, storage, points
  data/seed.ts    Chapter seed data
  components/     layout, dashboard, events, ui
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_*` | Firebase web app config |
| `VITE_ADMIN_EMAILS` | Comma-separated admin emails |
| `VITE_OFFICER_EMAILS` | Comma-separated officer emails |
| `VITE_CHAPTER_NAME` | Chapter name on landing + sidebar |
