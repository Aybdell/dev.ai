'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ScoreChartProps {
  data: { date: string; score: number }[]
}

export function ScoreChart({ data }: ScoreChartProps) {
  return (
    <Card className="bg-surface border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">Score Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#888' }}
                tickLine={false}
                axisLine={{ stroke: '#2a2a2a' }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#888' }}
                tickLine={false}
                axisLine={{ stroke: '#2a2a2a' }}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#f0f0f0' }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props
                  const color = payload.score >= 80 ? '#10b981' : payload.score >= 50 ? '#f59e0b' : '#ef4444'
                  return <circle cx={cx} cy={cy} r={4} fill={color} />
                }}
                activeDot={{ r: 6, fill: '#7c3aed' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
