import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function Signup() {
  const { signUp, signInGoogle, authConfigured } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await signUp(email.trim(), password, displayName.trim())
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try {
      await signInGoogle()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Google sign up failed')
      setGoogleLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join your FBLA chapter portal"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[var(--brand-accent)] hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      {authConfigured && (
        <>
          <GoogleSignInButton onClick={handleGoogle} loading={googleLoading} className="w-full max-w-none" />
          <div className="my-6 flex items-center gap-3 text-xs text-white/45">
            <span className="h-px flex-1 bg-white/15" />
            or with email
            <span className="h-px flex-1 bg-white/15" />
          </div>
        </>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Display name</Label>
          <Input
            id="name"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2"
          />
        </div>
        <button type="submit" disabled={loading} className="pro-btn-primary w-full">
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}
