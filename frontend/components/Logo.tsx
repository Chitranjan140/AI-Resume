'use client'

import { motion } from 'framer-motion'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export const Logo = ({ size = 'md', showText = true }: LogoProps) => {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-10 h-10', text: 'text-xl' },
    lg: { icon: 'w-16 h-16', text: 'text-3xl' }
  }

  return (
    <div className="flex items-center space-x-3">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`${sizes[size].icon} relative`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl"></div>
        <div className="absolute inset-0.5 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-600">
            <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            <circle cx="12" cy="14" r="2" fill="currentColor"/>
            <path fill="currentColor" d="M10,16H14V17H10V16M10,18H14V19H10V18Z"/>
          </svg>
        </div>
      </motion.div>
      
      {showText && (
        <div className={`font-bold ${sizes[size].text}`}>
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            ResumeAI
          </span>
        </div>
      )}
    </div>
  )
}