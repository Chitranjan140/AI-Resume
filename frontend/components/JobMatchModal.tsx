'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Target, Loader, CheckCircle, AlertCircle } from 'lucide-react'
import { resumeAPI } from '@/lib/api'
import { JobMatch } from '@/types'
import toast from 'react-hot-toast'

interface JobMatchModalProps {
  resumeId: string
  onClose: () => void
}

export const JobMatchModal = ({ resumeId, onClose }: JobMatchModalProps) => {
  const [jobDescription, setJobDescription] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<JobMatch | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!jobDescription.trim() || jobDescription.length < 50) {
      toast.error('Job description must be at least 50 characters long')
      return
    }

    setLoading(true)
    
    try {
      const response = await resumeAPI.matchJob(resumeId, {
        jobDescription: jobDescription.trim(),
        jobTitle: jobTitle.trim() || 'Untitled Position',
        company: company.trim()
      })
      
      setResult(response.data.match)
      toast.success('Job match completed!')
    } catch (error: any) {
      console.error('Job match error:', error)
      toast.error(error.response?.data?.message || 'Failed to match job description')
    } finally {
      setLoading(false)
    }
  }

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getMatchGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600'
    if (score >= 60) return 'from-yellow-500 to-yellow-600'
    return 'from-red-500 to-red-600'
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative glass-card p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Target className="w-6 h-6 mr-2 text-blue-600" />
              Job Match Analysis
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!result ? (
            /* Job Description Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Job Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., Google"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Job Description *
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows={8}
                  placeholder="Paste the complete job description here..."
                  required
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {jobDescription.length}/50 characters minimum
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  disabled={loading || jobDescription.length < 50}
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4" />
                      <span>Analyze Match</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Match Results */
            <div className="space-y-6">
              {/* Match Score */}
              <div className="text-center glass-card p-6">
                <h3 className="text-lg font-semibold mb-4">Match Score</h3>
                <div className={`text-5xl font-bold mb-4 ${getMatchColor(result.matchScore)}`}>
                  {result.matchScore}%
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-4">
                  <div 
                    className={`bg-gradient-to-r ${getMatchGradient(result.matchScore)} h-4 rounded-full transition-all duration-1000`}
                    style={{ width: `${result.matchScore}%` }}
                  ></div>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  {result.jobTitle} {result.company && `at ${result.company}`}
                </p>
              </div>

              {/* Analysis Details */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="glass-card p-6">
                  <h4 className="font-semibold text-green-600 mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {result.analysis.strengths.map((strength, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div className="glass-card p-6">
                  <h4 className="font-semibold text-orange-600 mb-3 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-2">
                    {result.analysis.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing Skills */}
              {result.analysis.missingSkills.length > 0 && (
                <div className="glass-card p-6">
                  <h4 className="font-semibold text-red-600 mb-3">Missing Skills</h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {result.analysis.missingSkills.map((skill, index) => (
                      <div key={index} className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                        <div className="font-medium text-sm">{skill.skill}</div>
                        {skill.category && (
                          <div className="text-xs text-slate-600 dark:text-slate-300">{skill.category}</div>
                        )}
                        <div className={`text-xs mt-1 ${
                          skill.importance === 'High' ? 'text-red-600' :
                          skill.importance === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {skill.importance} Priority
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="glass-card p-6">
                <h4 className="font-semibold text-blue-600 mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {result.analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setResult(null)}
                  className="btn-secondary"
                >
                  New Analysis
                </button>
                <button
                  onClick={onClose}
                  className="btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}