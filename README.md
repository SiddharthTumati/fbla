# FBLA Member Portal

A polished React web app for FBLA chapter information management — member dashboard, event registration, competition tracking, leaderboards, and achievements.

**Live demo:** Deploy to Vercel (see below) and add your URL here for judges.

## Homepage (`/`)

Full-screen cinematic photo collage hero with cross-fade transitions, headline, and account CTAs (**Sign in**, **Create account**, **Google**). Judges can use **demo mode** when `VITE_ENABLE_DEMO=true`. Signed-in users return via **Landing Page** in the portal sidebar.

## Auth routes

| Route | Purpose |
|-------|---------|
| `/login` | Email sign-in + Google |
| `/signup` | Register with email/password |
| `/forgot-password` | Request password reset email |
| `/auth/callback` | Google OAuth return |
| `/auth/reset-password` | Set new password from email link |

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
- **Supabase Auth** — Google OAuth + email/password (sign up, sign in, forgot password)
- **Persistence** — `localStorage` for demo; **Supabase Postgres** (`member_profiles` + shared `chapters` row) for real accounts
- **Demo mode** — Member / Officer / Admin without Supabase (`VITE_ENABLE_DEMO`, default on for judges)

## Quick Start

```bash
npm install
cp .env.example .env.local   # add Supabase anon key + admin email
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Sign in** or **Create account** when Supabase is configured. Otherwise use demo roles on the landing page.

See [LOCALHOST.md](LOCALHOST.md) for Google OAuth and anon key setup.

## Supabase Setup (~10 min)

Project: [cttncecgjgxrttvwqmuq](https://supabase.com/dashboard/project/cttncecgjgxrttvwqmuq)

1. **SQL** → run [`supabase/schema.sql`](supabase/schema.sql) (or `npm run db:schema`)
2. **Auth → Providers** → enable **Email** and **Google**
3. **Auth → URL configuration** → Site URL `http://localhost:5173`; redirect URLs:
   - `http://localhost:5173/auth/callback`
   - `http://localhost:5173/auth/reset-password`
4. **Settings → API** → copy **Project URL** and **anon public** key into `.env.local`:
   - `VITE_SUPABASE_URL=https://cttncecgjgxrttvwqmuq.supabase.co`
   - `VITE_SUPABASE_ANON_KEY=...`
5. Restart `npm run dev`

**Postgres connection string** (`DATABASE_URL`) is for migrations and scripts only — never in `VITE_*` vars.

Optional: `npm run db:migrate-profiles` to copy legacy `profiles.payload` JSON into `member_profiles`.

## Deploy to Vercel

1. Push this repo to GitHub
2. [vercel.com](https://vercel.com) → Import project
3. Framework preset: **Vite**
4. Add variables from `.env.example` in **Environment Variables** (include production redirect URLs in Supabase)
5. Deploy → copy your `https://*.vercel.app` URL into this README

Add your Vercel domain to Supabase redirect URLs before sharing with judges.

## Demo Script (for judges)

1. Open your live URL (or localhost) → view the collage hero
2. **Sign in** / **Create account** / **Google** — or **Enter Portal** (demo)
3. **Dashboard** — note rank, points, and activity feed
4. **Events** → Register for **State Leadership Conference** → +50 points
5. **Competitions** → Enter an event, set placement → leaderboard updates
6. **Achievements** — view unlocked badges
7. **Profile** — change display name; email users can change password
8. **Landing Page** in the sidebar to return home

## Tech Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- Supabase Auth + Postgres
- localStorage (demo only)
- Recharts, Radix UI, Sonner

## Project Structure

```
src/
  pages/          HomePage, Login, Signup, Dashboard, Events, Profile, …
  contexts/       AuthProvider, DataProvider, ThemeProvider
  hooks/          useAuth, useData, useTheme
  lib/            auth, supabase-store, data-store, member-profile, themes
  components/auth AuthLayout (login/signup/forgot UI)
  supabase/       schema.sql, migrations/
public/branding/  Logos + collage/ (chapter photos)
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon public key |
| `VITE_ENABLE_DEMO` | `true` (default) to show demo roles on landing |
| `VITE_ADMIN_EMAILS` | Comma-separated admin emails |
| `VITE_OFFICER_EMAILS` | Comma-separated officer emails |
| `VITE_CHAPTER_NAME` | Chapter name on landing + sidebar |
| `DATABASE_URL` | Postgres URL for SQL tools only (not bundled in the app) |

## Quality checks

```bash
npm run build
npm run lint
```

Both should pass before sharing with judges.
