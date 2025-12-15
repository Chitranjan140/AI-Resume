'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Trash2, Eye, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import { Navbar } from '@/components/Navbar'
import toast from 'react-hot-toast'

interface Resume {
  id: string
  filename: string
  status: string
  overallScore?: number
  atsScore?: number
  uploadedAt: string
}

export default function ResumesPage() {
  const { user } = useAuth()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchResumes()
  }, [user])

  const fetchResumes = async () => {
    if (!user) return

    try {
      const response = await api.get('/resume/list')
      setResumes(response.data.resumes || [])
    } catch (error) {
      console.error('Failed to fetch resumes:', error)
      toast.error('Failed to load resumes')
    } finally {
      setLoading(false)
    }
  }

  const deleteResume = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return
    
    try {
      await api.delete(`/resume/${resumeId}`)
      setResumes(resumes.filter(resume => resume.id !== resumeId))
      toast.success('Resume deleted successfully')
    } catch (error) {
      console.error('Failed to delete resume:', error)
      toast.error('Failed to delete resume')
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

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-4 mb-4">
              <Link 
                href="/dashboard" 
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            <h1 className="text-3xl font-bold mb-2">My Resumes</h1>
            <p className="text-slate-600 dark:text-slate-300">
              Manage and view all your uploaded resumes
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Link 
              href="/analyze" 
              className="btn-primary inline-flex items-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>Upload New Resume</span>
            </Link>
          </motion.div>

          {resumes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No resumes uploaded yet</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Upload your first resume to get started with AI-powered analysis
              </p>
              <Link href="/analyze" className="btn-primary">
                Upload Resume
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {resumes.map((resume, index) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="glass-card p-6 hover:scale-105 transition-transform duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate" title={resume.filename}>
                          {resume.filename}
                        </h3>
                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(resume.uploadedAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 capitalize">
                          Status: {resume.status}
                        </div>
                      </div>
                    </div>
                  </div>

                  {resume.overallScore && (
                    <div className="mb-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Overall Score</span>
                        <span className="font-semibold">{resume.overallScore}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                          style={{ width: `${resume.overallScore}%` }}
                        ></div>
                      </div>
                      
                      {resume.atsScore && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span>ATS Score</span>
                            <span className="font-semibold">{resume.atsScore}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full" 
                              style={{ width: `${resume.atsScore}%` }}
                            ></div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {resume.status === 'analyzed' ? (
                      <Link
                        href={`/analyze?resumeId=${resume.id}`}
                        className="flex-1 btn-secondary text-center text-sm py-2"
                      >
                        <Eye className="w-4 h-4 inline mr-1" />
                        View Analysis
                      </Link>
                    ) : (
                      <Link
                        href={`/analyze?resumeId=${resume.id}`}
                        className="flex-1 btn-primary text-center text-sm py-2"
                      >
                        {resume.status === 'processing' ? 'Processing...' : 'Analyze'}
                      </Link>
                    )}
                    
                    <button
                      onClick={() => deleteResume(resume.id)}
                      className="btn-secondary p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}