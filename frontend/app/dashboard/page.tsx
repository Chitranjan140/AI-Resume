'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Target, TrendingUp, Plus, Eye } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { userAPI } from '@/lib/api'
import { Navbar } from '@/components/Navbar'
import { StatsCard } from '@/components/StatsCard'
import { SkillsChart } from '@/components/SkillsChart'
import { ActivityFeed } from '@/components/ActivityFeed'
import { DashboardStats } from '@/types'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await userAPI.getDashboard()
      setDashboardData(response.data.dashboard)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  const stats = dashboardData?.stats || {
    totalResumes: 0,
    analyzedResumes: 0,
    totalMatches: 0,
    averageScore: 0,
    averageAtsScore: 0,
    averageMatchScore: 0,
    highMatches: 0
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.email?.split('@')[0]}!
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Here's your resume analysis overview
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-2 gap-4 mb-8"
          >
            <Link href="/analyze" className="glass-card p-6 hover:scale-105 transition-transform duration-200 group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Upload New Resume</h3>
                  <p className="text-slate-600 dark:text-slate-300">Get AI-powered analysis</p>
                </div>
              </div>
            </Link>

            <Link href="/resumes" className="glass-card p-6 hover:scale-105 transition-transform duration-200 group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">View All Resumes</h3>
                  <p className="text-slate-600 dark:text-slate-300">Manage your uploads</p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <StatsCard
              title="Total Resumes"
              value={stats.totalResumes}
              icon={FileText}
              color="blue"
              subtitle={`${stats.analyzedResumes} analyzed`}
            />
            <StatsCard
              title="Average Score"
              value={`${stats.averageScore}%`}
              icon={TrendingUp}
              color="green"
              subtitle="Resume quality"
            />
            <StatsCard
              title="ATS Score"
              value={`${stats.averageAtsScore}%`}
              icon={Target}
              color="purple"
              subtitle="ATS compatibility"
            />
            <StatsCard
              title="Job Matches"
              value={stats.totalMatches}
              icon={Target}
              color="orange"
              subtitle={`${stats.highMatches} high matches`}
            />
          </motion.div>

          {/* Charts and Activity */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Skills Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <SkillsChart skills={dashboardData?.topSkills || []} />
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ActivityFeed activities={dashboardData?.recentActivity || []} />
            </motion.div>
          </div>

          {/* Usage Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 glass-card p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Current Plan: {user?.subscription?.charAt(0).toUpperCase() + user?.subscription?.slice(1) || 'Free'}</h3>
              {user?.subscription === 'free' && (
                <Link href="/pricing" className="btn-primary text-sm">
                  Upgrade Plan
                </Link>
              )}
            </div>
            
            {user?.subscription === 'free' ? (
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Resumes Uploaded</span>
                    <span>{dashboardData?.usageStats?.resumesUploaded || 0}/3</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${((dashboardData?.usageStats?.resumesUploaded || 0) / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Analyses Performed</span>
                    <span>{dashboardData?.usageStats?.analysesPerformed || 0}/5</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${((dashboardData?.usageStats?.analysesPerformed || 0) / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Job Matches</span>
                    <span>{dashboardData?.usageStats?.jobMatches || 0}/10</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${((dashboardData?.usageStats?.jobMatches || 0) / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-green-600 font-semibold">✨ Unlimited Usage Available</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  Enjoy unlimited resume uploads, analyses, and job matches
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}