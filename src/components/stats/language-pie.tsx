'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface LanguagePieProps {
  data: { name: string; value: number }[]
}

const COLORS: Record<string, string> = {
  javascript: '#f7df1e',
  typescript: '#3178c6',
  react: '#61dafb',
  nextjs: '#a8a8a8',
}

export function LanguagePie({ data }: LanguagePieProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="bg-surface border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">Language Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex flex-col items-center">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name] ?? '#555'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#f0f0f0' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 -mt-2">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm" style={{ backgroundColor: COLORS[item.name] ?? '#555' }} />
                <span className="text-xs text-muted-foreground">
                  {item.name} ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
