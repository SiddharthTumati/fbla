import { useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { useData } from '@/hooks/useData'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTheme } from '@/hooks/useTheme'
import { PageHeader } from '@/components/layout/PageHeader'
import { PortalPage } from '@/components/layout/PortalPage'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'

export function Profile() {
  const { user, canChangePassword, updatePassword } = useAuth()
  const { config } = useTheme()
  const { data, loading, storageBackend, setDisplayName, resetDemo } = useData()
  const [name, setName] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  if (loading || !data || !user) return <PortalPage loading />

  const { profile } = data
  const displayName = name || profile.displayName

  const handleSave = () => {
    if (!displayName.trim()) return
    setDisplayName(displayName.trim())
    toast.success('Display name updated')
  }

  const handlePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setPasswordLoading(true)
    try {
      await updatePassword(newPassword)
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Password updated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not update password')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleReset = () => {
    resetDemo()
    toast.success('Demo data reset to defaults')
  }

  const roleVariant =
    profile.role === 'admin' ? 'admin' : profile.role === 'officer' ? 'success' : 'secondary'

  return (
    <PortalPage>
      <PageHeader title="Profile" description="Manage your account, appearance, and chapter data." />

      <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
              <Avatar className="h-20 w-20 border-2 border-[var(--border-default)]">
                <AvatarImage src={user.photoURL} />
                <AvatarFallback className="text-2xl">{displayName[0]}</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h2
                  className="text-xl font-bold text-[var(--text-primary)]"
                  style={{ fontFamily: config.fonts.display }}
                >
                  {profile.displayName}
                </h2>
                <p className="text-[var(--text-muted)]">{profile.email}</p>
                <Badge variant={roleVariant} className="mt-2 capitalize">
                  {profile.role}
                </Badge>
                {user.isDemo && (
                  <p className="mt-2 text-xs text-amber-400/90">Demo account — data stored in this browser</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input value={user.email} readOnly className="mt-2 opacity-80" />
            </div>
            <div>
              <Label>Name shown on leaderboard</Label>
              <Input
                value={name || profile.displayName}
                onChange={(e) => setName(e.target.value)}
                className="mt-2"
              />
            </div>
            <Button onClick={handleSave}>Save display name</Button>
          </CardContent>
        </Card>

        {canChangePassword && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Change password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2"
                />
              </div>
              <Button onClick={handlePassword} disabled={passwordLoading}>
                {passwordLoading ? 'Updating…' : 'Update password'}
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[var(--text-muted)]">FBLA National or Marvin Ridge Mavericks branding</p>
            <ThemeSwitcher variant="portal" />
            <img src={config.logo} alt={config.logoAlt} className="mt-2 h-14 object-contain" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Chapter</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-[var(--text-primary)]">{config.chapterName}</p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {profile.points.toLocaleString()} total points · {profile.achievements.length} achievements
            </p>
            <p className="mt-3 text-xs text-[var(--text-muted)]">
              Data storage:{' '}
              <span className="font-medium text-[var(--brand-accent)]">
                {storageBackend === 'supabase' ? 'Supabase' : 'Browser (localStorage)'}
              </span>
            </p>
          </CardContent>
        </Card>

        {user.isDemo && profile.role === 'admin' && (
          <Card className="border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-base text-amber-400">Admin Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-[var(--text-muted)]">
                Reset all chapter demo data and your profile to seeded defaults. Use before a presentation.
              </p>
              <Button variant="destructive" onClick={handleReset}>
                Reset Demo Data
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PortalPage>
  )
}
