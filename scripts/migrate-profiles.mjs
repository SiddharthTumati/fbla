/**
 * One-time: copy legacy profiles.payload → member_profiles (where auth user exists).
 * Run: npm run db:migrate-profiles
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

function loadEnv() {
  for (const name of ['.env.local', '.env']) {
    const file = path.join(root, name)
    if (!fs.existsSync(file)) continue
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      const t = line.trim()
      if (!t || t.startsWith('#')) continue
      const eq = t.indexOf('=')
      if (eq === -1) continue
      const key = t.slice(0, eq).trim()
      const value = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
      if (!process.env[key]) process.env[key] = value
    }
  }
}

loadEnv()

const url = process.env.DATABASE_URL
if (!url) {
  console.error('Set DATABASE_URL in .env.local')
  process.exit(1)
}

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await client.connect()

const { rows: legacy } = await client.query('select uid, payload from public.profiles')
let migrated = 0

for (const { uid, payload } of legacy) {
  const p = typeof payload === 'string' ? JSON.parse(payload) : payload
  const isUuid = /^[0-9a-f-]{36}$/i.test(uid)
  if (!isUuid) continue

  const { rows: authRows } = await client.query('select 1 from auth.users where id = $1::uuid', [uid])
  if (authRows.length === 0) continue

  await client.query(
    `insert into public.member_profiles (
      id, display_name, email, role, photo_url, points, competition_points,
      achievements, registered_event_ids, entered_competition_ids,
      competition_placements, points_history
    ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    on conflict (id) do update set
      display_name = excluded.display_name,
      points = excluded.points,
      competition_points = excluded.competition_points,
      achievements = excluded.achievements,
      registered_event_ids = excluded.registered_event_ids,
      entered_competition_ids = excluded.entered_competition_ids,
      competition_placements = excluded.competition_placements,
      points_history = excluded.points_history,
      updated_at = now()`,
    [
      uid,
      p.displayName ?? 'Member',
      p.email ?? '',
      p.role ?? 'member',
      p.photoURL ?? null,
      p.points ?? 0,
      p.competitionPoints ?? 0,
      JSON.stringify(p.achievements ?? []),
      JSON.stringify(p.registeredEventIds ?? []),
      JSON.stringify(p.enteredCompetitionIds ?? []),
      JSON.stringify(p.competitionPlacements ?? {}),
      JSON.stringify(p.pointsHistory ?? []),
    ],
  )
  migrated++
}

console.log(`Migrated ${migrated} profile(s) to member_profiles.`)
await client.end()
