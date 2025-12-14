'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600',
  red: 'from-red-500 to-red-600'
}

export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  subtitle, 
  trend 
}: StatsCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card p-6 hover:shadow-xl transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-bold mb-1">{value}</h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">{title}</p>
        {subtitle && (
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  )
}