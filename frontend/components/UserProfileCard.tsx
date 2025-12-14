'use client'

import { motion } from 'framer-motion'
import { User, Crown, Sparkles } from 'lucide-react'

interface UserProfileCardProps {
  userName: string
  userEmail: string
}

export const UserProfileCard = ({ userName, userEmail }: UserProfileCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl"
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Crown className="w-3 h-3 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-1">{userName}</h3>
          <p className="text-blue-200/80 text-sm">{userEmail}</p>
          <div className="flex items-center space-x-2 mt-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-yellow-400 font-medium">AI Premium User</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}