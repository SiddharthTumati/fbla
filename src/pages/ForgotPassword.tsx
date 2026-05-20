import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await resetPassword(email.trim())
      setSent(true)
      toast.success('Check your email for a reset link')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle={sent ? 'We sent a link if that email is registered.' : 'Enter your account email'}
      footer={
        <Link to="/login" className="font-semibold text-[var(--brand-accent)] hover:underline">
          Back to sign in
        </Link>
      }
    >
      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button type="submit" disabled={loading} className="pro-btn-primary w-full">
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      ) : (
        <p className="text-sm text-white/70">
          Open the link in your email to set a new password. The link returns you to{' '}
          <code className="text-white/90">/auth/reset-password</code>.
        </p>
      )}
    </AuthLayout>
  )
}
