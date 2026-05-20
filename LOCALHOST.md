# Localhost setup (Supabase accounts)

## Already done for this project

- Database: `chapters`, `member_profiles`, auth bootstrap trigger (see `supabase/schema.sql`)
- Google provider + redirect URLs in Supabase
- App routes: `/login`, `/signup`, `/forgot-password`, `/auth/callback`, `/auth/reset-password`

## One-time: add your anon key

**Option A — Browser (fastest)**

1. `npm run dev`
2. Open http://localhost:5173/dev/setup
3. Paste **anon public** key from [Supabase API settings](https://supabase.com/dashboard/project/cttncecgjgxrttvwqmuq/settings/api)
4. Click **Save & go to app**

**Option B — `.env.local`**

```bash
VITE_SUPABASE_URL=https://cttncecgjgxrttvwqmuq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key...
VITE_ENABLE_DEMO=true
```

Restart `npm run dev`.

## Supabase Dashboard (auth)

1. [Auth → Providers](https://supabase.com/dashboard/project/cttncecgjgxrttvwqmuq/auth/providers) — enable **Email** and **Google**
2. [URL configuration](https://supabase.com/dashboard/project/cttncecgjgxrttvwqmuq/auth/url-configuration):
   - Site URL: `http://localhost:5173`
   - Redirect URLs: `http://localhost:5173/auth/callback`, `http://localhost:5173/auth/reset-password`

For faster local dev, you can disable **Confirm email** under Email provider settings.

## Test flows

### Email account

1. http://localhost:5173 → **Create account**
2. Register → **Dashboard**
3. **Profile** → change display name; **Change password** if signed up with email
4. Sign out → **Sign in** with same email

### Google

1. **Sign in** → **Continue with Google**
2. Redirect → `/auth/callback` → **Dashboard**
3. **Profile** → Data storage: **Supabase**

### Forgot password

1. `/forgot-password` → enter email
2. Open reset link from email → `/auth/reset-password` → set new password

### Demo (judges)

1. Landing page → **Enter Portal** or Officer / Admin demo buttons
2. Data stays in browser (`localStorage`); no Supabase account required

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run db:schema` | Apply `supabase/schema.sql` |
| `npm run db:migrate-profiles` | Copy legacy JSON `profiles` → `member_profiles` |
| `npm run setup:localhost` | Schema + env checks |
| `npm run verify:localhost` | Test anon key + tables |

## Redirect URLs (localhost)

- Supabase: `http://localhost:5173/auth/callback`, `http://localhost:5173/auth/reset-password`
- Google Cloud: `https://cttncecgjgxrttvwqmuq.supabase.co/auth/v1/callback`
