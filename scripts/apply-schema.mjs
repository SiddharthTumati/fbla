import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

function loadEnvFile() {
  for (const name of ['.env.local', '.env']) {
    const file = path.join(root, name)
    if (!fs.existsSync(file)) continue
    const text = fs.readFileSync(file, 'utf8')
    for (const line of text.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
      if (!process.env[key]) process.env[key] = value
    }
  }
}

loadEnvFile()

const urls = [
  process.env.DATABASE_URL,
  process.env.DATABASE_POOLER_URL,
].filter(Boolean)

if (urls.length === 0) {
  console.error('Missing DATABASE_URL in .env or .env.local')
  process.exit(1)
}

const sql = fs.readFileSync(path.join(root, 'supabase/schema.sql'), 'utf8')

async function tryUrl(connectionString) {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  })
  await client.connect()
  await client.query(sql)
  await client.end()
}

for (const url of urls) {
  try {
    console.log('Applying schema…')
    await tryUrl(url)
    console.log('Schema applied successfully.')
    process.exit(0)
  } catch (err) {
    console.warn(`Connection failed: ${err instanceof Error ? err.message : err}`)
  }
}

console.error('Could not apply schema. Check DATABASE_URL / pooler URL and network.')
process.exit(1)
