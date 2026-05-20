import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const envLocal = path.join(root, '.env.local')
const envFile = path.join(root, '.env')

const template = `# Localhost only (gitignored) — Supabase + Google OAuth
VITE_SUPABASE_URL=https://cttncecgjgxrttvwqmuq.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Postgres — for npm run db:schema (not used in the browser)
DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@db.cttncecgjgxrttvwqmuq.supabase.co:5432/postgres
DATABASE_POOLER_URL=postgresql://postgres.cttncecgjgxrttvwqmuq:YOUR_DB_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres

VITE_CHAPTER_NAME=Marvin Ridge High School FBLA
VITE_ADMIN_EMAILS=
VITE_OFFICER_EMAILS=

# Firebase disabled for localhost (Supabase Google sign-in)
VITE_FIREBASE_API_KEY=
`

function ensureEnv() {
  if (!fs.existsSync(envLocal) && !fs.existsSync(envFile)) {
    fs.writeFileSync(envLocal, template)
    console.log('Created .env.local — paste your anon key and DB password.')
  }
}

function loadEnv() {
  for (const file of [envLocal, envFile]) {
    if (!fs.existsSync(file)) continue
    const text = fs.readFileSync(file, 'utf8')
    for (const line of text.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const value = trimmed.slice(eq + 1).trim()
      if (!process.env[key]) process.env[key] = value
    }
  }
}

ensureEnv()
loadEnv()

const anon = process.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''
const hasAnon = anon && anon !== 'your-anon-key'

console.log('\n=== FBLA localhost setup ===\n')

const schema = spawnSync('node', ['scripts/apply-schema.mjs'], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
})

if (schema.status !== 0) {
  console.log('\nSchema step failed. Edit .env.local DATABASE_URL (use pooler if IPv4 issues).')
  process.exit(schema.status ?? 1)
}

if (!hasAnon) {
  console.log('\n⚠️  Paste VITE_SUPABASE_ANON_KEY into .env.local')
  console.log('   https://supabase.com/dashboard/project/cttncecgjgxrttvwqmuq/settings/api')
  console.log('   Copy the anon public key, then: npm run dev\n')
  process.exit(0)
}

console.log('\n✓ Schema ready')
console.log('✓ Supabase anon key present')
console.log('\nGoogle OAuth redirect (already in Supabase): http://localhost:5173/auth/callback')
console.log('\nRun: npm run dev')
console.log('Then: http://localhost:5173 → Sign in with Google\n')
