import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSupabase } from '@/lib/supabase'

export function AuthCallback() {
  const navigate = useNavigate()
  const sb = getSupabase()

  useEffect(() => {
    if (!sb) {
      navigate('/', { replace: true })
      return
    }

    const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/dashboard', { replace: true })
      }
    })

    sb.auth.getSession().then(({ data: { session }, error }) => {
      if (error || !session) {
        navigate('/', { replace: true })
        return
      }
      navigate('/dashboard', { replace: true })
    })

    return () => subscription.unsubscribe()
  }, [navigate, sb])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--surface-base)]">
      <div className="portal-spinner" aria-hidden />
      <p className="text-sm text-[var(--text-muted)]">Completing sign in…</p>
    </div>
  )
}
