import type { AuthChangeEvent, Session, User as SupabaseUser } from '@supabase/supabase-js'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'

export function isAuthConfigured(): boolean {
  return isSupabaseConfigured()
}

export function authRedirectBase(): string {
  return typeof window !== 'undefined' ? window.location.origin : ''
}

export function authCallbackUrl(): string {
  return `${authRedirectBase()}/auth/callback`
}

export function resetPasswordRedirectUrl(): string {
  return `${authRedirectBase()}/auth/reset-password`
}

export function mapAuthUser(user: SupabaseUser) {
  return {
    uid: user.id,
    email: user.email ?? '',
    displayName:
      (user.user_metadata?.display_name as string | undefined) ??
      (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      user.email?.split('@')[0] ??
      'Member',
    photoURL:
      (user.user_metadata?.avatar_url as string | undefined) ??
      (user.user_metadata?.picture as string | undefined),
    provider: user.app_metadata?.provider as string | undefined,
  }
}

export function isEmailProvider(user: SupabaseUser | null): boolean {
  if (!user) return false
  const provider = user.app_metadata?.provider as string | undefined
  return provider === 'email' || !provider
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
): Promise<Session | null> {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase is not configured')
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo: authCallbackUrl(),
    },
  })
  if (error) throw error
  return data.session
}

export async function signInWithEmail(email: string, password: string): Promise<Session | null> {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase is not configured')
  const { data, error } = await sb.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.session
}

export async function signInWithGoogle(): Promise<void> {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase is not configured')
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: authCallbackUrl(),
      queryParams: { prompt: 'select_account' },
    },
  })
  if (error) throw error
}

export async function signOut(): Promise<void> {
  const sb = getSupabase()
  if (sb) await sb.auth.signOut()
}

export async function resetPasswordForEmail(email: string): Promise<void> {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase is not configured')
  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: resetPasswordRedirectUrl(),
  })
  if (error) throw error
}

export async function updatePassword(newPassword: string): Promise<void> {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase is not configured')
  const { error } = await sb.auth.updateUser({ password: newPassword })
  if (error) throw error
}

export async function getSession(): Promise<Session | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb.auth.getSession()
  if (error) throw error
  return data.session
}

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
): () => void {
  const sb = getSupabase()
  if (!sb) return () => {}
  const { data } = sb.auth.onAuthStateChange(callback)
  return () => data.subscription.unsubscribe()
}
