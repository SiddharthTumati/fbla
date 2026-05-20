import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const LOCAL_ANON_KEY = 'fbla:supabase-anon'

function resolveAnonKey(): string | undefined {
  const fromEnv = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  if (fromEnv?.trim() && fromEnv !== 'your-anon-key') return fromEnv.trim()
  if (import.meta.env.DEV && typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(LOCAL_ANON_KEY)
    if (stored?.trim()) return stored.trim()
  }
  return undefined
}

function resolveUrl(): string | undefined {
  const fromEnv = import.meta.env.VITE_SUPABASE_URL as string | undefined
  if (fromEnv?.trim() && !fromEnv.includes('your-project')) return fromEnv.trim()
  if (import.meta.env.DEV) return SUPABASE_PROJECT_URL
  return undefined
}

const url = resolveUrl()
const anonKey = resolveAnonKey()

/** Default project URL from your Postgres host (Settings → API has the same ref). */
export const SUPABASE_PROJECT_URL = 'https://cttncecgjgxrttvwqmuq.supabase.co'

let client: SupabaseClient | null = null

export function isSupabaseConfigured(): boolean {
  const resolvedUrl = url?.trim() || ''
  const key = anonKey?.trim() || ''
  return Boolean(
    resolvedUrl &&
      key &&
      key !== 'your-anon-key' &&
      !resolvedUrl.includes('your-project'),
  )
}

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null
  if (!client) {
    client = createClient(url!.trim(), anonKey!.trim(), {
      auth: {
        detectSessionInUrl: true,
        flowType: 'pkce',
        persistSession: true,
      },
    })
  }
  return client
}
