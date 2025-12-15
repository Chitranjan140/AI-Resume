'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Target, TrendingUp, Plus, Eye } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { userAPI } from '@/lib/api'
import { Navbar } from '@/components/Navbar'
import { DashboardCard } from '@/components/DashboardCard'
import { SkillsChart } from '@/components/SkillsChart'
import { ActivityFeed } from '@/components/ActivityFeed'
import { Logo } from '@/components/Logo'
import { WaveBackground } from '@/components/WaveBackground'

import { DashboardStats } from '@/types'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user, userProfile, loading: authLoading } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('Dashboard: No user found, redirecting to login')
      setTimeout(() => router.replace('/auth/login'), 100)
    }
  }, [user, authLoading, router])

  useEffect(() => {
    // Only fetch dashboard data after auth has finished and we have a user
    if (!authLoading && user) {
      fetchDashboardData()
    }
  }, [authLoading, user])

  const fetchDashboardData = async () => {
    if (authLoading || !user) return

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

  // Show loading or redirect
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <WaveBackground />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-white">{authLoading ? 'Loading...' : 'Redirecting...'}</p>
          </div>
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
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <WaveBackground />
      
      {/* Ambient glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <Navbar />
      
      <div className="pt-20 px-4 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
                <Logo size="lg" />
              </div>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Welcome, {userProfile?.displayName || user?.displayName || 'User'}!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-slate-300 font-light"
            >
              Your AI-powered resume command center
            </motion.p>
          </motion.div>





          {/* AI Project Overview Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            <Link href="/resume-maker" className="group relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Resume Builder</h3>
                <p className="text-slate-300 text-sm">Create professional resumes with AI assistance</p>
              </div>
            </Link>

            <Link href="/analyze" className="group relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Skill Analyzer</h3>
                <p className="text-slate-300 text-sm">AI-powered skill assessment and recommendations</p>
              </div>
            </Link>

            <div className="group relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">ATS Score</h3>
                <p className="text-slate-300 text-sm">Optimize for Applicant Tracking Systems</p>
              </div>
            </div>

            <div className="group relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">AI Suggestions</h3>
                <p className="text-slate-300 text-sm">Smart recommendations for improvement</p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <DashboardCard
              title="Total Resumes"
              value={stats.totalResumes}
              icon={FileText}
              gradient="from-blue-500 to-cyan-500"
              delay={0.1}
              trend={{ value: 12, isPositive: true }}
            />
            <DashboardCard
              title="Average Score"
              value={`${stats.averageScore}%`}
              icon={TrendingUp}
              gradient="from-green-500 to-emerald-500"
              delay={0.2}
              trend={{ value: 8, isPositive: true }}
            />
            <DashboardCard
              title="ATS Score"
              value={`${stats.averageAtsScore}%`}
              icon={Target}
              gradient="from-purple-500 to-pink-500"
              delay={0.3}
              trend={{ value: 15, isPositive: true }}
            />
            <DashboardCard
              title="Job Matches"
              value={stats.totalMatches}
              icon={Target}
              gradient="from-orange-500 to-red-500"
              delay={0.4}
              trend={{ value: 23, isPositive: true }}
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
              <h3 className="text-lg font-semibold">Current Plan: Free</h3>
            </div>
            
            {true ? (
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