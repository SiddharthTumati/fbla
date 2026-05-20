import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_PROJECT_URL } from '@/lib/supabase'
import { toast } from 'sonner'

const LOCAL_ANON_KEY = 'fbla:supabase-anon'

export function DevSetup() {
  const navigate = useNavigate()
  const [anonKey, setAnonKey] = useState(() => localStorage.getItem(LOCAL_ANON_KEY) ?? '')
  const [testing, setTesting] = useState(false)

  const saveAndTest = async () => {
    const key = anonKey.trim()
    if (!key.startsWith('eyJ')) {
      toast.error('Paste the full anon public key (starts with eyJ)')
      return
    }
    setTesting(true)
    try {
      const sb = createClient(SUPABASE_PROJECT_URL, key)
      const { error } = await sb.from('chapters').select('session_id').limit(1)
      if (error) throw error
      localStorage.setItem(LOCAL_ANON_KEY, key)
      toast.success('Saved — reload and use Sign in with Google')
      navigate('/', { replace: true })
      window.location.reload()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Connection failed')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#060b18] px-6 text-white">
      <div className="portal-card w-full max-w-lg p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-accent)]">
          Localhost setup
        </p>
        <h1 className="mt-2 text-2xl font-bold">Connect Supabase</h1>
        <p className="mt-3 text-sm text-white/60">
          Paste your <strong>anon public</strong> key from{' '}
          <a
            href="https://supabase.com/dashboard/project/cttncecgjgxrttvwqmuq/settings/api"
            target="_blank"
            rel="noreferrer"
            className="text-[var(--brand-accent)] underline"
          >
            Supabase → Settings → API
          </a>
          . Saved only in this browser.
        </p>
        <textarea
          className="mt-4 w-full rounded-lg border border-white/15 bg-black/30 p-3 font-mono text-xs text-white"
          rows={4}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          value={anonKey}
          onChange={(e) => setAnonKey(e.target.value)}
        />
        <button
          type="button"
          onClick={saveAndTest}
          disabled={testing}
          className="pro-btn-primary mt-4 w-full"
        >
          {testing ? 'Testing…' : 'Save & go to app'}
        </button>
        <p className="mt-4 text-center text-xs text-white/40">
          <Link to="/" className="hover:text-white/70">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
