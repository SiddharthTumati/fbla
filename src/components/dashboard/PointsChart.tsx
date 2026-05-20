import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from '@/hooks/useTheme'
import type { MemberProfile } from '@/types'

export function PointsChart({ history }: { history: MemberProfile['pointsHistory'] }) {
  const { theme } = useTheme()
  const accent = theme === 'marvin-ridge' ? '#f19149' : '#f7a823'
  const data = history.map((h) => ({
    month: new Date(h.date).toLocaleDateString('en-US', { month: 'short' }),
    points: h.points,
  }))

  return (
    <div className="portal-chart-zone">
      <p className="portal-kicker">Performance</p>
      <h2 className="portal-section-title">Points over time</h2>
      <div className="mt-6 h-[min(300px,44vh)] w-full min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="brandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity={0.35} />
                <stop offset="100%" stopColor={accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: 'color-mix(in srgb, var(--surface-raised) 90%, transparent)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                boxShadow: 'none',
              }}
            />
            <Area
              type="monotone"
              dataKey="points"
              stroke={accent}
              fill="url(#brandGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
