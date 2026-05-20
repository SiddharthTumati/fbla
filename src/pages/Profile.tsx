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
import { ThemeSwitcher } from '@/components/ThemeSwitcher'

export function Profile() {
  const { user } = useAuth()
  const { config } = useTheme()
  const { data, loading, setDisplayName, resetDemo } = useData()
  const [name, setName] = useState('')

  if (loading || !data || !user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand-accent)] border-t-transparent" />
      </div>
    )
  }

  const { profile } = data
  const displayName = name || profile.displayName

  const handleSave = () => {
    if (!displayName.trim()) return
    setDisplayName(displayName.trim())
    toast.success('Display name updated')
  }

  const handleReset = () => {
    resetDemo()
    toast.success('Demo data reset to defaults')
  }

  const roleVariant =
    profile.role === 'admin' ? 'admin' : profile.role === 'officer' ? 'success' : 'secondary'

  return (
    <div className="themed-portal space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Profile</h1>
        <p className="text-slate-400 mt-1">Manage your account settings</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.photoURL} />
              <AvatarFallback className="text-2xl">{displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold text-slate-100">{profile.displayName}</h2>
              <p className="text-slate-400">{profile.email}</p>
              <Badge variant={roleVariant} className="mt-2 capitalize">{profile.role}</Badge>
              {user.isDemo && (
                <p className="text-xs text-amber-400 mt-2">Demo account — data stored in browser</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Display Name</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Name shown on leaderboard</Label>
            <Input
              value={name || profile.displayName}
              onChange={(e) => setName(e.target.value)}
              className="mt-2"
            />
          </div>
          <Button onClick={handleSave}>Save</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[var(--text-muted)]">FBLA National or Marvin Ridge Mavericks branding</p>
          <ThemeSwitcher variant="portal" />
          <img src={config.logo} alt={config.logoAlt} className="h-16 object-contain mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chapter</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{config.chapterName}</p>
          <p className="text-sm text-slate-500 mt-2">
            {profile.points} total points · {profile.achievements.length} achievements
          </p>
        </CardContent>
      </Card>

      {profile.role === 'admin' && (
        <Card className="border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-base text-amber-400">Admin Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 mb-4">
              Reset all chapter demo data and your profile to seeded defaults. Use before a presentation.
            </p>
            <Button variant="destructive" onClick={handleReset}>
              Reset Demo Data
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
