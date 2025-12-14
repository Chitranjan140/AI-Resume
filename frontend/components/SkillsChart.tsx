'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Skill {
  name: string
  category: string
  count: number
  experience: number
}

interface SkillsChartProps {
  skills: Skill[]
}

export const SkillsChart = ({ skills }: SkillsChartProps) => {
  const chartData = skills.slice(0, 8).map(skill => ({
    name: skill.name.length > 12 ? skill.name.substring(0, 12) + '...' : skill.name,
    fullName: skill.name,
    count: skill.count,
    experience: skill.experience,
    category: skill.category
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="glass-card p-3 border border-white/20">
          <p className="font-medium">{data.fullName}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Category: {data.category}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Used in: {data.count} resume{data.count !== 1 ? 's' : ''}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Avg. Experience: {data.experience} years
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4">Top Skills</h3>
      {skills.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                stroke="rgba(148, 163, 184, 0.8)"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="rgba(148, 163, 184, 0.8)"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="url(#skillGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="skillGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
          <div className="text-center">
            <p className="text-lg mb-2">No skills data yet</p>
            <p className="text-sm">Upload and analyze a resume to see your skills</p>
          </div>
        </div>
      )}
    </div>
  )
}