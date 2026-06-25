'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface IssueBarChartProps {
  data: { name: string; avg: number }[]
}

export function IssueBarChart({ data }: IssueBarChartProps) {
  return (
    <Card className="bg-surface border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">Issue Frequency (Avg per Review)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#888' }}
                tickLine={false}
                axisLine={{ stroke: '#2a2a2a' }}
              />
              <YAxis
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
              <Bar dataKey="avg" fill="#7c3aed" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
